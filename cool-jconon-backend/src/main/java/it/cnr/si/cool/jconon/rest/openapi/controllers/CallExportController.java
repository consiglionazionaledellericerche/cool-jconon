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
import it.cnr.si.cool.jconon.rest.openapi.model.CallParamsDTO;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.application.ExportApplicationsService;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.Utility;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
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
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Esportazioni delle domande di un bando (ex /rest/call/applications-single-call.xls e /rest/exportApplications):
 * la query viene costruita qui, limitata al bando, e il file viene restituito direttamente
 * (il documento temporaneo creato dal servizio viene poi eliminato).
 */
@RestController
@RequestMapping(ApiRoutes.V1_CALL)
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Esportazioni del bando", description = "Estrazione delle domande in Excel e in archivio zip")
public class CallExportController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CallExportController.class);

    public enum Status {
        all, sent, temporary, active
    }

    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;
    @Autowired
    private ExportApplicationsService exportApplicationsService;

    @Operation(summary = "Domande del bando in formato Excel")
    @GetMapping("/{id}/export/applications.xls")
    public ResponseEntity<byte[]> applicationsXls(HttpServletRequest req,
                                                  @PathVariable String id,
                                                  @RequestParam(value = "status", defaultValue = "sent") Status status) throws Exception {
        final CMISUser user = checkManager(req, id);
        final Session session = cmisService.getCurrentCMISSession(req);
        final StringBuilder query = new StringBuilder("SELECT cmis:objectId FROM jconon_application:folder WHERE IN_FOLDER('")
                .append(safeId(id)).append("')");
        switch (status) {
            case sent:
                query.append(" AND jconon_application:stato_domanda = 'C'");
                break;
            case temporary:
                query.append(" AND jconon_application:stato_domanda = 'P'");
                break;
            case active:
                query.append(" AND jconon_application:stato_domanda = 'C' AND jconon_application:esclusione_rinuncia IS NULL");
                break;
            default:
                break;
        }
        final Map<String, Object> model = callService.extractionApplicationForSingleCall(session, query.toString(),
                Utility.getContextURL(req), user.getId());
        final String fileName = Optional.ofNullable(model.get("nameBando")).map(String::valueOf).orElse("domande") + ".xls";
        return download(session, String.valueOf(model.get("objectId")), fileName, "application/vnd.ms-excel");
    }

    @Operation(summary = "Domande del bando (con eventuali allegati) in un archivio zip")
    @PostMapping("/{id}/export/applications.zip")
    public ResponseEntity<byte[]> applicationsZip(HttpServletRequest req,
                                                  @PathVariable String id,
                                                  @RequestParam(value = "all", defaultValue = "false") boolean all,
                                                  @RequestParam(value = "active", defaultValue = "false") boolean active,
                                                  @RequestParam(value = "types", required = false) List<String> types,
                                                  @RequestParam(value = "applications", required = false) List<String> applications) throws Exception {
        final CMISUser user = checkManager(req, id);
        final Session session = cmisService.getCurrentCMISSession(req);
        final Map<String, String> model = exportApplicationsService.exportApplications(session, cmisService.getCurrentBindingSession(req),
                safeId(id), user, all, active,
                new JSONArray(Optional.ofNullable(types).orElse(Collections.emptyList())),
                Optional.ofNullable(applications).orElse(Collections.emptyList()));
        final String fileName = Optional.ofNullable(model.get("filename")).orElse("domande");
        return download(session, model.get("nodeRef"), fileName.endsWith(".zip") ? fileName : fileName + ".zip", "application/zip");
    }

    public enum FilteredType {
        call, commission, application, score, istruttoria
    }

    @Operation(summary = "Estrazione Excel dei bandi filtrati, riservata ad ADMIN e CONCORSI (asincrona: il link al file viene inviato per email)",
            description = "exportType: call (bandi), commission (commissioni), application (dati delle domande), " +
                    "score (punteggi e graduatoria), istruttoria (domande per istruttoria). Gli altri parametri sono i filtri dell'elenco bandi (type = tipologia).")
    @PostMapping("/export/filtered")
    public ResponseEntity<Map<String, String>> filtered(HttpServletRequest req,
                                                        @RequestParam("exportType") FilteredType exportType,
                                                        @ModelAttribute CallParamsDTO params) throws Exception {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        // riservata agli amministratori (gruppo ADMIN) e al gruppo CONCORSI
        if (!user.isAdmin() && !callService.isMemberOfConcorsiGroup(user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        callService.extractionFilteredCalls(cmisService.getCurrentCMISSession(req), params, exportType.name(),
                Utility.getContextURL(req), user.getId(), frontendURL(req));
        return ResponseEntity.ok(Collections.singletonMap("email", Optional.ofNullable(user.getEmail()).orElse("")));
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

    /** Indirizzo del frontend che ha fatto la richiesta (Origin, oppure l'origine del Referer), per i link nelle email. */
    private String frontendURL(HttpServletRequest req) {
        String candidate = Optional.ofNullable(req.getHeader("Origin"))
                .filter(origin -> !origin.isEmpty() && !"null".equals(origin))
                .orElse(null);
        if (candidate == null) {
            final String referer = req.getHeader("Referer");
            if (referer != null) {
                try {
                    final java.net.URI uri = java.net.URI.create(referer);
                    if (uri.getScheme() != null && uri.getAuthority() != null) {
                        candidate = uri.getScheme() + "://" + uri.getAuthority();
                    }
                } catch (IllegalArgumentException e) {
                    candidate = null;
                }
            }
        }
        return Optional.ofNullable(candidate)
                .filter(url -> url.matches("https?://[A-Za-z0-9.\\-]+(:\\d+)?"))
                .orElse(null);
    }

    private String safeId(String id) {
        if (id == null || !id.matches("[A-Za-z0-9:/;._\\-]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid id");
        }
        return id;
    }

    /** Amministratori, gruppo CONCORSI, RdP e commissari del bando (come nel frontend legacy). */
    private CMISUser checkManager(HttpServletRequest req, String callId) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        final CmisObject object = cmisService.getCurrentCMISSession(req).getObject(safeId(callId));
        if (!(object instanceof Folder)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        final Folder call = (Folder) object;
        if (!user.isAdmin() && !callService.isMemberOfConcorsiGroup(user) && !callService.isMemberOfRDPGroup(user, call)
                && !callService.isMemberOfCommissioneGroup(user, call)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return user;
    }
}
