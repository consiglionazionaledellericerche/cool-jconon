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
import it.cnr.jconon.repository.dto.CmisObjectCache;
import it.cnr.jconon.repository.dto.ObjectTypeCache;
import it.cnr.jconon.service.TypeService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

@Repository
public class CacheRepository {
	public static final String COMPETITION = "competition";
	public static final String JSONLIST_AFFIX_APPLICATION = "jsonlistAffixApplication";
	public static final String JSONLIST_CALL_TYPE = "jsonlistCallType";
	public static final String JSONLIST_APPLICATION_FIELDS_NOT_REQUIRED = "jsonlistApplicationFieldsNotRequired";
	public static final String JSONLIST_APPLICATION_ASPECTS = "jsonlistApplicationAspects";
	public static final String JSONLIST_APPLICATION_ATTACHMENTS = "jsonlistApplicationAttachments";
	public static final String JSONLIST_APPLICATION_NO_ASPECTS_FOREIGN = "jsonlistApplicationNoAspectsForeign";
	public static final String JSONLIST_APPLICATION_NO_ASPECTS_ITALIAN = "jsonlistApplicationNoAspectsItalian";
	public static final String JSONLIST_CALL_ATTACHMENTS = "jsonlistCallAttachments";
	public static final String JSONLIST_APPLICATION_PRODOTTI = "jsonlistApplicationProdotti";
	public static final String JSONLIST_TYPE_WITH_MANDATORY_ASPECTS = "jsonlistTypeWithMandatoryAspects";
	public static final String JSONLIST_APPLICATION_SCHEDE_ANONIME = "jsonlistApplicationSchedeAnonime";
	public static final String JSONLIST_APPLICATION_CURRICULUMS = "jsonlistApplicationCurriculums";
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
	
