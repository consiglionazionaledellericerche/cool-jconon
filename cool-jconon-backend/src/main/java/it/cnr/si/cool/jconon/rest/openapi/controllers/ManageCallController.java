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

import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.security.service.GroupService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.repository.CommissionConfProperties;
import it.cnr.si.cool.jconon.repository.CommonRepository;
import it.cnr.si.cool.jconon.rest.openapi.utils.AlfrescoWebScriptClient;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.cache.CompetitionFolderService;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.Utility;
import lombok.Data;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Gestione del bando per il frontend selezioni-online: pubblicazione, eliminazione, bandi figli,
 * etichette personalizzate, permessi, gruppo RdP, commissione e allegati del macro-bando.
 * Sostituisce /rest/manage-call e le azioni del menu bandi del frontend legacy.
 */
@RestController
@RequestMapping(ApiRoutes.V1_CALL)
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Gestione bando", description = "Operazioni di gestione del bando")
public class ManageCallController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ManageCallController.class);
    private static final String GROUP_PREFIX = "GROUP_";
    private static final List<String> RUOLI_ABILITABILI = Arrays.asList("A_PRE", "B_COM", "C_SEG");
    private static final String COMMISSIONE_USERNAME = "jconon_commissione:username";
    private static final String COMMISSIONE_RUOLO = "jconon_commissione:ruolo";
    private static final String VIDEO_GENDER = "whatch_video_gender";
    private static final String VIDEO_GENDER_PROPERTY = "jconon_commissione:whatch_video_gender";

    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;
    @Autowired
    private NodeMetadataService nodeMetadataService;
    @Autowired
    private CompetitionFolderService competitionService;
    @Autowired
    private ACLService aclService;
    @Autowired
    private GroupService groupService;
    @Autowired
    private UserService userService;
    @Autowired
    private AlfrescoWebScriptClient webScriptClient;
    @Autowired
    private CommonRepository commonRepository;
    @Autowired
    private CommissionConfProperties commissionConfProperties;

    /* ------------------------------------------------------------------ */
    /* Pubblicazione, eliminazione, bandi figli                              */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Pubblica o ritira un bando")
    @PostMapping("/{id}/publish")
    public ResponseEntity<Map<String, Object>> publish(HttpServletRequest req,
                                                       @PathVariable String id,
                                                       @RequestParam("publish") Boolean publish,
                                                       @CookieValue(value = "__lang", required = false) String lang) {
        final Session session = cmisService.getCurrentCMISSession(req);
        final Folder call = callService.publish(session, cmisService.getCurrentBindingSession(req),
                currentUser(req).getId(), id, publish, Utility.getContextURL(req), I18nService.getLocale(req, lang));
        final Map<String, Object> result = new HashMap<>();
        result.put("published", publish);
        result.put(CoolPropertyIds.ALFCMIS_NODEREF.value(), call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString());
        result.put(JCONONPropertyIds.CALL_ID_CATEGORIA_TECNICO_HELPDESK.value(),
                call.getPropertyValue(JCONONPropertyIds.CALL_ID_CATEGORIA_TECNICO_HELPDESK.value()));
        result.put(JCONONPropertyIds.CALL_ID_CATEGORIA_NORMATIVA_HELPDESK.value(),
                call.getPropertyValue(JCONONPropertyIds.CALL_ID_CATEGORIA_NORMATIVA_HELPDESK.value()));
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Elimina un bando")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(HttpServletRequest req, @PathVariable String id) {
        final Session session = cmisService.getCurrentCMISSession(req);
        final CmisObject call = session.getObject(id);
        callService.delete(session, Utility.getContextURL(req), id, call.getType().getId(), currentUser(req).getId());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Crea un bando figlio di un macro-bando, ereditandone le proprieta'")
    @PostMapping("/{id}/child")
    public ResponseEntity<Map<String, String>> createChild(HttpServletRequest req,
                                                           @PathVariable String id,
                                                           @RequestBody Map<String, Object> body,
                                                           @CookieValue(value = "__lang", required = false) String lang) throws ParseException {
        final Session session = cmisService.getCurrentCMISSession(req);
        final CmisObject parent = session.getObject(id);
        final Map<String, Object> request = new HashMap<>(body);
        request.put(PropertyIds.OBJECT_TYPE_ID, parent.getType().getId());
        request.put(PropertyIds.PARENT_ID, id);
        final Map<String, Object> properties = nodeMetadataService.populateMetadataType(session, request, req);
        properties.put(PropertyIds.PARENT_ID, id);
        properties.put(PropertyIds.OBJECT_TYPE_ID, parent.getType().getId());
        final String childId = callService.createChildCall(session, cmisService.getCurrentBindingSession(req),
                currentUser(req).getId(), properties, Utility.getContextURL(req), I18nService.getLocale(req, lang));
        return ResponseEntity.ok(Collections.singletonMap("objectId", childId));
    }

    @Operation(summary = "Bandi figli di un macro-bando")
    @GetMapping("/{id}/children")
    public ResponseEntity<List<Map<String, Object>>> children(HttpServletRequest req, @PathVariable String id) {
        final Folder parent = folder(cmisService.getCurrentCMISSession(req), id);
        return ResponseEntity.ok(
                StreamSupport.stream(parent.getChildren().spliterator(), false)
                        .filter(Folder.class::isInstance)
                        .filter(child -> child.getProperty(JCONONPropertyIds.CALL_CODICE.value()) != null)
                        .map(CMISUtil::convertToProperties)
                        .collect(Collectors.toList())
        );
    }

    /* ------------------------------------------------------------------ */
    /* Etichette personalizzate                                              */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Etichette personalizzate del bando, nel formato JSON usato dalla gestione")
    @GetMapping(value = "/{id}/labels", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> labels(HttpServletRequest req, @PathVariable String id) {
        return ResponseEntity.ok(Optional.ofNullable(
                        callService.getJSONLabels(new ObjectIdImpl(id), cmisService.getCurrentCMISSession(req)))
                .map(Object::toString)
                .orElse("{}"));
    }

    @Operation(summary = "Aggiunge, modifica o elimina un'etichetta personalizzata")
    @PostMapping(value = "/{id}/labels", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveLabel(HttpServletRequest req, @PathVariable String id, @RequestBody LabelRequest label) {
        checkManager(req, id);
        return ResponseEntity.ok(callService.storeDynamicLabels(new ObjectIdImpl(id), cmisService.getCurrentCMISSession(req),
                label.getKey(), label.getOldLabel(), label.getNewLabel(), label.isDelete()).toString());
    }

    @Operation(summary = "Copia le etichette personalizzate da un altro bando")
    @PostMapping("/{id}/labels/copy")
    public ResponseEntity<Properties> copyLabels(HttpServletRequest req, @PathVariable String id, @RequestParam("from") String from) {
        checkManager(req, id);
        final Session session = cmisService.getCurrentCMISSession(req);
        competitionService.copyLabels(session, from, id);
        return ResponseEntity.ok(competitionService.getDynamicLabels(new ObjectIdImpl(id), session));
    }

    /* ------------------------------------------------------------------ */
    /* Permessi (ACL)                                                       */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Permessi sulla cartella del bando")
    @GetMapping(value = "/{id}/acl", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> acl(HttpServletRequest req, @PathVariable String id) {
        checkConcorsi(req);
        return ResponseEntity.ok(aclService.getPermission(cmisService.getCurrentBindingSession(req),
                nodeRef(cmisService.getCurrentCMISSession(req), id)).toString());
    }

    @Operation(summary = "Assegna un ruolo a un utente o gruppo sulla cartella del bando")
    @PostMapping("/{id}/acl")
    public ResponseEntity<Void> addAcl(HttpServletRequest req, @PathVariable String id, @RequestBody AclRequest acl) {
        checkConcorsi(req);
        aclService.addAcl(cmisService.getCurrentBindingSession(req), nodeRef(cmisService.getCurrentCMISSession(req), id),
                Collections.singletonMap(acl.getAuthority(), acl.getRole()));
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Rimuove un ruolo dalla cartella del bando")
    @DeleteMapping("/{id}/acl")
    public ResponseEntity<Void> removeAcl(HttpServletRequest req, @PathVariable String id,
                                          @RequestParam("authority") String authority,
                                          @RequestParam("role") ACLType role) {
        checkConcorsi(req);
        aclService.removeAcl(cmisService.getCurrentBindingSession(req), nodeRef(cmisService.getCurrentCMISSession(req), id),
                Collections.singletonMap(authority, role));
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Attiva o disattiva l'ereditarieta' dei permessi")
    @PutMapping("/{id}/acl/inherited")
    public ResponseEntity<Void> inherited(HttpServletRequest req, @PathVariable String id, @RequestParam("value") Boolean value) {
        checkConcorsi(req);
        aclService.setInheritedPermission(cmisService.getCurrentBindingSession(req),
                nodeRef(cmisService.getCurrentCMISSession(req), id), value);
        return ResponseEntity.ok().build();
    }

    /* ------------------------------------------------------------------ */
    /* Gruppo RdP                                                           */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Membri del gruppo RdP del bando")
    @GetMapping("/{id}/rdp")
    public ResponseEntity<JsonNode> rdp(HttpServletRequest req, @PathVariable String id) {
        final Folder call = checkManager(req, id);
        return ResponseEntity.ok(webScriptClient.get(cmisService.getCurrentBindingSession(req), "cnr/groups/children",
                Collections.singletonMap("fullName", Collections.singletonList(groupName(call, JCONONPropertyIds.CALL_RDP)))));
    }

    @Operation(summary = "Aggiunge un utente o gruppo al gruppo RdP del bando")
    @PostMapping("/{id}/rdp")
    public ResponseEntity<Void> addRdp(HttpServletRequest req, @PathVariable String id, @RequestParam("authority") String authority) {
        final Folder call = checkConcorsiOnCall(req, id);
        groupService.addAuthority(cmisService.getCurrentBindingSession(req), groupName(call, JCONONPropertyIds.CALL_RDP), authority);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Rimuove un utente o gruppo dal gruppo RdP del bando")
    @DeleteMapping("/{id}/rdp")
    public ResponseEntity<Void> removeRdp(HttpServletRequest req, @PathVariable String id, @RequestParam("authority") String authority) {
        final Folder call = checkConcorsiOnCall(req, id);
        removeFromGroup(cmisService.getCurrentBindingSession(req), groupName(call, JCONONPropertyIds.CALL_RDP), authority);
        return ResponseEntity.ok().build();
    }

    /* ------------------------------------------------------------------ */
    /* Commissione                                                          */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Componenti della commissione, con l'indicazione di chi e' abilitato")
    @GetMapping("/{id}/commission")
    public ResponseEntity<Map<String, Object>> commission(HttpServletRequest req, @PathVariable String id) {
        final Folder call = checkManager(req, id);
        final Session session = cmisService.getCurrentCMISSession(req);
        final List<String> members = commissionMembers(req, call);
        final List<Map<String, Object>> items = callService.getCommission(session, id)
                .stream()
                .map(CMISUtil::convertToProperties)
                .peek(map -> {
                    final Object username = map.get(COMMISSIONE_USERNAME);
                    map.put("abilitato", username != null && members.contains(username));
                    map.put("abilitabile", username != null && RUOLI_ABILITABILI.contains(map.get(COMMISSIONE_RUOLO)));
                })
                .sorted(Comparator.comparing(map -> String.valueOf(map.get(COMMISSIONE_RUOLO))))
                .collect(Collectors.toList());
        final Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        result.put("group", groupName(call, JCONONPropertyIds.CALL_COMMISSIONE));
        result.put("videoGender", Boolean.TRUE.equals(commissionConfProperties.getGender()));
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Inserisce un componente della commissione")
    @PostMapping("/{id}/commission")
    public ResponseEntity<Map<String, Object>> addCommissionMember(HttpServletRequest req, @PathVariable String id,
                                                                   @RequestBody Map<String, Object> body) throws ParseException {
        final Folder call = checkManager(req, id);
        final Session session = cmisService.getCurrentCMISSession(req);
        final Map<String, Object> request = new HashMap<>(body);
        request.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_COMMISSIONE_METADATA.value());
        final Map<String, Object> properties = nodeMetadataService.populateMetadataType(session, request, req);
        properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_COMMISSIONE_METADATA.value());
        properties.put(PropertyIds.NAME, String.join("-",
                "commissione",
                String.valueOf(body.getOrDefault("jconon_commissione:cognome", "")),
                String.valueOf(body.getOrDefault("jconon_commissione:nome", "")),
                UUID.randomUUID().toString().substring(0, 8)).replaceAll("[^A-Za-z0-9\\-_ ]", ""));
        final Document document = call.createDocument(properties, null, VersioningState.MAJOR);
        return ResponseEntity.ok(CMISUtil.convertToProperties(document));
    }

    @Operation(summary = "Aggiorna un componente della commissione")
    @PutMapping("/{id}/commission/{memberId}")
    public ResponseEntity<Map<String, Object>> updateCommissionMember(HttpServletRequest req, @PathVariable String id,
                                                                      @PathVariable String memberId,
                                                                      @RequestBody Map<String, Object> body) throws ParseException {
        final Folder call = checkManager(req, id);
        final Session session = cmisService.getCurrentCMISSession(req);
        final Document member = commissionMember(session, memberId);
        final String oldUsername = member.getPropertyValue(COMMISSIONE_USERNAME);
        if (oldUsername != null && commissionMembers(req, call).contains(oldUsername) &&
                !Objects.equals(oldUsername, body.get(COMMISSIONE_USERNAME))) {
            throw new ClientMessageException("message.commission.member.enabled");
        }
        final Map<String, Object> request = new HashMap<>(body);
        request.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_COMMISSIONE_METADATA.value());
        final Map<String, Object> properties = nodeMetadataService.populateMetadataType(session, request, req);
        properties.remove(PropertyIds.OBJECT_TYPE_ID);
        properties.remove(PropertyIds.OBJECT_ID);
        properties.remove(PropertyIds.NAME);
        return ResponseEntity.ok(CMISUtil.convertToProperties((CmisObject) member.updateProperties(properties, true)));
    }

    @Operation(summary = "Elimina un componente della commissione non abilitato")
    @DeleteMapping("/{id}/commission/{memberId}")
    public ResponseEntity<Void> deleteCommissionMember(HttpServletRequest req, @PathVariable String id, @PathVariable String memberId) {
        final Folder call = checkManager(req, id);
        final Document member = commissionMember(cmisService.getCurrentCMISSession(req), memberId);
        final String username = member.getPropertyValue(COMMISSIONE_USERNAME);
        if (username != null && commissionMembers(req, call).contains(username)) {
            throw new ClientMessageException("message.commission.member.enabled");
        }
        member.delete(true);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Abilita o disabilita un commissario (aggiunta o rimozione dal gruppo della commissione)",
            description = "Se e' attivo il controllo sulla parita' di genere e il commissario non ha visto il video, " +
                    "l'abilitazione restituisce 409 a meno che non venga passato force=true")
    @PostMapping("/{id}/commission/{memberId}/enabled")
    public ResponseEntity<Map<String, Object>> enableCommissionMember(HttpServletRequest req, @PathVariable String id,
                                                                      @PathVariable String memberId,
                                                                      @RequestParam("enabled") Boolean enabled,
                                                                      @RequestParam(value = "force", defaultValue = "false") Boolean force) {
        final Folder call = checkManager(req, id);
        final BindingSession bindingSession = cmisService.getCurrentBindingSession(req);
        final Document member = commissionMember(cmisService.getCurrentCMISSession(req), memberId);
        final String username = Optional.ofNullable(member.<String>getPropertyValue(COMMISSIONE_USERNAME))
                .filter(s -> RUOLI_ABILITABILI.contains(member.<String>getPropertyValue(COMMISSIONE_RUOLO)))
                .orElseThrow(() -> new ClientMessageException("message.commission.member.not.enabled"));
        final String group = groupName(call, JCONONPropertyIds.CALL_COMMISSIONE);
        if (enabled) {
            if (Boolean.TRUE.equals(commissionConfProperties.getGender()) && !force && !hasWatchedVideo(bindingSession, username)) {
                final Map<String, Object> result = new HashMap<>();
                result.put("enabled", false);
                result.put("videoGenderMissing", true);
                return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
            }
            groupService.addAuthority(bindingSession, group, username);
        } else {
            removeFromGroup(bindingSession, group, username);
        }
        evictUserCache(username);
        return ResponseEntity.ok(Collections.singletonMap("enabled", enabled));
    }

    /* ------------------------------------------------------------------ */
    /* Video sulla parita' di genere                                         */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Configurazione del video sulla parita' di genere e stato per l'utente corrente")
    @GetMapping("/commission-gender")
    public ResponseEntity<Map<String, Object>> commissionGender(HttpServletRequest req) {
        final CMISUser user = currentUser(req);
        final Map<String, Object> result = new HashMap<>();
        result.put("enabled", Boolean.TRUE.equals(commissionConfProperties.getGender()));
        result.put("url_it", commissionConfProperties.getUrl_it());
        result.put("url_en", commissionConfProperties.getUrl_en());
        result.put("watched", hasWatchedVideo(cmisService.getCurrentBindingSession(req), user.getUserName()));
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Registra che l'utente corrente ha visto il video sulla parita' di genere")
    @PostMapping("/commission-gender/watched")
    public ResponseEntity<Map<String, Object>> commissionGenderWatched(HttpServletRequest req) {
        final CMISUser user = currentUser(req);
        final BindingSession bindingSession = cmisService.getCurrentBindingSession(req);
        final JsonNode person = person(bindingSession, user.getUserName());
        final String service = String.join("/", "api/metadata/node",
                person.path("store-protocol").asText("workspace"),
                person.path("store-identifier").asText("SpacesStore"),
                person.path("node-uuid").asText());
        webScriptClient.post(bindingSession, service,
                Collections.singletonMap("properties", Collections.singletonMap(VIDEO_GENDER_PROPERTY, Boolean.TRUE)));
        evictUserCache(user.getUserName());
        return ResponseEntity.ok(Collections.singletonMap("watched", Boolean.TRUE));
    }

    /* ------------------------------------------------------------------ */
    /* Allegati del macro-bando                                             */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Collega un allegato del macro-bando a tutti i bandi figli")
    @PostMapping("/{id}/attachments/{documentId}/link-children")
    public ResponseEntity<Map<String, Integer>> linkToChildren(HttpServletRequest req, @PathVariable String id, @PathVariable String documentId) {
        checkManager(req, id);
        return ResponseEntity.ok(Collections.singletonMap("count",
                callService.linkToCallChild(cmisService.getCurrentCMISSession(req), id, documentId)));
    }

    @Operation(summary = "Copia un allegato del macro-bando in tutti i bandi figli")
    @PostMapping("/{id}/attachments/{documentId}/copy-children")
    public ResponseEntity<Map<String, Integer>> copyToChildren(HttpServletRequest req, @PathVariable String id, @PathVariable String documentId) {
        checkManager(req, id);
        return ResponseEntity.ok(Collections.singletonMap("count",
                callService.copyToCallChild(cmisService.getCurrentCMISSession(req), id, documentId)));
    }

    /* ------------------------------------------------------------------ */

    @ExceptionHandler(ClientMessageException.class)
    public ResponseEntity<Map<String, String>> handleClientMessage(ClientMessageException e) {
        LOGGER.warn("Manage call error: {}", e.getMessage());
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
    }

    private CMISUser currentUser(HttpServletRequest req) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    private boolean isConcorsi(CMISUser user) {
        return user.isAdmin() || callService.isMemberOfConcorsiGroup(user);
    }

    /**
     * Amministratori e gruppo CONCORSI (come i permessi e la gestione RdP del frontend legacy).
     */
    private void checkConcorsi(HttpServletRequest req) {
        if (!isConcorsi(currentUser(req))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private Folder checkConcorsiOnCall(HttpServletRequest req, String id) {
        checkConcorsi(req);
        return folder(cmisService.getCurrentCMISSession(req), id);
    }

    /**
     * Amministratori, gruppo CONCORSI e responsabili (RdP) del bando.
     */
    private Folder checkManager(HttpServletRequest req, String id) {
        final CMISUser user = currentUser(req);
        final Folder call = folder(cmisService.getCurrentCMISSession(req), id);
        if (!isConcorsi(user) && !callService.isMemberOfRDPGroup(user, call)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return call;
    }

    private Folder folder(Session session, String id) {
        return Optional.ofNullable(session.getObject(id))
                .filter(Folder.class::isInstance)
                .map(Folder.class::cast)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    private Document commissionMember(Session session, String memberId) {
        return Optional.ofNullable(session.getObject(memberId))
                .filter(Document.class::isInstance)
                .map(Document.class::cast)
                .filter(document -> document.getType().getId().equals(JCONONDocumentType.JCONON_COMMISSIONE_METADATA.value()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    private String nodeRef(Session session, String id) {
        return session.getObject(id).getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString();
    }

    private String groupName(Folder call, JCONONPropertyIds property) {
        final String name = Optional.ofNullable(call.<String>getPropertyValue(property.value()))
                .filter(s -> !s.isEmpty())
                .orElseThrow(() -> new ClientMessageException("message.call.group.missing"));
        return name.startsWith(GROUP_PREFIX) ? name : GROUP_PREFIX.concat(name);
    }

    private List<String> commissionMembers(HttpServletRequest req, Folder call) {
        try {
            return userService.findMembers(groupName(call, JCONONPropertyIds.CALL_COMMISSIONE), cmisService.getCurrentBindingSession(req));
        } catch (RuntimeException e) {
            LOGGER.warn("Unable to read commission members for call {}", call.getId(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Il webscript di rimozione richiede il nodeRef del gruppo padre, ricavato dalla ricerca per nome.
     */
    private void removeFromGroup(BindingSession bindingSession, String groupName, String authority) {
        final JsonNode groups = webScriptClient.get(bindingSession, "cnr/groups/autocomplete-group",
                Collections.singletonMap("filter", Collections.singletonList(groupName)));
        final String parentNodeRef = StreamSupport.stream(groups.path("groups").spliterator(), false)
                .filter(group -> groupName.equals(group.path("authorityName").asText()))
                .map(group -> group.path("nodeRef").asText(null))
                .filter(Objects::nonNull)
                .findFirst()
                .orElseThrow(() -> new ClientMessageException("message.call.group.missing"));
        final Map<String, List<String>> params = new HashMap<>();
        params.put("parentNodeRef", Collections.singletonList(parentNodeRef));
        params.put("childFullName", Collections.singletonList(authority));
        webScriptClient.delete(bindingSession, "cnr/groups/children", params);
    }

    /**
     * Come DELETE /rest/common: le abilitazioni dell'utente cambiano, quindi si svuotano le sue cache.
     */
    private void evictUserCache(String userName) {
        commonRepository.evictEnableTypeCalls(userName);
        commonRepository.evictManagersCall(userName);
        commonRepository.evictCommissionCalls(userName);
    }

    private JsonNode person(BindingSession bindingSession, String userName) {
        return webScriptClient.get(bindingSession, "cnr/person/person/" + userName,
                Collections.singletonMap("groups", Collections.singletonList("false")));
    }

    private boolean hasWatchedVideo(BindingSession bindingSession, String userName) {
        try {
            return person(bindingSession, userName).path(VIDEO_GENDER).asBoolean(false);
        } catch (RuntimeException e) {
            LOGGER.warn("Unable to read video gender flag for {}", userName, e);
            return false;
        }
    }

    @Data
    public static class LabelRequest {
        private String key;
        private String oldLabel;
        private String newLabel;
        private boolean delete;
    }

    @Data
    public static class AclRequest {
        private String authority;
        private ACLType role;
    }
}
