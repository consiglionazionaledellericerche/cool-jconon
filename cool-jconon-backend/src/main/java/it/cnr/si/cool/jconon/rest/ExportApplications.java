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
import it.cnr.cool.rest.Content;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.service.application.ExportApplicationsService;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.time.ZoneId;
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
    @Autowired
    Content content;

    private Map<String, String> exportApplications(Session session, BindingSession bindingSession, CMISUser user,
                                      Folder call, boolean all, boolean active,
                                      String types, String applications) {
        return exportApplicationsService.exportApplications(
                session, bindingSession, call.getId(), user, all, active,
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
        );
    }

    @POST
    @Path("/call/{call}")
    public Response exportApplications(@Context HttpServletRequest req,
                                       @Context HttpServletResponse res,
                                       @PathParam("call") String call,
                                       @FormParam("all") boolean all,
                                       @FormParam("active") boolean active,
                                       @FormParam("types") String types,
                                       @FormParam("applications") String applications) {
        Session currentCMISSession = cmisService.getCurrentCMISSession(req);
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        criteria.add(Restrictions.eq(JCONONPropertyIds.CALL_CODICE.value(), call));
        ItemIterable<QueryResult> calls = criteria.executeQuery(currentCMISSession, false, currentCMISSession.getDefaultContext());
        if (calls.getTotalNumItems() == 0) {
            return Response.status(Status.NOT_FOUND).entity(Collections.singletonMap("error", String.format("Il bando con codice %s non esiste", call))).build();
        }
        if (calls.getTotalNumItems() > 1) {
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("error", String.format("Esiste più di un bando con codice il codice %s", call))).build();
        }
        Folder callFolder = (Folder) currentCMISSession.getObject(calls.iterator().next().<String>getPropertyValueById(PropertyIds.OBJECT_ID));
        try {
            Map<String, String> model = exportApplications(
                        currentCMISSession,
                        cmisService.getCurrentBindingSession(req),
                        cmisService.getCMISUserFromSession(req),
                        callFolder,
                        all,
                        active,
                        types,
                        applications
                    );
            String nodeRef = model.get("nodeRef");
            return content.content(req, res, null, nodeRef, true, model.get("filename"));
        } catch (ClientMessageException | URISyntaxException e) {
            LOGGER.error("error exporting applications {}", call, e);
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage())).build();
        }
    }

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
        Session currentCMISSession = cmisService.getCurrentCMISSession(req);
        Folder callFolder = (Folder) currentCMISSession.getObject(id);
        try {
            Map<String, String> model = exportApplications(
                    currentCMISSession,
                    cmisService.getCurrentBindingSession(req),
                    cmisService.getCMISUserFromSession(req),
                    callFolder,
                    all,
                    active,
                    types,
                    applications
            );
            model.put("url", SEARCH_CONTENT + model.get("nodeRef") + "&deleteAfterDownload=true");
            model.put("nodeRefZip", model.get("nodeRef"));
            return Response.ok(model).build();
        } catch (ClientMessageException e) {
            LOGGER.error("error exporting applications {}", id, e);
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage())).build();
        }
    }
}