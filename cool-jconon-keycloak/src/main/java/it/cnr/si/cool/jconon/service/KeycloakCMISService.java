package it.cnr.si.cool.jconon.service;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CmisAuthRepository;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.si.cool.jconon.config.CustomKeyCloakAuthSuccessHandler;
import it.cnr.si.cool.jconon.config.SSOConfigurationProperties;
import org.apache.chemistry.opencmis.client.api.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Service
@Primary
@Profile("keycloak")
public class KeycloakCMISService extends CMISService {
    @Autowired(required = false)
    private CustomKeyCloakAuthSuccessHandler customKeyCloakAuthSuccessHandler;
    @Autowired
    private SSOConfigurationProperties properties;
    @Autowired
    private CmisAuthRepository cmisAuthRepository;
    @Autowired
    private UserService userService;

    @Override
    public Session getCurrentCMISSession(HttpServletRequest req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return Optional.ofNullable(authentication)
            .filter(o -> !(o instanceof AnonymousAuthenticationToken))
            .map(auth ->  {
                Optional<Jwt> jwt = Optional.ofNullable(auth.getPrincipal())
                        .filter(Jwt.class::isInstance)
                        .map(Jwt.class::cast);
                Optional<String> optUsername = jwt
                        .map(jwt1 -> jwt1.getClaim(properties.getUsername_cnr()));
                if (optUsername.isPresent()) {
                    Boolean isCNRUser = jwt
                            .map(jwt1 -> jwt1.getClaim(properties.getUser()))
                            .filter(Boolean.class::isInstance)
                            .map(Boolean.class::cast)
                            .orElse(Boolean.FALSE);
                    if (isCNRUser) {
                        return cmisAuthRepository.getSession(customKeyCloakAuthSuccessHandler.createTicketForUser(optUsername.get()));
                    } else {
                        CMISUser userByCodiceFiscale = userService.findUserByCodiceFiscale(
                                optUsername.map(cf -> cf.substring(6)).map(String::toUpperCase).get(), getAdminSession()
                        );
                        return cmisAuthRepository.getSession(customKeyCloakAuthSuccessHandler.createTicketForUser(userByCodiceFiscale.getUserName()));
                    }
                }
                return super.getCurrentCMISSession(req);
            })
            .orElseGet(() -> super.getCurrentCMISSession(req));
    }
}
