package it.cnr.si.cool.jconon.rest.openapi.controllers;

import it.cnr.cool.security.service.UserService;
import it.cnr.cool.util.Pair;
import it.cnr.si.cool.jconon.config.CustomKeyCloakAuthSuccessHandler;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.AbstractMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping(ApiRoutes.V1_SECURITY)
public class SSOSecurityController {
    private static final Logger LOGGER = LoggerFactory.getLogger(SSOSecurityController.class);

    @Autowired
    private CustomKeyCloakAuthSuccessHandler customKeyCloakAuthSuccessHandler;

    @Autowired
    private UserService userService;

    @GetMapping("/sso/login")
    public ResponseEntity<Map<String, Object>> login(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        final Optional<KeycloakAuthenticationToken> keycloakAuthenticationToken = Optional.ofNullable(req.getUserPrincipal())
                .filter(KeycloakAuthenticationToken.class::isInstance)
                .map(KeycloakAuthenticationToken.class::cast);
        if (keycloakAuthenticationToken.isPresent()) {
            Optional<Pair<String, String>> ticketOpt = customKeyCloakAuthSuccessHandler.authentication(req, res, keycloakAuthenticationToken.get(), false);
            if (ticketOpt.isPresent()) {
                return ResponseEntity.ok().body(
                        Stream.of(
                                new AbstractMap.SimpleEntry<>("ticket", ticketOpt.get().getFirst()),
                                new AbstractMap.SimpleEntry<>("user", userService.loadUserForConfirm(ticketOpt.get().getSecond())),
                                new AbstractMap.SimpleEntry<>("expires_in", 3600),
                                new AbstractMap.SimpleEntry<>("valid_until", LocalDateTime.now().plusHours(1)
                                        .toInstant(ZoneOffset.UTC).toEpochMilli())
                        ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                );
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

}
