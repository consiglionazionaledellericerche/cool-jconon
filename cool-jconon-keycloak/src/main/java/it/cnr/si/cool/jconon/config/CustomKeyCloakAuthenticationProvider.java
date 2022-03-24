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

import it.cnr.si.cool.jconon.model.AuthenticationProvider;
import org.keycloak.adapters.OidcKeycloakAccount;
import org.keycloak.adapters.springsecurity.account.KeycloakRole;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;

import java.util.*;
import java.util.stream.Stream;

public class CustomKeyCloakAuthenticationProvider extends KeycloakAuthenticationProvider implements AuthenticationProvider {
    public static final String CONTEXTS = "contexts";
    public static final String ROLES = "roles";
    @Autowired
    private SSOConfigurationProperties properties;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        KeycloakAuthenticationToken token = (KeycloakAuthenticationToken) authentication;
        List<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();
        for (String role : token.getAccount().getRoles()) {
            grantedAuthorities.add(new KeycloakRole(role));
        }

        return new KeycloakAuthenticationToken(token.getAccount(), token.isInteractive(), mapAuthorities(token.getAccount(), grantedAuthorities));
    }

    @Override
    public boolean isCNRUser(Authentication authentication) {
        return isCNRUser(
                Optional.ofNullable(authentication)
                        .filter(KeycloakAuthenticationToken.class::isInstance)
                        .map(KeycloakAuthenticationToken.class::cast)
                        .map(keycloakAuthenticationToken -> keycloakAuthenticationToken.getAccount())
                        .orElse(null)
        );
    }

    public boolean isCNRUser(OidcKeycloakAccount account) {
        if (Optional.ofNullable(account).isPresent()) {
            return account.
                    getKeycloakSecurityContext()
                    .getIdToken()
                    .getOtherClaims()
                    .entrySet()
                    .stream()
                    .filter(stringObjectEntry -> stringObjectEntry.getKey().equalsIgnoreCase(properties.getUser()))
                    .findAny()
                    .map(stringObjectEntry -> stringObjectEntry.getValue())
                    .filter(Boolean.class::isInstance)
                    .map(Boolean.class::cast)
                    .orElse(Boolean.FALSE);
        }
        return Boolean.FALSE;
    }

    public String getMatricola(OidcKeycloakAccount account) {
        return account.
            getKeycloakSecurityContext()
            .getIdToken()
            .getOtherClaims()
            .entrySet()
            .stream()
            .filter(stringObjectEntry -> stringObjectEntry.getKey().equalsIgnoreCase(properties.getMatricola()))
            .findAny()
            .map(stringObjectEntry -> stringObjectEntry.getValue())
            .filter(String.class::isInstance)
            .map(String.class::cast)
            .orElse(null);
    }

    public String getUsernameCNR(OidcKeycloakAccount account) {
        return account.
            getKeycloakSecurityContext()
            .getIdToken()
            .getOtherClaims()
            .entrySet()
            .stream()
            .filter(stringObjectEntry -> stringObjectEntry.getKey().equalsIgnoreCase(properties.getUsername_cnr()))
            .findAny()
            .map(stringObjectEntry -> stringObjectEntry.getValue())
            .filter(String.class::isInstance)
            .map(String.class::cast)
            .orElse(null);
    }

    public String getLivello(OidcKeycloakAccount account) {
        return account.
            getKeycloakSecurityContext()
            .getIdToken()
            .getOtherClaims()
            .entrySet()
            .stream()
            .filter(stringObjectEntry -> stringObjectEntry.getKey().equalsIgnoreCase(properties.getLivello()))
            .findAny()
            .map(stringObjectEntry -> stringObjectEntry.getValue())
            .filter(String.class::isInstance)
            .map(String.class::cast)
            .orElse(null);
    }

    public Collection<? extends GrantedAuthority> mapAuthorities(OidcKeycloakAccount account, List<GrantedAuthority> grantedAuthorities) {
        if (isCNRUser(account)) {
            grantedAuthorities.add(new KeycloakRole("USER"));
        }
        final Optional<Map.Entry<String, Object>> contexts = account.
            getKeycloakSecurityContext()
            .getIdToken()
            .getOtherClaims()
            .entrySet()
            .stream()
            .filter(stringObjectEntry -> stringObjectEntry.getKey().equalsIgnoreCase(CONTEXTS))
            .findAny();
        if (contexts.isPresent()) {
            final Stream<Map.Entry> stream = contexts
                .map(stringObjectEntry -> stringObjectEntry.getValue())
                .filter(Map.class::isInstance)
                .map(Map.class::cast)
                .map(map -> map.entrySet())
                .get()
                .stream()
                .filter(Map.Entry.class::isInstance)
                .map(Map.Entry.class::cast);
            final Optional<Map.Entry> any1 = stream
                .filter(entry -> entry.getKey().equals(properties.getContesto()))
                .findAny();
            if (any1.isPresent()) {
                final Optional<Map<String, List<String>>> mapRoles =
                    Optional.ofNullable(any1.get().getValue())
                        .filter(Map.class::isInstance)
                        .map(Map.class::cast);
                if (mapRoles.isPresent()) {
                    final Optional<List<String>> roles = mapRoles
                        .get()
                        .entrySet()
                        .stream()
                        .filter(stringEntry -> stringEntry.getKey().equalsIgnoreCase(ROLES))
                        .map(Map.Entry::getValue)
                        .findAny();
                    if (roles.isPresent()) {
                        roles.get().stream().forEach(s -> {
                            grantedAuthorities.add(new KeycloakRole(s));
                        });
                    }
                }
            }
        }
        return grantedAuthorities;
    }

}
