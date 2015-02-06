package it.cnr.doccnr.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.doccnr.service.zipper.ZipperServiceAsynchronous;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Path("zipper")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class Zipper {

	@Autowired
	private ZipperServiceAsynchronous zipperService;
	@Autowired
	private CMISService cmisService;

	@POST
	public Response zipper(@Context HttpServletRequest req,
			@Context UriInfo uriInfo,
			@FormParam("varpianogest:numeroVariazione") String variazioni,
			@FormParam("varpianogest:esercizio") String esercizio,
			@FormParam("zipName") String zipName,
			@FormParam("strorgcds:codice") String cds) {
		Map<String, String> model = new HashMap<String, String>();

		CMISUser user = cmisService.getCMISUserFromSession(req);

		Map<String, String> queryParam = new HashMap<String, String>();
		if (!variazioni.isEmpty())
			queryParam
					.put(ZipperServiceAsynchronous.KEY_VARIAZIONI, variazioni);
		if (!esercizio.isEmpty())
			queryParam.put(ZipperServiceAsynchronous.KEY_ESERCIZIO, esercizio);
		if (!cds.isEmpty())
			queryParam.put(ZipperServiceAsynchronous.KEY_CDS, cds);
		String urlServer = uriInfo.getAbsolutePath().toASCIIString();
		urlServer = urlServer.substring(0, urlServer.indexOf("/rest/zipper"));

		zipperService.setCmisSession(cmisService.getCurrentCMISSession(req));
		zipperService.setQueryParam(queryParam);
		zipperService.setUser(user);
		zipperService.setUrlServer(urlServer);
		zipperService.setZipName(zipName);
		zipperService.setBindingsession(cmisService
				.getCurrentBindingSession(req));

		Thread thread = new Thread(zipperService);
		thread.start();

		model.put("status", "ok");

		return Response.ok(model).build();
	}
}