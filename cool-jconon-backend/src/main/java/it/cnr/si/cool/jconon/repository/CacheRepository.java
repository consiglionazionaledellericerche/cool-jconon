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

package it.cnr.si.cool.jconon.repository;

import it.cnr.bulkinfo.cool.BulkInfoCool;
import it.cnr.cool.BulkInfoRepository;
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
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPolicyType;
import it.cnr.si.cool.jconon.pagopa.model.PAGOPAObjectType;
import it.cnr.si.cool.jconon.repository.dto.CmisObjectCache;
import it.cnr.si.cool.jconon.repository.dto.ObjectTypeCache;
import it.cnr.si.cool.jconon.service.SiperService;
import it.cnr.si.cool.jconon.service.TypeService;
import it.cnr.si.cool.jconon.util.JcononGroups;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperReport;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Repository
public class CacheRepository {
	public static final String COMPETITION = "competition";
	public static final String JSONLIST_AFFIX_APPLICATION = "jsonlistAffixApplication";
	public static final String JSONLIST_CALL_TYPE = "jsonlistCallType";
	public static final String JSONLIST_APPLICATION_FIELDS_NOT_REQUIRED = "jsonlistApplicationFieldsNotRequired";
	public static final String JSONLIST_APPLICATION_ASPECTS = "jsonlistApplicationAspects";
	public static final String JSONLIST_ATTACHMENTS = "jsonlistAttachments";
	public static final String JSONLIST_APPLICATION_ATTACHMENTS = "jsonlistApplicationAttachments";
	public static final String JSONLIST_APPLICATION_NO_ASPECTS_FOREIGN = "jsonlistApplicationNoAspectsForeign";
	public static final String JSONLIST_APPLICATION_NO_ASPECTS_ITALIAN = "jsonlistApplicationNoAspectsItalian";
	public static final String JSONLIST_CALL_ATTACHMENTS = "jsonlistCallAttachments";
	public static final String JSONLIST_APPLICATION_PRODOTTI = "jsonlistApplicationProdotti";
	public static final String JSONLIST_TYPE_WITH_MANDATORY_ASPECTS = "jsonlistTypeWithMandatoryAspects";
	public static final String JSONLIST_APPLICATION_SCHEDE_ANONIME = "jsonlistApplicationSchedeAnonime";
	public static final String JSONLIST_APPLICATION_CURRICULUMS = "jsonlistApplicationCurriculums";
    public static final String JSONLIST_CALL_FIELDS = "jsonlistCallFields";
	public static final String JASPER_CACHE = "jasperCache";
	private static final Logger LOGGER = LoggerFactory.getLogger(CacheRepository.class);
	@Autowired
	private BulkInfoCoolService bulkInfoService;
	@Autowired
	CacheManager cacheManager;

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

	@Value("${repository.base.url}")
	private String baseURL;

