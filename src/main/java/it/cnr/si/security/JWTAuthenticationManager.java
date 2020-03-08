package it.cnr.si.security;

import feign.FeignException;
import it.cnr.si.service.AceService;
import it.cnr.si.service.AuthService;
import it.cnr.si.service.dto.anagrafica.letture.PersonaWebDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class JWTAuthenticationManager implements AuthenticationManager {

    private final Logger log = LoggerFactory.getLogger(JWTAuthenticationManager.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private AceService aceService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String principal = (String) authentication.getPrincipal();
        String credentials = (String) authentication.getCredentials();
        try {
            // login ACE
            authService.getToken(principal, credentials);

            List<GrantedAuthority> authorities =
                aceService.ruoliAttivi(principal).stream()
                    .filter(ruolo -> ruolo.getContesti().stream()
                        .anyMatch(r -> r.getSigla().equals("parcoauto-app")))
                    .map(a -> new SimpleGrantedAuthority(
                            Optional.ofNullable(a.getSigla())
                                .map(s -> s.substring(0, s.indexOf("#")))
                                .orElse(null)
                        )
                    ).collect(Collectors.toList());
            authorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
            User utente = new User(principal, credentials, authorities);

            try {
                final PersonaWebDto personaByUsername = aceService.getPersonaByUsername(principal);
                return new ACEAuthentication(utente, authentication, authorities,
                    Optional.ofNullable(personaByUsername)
                        .flatMap(personaWebDto -> Optional.ofNullable(personaWebDto.getSede()))
                        .orElse(null)
                );
            } catch (FeignException e) {
                log.warn("Person not found for principal {}", principal);
            }
            return new UsernamePasswordAuthenticationToken(utente, authentication, authorities);

        } catch (Exception e) {
            throw new BadCredentialsException("authentication failed for user: " + principal);
        }
    }

}
