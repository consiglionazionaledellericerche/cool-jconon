package it.cnr.si.cool.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.DateUtils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.CookieParam;
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

import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Path("call")
@Component
@SecurityChecked(needExistingSession=true, checkrbac=false)
public class Call {
	private static final Logger LOGGER = LoggerFactory.getLogger(Call.class);
	@Autowired
	private CMISService cmisService;
	@Autowired
	private CallService callService;
	@Autowired
	private UserService userService;

	public enum AddressType {
	    DOC, PEC, EMAIL
    }

	@GET
	@Path("download-xls")
	@Produces("application/vnd.ms-excel")
	public Response downloadFile(@Context HttpServletRequest req, @QueryParam("objectId") String objectId, @QueryParam("fileName") String fileName) throws IOException{
		LOGGER.debug("Download excel file with objectId:" + objectId);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			Document doc = (Document) session.getObject(objectId);
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			IOUtils.copy(doc.getContentStream().getStream(), out);
			rb = Response.ok(out.toByteArray());
			rb.header("Content-Disposition",
					"attachment; filename=\"" + fileName.concat(".xls\""));
			doc.delete();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}
	
	@GET
	@Path("applications.xls")
	@Produces(MediaType.APPLICATION_JSON)
	public Response extractionApplication(@Context HttpServletRequest req, @QueryParam("q") String query) throws IOException{
		LOGGER.debug("Extraction application from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			callService.extractionApplication(session, query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId());
			rb = Response.ok();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@GET
	@Path("applications-convocazioni.xls")
	@Produces(MediaType.APPLICATION_JSON)
	public Response extractionApplicationFromConvocazioni(@Context HttpServletRequest req, @QueryParam("q") String query) throws IOException{
		LOGGER.debug("Extraction application from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			Map<String, Object> model = callService.extractionApplicationFromConvocazioni(session, query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId());
			model.put("fileName", "domande-convocazioni");			
			rb = Response.ok(model);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}
	
	@GET
	@Path("applications-single-call.xls")
	@Produces(MediaType.APPLICATION_JSON)
	public Response extractionApplicationForSingleCall(@Context HttpServletRequest req, @QueryParam("q") String query) throws IOException{
		LOGGER.debug("Extraction application from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			Map<String, Object> model = callService.extractionApplicationForSingleCall(session, query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId());
			String fileName = "domande";
			if(model.containsKey("nameBando")) {
				fileName = ((String) model.get("nameBando"));
				fileName = refactoringFileName(fileName, "");
			}
			model.put("fileName", fileName);
			rb = Response.ok(model);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@GET
	@Path("applications-punteggi.xls")
	@Produces(MediaType.APPLICATION_JSON)
	public Response extractionApplicationForPunteggi(@Context HttpServletRequest req, @QueryParam("callId") String callId) throws IOException{
		LOGGER.debug("Extraction application from call: {}", callId);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			Map<String, Object> model = callService.extractionApplicationForPunteggi(session, callId, getContextURL(req), cmisService.getCMISUserFromSession(req).getId());
			String fileName = "domande";
			if(model.containsKey("nameBando")) {
				fileName = ((String) model.get("nameBando"));
				fileName = refactoringFileName(fileName, "");
			}
			model.put("fileName", fileName);
			rb = Response.ok(model);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@POST
	@Path("applications-punteggi.xls")
	@Produces(MediaType.APPLICATION_JSON)
	public Response importApplicationForPunteggi(@Context HttpServletRequest req) throws IOException{
        Session session = cmisService.getCurrentCMISSession(req);		
		Map<String, Object> model = callService.importApplicationForPunteggi(session, req, cmisService.getCMISUserFromSession(req));
		return Response.ok(model).build();
	}	

	@POST
	@Path("convocazioni")
	@Produces(MediaType.APPLICATION_JSON)
	public Response convocazioni(@Context HttpServletRequest request, @CookieParam("__lang") String lang, 
			@FormParam("callId") String callId, @FormParam("tipoSelezione")String tipoSelezione, @FormParam("luogo")String luogo, @FormParam("data")String data, 
			@FormParam("note")String note, @FormParam("firma")String firma, @FormParam("numeroConvocazione")String numeroConvocazione, @FormParam("application")List<String> applicationsId) throws IOException{
		ResponseBuilder rb;
		try {
			Session session = cmisService.getCurrentCMISSession(request);
			Long numConvocazioni = callService.convocazioni(session, cmisService.getCurrentBindingSession(request), 
					getContextURL(request), I18nService.getLocale(request, lang), cmisService.getCMISUserFromSession(request).getId(), 
					callId, tipoSelezione, luogo, DateUtils.parse(data), note, firma,
					Optional.ofNullable(numeroConvocazione).map(map -> Integer.valueOf(map.toString())).orElse(1), applicationsId);
			rb = Response.ok(Collections.singletonMap("numConvocazioni", numConvocazioni));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@POST
	@Path("esclusioni")
	@Produces(MediaType.APPLICATION_JSON)
	public Response esclusioni(@Context HttpServletRequest request, @CookieParam("__lang") String lang, 
			@FormParam("callId") String callId, @FormParam("tipoSelezione")String tipoSelezione, @FormParam("art")String art, @FormParam("comma")String comma, 
			@FormParam("note")String note, @FormParam("firma")String firma, @FormParam("application")List<String> applicationsId) throws IOException{
		ResponseBuilder rb;
		try {
			Session session = cmisService.getCurrentCMISSession(request);
			Long numEsclusioni = callService.esclusioni(session, cmisService.getCurrentBindingSession(request), 
					getContextURL(request), I18nService.getLocale(request, lang), cmisService.getCMISUserFromSession(request).getId(), 
					callId, tipoSelezione, art, comma, note, firma, applicationsId);
			rb = Response.ok(Collections.singletonMap("numEsclusioni", numEsclusioni));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}

	@POST
	@Path("esclusioni-firmate")
	@Produces(MediaType.APPLICATION_JSON)
	public Response esclusioniFirmate(@Context HttpServletRequest req) throws IOException{
        ResponseBuilder rb;
		Session session = cmisService.getCurrentCMISSession(req);
        try {
		    Long numEsclusioni = callService.importEsclusioniFirmate(session, req, cmisService.getCMISUserFromSession(req));
            rb = Response.ok(Collections.singletonMap("numEsclusioni", numEsclusioni));
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
	}

	@POST
	@Path("comunicazioni")
	@Produces(MediaType.APPLICATION_JSON)
	public Response comunicazioni(@Context HttpServletRequest request, @CookieParam("__lang") String lang, 
			@FormParam("callId") String callId, @FormParam("note")String note, @FormParam("firma")String firma, @FormParam("application")List<String> applicationsId) throws IOException{
		ResponseBuilder rb;
		try {
			Session session = cmisService.getCurrentCMISSession(request);
			Long numComunicazioni = callService.comunicazioni(session, cmisService.getCurrentBindingSession(request), 
					getContextURL(request), I18nService.getLocale(request, lang), cmisService.getCMISUserFromSession(request).getId(), 
					callId, note, firma, applicationsId);
			rb = Response.ok(Collections.singletonMap("numComunicazioni", numComunicazioni));
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}

	@POST
	@Path("elimina-allegati")
	@Produces(MediaType.APPLICATION_JSON)
	public Response eliminaAllegatiGeneratiSullaDomanda(@Context HttpServletRequest req, @FormParam("q") String query) throws IOException{
		LOGGER.debug("Elimina allegati from query:" + query);
		ResponseBuilder rb;
		Session session = cmisService.getCurrentCMISSession(req);
		try {
			Long numAllegati =  callService.eliminaAllegatiGeneratiSullaDomanda(session, query, cmisService.getCMISUserFromSession(req).getId());
			rb = Response.ok(Collections.singletonMap("numAllegati", numAllegati));
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}


	@POST
	@Path("firma-convocazioni")
	@Produces(MediaType.APPLICATION_JSON)
	public Response firmaConvocazioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("userName")String userName, 
			@FormParam("password")String password, @FormParam("otp")String otp, @FormParam("firma")String firma) throws IOException{
		LOGGER.debug("Firma convocazioni from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			Long numConvocazioni =  callService.firma(session, cmisService.getCurrentBindingSession(req), query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
					 userName, password, otp, firma, "jconon_convocazione:stato", "Convocazione del candidato");
			rb = Response.ok(Collections.singletonMap("numConvocazioni", numConvocazioni));
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@POST
	@Path("invia-convocazioni")
	@Produces(MediaType.APPLICATION_JSON)
	public Response inviaConvocazioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("callId")String callId, 
			@FormParam("userNamePEC")String userName, @FormParam("passwordPEC")String password, @FormParam("addressFromApplication")AddressType addressFromApplication) throws IOException{
		LOGGER.debug("Invia convocazioni from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			Long numConvocazioni =  callService.inviaConvocazioni(session, cmisService.getCurrentBindingSession(req), query, getContextURL(req),
					cmisService.getCMISUserFromSession(req).getId(),
					callId, userName, password, addressFromApplication);
			rb = Response.ok(Collections.singletonMap("numConvocazioni", numConvocazioni));
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@POST
	@Path("firma-esclusioni")
	@Produces(MediaType.APPLICATION_JSON)
	public Response firmaEsclusioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("userName")String userName, 
			@FormParam("password")String password, @FormParam("otp")String otp, @FormParam("firma")String firma) throws IOException{
		LOGGER.debug("Firma convocazioni from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			Long numEsclusioni =  callService.firma(session, cmisService.getAdminSession(), query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
					 userName, password, otp, firma, "jconon_esclusione:stato", "Esclusione del candidato");
			rb = Response.ok(Collections.singletonMap("numEsclusioni", numEsclusioni));
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@POST
	@Path("invia-esclusioni")
	@Produces(MediaType.APPLICATION_JSON)
	public Response inviaEsclusioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("callId")String callId, 
			@FormParam("userNamePEC")String userName, @FormParam("passwordPEC")String password, @FormParam("addressFromApplication")AddressType addressFromApplication) throws IOException{
		LOGGER.debug("Invia convocazioni from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			Long numEsclusioni =  callService.inviaEsclusioni(session, cmisService.getCurrentBindingSession(req), query,
                    getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
					callId, userName, password, addressFromApplication);
			rb = Response.ok(Collections.singletonMap("numEsclusioni", numEsclusioni));
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@POST
	@Path("firma-comunicazioni")
	@Produces(MediaType.APPLICATION_JSON)
	public Response firmaComunicazioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("userName")String userName, 
			@FormParam("password")String password, @FormParam("otp")String otp, @FormParam("firma")String firma) throws IOException{
		LOGGER.debug("Firma convocazioni from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			Long numComunicazioni =  callService.firma(session, cmisService.getCurrentBindingSession(req), query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
					 userName, password, otp, firma, "jconon_comunicazione:stato", "Comunicazione al candidato");
			rb = Response.ok(Collections.singletonMap("numComunicazioni", numComunicazioni));
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@POST
	@Path("invia-allegato")
	@Produces(MediaType.APPLICATION_JSON)
	public Response inviaAllegato(@Context HttpServletRequest req, @FormParam("objectId") String objectId, @FormParam("callId")String callId, 
			@FormParam("userNamePEC")String userName, @FormParam("passwordPEC")String password) throws IOException{
		LOGGER.debug("Invia allegato al bando {}",objectId);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			List<String> result = callService.inviaAllegato(session, cmisService.getCurrentBindingSession(req), objectId, getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
					callId, userName, password);
			rb = Response.ok(result);
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@POST
	@Path("invia-comunicazioni")
	@Produces(MediaType.APPLICATION_JSON)
	public Response inviaComunicazioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("callId")String callId, 
			@FormParam("userNamePEC")String userName,
            @FormParam("passwordPEC")String password,
            @FormParam("addressFromApplication")AddressType addressFromApplication) throws IOException{
		LOGGER.debug("Invia convocazioni from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			Long numComunicazioni =  callService.inviaComunicazioni(session, cmisService.getCurrentBindingSession(req), query,
                    getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
					callId, userName, password, addressFromApplication);
			rb = Response.ok(Collections.singletonMap("numComunicazioni", numComunicazioni));
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	
	
	@GET
	@Path("protocol")
	@Produces(MediaType.APPLICATION_JSON)
	public Response protocol(@Context HttpServletRequest req, @QueryParam("q") String query) throws IOException{
		LOGGER.debug("Protocol application from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        String userId = cmisService.getCMISUserFromSession(req).getId();        
		try {
			callService.protocolApplication(session, query, userId);
			rb = Response.ok();
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}

	@GET
	@Path("graduatoria")
    @Produces(MediaType.APPLICATION_JSON)
	public Response graduatoria(@Context HttpServletRequest req, @QueryParam("id") String id) throws IOException{
		ResponseBuilder rb;
		try {
			LOGGER.debug("Graduatoria:" + id);
			callService.graduatoria(cmisService.getCurrentCMISSession(req),
					id, req.getLocale(), getContextURL(req), cmisService.getCMISUserFromSession(req));
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("status", true);
			rb = Response.ok(model);
		} catch (ClientMessageException e) {
			LOGGER.error("Graduatoria id {}", id, e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
		}
		return rb.build();
	}
	//replace caratteri che non possono comparire nel nome del file in windows
	public static String refactoringFileName(String fileName, String newString) {
		return fileName.replaceAll("[“”\"\\/:*<>| ’']", newString).replace("\\", newString);
	}

	public String getContextURL(HttpServletRequest req) {
		return req.getScheme() + "://" + req.getServerName() + ":"
				+ req.getServerPort() + req.getContextPath();
	}
}