package it.cnr.flows.rest;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

public class SessionFilter implements ContainerRequestFilter {

    @Context
    HttpServletRequest request;

    @Override
    public void filter(ContainerRequestContext requestContext)
            throws IOException {

        HttpSession session = request.getSession(false);

        if (session == null && !isPublicUrl(request.getRequestURI())) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Session exipred.").build());
        }

    }

    private boolean isPublicUrl (String url) {

        return url.indexOf("/rest/static") >  0 || url.indexOf("rest/security/login") > 0;

    }
}
