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

package it.cnr.si.cool.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.GroupsAllowed;
import it.cnr.si.cool.jconon.util.JcononGroups;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.Collections;

@Path("graduatorie")
@Component
@Produces(MediaType.APPLICATION_JSON)
@GroupsAllowed({
        JcononGroups.CONCORSI,
        JcononGroups.APPLICATION_CONSUMER,
        JcononGroups.ALFRESCO_ADMINISTRATORS
})
public class Graduatorie {
    private static final Logger LOGGER = LoggerFactory.getLogger(Graduatorie.class);
    @Autowired
    private CallService callService;
    @Autowired
    private CMISService cmisService;

    @GET
    public Response get(@Context HttpServletRequest req, @QueryParam("codice") String codice) throws IOException {
        LOGGER.debug("Estrai graduatorie per il Bando: {}", codice);
        try {
            return Response.ok(
                    callService.estraiGraduatorie(cmisService.getCurrentCMISSession(req), codice)
            ).build();
        } catch (ClientMessageException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage())).build();
        }
    }
}
