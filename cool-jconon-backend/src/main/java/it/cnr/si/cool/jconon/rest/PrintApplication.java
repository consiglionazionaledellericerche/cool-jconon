package it.cnr.si.cool.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.Pair;
import it.cnr.si.cool.jconon.service.PrintService;
import it.cnr.si.cool.jconon.service.application.ApplicationService;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
@Path("application")
@Component
@SecurityChecked(needExistingSession=true, checkrbac=false)
public class PrintApplication {
	private static final Logger LOGGER = LoggerFactory.getLogger(PrintApplication.class);
	@Autowired
	private CMISService cmisService;
	@Autowired
    private ApplicationService applicationService;
	@Autowired
    private PrintService printService;

	@GET
	@Path("print")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> print(@Context HttpServletRequest req,
			@QueryParam("nodeRef") String nodeRef, @CookieParam("__lang") String __lang) throws IOException{
		LOGGER.debug("Print for application:" + nodeRef);

        String userId = getUserId(req);
		Boolean esito = applicationService.print(cmisService.getCurrentCMISSession(req),
				nodeRef, getContextURL(req), userId, I18nService.getLocale(req, __lang));
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("esito", esito);
		return model;
	}

	@GET
	@Path("print-immediate")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response printImmediate(@Context HttpServletRequest req,
			@QueryParam("nodeRef") String nodeRef, @CookieParam("__lang") String __lang) throws IOException{
		LOGGER.debug("Print immediate for application:" + nodeRef);
        Pair<String, byte[]> printApplicationImmediate = printService.printApplicationImmediate(
        		cmisService.getCurrentCMISSession(req),
        		nodeRef, 
        		getContextURL(req), 
        		I18nService.getLocale(req, __lang));
        StreamingOutput fileStream =  new StreamingOutput() {
            @Override
            public void write(java.io.OutputStream output) throws IOException{
                output.write(printApplicationImmediate.getSecond());
                output.flush();
           }
        };
        return Response
                .ok(fileStream, MimeTypes.PDF.mimetype())
                .header("content-disposition","attachment; filename = " + printApplicationImmediate.getFirst())
                .build();
	}

	@GET
	@Path("print-download")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response printDownload(@Context HttpServletRequest req,
								   @QueryParam("nodeRef") String nodeRef, @CookieParam("__lang") String __lang) throws IOException{
		LOGGER.debug("Download Print for application:" + nodeRef);
		Pair<String, byte[]> printApplicationImmediate = printService.downloadPrintApplication(
				cmisService.getCurrentCMISSession(req),
				nodeRef,
				getContextURL(req),
				I18nService.getLocale(req, __lang));
		StreamingOutput fileStream =  new StreamingOutput() {
			@Override
			public void write(java.io.OutputStream output) throws IOException{
				output.write(printApplicationImmediate.getSecond());
				output.flush();
			}
		};
		return Response
				.ok(fileStream, MimeTypes.PDF.mimetype())
				.header("content-disposition","attachment; filename = " + printApplicationImmediate.getFirst())
				.build();
	}

	@POST
	@Path("print_scheda_valutazione")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> printSchedaValutazione(@Context HttpServletRequest req,@Context HttpServletResponse res,
			@FormParam("nodeRef") String nodeRef, @CookieParam("__lang") String __lang) {
		LOGGER.debug("Print scheda for application:" + nodeRef);
		Map<String, Object> model = new HashMap<String, Object>();
		String userId = getUserId(req);
		try {
			String result = printService.printSchedaValutazione(cmisService.getCurrentCMISSession(req),
					nodeRef, getContextURL(req), userId, I18nService.getLocale(req, __lang));
			model.put("nodeRef", result);
		} catch (IOException e) {
			LOGGER.error("unable to print scheda di valutazione for application  " + nodeRef, e);
			res.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);			
		}
		return model;
	}

	@GET
	@Path("dichiarazione_sostitutiva")
	public Response printDichiarazioneSotitutiva(@Context HttpServletRequest req, @Context HttpServletResponse res,
			@QueryParam("applicationId") String applicationId, @CookieParam("__lang") String __lang) {
		LOGGER.debug("Print dichiarazione sostitutiva for application:" + applicationId);

		byte[] buf = printService.printDichiarazioneSostitutiva(cmisService.getCurrentCMISSession(req),
				applicationId, getContextURL(req), I18nService.getLocale(req, __lang));
		res.setContentType(MimeTypes.PDF.mimetype());
		try {
			String headerValue = "attachment; filename=\"" + "Dichiarazione sostitutiva.pdf" + "\"";
			res.setHeader("Content-Disposition", headerValue);
			OutputStream outputStream = res.getOutputStream();
			InputStream inputStream = new ByteArrayInputStream(buf);

			IOUtils.copy(inputStream, outputStream);
			outputStream.flush();
			inputStream.close();
			outputStream.close();
			return Response.status(Status.OK).build();
		} catch (IOException e) {
			LOGGER.error("unable to print dic sost for application  " + applicationId, e);
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
	}

    public String getContextURL(HttpServletRequest req)
    {
        return req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort() + req.getContextPath();
    }

    private String getUserId(HttpServletRequest request) {
        return cmisService.getCMISUserFromSession(request).getId();
    }
}