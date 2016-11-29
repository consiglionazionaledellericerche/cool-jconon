package it.cnr.jconon.repository;

import it.cnr.bulkinfo.cool.BulkInfoCool;
import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.security.GroupsEnum;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.MimeTypes;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.service.TypeService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;

import java.io.OutputStream;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectId;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

@Repository
public class CacheRepository {
    private static final String P_JCONON_APPLICATION_ASPECT_CONDANNE_PENALI_REQUIRED = "P:jconon_application:aspect_condanne_penali_required";
	private static final String P_JCONON_APPLICATION_ASPECT_CONDANNE_PENALI_RAPPORTO_LAVORO = "P:jconon_application:aspect_condanne_penali_rapporto_lavoro";
	private static final String P_JCONON_APPLICATION_ASPECTS = "P:jconon_application:aspects";
	private static final Logger LOGGER = LoggerFactory.getLogger(CacheRepository.class);
	@Autowired
	private BulkInfoCoolService bulkInfoService;
	@Autowired
	private CMISService cmisService;
	@Autowired
	private ACLService aclService;
    @Autowired
    private TypeService typeService;
	@Autowired
	private UserService userService;
    @Autowired
    private I18nService i18NService;
    
	@Value("${user.guest.username}")
	private String guestUserName;
	@Value("${user.guest.password}")
	private String guestPassword;
	
