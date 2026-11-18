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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * Lettura dei file ufficiali, senza dipendenze esterne:
 * <ul>
 *     <li>archivio storico dei comuni di ANPR (ANPR_archivio_comuni.csv), con date di istituzione e cessazione;</li>
 *     <li>elenco ISTAT delle unità territoriali estere (CSV, anche dentro uno ZIP).</li>
 * </ul>
 * Le colonne si riconoscono dall'intestazione (con alcune varianti di nome), il separatore (virgola o punto e
 * virgola) e la codifica (UTF-8 o Windows-1252) si ricavano dal contenuto.
 */
public final class TerritoriParser {

    /** Data di cessazione usata da ANPR per i comuni ancora in vigore. */
    private static final String MAI = "9999-12-31";

    private TerritoriParser() {
    }

    /* ------------------------------------------------------------------ */
    /* Comuni (ANPR)                                                         */
    /* ------------------------------------------------------------------ */

    public static List<Territori.Comune> comuni(byte[] content) throws IOException {
        final Table table = table(content);
        final int nome = table.column("DENOMINAZIONEIT", "DENOMINAZIONE", "DENOMINAZIONEINITALIANO", "NOMECOMUNE", "COMUNE");
        final int provincia = table.column("SIGLAPROVINCIA", "SIGLAAUTOMOBILISTICA", "PROVINCIA");
        final int istat = table.optionalColumn("CODISTAT", "CODICEISTAT", "CODICECOMUNEFORMATOALFANUMERICO", "PROCOM");
        final int catastale = table.optionalColumn("CODCATASTALE", "CODICECATASTALE", "CODICECATASTALEDELCOMUNE", "BELFIORE");
        final int istituzione = table.optionalColumn("DATAISTITUZIONE", "DATAINIZIOVALIDITA", "DATAINIZIO");
        final int cessazione = table.optionalColumn("DATACESSAZIONE", "DATAFINEVALIDITA", "DATAFINE");
        final int stato = table.optionalColumn("STATO");

        final Map<String, Territori.Comune> unique = new LinkedHashMap<>();
        for (String[] row : table.rows) {
            final String name = clean(value(row, nome));
            if (name.isEmpty()) {
                continue;
            }
            final Territori.Comune comune = new Territori.Comune();
            // ANPR scrive le denominazioni in maiuscolo: come nei dati già salvati, "Abano Terme"
            comune.nomeComune = name.equals(name.toUpperCase(Locale.ITALIAN)) ? titleCase(name) : name;
            comune.provincia = clean(value(row, provincia)).toUpperCase(Locale.ROOT);
            comune.codiceIstat = emptyToNull(clean(value(row, istat)));
            comune.codiceCatastale = emptyToNull(clean(value(row, catastale)).toUpperCase(Locale.ROOT));
            comune.dataIstituzione = date(value(row, istituzione));
            comune.dataCessazione = date(value(row, cessazione));
            if (MAI.equals(comune.dataCessazione)) {
                comune.dataCessazione = null;
            }
            // STATO = A (attivo) senza data di cessazione valida: in vigore
            if ("A".equalsIgnoreCase(clean(value(row, stato)))) {
                comune.dataCessazione = null;
            }
            // righe ripetute con gli stessi dati (es. variazioni di altri campi) contano una volta sola
            final String key = comune.nomeComune + "|" + comune.provincia + "|" + comune.codiceCatastale + "|" +
                    comune.dataIstituzione + "|" + comune.dataCessazione;
            unique.putIfAbsent(key, comune);
        }
        if (unique.isEmpty()) {
            throw new IOException("Nessun comune trovato nel file");
        }
        return new ArrayList<>(unique.values());
    }

    /* ------------------------------------------------------------------ */
    /* Stati esteri (ISTAT)                                                  */
    /* ------------------------------------------------------------------ */

