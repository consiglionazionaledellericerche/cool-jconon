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

package it.cnr.si.cool.jconon.rest.openapi.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.si.cool.jconon.push.PushNotificationService;
import it.cnr.si.cool.jconon.push.PushSubscriptionRepository.PushEndpoint;
import it.cnr.si.cool.jconon.push.PushSubscriptionRepository.PushSettings;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Notifiche push della PWA: chiave pubblica VAPID, iscrizione dei dispositivi dell'utente e scelta degli
 * argomenti (nuovi bandi, scadenze, convocazioni, comunicazioni).
 */
@RestController
@RequestMapping(ApiRoutes.VERSION_1 + "/push")
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Notifiche push", description = "Iscrizione alle notifiche push della PWA")
public class PushController {

    @Autowired
    private CMISService cmisService;
    @Autowired
    private PushNotificationService pushNotificationService;

    @Operation(summary = "Configurazione: notifiche attive, chiave pubblica VAPID e argomenti disponibili")
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> config() {
        final Map<String, Object> result = new HashMap<>();
        result.put("enabled", pushNotificationService.isEnabled());
        result.put("publicKey", pushNotificationService.isEnabled() ? pushNotificationService.getPublicKey() : null);
        result.put("topics", PushNotificationService.TOPICS);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Argomenti scelti e dispositivi iscritti dell'utente")
    @GetMapping("/subscription")
    public ResponseEntity<Map<String, Object>> subscription(HttpServletRequest req) {
        return ResponseEntity.ok(view(pushNotificationService.settings(currentUser(req).getId())));
    }

    @Operation(summary = "Iscrive il dispositivo (PushSubscription del browser) e imposta gli argomenti")
    @PutMapping("/subscription")
    public ResponseEntity<Map<String, Object>> subscribe(HttpServletRequest req, @RequestBody SubscribeRequest request) {
        final CMISUser user = currentUser(req);
        if (request == null || request.subscription == null || request.subscription.endpoint == null
                || request.subscription.keys == null || request.subscription.keys.get("p256dh") == null
                || request.subscription.keys.get("auth") == null || !request.subscription.endpoint.startsWith("https://")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid subscription");
        }
        final PushEndpoint endpoint = new PushEndpoint();
        endpoint.endpoint = request.subscription.endpoint;
        endpoint.p256dh = request.subscription.keys.get("p256dh");
        endpoint.auth = request.subscription.keys.get("auth");
        endpoint.userAgent = Optional.ofNullable(req.getHeader(HttpHeaders.USER_AGENT))
                .map(s -> s.length() > 200 ? s.substring(0, 200) : s).orElse(null);
        return ResponseEntity.ok(view(pushNotificationService.subscribe(user.getId(), endpoint, request.topics)));
    }

    @Operation(summary = "Aggiorna gli argomenti scelti (valgono per tutti i dispositivi dell'utente)")
    @PutMapping("/topics")
    public ResponseEntity<Map<String, Object>> topics(HttpServletRequest req, @RequestBody List<String> topics) {
        return ResponseEntity.ok(view(pushNotificationService.updateTopics(currentUser(req).getId(),
                Optional.ofNullable(topics).orElse(Collections.emptyList()))));
    }

    @Operation(summary = "Cancella l'iscrizione del dispositivo indicato (o di tutti, senza endpoint)")
    @DeleteMapping("/subscription")
    public ResponseEntity<Map<String, Object>> unsubscribe(HttpServletRequest req,
                                                           @RequestParam(value = "endpoint", required = false) String endpoint) {
        return ResponseEntity.ok(view(pushNotificationService.unsubscribe(currentUser(req).getId(), endpoint)));
    }

    @Operation(summary = "Invia una notifica di prova ai dispositivi dell'utente")
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> test(HttpServletRequest req) {
        return ResponseEntity.ok(Collections.singletonMap("sent", (Object) pushNotificationService.test(currentUser(req).getId())));
    }

    /* ------------------------------------------------------------------ */

    /** Richiesta di iscrizione: PushSubscription.toJSON() del browser e argomenti scelti. */
    public static class SubscribeRequest {
        public BrowserSubscription subscription;
        public List<String> topics;
    }

    public static class BrowserSubscription {
        public String endpoint;
        public Long expirationTime;
        public Map<String, String> keys;
    }

    /** Vista senza le chiavi di cifratura dei dispositivi. */
    private static Map<String, Object> view(PushSettings settings) {
        final Map<String, Object> result = new HashMap<>();
        result.put("topics", settings.topics);
        result.put("devices", settings.subscriptions.stream().map(s -> {
            final Map<String, Object> device = new HashMap<>();
            device.put("endpoint", s.endpoint);
            device.put("userAgent", s.userAgent);
            device.put("created", s.created);
            return device;
        }).collect(Collectors.toList()));
        return result;
    }

    private CMISUser currentUser(HttpServletRequest req) {
        if (!pushNotificationService.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "push disabled");
        }
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return user;
    }
}
