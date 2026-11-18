package it.cnr.si.cool.jconon.rest.openapi.controllers;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.AbstractMap;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping(ApiRoutes.V1_SECURITY)
public class SecurityController {
    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityController.class);

    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;

    @Autowired
    private UserService userService;

    @Autowired
    private CMISService cmisService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(HttpServletRequest req,
                                                     @RequestParam("username") String username,
                                                     @RequestParam("password") String password) {
        Optional<String> ticketOpt = Optional.ofNullable(cmisAuthenticatorFactory.authenticate(username, password));
        if (ticketOpt.isPresent()) {
            return ResponseEntity.ok().body(
                    Stream.of(
                            new AbstractMap.SimpleEntry<>("ticket", ticketOpt.get()),
                            new AbstractMap.SimpleEntry<>("user", userService.loadUserForConfirm(username)),
                            new AbstractMap.SimpleEntry<>("expires_in", 3600),
                            new AbstractMap.SimpleEntry<>("valid_until", LocalDateTime.now().plusHours(1)
                                    .toInstant(ZoneOffset.UTC).toEpochMilli())
                    ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
            );
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Boolean> logout(HttpServletRequest req) {
        Optional.ofNullable(cmisService.extractTicketFromRequest(req)).ifPresent(ticket -> {
            LOGGER.info("logout {}", ticket);
            BindingSession bindingSession = cmisService.getCurrentBindingSession(req);
            String userId = Optional.ofNullable(cmisService.getCMISUserFromSession(req)).map(CMISUser::getUserName).orElse(null);
            String link = cmisService.getBaseURL().concat("service/api/login/ticket/" + ticket);
            UrlBuilder url = new UrlBuilder(link);
            int status = CmisBindingsHelper.getHttpInvoker(bindingSession).invokeDELETE(url, bindingSession).getResponseCode();
            if (status == HttpStatus.OK.value()) {
                LOGGER.debug("logout ok");
                userService.logout(userId);
            } else {
                LOGGER.warn("error while logout");
            }
        });
        return ResponseEntity.ok().body(Boolean.TRUE);
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validate(HttpServletRequest req, @RequestParam(name = "ticket", required = false) String ticket) throws IOException {
        return ResponseEntity.ok().body(Collections.singletonMap("isValid", cmisAuthenticatorFactory.validateTicket(ticket)));
    }
}