	@Cacheable(JSONLIST_APPLICATION_CURRICULUMS)
	public List<ObjectTypeCache> getApplicationCurriculums() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value(), false), null, false);
			return list;			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value());
			return null;
		}		
	}

	@Cacheable(JSONLIST_APPLICATION_SCHEDE_ANONIME)	
	public List<ObjectTypeCache> getApplicationSchedeAnonime() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA.value(), false), null, false);
			return list;
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA.value());
			return null;
		}		
	}

	@Cacheable(JSONLIST_TYPE_WITH_MANDATORY_ASPECTS)		
	public List<ObjectTypeCache> getTypeWithMandatoryAspects() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value(), false), null, true);
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value(), false), null, true);
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false), null, true);			
			return list;
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {} {} {}", JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value(), 
					JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value(), JCONONFolderType.JCONON_CALL.value());
			return null;
		}		
	}
	@Cacheable(JSONLIST_APPLICATION_PRODOTTI)
	public List<ObjectTypeCache> getApplicationProdotti() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value(), false), null, false);			
			return list;	
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value());
			return null;
		}		
	}
	@Cacheable(JSONLIST_CALL_ATTACHMENTS)
	public List<ObjectTypeCache> getCallAttachments() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_CALL_ABSTRACT.value(), false), null, false);			
			return list;		
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONDocumentType.JCONON_ATTACHMENT_CALL_ABSTRACT.value());
			return null;
		}		
	}
	@Cacheable(JSONLIST_APPLICATION_NO_ASPECTS_ITALIAN)
	public List<ObjectTypeCache> getApplicationNoAspectsItalian() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			addTo(list, cmisService.createAdminSession().getTypeDefinition(JCONONPolicyType.JCONON_APPLICATION_ASPECT_GODIMENTO_DIRITTI.value()), false);
			return list;	
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONPolicyType.JCONON_APPLICATION_ASPECT_GODIMENTO_DIRITTI.value());
			return null;
		}		
	}
	@Cacheable(JSONLIST_APPLICATION_NO_ASPECTS_FOREIGN)
	public List<ObjectTypeCache> getApplicationNoAspectsForeign() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			addTo(list, cmisService.createAdminSession().getTypeDefinition(JCONONPolicyType.JCONON_APPLICATION_ASPECT_ISCRIZIONE_LISTE_ELETTORALI.value()), false);
			return list;		
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONPolicyType.JCONON_APPLICATION_ASPECT_ISCRIZIONE_LISTE_ELETTORALI.value());
			return null;
		}		
	}	
	
	@Cacheable(JSONLIST_APPLICATION_ATTACHMENTS)
	public List<ObjectTypeCache> getApplicationAttachments() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT.value(), false), 
					JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value(), false);
			Arrays.asList(
					JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE,
					JCONONDocumentType.JCONON_ATTACHMENT_DOCUMENTO_RICONOSCIMENTO,
					JCONONDocumentType.JCONON_ATTACHMENT_TESI_LAUREA,
					JCONONDocumentType.JCONON_ATTACHMENT_ALLEGATO_GENERICO,
					JCONONDocumentType.JCONON_ATTACHMENT_NULLAOSTA_ALTRO_ENTE,
					JCONONDocumentType.JCONON_ATTACHMENT_DIC_SOST,
					JCONONDocumentType.JCONON_ATTACHMENT_VERIFICA_ATTIVITA,
					JCONONDocumentType.JCONON_ATTACHMENT_RELAZIONE_ATTIVITA,
					JCONONDocumentType.JCONON_ATTACHMENT_PAGAMENTI_DIRITTI_SEGRETERIA,
					JCONONDocumentType.JCONON_ATTACHMENT_PUBBLICAZIONE,
					JCONONDocumentType.JCONON_ATTACHMENT_FACSIMILE
			).stream().forEach(l -> addTo(list, cmisService.createAdminSession().getTypeDefinition(l.value()), false));
			return list;
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONPolicyType.JCONON_APPLICATION_ASPECT.value(), _ex);
			return null;
		}		
	}
	
	@Cacheable(JSONLIST_APPLICATION_ASPECTS)
	public List<ObjectTypeCache> getApplicationAspects() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONPolicyType.JCONON_APPLICATION_ASPECT.value(), false), null, false);
			addTo(list, bulkInfoService.find(JCONONPolicyType.JCONON_APPLICATION_ASPECT_CONDANNE_PENALI_RAPPORTO_LAVORO.value()));				
			addTo(list, bulkInfoService.find(JCONONPolicyType.JCONON_APPLICATION_ASPECT_CONDANNE_PENALI_REQUIRED.value()));				
			return list;
		} catch(CmisObjectNotFoundException  _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONPolicyType.JCONON_APPLICATION_ASPECT.value());
			return null;
		}		
	}
	
	@Cacheable(JSONLIST_APPLICATION_FIELDS_NOT_REQUIRED)
	public List<ObjectTypeCache> getApplicationFieldsNotRequired() {
		ObjectType objectType = cmisService.createAdminSession().
				getTypeDefinition(JCONONFolderType.JCONON_APPLICATION.value());
		List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
		for (PropertyDefinition<?> propertyDefinition : objectType.getPropertyDefinitions().values()) {
			if (propertyDefinition.isInherited())
				continue;
			LOGGER.debug("{} is property of {}", propertyDefinition.getId(), JCONONFolderType.JCONON_APPLICATION.value());
			list.add(new ObjectTypeCache().
					key(propertyDefinition.getId()).
					label(propertyDefinition.getId()).
					defaultLabel(propertyDefinition.getDisplayName())
			);
		}
		ObjectType objectAspectType = cmisService.createAdminSession().getTypeDefinition(JCONONPolicyType.JCONON_APPLICATION_ASPECT.value());
		completeWithChildren(objectAspectType, list);
		return list;
	}	
	
	@Cacheable(JSONLIST_CALL_TYPE)	
	public List<ObjectTypeCache> getCallType() {
		ItemIterable<ObjectType> objectTypes = cmisService.createAdminSession().
				getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false);
		List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
		populateCallType(list, objectTypes, true);
		return list;
	}
	
	@Cacheable(JSONLIST_AFFIX_APPLICATION)	
	public List<ObjectTypeCache> getAffixApplication() {
		List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
		String bulkInfoName = JCONONFolderType.JCONON_APPLICATION.value();
		BulkInfoCool bulkInfo = bulkInfoService.find(bulkInfoName);
		for (String formName : bulkInfo.getForms().keySet()) {
			if (formName.startsWith("affix")) {
				list.add(new ObjectTypeCache().
						key(formName).
						label(formName).
						defaultLabel(formName)
				);
			}
		}
		return list;
	}
	
	@Cacheable(COMPETITION)
	public CmisObjectCache getCompetitionFolder() {
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
		return new CmisObjectCache().id(competition.getId()).path(competition.getPath());
	}

	private void populateCallType(List<ObjectTypeCache> list, ItemIterable<ObjectType> objectTypes, boolean display) {
		for (ObjectType objectType : objectTypes) {
			ObjectTypeCache parent = new ObjectTypeCache().
					key(objectType.getId()).
					title(objectType.getDisplayName()).
					queryName(objectType.getQueryName()).
					label(objectType.getId()).
					description(objectType.getDescription()).
					display(display).
					defaultLabel(objectType.getDisplayName());				
			ItemIterable<ObjectType> childTypes = cmisService.createAdminSession().getTypeChildren(objectType.getId(), false);
			if (childTypes.getTotalNumItems() > 0) {
				parent = parent.childs(new ArrayList<ObjectTypeCache>());
				populateCallType(parent.getChilds(), childTypes, false);
			}
			list.add(parent);
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
	
	private void completeWithChildren(ObjectType objectAspectType, List<ObjectTypeCache> list) {
		for (ObjectType child : objectAspectType.getChildren()) {
			for (PropertyDefinition<?> propertyDefinition : child.getPropertyDefinitions().values()) {
				if (propertyDefinition.isInherited())
					continue;
				LOGGER.debug("{} is property of {}", propertyDefinition.getId(), JCONONFolderType.JCONON_APPLICATION.value());
				list.add(new ObjectTypeCache().
						key(propertyDefinition.getId()).
						label(propertyDefinition.getId()).
						defaultLabel(child.getDisplayName()+"["+propertyDefinition.getDisplayName()+"]")
				);
			}			
			completeWithChildren(child, list);
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

	private void populate(List<ObjectTypeCache> list, ItemIterable<ObjectType> objectTypes, String aspect, boolean includeMandatoryAspects) {
		for (ObjectType objectType : objectTypes) {
			boolean addToResponse = true;
			if (aspect != null ) {
				ObjectType type = cmisService.createAdminSession().
						getTypeDefinition(objectType.getId());
				addToResponse = hasAspect(type, aspect);
			}
			if (addToResponse) {
				LOGGER.debug(objectType.getId() + " is children of " + JCONONDocumentType.JCONON_ATTACHMENT.value());
				addTo(list, objectType, includeMandatoryAspects);
			}
			populate(list, cmisService.createAdminSession().
					getTypeChildren(objectType.getId(), false), aspect, includeMandatoryAspects);
		}
	}

	private void addTo(List<ObjectTypeCache> list, ObjectType objectType, Boolean includeMandatoryAspects) {
		ObjectTypeCache objectTypeCache = new ObjectTypeCache().
		key(objectType.getId()).
		label(objectType.getId()).
		description(objectType.getDescription()).
		defaultLabel(objectType.getDisplayName());
		if (includeMandatoryAspects)
			objectTypeCache.mandatoryAspects(typeService.getMandatoryAspects(objectType));
		list.add(objectTypeCache);
	}

	private void addTo(List<ObjectTypeCache> list, BulkInfoCool bulkInfo) {
		list.add(new ObjectTypeCache().
				key(bulkInfo.getId()).
				label(bulkInfo.getShortDescription()).
				description(bulkInfo.getLongDescription()).
				defaultLabel(bulkInfo.getShortDescription())
		);
	}
}
