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

package it.cnr.si.cool.jconon.push;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.si.cool.jconon.push.PushSubscriptionRepository.PushEndpoint;
import it.cnr.si.cool.jconon.push.PushSubscriptionRepository.PushSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Notifiche push della PWA di selezioni-online: nuovi bandi, scadenze delle domande in bozza
 * (insieme alle email di sollecito),
 * convocazioni e comunicazioni. Gli utenti scelgono gli argomenti; i dispositivi le cui iscrizioni
 * risultano scadute vengono rimossi al primo invio fallito.
 */
@Service
public class PushNotificationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PushNotificationService.class);

    public static final String TOPIC_CALLS = "calls";
    public static final String TOPIC_DEADLINES = "deadlines";
    public static final String TOPIC_CONVOCATIONS = "convocations";
    public static final String TOPIC_COMMUNICATIONS = "communications";
    public static final List<String> TOPICS = Collections.unmodifiableList(
            Arrays.asList(TOPIC_CALLS, TOPIC_DEADLINES, TOPIC_CONVOCATIONS, TOPIC_COMMUNICATIONS));

    private static final int TTL_SECONDS = 24 * 60 * 60;
    private static final int MAX_BODY = 160;

    @Value("${push.enabled:true}")
    private boolean enabled;
    @Value("${push.vapid.public-key:}")
    private String configuredPublicKey;
    @Value("${push.vapid.private-key:}")
    private String configuredPrivateKey;
    @Value("${push.vapid.subject:https://selezionionline.cnr.it}")
    private String subject;

    @Autowired
    private PushSubscriptionRepository repository;
    @Autowired
    private UserService userService;

    private final ObjectMapper mapper = new ObjectMapper();
    private volatile WebPushSender sender;

    public boolean isEnabled() {
        return enabled;
    }

    public String getPublicKey() {
        return sender().getPublicKey();
    }

    /* ------------------------------------------------------------------ */
    /* Iscrizioni                                                            */
    /* ------------------------------------------------------------------ */

    public PushSettings settings(String userId) {
        return repository.find(userId).orElseGet(() -> {
            final PushSettings settings = new PushSettings();
            settings.userId = userId;
            settings.topics = new ArrayList<>(TOPICS);
            return settings;
        });
    }

    /** Iscrive (o aggiorna) il dispositivo dell'utente e imposta gli argomenti scelti. */
    public PushSettings subscribe(String userId, PushEndpoint endpoint, List<String> topics) {
        final PushSettings settings = settings(userId);
        settings.userId = userId;
        settings.subscriptions.removeIf(s -> s.endpoint.equals(endpoint.endpoint));
        endpoint.created = System.currentTimeMillis();
        settings.subscriptions.add(endpoint);
        if (topics != null) {
            settings.topics = validTopics(topics);
        }
        repository.save(settings);
        return settings;
    }

    public PushSettings updateTopics(String userId, List<String> topics) {
        final PushSettings settings = settings(userId);
        settings.topics = validTopics(topics);
        repository.save(settings);
        return settings;
    }

    public PushSettings unsubscribe(String userId, String endpoint) {
        final PushSettings settings = settings(userId);
        settings.subscriptions.removeIf(s -> endpoint == null || s.endpoint.equals(endpoint));
        repository.save(settings);
        return settings;
    }

    /* ------------------------------------------------------------------ */
    /* Notifiche                                                             */
    /* ------------------------------------------------------------------ */

    /** Notifica di prova a tutti i dispositivi dell'utente, indipendentemente dagli argomenti. */
    public int test(String userId) {
        return repository.find(userId)
                .map(settings -> deliver(settings, payload("Selezioni online CNR",
                        "Le notifiche sono attive su questo dispositivo.", "/", "test")))
                .orElse(0);
    }

    /** Nuovo bando pubblicato: a tutti gli iscritti all'argomento che possono presentare domanda. */
    @Async("threadPoolTaskExecutor")
    public void notifyNewCall(String codice, String profilo, String descrizione, Calendar scadenza, String groupCanSubmit) {
        if (!enabled) {
            return;
        }
        try {
            final String body = Optional.ofNullable(profilo).filter(s -> !s.trim().isEmpty())
                    .orElse(Optional.ofNullable(descrizione).map(PushNotificationService::plain).orElse(""));
            final String text = truncate(body) + (scadenza != null ? " — scadenza " + format(scadenza) : "");
            final Map<String, Object> payload = payload("Nuovo bando " + codice, text,
                    "/call-detail?callCode=" + encode(codice), "call-" + codice);
            int sent = 0;
            for (PushSettings settings : repository.findAll()) {
                if (settings.topics.contains(TOPIC_CALLS) && canSubmit(settings.userId, groupCanSubmit)) {
                    sent += deliver(settings, payload);
                }
            }
            LOGGER.info("Push new call {} sent to {} devices", codice, sent);
        } catch (Exception e) {
            LOGGER.error("Push new call {} failed", codice, e);
        }
    }

    @Async("threadPoolTaskExecutor")
    public void notifyConvocation(String userId, String codiceBando) {
        notifyUser(userId, TOPIC_CONVOCATIONS, "Convocazione — bando " + codiceBando,
                "È disponibile una convocazione relativa alla tua domanda. Controlla anche la posta elettronica.",
                "/my-applications", "convocation-" + codiceBando);
    }

    @Async("threadPoolTaskExecutor")
    public void notifyCommunication(String userId, String codiceBando) {
        notifyUser(userId, TOPIC_COMMUNICATIONS, "Comunicazione — bando " + codiceBando,
                "È disponibile una comunicazione relativa alla tua domanda. Controlla anche la posta elettronica.",
                "/my-applications", "communication-" + codiceBando);
    }

    /**
     * Promemoria della domanda ancora in bozza, inviato insieme all'email di sollecito
     * (CallService.sollecitaApplication, timer.cron.notification con attiva.mail.solleciti).
     */
    @Async("threadPoolTaskExecutor")
    public void notifyDeadline(String userId, String codiceBando, Calendar scadenza) {
        if (scadenza == null) {
            return;
        }
        final long days = ChronoUnit.DAYS.between(LocalDate.now(), scadenza.toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        final String when = days <= 0 ? "oggi alle " + new SimpleDateFormat("HH:mm").format(scadenza.getTime()) :
                (days == 1 ? "domani, " : "tra " + days + " giorni, ") + format(scadenza);
        notifyUser(userId, TOPIC_DEADLINES, "Domanda in bozza — bando " + codiceBando,
                "Il termine per inviare la domanda scade " + when + ". Ricordati di completarla e inviarla.",
                "/my-applications", "deadline-" + codiceBando);
    }

    /* ------------------------------------------------------------------ */

    private void notifyUser(String userId, String topic, String title, String body, String url, String tag) {
        if (!enabled || userId == null) {
            return;
        }
        try {
            repository.find(userId)
                    .filter(settings -> settings.topics.contains(topic))
                    .ifPresent(settings -> deliver(settings, payload(title, body, url, tag)));
        } catch (Exception e) {
            LOGGER.error("Push {} to {} failed", topic, userId, e);
        }
    }

    /** Invia a tutti i dispositivi dell'utente; rimuove quelli con l'iscrizione scaduta. */
    private int deliver(PushSettings settings, Map<String, Object> payload) {
        final byte[] content;
        try {
            content = mapper.writeValueAsString(payload).getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
        int sent = 0;
        boolean changed = false;
        for (PushEndpoint endpoint : new ArrayList<>(settings.subscriptions)) {
            try {
                final WebPushSender.Result result = sender().send(endpoint.endpoint, endpoint.p256dh, endpoint.auth, content, TTL_SECONDS);
                if (result == WebPushSender.Result.SENT) {
                    sent++;
                } else if (result == WebPushSender.Result.EXPIRED) {
                    settings.subscriptions.remove(endpoint);
                    changed = true;
                }
            } catch (Exception e) {
                LOGGER.warn("Push to {} failed: {}", settings.userId, e.getMessage());
            }
        }
        if (changed) {
            repository.save(settings);
        }
        return sent;
    }

    /**
     * Contenuto nel formato del service worker di Angular: la notifica e, al clic, l'apertura della pagina
     * (o il passaggio alla finestra dell'app già aperta).
     */
    private static Map<String, Object> payload(String title, String body, String url, String tag) {
        final Map<String, Object> action = new HashMap<>();
        action.put("operation", "navigateLastFocusedOrOpen");
        action.put("url", url);
        final Map<String, Object> data = new HashMap<>();
        data.put("url", url);
        data.put("onActionClick", Collections.singletonMap("default", action));
        final Map<String, Object> notification = new HashMap<>();
        notification.put("title", title);
        notification.put("body", body);
        notification.put("icon", "/icons/icon-192x192.png");
        // badge: solo la sagoma (trasparente) perché Android lo mostra monocromatico nella barra di stato
        notification.put("badge", "/icons/badge-96x96.png");
        notification.put("lang", "it");
        notification.put("tag", tag);
        notification.put("data", data);
        return Collections.singletonMap("notification", notification);
    }

    private boolean canSubmit(String userId, String groupCanSubmit) {
        if (groupCanSubmit == null || groupCanSubmit.isEmpty()) {
            return true;
        }
        try {
            final CMISUser user = userService.loadUserForConfirm(userId);
            return user.isAdmin() || user.getGroupsArray().contains(groupCanSubmit);
        } catch (Exception e) {
            return false;
        }
    }

    private WebPushSender sender() {
        if (sender == null) {
            synchronized (this) {
                if (sender == null) {
                    try {
                        if (!configuredPublicKey.isEmpty() && !configuredPrivateKey.isEmpty()) {
                            sender = new WebPushSender(configuredPublicKey, configuredPrivateKey, subject);
                        } else {
                            final PushSubscriptionRepository.VapidKeys keys = repository.vapidKeys();
                            sender = new WebPushSender(keys.publicKey, keys.privateKey, subject);
                        }
                    } catch (java.security.GeneralSecurityException e) {
                        throw new IllegalStateException("Invalid VAPID keys", e);
                    }
                }
            }
        }
        return sender;
    }

    private static List<String> validTopics(List<String> topics) {
        return topics.stream().filter(TOPICS::contains).distinct().collect(Collectors.toList());
    }

    private static String format(Calendar calendar) {
        return new SimpleDateFormat("dd/MM/yyyy 'alle' HH:mm", Locale.ITALIAN).format(calendar.getTime());
    }

    private static String plain(String html) {
        return html.replaceAll("<[^>]+>", " ").replaceAll("&nbsp;", " ").replaceAll("\\s+", " ").trim();
    }

    private static String truncate(String text) {
        return text.length() <= MAX_BODY ? text : text.substring(0, MAX_BODY - 1).trim() + "…";
    }

    private static String encode(String value) {
        try {
            return java.net.URLEncoder.encode(value, "UTF-8").replace("+", "%20");
        } catch (java.io.UnsupportedEncodingException e) {
            return value;
        }
    }
}
