package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.jconon.service.application.ApplicationService;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.util.I18NUtil;
import org.springframework.stereotype.Component;

@Path("application")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class AddContentToApplicationChild{

	@Autowired
	private CMISService cmisService;
	@Autowired
	private ApplicationService applicationService;

	
	@GET
	@Path("addContentToApplicationChild")
	public Map<String, Object> exportApplications(
			@Context HttpServletRequest req,
			@QueryParam("nodeRef") String nodeRef) {
		Map<String, Object> model = new HashMap<String, Object>();
		String contextURL = req.getRequestURL().toString();	
		applicationService.addContentToChild(nodeRef,
				cmisService.getCurrentCMISSession(req.getSession(false)),
				I18NUtil.getAllMessages(), contextURL);
		return model;
	}
}