	@Cacheable("jsonlistApplicationCurriculums")
	public String getApplicationCurriculums() {
		try {
			JSONArray json = new JSONArray();
			populateJSONArray(json, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value(), false), null, false);
			return json.toString();			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value());
			return null;
		}		
	}

	@Cacheable("jsonlistApplicationSchedeAnonime")	
	public String getApplicationSchedeAnonime() {
		try {
			JSONArray json = new JSONArray();
			populateJSONArray(json, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA.value(), false), null, false);
			return json.toString();			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA.value());
			return null;
		}		
	}

	@Cacheable("jsonlistTypeWithMandatoryAspects")		
	public String getTypeWithMandatoryAspects() {
		try {
			JSONArray json = new JSONArray();
			populateJSONArray(json, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value(), false), null, true);
			populateJSONArray(json, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value(), false), null, true);
			populateJSONArray(json, cmisService.createAdminSession().
					getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false), null, true);
			
			return json.toString();			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {} {} {}", JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value(), 
					JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value(), JCONONFolderType.JCONON_CALL.value());
			return null;
		}		
	}
	@Cacheable("jsonlistApplicationProdotti")
	public String getApplicationProdotti() {
		try {
			JSONArray json = new JSONArray();
			populateJSONArray(json, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value(), false), null, false);			
			return json.toString();			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value());
			return null;
		}		
	}
	@Cacheable("jsonlistCallAttachments")
	public String getCallAttachments() {
		try {
			JSONArray json = new JSONArray();
			populateJSONArray(json, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_CALL_ABSTRACT.value(), false), null, false);			
			return json.toString();			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONDocumentType.JCONON_ATTACHMENT_CALL_ABSTRACT.value());
			return null;
		}		
	}
	@Cacheable("jsonlistApplicationNoAspectsItalian")
	public String getApplicationNoAspectsItalian() {
		try {
			JSONArray json = new JSONArray();
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONPolicyType.JCONON_APPLICATION_ASPECT_GODIMENTO_DIRITTI.value()), false);
			return json.toString();			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONPolicyType.JCONON_APPLICATION_ASPECT_GODIMENTO_DIRITTI.value());
			return null;
		}		
	}
	@Cacheable("jsonlistApplicationNoAspectsForeign")
	public String getApplicationNoAspectsForeign() {
		try {
			JSONArray json = new JSONArray();
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONPolicyType.JCONON_APPLICATION_ASPECT_ISCRIZIONE_LISTE_ELETTORALI.value()), false);
			return json.toString();			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONPolicyType.JCONON_APPLICATION_ASPECT_ISCRIZIONE_LISTE_ELETTORALI.value());
			return null;
		}		
	}	
	
	@Cacheable("jsonlistApplicationAttachments")
	public String getApplicationAttachments() {
		try {
			JSONArray json = new JSONArray();
			populateJSONArray(json, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT.value(), false), "P:jconon_attachment:generic_document", false);
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE.value()), false);
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_DOCUMENTO_RICONOSCIMENTO.value()), false);
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_TESI_LAUREA.value()), false);
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_ALLEGATO_GENERICO.value()), false);
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_NULLAOSTA_ALTRO_ENTE.value()), false);
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_DIC_SOST.value()), false);
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_VERIFICA_ATTIVITA.value()), false);
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_RELAZIONE_ATTIVITA.value()), false);
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_PAGAMENTI_DIRITTI_SEGRETERIA.value()), false);
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_PUBBLICAZIONE.value()), false);
			addToJSON(json, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_FACSIMILE.value()), false);
			return json.toString();			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", P_JCONON_APPLICATION_ASPECTS, _ex);
			return null;
		}		
	}
	
	@Cacheable("jsonlistApplicationAspects")
	public String getApplicationAspects() {
		try {
			JSONArray json = new JSONArray();
			populateJSONArray(json, cmisService.createAdminSession().
					getTypeChildren(P_JCONON_APPLICATION_ASPECTS, false), null, false);
			addToJSON(json, bulkInfoService.find(P_JCONON_APPLICATION_ASPECT_CONDANNE_PENALI_RAPPORTO_LAVORO));				
			addToJSON(json, bulkInfoService.find(P_JCONON_APPLICATION_ASPECT_CONDANNE_PENALI_REQUIRED));				
			return json.toString();			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", P_JCONON_APPLICATION_ASPECTS);
			return null;
		}		
	}
	
	@Cacheable("jsonlistApplicationFieldsNotRequired")
	public String getApplicationFieldsNotRequired() {
		ObjectType objectType = cmisService.createAdminSession().
				getTypeDefinition(JCONONFolderType.JCONON_APPLICATION.value());
		JSONArray json = new JSONArray();

		for (PropertyDefinition<?> propertyDefinition : objectType.getPropertyDefinitions().values()) {
			if (propertyDefinition.isInherited())
				continue;
			LOGGER.debug(propertyDefinition.getId() + " is property of " + JCONONFolderType.JCONON_APPLICATION.value());
			try {
				JSONObject jsonObj = new JSONObject();
				jsonObj.put("key", propertyDefinition.getId());
				jsonObj.put("label", propertyDefinition.getId());
				jsonObj.put("defaultLabel", propertyDefinition.getDisplayName());
				json.put(jsonObj);
			} catch (JSONException e) {
				LOGGER.error(e.getMessage(), e);
			}
		}
		ObjectType objectAspectType = cmisService.createAdminSession().getTypeDefinition(JCONONPolicyType.JCONON_APPLICATION_ASPECT.value());
		completeWithChildren(objectAspectType, json);
		return json.toString();
	}	
	
	@Cacheable("jsonlistCallType")	
	public String getCallType() {
		ItemIterable<ObjectType> objectTypes = cmisService.createAdminSession().
				getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false);
		JSONArray json = new JSONArray();
		populateJsonlistCallType(json, objectTypes, null);
		return json.toString();
	}
	
	@Cacheable("jsonlistAffixApplication")	
	public String getAffixApplication() {
		JSONArray json = new JSONArray();

		String bulkInfoName = JCONONFolderType.JCONON_APPLICATION.value().replace(":", "_");

		BulkInfoCool bulkInfo = bulkInfoService.find(bulkInfoName);

		for (String formName : bulkInfo.getForms().keySet()) {
			if (formName.startsWith("affix")) {
				try {
					JSONObject jsonObj = new JSONObject();
					jsonObj.put("key", formName);
					jsonObj.put("label", formName);
					jsonObj.put("defaultLabel", formName);
					json.put(jsonObj);
				} catch (JSONException e) {
					LOGGER.error(e.getMessage(), e);
				}
			}
		}
		return json.toString();
	}
	
	@Cacheable("competition")
	public String getCompetitionFolder() {
		Folder competition = null;
		Session session = cmisService.createAdminSession();
		Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_COMPETITION.queryName());
		ItemIterable<QueryResult> results = criteria.executeQuery(session, false, session.getDefaultContext());
		if (results.getTotalNumItems() == 0) {
			Map<String, String> properties = new HashMap<String, String>();
			properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONFolderType.JCONON_COMPETITION.value());
			properties.put(PropertyIds.NAME, i18NService.getLabel("app.name", Locale.ITALIAN));
			competition = (Folder) session.getObject(session.createFolder(properties, session.getRootFolder()));
			/**
			 * Creo anche i gruppi necessari al funzionamento
			 */
			createGroup(null, "CONCORSI", "CONCORSI");
			createGroup(null, "COMMISSIONI_CONCORSO", "COMMISSIONI CONCORSO");
			createGroup(null, "RDP_CONCORSO", "RESPONSABILI BANDI");
			createGroup(null, "GESTORI_BANDI", "GESTORI BANDI", "[\"APP.DEFAULT\", \"AUTH.EXT.gestori\"]");
			
			for (ObjectType objectType : session.getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false)) {
				createGroup("GROUP_GESTORI_BANDI", 
						"GESTORI_" + objectType.getId().replace(":", "_").toUpperCase(), 
						"GESTORI " + objectType.getDisplayName(), 
						"[\"APP.DEFAULT\", \"AUTH.EXT.gestori\"]", 
						"{\"jconon_group_gestori:call_type\": \"" + objectType.getId() +"\"}");					
			}
			
	        Map<String, ACLType> aces = new HashMap<String, ACLType>();
	        aces.put(GroupsEnum.CONCORSI.value(), ACLType.Contributor);
	        aces.put("GROUP_GESTORI_BANDI", ACLType.Contributor);
	        aclService.addAcl(cmisService.getAdminSession(), competition.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
	        try {
	        	CMISUser user = new CMISUser();
	        	user.setFirstName(guestUserName);
	        	user.setLastName(guestUserName);
	        	user.setUserName(guestUserName);
	        	user.setPassword(guestPassword);
	        	user.setEmail("anonymus@anonymus.it");
		        userService.createUser(user);
		        userService.enableAccount(user.getUserName());
	        }catch (CoolUserFactoryException _ex) {
	        	LOGGER.error("Cannot create guest user in repository", _ex);
	        }
		} else {
			for (QueryResult queryResult : results) {
				ObjectId objectId = session.createObjectId((String) queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
				competition = (Folder) session.getObject(objectId);
			}
		}		
		
		JSONObject jsonObj = new JSONObject();
		try {
			jsonObj.put("id", competition.getId());
			jsonObj.put("path", competition.getPath());
		} catch (JSONException e) {
			LOGGER.error(e.getMessage(), e);
		}
		return jsonObj.toString();
	}

	private void populateJsonlistCallType(JSONArray json, ItemIterable<ObjectType> objectTypes, JSONArray jsonDisplay) {
		for (ObjectType objectType : objectTypes) {
			try {
				JSONObject jsonObj = new JSONObject();
				jsonObj.put("id", objectType.getId());
				jsonObj.put("title", objectType.getDisplayName());
				jsonObj.put("description", objectType.getDescription());
				jsonObj.put("queryName", objectType.getQueryName());
				jsonObj.put("display", true);
				json.put(jsonObj);
				if (jsonDisplay != null) {
					jsonObj.put("display", false);
					jsonDisplay.put(jsonObj);
				}					
				ItemIterable<ObjectType> childTypes = cmisService.createAdminSession().getTypeChildren(objectType.getId(), false);
				if (childTypes.getTotalNumItems() > 0) {
					JSONArray jsonChilds = new JSONArray();
					jsonObj.put("childs", jsonChilds);
					populateJsonlistCallType(jsonChilds, childTypes, json);
				}
			} catch (JSONException e) {
				LOGGER.error(e.getMessage(), e);
			}
		}
		
	}	
	private void createGroup(final String parent_group_name, final String group_name, final String display_name) {
		createGroup(parent_group_name, group_name, display_name, null);
	}
	private void createGroup(final String parent_group_name, final String group_name, final String display_name, final String zones) {
		createGroup(parent_group_name, group_name, display_name, zones, null);
	}
	
	private void createGroup(final String parent_group_name, final String group_name, final String display_name, final String zones, final String extraProperty) {
        String link = cmisService.getBaseURL().concat("service/cnr/groups/group");
        UrlBuilder url = new UrlBuilder(link);
        Response response = CmisBindingsHelper.getHttpInvoker(
        		cmisService.getAdminSession()).invokePOST(url, MimeTypes.JSON.mimetype(),
                new Output() {
                    @Override
                    public void write(OutputStream out) throws Exception {
                    	String groupJson = "{";
                    	if (parent_group_name != null) {
                    		groupJson = groupJson.concat("\"parent_group_name\":\"" + parent_group_name + "\",");
                    	}
                    	groupJson = groupJson.concat("\"group_name\":\"" + group_name + "\",");
                    	groupJson = groupJson.concat("\"display_name\":\"" + display_name + "\",");
                    	if (extraProperty != null)
                        	groupJson = groupJson.concat("\"extraProperty\":" + extraProperty + ",");
                    		
                    	if (zones == null)
                    		groupJson = groupJson.concat("\"zones\":[\"AUTH.ALF\",\"APP.DEFAULT\"]");
                    	else
                    		groupJson = groupJson.concat("\"zones\":" + zones);
                    	groupJson = groupJson.concat("}");
                    	out.write(groupJson.getBytes());
                    }
                }, cmisService.getAdminSession());
        if (response.getErrorContent() != null)
        	LOGGER.error(response.getErrorContent());
	}
	
	private void completeWithChildren(ObjectType objectAspectType, JSONArray json) {
		for (ObjectType child : objectAspectType.getChildren()) {
			for (PropertyDefinition<?> propertyDefinition : child.getPropertyDefinitions().values()) {
				if (propertyDefinition.isInherited())
					continue;
				LOGGER.debug(propertyDefinition.getId() + " is property of " + JCONONFolderType.JCONON_APPLICATION.value());
				try {
					JSONObject jsonObj = new JSONObject();
					jsonObj.put("key", propertyDefinition.getId());
					jsonObj.put("label", propertyDefinition.getId());
					jsonObj.put("defaultLabel", child.getDisplayName()+"["+propertyDefinition.getDisplayName()+"]");
					json.put(jsonObj);
				} catch (JSONException e) {
					LOGGER.error(e.getMessage(), e);
				}
			}			
			completeWithChildren(child, json);
		}		
		
	}
	
	private boolean hasAspect(ObjectType type, String aspect) {
		boolean hasAspect = false;
		for (String mandatoryAspect : typeService.getMandatoryAspects(type)) {
			if (mandatoryAspect.equals(aspect))
				return true;
		}
		return hasAspect;
	}

	private void populateJSONArray(JSONArray json, ItemIterable<ObjectType> objectTypes, String aspect, boolean includeMandatoryAspects) {
		for (ObjectType objectType : objectTypes) {
			boolean addToResponse = true;
			if (aspect != null ) {
				ObjectType type = cmisService.createAdminSession().
						getTypeDefinition(objectType.getId());
				addToResponse = hasAspect(type, aspect);
			}
			if (addToResponse) {
				LOGGER.debug(objectType.getId() + " is children of " + JCONONDocumentType.JCONON_ATTACHMENT.value());
				addToJSON(json, objectType, includeMandatoryAspects);
			}
			populateJSONArray(json, cmisService.createAdminSession().
					getTypeChildren(objectType.getId(), false), aspect, includeMandatoryAspects);
		}
	}

	private void addToJSON(JSONArray json, ObjectType objectType, boolean includeMandatoryAspects) {
		try {
			JSONObject jsonObj = new JSONObject();
			jsonObj.put("key", objectType.getId());
			jsonObj.put("label", objectType.getId());
			jsonObj.put("description", objectType.getDescription());
			jsonObj.put("defaultLabel", objectType.getDisplayName());
			
			if (includeMandatoryAspects) {
				jsonObj.put("mandatoryAspects", typeService.getMandatoryAspects(objectType));
			}
			json.put(jsonObj);
		} catch (JSONException e) {
			LOGGER.error(e.getMessage(), e);
		}
	}

	private void addToJSON(JSONArray json, BulkInfoCool bulkInfo) {
		try {
			JSONObject jsonObj = new JSONObject();
			jsonObj.put("key", bulkInfo.getId());
			jsonObj.put("label", bulkInfo.getShortDescription());
			jsonObj.put("description", bulkInfo.getLongDescription());
			jsonObj.put("defaultLabel", bulkInfo.getShortDescription());
			json.put(jsonObj);
		} catch (JSONException e) {
			LOGGER.error(e.getMessage(), e);
		}		
	}
}
