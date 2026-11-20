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
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.BulkInfoCoolSerializer;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.service.CreateAccountService;
import it.cnr.cool.service.typestree.Type;
import it.cnr.cool.service.typestree.TypesTreeService;
import it.cnr.cool.util.GroupsUtils;
import it.cnr.cool.util.UriUtils;
import it.cnr.cool.web.PermissionService;
import it.cnr.si.cool.jconon.repository.CacheRepository;
import it.cnr.si.cool.jconon.rest.openapi.utils.AlfrescoWebScriptClient;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import lombok.Data;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * Funzioni di amministrazione esposte come OpenAPI per il frontend selezioni-online.
 * Sostituiscono le pagine legacy groups, gestori, gestione-utenti, rbac-admin, editView e jsConsole.
 * L'accesso segue gli stessi id RBAC delle pagine legacy (groups, gestori, gestione-utenti, rbac-admin, jsConsole);
 * le operazioni di scrittura sugli utenti, cache e viste sono riservate agli amministratori. Le chiamate verso i webscript Alfresco
 * avvengono con la sessione dell'utente, per cui restano validi anche i controlli lato Alfresco.
 */
@RestController
@RequestMapping(ApiRoutes.V1_ADMIN)
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Admin", description = "Amministrazione: gruppi, utenti, RBAC, cache, viste e console")
public class AdminController {
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminController.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();
    public static final String ZONE_GESTORI = "AUTH.EXT.gestori";
    public static final String RBAC_GROUPS = "groups";
    public static final String RBAC_GESTORI = "gestori";
    public static final String RBAC_USERS = "gestione-utenti";
    public static final String RBAC_ADMIN = "rbac-admin";
    public static final String RBAC_JS_CONSOLE = "jsConsole";
    private static final List<String> DEFAULT_TYPE_SEEDS = Arrays.asList(
            "F:jconon_call:folder",
            "F:jconon_application:folder",
            "D:jconon_attachment:document"
    );

    @Autowired
    private CMISService cmisService;
    @Autowired
    private AlfrescoWebScriptClient webScriptClient;
    @Autowired
    private UserService userService;
    @Autowired
    private CreateAccountService createAccountService;
    @Autowired
    private PermissionService permissionService;
    @Autowired
    private CacheRepository cacheRepository;
    @Autowired
    private TypesTreeService typesTreeService;
    @Autowired
    private BulkInfoCoolService bulkInfoCoolService;
    @Autowired
    private BulkInfoCoolSerializer bulkInfoCoolSerializer;

    /* ------------------------------------------------------------------ */
    /* Gruppi e gestori                                                    */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Nodo radice dell'albero dei gruppi")
    @GetMapping("/groups/root")
    public ResponseEntity<JsonNode> groupsRoot(HttpServletRequest req) {
        return ResponseEntity.ok(webScriptClient.get(authorizedSession(req, RBAC_GROUPS, RBAC_GESTORI), "cnr/groups/root", Collections.emptyMap()));
    }

    @Operation(summary = "Figli (gruppi e utenti) di un gruppo; senza fullName restituisce i gruppi di primo livello")
    @GetMapping("/groups/children")
    public ResponseEntity<JsonNode> groupChildren(HttpServletRequest req,
                                                  @RequestParam(value = "fullName", required = false) String fullName,
                                                  @RequestParam(value = "zones", required = false) String zones) {
        final Map<String, List<String>> params = new HashMap<>();
        params.put("fullName", Collections.singletonList(fullName));
        params.put("zones", Collections.singletonList(zones));
        return ResponseEntity.ok(webScriptClient.get(authorizedSession(req, RBAC_GROUPS, RBAC_GESTORI), "cnr/groups/children", params));
    }

