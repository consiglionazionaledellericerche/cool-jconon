package it.cnr.cool.rest;

import freemarker.template.TemplateException;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.QueryService;
import org.apache.chemistry.opencmis.client.api.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import java.io.IOException;
import java.util.Map;

@Path("search-people")
@Component
public class SearchPeople {

	private static final Logger LOGGER = LoggerFactory.getLogger(SearchPeople.class);

    @Autowired
	private QueryService queryService;

    @Autowired
    private CMISService cmisService;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response query(@Context HttpServletRequest request) {

        CMISUser user = cmisService.getCMISUserFromSession(request);

        if (user.isGuest()) {
             throw new NotAuthorizedException("non autorizzato");
        } else {
            LOGGER.info("request from: " + user);
        }


        Session cmisSession = cmisService.getCurrentCMISSession(request);

		ResponseBuilder rb;


        Map<String, Object> model = queryService.query(request, cmisSession);
		try {
			String json = Search.getJson(model);
			rb = Response.ok(json);
			CacheControl cacheControl = new CacheControl();
			cacheControl.setNoCache(true);
			rb.cacheControl(cacheControl);
		} catch (TemplateException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}

		return rb.build();

	}





    public void setQueryService(QueryService queryService) {
        this.queryService = queryService;
    }
}
