package it.cnr.jconon.rest;

import freemarker.template.TemplateException;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.rest.util.Util;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.CalendarUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.service.cache.CompetitionFolderService;
import it.cnr.jconon.service.call.CallService;
import it.cnr.mock.ISO8601DateFormatMethod;
import it.cnr.mock.JSONUtils;
import it.cnr.mock.RequestUtils;

import java.io.IOException;
import java.text.ParseException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.CookieParam;
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
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.gson.JsonObject;

@Path("manage-call")
@Component
@Produces(MediaType.APPLICATION_JSON)
@SecurityChecked(needExistingSession=true, checkrbac=false)
public class ManageCall {
	private static final Logger LOGGER = LoggerFactory.getLogger(ManageCall.class);
	private static final String FTL_JSON_PATH = "/surf/webscripts/search/cmisObject.get.json.ftl";
	
	@Autowired
	private CallService callService;
	@Autowired
	private CMISService cmisService;
	@Autowired
	private NodeMetadataService nodeMetadataService;
	@Autowired
	private CompetitionFolderService competitionService;
	
	@DELETE
	@Path("main")
	public Response deleteCall(@Context HttpServletRequest request, @QueryParam("cmis:objectId") String objectId,@QueryParam("cmis:objectTypeId") String objectTypeId) {
		ResponseBuilder rb;
		try {
			Session cmisSession = cmisService.getCurrentCMISSession(request);
            String userId = getUserId(request);
			callService.delete(cmisSession,  
					getContextURL(request), objectId, objectTypeId, userId);
			rb = Response.ok();		
		} catch (ClientMessageException e) {
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}
		return rb.build();
		
	}
	
	@POST
	@Path("main")
	public Response saveCall(@Context HttpServletRequest request, @CookieParam("__lang") String lang, MultivaluedMap<String, String> formParams) {
		ResponseBuilder rb;
		try {
			Session cmisSession = cmisService.getCurrentCMISSession(request);
            String userId = getUserId(request);
			LOGGER.info(userId);
			Map<String, String[]> formParamz = new HashMap<String, String[]>();
			formParamz.putAll(request.getParameterMap());
			if (formParams != null && !formParams.isEmpty())
				formParamz.putAll(RequestUtils.extractFormParams(formParams));

			Map<String, Object> properties = nodeMetadataService
					.populateMetadataType(cmisSession, formParamz, request);
			Map<String, Object> aspectProperties = nodeMetadataService
					.populateMetadataAspectFromRequest(cmisSession, formParamz, request);	
			
			Folder call = callService.save(cmisSession, cmisService.getCurrentBindingSession(request), 
					getContextURL(request), I18nService.getLocale(request, lang), 
					userId, properties, aspectProperties);
			Map<String, Object> model = new HashMap<String, Object>(); 
			model.put("cmisObject", call);
			model.put("args", new Object());
			rb = Response.ok(processTemplate(model, FTL_JSON_PATH));		
		} catch (ClientMessageException e) {
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		} catch (TemplateException|IOException|ParseException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		} 
		return rb.build();
	}	

	@POST
	@Path("publish")
	public Response publishCall(@Context HttpServletRequest request, @CookieParam("__lang") String lang, MultivaluedMap<String, String> formParams) {
		ResponseBuilder rb;
		try {
			Map<String, String[]> formParamz = new HashMap<String, String[]>();
			formParamz.putAll(request.getParameterMap());
			if (formParams != null && !formParams.isEmpty())
				formParamz.putAll(RequestUtils.extractFormParams(formParams));
			saveCall(request, lang, formParams);
			Session cmisSession = cmisService.getCurrentCMISSession(request);
            String userId = getUserId(request);
			LOGGER.info(userId);			
			Folder call = callService.publish(cmisSession, cmisService.getCurrentBindingSession(request), userId, 
					formParamz.get(PropertyIds.OBJECT_ID)[0], Boolean.valueOf(formParamz.get("publish")[0]),
					getContextURL(request), I18nService.getLocale(request, lang));
			Map<String, Object> result = new HashMap<>();
			result.put("published", Boolean.valueOf(formParamz.get("publish")[0]));
			result.put(CoolPropertyIds.ALFCMIS_NODEREF.value(), call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString());
			rb = Response.ok(result);		
		} catch (ClientMessageException e) {
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}
		return rb.build();
	}

	@POST
	@Path("child")
	public Response crateChildCall(@Context HttpServletRequest request, @CookieParam("__lang") String lang, MultivaluedMap<String, String> formParams) {
		ResponseBuilder rb;
		try {
			Session cmisSession = cmisService.getCurrentCMISSession(request);
			String userId = getUserId(request);
			LOGGER.info(userId);
			Map<String, String[]> formParamz = new HashMap<String, String[]>();
			formParamz.putAll(request.getParameterMap());
			if (formParams != null && !formParams.isEmpty())
				formParamz.putAll(RequestUtils.extractFormParams(formParams));

			Map<String, Object> properties = nodeMetadataService
					.populateMetadataType(cmisSession, formParamz, request);
			Map<String, Object> aspectProperties = nodeMetadataService
					.populateMetadataAspectFromRequest(cmisSession, formParamz, request);	
			properties.putAll(aspectProperties);
			callService.crateChildCall(cmisSession, cmisService.getCurrentBindingSession(request), userId, 
					properties, getContextURL(request), I18nService.getLocale(request, lang));
			rb = Response.ok();		
		} catch (ClientMessageException e) {
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		} catch (ParseException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
		
	}

	@GET
	@Path("json-labels")
	public Response jsonLabels(@Context HttpServletRequest request, @QueryParam("cmis:objectId") String objectId, @CookieParam("__lang") String __lang) {
		ResponseBuilder rb;
		JsonObject labels = new JsonObject();
		try {
			labels = callService.getJSONLabels(new ObjectIdImpl(objectId), cmisService.getCurrentCMISSession(request));
			rb = Response.ok(labels != null ? labels.toString() : "");
		} catch (ClientMessageException e) {
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}
		return rb.build();		
	}
	
	@GET
	@Path("load-labels")
	public Response loadLabels(@Context HttpServletRequest request, @QueryParam("cmis:objectId") String objectId, @CookieParam("__lang") String __lang) {
		ResponseBuilder rb;
		Properties labels = new Properties();
		try {
			labels = competitionService.getDynamicLabels(new ObjectIdImpl(objectId), cmisService.getCurrentCMISSession(request));
			rb = Response.ok(labels);
		} catch (ClientMessageException e) {
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}
		return rb.build();	
	}
	
	@POST
	@Path("json-labels")
	public Response saveLabels(@Context HttpServletRequest request, @FormParam("cmis:objectId") String objectId, 
			@FormParam("key") String key, @FormParam("oldLabel") String oldLabel, @FormParam("newLabel") String newLabel, @FormParam("delete") boolean delete) {
		ResponseBuilder rb;
		try {
			Session cmisSession = cmisService.getCurrentCMISSession(request);
			JsonObject labels = callService.storeDynamicLabels(new ObjectIdImpl(objectId), cmisSession, key, oldLabel, newLabel, delete);
			rb = Response.ok(labels.toString());
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

    private String getUserId(HttpServletRequest request) {
        return cmisService.getCMISUserFromSession(request).getId();
    }

}