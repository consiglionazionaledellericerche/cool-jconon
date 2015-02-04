package it.cnr.jconon.service.application;

import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.rest.Search;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.service.call.CallService;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class ExportApplicationsService {
    private static final Logger LOGGER = LoggerFactory
            .getLogger(ExportApplicationsService.class);
    private static final String ZIP_EXTENSION = ".zip";
    private static final String ZIP_CONTENT = "service/zipper/zipContent";
    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;
    @Autowired
    private ACLService aclService;

    public String exportApplications(Session currentSession,
                                     BindingSession bindingSession, String nodeRefBando) {

        Folder bando = (Folder) currentSession.getObject(nodeRefBando);
        String finalApplicationName = Search.refactoringFileName(bando.getName(), "_");


        // Aggiorno sempre il contenuto della Folder delle Domande Definitive
        Folder finalCall = callService.finalCall(currentSession, bindingSession,
                nodeRefBando);
        if (finalCall == null) {
            // Se non ci sono domande definitive finalCall non viene creata
            throw new ClientMessageException("Il bando "
                    + finalApplicationName
                    + " non presenta domande definitive");
        }
        LOGGER.info("ExportApplicationsService - Cartella con le domande definitive del bando "
                + bando.getName() + " creata");

        invokeGet((String) finalCall.getPropertyValue(PropertyIds.OBJECT_ID),
                (String) bando.getPropertyValue(PropertyIds.OBJECT_ID), finalApplicationName, bindingSession);
        Document finalZip = (Document) currentSession.getObjectByPath(bando
                .getPath() + "/" + finalApplicationName + ZIP_EXTENSION);
        aclService.setInheritedPermission(bindingSession,
                finalZip.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);
        String finalZipNodeRef = finalZip.getId();

        LOGGER.info("ExportApplicationsService - File " + finalApplicationName
                + ".zip creata");

        return finalZipNodeRef;
    }

    /**
     * Effettua la get su ZipContent (alfresco)
     *
     * @param noderefFinalCall
     * @param noderefBando
     * @param finalApplicationName
     * @param bindingSession
     */
    private void invokeGet(String noderefFinalCall, String noderefBando, String finalApplicationName, BindingSession bindingSession) {

        UrlBuilder url = new UrlBuilder(cmisService
                .getBaseURL().concat(ZIP_CONTENT));
        url.addParameter("nodes", "workspace://SpacesStore/" + noderefFinalCall);
        url.addParameter("destination", "workspace://SpacesStore/" + noderefBando);
        url.addParameter("filename", finalApplicationName);
        url.addParameter("noaccent", true);
        url.addParameter("download", false);

        bindingSession.put(SessionParameter.READ_TIMEOUT, -1);
        Response resZipContent = CmisBindingsHelper
                .getHttpInvoker(bindingSession).invokeGET(url,
                        bindingSession);
        if (resZipContent.getResponseCode() != HttpStatus.SC_OK) {
            throw new ClientMessageException(
                    "Errore nell'esecuzione di ZipContent (Alfresco): Errore "
                            + resZipContent.getResponseCode() + " - " + resZipContent.getErrorContent());
        }

    }
}