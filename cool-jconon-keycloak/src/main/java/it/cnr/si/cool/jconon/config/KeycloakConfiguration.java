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
import it.cnr.cool.service.PageService;
import org.keycloak.OAuth2Constants;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationEntryPoint;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.authentication.KeycloakLogoutHandler;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.keycloak.adapters.springsecurity.filter.AdapterStateCookieRequestMatcher;
import org.keycloak.adapters.springsecurity.filter.KeycloakAuthenticationProcessingFilter;
import org.keycloak.adapters.springsecurity.filter.QueryParamPresenceRequestMatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;

import java.util.Optional;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(jsr250Enabled = true)
@Profile("keycloak")
public class KeycloakConfiguration extends KeycloakWebSecurityConfigurerAdapter {
    private static final Logger LOGGER = LoggerFactory.getLogger(KeycloakConfiguration.class);
    @Autowired
    private SSOConfigurationProperties properties;

    @Autowired
    private PageService pageService;

    @Autowired
    private SecurityRest securityRest;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        http
                .authorizeRequests()
                .antMatchers("/actuator/health")
                .permitAll()
                .antMatchers("/actuator/**")
                .hasRole("GROUP_ALFRESCO_ADMINISTRATORS")
                .antMatchers("/**")
                .permitAll()
                .and()
                .logout()
                .addLogoutHandler(customKeycloakLogoutHandler())
                .logoutUrl("/sso/logout").permitAll()
                .and()
                .csrf()
                .disable()
                .headers()
                .xssProtection()
                .and()
                .frameOptions();
        http
                .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);  // ✅ abilita la validazione automatica del token JWT
    }

    protected KeycloakLogoutHandler customKeycloakLogoutHandler() throws Exception {
        return new CustomKeycloakLogoutHandler(
                adapterDeploymentContext(),
                securityRest,
                keycloakAuthenticationProvider(),
                Optional.ofNullable(properties.getLogout_success_url()).orElse("/"));
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        KeycloakAuthenticationProvider keycloakAuthenticationProvider = keycloakAuthenticationProvider();
        auth.authenticationProvider(keycloakAuthenticationProvider);
    }

    @Bean
    @Override
    protected CustomKeyCloakAuthenticationProvider keycloakAuthenticationProvider() {
        return new CustomKeyCloakAuthenticationProvider();
    }

    @Bean
    @Override
    protected KeycloakAuthenticationProcessingFilter keycloakAuthenticationProcessingFilter() throws Exception {
        KeycloakAuthenticationProcessingFilter filter = new KeycloakAuthenticationProcessingFilter(authenticationManagerBean());
        filter.setSessionAuthenticationStrategy(sessionAuthenticationStrategy());
        filter.setAuthenticationSuccessHandler(successHandler());
        filter.setRequiresAuthenticationRequestMatcher(
                new OrRequestMatcher(
                        new AntPathRequestMatcher(KeycloakAuthenticationEntryPoint.DEFAULT_LOGIN_URI),
                        new QueryParamPresenceRequestMatcher(OAuth2Constants.ACCESS_TOKEN),
                        new AdapterStateCookieRequestMatcher()
                )
        );
        return filter;
    }

    @Bean
    public CustomKeyCloakAuthSuccessHandler successHandler() {
        return new CustomKeyCloakAuthSuccessHandler(new SavedRequestAwareAuthenticationSuccessHandler(), keycloakAuthenticationProvider());
    }

    @Bean
    @Override
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new NullAuthenticatedSessionStrategy();
    }

}
