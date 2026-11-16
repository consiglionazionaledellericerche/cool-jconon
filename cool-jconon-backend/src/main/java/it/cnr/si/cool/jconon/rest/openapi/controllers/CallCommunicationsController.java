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
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.AddressType;
import it.cnr.si.cool.jconon.util.Utility;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Convocazioni, esclusioni e comunicazioni ai candidati di un bando (ex /rest/call/convocazioni, firma-*, invia-*).
 * Flusso: generazione dei documenti (stato GENERATO) -> firma (FIRMATO) -> invio per email/PEC (SPEDITO).
 * Diversamente dalla versione legacy la query CMIS non arriva dal client: viene costruita qui,
 * limitata alla cartella del bando, allo stato richiesto e, se indicati, ai documenti selezionati.
 */
@RestController
@RequestMapping(ApiRoutes.V1_CALL)
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Comunicazioni ai candidati", description = "Convocazioni, esclusioni e comunicazioni di un bando")
public class CallCommunicationsController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CallCommunicationsController.class);

    public enum Kind {
        convocazioni("jconon_convocazione:attachment", "jconon_convocazione:stato", "Convocazione del candidato"),
        esclusioni("jconon_esclusione:attachment", "jconon_esclusione:stato", "Esclusione del candidato"),
        comunicazioni("jconon_comunicazione:attachment", "jconon_comunicazione:stato", "Comunicazione al candidato");

        final String queryName;
        final String stateProperty;
        final String description;

        Kind(String queryName, String stateProperty, String description) {
            this.queryName = queryName;
            this.stateProperty = stateProperty;
            this.description = description;
        }
    }

    public enum State {
        GENERATO, FIRMATO, SPEDITO, CONSEGNATO, RICEVUTO
    }

    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;

    @Operation(summary = "Genera i documenti (multipart: campi del form del tipo, application ripetuto per i candidati, file opzionale)")
    @PostMapping(value = "/{id}/communications/{kind}/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Long>> generate(HttpServletRequest req,
                                                      @PathVariable String id,
                                                      @PathVariable Kind kind,
                                                      @CookieValue(value = "__lang", required = false) String lang) throws Exception {
        final CMISUser user = checkManager(req, id);
        if (!(req instanceof MultipartHttpServletRequest)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "multipart request expected");
        }
        final MultipartHttpServletRequest mRequest = (MultipartHttpServletRequest) req;
        if (!id.equals(mRequest.getParameter("callId"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "callId does not match");
        }
        final Session session = cmisService.getCurrentCMISSession(req);
        final Locale locale = I18nService.getLocale(req, lang);
        final String contextURL = Utility.getContextURL(req);
        Long count;
        switch (kind) {
            case convocazioni:
                count = callService.convocazioniSync(session, mRequest, cmisService.getCurrentBindingSession(req), contextURL, locale, user.getId());
                break;
            case esclusioni:
                count = callService.esclusioniSync(session, mRequest, cmisService.getCurrentBindingSession(req), contextURL, locale, user.getId());
                break;
            default:
                count = callService.comunicazioniSync(session, mRequest, cmisService.getCurrentBindingSession(req), contextURL, locale, user.getId());
        }
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }

    @Operation(summary = "Documenti generati per il bando, opzionalmente filtrati per stato")
    @GetMapping("/{id}/communications/{kind}")
    public ResponseEntity<List<Map<String, Object>>> list(HttpServletRequest req,
                                                          @PathVariable String id,
                                                          @PathVariable Kind kind,
                                                          @RequestParam(value = "stato", required = false) State stato) {
        checkManager(req, id);
        final Session session = cmisService.getCurrentCMISSession(req);
        final OperationContext context = session.createOperationContext();
        context.setMaxItemsPerPage(1000);
        final Iterable<QueryResult> results = session.query(query(kind, id, stato, null), false, context).getPage(1000);
        return ResponseEntity.ok(StreamSupport.stream(results.spliterator(), false)
                .map(CMISUtil::convertToProperties)
                .collect(Collectors.toList()));
    }

    @Operation(summary = "Firma digitale dei documenti in stato GENERATO (tutti o quelli indicati in ids)")
    @PostMapping("/{id}/communications/{kind}/sign")
    public ResponseEntity<Map<String, Object>> sign(HttpServletRequest req,
                                                    @PathVariable String id,
                                                    @PathVariable Kind kind,
                                                    @RequestParam(value = "ids", required = false) List<String> ids,
                                                    @RequestParam(value = "userName", required = false) String userName,
                                                    @RequestParam(value = "password", required = false) String password,
                                                    @RequestParam(value = "otp", required = false) String otp,
                                                    @RequestParam(value = "firma", required = false) String firma,
                                                    @RequestParam(value = "firmaAutomatica", defaultValue = "false") Boolean firmaAutomatica) {
        final CMISUser user = checkManager(req, id);
        try {
            final Long count = callService.firma(cmisService.getCurrentCMISSession(req), cmisService.getCurrentBindingSession(req),
                    query(kind, id, State.GENERATO, ids), Utility.getContextURL(req), user.getId(),
                    userName, password, otp, firma, kind.stateProperty, kind.description, firmaAutomatica);
            return ResponseEntity.ok(Collections.singletonMap("count", count));
        } catch (Exception e) {
            LOGGER.error("sign {} {}", kind, id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", Utility.signErrorMessage(e.getMessage())));
        }
    }

    @Operation(summary = "Invio ai candidati dei documenti firmati (email, PEC o indirizzo indicato nella domanda)")
    @PostMapping("/{id}/communications/{kind}/send")
    public ResponseEntity<Map<String, Long>> send(HttpServletRequest req,
                                                  @PathVariable String id,
                                                  @PathVariable Kind kind,
                                                  @RequestParam(value = "ids", required = false) List<String> ids,
                                                  @RequestParam(value = "addressFromApplication", defaultValue = "EMAIL") AddressType addressFromApplication,
                                                  @RequestParam(value = "pec", defaultValue = "false") Boolean pec,
                                                  @RequestParam(value = "userNamePEC", required = false) String userNamePEC,
                                                  @RequestParam(value = "passwordPEC", required = false) String passwordPEC) throws Exception {
        final CMISUser user = checkManager(req, id);
        final Session session = cmisService.getCurrentCMISSession(req);
        final String query = query(kind, id, State.FIRMATO, ids);
        final String contextURL = Utility.getContextURL(req);
        Long count;
        switch (kind) {
            case convocazioni:
                count = callService.inviaConvocazioni(session, cmisService.getCurrentBindingSession(req), query, contextURL,
                        user.getId(), id, userNamePEC, passwordPEC, addressFromApplication, pec);
                break;
            case esclusioni:
                count = callService.inviaEsclusioni(session, cmisService.getCurrentBindingSession(req), query, contextURL,
                        user.getId(), id, userNamePEC, passwordPEC, addressFromApplication, pec);
                break;
            default:
                count = callService.inviaComunicazioni(session, cmisService.getCurrentBindingSession(req), query, contextURL,
                        user.getId(), id, userNamePEC, passwordPEC, addressFromApplication, pec);
        }
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }

    @Operation(summary = "Elimina i documenti non ancora spediti (stato GENERATO o FIRMATO)")
    @DeleteMapping("/{id}/communications/{kind}")
    public ResponseEntity<Map<String, Long>> delete(HttpServletRequest req,
                                                    @PathVariable String id,
                                                    @PathVariable Kind kind,
                                                    @RequestParam(value = "stato", defaultValue = "GENERATO") State stato,
                                                    @RequestParam(value = "ids", required = false) List<String> ids) throws Exception {
        final CMISUser user = checkManager(req, id);
        if (stato != State.GENERATO && stato != State.FIRMATO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sent documents cannot be deleted");
        }
        return ResponseEntity.ok(Collections.singletonMap("count",
                callService.eliminaAllegatiGeneratiSullaDomanda(cmisService.getCurrentCMISSession(req),
                        query(kind, id, stato, ids), user.getId())));
    }

    /**
     * Query sui documenti del bando: sempre limitata alla cartella del bando (IN_TREE), allo stato e agli id indicati.
     * Gli id vengono validati come identificativi CMIS per evitare injection nella query.
     */
    private String query(Kind kind, String callId, State stato, List<String> ids) {
        final StringBuilder query = new StringBuilder("SELECT * FROM ").append(kind.queryName)
                .append(" WHERE IN_TREE('").append(safeId(callId)).append("')");
        Optional.ofNullable(stato).ifPresent(s -> query.append(" AND ").append(kind.stateProperty).append(" = '").append(s.name()).append("'"));
        final List<String> selected = Optional.ofNullable(ids).orElse(Collections.emptyList()).stream()
                .filter(s -> !s.isEmpty()).map(this::safeId).collect(Collectors.toList());
        if (!selected.isEmpty()) {
            query.append(" AND cmis:objectId IN (")
                    .append(selected.stream().map(s -> "'" + s + "'").collect(Collectors.joining(",")))
                    .append(")");
        }
        return query.append(" ORDER BY cmis:lastModificationDate DESC").toString();
    }

    private String safeId(String id) {
        if (id == null || !id.matches("[A-Za-z0-9:/;._\\-]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid id");
        }
        return id;
    }

    private CMISUser checkManager(HttpServletRequest req, String callId) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        final CmisObject object = cmisService.getCurrentCMISSession(req).getObject(safeId(callId));
        if (!(object instanceof Folder)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        if (!user.isAdmin() && !callService.isMemberOfConcorsiGroup(user) && !callService.isMemberOfRDPGroup(user, (Folder) object)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return user;
    }
}
