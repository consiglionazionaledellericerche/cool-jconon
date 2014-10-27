package it.cnr.jconon.rest;

import freemarker.template.TemplateException;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.rest.util.Util;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.util.CalendarUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.service.application.ApplicationService;
import it.cnr.mock.ISO8601DateFormatMethod;
import it.cnr.mock.JSONUtils;
import it.cnr.mock.RequestUtils;

import java.io.IOException;
import java.text.ParseException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Path("manage-application")
@Component
@Produces(MediaType.APPLICATION_JSON)
@SecurityChecked(needExistingSession=true, checkrbac=false)
public class ManageApplication {
	private static final Logger LOGGER = LoggerFactory.getLogger(ManageApplication.class);
	private static final String FTL_JSON_PATH = "/surf/webscripts/search/cmisObject.get.json.ftl";
	
	@Autowired
	private ApplicationService applicationService;
	@Autowired
	private CMISService cmisService;
	@Autowired
	private NodeMetadataService nodeMetadataService;
	
	@POST
	@Path("move_prodotto")
	public Response moveProdotto(@Context HttpServletRequest request, @QueryParam("prodottoId") String prodottoId) {
		ResponseBuilder rb;
		applicationService.moveDocument(cmisService.getCurrentCMISSession(request.getSession(false)), prodottoId);
		rb = Response.ok("");
		return rb.build();
	}
	
	@POST
	@Path("paste")
	public Response pasteApplication(@Context HttpServletRequest request, 
			@FormParam("applicationSourceId") String applicationSourceId,
			@FormParam("callTargetId") String callTargetId) {
		ResponseBuilder rb;
		try {		
			String userId = (String) request.getSession(false).getAttribute(
					CMISAuthenticatorFactory.SESSION_ATTRIBUTE_KEY_USER_ID);
			String objectId = applicationService.paste(cmisService.getCurrentCMISSession(request.getSession(false)), 
					applicationSourceId, callTargetId, userId);
			rb = Response.ok(Collections.singletonMap(PropertyIds.OBJECT_ID, objectId));
		} catch (ClientMessageException e) {
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}	
		return rb.build();
	}	

	@POST
	@Path("reopen")
	public Response reopenApplication(@Context HttpServletRequest request, 
			@FormParam("cmis:objectId") String applicationSourceId) {
		String userId = (String) request.getSession(false).getAttribute(
				CMISAuthenticatorFactory.SESSION_ATTRIBUTE_KEY_USER_ID);
		ResponseBuilder rb;
		applicationService.reopenApplication(cmisService.getCurrentCMISSession(request.getSession(false)), 
				applicationSourceId, getContextURL(request), request.getLocale(), userId);
		rb = Response.ok("");
		return rb.build();
	}	

	@POST
	@Path("send")
	public Response sendApplication(@Context HttpServletRequest request, 
			MultivaluedMap<String, String> formParams) {
		ResponseBuilder rb;
		try {
			Session cmisSession = cmisService.getCurrentCMISSession(request.getSession(false));
			String userId = (String) request.getSession(false).getAttribute(
					CMISAuthenticatorFactory.SESSION_ATTRIBUTE_KEY_USER_ID);
			LOGGER.info(userId);
			Map<String, Object> properties = nodeMetadataService
					.populateMetadataType(cmisSession, RequestUtils.extractFormParams(formParams), request);
			Map<String, Object> aspectProperties = nodeMetadataService
					.populateMetadataAspectFromRequest(cmisSession, RequestUtils.extractFormParams(formParams), request);	
			Map<String, String> model = applicationService.sendApplication(cmisService.getCurrentCMISSession(request.getSession(false)), 
					(String)properties.get(PropertyIds.OBJECT_ID), getContextURL(request), request.getLocale(), userId, properties, aspectProperties);
			rb = Response.ok(model);
		} catch (ClientMessageException e) {
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		} catch (ParseException e) {
			rb = Response.serverError();		
		}
		return rb.build();
	}	

	@POST
	@Path("main")
	public Response saveApplication(@Context HttpServletRequest request, MultivaluedMap<String, String> formParams) {
		ResponseBuilder rb;
		try {
			Session cmisSession = cmisService.getCurrentCMISSession(request.getSession(false));
			String userId = (String) request.getSession(false).getAttribute(
					CMISAuthenticatorFactory.SESSION_ATTRIBUTE_KEY_USER_ID);
			Map<String, Object> properties = nodeMetadataService
					.populateMetadataType(cmisSession, RequestUtils.extractFormParams(formParams), request);
			Map<String, Object> aspectProperties = nodeMetadataService
					.populateMetadataAspectFromRequest(cmisSession, RequestUtils.extractFormParams(formParams), request);	
			Folder application = applicationService.save(cmisSession, getContextURL(request), request.getLocale(), userId, properties, aspectProperties);
			Map<String, Object> model = new HashMap<String, Object>(); 
			model.put("cmisObject", application);
			model.put("args", new Object());
			rb = Response.ok(processTemplate(model, FTL_JSON_PATH));		
		} catch (ClientMessageException e) {
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		} catch (TemplateException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		} catch (ParseException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@GET
	@Path("main")
	public Response loadApplication(@Context HttpServletRequest request, 
			@QueryParam("callId") String callId, @QueryParam("applicationId") String applicationId, @QueryParam("userId") String userId) {
		ResponseBuilder rb;
		Map<String, Object> model = new HashMap<String, Object>(); 
		try{
			Folder application = applicationService.load(cmisService.getCurrentCMISSession(request.getSession(false)), 
					callId, applicationId, userId, getContextURL(request), request.getLocale(), cmisService.getSiperCurrentBindingSession(request.getSession(false)));
			model.put("cmisObject", application);
			model.put("args", new Object());

			rb = Response.ok(processTemplate(model, FTL_JSON_PATH));		
		} catch (ClientMessageException e) {
			model.put("message", e.getMessage());
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(model);
		} catch (TemplateException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();		
	}

	@DELETE
	@Path("main")
	public Response deleteApplication(@Context HttpServletRequest request, @QueryParam("cmis:objectId") String objectId) {
		ResponseBuilder rb;
		try {
			Session cmisSession = cmisService.getCurrentCMISSession(request.getSession(false));
			applicationService.delete(cmisSession,  
					getContextURL(request), objectId);
			rb = Response.ok();		
		} catch (ClientMessageException e) {
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}
		return rb.build();		
	}
	
	private static String processTemplate(Map<String, Object> model, String path)
			throws TemplateException, IOException {

		model.put("xmldate", new ISO8601DateFormatMethod());
		model.put("jsonUtils", new JSONUtils());
		model.put("calendarUtil", new CalendarUtil());

		String json = Util.processTemplate(model, path);
		LOGGER.debug(json);
		return json;

	}
	
	public String getContextURL(HttpServletRequest req) {
		return req.getScheme() + "://" + req.getServerName() + ":"
				+ req.getServerPort() + req.getContextPath();
	}
}
