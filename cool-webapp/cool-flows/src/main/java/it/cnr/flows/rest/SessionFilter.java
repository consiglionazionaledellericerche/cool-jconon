package it.cnr.flows.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.flows.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.io.IOException;

public class SessionFilter implements ContainerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionFilter.class);

    @Context
    HttpServletRequest request;

    @Autowired
    private CMISService cmisService;

    @Override
    public void filter(ContainerRequestContext requestContext)
            throws IOException {


        CMISUser user = cmisService.getCMISUserFromSession(request);

        if ((user == null || user.isGuest()) && !Utils.isPublicUrl(request.getRequestURI())) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Session exipred.").build());
        }

    }

}
