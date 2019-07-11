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
import it.cnr.cool.dto.Credentials;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.security.DenyAll;
import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import javax.ws.rs.ext.Providers;
import javax.xml.bind.DatatypeConverter;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Provider
public class RESTSecurityInterceptor implements ContainerRequestFilter, ExceptionMapper<Exception> {

    private static final String AUTHORIZATION_PROPERTY = "Authorization";
    private final static Map<String, String> UNAUTHORIZED_MAP = Collections.singletonMap("ERROR", "User cannot access the resource.");
    private static final String REALM = "JCONON";
    private static final String AUTHENTICATION_SCHEME = "Basic";
    private Logger LOGGER = LoggerFactory.getLogger(RESTSecurityInterceptor.class);
    @Context
    private ResourceInfo resourceInfo;
    @Context
    private Providers providers;
    @Autowired
    private CMISService cmisService;
    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;
    @Autowired
    private UserService userService;

    @Override
    public void filter(ContainerRequestContext requestContext) {

        final Method method = resourceInfo.getResourceMethod();
        final Class<?> declaring = resourceInfo.getResourceClass();
        String[] rolesAllowed = null;
        boolean denyAll;
        boolean permitAll;
        RolesAllowed allowed = declaring.getAnnotation(RolesAllowed.class),
                methodAllowed = method.getAnnotation(RolesAllowed.class);
        if (methodAllowed != null) allowed = methodAllowed;
        if (allowed != null) {
            rolesAllowed = allowed.value();
        }
        GroupsAllowed groupsAllowed = declaring.getAnnotation(GroupsAllowed.class),
                groupsMethodAllowed = method.getAnnotation(GroupsAllowed.class);
        if (groupsMethodAllowed != null) groupsAllowed = groupsMethodAllowed;


        denyAll = (declaring.isAnnotationPresent(DenyAll.class)
                && method.isAnnotationPresent(RolesAllowed.class) == false
                && method.isAnnotationPresent(PermitAll.class) == false) || method.isAnnotationPresent(DenyAll.class);

        permitAll = (declaring.isAnnotationPresent(PermitAll.class) == true
                && method.isAnnotationPresent(RolesAllowed.class) == false
                && method.isAnnotationPresent(DenyAll.class) == false) || method.isAnnotationPresent(PermitAll.class);

        CMISUser cmisUser = null;
        if (rolesAllowed != null || groupsAllowed != null) {
            final MultivaluedMap<String, String> headers = requestContext.getHeaders();
            final List<String> authorization = headers.get(AUTHORIZATION_PROPERTY);
            try {
                cmisUser = extractUserFromHeader(headers);
                if (cmisUser == null) {
                    requestContext.abortWith(
                            Response.status(Status.UNAUTHORIZED)
                                    .header(HttpHeaders.WWW_AUTHENTICATE,
                                            AUTHENTICATION_SCHEME + " realm=\"" + REALM + "\"")
                                    .build());
                    return;
                }
            } catch (Exception e) {
                LOGGER.error("ERROR for REST SERVICE", e);
                requestContext.abortWith(Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build());
                return;
            }
        }
        if (rolesAllowed != null || denyAll || permitAll) {
            if (denyAll) {
                requestContext.abortWith(Response.status(Status.FORBIDDEN).entity(UNAUTHORIZED_MAP).build());
                return;
            }
            if (permitAll) return;
            if (rolesAllowed != null) {
                Set<String> rolesSet = new HashSet<String>(
                        Arrays.asList(rolesAllowed));
                try {
                    if (!isUserAllowed(cmisUser, rolesSet)) {
                        requestContext.abortWith(Response.status(Status.UNAUTHORIZED).entity(Collections.singletonMap("ERROR", "User doesn't have the following roles: " + rolesSet)).build());
                        return;
                    }
                } catch (Exception e) {
                    requestContext.abortWith(Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build());
                }
            }
        }
        if (groupsAllowed != null) {
            Set<String> groups = Stream.of(groupsAllowed.value()).map(x -> x.group()).collect(Collectors.toSet());
            try {
                if (!isUserAllowed(cmisUser, groups)) {
                    requestContext.abortWith(Response.status(Status.UNAUTHORIZED).entity(Collections.singletonMap("ERROR", "User doesn't have the following access: " + groups)).build());
                }
            } catch (Exception e) {
                requestContext.abortWith(Response.status(Status.INTERNAL_SERVER_ERROR).entity(e).build());
            }
        }
    }

    private boolean isUserAllowed(final CMISUser cmisUser,
                                  final Set<String> rolesSet) throws Exception {
        try {
            return Optional.ofNullable(cmisUser.getGroupsArray())
                    .map(x -> x.stream())
                    .get()
                    .filter(x -> rolesSet.contains(x)).count() > 0;
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public Response toResponse(Exception exception) {
        LOGGER.error("ERROR for REST SERVICE", exception);
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(exception).build();
    }


    public CMISUser extractUserFromHeader(MultivaluedMap<String, String> header) {
        String authorization = header.getFirst("Authorization");
        if (authorization != null) {

            LOGGER.info("basic auth: " + authorization);

            Credentials credentials = extractCredentials(authorization);

            String username = credentials.getUsername();
            String password = credentials.getPassword();

            LOGGER.debug("basic auth user: " + username);

            return Optional.ofNullable(cmisAuthenticatorFactory.authenticate(username, password))
                    .map(s -> userService.loadUserForConfirm(username))
                    .orElse(null);
        }
        return null;
    }



    private Credentials extractCredentials(String authorization) {

        if (authorization == null || authorization.isEmpty()) {
            LOGGER.debug("no authorization header provided");
            return null;
        }

        String usernameAndPasswordBase64 = authorization.split(" ")[1];

        byte[] usernameAndPasswordByteArray = DatatypeConverter.parseBase64Binary(usernameAndPasswordBase64);

        String [] usernameAndPassword = new String(usernameAndPasswordByteArray).split(":");

        String username = usernameAndPassword[0];
        String password = usernameAndPassword[1];

        LOGGER.info("using BASIC auth for user: " + username);

        return new Credentials(username, password);

    }
}