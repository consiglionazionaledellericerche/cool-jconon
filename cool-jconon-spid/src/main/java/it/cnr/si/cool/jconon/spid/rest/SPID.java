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

import it.cnr.si.cool.jconon.spid.config.IdpConfiguration;
import it.cnr.si.cool.jconon.spid.service.SPIDIntegrationService;
import org.opensaml.xml.io.UnmarshallingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
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
        Response.ResponseBuilder rb = Response.seeOther(new URI("/"));
        try {
            final String ticket = spidIntegrationService.idpResponse(samlResponse);
            rb.cookie(getCookie(ticket));
        } catch (Exception e) {
            LOGGER.error("ERROR idpResponse", e);
            return Response.serverError().build();
        }
        return rb.build();
    }

    private NewCookie getCookie(String ticket) {
        int maxAge = ticket == null ? 0 : 3600;
        NewCookie cookie = new NewCookie("ticket", ticket, "/", null, 1, null, maxAge, false);
        return cookie;
    }
}