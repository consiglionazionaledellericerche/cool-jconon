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

package it.cnr.si.cool.jconon.spid.rest;

import it.cnr.si.cool.jconon.spid.config.AuthenticationException;
import it.cnr.si.cool.jconon.spid.config.IdpConfiguration;
import it.cnr.si.cool.jconon.spid.model.IdpEntry;
import it.cnr.si.cool.jconon.spid.service.SPIDIntegrationService;
import org.opensaml.common.SAMLException;
import org.opensaml.xml.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/spid")
public class SPID {
    public static final String RELAY_STATE = "relayState";
    private static final Logger LOGGER = LoggerFactory.getLogger(SPID.class);
    @Autowired
    private IdpConfiguration idpConfiguration;
    @Autowired
    private SPIDIntegrationService spidIntegrationService;

    @Value("${server.servlet.context-path}")
    private String contextPath;
    @Value("${cookie.secure}")
    private Boolean cookieSecure;

    @GetMapping("/list")
    public ResponseEntity list() throws IOException {
        LOGGER.debug("Lista degli IDP SPID");
        return ResponseEntity.ok(spidIntegrationService.getListIdp());
    }

    @GetMapping("/idp")
    public ModelAndView idp(ModelMap model, HttpServletRequest req, @RequestParam("key") final String key) throws IOException {
        final IdpEntry idpEntry = Optional.ofNullable(key)
                .flatMap(s -> Optional.ofNullable(idpConfiguration.getSpidProperties().getIdp().get(s)))
                .orElseThrow(() -> new RuntimeException("IdP key not found :" + Optional.ofNullable(key)));
        model.addAttribute("SAMLRequest", spidIntegrationService.encodeAndPrintAuthnRequest(
                spidIntegrationService.buildAuthenticationRequest(idpEntry.getEntityId(), Optional.empty(), Optional.empty())
        ));
        final String redirect = req.getParameterMap().entrySet()
                .stream()
                .filter(stringEntry -> stringEntry.getKey().equalsIgnoreCase(RELAY_STATE))
                .map(stringEntry -> {
                    return Arrays.asList(stringEntry.getValue())
                            .stream()
                            .findFirst()
                            .map(s -> s.replace("redirect=", ""))
                            .orElse(null);

                }).findAny().orElse("");

        final String relayState = Optional.ofNullable(contextPath).filter(s -> !s.isEmpty()).orElse("/")
                .concat(redirect)
                .concat(
                        req.getParameterMap().entrySet()
                                .stream()
                                .filter(stringEntry -> !stringEntry.getKey().equalsIgnoreCase("key"))
                                .filter(stringEntry -> !stringEntry.getKey().equalsIgnoreCase("d"))
                                .filter(stringEntry -> !stringEntry.getKey().equalsIgnoreCase(RELAY_STATE))
                                .map(stringEntry -> {
                                    return stringEntry.getKey()
                                            .concat("=")
                                            .concat(Arrays.asList(stringEntry.getValue()).stream().findFirst().orElse(""));
                                }).collect(Collectors.joining("&", "?", ""))
                );

        model.addAttribute("RelayState", Base64.encodeBytes(
                Optional.ofNullable(relayState)
                        .orElse("/").getBytes(StandardCharsets.UTF_8), Base64.DONT_BREAK_LINES));
        model.addAttribute("SigAlg", idpConfiguration.getSpidProperties().getSignature());
        model.addAttribute("Signature", spidIntegrationService.signQueryString(model.entrySet()
                .stream()
                .map(stringObjectEntry -> {
                    try {
                        return stringObjectEntry.getKey() + "=" + URLEncoder.encode((String) stringObjectEntry.getValue(), "UTF-8");
                    } catch (UnsupportedEncodingException e) {
                        return "";
                    }
                })
                .collect(Collectors.joining("&"))));
        return new ModelAndView("redirect:".concat(idpEntry.getRedirectURL()), model);
    }

    @PostMapping("/send-response")
    public ModelAndView idpResponse(ModelMap model,
                                    HttpServletResponse res,
                                    HttpServletRequest req,
                                    @RequestParam("RelayState") final String relayState,
                                    @RequestParam("SAMLResponse") final String samlResponse) throws URISyntaxException {
        try {
            final String ticket = spidIntegrationService.idpResponse(samlResponse);
            LOGGER.info("Ticket: {}", ticket);
            res.addCookie(getCookie(ticket, req.isSecure()));
            return new ModelAndView("redirect:".concat(
                    Optional.ofNullable(relayState)
                            .filter(s -> !s.isEmpty())
                            .map(s -> Base64.decode(s))
                            .map(String::new)
                            .orElse("/")
            ));
        } catch (AuthenticationException e) {
            LOGGER.warn("AuthenticationException ", e);
            model.addAttribute("failureMessage", e.getMessage());
            return new ModelAndView("redirect:/login", model);
        } catch (SAMLException e) {
            LOGGER.error("ERROR idpResponse", e);
            model.addAttribute("failureMessage", e.getMessage());
            return new ModelAndView("redirect:/spid-error", model);
        }
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
