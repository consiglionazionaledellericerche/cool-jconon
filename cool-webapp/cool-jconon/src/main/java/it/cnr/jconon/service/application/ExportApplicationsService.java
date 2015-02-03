package it.cnr.jconon.service.application;

import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.rest.Search;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class ExportApplicationsService {
    private static final Logger LOGGER = LoggerFactory
            .getLogger(ExportApplicationsService.class);
    private static final String ZIP_CONTENT_URL = "service/zipper/zipContent";
    @Autowired
    private CMISService cmisService;
    @Autowired
    private ACLService aclService;

    public String exportApplications(Session currentCMISSession, BindingSession currentBindingSession, String query, String nodeRefBando) {

        Folder bando = (Folder) currentCMISSession.getObject(nodeRefBando);
        String finalApplicationName = (Search.refactoringFileName(bando.getName(), "_"));

        UrlBuilder url = new UrlBuilder(cmisService
                .getBaseURL().concat(ZIP_CONTENT_URL));
        url.addParameter("query", query);
        url.addParameter("destination", nodeRefBando);
        url.addParameter("filename", finalApplicationName);
        url.addParameter("noaccent", true);
        url.addParameter("download", false);

        currentBindingSession.put(SessionParameter.READ_TIMEOUT, -1);

        LOGGER.info("ExportApplicationsService - creazione " + finalApplicationName
                + MimeTypes.ZIP.getExtension());

        Response resZipContent = CmisBindingsHelper
                .getHttpInvoker(currentBindingSession).invokeGET(url,
                        currentBindingSession);
        Document finalZip = null;
        if (resZipContent.getResponseCode() == HttpStatus.SC_OK) {
            finalZip = (Document) currentCMISSession.getObjectByPath(bando
                    .getPath() + "/" + finalApplicationName + MimeTypes.ZIP.getExtension());
            aclService.setInheritedPermission(currentBindingSession,
                    finalZip.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);

            LOGGER.info("ExportApplicationsService - File " + finalApplicationName
                    + MimeTypes.ZIP.getExtension() + " creato");
        } else {
            LOGGER.info("ExportApplicationsService - Errore nella creazione del file " + finalApplicationName
                    + MimeTypes.ZIP.getExtension() + ": " + resZipContent.getResponseCode() + " - " + resZipContent.getErrorContent());
            throw new ClientMessageException(
                    "Errore nell'esecuzione di ZipContent (Alfresco): Errore " + resZipContent.getResponseCode() + " - " + resZipContent.getErrorContent());
        }

        return finalZip.getId();
    }
}