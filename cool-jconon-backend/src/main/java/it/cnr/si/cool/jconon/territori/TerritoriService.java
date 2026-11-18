/*
 * Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.territori;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

/**
 * Comuni italiani e stati esteri dalle fonti ufficiali, al posto del servizio ANPR esterno e dei file statici
 * comuni.json / paesi.json:
 * <ul>
 *     <li>comuni: archivio storico ANPR, con i comuni soppressi e il periodo di validità;</li>
 *     <li>stati: elenco ISTAT delle unità territoriali estere.</li>
 * </ul>
 * I dati vengono scaricati periodicamente (timer) e salvati nel repository; se le fonti non rispondono resta
 * valida l'ultima versione scaricata e, al primo avvio, i file statici precedenti.
 */
@Service
public class TerritoriService {
    private static final Logger LOGGER = LoggerFactory.getLogger(TerritoriService.class);
    private static final int TIMEOUT_MILLIS = (int) TimeUnit.SECONDS.toMillis(60);
    private static final int MAX_DOWNLOAD = 50 * 1024 * 1024;
    /** Ogni nodo rilegge dal repository la versione salvata al più una volta al giorno. */
    private static final long RELOAD_MILLIS = TimeUnit.HOURS.toMillis(24);
    private static final long RETRY_MILLIS = TimeUnit.HOURS.toMillis(1);

    @Value("${territori.comuni.url:https://www.anagrafenazionale.interno.it/wp-content/uploads/ANPR_archivio_comuni.csv}")
    private String comuniUrl;
    @Value("${territori.stati.url:https://www.istat.it/it/files//2011/01/Elenco-codici-e-denominazioni-unita-territoriali-estere.zip}")
    private String statiUrl;
    /** Giorni dopo i quali i dati salvati vanno riscaricati (se il timer non l'ha già fatto). */
    @Value("${territori.aggiornamento.giorni:7}")
    private int maxAgeDays;

    @Autowired
    private TerritoriRepository repository;

    private volatile Territori.Archivio archivio;
    private volatile long loadedAt;
    private final AtomicBoolean refreshing = new AtomicBoolean(false);
    private volatile long lastAttempt;
    /** Lock separato: il download (anche minuti) non deve bloccare le ricerche. */
    private final Object refreshLock = new Object();

    /* ------------------------------------------------------------------ */
    /* Ricerca                                                               */
    /* ------------------------------------------------------------------ */

    /**
     * Comuni il cui nome (o codice catastale) corrisponde al filtro: prima la corrispondenza esatta, poi l'inizio
     * del nome, poi una parola, infine il contenuto; a parità prima quelli in vigore.
     *
     * @param data   se indicata (yyyy-MM-dd), solo i comuni validi in quella data (es. data di nascita)
     * @param attivi solo i comuni ancora in vigore
     */
    public List<Territori.Comune> comuni(String filter, String data, boolean attivi, int limit) {
        final String term = TerritoriParser.normalize(filter);
        if (term.isEmpty()) {
            return Collections.emptyList();
        }
        final String code = filter.trim().toUpperCase(Locale.ROOT);
        return archivio().comuni.stream()
                .filter(c -> !attivi || c.isAttivo())
                .filter(c -> data == null || data.isEmpty() || c.validoAl(data))
                .map(c -> new AbstractMap.SimpleEntry<>(c, rank(c, term, code)))
                .filter(e -> e.getValue() < Integer.MAX_VALUE)
                .sorted(Comparator.<AbstractMap.SimpleEntry<Territori.Comune, Integer>>comparingInt(AbstractMap.SimpleEntry::getValue)
                        .thenComparing(e -> e.getKey().isAttivo() ? 0 : 1)
                        .thenComparing(e -> TerritoriParser.normalize(e.getKey().nomeComune))
                        .thenComparing(e -> Optional.ofNullable(e.getKey().dataCessazione).orElse("9999"),
                                Comparator.reverseOrder()))
                .limit(limit > 0 ? limit : 50)
                .map(AbstractMap.SimpleEntry::getKey)
                .collect(Collectors.toList());
    }

    public List<Territori.Stato> stati(String filter) {
        final String term = TerritoriParser.normalize(filter);
        return archivio().stati.stream()
                .filter(s -> term.isEmpty() || TerritoriParser.normalize(s.nome).contains(term)
                        || TerritoriParser.normalize(s.nomeEn).contains(term)
                        || term.equalsIgnoreCase(s.iso2) || term.equalsIgnoreCase(s.iso3)
                        || term.equalsIgnoreCase(s.codiceCatastale))
                .collect(Collectors.toList());
    }

    /** Nomi degli stati (con l'Italia), nel formato del vecchio paesi.json. */
    public List<String> paesi() {
        final TreeMap<String, String> names = new TreeMap<>();
        names.put(TerritoriParser.normalize("Italia"), "Italia");
        archivio().stati.forEach(s -> names.putIfAbsent(TerritoriParser.normalize(s.nome), s.nome));
        return new ArrayList<>(names.values());
    }

