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

package it.cnr.si.cool.jconon.spid.rest;

import it.cnr.si.cool.jconon.spid.config.AuthenticationException;
import it.cnr.si.cool.jconon.spid.config.IdpConfiguration;
import it.cnr.si.cool.jconon.spid.service.SPIDIntegrationService;
import org.opensaml.common.SAMLException;
import org.opensaml.xml.io.UnmarshallingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

@Component
@Produces(MediaType.APPLICATION_JSON)
@Path("")
public class SPID {
    private static final Logger LOGGER = LoggerFactory.getLogger(SPID.class);
    @Autowired
    private IdpConfiguration idpConfiguration;
    @Autowired
    private SPIDIntegrationService spidIntegrationService;
    @Value("${server.servlet.context-path}")
    private String contextPath;

    @GET
    @Path("list")
    public Response list(@Context HttpServletRequest req) throws IOException {
        LOGGER.debug("Lista degli IDP SPID");
        return Response.ok(
                idpConfiguration.getSpidProperties().getIdp()
        ).build();
    }

    @POST
    @Path("send-response")
    @Consumes(MediaType.WILDCARD)
    public Response idpResponse(@FormParam("RelayState") final String relayState, @FormParam("SAMLResponse") final String samlResponse) throws URISyntaxException {
        Response.ResponseBuilder rb = Response.seeOther(new URI(contextPath));
        try {
            final String ticket = spidIntegrationService.idpResponse(samlResponse);
            rb.cookie(getCookie(ticket));
        } catch (AuthenticationException e) {
            LOGGER.warn("AuthenticationException ", e);
            rb = Response.seeOther(UriBuilder.fromPath(contextPath.concat("/login"))
                    .queryParam("failureMessage", e.getMessage())
                    .build());
        } catch (SAMLException e) {
            LOGGER.error("ERROR idpResponse", e);
            rb = Response.seeOther(UriBuilder.fromPath(contextPath.concat("/spid-error"))
                    .queryParam("message", e.getMessage())
                    .build());
        }
        return rb.build();
    }

    private NewCookie getCookie(String ticket) {
        int maxAge = ticket == null ? 0 : 3600;
        NewCookie cookie = new NewCookie("ticket", ticket, "/", null, 1, null, maxAge, false);
        return cookie;
    }
}