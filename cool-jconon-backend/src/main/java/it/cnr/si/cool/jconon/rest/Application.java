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

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.rest.Content;
import it.cnr.cool.rest.Page;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.StatoComunicazione;
import it.cnr.si.cool.jconon.util.Utility;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.exceptions.CmisUnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
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
	private CallService callService;
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
			@FormParam("nodeRef") String nodeRef, @FormParam("nodeRefDocumento") String nodeRefDocumento) throws IOException{
		LOGGER.debug("Reject application:" + nodeRef);

		applicationService.reject(cmisService.getCurrentCMISSession(req),
				nodeRef, nodeRefDocumento);
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("nodeRef", nodeRef);
		return model;
	}
	/**
	 * Ritiro
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
	 * Rinuncia alla graduatoria
	 * @param req
	 * @param nodeRef
	 * @return
	 * @throws IOException
	 */
	@POST
	@Path("retirement")
	public Map<String, Object> retirement(@Context HttpServletRequest req,
									  @FormParam("nodeRef") String nodeRef) throws IOException{
		LOGGER.debug("Retirement application:" + nodeRef);

		applicationService.retirement(cmisService.getCurrentCMISSession(req),
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
				nodeRef, req.getLocale(), Utility.getContextURL(req), cmisService.getCMISUserFromSession(req));
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
				id, req.getLocale(), Utility.getContextURL(req), cmisService.getCMISUserFromSession(req), email);
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
				id, req.getLocale(), Utility.getContextURL(req), cmisService.getCMISUserFromSession(req), email);
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
					id, req.getLocale(), Utility.getContextURL(req), cmisService.getCMISUserFromSession(req));
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("status", true);
			model.put("message", message);
			rb = Response.ok(model);
		} catch (ClientMessageException e) {
			LOGGER.error("concludiProcessoSchedeAnonime id {}", id, e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}	
		return rb.build();		
	}

	@GET
	@Path("visualizzaSchedeNonAnonime")
	public Response visualizzaSchedeNonAnonime(@Context HttpServletRequest req,
												  @QueryParam("id") String id) throws IOException{
		ResponseBuilder rb;
		try {
			final Session currentCMISSession = cmisService.getCurrentCMISSession(req);
			final CMISUser cmisUserFromSession = cmisService.getCMISUserFromSession(req);
			LOGGER.debug("Visualizza Schede non Anonime Sintetiche:" + id);
			if (!callService.isMemberOfRDPGroup(cmisUserFromSession, (Folder) currentCMISSession.getObject(id)) && !cmisUserFromSession.isAdmin()) {
				LOGGER.error("USER: {} try to visualizzaSchedeNonAnonime for call: {}", cmisUserFromSession.getUserName(), id);
				throw new ClientMessageException("USER:" + cmisUserFromSession.getUserName() + " try to visualizzaSchedeNonAnonime for call:" + id);
			}
			callService.visualizzaSchedeNonAnonime(currentCMISSession, id, req.getLocale(), Utility.getContextURL(req), cmisUserFromSession);
			rb = Response.ok();
		} catch (ClientMessageException e) {
			LOGGER.error("visualizzaSchedeNonAnonime id {}", id, e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}
		return rb.build();
	}

	@GET
	@Path("abilitaProcessoSchedeAnonime")
	public Response abilitaProcessoSchedeAnonime(@Context HttpServletRequest req,
			@QueryParam("id") String id) throws IOException{
		ResponseBuilder rb;
		try {		
			LOGGER.debug("Concludi processo Schede Anonime Sintetiche:" + id);
			String message = applicationService.abilitaProcessoSchedeAnonime(cmisService.getCurrentCMISSession(req),
					id, req.getLocale(), Utility.getContextURL(req), cmisService.getCMISUserFromSession(req));
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("status", true);
			model.put("message", message);
			rb = Response.ok(model);
		} catch (ClientMessageException e) {
			LOGGER.error("concludiProcessoSchedeAnonime id {}", id, e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}	
		return rb.build();		
	}	
	
	@GET
	@Path("convocazione")
	public Response convocazioneContent(@Context HttpServletRequest req, @Context HttpServletResponse res, @QueryParam("nodeRef") String nodeRef) throws URISyntaxException {
		try {
			cmisService.getCurrentCMISSession(req).getObject(nodeRef);
	    	Map<String, Object> properties = new HashMap<String, Object>();
	    	properties.put("jconon_convocazione:stato", StatoComunicazione.RICEVUTO.name());
			cmisService.createAdminSession().getObject(nodeRef).updateProperties(properties);			
			return Response.seeOther(new URI(Utility.getContextURL(req) + "/confirm-message?messageId=message.convocazione.ricevuta")).build();
		} catch(CmisUnauthorizedException _ex) {
            String redirect = "/" + Page.LOGIN_URL;
            redirect = redirect.concat("?redirect=rest/application/convocazione");
			if (nodeRef != null && !nodeRef.isEmpty())
				redirect = redirect.concat("&nodeRef="+nodeRef);
			return Response.seeOther(new URI(Utility.getContextURL(req) + redirect)).build();
		}
	}

	@GET
	@Path("esclusione")
	public Response esclusioneContent(@Context HttpServletRequest req, @Context HttpServletResponse res, @QueryParam("nodeRef") String nodeRef) throws URISyntaxException {
		try {
			cmisService.getCurrentCMISSession(req).getObject(nodeRef);
			Map<String, Object> properties = new HashMap<String, Object>();
			properties.put("jconon_esclusione:stato", StatoComunicazione.RICEVUTO.name());
			cmisService.createAdminSession().getObject(nodeRef).updateProperties(properties);
			return Response.seeOther(new URI(Utility.getContextURL(req) + "/confirm-message?messageId=message.esclusione.ricevuta")).build();
		} catch(CmisUnauthorizedException _ex) {
			String redirect = "/" + Page.LOGIN_URL;
			redirect = redirect.concat("?redirect=rest/application/esclusione");
			if (nodeRef != null && !nodeRef.isEmpty())
				redirect = redirect.concat("&nodeRef="+nodeRef);
			return Response.seeOther(new URI(Utility.getContextURL(req) + redirect)).build();
		}
	}

	@GET
	@Path("comunicazione")
	public Response comunicazioneContent(@Context HttpServletRequest req, @Context HttpServletResponse res, @QueryParam("nodeRef") String nodeRef) throws URISyntaxException {
		try {
			cmisService.getCurrentCMISSession(req).getObject(nodeRef);
			Map<String, Object> properties = new HashMap<String, Object>();
			properties.put("jconon_comunicazione:stato", StatoComunicazione.RICEVUTO.name());
			cmisService.createAdminSession().getObject(nodeRef).updateProperties(properties);
			return Response.seeOther(new URI(Utility.getContextURL(req) + "/confirm-message?messageId=message.comunicazione.ricevuta")).build();
		} catch(CmisUnauthorizedException _ex) {
			String redirect = "/" + Page.LOGIN_URL;
			redirect = redirect.concat("?redirect=rest/application/comunicazione");
			if (nodeRef != null && !nodeRef.isEmpty())
				redirect = redirect.concat("&nodeRef="+nodeRef);
			return Response.seeOther(new URI(Utility.getContextURL(req) + redirect)).build();
		}
	}
}