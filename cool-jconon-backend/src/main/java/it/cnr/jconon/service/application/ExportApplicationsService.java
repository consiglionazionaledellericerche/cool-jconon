package it.cnr.jconon.service.application;

import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.rest.Call;
import it.cnr.jconon.service.call.CallService;

import java.io.OutputStream;
import java.util.List;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class ExportApplicationsService {
    private static final Logger LOGGER = LoggerFactory
            .getLogger(ExportApplicationsService.class);
    private static final String ZIP_CONTENT = "service/zipper/zipContent";
    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;
    @Autowired
    private ACLService aclService;

    public String exportApplications(Session currentSession,
                                     BindingSession bindingSession, String nodeRefBando, CMISUser user) {

        Folder bando = (Folder) currentSession.getObject(nodeRefBando);
        String finalApplicationName = Call.refactoringFileName(bando.getName(), "_");


        // Aggiorno sempre il contenuto della Folder delle Domande Definitive
        List<String> documents = callService.findDocumentFinal(currentSession, bindingSession,
                nodeRefBando, JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION);
        if (documents.isEmpty()) {
            // Se non ci sono domande definitive finalCall non viene creata
            throw new ClientMessageException("Il bando "
                    + finalApplicationName
                    + " non presenta domande definitive");
        }
        LOGGER.info("ExportApplicationsService - Cartella con le domande definitive del bando "
                + bando.getName() + " creata");

        String finalZipNodeRef = invokePost(documents, finalApplicationName, bindingSession, user);

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
    public String invokePost(List<String> documents, String finalApplicationName, BindingSession bindingSession, CMISUser user) {

        UrlBuilder url = new UrlBuilder(cmisService
                .getBaseURL().concat(ZIP_CONTENT));
        url.addParameter("destination", user.getHomeFolder());
        url.addParameter("filename", finalApplicationName);
        url.addParameter("noaccent", true);
        url.addParameter("download", false);
        final JSONObject json = new JSONObject();
        json.put("nodes", documents);	                       
        bindingSession.put(SessionParameter.READ_TIMEOUT, -1);
		Response resZipContent = CmisBindingsHelper.getHttpInvoker(bindingSession).invokePOST(url, MimeTypes.JSON.mimetype(),
				new Output() {
					@Override
					public void write(OutputStream out) throws Exception {
            			out.write(json.toString().getBytes());
            		}
        		}, bindingSession);		
        if (resZipContent.getResponseCode() != HttpStatus.SC_OK) {
            throw new ClientMessageException(
                    "Errore nell'esecuzione di ZipContent (Alfresco): Errore "
                            + resZipContent.getResponseCode() + " - " + resZipContent.getErrorContent());
        }
        JSONObject jsonObject = new JSONObject(StringUtil.convertStreamToString(resZipContent.getStream()));
        return jsonObject.getString("nodeRef");
    }
}