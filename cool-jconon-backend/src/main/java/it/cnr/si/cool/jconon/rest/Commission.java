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
import it.cnr.cool.security.SecurityChecked;
import it.cnr.si.cool.jconon.service.PrintService;
import it.cnr.si.cool.jconon.util.GroupsAllowed;
import it.cnr.si.cool.jconon.util.JcononGroups;
import it.cnr.si.cool.jconon.util.Utility;
import org.apache.chemistry.opencmis.client.api.Session;
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
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Path("commission")
@Component
@Produces(MediaType.APPLICATION_JSON)
@SecurityChecked(needExistingSession = true, checkrbac = false)
public class Commission {
    private static final Logger LOGGER = LoggerFactory.getLogger(Commission.class);
    @Autowired
    private PrintService printService;
    @Autowired
    private CMISService cmisService;

    @GET
    @Path("register.xls")
    @Produces(MediaType.APPLICATION_JSON)
    public Response extractionApplication(@Context HttpServletRequest req, @QueryParam("urlparams") String query) throws IOException {
        LOGGER.debug("Extraction application from query:" + query);
        Response.ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            String objectId = printService.extractionCommissionRegister(
                    session,
                    query,
                    Utility.getContextURL(req),
                    cmisService.getCMISUserFromSession(req).getId()
            );
            Map<String, String> model = new HashMap<>();
            model.put("objectId", objectId);
            model.put("fileName", "albo");
            rb = Response.ok(model);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Response.Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }
}
