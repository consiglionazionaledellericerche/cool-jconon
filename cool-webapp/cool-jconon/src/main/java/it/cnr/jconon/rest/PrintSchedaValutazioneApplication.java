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

import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
@Path("application")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class PrintSchedaValutazioneApplication {
	private static final Logger LOGGER = LoggerFactory.getLogger(PrintSchedaValutazioneApplication.class);
	@Autowired
	private CMISService cmisService;
	@Autowired
    private ApplicationService applicationService;

	@POST
	@Path("print_scheda_valutazione")
	public Map<String, Object> printSchedaValutazione(@Context HttpServletRequest req,
			@FormParam("nodeRef") String nodeRef) throws IOException{
		LOGGER.debug("Print scheda for application:" + nodeRef);

		String userId = (String) req.getSession(false).getAttribute(
				SessionParameter.USER);

		LOGGER.info(userId);

		String result = applicationService.printSchedaValutazione(cmisService.getCurrentCMISSession(req.getSession(false)),
				nodeRef, getContextURL(req), userId);
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("nodeRef", result);
		return model;
	}

    public String getContextURL(HttpServletRequest req)
    {
        return req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort() + req.getContextPath();
    }

}