/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
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
import it.cnr.si.cool.jconon.service.application.ExportApplicationsService;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import java.util.*;


@Path("exportApplications")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class ExportApplications {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExportApplications.class);

    private static final String SEARCH_CONTENT = "/search/content?nodeRef=";
    @Autowired
    private ExportApplicationsService exportApplicationsService;
    @Autowired
    private CMISService cmisService;

    @POST
    @Path("{store_type}/{store_id}/{id}")
    public Response exportApplications(@Context HttpServletRequest req,
                                       @PathParam("store_type") String store_type,
                                       @PathParam("store_id") String store_id, 
                                       @PathParam("id") String id, 
                                       @FormParam("all") boolean all,
                                       @FormParam("active") boolean active,
                                       @FormParam("types") String types,
                                       @FormParam("applications") String applications) {

        Map<String, Object> model = new HashMap<String, Object>();
        ResponseBuilder rb;
        try {
            model.putAll(exportApplicationsService.exportApplications(
                    cmisService.getCurrentCMISSession(req), cmisService.getCurrentBindingSession(req),
                    store_type + "://" + store_id + "/" + id, cmisService.getCMISUserFromSession(req), all, active,
                    Optional.ofNullable(types).filter(s -> !s.equals("null")).map(s -> new JSONArray(s)).orElse(null),
                    Optional.ofNullable(applications)
                            .filter(s -> !s.equals("null"))
                            .map(s -> new JSONArray(s))
                            .map(jsonArray -> {
                                List<String> result = new ArrayList<String>();
                                for (int i = 0; i < jsonArray.length(); i++) {
                                    result.add(String.valueOf(jsonArray.get(i)));
                                }
                                return result;
                            }).orElse(Collections.emptyList())
            ));
            model.put("url", SEARCH_CONTENT + model.get("nodeRef") + "&deleteAfterDownload=true");
            model.put("nodeRefZip", model.get("nodeRef"));
            rb = Response.ok(model);
        } catch (ClientMessageException e) {
            LOGGER.error("error exporting applications {} {} {}", store_type, store_id, id, e);
            model.put("message", e.getMessage());
            rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(model);
        }

        return rb.build();
    }
}