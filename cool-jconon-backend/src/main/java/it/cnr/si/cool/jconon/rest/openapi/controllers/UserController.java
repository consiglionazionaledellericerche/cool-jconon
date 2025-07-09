package it.cnr.si.cool.jconon.rest.openapi.controllers;

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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Locale;
import java.util.Optional;

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
    @Autowired
    private CMISService cmisService;

    @Autowired
    private UserService userService;
    @Autowired
    private CreateAccountService createAccountService;

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

}
