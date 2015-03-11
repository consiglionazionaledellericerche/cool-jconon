package it.cnr.doccnr.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.doccnr.service.ExportVariazioniAsynchronous;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.util.HashMap;
import java.util.Map;

@Path("exportVariazioni")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class ExportVariazioni {

    @Autowired
    private ExportVariazioniAsynchronous exportVariazioniService;
    @Autowired
    private CMISService cmisService;

    @POST
    public Response exportVariazioni(
            @Context HttpServletRequest req,
            @Context UriInfo uriInfo,
            @FormParam("varpianogest:numeroVariazione") String variazioni,
            @FormParam("varpianogest:esercizio") String esercizio,
            @FormParam("fileName") String fileName,
            @FormParam("strorgcds:codice") String cds,
            @FormParam("deleteAfterDownload") String deleteAfterDownload,
            @FormParam("formatDownload") String formatDownload) {
        Map<String, String> model = new HashMap<String, String>();

        CMISUser user = cmisService.getCMISUserFromSession(req);

        Map<String, String> queryParam = new HashMap<String, String>();
        if (!variazioni.isEmpty())
            queryParam
                    .put(ExportVariazioniAsynchronous.KEY_VARIAZIONI, variazioni);
        if (!esercizio.isEmpty())
            queryParam.put(ExportVariazioniAsynchronous.KEY_ESERCIZIO, esercizio);
        if (!cds.isEmpty())
            queryParam.put(ExportVariazioniAsynchronous.KEY_CDS, cds);
        String urlServer = uriInfo.getAbsolutePath().toASCIIString();
        urlServer = urlServer.substring(0, urlServer.indexOf("/rest/export"));

        exportVariazioniService.setCmisSession(cmisService.getCurrentCMISSession(req));
        exportVariazioniService.setQueryParam(queryParam);
        exportVariazioniService.setUser(user);
        exportVariazioniService.setDownloadPrefixUrl(urlServer);
        exportVariazioniService.setFileName(fileName);
        exportVariazioniService.setBindingsession(cmisService
                                                               .getCurrentBindingSession(req));
        exportVariazioniService.setDeleteAfterDownload(Boolean.parseBoolean(deleteAfterDownload));
        exportVariazioniService.setFormatDownload(formatDownload);

        Thread thread = new Thread(exportVariazioniService);
        thread.start();

        model.put("status", "ok");

        return Response.ok(model).build();
    }
}