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

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.rest.openapi.utils.SpringI18NError;
import it.cnr.si.cool.jconon.push.PushNotificationService;
import it.cnr.si.cool.jconon.service.PrintService;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.JcononGroups;
import it.cnr.si.cool.jconon.util.Utility;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.util.*;
import java.util.stream.StreamSupport;

/**
 * Operazioni di RdP, gruppo CONCORSI e commissione su una singola domanda, come nel menu "Operazioni"
 * del frontend legacy: esclusione, riammissione, ritiro della domanda, rinuncia alla graduatoria,
 * comunicazione e convocazione del candidato (documento allegato alla domanda), reperibilita' e punteggi.
 */
@RestController
@RequestMapping(ApiRoutes.V1_APPLICATION)
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Operazioni sulle domande", description = "Esclusioni, riammissioni, rinunce, comunicazioni, reperibilita' e punteggi")
public class ApplicationOperationsController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationOperationsController.class);

    private static final String ESCLUSIONE = "esclusione";
    private static final String RIAMMISSIONE = "riammissione";
    private static final String RITIRO = "ritiro";
    private static final String RINUNCIA = "rinuncia";
    private static final String COMUNICAZIONE = "comunicazione";
    private static final String CONVOCAZIONE = "convocazione";

    /** Tipo del documento allegato alla domanda per ogni operazione. */
    private static final Map<String, String> DOCUMENT_TYPES = new HashMap<>();
    /** Prefisso delle proprieta' stato/email/email_pec dei documenti indirizzati al candidato. */
    private static final Map<String, String> CANDIDATE_PREFIX = new HashMap<>();
    /** Campi di reperibilita' modificabili da RdP e CONCORSI. */
    private static final List<String> REPERIBILITA = Arrays.asList(
            "jconon_application:nazione_comunicazioni",
            "jconon_application:comune_comunicazioni",
            "jconon_application:provincia_comunicazioni",
            "jconon_application:cap_comunicazioni",
            "jconon_application:indirizzo_comunicazioni",
            "jconon_application:num_civico_comunicazioni",
            "jconon_application:telefono_comunicazioni",
            "jconon_application:email_comunicazioni",
            "jconon_application:email_pec_comunicazioni"
    );
    /** Esclusa, non ammessa, ritirata: la domanda puo' solo essere riammessa. */
    private static final List<String> NON_ATTIVA = Arrays.asList("E", "N", "R");
    private static final String PROTOCOLLO_DATA = "jconon_protocollo:data";
    private static final String PROTOCOLLO_NUMERO = "jconon_protocollo:numero";

    static {
        DOCUMENT_TYPES.put(ESCLUSIONE, "D:jconon_esclusione:attachment");
        DOCUMENT_TYPES.put(RIAMMISSIONE, "D:jconon_riammissione:attachment");
        DOCUMENT_TYPES.put(RITIRO, "D:jconon_rinuncia:attachment");
        DOCUMENT_TYPES.put(RINUNCIA, "D:jconon_rinuncia:attachment");
        DOCUMENT_TYPES.put(COMUNICAZIONE, "D:jconon_comunicazione:attachment");
        DOCUMENT_TYPES.put(CONVOCAZIONE, "D:jconon_convocazione:attachment");
        CANDIDATE_PREFIX.put(ESCLUSIONE, "jconon_esclusione");
        CANDIDATE_PREFIX.put(COMUNICAZIONE, "jconon_comunicazione");
        CANDIDATE_PREFIX.put(CONVOCAZIONE, "jconon_convocazione");
    }

    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;
    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private NodeMetadataService nodeMetadataService;
    @Autowired
    private ACLService aclService;
    @Autowired
    private PrintService printService;
    @Autowired
    private PushNotificationService pushNotificationService;

    @Operation(summary = "Esegue un'operazione sulla domanda allegando il documento che la motiva",
            description = "operation: esclusione, riammissione, ritiro (ritiro della domanda), rinuncia (rinuncia alla graduatoria), " +
                    "comunicazione, convocazione. properties: jconon_protocollo:data, jconon_protocollo:numero e, per l'esclusione, stato")
    @PostMapping(value = "/{id}/operations/{operation}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, ?>> operation(HttpServletRequest req,
                                                    @PathVariable String id,
                                                    @PathVariable String operation,
                                                    @RequestPart(name = "properties", required = false) byte[] properties,
                                                    @RequestPart("file") MultipartFile file) throws Exception {
        final String documentType = Optional.ofNullable(DOCUMENT_TYPES.get(operation))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid operation"));
        if (file == null || file.isEmpty()) {
            throw new ClientMessageException("message.error.attachment.required");
        }
        final CMISUser user = currentUser(req);
        final Session session = cmisService.getCurrentCMISSession(req);
        final Folder application = loadApplication(session, id);
        final Folder call = application.getFolderParent();
        final boolean candidateDocument = CANDIDATE_PREFIX.containsKey(operation);
        checkPermission(user, call, candidateDocument);
        checkState(application, operation);

        final Map<String, Object> request = Optional.ofNullable(properties)
                .filter(bytes -> bytes.length > 0)
                .map(bytes -> {
                    try {
                        return (Map<String, Object>) new ObjectMapper().readValue(bytes, Map.class);
                    } catch (java.io.IOException e) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid properties");
                    }
                })
                .orElse(Collections.emptyMap());

        final Map<String, Serializable> values = new HashMap<>();
        values.put(PropertyIds.OBJECT_TYPE_ID, documentType);
        values.put("aspect", new ArrayList<>(Arrays.asList(
                "P:jconon_attachment:generic_document",
                "P:jconon_attachment:document_from_rdp",
                "P:jconon_protocollo:common")));
        putIfPresent(values, PROTOCOLLO_DATA, request.get(PROTOCOLLO_DATA));
        putIfPresent(values, PROTOCOLLO_NUMERO, request.get(PROTOCOLLO_NUMERO));
        if (candidateDocument) {
            // documento indirizzato al candidato: e' lui il destinatario (elenchi di comunicazioni, convocazioni, esclusioni)
            final String prefix = CANDIDATE_PREFIX.get(operation);
            values.put("jconon_attachment:user", application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
            putIfPresent(values, prefix + ":email", application.getPropertyValue("jconon_application:email_comunicazioni"));
            putIfPresent(values, prefix + ":email_pec", application.getPropertyValue("jconon_application:email_pec_comunicazioni"));
            values.put(prefix + ":stato", ESCLUSIONE.equals(operation) ?
                    Optional.ofNullable(request.get("stato")).map(String::valueOf).filter(s -> !s.isEmpty()).orElse("SPEDITO") :
                    "GENERATO");
        } else {
            values.put("jconon_attachment:user", user.getId());
        }

        final Map<String, Object> prop = nodeMetadataService.populateMetadataType(session, values, req);
        prop.putAll(nodeMetadataService.populateMetadataAspectFromRequest(session, values, req));
        final ContentStreamImpl contentStream = new ContentStreamImpl();
        prop.put(PropertyIds.NAME, file.getOriginalFilename());
        contentStream.setStream(file.getInputStream());
        contentStream.setFileName(file.getOriginalFilename());
        contentStream.setMimeType(file.getContentType());
        final CmisObject document;
        try {
            document = session.getObject(session.createDocument(prop, new ObjectIdImpl(application.getId()),
                    contentStream, VersioningState.MAJOR));
        } catch (CmisContentAlreadyExistsException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap(SpringI18NError.I18N,
                    new SpringI18NError("message.error.contentalredyexist",
                            Collections.singletonMap("filename", file.getOriginalFilename()))));
        }
        if (candidateDocument) {
            // come aclCoordinatorRdP del legacy: il documento resta gestibile da CONCORSI e dall'RdP del bando
            final String nodeRef = document.<String>getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value());
            aclService.addAcl(cmisService.getAdminSession(), nodeRef,
                    Collections.singletonMap(JcononGroups.CONCORSI.group(), ACLType.Coordinator));
            Optional.ofNullable(call.<String>getPropertyValue(JCONONPropertyIds.CALL_RDP.value()))
                    .filter(rdp -> !rdp.isEmpty())
                    .ifPresent(rdp -> aclService.addAcl(cmisService.getAdminSession(), nodeRef,
                            Collections.singletonMap(rdp.startsWith("GROUP_") ? rdp : "GROUP_" + rdp, ACLType.Coordinator)));
        }
        switch (operation) {
            case ESCLUSIONE:
                applicationService.reject(session, application.getId(), document.getId());
                break;
            case RIAMMISSIONE:
                applicationService.readmission(session, application.getId());
                break;
            case RITIRO:
                applicationService.waiver(session, application.getId());
                break;
            case RINUNCIA:
                applicationService.retirement(session, application.getId());
                break;
            case COMUNICAZIONE:
                pushNotificationService.notifyCommunication(application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()),
                        call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()));
                break;
            case CONVOCAZIONE:
                pushNotificationService.notifyConvocation(application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()),
                        call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()));
                break;
            default:
                break;
        }
        LOGGER.info("Application {} operation {} by {}", application.getId(), operation, user.getId());
        return ResponseEntity.ok(CMISUtil.convertToProperties(document));
    }

    @Operation(summary = "Aggiorna i recapiti per le comunicazioni del candidato (RdP, CONCORSI e amministratori)")
    @PutMapping("/{id}/reperibilita")
    public ResponseEntity<Map<String, Object>> reperibilita(HttpServletRequest req, @PathVariable String id,
                                                            @RequestBody Map<String, Object> body) {
        final CMISUser user = currentUser(req);
        final Session session = cmisService.getCurrentCMISSession(req);
        final Folder application = loadApplication(session, id);
        checkPermission(user, application.getFolderParent(), false);
        final Map<String, Serializable> properties = new HashMap<>();
        REPERIBILITA.stream()
                .filter(body::containsKey)
                .forEach(key -> properties.put(key, Optional.ofNullable(body.get(key))
                        .map(String::valueOf)
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .orElse(null)));
        cmisService.createAdminSession().getObject(application).updateProperties(properties);
        return ResponseEntity.ok(Collections.singletonMap("result", (Object) Boolean.TRUE));
    }

    @Operation(summary = "Aggiorna i punteggi, la posizione in graduatoria, l'esito e le note di una domanda")
    @PutMapping("/{id}/scores")
    public ResponseEntity<Map<String, Object>> scores(HttpServletRequest req, @PathVariable String id,
                                                      @RequestBody Map<String, Object> body) {
        final CMISUser user = currentUser(req);
        final Session session = cmisService.getCurrentCMISSession(req);
        final Folder application = loadApplication(session, id);
        final Folder call = application.getFolderParent();
        if (Optional.ofNullable(call.<Boolean>getPropertyValue(JCONONPropertyIds.CALL_GRADUATORIA.value())).orElse(Boolean.FALSE)) {
            throw new ClientMessageException("application_operations.scores.locked");
        }
        final String message = applicationService.punteggi(session, user.getId(), call.getId(), application.getId(),
                decimal(body, "jconon_application:punteggio_titoli"),
                decimal(body, "jconon_application:punteggio_scritto"),
                decimal(body, "jconon_application:punteggio_secondo_scritto"),
                decimal(body, "jconon_application:punteggio_colloquio"),
                decimal(body, "jconon_application:punteggio_prova_pratica"),
                decimal(body, "jconon_application:punteggio_6"),
                decimal(body, "jconon_application:punteggio_7"),
                decimal(body, "jconon_application:graduatoria"),
                text(body, "jconon_application:esito_call"),
                text(body, "jconon_application:punteggio_note"),
                null, null, null, null, true);
        return ResponseEntity.ok(Collections.singletonMap("message", (Object) message));
    }

    @Operation(summary = "Predispone la scheda di valutazione vuota della domanda (commissione, CONCORSI e amministratori)",
            description = "Solo per i bandi con scheda di valutazione; se la scheda esiste gia' ne restituisce l'id")
    @PostMapping("/{id}/evaluation")
    public ResponseEntity<Map<String, Object>> evaluation(HttpServletRequest req, @PathVariable String id,
                                                          @CookieValue(value = "__lang", required = false) String lang) throws Exception {
        final CMISUser user = currentUser(req);
        final Session session = cmisService.getCurrentCMISSession(req);
        final Folder application = loadApplication(session, id);
        final Folder call = application.getFolderParent();
        if (!user.isAdmin() && !callService.isMemberOfConcorsiGroup(user) && !callService.isMemberOfCommissioneGroup(user, call)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if (!Optional.ofNullable(call.<Boolean>getPropertyValue("jconon_call:scheda_valutazione")).orElse(Boolean.FALSE)) {
            throw new ClientMessageException("application_operations.evaluation.not_enabled");
        }
        final Optional<String> existing = StreamSupport.stream(session.query(
                "SELECT cmis:objectId FROM jconon_attachment:scheda_valutazione WHERE IN_FOLDER('" + application.getId() + "')",
                false).spliterator(), false)
                .map(result -> result.<String>getPropertyValueById(PropertyIds.OBJECT_ID))
                .findFirst();
        final String objectId = existing.isPresent() ? existing.get() :
                printService.printSchedaValutazione(session, application.getId(), Utility.getContextURL(req), user.getId(),
                        I18nService.getLocale(req, lang));
        return ResponseEntity.ok(Collections.singletonMap(PropertyIds.OBJECT_ID, (Object) objectId));
    }

    /* ------------------------------------------------------------------ */

    @ExceptionHandler(ClientMessageException.class)
    public ResponseEntity<Map<String, String>> handleClientMessage(ClientMessageException e) {
        LOGGER.warn("Application operation error: {}", e.getMessage());
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
    }

    private static java.math.BigDecimal decimal(Map<String, Object> body, String key) {
        return Utility.FORMATBigDecimal(text(body, key));
    }

    private static String text(Map<String, Object> body, String key) {
        return Optional.ofNullable(body.get(key)).map(String::valueOf).orElse(null);
    }

    private static void putIfPresent(Map<String, Serializable> values, String key, Object value) {
        Optional.ofNullable(value)
                .map(String::valueOf)
                .filter(s -> !s.isEmpty())
                .ifPresent(s -> values.put(key, s));
    }

    private CMISUser currentUser(HttpServletRequest req) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    private Folder loadApplication(Session session, String id) {
        if (id == null || !id.matches("[A-Za-z0-9:/;._\\-]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid id");
        }
        final Folder application = applicationService.loadApplicationById(session, id);
        if (!JCONONFolderType.JCONON_APPLICATION.value().equals(application.getType().getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return application;
    }

    /**
     * Esclusioni, riammissioni, rinunce e reperibilita': amministratori, CONCORSI e RdP del bando;
     * comunicazioni e convocazioni anche la commissione (come nel frontend legacy).
     */
    private void checkPermission(CMISUser user, Folder call, boolean commissioneAllowed) {
        if (user.isAdmin() || callService.isMemberOfConcorsiGroup(user) || callService.isMemberOfRDPGroup(user, call)) {
            return;
        }
        if (commissioneAllowed && callService.isMemberOfCommissioneGroup(user, call)) {
            return;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }

    /** Le operazioni valgono per domande inviate; esclusione e riammissione dipendono dallo stato attuale. */
    private void checkState(Folder application, String operation) {
        if (!"C".equals(application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()))) {
            throw new ClientMessageException("application_operations.error.not_sent");
        }
        final String esclusione = application.getPropertyValue(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value());
        final boolean nonAttiva = esclusione != null && NON_ATTIVA.contains(esclusione);
        if (RIAMMISSIONE.equals(operation) && !nonAttiva) {
            throw new ClientMessageException("application_operations.error.not_excluded");
        }
        if ((ESCLUSIONE.equals(operation) || RITIRO.equals(operation) || RINUNCIA.equals(operation)) && nonAttiva) {
            throw new ClientMessageException("application_operations.error.already_excluded");
        }
    }
}
