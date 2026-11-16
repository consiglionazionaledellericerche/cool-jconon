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
import it.cnr.si.cool.jconon.rest.openapi.model.ApplicationsParamsDTO;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.service.application.ExportApplicationsService;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.Utility;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
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
import java.util.*;

/**
 * Esportazioni sulle domande:
 * - estrazione Excel delle domande filtrate (dati, punteggi e graduatoria, istruttoria), asincrona con link via email;
 * - archivio zip di una singola domanda confermata (stampa e allegati), scaricabile dal candidato e da chi gestisce il bando.
 */
@RestController
@RequestMapping(ApiRoutes.V1_APPLICATION)
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Esportazioni delle domande", description = "Estrazione Excel delle domande filtrate e zip della singola domanda")
public class ApplicationExportController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationExportController.class);

    public enum FilteredType {
        application, score, istruttoria
    }

    @Autowired
    private CMISService cmisService;
    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private CallService callService;
    @Autowired
    private ExportApplicationsService exportApplicationsService;

    @Operation(summary = "Estrazione Excel delle domande filtrate (asincrona: il link al file viene inviato per email)",
            description = "exportType: application (dati delle domande), score (punteggi e graduatoria), istruttoria (domande per istruttoria). " +
                    "Gli altri parametri sono i filtri dell'elenco delle domande.")
    @PostMapping("/export/filtered")
    public ResponseEntity<Map<String, Object>> filtered(HttpServletRequest req,
                                                        @RequestParam("exportType") FilteredType exportType,
                                                        @ModelAttribute ApplicationsParamsDTO params) {
        final CMISUser user = currentUser(req);
        final int count = applicationService.extractionFilteredApplications(cmisService.getCurrentCMISSession(req), true, params,
                exportType.name(), Utility.getContextURL(req), user.getId(), frontendURL(req));
        final Map<String, Object> body = new HashMap<>();
        body.put("email", Optional.ofNullable(user.getEmail()).orElse(""));
        body.put("count", count);
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "Archivio zip della domanda confermata (stampa e allegati)")
    @PostMapping("/{id}/export.zip")
    public ResponseEntity<byte[]> applicationZip(HttpServletRequest req, @PathVariable String id) throws Exception {
        final CMISUser user = currentUser(req);
        final Session session = cmisService.getCurrentCMISSession(req);
        final CmisObject object = session.getObject(safeId(id));
        if (!(object instanceof Folder)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        final Folder application = (Folder) object;
        final Folder call = application.getFolderParent();
        final boolean owner = user.getId().equals(application.getPropertyValue("jconon_application:user"));
        if (!owner && !user.isAdmin() && !callService.isMemberOfConcorsiGroup(user) && !callService.isMemberOfRDPGroup(user, call)
                && !callService.isMemberOfCommissioneGroup(user, call)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        final Map<String, String> model = exportApplicationsService.exportApplications(session, cmisService.getCurrentBindingSession(req),
                call.getId(), user, true, false, new JSONArray(), Collections.singletonList(application.getId()));
        final String fileName = Optional.ofNullable(model.get("filename")).orElse("domanda");
        return download(session, model.get("nodeRef"), fileName.endsWith(".zip") ? fileName : fileName + ".zip");
    }

    private ResponseEntity<byte[]> download(Session session, String objectId, String fileName) throws Exception {
        final CmisObject object = session.getObject(objectId);
        if (!(object instanceof Document)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        final Document document = (Document) object;
        final byte[] content;
        try (InputStream inputStream = document.getContentStream().getStream()) {
            content = IOUtils.toByteArray(inputStream);
        }
        try {
            document.delete(true);
        } catch (RuntimeException e) {
            LOGGER.warn("Unable to delete temporary export {}", objectId, e);
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/zip"))
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
}
