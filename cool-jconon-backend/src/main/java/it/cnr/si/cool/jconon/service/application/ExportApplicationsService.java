/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.service.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.rest.Call;
import it.cnr.si.cool.jconon.service.cache.CompetitionFolderService;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.*;
import java.util.stream.Collectors;

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
    @Autowired
    private CompetitionFolderService competitionService;

    public Map<String, String> exportApplications(Session currentSession,
                                     BindingSession bindingSession, String nodeRefBando, CMISUser user, boolean all, boolean active, JSONArray types, List<String> applications) {
        Folder bando = (Folder) currentSession.getObject(nodeRefBando);
        String finalApplicationName = Call.refactoringFileName(Arrays.asList(
                "BANDO",
                bando.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()),
                Optional.ofNullable(bando.<String>getPropertyValue(JCONONPropertyIds.CALL_SEDE.value()))
                        .map(s -> s.replaceAll("[^a-zA-Z0-9]+"," "))
                        .orElse("")
        ).stream().collect(
                Collectors.joining("_")
        ), "_");
        Map<String, String> result;
        if (all) {
            List<String> documents = new ArrayList<String>();
            Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
            criteriaDomande.addColumn(PropertyIds.OBJECT_ID);
            criteriaDomande.add(Restrictions.inTree(nodeRefBando));
            criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
            if (active) {
                criteriaDomande.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
            }
            if(Optional.ofNullable(applications).filter(list -> !list.isEmpty()).isPresent()) {
                criteriaDomande.add(Restrictions.in(PropertyIds.OBJECT_ID, applications.toArray()));
            }
            ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(currentSession, false, currentSession.getDefaultContext());
            for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
                final String applicationId = queryResultDomande.getPropertyValueById(PropertyIds.OBJECT_ID);
                String applicationAttach = competitionService.findAttachmentId(currentSession, applicationId,
                        JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION, true);
                if (applicationAttach != null) {
                    documents.add(applicationAttach);
                }
            }
            if (documents.isEmpty()) {
                // Se non ci sono domande definitive finalCall non viene creata
                throw new ClientMessageException("Il bando "
                        + finalApplicationName
                        + " non presenta domande definitive");
            }
            result = invokePost(documents, finalApplicationName, bindingSession, user, true, types);
        } else {
            List<String> documents = callService.findDocumentFinal(currentSession, bindingSession,
                    nodeRefBando, JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION, applications);
            if (documents.isEmpty()) {
                // Se non ci sono domande definitive finalCall non viene creata
                throw new ClientMessageException("Il bando "
                        + finalApplicationName
                        + " non presenta domande definitive");
            }
            result = invokePost(documents, finalApplicationName, bindingSession, user, false, null);
        }
        result.put("filename", finalApplicationName);
        LOGGER.info("ExportApplicationsService - File " + finalApplicationName
                + ".zip creata");

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
     * @throws com.fasterxml.jackson.databind.JsonMappingException
     * @throws com.fasterxml.jackson.core.JsonParseException
     */
    @SuppressWarnings("unchecked")
	public Map<String, String> invokePost(List<String> documents, String finalApplicationName, BindingSession bindingSession, CMISUser user, boolean parent, JSONArray types){

        UrlBuilder url = new UrlBuilder(cmisService
                .getBaseURL().concat(ZIP_CONTENT));
        url.addParameter("destination", user.getHomeFolder());
        url.addParameter("filename", finalApplicationName);
        url.addParameter("noaccent", true);
        url.addParameter("download", false);
        url.addParameter("getParent", parent);
        if (Optional.ofNullable(types).filter(jsonArray -> jsonArray.length() > 0).isPresent()) {
            List<String> typeContent = new ArrayList<>();
            for(int i = 0; i < types.length(); i++){
                typeContent.add(String.valueOf(types.get(i)));
            }
            url.addParameter("typeContent", String.join(";", typeContent
                            .stream()
                            .map(s -> cmisService.createAdminSession().getTypeDefinition(s).getQueryName())
                            .collect(Collectors.toList()))
            );
        }

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