    public static List<Territori.Stato> stati(byte[] content) throws IOException {
        final Table table = table(content);
        final int nome = table.column("DENOMINAZIONEIT", "DENOMINAZIONE", "DENOMINAZIONEITALIANA", "STATO", "NOME");
        final int nomeEn = table.optionalColumn("DENOMINAZIONEEN", "DENOMINAZIONEINGLESE", "DENOMINAZIONEENG");
        final int istat = table.optionalColumn("CODICEISTAT", "CODISTAT", "CODICESTATO");
        final int catastale = table.optionalColumn("CODICEAT", "CODICECATASTALE", "CODCATASTALE", "CODICEBELFIORE");
        final int iso2 = table.optionalColumn("CODICEISO3166ALPHA2", "ISO3166ALPHA2", "CODICEISOALPHA2", "ISO2");
        final int iso3 = table.optionalColumn("CODICEISO3166ALPHA3", "ISO3166ALPHA3", "CODICEISOALPHA3", "ISO3");
        final int continente = table.optionalColumn("DENOMINAZIONECONTINENTEIT", "DENOMINAZIONECONTINENTE", "CONTINENTE");
        final int tipo = table.optionalColumn("STATOSTERRITORIOT", "STATOTERRITORIO", "TIPO");

        final Map<String, Territori.Stato> unique = new LinkedHashMap<>();
        for (String[] row : table.rows) {
            final String name = clean(value(row, nome));
            if (name.isEmpty()) {
                continue;
            }
            final Territori.Stato stato = new Territori.Stato();
            stato.nome = name;
            stato.nomeEn = emptyToNull(clean(value(row, nomeEn)));
            stato.codiceIstat = emptyToNull(clean(value(row, istat)));
            stato.codiceCatastale = emptyToNull(clean(value(row, catastale)).toUpperCase(Locale.ROOT));
            stato.iso2 = emptyToNull(clean(value(row, iso2)).toUpperCase(Locale.ROOT));
            stato.iso3 = emptyToNull(clean(value(row, iso3)).toUpperCase(Locale.ROOT));
            stato.continente = emptyToNull(clean(value(row, continente)));
            stato.tipo = emptyToNull(clean(value(row, tipo)).toUpperCase(Locale.ROOT));
            unique.putIfAbsent(normalize(name), stato);
        }
        if (unique.isEmpty()) {
            throw new IOException("Nessuno stato trovato nel file");
        }
        final List<Territori.Stato> result = new ArrayList<>(unique.values());
        result.sort(Comparator.comparing(s -> normalize(s.nome)));
        return result;
    }

    /* ------------------------------------------------------------------ */
    /* Utilità                                                               */
    /* ------------------------------------------------------------------ */

    /** Testo per i confronti: minuscolo, senza accenti, apostrofi e spazi multipli. */
    public static String normalize(String value) {
        if (value == null) {
            return "";
        }
        final String noAccents = Normalizer.normalize(value, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return noAccents.toLowerCase(Locale.ITALIAN)
                .replaceAll("[’'`´]", " ")
                .replaceAll("[^a-z0-9]+", " ")
                .trim();
    }

    private static final Set<String> PARTICELLE = new HashSet<>(Arrays.asList(
            "di", "del", "dello", "della", "dei", "degli", "delle", "de", "d", "da", "dal", "dallo", "dalla", "dai",
            "in", "nel", "nello", "nella", "nei", "negli", "nelle", "nell", "e", "ed", "al", "allo", "alla", "ai", "agli", "alle", "all",
            "dagli", "dalle", "dall",
            "sul", "sullo", "sulla", "sull", "sui", "sugli", "sulle", "con", "a", "su", "per", "tra", "fra"));

    /** Maiuscole all'inizio delle parole (anche dopo apostrofo, trattino, barra), articoli e preposizioni in minuscolo. */
    static String titleCase(String upper) {
        final String lower = upper.toLowerCase(Locale.ITALIAN);
        final StringBuilder out = new StringBuilder(lower.length());
        int start = 0;
        boolean first = true;
        for (int i = 0; i <= lower.length(); i++) {
            final boolean boundary = i == lower.length() || " '’-/".indexOf(lower.charAt(i)) >= 0;
            if (!boundary) {
                continue;
            }
            final String word = lower.substring(start, i);
            if (!word.isEmpty()) {
                out.append(first || !PARTICELLE.contains(word) ? Character.toUpperCase(word.charAt(0)) + word.substring(1) : word);
                first = false;
            }
            if (i < lower.length()) {
                out.append(lower.charAt(i));
                // dopo la barra (denominazioni bilingui) si ricomincia come una nuova denominazione
                first = lower.charAt(i) == '/';
            }
            start = i + 1;
        }
        return out.toString();
    }

    private static final class Table {
        final String[] header;
        final List<String[]> rows;

        Table(String[] header, List<String[]> rows) {
            this.header = header;
            this.rows = rows;
        }

        int column(String... names) throws IOException {
            final int index = optionalColumn(names);
            if (index < 0) {
                throw new IOException("Colonna non trovata: " + names[0] + " (intestazione: " + Arrays.toString(header) + ")");
            }
            return index;
        }

        int optionalColumn(String... names) {
            for (String name : names) {
                for (int i = 0; i < header.length; i++) {
                    if (headerKey(header[i]).equals(name)) {
                        return i;
                    }
                }
            }
            return -1;
        }
    }

    private static Table table(byte[] content) throws IOException {
        final String text = decode(unzip(content));
        final List<String[]> records = csv(text, separator(text));
        // la riga di intestazione è la prima con almeno tre colonne non vuote (alcuni file hanno righe di titolo)
        int headerIndex = 0;
        while (headerIndex < records.size() && Arrays.stream(records.get(headerIndex)).filter(c -> !c.trim().isEmpty()).count() < 3) {
            headerIndex++;
        }
        if (headerIndex >= records.size()) {
            throw new IOException("File vuoto o non riconosciuto");
        }
        return new Table(records.get(headerIndex), records.subList(headerIndex + 1, records.size()));
    }

    /** Se il contenuto è uno ZIP, il primo file CSV (o di testo) contenuto. */
    private static byte[] unzip(byte[] content) throws IOException {
        if (content.length < 4 || content[0] != 'P' || content[1] != 'K') {
            return content;
        }
        byte[] fallback = null;
        try (ZipInputStream zip = new ZipInputStream(new ByteArrayInputStream(content))) {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                if (entry.isDirectory()) {
                    continue;
                }
                final String name = entry.getName().toLowerCase(Locale.ROOT);
                if (name.endsWith(".csv")) {
                    return read(zip);
                }
                if (fallback == null && name.endsWith(".txt")) {
                    fallback = read(zip);
                }
            }
        }
        if (fallback != null) {
            return fallback;
        }
        throw new IOException("Nessun file CSV nell'archivio ZIP");
    }

