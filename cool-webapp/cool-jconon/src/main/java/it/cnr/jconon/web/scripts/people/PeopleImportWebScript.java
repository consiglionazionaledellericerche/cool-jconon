package it.cnr.jconon.web.scripts.people;

import it.cnr.cool.cmis.model.PolicyType;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.web.scripts.CMISWebScript;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.service.PeopleService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.alfresco.cmis.client.AlfrescoDocument;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectId;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.Property;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class PeopleImportWebScript extends CMISWebScript {
	private static final Logger LOGGER = LoggerFactory.getLogger(PeopleImportWebScript.class);
	@Autowired
	private PeopleService peopleService;

	@Autowired
	private NodeMetadataService nodeMetadataService;

    @Override
    protected Map<String, Object> executeImpl(WebScriptRequest req,
    		Status status, Cache cache) {
    	Map<String, Object>	model = super.executeImpl(req, status, cache);
    	Session jcononSession = getCMISSession();
    	Session peopleSession = peopleService.getCMISSession();
    	CmisObject peopleObject = peopleSession.getObject(req.getParameter("peopleId"));
    	Folder application = (Folder) jcononSession.getObject(req.getParameter("applicationId"));
    	try {
        	Map<String, Object> properties = new HashMap<String, Object>();
        	properties.put(PropertyIds.OBJECT_TYPE_ID, req.getParameter("jcononType"));
        	properties.put(PropertyIds.NAME, peopleObject.getName());
        	AlfrescoDocument document = (AlfrescoDocument) application.createDocument(properties, null, VersioningState.MAJOR);
        	document.addAspect(req.getParameter("aspect"));
        	if (req.getParameter("aspect").equalsIgnoreCase(JCONONPolicyType.PEOPLE_SELECTED_PRODUCT.value())) {
        		scaricaAllegatiPeople(document, application, peopleObject.getName() +"_attaches");
        	}
        	Map<String, Object> peopleProperties = getPeopleProperties(document, peopleObject);
        	peopleProperties.put(PropertyIds.OBJECT_TYPE_ID, req.getParameter("jcononType"));
        	List<String> aspects = new ArrayList<String>();
        	for (ObjectType aspectType : document.getAspects()) {
        		aspects.add(aspectType.getId());
			}
        	peopleProperties.put(PolicyType.ASPECT_REQ_PARAMETER_NAME, aspects.toArray(new String[aspects.size()]));
        	properties = new HashMap<String, Object>();
        	HttpServletRequest request = ServletUtil.getRequest();
			properties.putAll(nodeMetadataService.populateMetadataType(
					jcononSession, peopleProperties, request));
			properties.putAll(nodeMetadataService.populateMetadataAspect(
					jcononSession, peopleProperties, request));
    		document.updateProperties(properties);
    	} catch(CmisContentAlreadyExistsException _ex) {
			throw ClientMessageException.FILE_ALREDY_EXISTS;
		} catch (ParseException e) {
			throw new WebScriptException("Error in import People product", e);
		}
    	return model;
    }

    private void scaricaAllegatiPeople(AlfrescoDocument jcononDocument, Folder application, String peopleFolderName) {
    	String nodeRefPeopleFolder = getPeopleFolderByName(peopleFolderName);
    	if (nodeRefPeopleFolder != null) {
    		Criteria criteria = CriteriaFactory.createCriteria(BaseTypeId.CMIS_DOCUMENT.value());
    		criteria.add(Restrictions.inFolder(getPeopleFolderByName(peopleFolderName)));
    		ItemIterable<QueryResult> peopleDocuments = criteria.executeQuery(peopleService.getCMISSession(), false,
    				peopleService.getCMISSession().getDefaultContext());
    		for (QueryResult queryResult : peopleDocuments) {
				Document peopleDocument = (Document) peopleService.getCMISSession().getObject(
						(String)queryResult.getPropertyValueById(PropertyIds.OBJECT_ID));
				Map<String, Object> properties = new HashMap<String, Object>();
				properties.put(PropertyIds.NAME, peopleDocument.getName());
				properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
				ObjectId newObjectId = getCMISSession().createDocument(properties,
						application,
						peopleDocument.getContentStream(), VersioningState.MAJOR);
				try {
					AlfrescoDocument newDocument = (AlfrescoDocument) getCMISSession().getObject(newObjectId);
					newDocument.addAspect(JCONONPolicyType.TITLED_ASPECT.value());
					newDocument.refresh();
					Map<String, Object> propertiesAspect = new HashMap<String, Object>();
					propertiesAspect.put("cm:title", peopleDocument.getPropertyValue("cm:title"));
					propertiesAspect.put("cm:description", peopleDocument.getPropertyValue("cm:description"));
					newDocument.updateProperties(propertiesAspect);
				} catch (Exception _ex) {
					LOGGER.error("impossibile scaricare l'allegato people", _ex);
				}
				Map<String, Object> propertiesRel = new HashMap<String, Object>();
				propertiesRel.put(PropertyIds.SOURCE_ID, jcononDocument.getId());
				propertiesRel.put(PropertyIds.TARGET_ID, newObjectId.getId());
				propertiesRel.put(PropertyIds.OBJECT_TYPE_ID, "R:jconon_attachment:in_prodotto");
				getCMISSession().createRelationship(propertiesRel);
			}
    	}
	}

	private String getPeopleFolderByName(String peopleFolderName) {
		Criteria criteria = CriteriaFactory.createCriteria(BaseTypeId.CMIS_FOLDER.value());
		criteria.add(Restrictions.eq(PropertyIds.NAME, peopleFolderName));
		ItemIterable<QueryResult> peopleFolders = criteria.executeQuery(peopleService.getCMISSession(), false,
				peopleService.getCMISSession().getDefaultContext());
		for (QueryResult queryResult : peopleFolders) {
			return queryResult.getPropertyValueById(PropertyIds.OBJECT_ID);
		}
		return null;
	}

	private Map<String, Object> getPeopleProperties(Document jcononDocument, CmisObject peopleObject) {
		Map<String, Object> properties = new HashMap<String, Object>();
    	for (Property<?> property : peopleObject.getProperties()) {
			if (!property.getDefinition().isInherited()) {
				properties.put("cvpeople:" + property.getLocalName(),property.getValue());
			}
		}
    	/**
    	 * Propietà gestite custom
    	 */
    	Pattern regex = Pattern.compile("<!\\[CDATA\\[(.*)\\]\\]>");
    	try {
    		if (((AlfrescoDocument)jcononDocument).hasAspect("P:cvpeople:commonArticolo")) {
        		String value = peopleObject.getPropertyValue("prodotti:indicizzato_da_banca_dati_json");
        		if (value != null) {
        			Matcher regexMatcher = regex.matcher(value);
        			JsonElement element = new JsonParser().parse(regexMatcher.replaceAll("$1"));
        			if (element.isJsonArray()) {
        				JsonArray jsonArray = (JsonArray)element;
        				if (jsonArray.size() > 0) {
            				JsonElement jsonObject = jsonArray.get(0);
            				String bancadati = jsonObject.getAsJsonObject().get("bancadati").getAsString();
            				String codice = jsonObject.getAsJsonObject().get("codice").getAsString();
            				properties.put("cvpeople:altroClassificazioneTipo",bancadati);
            				properties.put("cvpeople:indiceClassificazioneCodice",codice);
        				}
        			}
        		}
    		}
    		if (((AlfrescoDocument)jcononDocument).hasAspect("P:cvpeople:commonLibro")) {
    			properties.put("cvpeople:libro_issn", peopleObject.getPropertyValue("prodotti:rivista2_issn"));
    		}
    	}catch(Exception _ex) {
			LOGGER.warn("Errore in Propietà gestite custom", _ex);
    	}
    	return properties;
    }

}