	@Cacheable(JSONLIST_APPLICATION_CURRICULUMS)
	public List<ObjectTypeCache> getApplicationCurriculums() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value(), false), null, false);
			return list;			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}",
					JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value(), _ex);
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
			LOGGER.warn("Cannot find Model in repository parentTypes: {}",
					JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA.value(), _ex);
			return null;
		}		
	}

	@Cacheable(JSONLIST_TYPE_WITH_MANDATORY_ASPECTS)		
	public List<ObjectTypeCache> getTypeWithMandatoryAspects() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value(), true), null, true);
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value(), true), null, true);
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONFolderType.JCONON_CALL.value(), true), null, true);
			return list;
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {} {} {}",
					JCONONDocumentType.JCONON_ATTACHMENT_CV_ELEMENT.value(),
					JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value(), JCONONFolderType.JCONON_CALL.value(), _ex);
			return null;
		}		
	}
	@Cacheable(JSONLIST_APPLICATION_PRODOTTI)
	public List<ObjectTypeCache> getApplicationProdotti() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value(), false), null, false);
			addTo(list, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_PROD_SCELTI.value()), false);
			addTo(list, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_PROD_SCELTI_MULTIPLO.value()), false);
			addTo(list, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE_ELENCO_PRODOTTI_SCELTI.value()), false);
			addTo(list, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE_ULTERIORE_ELENCO_PRODOTTI_SCELTI.value()), false);
			addTo(list, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_CVPEOPLE_ATTACHMENT_ELENCO_PRODOTTI_SCELTI.value()), false);
			addTo(list, cmisService.createAdminSession().getTypeDefinition(JCONONDocumentType.JCONON_CVPEOPLE_ATTACHMENT_PRODOTTI_SCELTI_MULTIPLO.value()), false);
			return list;
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value(), _ex);
			return null;
		}		
	}
	@Cacheable(JSONLIST_CALL_ATTACHMENTS)
	public List<ObjectTypeCache> getCallAttachments() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
					getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT_CALL_ABSTRACT.value(), false), null, false);
			return list
					.stream()
					.collect(Collectors.toList());
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}",
					JCONONDocumentType.JCONON_ATTACHMENT_CALL_ABSTRACT.value(), _ex);
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
			LOGGER.warn("Cannot find Model in repository parentTypes: {}",
					JCONONPolicyType.JCONON_APPLICATION_ASPECT_GODIMENTO_DIRITTI.value(), _ex);
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
			LOGGER.warn("Cannot find Model in repository parentTypes: {}",
					JCONONPolicyType.JCONON_APPLICATION_ASPECT_ISCRIZIONE_LISTE_ELETTORALI.value(), _ex);
			return null;
		}		
	}

	@Cacheable(JSONLIST_ATTACHMENTS)
	public List<ObjectTypeCache> getAttachments() {
		try {
			List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
			populate(list, cmisService.createAdminSession().
							getTypeChildren(JCONONDocumentType.JCONON_ATTACHMENT.value(), false),
					null, false);
			return list;
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONDocumentType.JCONON_ATTACHMENT.value(), _ex);
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
					JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE.value(),
					JCONONDocumentType.JCONON_ATTACHMENT_DOCUMENTO_RICONOSCIMENTO.value(),
					JCONONDocumentType.JCONON_ATTACHMENT_TESI_LAUREA.value(),
					JCONONDocumentType.JCONON_ATTACHMENT_ALLEGATO_GENERICO.value(),
					JCONONDocumentType.JCONON_ATTACHMENT_NULLAOSTA_ALTRO_ENTE.value(),
					JCONONDocumentType.JCONON_ATTACHMENT_DIC_SOST.value(),
					JCONONDocumentType.JCONON_ATTACHMENT_VERIFICA_ATTIVITA.value(),
					JCONONDocumentType.JCONON_ATTACHMENT_RELAZIONE_ATTIVITA.value(),
					PAGOPAObjectType.JCONON_ATTACHMENT_PAGAMENTI_DIRITTI_SEGRETERIA.value(),
					JCONONDocumentType.JCONON_ATTACHMENT_PUBBLICAZIONE.value(),
					JCONONDocumentType.JCONON_ATTACHMENT_FACSIMILE.value()
			).stream().forEach(l -> addTo(list, cmisService.createAdminSession().getTypeDefinition(l), false));
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
			LOGGER.warn("Cannot find Model in repository parentTypes: {}", JCONONPolicyType.JCONON_APPLICATION_ASPECT.value(), _ex);
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
					label("label.".concat(propertyDefinition.getId())).
					defaultLabel(propertyDefinition.getDisplayName()).
					group(objectType.getDescription())
			);
		}
		ObjectType objectAspectType = cmisService.createAdminSession().getTypeDefinition(JCONONPolicyType.JCONON_APPLICATION_ASPECT.value());
		completeWithChildren(objectAspectType, list);
		complete(cmisService.createAdminSession().getTypeDefinition(JCONONPolicyType.JCONON_APPLICATION_PUNTEGGI.value()), list);
		return list;
	}

    @Cacheable(JSONLIST_CALL_FIELDS)
    public List<ObjectTypeCache> getCallFields() {
        ObjectType objectType = cmisService.createAdminSession().
                getTypeDefinition(JCONONFolderType.JCONON_CALL.value());
        List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
        complete(objectType, list);
        return list;
    }

    @Cacheable(JSONLIST_CALL_TYPE)
	public List<ObjectTypeCache> getCallType() {
		List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
		populateCallType(list, cmisService.createAdminSession().getTypeDefinition(JCONONFolderType.JCONON_CALL.value(), false) , true);
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
		LOGGER.info("Try to connect to repository base url: {}", baseURL);
		Folder competition = null;
		Session session = cmisService.createAdminSession();
		Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_COMPETITION.queryName());
		ItemIterable<QueryResult> results = criteria.executeQuery(session, false, session.getDefaultContext());
		if (results.getTotalNumItems() == 0) {
			competition = (Folder) session.getObject(
					session.createFolder(Collections.unmodifiableMap(Stream.of(
							new AbstractMap.SimpleEntry<>(PropertyIds.OBJECT_TYPE_ID, JCONONFolderType.JCONON_COMPETITION.value()),
							new AbstractMap.SimpleEntry<>(PropertyIds.NAME, Optional.ofNullable(i18NService.getLabel("app.name", Locale.ITALIAN)).orElse("Selezioni on-line")))
							.collect(Collectors.toMap((e) -> e.getKey(), (e) -> e.getValue()))), session.getRootFolder())
			);
			/**
			 * Creo le folder per i documenti
			 */
			final ObjectId documents = session.createFolder(Collections.unmodifiableMap(Stream.of(
					new AbstractMap.SimpleEntry<>(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_FOLDER.value()),
					new AbstractMap.SimpleEntry<>(PropertyIds.NAME, "documents"))
					.collect(Collectors.toMap((e) -> e.getKey(), (e) -> e.getValue()))), competition);
			session.createFolder(Collections.unmodifiableMap(Stream.of(
					new AbstractMap.SimpleEntry<>(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_FOLDER.value()),
					new AbstractMap.SimpleEntry<>(PropertyIds.NAME, "manuali"))
					.collect(Collectors.toMap((e) -> e.getKey(), (e) -> e.getValue()))), documents);
			session.createFolder(Collections.unmodifiableMap(Stream.of(
					new AbstractMap.SimpleEntry<>(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_FOLDER.value()),
					new AbstractMap.SimpleEntry<>(PropertyIds.NAME, "graduatorie"))
					.collect(Collectors.toMap((e) -> e.getKey(), (e) -> e.getValue()))), documents);

			/**
			 * Creo anche i gruppi necessari al funzionamento
			 */
			createGroup(null, JcononGroups.CONCORSI.name(), JcononGroups.CONCORSI.label());
			createGroup(null, JcononGroups.COMMISSIONI_CONCORSO.name(), JcononGroups.COMMISSIONI_CONCORSO.label());
			createGroup(null, JcononGroups.CONTRIBUTOR_CALL.name(), JcononGroups.CONTRIBUTOR_CALL.label());
			createGroup(null, JcononGroups.RDP_CONCORSO.name(), JcononGroups.RDP_CONCORSO.label());
			createGroup(null, JcononGroups.APPLICATION_CONSUMER.name(), JcononGroups.APPLICATION_CONSUMER.label());
			createGroup(null, JcononGroups.GESTORI_BANDI.name(), JcononGroups.GESTORI_BANDI.label(), "[\"APP.DEFAULT\", \"AUTH.EXT.gestori\"]");
			
			for (ObjectType objectType : session.getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false)) {
				createGroup(JcononGroups.GESTORI_BANDI.group(),
						"GESTORI_" + objectType.getId().replace(":", "_").toUpperCase(), 
						"GESTORI " + objectType.getDisplayName(), 
						"[\"APP.DEFAULT\", \"AUTH.EXT.gestori\"]", 
						"{\"jconon_group_gestori:call_type\": \"" + objectType.getId() +"\"}");					
			}
			
	        Map<String, ACLType> aces = new HashMap<String, ACLType>();
	        aces.put(GroupsEnum.CONCORSI.value(), ACLType.Contributor);
	        aces.put(JcononGroups.GESTORI_BANDI.group(), ACLType.Contributor);
			aces.put(JcononGroups.CONTRIBUTOR_CALL.group(), ACLType.Contributor);
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

	@Cacheable(cacheNames = JASPER_CACHE, key = "#key")
	public JasperReport jasperReport(String key, JasperCompileManager jasperCompileManager) {
		try {
			LOGGER.info("creating jasper report: {}", key);
			try {
				return jasperCompileManager.compile(new ClassPathResource(key).getInputStream());
			} catch (JRException e) {
				throw new RuntimeException("unable to compile report id " + key, e);
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	@Cacheable(cacheNames = JASPER_CACHE, key = "#key")
	public byte[] imageReport(String key) {
		try {
			LOGGER.debug(key);
			return IOUtils.toByteArray(new ClassPathResource(key).getInputStream());
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	@Cacheable(cacheNames = JASPER_CACHE, key = "#key")
	public JasperReport jasperSubReport(String key, JasperCompileManager jasperCompileManager) {
		try {
			String jrXml = IOUtils.toString(new ClassPathResource(key).getInputStream());
			LOGGER.debug(jrXml);
			LOGGER.info("creating jasper report: {}", key);
			try {
				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				InputStream inputStream = IOUtils.toInputStream(jrXml, Charset.defaultCharset());
				return jasperCompileManager.compile(inputStream);
			} catch (JRException e) {
				throw new RuntimeException("unable to compile report id " + key, e);
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	@CacheEvict(cacheNames = {JASPER_CACHE}, allEntries = true)
	public void resetCacheJasper() {
		LOGGER.info("Reset cache of Jasper Report");
	}

	public void resetCacheBulkInfo() {
		cacheManager.getCache("bulkinfo-name").clear();
		cacheManager.getCache("bulkinfo-xml-document").clear();
		cacheManager.getCache("bulkinfo-object-type").clear();
	}

	@CacheEvict(cacheNames = {
			JSONLIST_APPLICATION_ASPECTS,
			JSONLIST_APPLICATION_ATTACHMENTS,
			JSONLIST_APPLICATION_SCHEDE_ANONIME,
			JSONLIST_APPLICATION_FIELDS_NOT_REQUIRED,
			JSONLIST_APPLICATION_PRODOTTI,
			JSONLIST_APPLICATION_CURRICULUMS
	})
	public void resetCacheApplication() {
		LOGGER.info("Reset cache of Application");
	}

	@CacheEvict(cacheNames = {
			JSONLIST_CALL_ATTACHMENTS,
			JSONLIST_CALL_FIELDS,
			JSONLIST_CALL_TYPE
	})
	public void resetCacheCall() {
		LOGGER.info("Reset cache of Call");
	}

	public void resetCacheSediSiper() {
		cacheManager.getCache(SiperService.SIPER_MAP_NAME).clear();
	}

	public void resetCacheLabels() {
		cacheManager.getCache("labels").clear();
		cacheManager.getCache("labels-uri").clear();
	}

	protected void populateCallType(List<ObjectTypeCache> list, ObjectType parentObjectType, boolean display) {
		for (ObjectType objectType : parentObjectType.getChildren()) {
			ObjectTypeCache parent = new ObjectTypeCache().
					key(objectType.getId()).
					title(objectType.getDisplayName()).
					queryName(objectType.getQueryName()).
					label(objectType.getId()).
					description(objectType.getDescription()).
					display(display).
					defaultLabel(objectType.getDisplayName());	
			if (objectType.getChildren().getTotalNumItems() > 0) {
				parent = parent.childs(new ArrayList<ObjectTypeCache>());
				populateCallType(parent.getChilds(), objectType, true);
				populateCallType(list, objectType, false);				
			}
			list.add(parent);
		}		
	}	
	protected void createGroup(final String parent_group_name, final String group_name, final String display_name) {
		createGroup(parent_group_name, group_name, display_name, null);
	}
	protected void createGroup(final String parent_group_name, final String group_name, final String display_name, final String zones) {
		createGroup(parent_group_name, group_name, display_name, zones, null);
	}
	
	protected void createGroup(final String parent_group_name, final String group_name, final String display_name, final String zones, final String extraProperty) {
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
	
	protected void completeWithChildren(ObjectType objectAspectType, List<ObjectTypeCache> list) {
		for (ObjectType child : objectAspectType.getChildren()) {
		    complete(child, list);
		}
	}

    protected void complete(ObjectType objectAspectType, List<ObjectTypeCache> list) {
            for (PropertyDefinition<?> propertyDefinition : objectAspectType.getPropertyDefinitions().values()) {
                if (propertyDefinition.isInherited())
                    continue;
                LOGGER.debug("{} is property of {}", propertyDefinition.getId(), JCONONFolderType.JCONON_APPLICATION.value());
                list.add(new ObjectTypeCache().
                        key(propertyDefinition.getId()).
                        label("label.".concat(propertyDefinition.getId())).
                        defaultLabel(propertyDefinition.getDisplayName()).
                        group(objectAspectType.getDisplayName())
                );
            }
            completeWithChildren(objectAspectType, list);
    }

	protected boolean hasAspect(ObjectType type, String aspect) {
		boolean hasAspect = false;
		for (String mandatoryAspect : typeService.getMandatoryAspects(type)) {
			if (mandatoryAspect.equals(aspect))
				return true;
		}
		return hasAspect;
	}

	protected void populate(List<ObjectTypeCache> list, ItemIterable<ObjectType> objectTypes, String aspect, boolean includeMandatoryAspects) {
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

	protected void addTo(List<ObjectTypeCache> list, ObjectType objectType, Boolean includeMandatoryAspects) {
		ObjectTypeCache objectTypeCache = new ObjectTypeCache().
		key(objectType.getId()).
		label(objectType.getId()).
		description(objectType.getDescription()).
		defaultLabel(objectType.getDisplayName());
		if (includeMandatoryAspects)
			objectTypeCache.mandatoryAspects(typeService.getMandatoryAspects(objectType));
		if (!list
				.stream()
				.filter(otc -> otc.getId().equals(objectType.getId()))
				.findAny()
				.isPresent()) {
			list.add(objectTypeCache);
		}
	}

	protected void addTo(List<ObjectTypeCache> list, BulkInfoCool bulkInfo) {
		list.add(new ObjectTypeCache().
				key(bulkInfo.getId()).
				label(bulkInfo.getShortDescription()).
				description(bulkInfo.getLongDescription()).
				defaultLabel(bulkInfo.getShortDescription())
		);
	}

	public Map<? extends String, ? extends Object> getExtraModel() {
		return Collections.emptyMap();
	}
}
