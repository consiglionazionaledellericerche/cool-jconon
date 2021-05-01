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
package it.cnr.si.cool.jconon.util;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.GroupsUtils;
import it.cnr.cool.web.PermissionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.util.List;

@SecurityChecked
@Provider
public class SecurityCheckInterceptor implements ContainerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityCheckInterceptor.class);
    @Context
    HttpServletRequest request;
    @Context
    UriInfo uriInfo;
    @Autowired
    private PermissionService permission;
    @Autowired
    private CMISService cmisService;

    /**
     * rimuove i PathParameters dall'url del servizio
     *
     * @param url
     * @param parameters
     * @return
     */
    private final static String removePathParameter(String url,
                                                    MultivaluedMap<String, String> parameters) {
        LOGGER.debug("removing parameters [" + parameters.keySet()
                + "] from url: " + url);
        for (List<String> value : parameters.values()) {
            url = url.replace("/" + value.get(0), "");
        }

        return url;
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        Object obj = uriInfo.getMatchedResources().get(0);
        SecurityChecked sc = obj.getClass().getAnnotation(SecurityChecked.class);

        if (sc.needExistingSession() && cmisService.getCMISUserFromSession(request).isGuest()) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Session exipred.").build());
        }
        if (sc.checkrbac()) {
            String url = removePathParameter(request.getPathInfo(), uriInfo
                    .getPathParameters());
            LOGGER.debug(url);

            CMISUser user = cmisService.getCMISUserFromSession(request);

            if (!permission.isAuthorized(url, request.getMethod(),
                    user.getId(), GroupsUtils.getGroups(user))) {
                requestContext.abortWith(Response.status(Response.Status.FORBIDDEN)
                        .entity("User cannot access the resource.").build());
            }
        }
    }
}