    private static byte[] read(InputStream stream) throws IOException {
        final ByteArrayOutputStream out = new ByteArrayOutputStream();
        final byte[] buffer = new byte[8192];
        int read;
        while ((read = stream.read(buffer)) != -1) {
            out.write(buffer, 0, read);
        }
        return out.toByteArray();
    }

    /** UTF-8 (con o senza BOM) se valido, altrimenti Windows-1252 (i CSV di ISTAT). */
    private static String decode(byte[] bytes) {
        int offset = 0;
        if (bytes.length >= 3 && (bytes[0] & 0xff) == 0xEF && (bytes[1] & 0xff) == 0xBB && (bytes[2] & 0xff) == 0xBF) {
            offset = 3;
        }
        final ByteBuffer buffer = ByteBuffer.wrap(bytes, offset, bytes.length - offset);
        try {
            return StandardCharsets.UTF_8.newDecoder()
                    .onMalformedInput(CodingErrorAction.REPORT)
                    .onUnmappableCharacter(CodingErrorAction.REPORT)
                    .decode(buffer).toString();
        } catch (CharacterCodingException e) {
            return new String(bytes, offset, bytes.length - offset, Charset.forName("windows-1252"));
        }
    }

    /** Separatore della prima riga significativa: punto e virgola o virgola (fuori dalle virgolette). */
    private static char separator(String text) {
        int semicolons = 0;
        int commas = 0;
        boolean quoted = false;
        for (int i = 0; i < text.length() && i < 4096; i++) {
            final char c = text.charAt(i);
            if (c == '"') {
                quoted = !quoted;
            } else if (!quoted && c == ';') {
                semicolons++;
            } else if (!quoted && c == ',') {
                commas++;
            } else if (!quoted && c == '\n' && (semicolons + commas) > 2) {
                break;
            }
        }
        return semicolons >= commas ? ';' : ',';
    }

    /** CSV secondo RFC 4180: campi tra virgolette con separatori, a capo e virgolette raddoppiate. */
    private static List<String[]> csv(String text, char separator) {
        final List<String[]> records = new ArrayList<>();
        final List<String> fields = new ArrayList<>();
        final StringBuilder field = new StringBuilder();
        boolean quoted = false;
        for (int i = 0; i < text.length(); i++) {
            final char c = text.charAt(i);
            if (quoted) {
                if (c == '"') {
                    if (i + 1 < text.length() && text.charAt(i + 1) == '"') {
                        field.append('"');
                        i++;
                    } else {
                        quoted = false;
                    }
                } else {
                    field.append(c);
                }
            } else if (c == '"') {
                quoted = true;
            } else if (c == separator) {
                fields.add(field.toString());
                field.setLength(0);
            } else if (c == '\n' || c == '\r') {
                if (c == '\r' && i + 1 < text.length() && text.charAt(i + 1) == '\n') {
                    i++;
                }
                fields.add(field.toString());
                field.setLength(0);
                if (!(fields.size() == 1 && fields.get(0).isEmpty())) {
                    records.add(fields.toArray(new String[0]));
                }
                fields.clear();
            } else {
                field.append(c);
            }
        }
        if (field.length() > 0 || !fields.isEmpty()) {
            fields.add(field.toString());
            records.add(fields.toArray(new String[0]));
        }
        return records;
    }

    private static String headerKey(String header) {
        return Normalizer.normalize(header, Normalizer.Form.NFD).replaceAll("\\p{M}", "")
                .toUpperCase(Locale.ROOT).replaceAll("[^A-Z0-9]", "");
    }

    private static String value(String[] row, int index) {
        return index >= 0 && index < row.length ? row[index] : "";
    }

    private static String clean(String value) {
        return value == null ? "" : value.replace('\u00a0', ' ').trim().replaceAll("\\s+", " ");
    }

    private static String emptyToNull(String value) {
        return value == null || value.isEmpty() ? null : value;
    }

    /** Data in yyyy-MM-dd da yyyy-MM-dd[...] o dd/MM/yyyy; null se assente. */
    private static String date(String value) {
        final String text = clean(value);
        if (text.length() >= 10 && text.charAt(4) == '-' && text.charAt(7) == '-') {
            return text.substring(0, 10);
        }
        if (text.length() >= 10 && text.charAt(2) == '/' && text.charAt(5) == '/') {
            return text.substring(6, 10) + "-" + text.substring(3, 5) + "-" + text.substring(0, 2);
        }
        return null;
    }
}
