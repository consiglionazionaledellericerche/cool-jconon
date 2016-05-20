package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.security.service.UserService;
import it.cnr.jconon.service.call.CallService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
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
			String objectId = callService.extractionApplication(session, query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId());
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("objectId", objectId);
			model.put("fileName", "domande");
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
	
	//replace caratteri che non possono comparire nel nome del file in windows
	public static String refactoringFileName(String fileName, String newString) {
		return fileName.replaceAll("[“”\"\\/:*<>| ’']", newString).replace("\\", newString);
	}

	public String getContextURL(HttpServletRequest req) {
		return req.getScheme() + "://" + req.getServerName() + ":"
				+ req.getServerPort() + req.getContextPath();
	}
}