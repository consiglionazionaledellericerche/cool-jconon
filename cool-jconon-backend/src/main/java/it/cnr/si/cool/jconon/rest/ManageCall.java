/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.rest;

import com.google.gson.JsonObject;
import freemarker.template.TemplateException;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.rest.util.Util;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.cool.util.CalendarUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.mock.ISO8601DateFormatMethod;
import it.cnr.mock.JSONUtils;
import it.cnr.mock.RequestUtils;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.service.cache.CompetitionFolderService;
import it.cnr.si.cool.jconon.service.call.CallService;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.AllowableActions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import java.io.IOException;
import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;

@Path("manage-call")
@Component
@Produces(MediaType.APPLICATION_JSON)
@SecurityChecked(needExistingSession=true, checkrbac=false)
public class ManageCall {
	private static final Logger LOGGER = LoggerFactory.getLogger(ManageCall.class);

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
			LOGGER.error("error deleting call {}", objectId, e);
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

			rb = Response.ok(CMISUtil.convertToProperties(call));
		} catch (ClientMessageException e) {
			LOGGER.error("Error saving call {}", e.getMessage());
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		} catch (ParseException e) {
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
			result.put(JCONONPropertyIds.CALL_ID_CATEGORIA_TECNICO_HELPDESK.value(),
					call.getPropertyValue(JCONONPropertyIds.CALL_ID_CATEGORIA_TECNICO_HELPDESK.value()));
			result.put(JCONONPropertyIds.CALL_ID_CATEGORIA_NORMATIVA_HELPDESK.value(),
					call.getPropertyValue(JCONONPropertyIds.CALL_ID_CATEGORIA_NORMATIVA_HELPDESK.value()));
			
			rb = Response.ok(result);		
		} catch (ClientMessageException e) {
			LOGGER.error("error publishing call", e);
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
			LOGGER.error("error creating child call", e);
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
			LOGGER.error("error getting json labels {}", objectId, e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}
		return rb.build();		
	}

	@GET
	@Path("copy-labels")
	public Response copyLabels(@Context HttpServletRequest request, @QueryParam("callFrom") String callFrom, @QueryParam("callId") String callId, @CookieParam("__lang") String __lang) {
		ResponseBuilder rb;
		Properties labels = new Properties();
		try {
			final Session currentCMISSession = cmisService.getCurrentCMISSession(request);
			competitionService.copyLabels(currentCMISSession, callFrom, callId);
			labels = competitionService.getDynamicLabels(new ObjectIdImpl(callId), currentCMISSession);
			rb = Response.ok(labels);
		} catch (ClientMessageException e) {
			LOGGER.error("error loading labels {}", callId, e);
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
			LOGGER.error("error loading labels {}", objectId, e);
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
			LOGGER.error("error saving labels {}", objectId, e);
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