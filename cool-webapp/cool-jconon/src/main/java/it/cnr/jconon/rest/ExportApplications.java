package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.service.application.ExportApplicationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;


@Path("exportApplications")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class ExportApplications {

    private static final String SEARCH_CONTENT = "/search/content?nodeRef=";
    @Autowired
    private ExportApplicationsService exportApplicationsService;
    @Autowired
    private CMISService cmisService;


    @GET
    @Path("{store_type}/{store_id}/{id}")
    public Response exportApplications(@Context HttpServletRequest req,
                                       @PathParam("store_type") String store_type,
                                       @PathParam("store_id") String store_id,
                                       @PathParam("id") String id,
                                       @QueryParam("query") String query) {

        Map<String, Object> model = new HashMap<String, Object>();
        Response.ResponseBuilder rb;
        try {
            String noderefFinalZip = exportApplicationsService.exportApplications(cmisService.getCurrentCMISSession(req.getSession(false)), cmisService.getCurrentBindingSession(req), query, store_type + "://" + store_id + "/" + id);
            model.put("url", SEARCH_CONTENT + noderefFinalZip  + "&deleteAfterDownload=true");
            model.put("nodeRefZip", noderefFinalZip);

            rb = Response.ok(model);


        } catch (ClientMessageException e) {
            model.put("message", e.getMessage());
            rb = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(model);
        }

        return rb.build();
    }
}