    public Map<String, Object> info() {
        final Territori.Archivio current = archivio();
        final Map<String, Object> info = new LinkedHashMap<>();
        info.put("comuni", current.comuni.size());
        info.put("comuniAttivi", current.comuni.stream().filter(Territori.Comune::isAttivo).count());
        info.put("fonteComuni", current.fonteComuni);
        info.put("aggiornatoComuni", current.aggiornatoComuni);
        info.put("stati", current.stati.size());
        info.put("fonteStati", current.fonteStati);
        info.put("aggiornatoStati", current.aggiornatoStati);
        info.put("urlComuni", comuniUrl);
        info.put("urlStati", statiUrl);
        return info;
    }

    /* ------------------------------------------------------------------ */
    /* Aggiornamento                                                         */
    /* ------------------------------------------------------------------ */

    /**
     * Scarica e salva comuni e stati; una fonte che non risponde o non è leggibile lascia i dati precedenti.
     *
     * @return riepilogo con eventuali errori per fonte
     */
    public Map<String, Object> refresh() {
        synchronized (refreshLock) {
            return doRefresh();
        }
    }

    private Map<String, Object> doRefresh() {
        lastAttempt = System.currentTimeMillis();
        final Territori.Archivio current = copy(archivio());
        final Map<String, Object> result = new LinkedHashMap<>();
        boolean changed = false;
        try {
            final List<Territori.Comune> comuni = TerritoriParser.comuni(download(comuniUrl));
            if (comuni.size() < 1000) {
                throw new IOException("Elenco comuni troppo corto (" + comuni.size() + ")");
            }
            current.comuni = comuni;
            current.fonteComuni = comuniUrl;
            current.aggiornatoComuni = System.currentTimeMillis();
            changed = true;
            result.put("comuni", comuni.size());
        } catch (Exception e) {
            LOGGER.error("Territori: comuni non aggiornati da {}", comuniUrl, e);
            result.put("erroreComuni", e.getMessage());
        }
        try {
            final List<Territori.Stato> stati = TerritoriParser.stati(download(statiUrl));
            if (stati.size() < 100) {
                throw new IOException("Elenco stati troppo corto (" + stati.size() + ")");
            }
            current.stati = stati;
            current.fonteStati = statiUrl;
            current.aggiornatoStati = System.currentTimeMillis();
            changed = true;
            result.put("stati", stati.size());
        } catch (Exception e) {
            LOGGER.error("Territori: stati non aggiornati da {}", statiUrl, e);
            result.put("erroreStati", e.getMessage());
        }
        if (changed) {
            try {
                repository.save(current);
            } catch (Exception e) {
                LOGGER.error("Territori: salvataggio non riuscito", e);
                result.put("erroreSalvataggio", e.getMessage());
            }
            archivio = current;
            loadedAt = System.currentTimeMillis();
        }
        LOGGER.info("Territori aggiornati: {}", result);
        return result;
    }

    @Async("threadPoolTaskExecutor")
    public void refreshAsync() {
        try {
            refresh();
        } finally {
            refreshing.set(false);
        }
    }

    /** Dati in memoria; ricaricati dal repository ogni giorno, riscaricati se più vecchi di territori.aggiornamento.giorni. */
    private Territori.Archivio archivio() {
        Territori.Archivio current = archivio;
        if (current == null || System.currentTimeMillis() - loadedAt > RELOAD_MILLIS) {
            synchronized (this) {
                final Territori.Archivio previous = archivio;
                current = previous;
                if (previous == null || System.currentTimeMillis() - loadedAt > RELOAD_MILLIS) {
                    current = repository.load().orElseGet(() -> previous == null ? fallback() : previous);
                    complete(current);
                    archivio = current;
                    loadedAt = System.currentTimeMillis();
                }
            }
        }
        final long now = System.currentTimeMillis();
        final long oldest = Math.min(current.aggiornatoComuni, current.aggiornatoStati);
        // dati vecchi: nuovo tentativo al più una volta all'ora, anche se le fonti non rispondono
        if (now - oldest > TimeUnit.DAYS.toMillis(Math.max(1, maxAgeDays))
                && now - lastAttempt > RETRY_MILLIS && refreshing.compareAndSet(false, true)) {
            lastAttempt = now;
            // non blocca la richiesta: si risponde con i dati attuali
            selfRefreshAsync();
        }
        return current;
    }

    @Autowired
    private org.springframework.context.ApplicationContext applicationContext;

    /** Chiamata attraverso il proxy di Spring perché @Async abbia effetto. */
    private void selfRefreshAsync() {
        try {
            applicationContext.getBean(TerritoriService.class).refreshAsync();
        } catch (Exception e) {
            refreshing.set(false);
            LOGGER.warn("Territori: aggiornamento non avviato", e);
        }
    }

    /** Una parte mancante nel salvataggio (es. solo gli stati scaricati) si completa con i file statici. */
    private void complete(Territori.Archivio current) {
        if (current.comuni == null || current.comuni.isEmpty() || current.stati == null || current.stati.isEmpty()) {
            final Territori.Archivio fallback = fallback();
            if (current.comuni == null || current.comuni.isEmpty()) {
                current.comuni = fallback.comuni;
                current.fonteComuni = fallback.fonteComuni;
            }
            if (current.stati == null || current.stati.isEmpty()) {
                current.stati = fallback.stati;
                current.fonteStati = fallback.fonteStati;
            }
        }
    }

