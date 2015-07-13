package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.CommonRestService;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Map;

/**
 * Created by francesco on 13/07/15.
 */

@Path("common")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class CommonRest {

    @Autowired
    private CMISService cmisService;

    @Autowired
    private CommonRestService commonRestService;

    @Autowired
    private CacheService cacheService;

    @GET
    public Response get(@Context HttpServletRequest req) {

        CMISUser user = cmisService.getCMISUserFromSession(req);
        BindingSession bindingSession = cmisService
                .getCurrentBindingSession(req);
        Map<String, Object> model = commonRestService.getStringObjectMap(user);

        model.put("caches", cacheService.getCaches(user, bindingSession));

        return commonRestService.getResponse(model);
    }

    @DELETE
    public void delete(@Context HttpServletRequest req, @QueryParam("authortiyName") String authortiyName) {
        BindingSession bindingSession = cmisService
                .getCurrentBindingSession(req);
        if (authortiyName != null) {
            if (authortiyName.startsWith("GROUP_"))
                cacheService.clearGroupCache(authortiyName, bindingSession);
            else
                cacheService.clearCache(authortiyName);
        }
    }


}
