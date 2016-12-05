package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.service.application.ExportApplicationsService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import java.util.HashMap;
import java.util.Map;


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

    @GET
    @Path("{store_type}/{store_id}/{id}")
    public Response exportApplications(@Context HttpServletRequest req,
                                       @PathParam("store_type") String store_type,
                                       @PathParam("store_id") String store_id, @PathParam("id") String id, @QueryParam("all") boolean all) {

        Map<String, Object> model = new HashMap<String, Object>();
        ResponseBuilder rb;
        try {
            model.putAll(exportApplicationsService.exportApplications(
                    cmisService.getCurrentCMISSession(req), cmisService.getCurrentBindingSession(req),
                    store_type + "://" + store_id + "/" + id, cmisService.getCMISUserFromSession(req), all));
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