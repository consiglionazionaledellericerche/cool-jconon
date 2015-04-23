package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.jconon.service.application.ApplicationService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
@Path("application")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class RejectApplication {
	private static final Logger LOGGER = LoggerFactory.getLogger(RejectApplication.class);
	@Autowired
	private CMISService cmisService;
	@Autowired
    private ApplicationService applicationService;

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
}