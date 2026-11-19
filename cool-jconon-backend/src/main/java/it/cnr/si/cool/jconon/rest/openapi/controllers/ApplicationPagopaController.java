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

import com.google.gson.Gson;
import feign.FeignException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.pagopa.model.PAGOPAObjectType;
import it.cnr.si.cool.jconon.pagopa.model.PAGOPAPropertyIds;
import it.cnr.si.cool.jconon.pagopa.service.PAGOPAService;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.util.Utility;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Pagamento pagoPA dei diritti di segreteria di una domanda (ex print/download/paga_avviso_pagopa del legacy):
 * stato del pagamento, avviso di pagamento in PDF e pagamento online con ritorno alla pagina della domanda.
 */
@RestController
@RequestMapping(ApiRoutes.V1_APPLICATION)
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "pagoPA", description = "Pagamento dei diritti di segreteria")
public class ApplicationPagopaController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationPagopaController.class);

    @Autowired
    private CMISService cmisService;
    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private PAGOPAService pagopaService;

    @Operation(summary = "Stato del pagamento: abilitato nel bando, importo, numero avviso e stato della pendenza")
    @GetMapping("/{id}/pagopa")
    public ResponseEntity<Map<String, Object>> stato(HttpServletRequest req, @PathVariable String id) {
        final Folder application = application(req, id);
        final Folder call = application.getFolderParent();
        final Map<String, Object> result = new HashMap<>();
        result.put("abilitato", Optional.ofNullable(call.<Boolean>getPropertyValue(PAGOPAPropertyIds.CALL_PAGAMENTO_PAGOPA.value()))
                .orElse(Boolean.FALSE));
        result.put("importo", call.getPropertyValue(PAGOPAPropertyIds.CALL_IMPORTO_PAGAMENTO_PAGOPA.value()));
        if (hasPendenza(application)) {
            result.put("numeroAvviso", application.getPropertyValue(PAGOPAPropertyIds.APPLICATION_NUMERO_AVVISO_PAGOPA.value()));
            final Object protocollo = application.getPropertyValue(PAGOPAPropertyIds.APPLICATION_NUMERO_PROTOCOLLO_PAGOPA.value());
            if (protocollo != null) {
                try {
                    result.put("stato", pagopaService.getStatoPendenza(String.valueOf(protocollo)));
                } catch (Exception e) {
                    // GovPay non raggiungibile: lo stato resta sconosciuto, avviso e pagamento restano disponibili
                    LOGGER.warn("Stato pendenza pagoPA non disponibile per {}: {}", id, e.getMessage());
                }
            }
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Avviso di pagamento pagoPA in PDF (crea la pendenza al primo utilizzo)")
    @GetMapping("/{id}/pagopa/avviso")
    public ResponseEntity<byte[]> avviso(HttpServletRequest req, @PathVariable String id,
                                         @CookieValue(value = "__lang", required = false) String lang) throws Exception {
        final Folder application = application(req, id);
        final byte[] pdf = applicationService.printAvvisoPagopa(cmisService.getCurrentCMISSession(req), application.getId(),
                Utility.getContextURL(req), I18nService.getLocale(req, lang));
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename("Avviso pagoPA.pdf", StandardCharsets.UTF_8).build().toString())
                .body(pdf);
    }

    @Operation(summary = "Pagamento online: indirizzo del portale di pagamento, con ritorno alla pagina indicata")
    @GetMapping("/{id}/pagopa/paga")
    public ResponseEntity<Map<String, String>> paga(HttpServletRequest req, @PathVariable String id,
                                                    @RequestParam(value = "returnUrl", required = false) String returnUrl,
                                                    @CookieValue(value = "__lang", required = false) String lang) throws Exception {
        final Folder application = application(req, id);
        final String redirect = applicationService.pagaAvvisoPagopa(cmisService.getCurrentCMISSession(req), application.getId(),
                returnUrl(req, returnUrl), I18nService.getLocale(req, lang));
        return ResponseEntity.ok(Collections.singletonMap("redirect", redirect));
    }

    /* ------------------------------------------------------------------ */

    @ExceptionHandler(ClientMessageException.class)
    public ResponseEntity<Map<String, String>> handleClientMessage(ClientMessageException e) {
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
    }

    /** Errore di GovPay: descrizione e dettaglio restituiti dal servizio, come nel legacy. */
    @ExceptionHandler(FeignException.class)
    public ResponseEntity<Map<String, String>> handleGovpay(FeignException e) {
        final String message = e.responseBody()
                .map(buffer -> new String(buffer.array(), Charset.defaultCharset()))
                .map(body -> {
                    try {
                        final GovpayError error = new Gson().fromJson(body, GovpayError.class);
                        return error.descrizione + (error.dettaglio != null ? " - " + error.dettaglio : "");
                    } catch (RuntimeException parse) {
                        return body;
                    }
                })
                .orElse(e.getMessage());
        LOGGER.warn("pagoPA error: {}", message);
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Collections.singletonMap("message", message));
    }

    static class GovpayError {
        String descrizione;
        String dettaglio;
    }

    private Folder application(HttpServletRequest req, String id) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        if (id == null || !id.matches("[A-Za-z0-9:/;._\\-]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid id");
        }
        final Session session = cmisService.getCurrentCMISSession(req);
        final CmisObject object = session.getObject(id);
        if (!(object instanceof Folder)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return (Folder) object;
    }

    private static boolean hasPendenza(Folder application) {
        return Optional.ofNullable(application.<List<String>>getPropertyValue(PropertyIds.SECONDARY_OBJECT_TYPE_IDS))
                .map(aspects -> aspects.contains(PAGOPAObjectType.JCONON_APPLICATION_PAGOPA.value()))
                .orElse(Boolean.FALSE);
    }

    /**
     * Pagina a cui il portale pagoPA riporta l'utente: quella indicata dal frontend se è sullo stesso sito da cui
     * arriva la richiesta (Origin o Referer), altrimenti il Referer o l'indirizzo dell'applicazione.
     */
    private static String returnUrl(HttpServletRequest req, String requested) {
        final String origin = Optional.ofNullable(req.getHeader(HttpHeaders.ORIGIN))
                .orElseGet(() -> Optional.ofNullable(req.getHeader(HttpHeaders.REFERER)).map(ApplicationPagopaController::origin).orElse(null));
        if (requested != null && origin != null && origin.equals(origin(requested))) {
            return requested;
        }
        return Optional.ofNullable(req.getHeader(HttpHeaders.REFERER)).orElse(Utility.getContextURL(req));
    }

    private static String origin(String url) {
        try {
            final URI uri = URI.create(url);
            if (uri.getScheme() == null || uri.getHost() == null) {
                return null;
            }
            return uri.getScheme() + "://" + uri.getHost() + (uri.getPort() == -1 ? "" : ":" + uri.getPort());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
