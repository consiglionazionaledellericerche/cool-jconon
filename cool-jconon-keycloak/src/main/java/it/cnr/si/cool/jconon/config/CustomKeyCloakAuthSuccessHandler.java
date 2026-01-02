/*
 * Copyright (C) 2020 Consiglio Nazionale delle Ricerche
 *       This program is free software: you can redistribute it and/or modify
 *        it under the terms of the GNU Affero General Public License as
 *        published by the Free Software Foundation, either version 3 of the
 *        License, or (at your option) any later version.
 *
 *        This program is distributed in the hope that it will be useful,
 *        but WITHOUT ANY WARRANTY; without even the implied warranty of
 *        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *       GNU Affero General Public License for more details.
 *
 *       You should have received a copy of the GNU Affero General Public License
 *       along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
package it.cnr.si.cool.jconon.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.Pair;
import it.cnr.si.cool.jconon.repository.CommonRepository;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.adapters.OidcKeycloakAccount;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationSuccessHandler;
import org.keycloak.adapters.springsecurity.authentication.KeycloakCookieBasedRedirect;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.IDToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.util.UriUtils;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.Charset;
import java.security.Principal;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

public class CustomKeyCloakAuthSuccessHandler extends KeycloakAuthenticationSuccessHandler {

    public static final String SSO = "SSO";
    private final AuthenticationSuccessHandler fallback;
    private final CustomKeyCloakAuthenticationProvider customKeyCloakAuthenticationProvider;
    private static final Logger LOG = LoggerFactory.getLogger(CustomKeyCloakAuthSuccessHandler.class);

    @Autowired
    private CMISService cmisService;

    @Autowired
    private UserService userService;

    @Autowired
    private CommonRepository commonRepository;

    @Value("${cookie.secure}")
    private Boolean cookieSecure;

    public String getUsernameCNR(OidcKeycloakAccount account) {
        return customKeyCloakAuthenticationProvider.getUsernameCNR(account);
    }
    public CustomKeyCloakAuthSuccessHandler(AuthenticationSuccessHandler fallback, CustomKeyCloakAuthenticationProvider customKeyCloakAuthenticationProvider) {
        super(fallback);
        this.fallback = fallback;
        this.customKeyCloakAuthenticationProvider = customKeyCloakAuthenticationProvider;
    }

    public Optional<Pair<String, String>> authentication(HttpServletRequest request, HttpServletResponse response, Authentication authentication, boolean cookie) throws IOException, ServletException {
        LOG.info("get account with authentication {}", authentication);
        Optional<Pair<String, String>> ticketForUser = Optional.empty();
        final Optional<KeycloakAuthenticationToken> keycloakAuthenticationToken = Optional.ofNullable(authentication)
                .filter(KeycloakAuthenticationToken.class::isInstance)
                .map(KeycloakAuthenticationToken.class::cast);
        if (keycloakAuthenticationToken.isPresent() && keycloakAuthenticationToken.get().isAuthenticated() &&
                Optional.ofNullable(keycloakAuthenticationToken.get().getAccount()).isPresent()) {
            final OidcKeycloakAccount account = keycloakAuthenticationToken.get().getAccount();
            LOG.info("get account with authentication {}", account);
            if (customKeyCloakAuthenticationProvider.isCNRUser(account)) {
                final String usernameCNR = customKeyCloakAuthenticationProvider.getUsernameCNR(account);
                ticketForUser = Optional.ofNullable(new Pair(userService.createTicketForUser(usernameCNR), usernameCNR));
                response.addCookie(getCookie(ticketForUser.get().getFirst(), request.isSecure()));
            } else {
                final Principal principal = account.getPrincipal();
                if (principal instanceof KeycloakPrincipal) {
                    KeycloakPrincipal kPrincipal = (KeycloakPrincipal) principal;
                    IDToken token = Optional.ofNullable(kPrincipal.getKeycloakSecurityContext().getIdToken())
                            .orElse(kPrincipal.getKeycloakSecurityContext().getToken());
                    CMISUser cmisUser = new CMISUser();
                    cmisUser.setApplication(SSO);
                    cmisUser.setFirstName(token.getGivenName());
                    cmisUser.setLastName(token.getFamilyName());
                    cmisUser.setDataDiNascita(Optional.ofNullable(token.getBirthdate())
                            .filter(s -> !s.isEmpty())
                            .map(date -> {
                                try {
                                    return Date.from(
                                            LocalDate.parse(
                                                    date,
                                                    DateTimeFormatter.ofPattern("yyyy-MM-dd")
                                            ).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()
                                    );
                                } catch (DateTimeParseException _ex) {
                                    LOG.warn("Cannot format date of birth", _ex);
                                    return null;
                                }
                            })
                            .orElse(null));
                    cmisUser.setCodicefiscale(
                            Optional.ofNullable(token.getPreferredUsername())
                                    .map(cf -> cf.substring(6))
                                    .map(String::toUpperCase)
                                    .orElse(null)
                    );
                    cmisUser.setSesso(token.getGender());
                    cmisUser.setEmail(Optional.ofNullable(token.getEmail()).orElse(" "));
                    String userName = userName(cmisUser, "-");

                    Optional<CMISUser> userByCodiceFiscale =
                            Optional.ofNullable(
                                    userService.findUserByCodiceFiscale(
                                            cmisUser.getCodicefiscale(),
                                            cmisService.getAdminSession(),
                                            Arrays.asList(userName, userName(cmisUser, ".")),
                                            cmisUser.getEmail()
                                    )
                            );
                    if (userByCodiceFiscale.isPresent()) {
                        if (!Optional.ofNullable(userByCodiceFiscale.get().getEmail()).equals(Optional.ofNullable(cmisUser.getEmail())) &&
                                Optional.ofNullable(userByCodiceFiscale.get().getApplication()).filter(s -> !s.isEmpty()).isPresent()) {
                            cmisUser.setUserName(userByCodiceFiscale.get().getUserName());
                            userByCodiceFiscale = Optional.ofNullable(userService.updateUser(cmisUser));
                        }
                        ticketForUser = Optional.ofNullable(new Pair(userService.createTicketForUser(userByCodiceFiscale.get().getUserName()), userByCodiceFiscale.get().getUserName()));
                        if (cookie) {
                            response.addCookie(getCookie(ticketForUser.get().getFirst(), request.isSecure()));
                        }
                    } else {
                        //Verifico se l'utenza ha lo stesso codice fiscale
                        try {
                            Optional<CMISUser> cmisUser2 = Optional.ofNullable(userService.loadUserForConfirm(userName))
                                    .filter(cmisUser1 -> cmisUser1.getCodicefiscale().equalsIgnoreCase(cmisUser.getCodicefiscale()));
                            if (cmisUser2.isPresent()) {
                                if (!Optional.ofNullable(cmisUser2.get().getEmail()).equals(Optional.ofNullable(cmisUser.getEmail())) &&
                                        Optional.ofNullable(cmisUser2.get().getApplication()).filter(s -> !s.isEmpty()).isPresent()) {
                                    cmisUser.setUserName(cmisUser2.get().getUserName());
                                    cmisUser2 = Optional.ofNullable(userService.updateUser(cmisUser));
                                }
                                ticketForUser = Optional.ofNullable(new Pair(userService.createTicketForUser(cmisUser2.get().getUserName()),cmisUser2.get().getUserName()));
                                if (cookie) {
                                    response.addCookie(getCookie(ticketForUser.get().getFirst(), request.isSecure()));
                                }
                            } else {
                                throw new CoolUserFactoryException(String.format("Username %s founded but Taxcode is not the same", userName));
                            }
                        } catch (CoolUserFactoryException _ex) {
                            LOG.trace("SPID Username {} not found", userName);
                            if (!userService.isUserExists(userName)) {
                                cmisUser.setUserName(userName);
                            } else {
                                for (int i = 1; i < 20; i++) {
                                    final String concatUsername = userName.concat("0").concat(String.valueOf(i));
                                    if (!userService.isUserExists(concatUsername)) {
                                        cmisUser.setUserName(concatUsername);
                                        break;
                                    }
                                }
                            }
                            final CMISUser user = userService.createUser(cmisUser);
                            userService.enableAccount(user.getUserName());
                            ticketForUser = Optional.ofNullable(new Pair(userService.createTicketForUser(user.getUserName()), user.getUserName()));
                            if (cookie) {
                                response.addCookie(getCookie(ticketForUser.get().getFirst(), request.isSecure()));
                            }
                        }
                    }
                }
            }
        }
        //Ripulisco la cache
        ticketForUser
                .map(Pair::getSecond)
                .ifPresent(userId -> {
                    commonRepository.evictEnableTypeCalls(userId);
                    commonRepository.evictManagersCall(userId);
                    commonRepository.evictCommissionCalls(userId);
                    commonRepository.evictManagersCalls(userId);
                    commonRepository.evictGroupsCache(userId);
                });
        if (cookie) {
            String location = KeycloakCookieBasedRedirect.getRedirectUrlFromCookie(request);
            if (location == null) {
                if (fallback != null) {
                    fallback.onAuthenticationSuccess(request, response, authentication);
                }
            } else {
                try {
                    location = UriUtils.decode(location, Charset.defaultCharset());
                    response.addCookie(KeycloakCookieBasedRedirect.createCookieFromRedirectUrl(null));
                    response.sendRedirect(location);
                } catch (IOException e) {
                    LOG.warn("Unable to redirect user after login", e);
                }
            }
        }
        return ticketForUser;
    }

    private String userName(CMISUser cmisUser, String separator) {
        return normalize(Optional.ofNullable(cmisUser.getFirstName())
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .orElseThrow(() -> new AuthenticationServiceException("First Name cannot be empty"))).toLowerCase()
                .concat(separator)
                .concat(normalize(Optional.ofNullable(cmisUser.getLastName())
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .orElseThrow(() -> new AuthenticationServiceException("Last Name cannot be empty"))).toLowerCase());
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        LOG.info("get account with authentication {}", authentication);
        authentication(request, response, authentication, true);
    }

    private String normalize(String src) {
        return Normalizer
                .normalize(src, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .replaceAll("\\W", "");
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

}
