package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.jconon.service.call.CallService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
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
	
	@GET
	@Path("applications.xls")
	@Produces("application/vnd.ms-excel")
	public Response extractionApplication(@Context HttpServletRequest req, @QueryParam("q") String query) throws IOException{
		LOGGER.debug("Extraction application from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			HSSFWorkbook xls = callService.extractionApplication(session, query, getContextURL(req));
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			xls.write(out);
			rb = Response.ok(out.toByteArray());
			rb.header("Content-Disposition",
					"attachment; filename=\"domade.xls\"");
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}	

	@GET
	@Path("applications-single-call.xls")
	@Produces("application/vnd.ms-excel")
	public Response extractionApplicationForSingleCall(@Context HttpServletRequest req, @QueryParam("q") String query) throws IOException{
		LOGGER.debug("Extraction application from query:" + query);
		ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
		try {
			Map<String, Object> model = callService.extractionApplicationForSingleCall(session, query, getContextURL(req));
			HSSFWorkbook xls = (HSSFWorkbook) model.get("xls");
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			xls.write(out);
			rb = Response.ok(out.toByteArray());
			String fileName = "domande";
			if(model.containsKey("nameBando")) {
				fileName = ((String) model.get("nameBando"));
				fileName = refactoringFileName(fileName, "");
			}
			rb.header("Content-Disposition",
					"attachment; filename=\"" + fileName.concat(".xls\""));
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