    /** Dati iniziali: i file statici usati finora (solo comuni in vigore e nomi degli stati, senza codici). */
    private Territori.Archivio fallback() {
        final Territori.Archivio fallback = new Territori.Archivio();
        final ObjectMapper mapper = new ObjectMapper();
        try {
            final Map<String, String> comuni = mapper.readValue(stripBom(resource("META-INF/json/comuni.json")),
                    new TypeReference<Map<String, String>>() {});
            comuni.forEach((nome, provincia) -> {
                final Territori.Comune comune = new Territori.Comune();
                comune.nomeComune = nome;
                comune.provincia = provincia;
                fallback.comuni.add(comune);
            });
            fallback.fonteComuni = "META-INF/json/comuni.json";
        } catch (Exception e) {
            LOGGER.warn("Territori: comuni.json non disponibile", e);
        }
        try {
            final List<String> paesi = mapper.readValue(stripBom(resource("META-INF/json/paesi.json")),
                    new TypeReference<List<String>>() {});
            paesi.stream().filter(p -> !"Italia".equalsIgnoreCase(p)).distinct().forEach(nome -> {
                final Territori.Stato stato = new Territori.Stato();
                stato.nome = nome;
                fallback.stati.add(stato);
            });
            fallback.fonteStati = "META-INF/json/paesi.json";
        } catch (Exception e) {
            LOGGER.warn("Territori: paesi.json non disponibile", e);
        }
        return fallback;
    }

    /* ------------------------------------------------------------------ */

    /** 0 nome uguale, 1 inizia con, 2 una parola inizia con, 3 contiene, 0 codice catastale uguale. */
    private static int rank(Territori.Comune comune, String term, String code) {
        if (code.equals(comune.codiceCatastale)) {
            return 0;
        }
        final String name = TerritoriParser.normalize(comune.nomeComune);
        if (name.equals(term)) {
            return 0;
        }
        if (name.startsWith(term)) {
            return 1;
        }
        if ((" " + name).contains(" " + term)) {
            return 2;
        }
        return name.contains(term) ? 3 : Integer.MAX_VALUE;
    }

    private static Territori.Archivio copy(Territori.Archivio source) {
        final Territori.Archivio copy = new Territori.Archivio();
        copy.comuni = source.comuni;
        copy.stati = source.stati;
        copy.fonteComuni = source.fonteComuni;
        copy.fonteStati = source.fonteStati;
        copy.aggiornatoComuni = source.aggiornatoComuni;
        copy.aggiornatoStati = source.aggiornatoStati;
        return copy;
    }

    /** Download con redirect (anche da http a https), timeout e limite di dimensione. */
    static byte[] download(String address) throws IOException {
        String current = address;
        for (int redirects = 0; redirects < 5; redirects++) {
            final HttpURLConnection connection = (HttpURLConnection) new URL(current).openConnection();
            connection.setConnectTimeout(TIMEOUT_MILLIS);
            connection.setReadTimeout(TIMEOUT_MILLIS);
            connection.setInstanceFollowRedirects(false);
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (compatible; cool-jconon territori)");
            connection.setRequestProperty("Accept", "text/csv,application/zip,application/octet-stream,*/*");
            final int status = connection.getResponseCode();
            if (status >= 300 && status < 400 && connection.getHeaderField("Location") != null) {
                current = new URL(new URL(current), connection.getHeaderField("Location")).toString();
                connection.disconnect();
                continue;
            }
            if (status != HttpURLConnection.HTTP_OK) {
                connection.disconnect();
                throw new IOException("HTTP " + status + " da " + current);
            }
            try (InputStream stream = connection.getInputStream()) {
                final ByteArrayOutputStream out = new ByteArrayOutputStream();
                final byte[] buffer = new byte[16384];
                int read;
                while ((read = stream.read(buffer)) != -1) {
                    out.write(buffer, 0, read);
                    if (out.size() > MAX_DOWNLOAD) {
                        throw new IOException("File troppo grande da " + current);
                    }
                }
                return out.toByteArray();
            } finally {
                connection.disconnect();
            }
        }
        throw new IOException("Troppi redirect da " + address);
    }

    private static byte[] resource(String path) throws IOException {
        try (InputStream stream = TerritoriService.class.getClassLoader().getResourceAsStream(path)) {
            if (stream == null) {
                throw new IOException("Risorsa non trovata: " + path);
            }
            final ByteArrayOutputStream out = new ByteArrayOutputStream();
            final byte[] buffer = new byte[16384];
            int read;
            while ((read = stream.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
            return out.toByteArray();
        }
    }

    private static byte[] stripBom(byte[] bytes) {
        if (bytes.length >= 3 && (bytes[0] & 0xff) == 0xEF && (bytes[1] & 0xff) == 0xBB && (bytes[2] & 0xff) == 0xBF) {
            return Arrays.copyOfRange(bytes, 3, bytes.length);
        }
        return bytes;
    }
}
