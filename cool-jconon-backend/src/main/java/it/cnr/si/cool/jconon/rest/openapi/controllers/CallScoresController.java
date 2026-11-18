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
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.Utility;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.io.InputStream;
import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Punteggi e graduatoria delle domande di un bando (ex pagina carica-punteggi del frontend legacy con
 * /rest/manage-application/punteggi, /rest/call/graduatoria, /rest/call/applications-punteggi.xls e
 * /rest/call/aggiorna-protocollo-domande) e aggiunta di un allegato alle domande (ex /rest/call/aggiungi-allegato).
 */
@RestController
@RequestMapping(ApiRoutes.V1_CALL)
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Punteggi del bando", description = "Punteggi, graduatoria e allegati alle domande di un bando")
public class CallScoresController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CallScoresController.class);

    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;
    @Autowired
    private ApplicationService applicationService;

    @Operation(summary = "Aggiorna i punteggi di piu' domande del bando (solo quelle con valori cambiati)")
    @PostMapping("/{id}/scores")
    public ResponseEntity<Map<String, Object>> saveScores(HttpServletRequest req, @PathVariable String id,
                                                          @RequestBody List<Map<String, Object>> rows) {
        final CMISUser user = checkManager(req, id);
        final JSONArray array = new JSONArray();
        Optional.ofNullable(rows).orElse(Collections.emptyList()).forEach(row -> array.put(new JSONObject(row)));
        final int modified = applicationService.punteggi(cmisService.getCurrentCMISSession(req), user.getId(), id, array);
        return ResponseEntity.ok(Collections.singletonMap("righe", (Object) modified));
    }

    @Operation(summary = "Calcola la graduatoria delle domande attive del bando (RdP e amministratori)")
    @PostMapping("/{id}/scores/ranking")
    public ResponseEntity<Map<String, Object>> ranking(HttpServletRequest req, @PathVariable String id) {
        final CMISUser user = checkManager(req, id);
        callService.graduatoria(cmisService.getCurrentCMISSession(req), id, req.getLocale(), Utility.getContextURL(req), user);
        return ResponseEntity.ok(Collections.singletonMap("status", (Object) Boolean.TRUE));
    }

    @Operation(summary = "Sblocca la graduatoria per consentire di nuovo la modifica dei punteggi (ADMIN e CONCORSI)")
    @PostMapping("/{id}/scores/unlock")
    public ResponseEntity<Map<String, Object>> unlock(HttpServletRequest req, @PathVariable String id) {
        final CMISUser user = currentUser(req);
        if (!user.isAdmin() && !callService.isMemberOfConcorsiGroup(user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        final Folder call = loadCall(req, id);
        final Map<String, Serializable> properties = new HashMap<>();
        properties.put(JCONONPropertyIds.CALL_GRADUATORIA.value(), Boolean.FALSE);
        cmisService.createAdminSession().getObject(call).updateProperties(properties);
        return ResponseEntity.ok(Collections.singletonMap("graduatoria", (Object) Boolean.FALSE));
    }

    @Operation(summary = "Riporta sulle domande numero e data di protocollo della graduatoria e dello scorrimento")
    @PostMapping("/{id}/scores/protocol")
    public ResponseEntity<Map<String, String>> protocol(HttpServletRequest req, @PathVariable String id) {
        final CMISUser user = checkManager(req, id);
        return ResponseEntity.ok(callService.aggiornaProtocolloDomande(cmisService.getCurrentCMISSession(req), id,
                req.getLocale(), Utility.getContextURL(req), user));
    }

    @Operation(summary = "Punteggi delle domande in formato Excel (modificabile e reimportabile)")
    @GetMapping("/{id}/scores.xls")
    public ResponseEntity<byte[]> exportScores(HttpServletRequest req, @PathVariable String id) throws Exception {
        final CMISUser user = checkManager(req, id);
        final Session session = cmisService.getCurrentCMISSession(req);
        final Map<String, Object> model = callService.extractionApplicationForPunteggi(session, id, Utility.getContextURL(req), user.getId());
        final String fileName = "punteggi-" + Optional.ofNullable(model.get("nameBando")).map(String::valueOf).orElse("bando") + ".xls";
        return download(session, String.valueOf(model.get("objectId")), fileName, "application/vnd.ms-excel");
    }

    @Operation(summary = "Punteggi delle domande in formato Excel, elaborazione asincrona con link inviato per email")
    @PostMapping("/{id}/scores/export-async")
    public ResponseEntity<Map<String, Object>> exportScoresAsync(HttpServletRequest req, @PathVariable String id) throws Exception {
        final CMISUser user = checkManager(req, id);
        callService.extractionApplicationForPunteggiAsync(cmisService.getCurrentCMISSession(req), id, Utility.getContextURL(req), user.getId());
        return ResponseEntity.ok(Collections.singletonMap("email", (Object) user.getEmail()));
    }

    @Operation(summary = "Importa i punteggi dal file Excel estratto in precedenza (RdP e amministratori)")
    @PostMapping(value = "/{id}/scores.xls", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> importScores(HttpServletRequest req, @PathVariable String id,
                                                            @RequestPart("xls") MultipartFile xls) throws Exception {
        final CMISUser user = checkManager(req, id);
        return ResponseEntity.ok(callService.importApplicationForPunteggi(cmisService.getCurrentCMISSession(req), id, xls, user));
    }

    @Operation(summary = "Aggiunge lo stesso allegato alle domande del bando selezionate o filtrate",
            description = "status: P, C, tutte, attive, escluse; se applications e' vuoto il file va su tutte le domande filtrate")
    @PostMapping(value = "/{id}/application-attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> addAttachment(HttpServletRequest req, @PathVariable String id,
                                                             @RequestPart("file") MultipartFile file,
                                                             @RequestParam(value = "applications", required = false) List<String> applications,
                                                             @RequestParam(value = "status", defaultValue = "attive") String status,
                                                             @RequestParam(value = "totalFrom", required = false) Integer totalFrom,
                                                             @RequestParam(value = "totalTo", required = false) Integer totalTo) throws Exception {
        final CMISUser user = currentUser(req);
        final Folder call = loadCall(req, id);
        if (!user.isAdmin() && !callService.isMemberOfConcorsiGroup(user) && !callService.isMemberOfRDPGroup(user, call)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        final Long count = callService.aggiungiAllegati(cmisService.getCurrentCMISSession(req), cmisService.getCurrentBindingSession(req),
                id, applications, status, totalFrom, totalTo, file);
        return ResponseEntity.ok(Collections.singletonMap("numAllegati", (Object) count));
    }

    /* ------------------------------------------------------------------ */

    @ExceptionHandler(ClientMessageException.class)
    public ResponseEntity<Map<String, String>> handleClientMessage(ClientMessageException e) {
        LOGGER.warn("Call scores error: {}", e.getMessage());
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
    }

    private ResponseEntity<byte[]> download(Session session, String objectId, String fileName, String mimeType) throws Exception {
        final CmisObject object = session.getObject(objectId);
        if (!(object instanceof Document)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        final Document document = (Document) object;
        final byte[] content;
        final ContentStream stream = document.getContentStream();
        try (InputStream inputStream = stream.getStream()) {
            content = IOUtils.toByteArray(inputStream);
        }
        try {
            document.delete(true);
        } catch (RuntimeException e) {
            LOGGER.warn("Unable to delete temporary export {}", objectId, e);
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename(fileName, StandardCharsets.UTF_8).build().toString())
                .body(content);
    }

    private CMISUser currentUser(HttpServletRequest req) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    private Folder loadCall(HttpServletRequest req, String callId) {
        if (callId == null || !callId.matches("[A-Za-z0-9:/;._\\-]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid id");
        }
        final CmisObject object = cmisService.getCurrentCMISSession(req).getObject(callId);
        if (!(object instanceof Folder)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return (Folder) object;
    }

    /** Amministratori, gruppo CONCORSI, RdP e commissari del bando (come nel frontend legacy). */
    private CMISUser checkManager(HttpServletRequest req, String callId) {
        final CMISUser user = currentUser(req);
        final Folder call = loadCall(req, callId);
        if (!user.isAdmin() && !callService.isMemberOfConcorsiGroup(user) && !callService.isMemberOfRDPGroup(user, call)
                && !callService.isMemberOfCommissioneGroup(user, call)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return user;
    }
}
