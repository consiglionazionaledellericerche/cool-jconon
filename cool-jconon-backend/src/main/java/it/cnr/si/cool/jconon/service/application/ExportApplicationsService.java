package it.cnr.si.cool.jconon.service.application;

import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.rest.Call;
import it.cnr.si.cool.jconon.service.call.CallService;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.QueryStatement;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExportApplicationsService {
    private static final String SELECT_APPLICATION_BASE = "SELECT ? FROM ? WHERE IN_TREE(?) AND ? = ?",
    		SELECT_APPLICATION_ACTIVE = SELECT_APPLICATION_BASE.concat(" AND ? IS NULL");
	private static final Logger LOGGER = LoggerFactory
            .getLogger(ExportApplicationsService.class);
    private static final String ZIP_CONTENT = "service/zipper/zipContent";
    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;
    @Autowired
    private ACLService aclService;

    public static void main(String[] args) {
    	boolean active = true;
    	String query = Optional.of(active).filter(x -> x.equals(Boolean.TRUE)).map(x -> SELECT_APPLICATION_ACTIVE).orElse(SELECT_APPLICATION_BASE);
    	System.out.println(query);
	}
    public Map<String, String> exportApplications(Session currentSession,
                                     BindingSession bindingSession, String nodeRefBando, CMISUser user, boolean all, boolean active) {

        Folder bando = (Folder) currentSession.getObject(nodeRefBando);
        String finalApplicationName = Call.refactoringFileName(bando.getName(), "_");

        Map<String, String> result;
        if (all) {
        	QueryStatement qs = currentSession.createQueryStatement(Optional.of(active).filter(x -> x.equals(Boolean.TRUE)).map(x -> SELECT_APPLICATION_ACTIVE).orElse(SELECT_APPLICATION_BASE));        	
        	qs.setProperty(1, JCONONFolderType.JCONON_APPLICATION.value(), PropertyIds.OBJECT_ID);
        	qs.setType(2, JCONONFolderType.JCONON_APPLICATION.value());
        	qs.setString(3, nodeRefBando);
        	qs.setProperty(4, JCONONFolderType.JCONON_APPLICATION.value(), JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value());
        	qs.setString(5, ApplicationService.StatoDomanda.CONFERMATA.getValue());        	
        	if (active)
        		qs.setProperty(6, JCONONFolderType.JCONON_APPLICATION.value(), JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value());
        	result = invokePost(qs.toQueryString(), finalApplicationName, bindingSession, user);        	
        } else {
            List<String> documents = callService.findDocumentFinal(currentSession, bindingSession,
                    nodeRefBando, JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION);
            if (documents.isEmpty()) {
                // Se non ci sono domande definitive finalCall non viene creata
                throw new ClientMessageException("Il bando "
                        + finalApplicationName
                        + " non presenta domande definitive");
            }
            result = invokePost(documents, finalApplicationName, bindingSession, user);
        }
        	        
        LOGGER.info("ExportApplicationsService - File " + finalApplicationName
                + ".zip creata");

        return result;
    }
    /**
    *
    * Effettua la get su ZipContent (alfresco)
    *
    * @param query
    * @param finalApplicationName
    * @param bindingSession
    * @param user
    * @return
    */
   @SuppressWarnings("unchecked")
   public Map<String, String> invokePost(String query, String finalApplicationName, BindingSession bindingSession, CMISUser user) {

       UrlBuilder url = new UrlBuilder(cmisService
               .getBaseURL().concat(ZIP_CONTENT));
       url.addParameter("destination", user.getHomeFolder());
       url.addParameter("filename", finalApplicationName);
       url.addParameter("noaccent", true);
       url.addParameter("download", false);
       url.addParameter("query", query);

       bindingSession.put(SessionParameter.READ_TIMEOUT, -1);
       Response resZipContent = CmisBindingsHelper.getHttpInvoker(bindingSession).invokePOST(url, MimeTypes.JSON.mimetype(), null, bindingSession);		
       if (resZipContent.getResponseCode() != HttpStatus.SC_OK) {
           throw new ClientMessageException(
                   "Errore nell'esecuzione di ZipContent (Alfresco): Errore "
                           + resZipContent.getResponseCode() + " - " + resZipContent.getErrorContent());
       }
       InputStreamReader reader = new InputStreamReader(resZipContent.getStream());
       Map<String, String> result = null;
		try {
			result = new ObjectMapper().readValue(reader, Map.class);
		} catch (IOException e) {
			LOGGER.error("Errore nell'esecuzione di ZipContent (Alfresco)", e);
           throw new ClientMessageException(
                   "Errore nell'esecuzione di ZipContent (Alfresco): Errore: " + e.getMessage());
		}
       return result;
   }
    /**
     *
     * Effettua la get su ZipContent (alfresco)
     *
     * @param documents
     * @param finalApplicationName
     * @param bindingSession
     * @param user
     * @return
     * @throws IOException 
     * @throws JsonMappingException 
     * @throws JsonParseException 
     */
    @SuppressWarnings("unchecked")
	public Map<String, String> invokePost(List<String> documents, String finalApplicationName, BindingSession bindingSession, CMISUser user){

        UrlBuilder url = new UrlBuilder(cmisService
                .getBaseURL().concat(ZIP_CONTENT));
        url.addParameter("destination", user.getHomeFolder());
        url.addParameter("filename", finalApplicationName);
        url.addParameter("noaccent", true);
        url.addParameter("download", false);
        bindingSession.put(SessionParameter.READ_TIMEOUT, -1);
		Response resZipContent = CmisBindingsHelper.getHttpInvoker(bindingSession).invokePOST(url, MimeTypes.JSON.mimetype(),
				new Output() {
					@Override
					public void write(OutputStream out) throws Exception {
						new ObjectMapper().writeValue(out, Collections.singletonMap("nodes", documents));
            		}
        		}, bindingSession);		
        if (resZipContent.getResponseCode() != HttpStatus.SC_OK) {
            throw new ClientMessageException(
                    "Errore nell'esecuzione di ZipContent (Alfresco): Errore "
                            + resZipContent.getResponseCode() + " - " + resZipContent.getErrorContent());
        }
        InputStreamReader reader = new InputStreamReader(resZipContent.getStream());
        Map<String, String> result = null;
		try {
			result = new ObjectMapper().readValue(reader, Map.class);
		} catch (IOException e) {
			LOGGER.error("Errore nell'esecuzione di ZipContent (Alfresco)", e);
            throw new ClientMessageException(
                    "Errore nell'esecuzione di ZipContent (Alfresco): Errore: " + e.getMessage());
		}
        return result;
    }
}