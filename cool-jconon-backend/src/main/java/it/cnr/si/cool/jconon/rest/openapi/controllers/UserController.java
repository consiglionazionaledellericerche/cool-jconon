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
    @Autowired
    private it.cnr.cool.service.I18nService i18nService;
    @Autowired
    private it.cnr.cool.mail.MailService mailService;
    /**
     * Indirizzi del frontend (selezioni-online), separati da virgola: i link nelle mail di registrazione e di
     * recupero password puntano al frontend da cui arriva la richiesta (Origin) se è tra questi.
     * Vuoto: come prima, i link puntano al backend (frontend legacy).
     */
    @Value("${frontend.urls:}")
    private String frontendUrls;

    private static final String RESET_PASSWORD_TEMPLATE = "/pages/security/frontend/account.reset_password.html";


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
    public ResponseEntity<CMISUser> update(HttpServletRequest req, @RequestBody Map<String, Object> body) {
        final String userName = Optional.ofNullable(body.get("userName")).map(String::valueOf).orElse(null);
        if (userName != null && userName.equals(cmisService.getCMISUserFromSession(req).getUserName())) {
            return ResponseEntity.ok().body(updateAsLegacy(createAccountService, userName, body, Locale.ITALY));
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * Aggiornamento dell'anagrafica come la modifica legacy (PUT /rest/security/create-account): i valori diventano
     * parametri di form e cool-common li applica con BeanUtils e i suoi convertitori (anche per la data di nascita,
     * che con la deserializzazione JSON di CMISUser non veniva salvata).
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    static CMISUser updateAsLegacy(CreateAccountService createAccountService, String userName, Map<String, Object> body, Locale locale) {
        final Map form = new HashMap();
        Optional.ofNullable(body).orElse(Collections.emptyMap()).forEach((key, value) -> {
            if (value != null && !(value instanceof Map) && !(value instanceof Collection)) {
                form.put(key, new String[]{String.valueOf(value)});
            }
        });
        form.put("userName", new String[]{userName});
        final Map<String, Object> model = createAccountService.update((Map<String, List<String>>) form, locale);
        return (CMISUser) model.get("user");
    }

    @PostMapping(ApiRoutes.CREATE)
    public ResponseEntity<CMISUser> create(HttpServletRequest req, @Valid @RequestBody CMISUser cmisUser) {
        return ResponseEntity.ok().body(createAccountService.create(cmisUser, Locale.ITALY, frontendUrl(req)));
    }

    /**
     * Conferma dell'utenza dal link della mail di registrazione (pagina /confirm-account del frontend),
     * come /rest/security/confirm-account ma con la risposta in JSON invece del redirect alla login legacy.
     */
    @GetMapping("/confirm-account")
    public ResponseEntity<Map<String, Object>> confirmAccount(HttpServletRequest req,
                                                              @RequestParam("userid") String userId,
                                                              @RequestParam("pin") String pin,
                                                              @CookieValue(value = "__lang", required = false) String lang) {
        final Locale locale = it.cnr.cool.service.I18nService.getLocale(req, lang);
        try {
            final CMISUser user = userService.loadUserForConfirm(userId);
            if (user == null) {
                return error(HttpStatus.NOT_FOUND, i18nService.getLabel("message.user.not.found", locale, userId));
            }
            if (pin != null && !pin.isEmpty() && pin.equals(user.getPin())) {
                user.setDisableAccount(false);
                user.setPin("");
                userService.updateUser(user);
                LOGGER.info("user {} are now enabled", userId);
                return ResponseEntity.ok(Collections.singletonMap("userName", (Object) user.getUserName()));
            }
            if (Boolean.TRUE.equals(user.getEnabled())) {
                return error(HttpStatus.BAD_REQUEST, i18nService.getLabel("message.user.alredy.active", locale, user.getUserName()));
            }
            return error(HttpStatus.FORBIDDEN, i18nService.getLabel("message.pin.not.valid", locale));
        } catch (it.cnr.cool.exception.CoolUserFactoryException e) {
            LOGGER.error("Unable to confirm account, user {}", userId, e);
            return error(HttpStatus.FORBIDDEN, i18nService.getLabel("message.user.not.found", locale, userId));
        }
    }

    /**
     * Recupero password dal frontend: come /rest/security/recover-password + forgotPassword, ma il link della mail
     * porta alla pagina /reset-password del frontend. La risposta non rivela se l'indirizzo esiste.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(HttpServletRequest req, @RequestBody Map<String, String> body,
                                                              @CookieValue(value = "__lang", required = false) String lang) {
        final Locale locale = it.cnr.cool.service.I18nService.getLocale(req, lang);
        final String email = Optional.ofNullable(body).map(b -> b.get("email")).map(String::trim).orElse("");
        if (email.isEmpty()) {
            return error(HttpStatus.BAD_REQUEST, i18nService.getLabel("message.user.not.found", locale, email));
        }
        try {
            final CMISUser found = userService.findUserByEmail(email, cmisService.getAdminSession());
            final CMISUser user = found == null ? null : userService.loadUserForConfirm(found.getUserName());
            if (user == null) {
                LOGGER.info("forgot password: no user for {}", email);
                return ResponseEntity.ok(Collections.singletonMap("sent", (Object) Boolean.TRUE));
            }
            // stessi casi esclusi del legacy: utenze CNR, utenze applicative, utenze non attive
            if (user.getImmutability() != null && !user.getImmutability().isEmpty()) {
                return error(HttpStatus.BAD_REQUEST, i18nService.getLabel("message.error.email.cnr.user", locale));
            }
            if (Optional.ofNullable(user.getApplication()).filter(s -> s.length() > 0).isPresent()) {
                return error(HttpStatus.BAD_REQUEST, i18nService.getLabel("message.error.user.forgot.password.application", locale));
            }
            if (!Boolean.TRUE.equals(user.getEnabled())) {
                return error(HttpStatus.BAD_REQUEST, i18nService.getLabel("message.error.user.is.not.active", locale));
            }
            user.setPin(UUID.randomUUID().toString());
            final CMISUser updated = userService.updateUser(user);
            final Map<String, Object> model = new HashMap<>();
            model.put("account", updated);
            model.put("url", frontendUrl(req));
            final String content = it.cnr.cool.rest.util.Util.processTemplate(model,
                    i18nService.getTemplate(RESET_PASSWORD_TEMPLATE, locale));
            mailService.send(updated.getEmail(), i18nService.getLabel("subject-change-password", locale), content);
            return ResponseEntity.ok(Collections.singletonMap("sent", (Object) Boolean.TRUE));
        } catch (Exception e) {
            LOGGER.error("forgot password failed for {}", email, e);
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "admin.error.generic");
        }
    }

    /** Nuova password con il codice ricevuto per mail (pagina /reset-password del frontend). */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(HttpServletRequest req, @RequestBody Map<String, String> body,
                                                             @CookieValue(value = "__lang", required = false) String lang) {
        final Locale locale = it.cnr.cool.service.I18nService.getLocale(req, lang);
        final String userId = Optional.ofNullable(body).map(b -> b.get("userid")).orElse("");
        final String pin = Optional.ofNullable(body).map(b -> b.get("pin")).orElse("");
        final String password = Optional.ofNullable(body).map(b -> b.get("password")).orElse("");
        if (userId.isEmpty() || pin.isEmpty() || password.length() < 8) {
            return error(HttpStatus.BAD_REQUEST, i18nService.getLabel("message.pin.not.valid", locale));
        }
        try {
            final CMISUser user = userService.loadUserForConfirm(userId);
            if (user == null) {
                return error(HttpStatus.NOT_FOUND, i18nService.getLabel("message.user.not.found", locale, userId));
            }
            if (user.getPin() == null || user.getPin().isEmpty() || !user.getPin().equalsIgnoreCase(pin)) {
                return error(HttpStatus.FORBIDDEN, i18nService.getLabel("message.pin.not.valid", locale));
            }
            user.setPin("");
            userService.updateUser(user);
            userService.changeUserPassword(user, password);
            LOGGER.info("password reset for user {}", userId);
            return ResponseEntity.ok(Collections.singletonMap("userName", (Object) user.getUserName()));
        } catch (it.cnr.cool.exception.CoolUserFactoryException e) {
            LOGGER.warn("unable to reset password for user {}", userId, e);
            return error(HttpStatus.NOT_FOUND, i18nService.getLabel("message.user.not.found", locale, userId));
        }
    }

    private static ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Collections.singletonMap("message", (Object) message));
    }

    /**
     * Indirizzo da usare nei link delle mail: il frontend da cui arriva la richiesta (Origin, o Referer).
     * Con frontend.urls configurato vale solo se è tra quelli (altrimenti il primo dell'elenco); senza
     * configurazione vale se è sullo stesso dominio del backend (es. *.cnr.it) o è localhost, così una richiesta
     * con un'origine qualsiasi non può far inviare mail del CNR con link a siti esterni. Altrimenti il backend.
     */
    String frontendUrl(HttpServletRequest req) {
        final String backend = getUrl(req);
        final String origin = Optional.ofNullable(req.getHeader(HttpHeaders.ORIGIN))
                .filter(o -> !o.isEmpty() && !"null".equals(o))
                .orElseGet(() -> Optional.ofNullable(req.getHeader(HttpHeaders.REFERER))
                        .map(referer -> referer.replaceAll("^(https?://[^/]+).*$", "$1"))
                        .orElse(null));
        final List<String> allowed = new ArrayList<>();
        for (String url : frontendUrls.split(",")) {
            if (!url.trim().isEmpty()) {
                allowed.add(url.trim().replaceAll("/+$", ""));
            }
        }
        if (!allowed.isEmpty()) {
            if (origin != null) {
                for (String url : allowed) {
                    if (url.startsWith(origin.replaceAll("/+$", ""))) {
                        return url;
                    }
                }
            }
            return allowed.get(0);
        }
        if (origin != null && origin.matches("^https?://[^/]+$") && sameDomain(host(origin), host(backend))) {
            return origin;
        }
        return backend;
    }

    private static String host(String url) {
        try {
            return Optional.ofNullable(java.net.URI.create(url).getHost()).orElse("").toLowerCase(Locale.ROOT);
        } catch (IllegalArgumentException e) {
            return "";
        }
    }

    /** Stesso dominio (ultimi due livelli, es. cnr.it) oppure entrambi locali. */
    private static boolean sameDomain(String a, String b) {
        if (a.isEmpty() || b.isEmpty()) {
            return false;
        }
        final List<String> local = Arrays.asList("localhost", "127.0.0.1", "::1", "[::1]");
        if (local.contains(a)) {
            return local.contains(b);
        }
        return domain(a).equals(domain(b));
    }

    private static String domain(String host) {
        final String[] parts = host.split("\\.");
        return parts.length <= 2 ? host : parts[parts.length - 2] + "." + parts[parts.length - 1];
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
