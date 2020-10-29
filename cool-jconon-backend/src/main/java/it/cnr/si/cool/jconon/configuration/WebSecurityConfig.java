package it.cnr.si.cool.jconon.configuration;

import it.cnr.cool.cmis.service.LoginException;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.stream.Collectors;

@EnableWebSecurity
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Value("${security.enable-csrf}")
    private boolean csrfEnabled;
    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http

                .authorizeRequests()
                .antMatchers("/actuator/health")
                .permitAll()
                .antMatchers("/actuator/*")
                .hasRole("GROUP_ALFRESCO_ADMINISTRATORS")
                .antMatchers("/**")
                .permitAll()
                .and()
                .httpBasic()
                .and()
                .csrf()
                .ignoringAntMatchers("/spid/**", "/spid/", "/openapi/**")
                .and()
                .headers()
                .xssProtection()
                .and()
                .frameOptions();
        if (!csrfEnabled) {
            http.csrf().disable();
        }
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(new CustomAuthenticationProvider());
    }

    class CustomAuthenticationProvider implements AuthenticationProvider {

        @Override
        public Authentication authenticate(Authentication authentication) throws AuthenticationException {
            String name = authentication.getName();
            String password = authentication.getCredentials().toString();
            try {
                CMISUser cmisUserFromSession = cmisAuthenticatorFactory.getCMISUser(
                        cmisAuthenticatorFactory.getTicket(name, password)
                );
                return new Authentication() {
                    @Override
                    public Collection<? extends GrantedAuthority> getAuthorities() {
                        return cmisUserFromSession
                                .getGroups()
                                .stream()
                                .map(CMISGroup::getGroup_name)
                                .map(s -> "ROLE_".concat(s))
                                .map(s -> new GrantedAuthority() {
                                    @Override
                                    public String getAuthority() {
                                        return s;
                                    }
                                })
                                .collect(Collectors.toList());
                    }

                    @Override
                    public Object getCredentials() {
                        return null;
                    }

                    @Override
                    public Object getDetails() {
                        return cmisUserFromSession;
                    }

                    @Override
                    public Object getPrincipal() {
                        return cmisUserFromSession.getUserName();
                    }

                    @Override
                    public boolean isAuthenticated() {
                        return !cmisUserFromSession.isGuest();
                    }

                    @Override
                    public void setAuthenticated(boolean b) throws IllegalArgumentException {

                    }

                    @Override
                    public String getName() {
                        return cmisUserFromSession.getUserName();
                    }
                };
            } catch (LoginException e) {
                throw new BadCredentialsException("Bad Credentials", e);
            }
        }

        @Override
        public boolean supports(Class<?> authentication) {
            return authentication.equals(UsernamePasswordAuthenticationToken.class);
        }
    }
}