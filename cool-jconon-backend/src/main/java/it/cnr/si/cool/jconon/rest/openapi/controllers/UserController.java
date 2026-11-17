package it.cnr.si.cool.jconon.rest.openapi.controllers;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.CreateAccountService;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.*;

@RestController
@RequestMapping(ApiRoutes.V1_USER)
@Tag(name = "User", description = "Gestione delle Utenza")
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
public class UserController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);
    public static final String CNRPERSON_CODICEFISCALE = "{http://www.cnr.it/model/cnrperson}codicefiscale";
    @Autowired
    private CMISService cmisService;

    @Autowired
    private UserService userService;
    @Autowired
    private CreateAccountService createAccountService;
    @Autowired
    private it.cnr.si.cool.jconon.rest.openapi.utils.AlfrescoWebScriptClient webScriptClient;
    @Value("${cookie.secure}")
    private Boolean cookieSecure;


    @GetMapping("/existingemail")
    public ResponseEntity<Boolean> existingemail(HttpServletRequest req,
                                                 @RequestParam("email") String email,
                                                 @RequestParam("id") String id) {
        Optional<CMISUser> optionalCMISUser = Optional.ofNullable(email)
                .filter(s -> !s.isEmpty())
                .flatMap(s -> Optional.ofNullable(userService.findUserByEmail(email, cmisService.getCurrentBindingSession(req))));
        return ResponseEntity.ok().body(optionalCMISUser.isPresent() &&
                Optional.ofNullable(id).map(s -> !s.equals(optionalCMISUser.get().getUserName())).orElse(Boolean.TRUE));
    }

    @GetMapping("/existingcodicefiscale")
    public ResponseEntity<Boolean> existingcodicefiscale(HttpServletRequest req,
                                                         @RequestParam("codicefiscale") String codicefiscale,
                                                         @RequestParam("id") String id) {
        Optional<CMISUser> optionalCMISUser = Optional.ofNullable(codicefiscale)
                .filter(s -> !s.isEmpty())
                .flatMap(s -> Optional.ofNullable(userService.findUserByCodiceFiscale(codicefiscale, cmisService.getCurrentBindingSession(req))));
        return ResponseEntity.ok().body(optionalCMISUser.isPresent() &&
                Optional.ofNullable(id).map(s -> !s.equals(optionalCMISUser.get().getUserName())).orElse(Boolean.TRUE));
    }

    @GetMapping(ApiRoutes.SAME_TAX_CODE)
    public ResponseEntity<List<CMISUser>> sameTaxCode(HttpServletRequest req) {
        CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user != null) {
            if (Optional.ofNullable(user.getApplication()).isPresent() ||
                    Optional.ofNullable(user.getEmailcertificatoperpuk()).isPresent() ||
                    Optional.ofNullable(user.getImmutability())
                            .map(Map::keySet)
                            .orElse(Collections.emptySet())
                            .stream()
                            .anyMatch(s -> s.equalsIgnoreCase(CNRPERSON_CODICEFISCALE))) {
                return ResponseEntity.ok().body(
                        userService.findUsersByCodiceFiscale(
                                user.getCodicefiscale(),
                                cmisService.getCurrentBindingSession(req)
                        )
                );
            }
        }
        return ResponseEntity.ok().body(Collections.emptyList());
    }

    @GetMapping(ApiRoutes.CHANGE_USER)
    public ResponseEntity<Void> changeUser(HttpServletRequest req, HttpServletResponse res, @Parameter(description = "Username", required = true) @PathVariable("id") String username) {
        CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user != null) {
            if (Optional.ofNullable(user.getApplication()).isPresent() ||
                    Optional.ofNullable(user.getEmailcertificatoperpuk()).isPresent() ||
                    Optional.ofNullable(user.getImmutability())
                            .map(Map::keySet)
                            .orElse(Collections.emptySet())
                            .stream()
                            .anyMatch(s -> s.equalsIgnoreCase(CNRPERSON_CODICEFISCALE))) {
                CMISUser newUser = userService.loadUserForConfirm(username);
                if (newUser.getCodicefiscale().equalsIgnoreCase(user.getCodicefiscale())) {
                    String ticketForUser = userService.createTicketForUser(newUser.getUserName());
                    res.addCookie(getCookie(ticketForUser, req.isSecure()));
                }
            }
        }
        return ResponseEntity
                .status(HttpStatus.SEE_OTHER)
                .header(HttpHeaders.LOCATION, "/")
                .build();
    }

    @PutMapping(ApiRoutes.UPDATE)
    public ResponseEntity<CMISUser> update(HttpServletRequest req, @Valid @RequestBody CMISUser cmisUser) {
        if (Optional.ofNullable(cmisUser.getUserName())
                    .filter(s -> s.equals(cmisService.getCMISUserFromSession(req).getUserName())).isPresent()) {
            cmisUser.getOther().entrySet().stream()
                    .forEach(stringObjectEntry -> cmisUser.setOther(stringObjectEntry.getKey(), stringObjectEntry.getValue()));
            return ResponseEntity.ok().body(createAccountService.update(cmisUser, Locale.ITALY));
        }
        return ResponseEntity.badRequest().build();
    }


    @PostMapping(ApiRoutes.CREATE)
    public ResponseEntity<CMISUser> create(HttpServletRequest req, @Valid @RequestBody CMISUser cmisUser) {
        return ResponseEntity.ok().body(createAccountService.create(cmisUser, Locale.ITALY, getUrl(req)));
    }

    static String getUrl(HttpServletRequest req) {
        return req.getScheme() + "://" +
                Optional.ofNullable(req.getHeader("Host")).orElseGet(() -> req.getServerName() + ":"
                        + req.getServerPort()) + req.getContextPath();
    }


    private Cookie getCookie(String ticket, boolean secure) {
        int maxAge = ticket == null ? 0 : 3600;
        Cookie cookie = new Cookie("ticket", ticket);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        cookie.setSecure(secure && cookieSecure);
        cookie.setHttpOnly(true);
        return cookie;
    }


    /**
     * Autocompletamento di utenti o gruppi (commissione, responsabili, HelpDesk, permessi), come il widget legacy
     * cnr.ui.authority: webscript autocomplete-person / autocomplete-group con la sessione dell'utente,
     * filtro "*testo*", al più maxItems risultati. Restituisce un elenco uniforme: id, title, subtitle, kind.
     */
    @GetMapping("/authorities")
    public ResponseEntity<Map<String, Object>> authorities(HttpServletRequest req,
                                                           @RequestParam("filter") String filter,
                                                           @RequestParam(value = "type", defaultValue = "users") String type,
                                                           @RequestParam(value = "maxItems", defaultValue = "10") Integer maxItems) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        final String term = Optional.ofNullable(filter).map(String::trim).orElse("").replaceAll("[\"\\\\*]", "");
        final List<Map<String, Object>> items = new ArrayList<>();
        if (term.length() >= 2) {
            final Map<String, List<String>> params = new HashMap<>();
            params.put("filter", Collections.singletonList("*" + term + "*"));
            params.put("maxItems", Collections.singletonList(String.valueOf(Math.max(1, Math.min(maxItems, 50)))));
            final boolean groups = "groups".equalsIgnoreCase(type) || "group".equalsIgnoreCase(type);
            final com.fasterxml.jackson.databind.JsonNode result = webScriptClient.get(cmisService.getCurrentBindingSession(req),
                    groups ? "cnr/groups/autocomplete-group" : "cnr/person/autocomplete-person", params);
            final com.fasterxml.jackson.databind.JsonNode list = result == null ? null : result.get(groups ? "groups" : "people");
            if (list != null && list.isArray()) {
                list.forEach(node -> {
                    final Map<String, Object> item = new HashMap<>();
                    if (groups) {
                        final String id = node.path("authorityName").asText(node.path("shortName").asText());
                        item.put("id", id);
                        item.put("title", node.path("displayName").asText(id));
                        item.put("subtitle", id);
                        item.put("kind", "group");
                    } else {
                        final String id = node.path("userName").asText();
                        final String name = (node.path("lastName").asText("") + " " + node.path("firstName").asText("")).trim();
                        item.put("id", id);
                        item.put("title", name.isEmpty() ? id : name);
                        item.put("subtitle", node.path("email").asText("").isEmpty() ? id : id + " · " + node.path("email").asText());
                        item.put("kind", "user");
                        item.put("firstName", node.path("firstName").asText(""));
                        item.put("lastName", node.path("lastName").asText(""));
                        item.put("email", node.path("email").asText(""));
                    }
                    if (!String.valueOf(item.get("id")).isEmpty()) {
                        items.add(item);
                    }
                });
            }
        }
        return ResponseEntity.ok(Collections.singletonMap("items", items));
    }
}
