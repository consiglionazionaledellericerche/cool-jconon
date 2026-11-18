package it.cnr.si.cool.jconon.rest.openapi.config;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.si.cool.jconon.repository.RoleGroupsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * La nuova interfaccia non passa per /rest/common (CommonRepository.getManagersCall): prima di ogni
 * richiesta /openapi/** si aggiungono all'utente della sessione i gruppi del ruolo SSO, come nel legacy.
 * L'utente aggiornato viene riscritto nella cache della sessione: Hazelcast restituisce copie, quindi
 * senza riscrittura il controller, che rilegge l'utente, non vedrebbe i gruppi.
 */
@Component
public class RoleGroupsInterceptor implements HandlerInterceptor {
    private static final Logger LOGGER = LoggerFactory.getLogger(RoleGroupsInterceptor.class);

    @Autowired
    private CMISService cmisService;
    @Autowired
    private RoleGroupsService roleGroupsService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        try {
            final String ticket = cmisService.extractTicketFromRequest(request);
            if (ticket != null) {
                roleGroupsService.addRoleGroupsToSessionUser(ticket, cmisService.getCMISUserFromSession(request));
            }
        } catch (Exception _ex) {
            LOGGER.warn("Cannot add SSO role groups to the session user", _ex);
        }
        return true;
    }
}