    @Operation(summary = "Ricerca di gruppi per nome")
    @GetMapping("/groups/search")
    public ResponseEntity<JsonNode> searchGroups(HttpServletRequest req,
                                                 @RequestParam("filter") String filter,
                                                 @RequestParam(value = "maxItems", required = false, defaultValue = "50") Integer maxItems) {
        final Map<String, List<String>> params = new HashMap<>();
        params.put("filter", Collections.singletonList(filter));
        params.put("maxItems", Collections.singletonList(String.valueOf(maxItems)));
        return ResponseEntity.ok(webScriptClient.get(authorizedSession(req, RBAC_GROUPS, RBAC_GESTORI), "cnr/groups/autocomplete-group", params));
    }

    @Operation(summary = "Utenti appartenenti (anche indirettamente) a un gruppo")
    @GetMapping("/groups/members")
    public ResponseEntity<List<String>> groupMembers(HttpServletRequest req, @RequestParam("groupName") String groupName) {
        return ResponseEntity.ok(userService.findMembers(groupName, authorizedSession(req, RBAC_GROUPS, RBAC_GESTORI)));
    }

    @Operation(summary = "Metadati di un gruppo (es. tipologia di bando e sede per i gruppi gestori)")
    @GetMapping("/groups/metadata")
    public ResponseEntity<JsonNode> groupMetadata(HttpServletRequest req, @RequestParam("nodeRef") String nodeRef) {
        final Map<String, List<String>> params = new HashMap<>();
        params.put("nodeRef", Collections.singletonList(nodeRef.split(";")[0]));
        params.put("shortQNames", Collections.singletonList("true"));
        return ResponseEntity.ok(webScriptClient.get(authorizedSession(req, RBAC_GROUPS, RBAC_GESTORI), "api/metadata", params));
    }

