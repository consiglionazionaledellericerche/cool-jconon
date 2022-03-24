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

import it.cnr.cool.rest.SecurityRest;
import org.keycloak.adapters.AdapterDeploymentContext;
import org.keycloak.adapters.springsecurity.authentication.KeycloakLogoutHandler;
import org.springframework.security.core.Authentication;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

public class CustomKeycloakLogoutHandler extends KeycloakLogoutHandler {
    private final SecurityRest securityRest;
    private final String logoutURL;
    private final CustomKeyCloakAuthenticationProvider customKeyCloakAuthenticationProvider;

    public CustomKeycloakLogoutHandler(AdapterDeploymentContext adapterDeploymentContext, SecurityRest securityRest, CustomKeyCloakAuthenticationProvider customKeyCloakAuthenticationProvider, String logoutURL) {
        super(adapterDeploymentContext);
        this.securityRest = securityRest;
        this.customKeyCloakAuthenticationProvider = customKeyCloakAuthenticationProvider;
        this.logoutURL = logoutURL;
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        securityRest.logout(request, response);
        if (Optional.ofNullable(authentication).isPresent()) {
            super.logout(request, response, authentication);
            try {
                if (customKeyCloakAuthenticationProvider.isCNRUser(authentication)) {
                    response.sendRedirect(logoutURL);
                }
            } catch (IOException e) {
            }
        }
    }
}
