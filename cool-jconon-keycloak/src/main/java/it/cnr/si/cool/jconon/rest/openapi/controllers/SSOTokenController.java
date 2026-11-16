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

import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Scambio del codice OIDC per conto del frontend (selezioni-online).
 * <p>
 * Il client Keycloak dell'applicazione ({@code keycloak.resource}) è confidential: lo scambio del codice
 * richiede il {@code client_secret}, che non può stare nel browser. Il frontend (angular-auth-oidc-client,
 * con PKCE) invia qui la richiesta destinata al token endpoint; il backend aggiunge client_id e secret,
 * la inoltra a Keycloak e restituisce la risposta così com'è (anche gli errori).
 */
@RestController
@RequestMapping(ApiRoutes.V1_SECURITY)
public class SSOTokenController {
    private static final Logger LOGGER = LoggerFactory.getLogger(SSOTokenController.class);
    private static final List<String> GRANT_TYPES = Arrays.asList("authorization_code", "refresh_token");

    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;
    @Value("${keycloak.realm}")
    private String realm;
    @Value("${keycloak.resource}")
    private String resource;
    @Value("${keycloak.credentials.secret:}")
    private String secret;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping(value = "/sso/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<String> token(@RequestParam Map<String, String> params) {
        final String grantType = params.get("grant_type");
        if (!GRANT_TYPES.contains(grantType)) {
            return error(HttpStatus.BAD_REQUEST, "unsupported_grant_type");
        }
        final String clientId = Optional.ofNullable(params.get("client_id")).orElse(resource);
        if (!resource.equals(clientId)) {
            return error(HttpStatus.BAD_REQUEST, "invalid_client");
        }
        final MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        params.forEach((key, value) -> {
            if (!"client_secret".equals(key)) {
                form.add(key, value);
            }
        });
        form.set("client_id", resource);
        if (secret != null && !secret.isEmpty()) {
            form.set("client_secret", secret);
        }
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        final String tokenEndpoint = authServerUrl.replaceAll("/+$", "") + "/realms/" + realm + "/protocol/openid-connect/token";
        try {
            final ResponseEntity<String> response = restTemplate.postForEntity(tokenEndpoint, new HttpEntity<>(form, headers), String.class);
            return ResponseEntity.status(response.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response.getBody());
        } catch (HttpStatusCodeException e) {
            final String body = e.getResponseBodyAsString(StandardCharsets.UTF_8);
            LOGGER.warn("SSO token exchange refused by Keycloak ({}): {} {}", tokenEndpoint, e.getRawStatusCode(), body);
            return ResponseEntity.status(e.getRawStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body);
        }
    }

    private ResponseEntity<String> error(HttpStatus status, String error) {
        return ResponseEntity.status(status).contentType(MediaType.APPLICATION_JSON).body("{\"error\":\"" + error + "\"}");
    }
}