    @Operation(summary = "Crea un gruppo, oppure ne aggiorna le proprieta' aggiuntive se esiste gia'")
    @PostMapping("/groups")
    public ResponseEntity<JsonNode> saveGroup(HttpServletRequest req, @RequestBody GroupRequest group) {
        if (group.getGroup_name() == null || group.getGroup_name().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "group_name is required");
        }
        return ResponseEntity.ok(webScriptClient.post(authorizedSession(req, RBAC_GROUPS, RBAC_GESTORI), "cnr/groups/group", group));
    }

    @Operation(summary = "Crea un gruppo gestori nella zona AUTH.EXT.gestori")
    @PostMapping("/gestori")
    public ResponseEntity<JsonNode> saveGestori(HttpServletRequest req, @RequestBody GroupRequest group) {
        final BindingSession session = authorizedSession(req, RBAC_GESTORI);
        if (group.getGroup_name() == null || group.getGroup_name().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "group_name is required");
        }
        group.setZones(Arrays.asList(ZONE_GESTORI, "APP.DEFAULT"));
        return ResponseEntity.ok(webScriptClient.post(session, "cnr/groups/group", group));
    }

    @Operation(summary = "Elimina un gruppo")
    @DeleteMapping("/groups")
    public ResponseEntity<JsonNode> deleteGroup(HttpServletRequest req,
                                                @RequestParam("groupName") String groupName,
                                                @RequestParam(value = "cascade", defaultValue = "false") Boolean cascade) {
        final Map<String, List<String>> params = new HashMap<>();
        params.put("group_name", Collections.singletonList(groupName));
        params.put("cascade", Collections.singletonList(String.valueOf(cascade)));
        return ResponseEntity.ok(webScriptClient.delete(authorizedSession(req, RBAC_GROUPS, RBAC_GESTORI), "cnr/groups/group", params));
    }

    @Operation(summary = "Aggiunge un utente o un gruppo come membro di un gruppo")
    @PostMapping("/groups/children")
    public ResponseEntity<JsonNode> addGroupChild(HttpServletRequest req, @RequestBody GroupChildRequest child) {
        return ResponseEntity.ok(webScriptClient.post(authorizedSession(req, RBAC_GROUPS, RBAC_GESTORI), "cnr/groups/children", child));
    }

    @Operation(summary = "Rimuove un membro da un gruppo")
    @DeleteMapping("/groups/children")
    public ResponseEntity<JsonNode> removeGroupChild(HttpServletRequest req,
                                                     @RequestParam("parentNodeRef") String parentNodeRef,
                                                     @RequestParam("childFullName") String childFullName) {
        final Map<String, List<String>> params = new HashMap<>();
        params.put("parentNodeRef", Collections.singletonList(parentNodeRef));
        params.put("childFullName", Collections.singletonList(childFullName));
        return ResponseEntity.ok(webScriptClient.delete(authorizedSession(req, RBAC_GROUPS, RBAC_GESTORI), "cnr/groups/children", params));
    }

    /* ------------------------------------------------------------------ */
    /* Utenti                                                               */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Ricerca utenti; con smart=true la ricerca e' per sottostringa")
    @GetMapping("/users")
    public ResponseEntity<JsonNode> searchUsers(HttpServletRequest req,
                                                @RequestParam(value = "firstName", required = false) String firstName,
                                                @RequestParam(value = "lastName", required = false) String lastName,
                                                @RequestParam(value = "userName", required = false) String userName,
                                                @RequestParam(value = "matricola", required = false) String matricola,
                                                @RequestParam(value = "codicefiscale", required = false) String codicefiscale,
                                                @RequestParam(value = "email", required = false) String email,
                                                @RequestParam(value = "smart", defaultValue = "true") Boolean smart) {
        final Map<String, String> fields = new LinkedHashMap<>();
        fields.put("firstName", firstName);
        fields.put("lastName", lastName);
        fields.put("userName", userName);
        fields.put("matricola", matricola);
        fields.put("codicefiscale", codicefiscale);
        fields.put("email", email);
        final List<String> filters = new ArrayList<>();
        fields.forEach((key, value) -> Optional.ofNullable(value)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> s.replaceAll("[\"\\\\]", ""))
                .ifPresent(s -> filters.add(key + ":" + (smart ? "*" + s + "*" : s))));
        if (filters.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one filter is required");
        }
        return ResponseEntity.ok(webScriptClient.get(authorizedSession(req, RBAC_USERS), "cnr/person/people",
                Collections.singletonMap("filter", filters)));
    }

    @Operation(summary = "Dettaglio di un utente")
    @GetMapping("/users/{userName:.+}")
    public ResponseEntity<CMISUser> user(HttpServletRequest req, @PathVariable String userName) {
        authorizedSession(req, RBAC_USERS);
        return ResponseEntity.ok(userService.loadUserForConfirm(userName));
    }

    @Operation(summary = "Gruppi di appartenenza di un utente")
    @GetMapping("/users/{userName:.+}/groups")
    public ResponseEntity<JsonNode> userGroups(HttpServletRequest req, @PathVariable String userName) {
        return ResponseEntity.ok(webScriptClient.get(authorizedSession(req, RBAC_USERS),
                "cnr/person/person/" + UriUtils.encode(userName),
                Collections.singletonMap("groups", Collections.singletonList("true"))));
    }

    @Operation(summary = "Aggiorna l'anagrafica di un utente",
            description = "Stessi campi e stesso percorso della modifica legacy (PUT /rest/security/create-account): "
                    + "firstName, lastName, email, straniero, codicefiscale, sesso, dataDiNascita (yyyy-MM-dd'T'HH:mm:ss.SSSXXX), statoestero")
    @PutMapping("/users/{userName:.+}")
    public ResponseEntity<CMISUser> updateUser(HttpServletRequest req, @PathVariable String userName,
                                               @RequestBody Map<String, Object> body) {
        adminSession(req);
        return ResponseEntity.ok(UserController.updateAsLegacy(createAccountService, userName, body, req.getLocale()));
    }

    @Operation(summary = "Elimina un utente")
    @DeleteMapping("/users/{userName:.+}")
    public ResponseEntity<JsonNode> deleteUser(HttpServletRequest req, @PathVariable String userName) {
        final CMISUser current = currentAdmin(req);
        if (current.getUserName().equalsIgnoreCase(userName)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete the current user");
        }
        return ResponseEntity.ok(webScriptClient.delete(adminSession(req),
                "cnr/person/person/" + UriUtils.encode(userName), Collections.emptyMap()));
    }

    @Operation(summary = "Abilita o disabilita l'account di un utente")
    @PostMapping("/users/{userName:.+}/enabled")
    public ResponseEntity<Map<String, Boolean>> enableUser(HttpServletRequest req, @PathVariable String userName,
                                                           @RequestParam("enabled") Boolean enabled) {
        final CMISUser current = currentAdmin(req);
        if (!enabled && current.getUserName().equalsIgnoreCase(userName)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot disable the current user");
        }
        if (enabled) {
            userService.enableAccount(userName);
        } else {
            userService.disableAccount(userName);
        }
        return ResponseEntity.ok(Collections.singletonMap("enabled", enabled));
    }

    /* ------------------------------------------------------------------ */
    /* RBAC                                                                 */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Configurazione RBAC completa")
    @GetMapping(value = "/rbac", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> rbac(HttpServletRequest req) {
        authorizedSession(req, RBAC_ADMIN);
        return ResponseEntity.ok(permissionService.getRbacAsString());
    }

    @Operation(summary = "Aggiunge un permesso RBAC")
    @PostMapping("/rbac")
    public ResponseEntity<Void> addPermission(HttpServletRequest req, @RequestBody PermissionRequest permission) {
        currentAdmin(req);
        LOGGER.info("RBAC add {}", permission);
        if (!permissionService.add(permission.getId(), permission.getMethod(), permission.getList(),
                permission.getType(), permission.getAuthority())) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to perform INSERT");
        }
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Rimuove un permesso RBAC")
    @DeleteMapping("/rbac")
    public ResponseEntity<Void> deletePermission(HttpServletRequest req,
                                                 @RequestParam("id") String id,
                                                 @RequestParam("method") PermissionService.methods method,
                                                 @RequestParam("list") PermissionService.lists list,
                                                 @RequestParam("type") PermissionService.types type,
                                                 @RequestParam(value = "authority", required = false) String authority) {
        currentAdmin(req);
        LOGGER.info("RBAC delete {} {} {} {} {}", id, method, list, type, authority);
        if (!permissionService.delete(id, method, list, type, authority)) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to perform DELETE");
        }
        return ResponseEntity.ok().build();
    }

    /* ------------------------------------------------------------------ */
    /* Cache                                                                */
    /* ------------------------------------------------------------------ */

    public enum CacheName {
        bulkinfo, application, call, jasper, sedi, labels, types, all
    }

    @Operation(summary = "Svuota una cache applicativa, oppure tutte con 'all'")
    @PostMapping("/cache/reset/{name}")
    public ResponseEntity<Map<String, String>> resetCache(HttpServletRequest req, @PathVariable CacheName name) {
        currentAdmin(req);
        switch (name) {
            case bulkinfo: cacheRepository.resetCacheBulkInfo(); break;
            case application: cacheRepository.resetCacheApplication(); break;
            case call: cacheRepository.resetCacheCall(); break;
            case jasper: cacheRepository.resetCacheJasper(); break;
            case sedi: cacheRepository.resetCacheSediSiper(); break;
            case labels: cacheRepository.resetCacheLabels(); break;
            case types: cacheRepository.resetCacheTypes(); break;
            case all:
                cacheRepository.resetCacheBulkInfo();
                cacheRepository.resetCacheApplication();
                cacheRepository.resetCacheCall();
                cacheRepository.resetCacheJasper();
                cacheRepository.resetCacheSediSiper();
                cacheRepository.resetCacheLabels();
                cacheRepository.resetCacheTypes();
                break;
        }
        LOGGER.info("Cache {} reset by {}", name, cmisService.getCMISUserFromSession(req).getId());
        return ResponseEntity.ok(Collections.singletonMap("reset", name.name()));
    }

    /* ------------------------------------------------------------------ */
    /* Ispettore viste (ex editView)                                        */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Albero dei tipi documentali a partire dai tipi radice indicati")
    @GetMapping("/types-tree")
    public ResponseEntity<List<Type>> typesTree(HttpServletRequest req,
                                                @RequestParam(value = "seeds", required = false) List<String> seeds) {
        currentAdmin(req);
        return ResponseEntity.ok(typesTreeService.getTree(
                Optional.ofNullable(seeds).filter(list -> !list.isEmpty()).orElse(DEFAULT_TYPE_SEEDS)));
    }

    @Operation(summary = "Vista bulkInfo di un tipo (kind: form, find, column)")
    @GetMapping(value = "/bulkinfo/{kind}/{name}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> bulkInfo(HttpServletRequest req,
                                           @RequestParam("type") String type,
                                           @PathVariable String kind,
                                           @PathVariable String name) {
        currentAdmin(req);
        try {
            final Map<String, Object> model = bulkInfoCoolService.getView(
                    cmisService.getCurrentCMISSession(req),
                    cmisService.getCurrentBindingSession(req),
                    type, kind, name, null);
            return ResponseEntity.ok(bulkInfoCoolSerializer.serialize(model).toString());
        } catch (Exception e) {
            LOGGER.error("bulkinfo error {} {} {}", type, kind, name, e);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "BulkInfo not found: " + type);
        }
    }

    /* ------------------------------------------------------------------ */
    /* Console JavaScript                                                   */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Esegue uno script sul repository Alfresco (webscript riservato agli ADMIN)")
    @PostMapping("/js-console")
    public ResponseEntity<JsonNode> jsConsole(HttpServletRequest req, @RequestBody Map<String, String> body) {
        final String command = Optional.ofNullable(body.get("command"))
                .filter(s -> !s.trim().isEmpty())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "command is required"));
        adminSession(req);
        final BindingSession session = authorizedSession(req, RBAC_JS_CONSOLE);
        LOGGER.warn("JS console executed by {}", cmisService.getCMISUserFromSession(req).getId());
        return ResponseEntity.ok(webScriptClient.post(session, "cnr/utils/javascript-execution",
                Collections.singletonMap("command", command)));
    }

    /* ------------------------------------------------------------------ */

    private CMISUser currentAdmin(HttpServletRequest req) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest() || !user.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return user;
    }

    /**
     * Verifica che l'utente sia amministratore oppure autorizzato (GET) su almeno uno degli id RBAC indicati,
     * e restituisce la sua BindingSession.
     */
    private BindingSession authorizedSession(HttpServletRequest req, String... rbacIds) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        final boolean authorized = user.isAdmin() || Arrays.stream(rbacIds)
                .anyMatch(id -> permissionService.isAuthorized(id, PermissionService.methods.GET.name(),
                        user.getId(), GroupsUtils.getGroups(user)));
        if (!authorized) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return cmisService.getCurrentBindingSession(req);
    }

    /**
     * Verifica che l'utente sia amministratore e restituisce la sua BindingSession.
     */
    private BindingSession adminSession(HttpServletRequest req) {
        currentAdmin(req);
        return cmisService.getCurrentBindingSession(req);
    }

    @Data
    public static class GroupRequest {
        private String group_name;
        private String display_name;
        private String parent_group_name;
        private String parent_node_ref;
        private List<String> zones;
        private Map<String, Object> extraProperty;
    }

    @Data
    public static class GroupChildRequest {
        private String parent_group_name;
        private String child_name;
    }

    @Data
    public static class PermissionRequest {
        private String id;
        private PermissionService.methods method;
        private PermissionService.lists list;
        private PermissionService.types type;
        private String authority;
    }
}
