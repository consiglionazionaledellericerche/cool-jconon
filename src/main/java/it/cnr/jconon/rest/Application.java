package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.rest.Content;
import it.cnr.cool.rest.Page;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.service.application.ApplicationService;
import it.cnr.jconon.util.StatoConvocazione;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
@Path("application")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class Application {
	private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);
	private static final String SEARCH_CONTENT = "/search/content?nodeRef=";
	@Autowired
	private CMISService cmisService;
	@Autowired
    private ApplicationService applicationService;
	@Autowired
	private Content content;
	/**
	 * Esclusione
	 * @param req
	 * @param nodeRef
	 * @return
	 * @throws IOException
	 */
	@POST
	@Path("reject")
	public Map<String, Object> reject(@Context HttpServletRequest req,
			@FormParam("nodeRef") String nodeRef) throws IOException{
		LOGGER.debug("Reject application:" + nodeRef);

		applicationService.reject(cmisService.getCurrentCMISSession(req),
				nodeRef);
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("nodeRef", nodeRef);
		return model;
	}
	/**
	 * Rinuncia
	 * @param req
	 * @param nodeRef
	 * @return
	 * @throws IOException
	 */
	@POST
	@Path("waiver")
	public Map<String, Object> waiver(@Context HttpServletRequest req,
			@FormParam("nodeRef") String nodeRef) throws IOException{
		LOGGER.debug("Reject application:" + nodeRef);

		applicationService.waiver(cmisService.getCurrentCMISSession(req),
				nodeRef);
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("nodeRef", nodeRef);
		return model;
	}
	/**
	 * Riammissione
	 * @param req
	 * @param nodeRef
	 * @return
	 * @throws IOException
	 */
	@POST
	@Path("readmission")
	public Map<String, Object> readmission(@Context HttpServletRequest req,
			@FormParam("nodeRef") String nodeRef) throws IOException{
		LOGGER.debug("Reject application:" + nodeRef);

		applicationService.readmission(cmisService.getCurrentCMISSession(req),
				nodeRef);
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("nodeRef", nodeRef);
		return model;
	}

	/**
	 * addContentToChild
	 * @param req
	 * @param nodeRef
	 * @return
	 * @throws IOException
	 */
	@GET
	@Path("addContentToChild")
	public Map<String, Object> addContentToChild(@Context HttpServletRequest req,
			@QueryParam("nodeRef") String nodeRef) throws IOException{
		LOGGER.debug("addContentToChild:" + nodeRef);

		applicationService.addContentToChild(cmisService.getCurrentCMISSession(req),
				nodeRef, req.getLocale(), getContextURL(req), cmisService.getCMISUserFromSession(req));
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("nodeRef", nodeRef);
		return model;
	}	

	@GET
	@Path("exportSchedeValutazione")
	public Map<String, Object> exportSchedeValutazione(@Context HttpServletRequest req,
			@QueryParam("id") String id, @QueryParam("format") String format) throws IOException{
		LOGGER.debug("Export Schede Valutazione:" + id);
		String nodeRef = applicationService.exportSchedeValutazione(cmisService.getCurrentCMISSession(req),
				id, format, cmisService.getCMISUserFromSession(req));
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("url", SEARCH_CONTENT + nodeRef + "&deleteAfterDownload=true");
		model.put("nodeRef", nodeRef);		
		return model;
	}	

	@GET
	@Path("generaSchedeValutazione")
	public Map<String, Object> generaSchedeValutazione(@Context HttpServletRequest req,
			@QueryParam("id") String id, @QueryParam("email") String email) throws IOException{
		LOGGER.debug("Genera Schede Valutazione:" + id);
		applicationService.generaSchedeValutazione(cmisService.getCurrentCMISSession(req),
				id, req.getLocale(), getContextURL(req), cmisService.getCMISUserFromSession(req), email);
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("status", true);
		return model;
	}	

	@GET
	@Path("generaSchedeAnonime")
	public Map<String, Object> generaSchedeAnonime(@Context HttpServletRequest req,
			@QueryParam("id") String id, @QueryParam("email") String email) throws IOException{
		LOGGER.debug("Genera Schede Anonime Sintetiche:" + id);
		applicationService.generaSchedeAnonime(cmisService.getCurrentCMISSession(req),
				id, req.getLocale(), getContextURL(req), cmisService.getCMISUserFromSession(req), email);
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("status", true);
		return model;
	}	

	@GET
	@Path("concludiProcessoSchedeAnonime")
	public Response concludiProcessoSchedeAnonime(@Context HttpServletRequest req,
			@QueryParam("id") String id) throws IOException{
		ResponseBuilder rb;
		try {		
			LOGGER.debug("Concludi processo Schede Anonime Sintetiche:" + id);
			String message = applicationService.concludiProcessoSchedeAnonime(cmisService.getCurrentCMISSession(req),
					id, req.getLocale(), getContextURL(req), cmisService.getCMISUserFromSession(req));
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("status", true);
			model.put("message", message);
			rb = Response.ok(model);
		} catch (ClientMessageException e) {
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}	
		return rb.build();		
	}	
	
	@GET
	@Path("convocazione")
	public Response content(@Context HttpServletRequest req, @Context HttpServletResponse res, @QueryParam("nodeRef") String nodeRef) throws URISyntaxException {
		Response response = content.content(req, res, null, nodeRef, false, null);
		if (response.getStatus() == Status.OK.getStatusCode()) {
	    	Map<String, Object> properties = new HashMap<String, Object>();
	    	properties.put("jconon_convocazione:stato", StatoConvocazione.RICEVUTO.name());		
			cmisService.createAdminSession().getObject(nodeRef).updateProperties(properties);			
		} else if (response.getStatus() == Status.SEE_OTHER.getStatusCode()) {
            String redirect = "/" + Page.LOGIN_URL;
            redirect = redirect.concat("?redirect=rest/application/convocazione");
			if (nodeRef != null && !nodeRef.isEmpty())
				redirect = redirect.concat("&nodeRef="+nodeRef);
			return Response.seeOther(new URI(getContextURL(req) + redirect)).build();			
		}
		return response;
	}
			
	public String getContextURL(HttpServletRequest req) {
		return req.getScheme() + "://" + req.getServerName() + ":"
				+ req.getServerPort() + req.getContextPath();
	}	
}