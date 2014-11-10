package it.cnr.jconon.service.application;


import freemarker.template.TemplateException;
import it.cnr.bulkinfo.BulkInfo;
import it.cnr.bulkinfo.BulkInfoImpl.FieldProperty;
import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.FolderService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.cmis.service.NodeVersionService;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.AttachmentBean;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.rest.util.Util;
import it.cnr.cool.security.GroupsEnum;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.service.JMSService;
import it.cnr.cool.service.search.SiperService;
import it.cnr.cool.util.JSONErrorPair;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.PermissionServiceImpl;
import it.cnr.cool.web.scripts.exception.CMISApplicationException;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.cmis.model.JCONONRelationshipType;
import it.cnr.jconon.model.ApplicationModel;
import it.cnr.jconon.service.PrintService;
import it.cnr.jconon.service.call.CallService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Serializable;
import java.io.StringWriter;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.FileableCmisObject;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.Property;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Relationship;
import org.apache.chemistry.opencmis.client.api.SecondaryType;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.definitions.Choice;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.IncludeRelationships;
import org.apache.chemistry.opencmis.commons.enums.UnfileObject;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisPermissionDeniedException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisRuntimeException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.commons.httpclient.HttpStatus;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.mail.MailException;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class ApplicationService implements InitializingBean {
	private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationService.class);

	@Autowired
	private CMISService cmisService;
	@Autowired
	private PermissionServiceImpl permission;
	@Autowired
	private CacheService cacheService;
	@Autowired
	private ACLService aclService;
	@Autowired
	private NodeVersionService nodeVersionService;
	@Autowired
	private BulkInfoCoolService bulkInfoService;
	@Autowired
    private MailService mailService;
	@Autowired
	private UserService userService;
	@Autowired
	private CallService callService;
	@Autowired
	private PrintService printService;
	@Autowired
	private I18nService i18nService;
	@Autowired
	private FolderService folderService;
	@Autowired
	private NodeMetadataService nodeMetadataService;
	@Autowired
	private SiperService siperService;
	
	@Autowired
	private ApplicationContext context;
	/**
	 * Coda per la stampa della domanda
	 */
	@Autowired
	private JMSService jmsQueueA;
	/**
	 * Coda per la riapertura della domanda
	 */
	@Autowired
	private JMSService jmsQueueB;
	/**
	 * Coda per l'invio della domanda
	 */
	@Autowired
	private JMSService jmsQueueC;
	
	private List<String> documentsNotRequired;

	protected final static List<String> EXCLUDED_TYPES = Arrays
			.asList("{http://www.cnr.it/model/jconon_attachment/cmis}application");

	public void setDocumentsNotRequired(List<String> documentsNotRequired) {
		this.documentsNotRequired = documentsNotRequired;
	}
	
	public final static String FINAL_APPLICATION = "Domande definitive",
			DOMANDA_CONFERMATA = "C",
			DOMANDA_PROVVISORIA = "P";

    public Folder getMacroCall(Session cmisSession, Folder call){
    	call = (Folder) cmisSession.getObject(call.getId());
		Folder currCall = call;
		while (currCall!=null &&
				!(cmisService.hasSecondaryType(currCall, JCONONPolicyType.JCONON_MACRO_CALL.value()))){
			if (currCall.getType().getId().equals(JCONONFolderType.JCONON_COMPETITION.value()))
				return null;
			currCall = currCall.getFolderParent();
		}
    	return currCall;
    }

    public long findTotalNumApplication(Session cmisSession, Folder call){
		Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
		criteria.addColumn(PropertyIds.OBJECT_ID);
		criteria.addColumn(PropertyIds.NAME);
		criteria.add(Restrictions.inTree(call.getId()));
		ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
		return iterable.getTotalNumItems();
    }

    public long getTotalNumApplication(Session cmisSession, Folder call, String userId, String statoDomanda){
		Folder macroCall = getMacroCall(cmisSession, call);
		if (macroCall!=null) {
			Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
			criteria.addColumn(PropertyIds.OBJECT_ID);
			criteria.addColumn(PropertyIds.NAME);
			criteria.add(Restrictions.inTree(macroCall.getId()));
			if (userId != null)
				criteria.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_USER.value(), userId));
			if (statoDomanda != null)
				criteria.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), statoDomanda));
			ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
			return iterable.getTotalNumItems();
		} else {
			return 0;
		}
	}

    public void finalCall(Session cmisSession, String objectId){
		Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
		criteriaDomande.add(Restrictions.inTree(objectId));
		criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), DOMANDA_CONFERMATA));
		OperationContext context = cmisSession.getDefaultContext();
		context.setMaxItemsPerPage(1000);
		ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, context);
		for (QueryResult queryResultDomande : domande) {
			String applicationAttach = findAttachmentId(cmisSession, (String)queryResultDomande.getPropertyValueById(PropertyIds.OBJECT_ID) ,
					JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION);
			if (applicationAttach != null){
				Folder folderId = createFolderFinal(cmisSession, objectId);
				try{
					((FileableCmisObject)cmisSession.getObject(applicationAttach)).addToFolder(folderId, true);
				}catch(CmisRuntimeException _ex){
					LOGGER.error("Cannot find folder", _ex);
				}
			}
		}
    }

    private Folder createFolderFinal(Session cmisSession, String folderId) {
		Folder parent = (Folder) cmisSession.getObject(folderId);
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_FOLDER.value());
		properties.put(PropertyIds.NAME,FINAL_APPLICATION);
		Folder folder;
		try{
			folder = parent.createFolder(properties);
		}catch(CmisContentAlreadyExistsException _ex){
			folder = (Folder) cmisSession.getObjectByPath(parent.getPath().concat("/").concat(FINAL_APPLICATION));
		}
    	return folder;
	}

	public String findAttachmentId(Session cmisSession, String source, JCONONDocumentType documentType){
		Criteria criteria = CriteriaFactory.createCriteria(documentType.queryName());
		criteria.addColumn(PropertyIds.OBJECT_ID);
		criteria.addColumn(PropertyIds.NAME);
		criteria.add(Restrictions.inFolder(source));
		ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
		for (QueryResult queryResult : iterable) {
			return queryResult.getPropertyValueById(PropertyIds.OBJECT_ID) ;
		}
		return null;
	}

    public void sollecitaApplication(Session cmisSession, Integer giorniScadenzaPresDomande){
		Calendar dataLimite = Calendar.getInstance();
		dataLimite.add(Calendar.DAY_OF_YEAR, giorniScadenzaPresDomande);

		Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
		criteria.add(Restrictions.le(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), dataLimite.getTime()));
		criteria.add(Restrictions.ge(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), Calendar.getInstance().getTime()));
		ItemIterable<QueryResult> bandi = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());

		for (QueryResult queryResult : bandi) {
			Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
			criteriaDomande.add(Restrictions.inFolder((String)queryResult.getPropertyValueById(PropertyIds.OBJECT_ID)));
			criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), DOMANDA_PROVVISORIA));
			ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, cmisSession.getDefaultContext());

			for (QueryResult queryResultDomande : domande) {
				EmailMessage message = new EmailMessage();
				List<String> emailList = new ArrayList<String>();
				try {
					CMISUser user = userService.loadUserForConfirm((String)queryResultDomande.getPropertyValueById(JCONONPropertyIds.APPLICATION_USER.value()));
					if (user!=null && user.getEmail()!=null && !user.getEmail().equals("nomail")) {
						emailList.add(user.getEmail());

						message.setRecipients(emailList);
						message.setSubject("[concorsi] " + i18nService.getLabel("subject-reminder-domanda", Locale.ITALIAN,
								queryResult.getPropertyValueById(JCONONPropertyIds.CALL_CODICE.value()),
								removeHtmlFromString((String)queryResult.getPropertyValueById(JCONONPropertyIds.CALL_DESCRIZIONE.value()))));
						message.setTemplateBody("/pages/call/call.reminder.application.html.ftl");
						Map<String, Object> templateModel = new HashMap<String, Object>();
						templateModel.put("call", queryResult);
						templateModel.put("folder", queryResultDomande);
						message.setTemplateModel(templateModel);
						mailService.send(message);
					}
				} catch (CoolUserFactoryException e) {
					LOGGER.error("User not found", e);
				}
			}
		}
	}

	// Preferire un util standardizzato (o spostare in un util)
    private String removeHtmlFromString(String stringWithHtml){
    	if (stringWithHtml==null) return null;
    	stringWithHtml = stringWithHtml.replace("&rsquo;", "'");
    	stringWithHtml = stringWithHtml.replace("&amp;", "'");
    	stringWithHtml = stringWithHtml.replaceAll("\\<.*?>","");
    	stringWithHtml = stringWithHtml.replaceAll("\\&.*?\\;", "");
    	stringWithHtml = stringWithHtml.replace("\r\n", " ");
    	stringWithHtml = stringWithHtml.replace("\r", " ");
    	stringWithHtml = stringWithHtml.replace("\n", " ");
    	return stringWithHtml;
    }

	@Override
	public void afterPropertiesSet() throws Exception {
	}


	public String getCallGroupName(Folder call){
		String groupName = "GROUP_".concat((String)call.getPropertyValue(PropertyIds.NAME));
		if (groupName.length() > 100)
			groupName = groupName.substring(0, 100);
		return groupName;
	}
	public Folder loadCallById(Session cmisSession, String callId) {
		return loadCallById(cmisSession, callId, null);
	}

	public Folder loadCallById(Session cmisSession, String callId, Map<String, Object> model) {
		if (callId==null || callId.isEmpty())
			throw new ClientMessageException("message.error.caller");
		if (model!=null && !model.isEmpty() && model.get("call")!=null && model.get("call").equals(callId))
			return (Folder)model.get("call");
		Folder call = null;
		try {
			call = (Folder)cmisSession.getObject(callId);
		} catch (CmisObjectNotFoundException ex){
			throw new ClientMessageException("message.error.bando.assente");
		} catch (CmisPermissionDeniedException ex){
			throw new ClientMessageException("message.error.bando.assente");
		}
		if (cmisService.hasSecondaryType(call, JCONONPolicyType.JCONON_MACRO_CALL.value()))
			throw new ClientMessageException("message.error.bando.tipologia");
		call.refresh();
		if (model != null)
			model.put("call", call);
		return call;
	}

	public Folder loadApplicationById(Session cmisSession, String folderId) {
		return loadApplicationById(cmisSession, folderId, null);
	}

	public Folder loadApplicationById(Session cmisSession, String folderId, Map<String, Object> model) {
		if (folderId==null || folderId.isEmpty())
			throw new ClientMessageException("message.error.caller");
		if (model!=null && !model.isEmpty() && model.get("folder")!=null && model.get("folder").equals(folderId))
			return (Folder)model.get("folder");
		Folder application = null;
		try {
			application = (Folder)cmisSession.getObject(folderId);
		} catch (CmisObjectNotFoundException ex){
			throw new ClientMessageException("message.error.domanda.assente");
		}
		application.refresh();
		if (model != null)
			model.put("folder", application);
		return application;
	}


	@SuppressWarnings("unchecked")
	public void addContentToChild(String nodeRefApplication, Session cmisSession, Properties messages, String contextURL) {
    	Folder application = loadApplicationById(cmisSession, nodeRefApplication, new HashMap<String, Object>());
    	Folder call = loadCallById(cmisSession, application.getParentId(), new HashMap<String, Object>());

    	ApplicationModel applicationModel = new ApplicationModel(application,
				cmisSession.getDefaultContext(),
				messages, contextURL);
		List<String> types = new ArrayList<String>();
		types.addAll(((List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM.value())));
		types.addAll((List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()));
		for (CmisObject cmisObject : application.getChildren()) {
			if (types.contains(cmisObject.getType().getId())) {
				cmisObject.refresh();
		    	printService.addContentToCmisObject(applicationModel, cmisObject, Locale.ITALIAN);
			}
		}
	}
	
	public void reject(Session currentCMISSession, String nodeRef) {
		Folder application = loadApplicationById(currentCMISSession, nodeRef);
		Map<String, Serializable> properties = new HashMap<String, Serializable>();
		properties.put("jconon_application:esclusione_rinuncia", "E");
		application.updateProperties(properties);
		Map<String, ACLType> acesToRemove = new HashMap<String, ACLType>();
		List<String> groups = callService.getGroupsCallToApplication(application.getFolderParent());
		for (String group : groups) {
			acesToRemove.put(group, ACLType.Contributor);
		}
		aclService.removeAcl(cmisService.getAdminSession(), application.getId(), acesToRemove);
	}

	public void moveDocument(Session currentCMISSession, String sourceId) {
		OperationContext oc = currentCMISSession.getDefaultContext();
		oc.setIncludeRelationships(IncludeRelationships.SOURCE);
		
		CmisObject sourceDoc = currentCMISSession.getObject(sourceId, oc);
		SecondaryType peopleNoSelectedproduct = (SecondaryType) currentCMISSession
				.getTypeDefinition(JCONONPolicyType.PEOPLE_NO_SELECTED_PRODUCT
						.value()), peopleSelectedproduct = (SecondaryType) currentCMISSession
				.getTypeDefinition(JCONONPolicyType.PEOPLE_SELECTED_PRODUCT
						.value());
		List<SecondaryType> secondaryTypes = sourceDoc.getSecondaryTypes();
		Map<String, Object> properties = new HashMap<String, Object>();
		if (cmisService.hasSecondaryType(sourceDoc, JCONONPolicyType.PEOPLE_NO_SELECTED_PRODUCT.value())) {
			secondaryTypes.remove(peopleNoSelectedproduct);
			secondaryTypes.add(peopleSelectedproduct);
		} else if (cmisService.hasSecondaryType(sourceDoc, JCONONPolicyType.PEOPLE_SELECTED_PRODUCT.value())) {
			secondaryTypes.add(peopleNoSelectedproduct);
			secondaryTypes.remove(peopleSelectedproduct);
			if (sourceDoc.getRelationships() != null && !sourceDoc.getRelationships().isEmpty()) {
				for (Relationship relationship : sourceDoc.getRelationships()) {
					if (relationship.getType().getId().equals(JCONONRelationshipType.JCONON_ATTACHMENT_IN_PRODOTTO.value())){
						relationship.getTarget().delete(true);					
					}					
				}
			}
		}
		properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, secondaryTypes);
		sourceDoc.updateProperties(properties);		
	}
	
	public String paste(Session currentCMISSession, final String applicationSourceId, final String callTargetId, String userId) {
		/**
		 * Load application source with user session if user cannot access to application
		 * throw an exception
		 */
		try {
			OperationContext oc = new OperationContextImpl(currentCMISSession.getDefaultContext());
			oc.setFilterString(PropertyIds.OBJECT_ID);			
			currentCMISSession.getObject(applicationSourceId, oc);
		}catch (CmisPermissionDeniedException _ex) {
			throw new ClientMessageException("user.cannot.access.to.application");			
		}		
		final Folder application = loadApplicationById(currentCMISSession, applicationSourceId, null);	
		final Folder call = loadCallById(currentCMISSession, callTargetId, null);
		try {
			callService.isBandoInCorso(call, userService.loadUserForConfirm(userId));
		} catch (CoolUserFactoryException e) {
			throw new CMISApplicationException("Error loading user: " + userId, e);
		}
		String link = cmisService.getBaseURL().concat("service/cnr/jconon/manage-application/paste");
		UrlBuilder url = new UrlBuilder(link);
		Response resp = cmisService.getHttpInvoker(cmisService.getAdminSession()).invokePOST(url, MimeTypes.JSON.mimetype(),
				new Output() {
			@Override
			public void write(OutputStream out) throws Exception {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("applicationSourceId", application.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString());
				jsonObject.put("callTargetId", call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString());
				out.write(jsonObject.toString().getBytes());
			}
		}, cmisService.getAdminSession());
		int stato = resp.getResponseCode();
		if (stato == HttpStatus.SC_BAD_REQUEST || stato == HttpStatus.SC_INTERNAL_SERVER_ERROR) {
			try {
				JSONObject jsonObject = new JSONObject(resp.getErrorContent());
				throw new ClientMessageException(jsonObject.getString("message"));
			} catch (JSONException e) {
				throw new ClientMessageException("message.application.for.copy.alredy.exists");
			}
		}
		if (stato == HttpStatus.SC_NOT_FOUND) {
			throw new ClientMessageException("Paste Application error. Exception: " + resp.getErrorContent());
		}
		try {
			JSONObject jsonObject = new JSONObject(StringUtil.convertStreamToString(resp.getStream()));
			return jsonObject.getString("cmis:objectId");
		} catch (JSONException e) {
			throw new ClientMessageException("Paste Application error. Exception: " + resp.getErrorContent());
		}		
	}
	
	public void reopenApplication(Session currentCMISSession, final String applicationSourceId, final String contextURL, Locale locale, String userId) {
		/**
		 * Load application source with user session if user cannot access to application
		 * throw an exception
		 */
		try {
			OperationContext oc = new OperationContextImpl(currentCMISSession.getDefaultContext());
			oc.setFilterString(PropertyIds.OBJECT_ID);			
			currentCMISSession.getObject(applicationSourceId, oc);
		}catch (CmisPermissionDeniedException _ex) {
			throw new ClientMessageException("user.cannot.access.to.application");			
		}
		final Folder newApplication = loadApplicationById(currentCMISSession, applicationSourceId, null);		
		if (newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value()) == null ||
				!newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(CallService.DOMANDA_CONFERMATA)) {
			throw new ClientMessageException("message.error.domanda.no.confermata");
		}
		try {
			callService.isBandoInCorso(loadCallById(currentCMISSession, newApplication.getParentId(), null), 
					userService.loadUserForConfirm(userId));
		} catch (CoolUserFactoryException e) {
			throw new CMISApplicationException("Error loading user: " + userId, e);
		}
		String link = cmisService.getBaseURL().concat("service/cnr/jconon/manage-application/reopen");
		UrlBuilder url = new UrlBuilder(link);
		Response resp = cmisService.getHttpInvoker(cmisService.getAdminSession()).invokePOST(url, MimeTypes.JSON.mimetype(),
				new Output() {
			@Override
			public void write(OutputStream out) throws Exception {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("applicationSourceId", newApplication.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString());
				out.write(jsonObject.toString().getBytes());
			}
		}, cmisService.getAdminSession());
		int status = resp.getResponseCode();
		if (status == HttpStatus.SC_NOT_FOUND|| status == HttpStatus.SC_BAD_REQUEST|| status == HttpStatus.SC_INTERNAL_SERVER_ERROR) {
			throw new CMISApplicationException("Reopen Application error. Exception: " + resp.getErrorContent());
		}
		printService.printApplication(jmsQueueB, applicationSourceId, contextURL, locale, false);
	}	

	protected void validateMacroCall(Folder call, String userId) {
		Folder macroCall = callService.getMacroCall(cmisService.createAdminSession(), call);
		if (macroCall!=null) {
			macroCall.refresh();
			Long numMaxDomandeMacroCall = ((BigInteger)macroCall.getPropertyValue(JCONONPropertyIds.CALL_NUMERO_MAX_DOMANDE.value())).longValue();
			if (numMaxDomandeMacroCall!=null) {
				Long numDomandeConfermate = callService.getTotalNumApplication(cmisService.createAdminSession(), macroCall, userId, CallService.DOMANDA_CONFERMATA);
				if (numDomandeConfermate.compareTo(numMaxDomandeMacroCall)!=-1){
					throw new ClientMessageException("message.error.max.raggiunto");
				}
			}
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private List<String> getAssociationList(Folder call) {
		List<String> associationList = new ArrayList<String>();
		if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS
				.value()) != null
				&& !((List<?>) call
						.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS
								.value())).isEmpty()) {
			associationList
					.addAll((List) call
							.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS
									.value()));
		}
		return associationList;
	}
	
	private boolean hasParentType(ObjectType alfrescoObjectType, String parentTypeName) {
		ObjectType type = alfrescoObjectType.getParentType();
		while (!type.getId().equals(BaseTypeId.CMIS_DOCUMENT.value())) {
			if (type.getId().equals(parentTypeName)) {
				return true;
			}
			type = type.getParentType();
		}
		return false;
	}

	private boolean hasMandatoryAspect(ObjectType objectType, String aspectName) {
		return cmisService.getMandatoryAspects(objectType).contains(aspectName);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private List<String> getSezioniDomandaList(Folder call) {
		List<String> sezioniDomandaList = new ArrayList<String>();
		if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA
				.value()) != null
				&& !((List<?>) call
						.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA
								.value())).isEmpty()) {
			sezioniDomandaList
					.addAll((List) call
							.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA
									.value()));
		}
		return sezioniDomandaList;
	}
	
	private void validateAllegatiLinked(Folder call, Folder application,
			Session cmisSession) {
		StringBuffer listMonoRequired = new StringBuffer(), listMonoMultiInserted = new StringBuffer();
		boolean ctrlAlternativeAttivita = false, existVerificaAttivita = false, existRelazioneAttivita = false, existCurriculum = false;
		for (String associationCmisType : getAssociationList(call)) {
			ObjectType objectType = cmisSession
					.getTypeDefinition(associationCmisType);
			Criteria criteria = CriteriaFactory.createCriteria(objectType
					.getQueryName());
			criteria.add(Restrictions.inFolder(application.getId()));
			long totalNumItems = 0;
			for (QueryResult queryResult : criteria.executeQuery(cmisSession,
					false, cmisSession.getDefaultContext())) {
				totalNumItems++;
				if (((BigInteger) queryResult
						.getPropertyValueById("cmis:contentStreamLength"))
						.compareTo(BigInteger.ZERO) != 1) {
					throw new ClientMessageException(
							i18nService.getLabel("message.error.allegati.empty", Locale.ITALIAN));
				}
			}
			if (hasParentType(objectType, JCONONDocumentType.JCONON_ATTACHMENT_MONO.value())){
				if (totalNumItems == 0
						&& !documentsNotRequired.contains(objectType.getId()) &&
						!hasMandatoryAspect(objectType, "P:jconon_attachment:document_not_required")) {
					listMonoRequired
							.append((listMonoRequired.length() == 0 ? "" : ", ")
									+ objectType.getDisplayName());
				} else if (totalNumItems > 1) {
					listMonoMultiInserted.append((listMonoMultiInserted
							.length() == 0 ? "" : ", ")
							+ objectType.getDisplayName());
				}
			}
			if ((objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE.value()) ||
					objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE_NOT_REQUIRED.value())) && totalNumItems != 0) {
				existCurriculum = true;
			}
			if (objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_VERIFICA_ATTIVITA.value()) || objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_RELAZIONE_ATTIVITA.value())) {
				ctrlAlternativeAttivita = true;
				if (totalNumItems != 0) {
					if (objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_VERIFICA_ATTIVITA.value())) {
						existVerificaAttivita = true;
					} else if (objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_RELAZIONE_ATTIVITA.value())) {
						existRelazioneAttivita = true;
					}
				}
			}
		}
		StringBuffer messageError = new StringBuffer();
		if (listMonoRequired.length() > 0) {
			messageError.append((messageError.length()!=0?"</br></br>":"")+i18nService.getLabel("message.error.allegati.required", Locale.ITALIAN, listMonoRequired));
		}
		if (listMonoMultiInserted.length() > 0) {
			messageError.append((messageError.length()!=0?"</br></br>":"")+i18nService.getLabel("message.error.allegati.mono.multi.inserted", Locale.ITALIAN, listMonoMultiInserted));
		}
		if (ctrlAlternativeAttivita) {
			if (!existVerificaAttivita && !existRelazioneAttivita) {
				messageError.append((messageError.length()!=0?"</br></br>":"")+i18nService.getLabel("message.error.allegati.alternative.attivita.not.exists", Locale.ITALIAN));
			}
			if (existVerificaAttivita && existRelazioneAttivita) {
				messageError.append((messageError.length()!=0?"</br></br>":"")+i18nService.getLabel("message.error.allegati.alternative.attivita.all.exists", Locale.ITALIAN));
			}

			Criteria criteriaCurr = CriteriaFactory.createCriteria("jconon_attachment:cv_element");
			criteriaCurr.add(Restrictions.inFolder(application.getId()));
			OperationContext operationContextCurr = cmisSession.getDefaultContext();
			operationContextCurr.setIncludeRelationships(IncludeRelationships.SOURCE);
			long numRigheCurriculum = criteriaCurr.executeQuery(cmisSession, false, operationContextCurr).getTotalNumItems();
			if (!existCurriculum && numRigheCurriculum<=0) {
				messageError.append((messageError.length()!=0?"</br></br>":"")+i18nService.getLabel("message.error.allegati.alternative.curriculum.not.exists", Locale.ITALIAN));
			}
			if (existCurriculum && numRigheCurriculum>0) {
				messageError.append((messageError.length()!=0?"</br></br>":"")+i18nService.getLabel("message.error.allegati.alternative.curriculum.all.exists", Locale.ITALIAN));
			}
		}

		if (messageError.length()!=0) {
			throw new ClientMessageException(messageError.toString());
		}

		List<String> listSezioniDomanda = getSezioniDomandaList(call);
		BigInteger numMaxProdotti = (BigInteger) call
				.getPropertyValue(JCONONPropertyIds.CALL_NUMERO_MAX_PRODOTTI
						.value());
		if (listSezioniDomanda.contains("affix_tabProdottiScelti")) {
			Criteria criteria = CriteriaFactory
					.createCriteria("cvpeople:selectedProduct");
			criteria.add(Restrictions.inFolder(application.getId()));

			long totalNumItems = 0;
			OperationContext operationContext = cmisSession.getDefaultContext();
			operationContext
					.setIncludeRelationships(IncludeRelationships.SOURCE);
			for (QueryResult queryResult : criteria.executeQuery(cmisSession,
					false, cmisSession.getDefaultContext())) {
				totalNumItems++;
				boolean existsRelProdotto = false;
				if (!(queryResult.getRelationships() == null
						|| queryResult.getRelationships().isEmpty())) {
					for (Relationship relationship : queryResult.getRelationships()) {
						if (relationship.getType().getId().equals(JCONONRelationshipType.JCONON_ATTACHMENT_IN_PRODOTTO.value())){
							existsRelProdotto = true;
							if (((BigInteger) relationship.getTarget().getPropertyValue("cmis:contentStreamLength"))
											.compareTo(BigInteger.ZERO) != 1) {
									throw new ClientMessageException(
											i18nService.getLabel("message.error.prodotti.scelti.allegato.empty", Locale.ITALIAN));
							}
						}
					}
				}
				if (!existsRelProdotto)
					throw new ClientMessageException(
							i18nService.getLabel("message.error.prodotti.scelti.senza.allegato", Locale.ITALIAN));
			}
			if (numMaxProdotti != null && totalNumItems > numMaxProdotti.longValue()) {
				throw new ClientMessageException(i18nService.getLabel(
						"message.error.troppi.prodotti.scelti",
						Locale.ITALIAN,
						String.valueOf(totalNumItems),
						String.valueOf(numMaxProdotti)));
			}
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private List<String> getDichiarazioniList(Folder call, Folder application) {
		List<String> dichiarazioniList = new ArrayList<String>();
		if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value())!=null &&
			!((List<?>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value())).isEmpty())
			dichiarazioniList.addAll((List)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value()));
		if (application!=null &&
			application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())!=null &&
			application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()).equals(Boolean.TRUE)) {
			dichiarazioniList.remove("P:jconon_application:aspect_godimento_diritti");
			dichiarazioniList.remove("P:jconon_application:aspect_conoscenza_lingua_italiana");
		} else {
			dichiarazioniList.remove("P:jconon_application:aspect_iscrizione_liste_elettorali");
		}
		return dichiarazioniList;
	}
	
	private List<JSONErrorPair> validateAspects(Map<String, Object> map, Map<String, Object> model, Folder call, Folder application, Session cmisSession){
		List<JSONErrorPair> listError = new ArrayList<JSONErrorPair>();
		List<String> listAspect = getDichiarazioniList(call,application);
		for (String aspect : listAspect) {
			BulkInfo bulkInfoAspect = (BulkInfo) bulkInfoService.find(aspect.replace(":", "_"));
			FieldProperty flag = null;
			if (bulkInfoAspect != null) {
				for (FieldProperty fieldProperty : bulkInfoAspect.getForm(aspect)) {
					if (fieldProperty.isRadioGroupType() || fieldProperty.isCheckboxType()) {
						flag=fieldProperty;
						break;
					}
				}
				for (FieldProperty fieldProperty : bulkInfoAspect.getForm(aspect)) {
					if (flag!=null) {
						if (!fieldProperty.equals(flag) &&
							fieldProperty.getAttributes().get("class").contains(
									flag.getName()+'_'+String.valueOf(map.get(flag.getProperty()))) &&
								!fieldProperty.isNullable()) {
									addError(listError, map, fieldProperty.getProperty(),
											cmisSession.getTypeDefinition(aspect).getPropertyDefinitions().get(fieldProperty.getProperty()).getDisplayName());
							} else {
								if (fieldProperty.equals(flag) && !fieldProperty.isNullable()) {
									addError(listError, map, fieldProperty.getProperty(),
											cmisSession.getTypeDefinition(aspect).getPropertyDefinitions().get(fieldProperty.getProperty()).getDisplayName());
								}
							}
					} else {
						if (!fieldProperty.isNullable()) {
							addError(listError, map, fieldProperty.getProperty(),
									cmisSession.getTypeDefinition(aspect).getPropertyDefinitions().get(fieldProperty.getProperty()).getDisplayName());
						}
					}
				}
			}
		}
		return listError;
	}

	private void addError(List<JSONErrorPair> listError, Map<String, Object> map, String nomeCampo) {
		addError(listError, map, nomeCampo, null);
	}

	private void addError(List<JSONErrorPair> listError, Map<String, Object> map, String nomeCampo, String nomeCampoTarget) {
		if (map.get(nomeCampo)==null)
			listError.add(new JSONErrorPair(nomeCampoTarget!=null?nomeCampoTarget:nomeCampo, "message.required.field"));
	}
	
	private List<JSONErrorPair> validateBaseTableMap(Map<String, Object> map, Map<String, Object> model, Folder call, Folder application, Session cmisSession){
		List<JSONErrorPair> listError = new ArrayList<JSONErrorPair>();
		listError.addAll(validateAspects(map, model, call, application, cmisSession));

		List<String> listSezioniDomanda = getSezioniDomandaList(call);
		BulkInfo bulkInfo = (BulkInfo) bulkInfoService.find(JCONONFolderType.JCONON_APPLICATION.value().replace(":", "_"));
		for (String sezione : listSezioniDomanda) {
			for (FieldProperty fieldProperty : bulkInfo.getForm(sezione)) {
				if (fieldProperty.getProperty()!=null && (fieldProperty.getAttribute("visible")==null || fieldProperty.getAttribute("visible")=="true")) {
					//TAB DATI ANAGRAFICI - Controlli particolari
					if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())) {
							addError(listError, map, fieldProperty.getProperty());
							if (map.get(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())!=null) {
								if ((Boolean)map.get(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())) {
									addError(listError, map, JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());
									Object codiceFiscale = map.get(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());
									if (codiceFiscale!=null) {
										// controllo formale della validita' del codice fiscale
										controllaCodiceFiscale(map, application);
									}
								} else
									addError(listError, map, JCONONPropertyIds.APPLICATION_NAZIONE_CITTADINANZA.value());
							}
					}
					else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value()) ||
							 fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_NAZIONE_CITTADINANZA.value())) {
					} else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_CAP_RESIDENZA.value())) {
						if (map.get(JCONONPropertyIds.APPLICATION_NAZIONE_RESIDENZA.value())!=null &&
							((String) map.get(JCONONPropertyIds.APPLICATION_NAZIONE_RESIDENZA.value())).toUpperCase().equals("ITALIA"))
							addError(listError, map, JCONONPropertyIds.APPLICATION_CAP_RESIDENZA.value());
					}
					else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_CAP_COMUNICAZIONI.value())) {
						if (map.get(JCONONPropertyIds.APPLICATION_NAZIONE_COMUNICAZIONI.value())!=null &&
							((String) map.get(JCONONPropertyIds.APPLICATION_NAZIONE_COMUNICAZIONI.value())).toUpperCase().equals("ITALIA"))
							addError(listError, map, JCONONPropertyIds.APPLICATION_CAP_COMUNICAZIONI.value());
					}
					else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value())) {
						if (application==null || application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())==null ||
							application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()).equals(Boolean.FALSE))
							addError(listError, map, JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value());
					}
					else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value())) {
						if (application==null || application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())==null ||
							application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()).equals(Boolean.TRUE))
							addError(listError, map, JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value());
					}
					else
						addError(listError, map, fieldProperty.getProperty(),
								application.getType().getPropertyDefinitions().get(fieldProperty.getProperty()).getDisplayName());

					if ((fieldProperty.isRadioGroupType() || fieldProperty.isCheckboxType()) && !fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_SESSO.value())
						&& map.get(fieldProperty.getProperty())!=null) {
						Collection<FieldProperty> radioForm = bulkInfo.getForm(fieldProperty.getProperty()+((Boolean) map.get(fieldProperty.getProperty())?"_true":"_false").replace(":", "_"));
						if (radioForm!=null && !radioForm.isEmpty()) {
							for (FieldProperty radioFieldProperty : bulkInfo.getForm(fieldProperty.getProperty()+((Boolean) map.get(fieldProperty.getProperty())?"_true":"_false").replace(":", "_"))) {
								if (!radioFieldProperty.isNullable())
									addError(listError, map, radioFieldProperty.getProperty(),
											application.getType().getPropertyDefinitions().get(radioFieldProperty.getProperty()).getDisplayName());
							}
						}
					}
				}
			}
		}
		List<String> properties = call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_FIELD_NOT_REQUIRED.value());
		if (properties != null){
			for (String property : properties) {
				for (Iterator<JSONErrorPair> iterator = listError.iterator(); iterator.hasNext();) {
					JSONErrorPair error = iterator.next();
					if (error.getFirst().equals(property))
						iterator.remove();
				}
			}
		}
		return listError;
	}

	private void controllaCodiceFiscale(Map<String, Object> map, Folder application) throws CMISApplicationException {
		GregorianCalendar dataNascita = new GregorianCalendar();
		dataNascita.setTime(((GregorianCalendar)map.get(JCONONPropertyIds.APPLICATION_DATA_NASCITA.value())).getTime());

		String cognome, nome, sesso, codiceFiscale, cdCatastale=null;
		if (map.get(JCONONPropertyIds.APPLICATION_COGNOME.value())!=null)
			cognome=(String)map.get(JCONONPropertyIds.APPLICATION_COGNOME.value());
		else
			cognome=(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value());

		if (map.get(JCONONPropertyIds.APPLICATION_NOME.value())!=null)
			nome=(String)map.get(JCONONPropertyIds.APPLICATION_NOME.value());
		else
			nome=(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value());

		if (map.get(JCONONPropertyIds.APPLICATION_SESSO.value())!=null)
			sesso=(String)map.get(JCONONPropertyIds.APPLICATION_SESSO.value());
		else
			sesso=(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_SESSO.value());

		if (map.get(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value())!=null)
			codiceFiscale=(String)map.get(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());
		else
			codiceFiscale=(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());

		it.cnr.jconon.util.CodiceFiscaleControllo.parseCodiceFiscale(
			cognome,
			nome,
			String.valueOf(dataNascita.get(GregorianCalendar.YEAR)%100),
			String.valueOf(dataNascita.get(GregorianCalendar.MONTH)),
			String.valueOf(dataNascita.get(GregorianCalendar.DAY_OF_MONTH)),
			sesso,
			cdCatastale,
			codiceFiscale);
	}

	private void sendApplication(BindingSession cmisSession, final String applicationSourceId, final List<String> groupsCall) {
		String link = cmisService.getBaseURL().concat("service/cnr/jconon/manage-application/send");
        UrlBuilder url = new UrlBuilder(link);
		Response resp = cmisService.getHttpInvoker(cmisSession).invokePOST(url, MimeTypes.JSON.mimetype(),
				new Output() {
            		@Override
					public void write(OutputStream out) throws Exception {
            			JSONObject jsonObject = new JSONObject();
            			jsonObject.put("applicationSourceId", applicationSourceId);
            			jsonObject.put("groupsCall", groupsCall);
            			jsonObject.put("userAdmin", cmisService.getAdminUserId());
            			out.write(jsonObject.toString().getBytes());
            		}
        		}, cmisSession);
		int status = resp.getResponseCode();
		if (status == HttpStatus.SC_NOT_FOUND|| status == HttpStatus.SC_BAD_REQUEST|| status == HttpStatus.SC_INTERNAL_SERVER_ERROR)
			throw new CMISApplicationException("Send Application error. Exception: " + resp.getErrorContent());
	}
	
	public Map<String, String> sendApplication(Session currentCMISSession, final String applicationSourceId, final String contextURL, 
			final Locale locale, String userId, Map<String, Object> properties, Map<String, Object> aspectProperties) {
		save(currentCMISSession, contextURL, locale, userId, properties, aspectProperties);
		final Map<String, Object> result = new HashMap<String, Object>();
		result.put("message", context.getBean("messageMethod", locale));
		result.put("contextURL", contextURL);
		result.putAll(properties);
		result.putAll(aspectProperties);		

		/**
		 * Load application source with user session if user cannot access to application
		 * throw an exception
		 */
		try {
			OperationContext oc = new OperationContextImpl(currentCMISSession.getDefaultContext());
			oc.setFilterString(PropertyIds.OBJECT_ID);			
			currentCMISSession.getObject(applicationSourceId, oc);
		}catch (CmisPermissionDeniedException _ex) {
			throw new ClientMessageException("user.cannot.access.to.application");			
		}
		Folder call = loadCallById(currentCMISSession, (String)properties.get(PropertyIds.PARENT_ID), result);
		Folder newApplication = loadApplicationById(cmisService.createAdminSession(), applicationSourceId, result);
		CMISUser applicationUser;
		try {
			applicationUser = (CMISUser)userService.loadUserForConfirm(
					(String)newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
		} catch (CoolUserFactoryException e) {
			throw new ClientMessageException("User not found");
		}
		if (newApplication
				.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA
						.value()) != null
				&& newApplication.getPropertyValue(
						JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value())
						.equals(CallService.DOMANDA_CONFERMATA))
			throw new ClientMessageException(
					"message.error.domanda.inviata.accesso");
		/*
		 * Effettuo il controllo sul numero massimo di domande validate passandogli lo User
		 * della domanda che deve essere sempre valorizzata  
		 */
		validateMacroCall(call, (String)newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));

		Map<String, Object> allProperties = new HashMap<String, Object>();
		allProperties.putAll(properties);
		allProperties.putAll(aspectProperties);
		List<JSONErrorPair> listError = validateBaseTableMap(allProperties, result, call, newApplication, cmisService.createAdminSession());

		if (!listError.isEmpty()) {
			String error = "";
			for (JSONErrorPair jsonErrorPair : listError) {
				error = error.concat("<p>").concat(jsonErrorPair.first + ": " + i18nService.getLabel(jsonErrorPair.second, Locale.ITALIAN)).concat("</p>");
			}
			throw new ClientMessageException(error);
		}
		validateAllegatiLinked(call, newApplication, cmisService.createAdminSession());
		Property<Boolean> blocco = call.getProperty(JCONONPropertyIds.CALL_BLOCCO_INVIO_DOMANDE.value());
		if (blocco != null && blocco.getValue() != null
				&& blocco.getFirstValue()) {
			String msg = call.getProperty(JCONONPropertyIds.CALL_BLOCCO_INVIO_DOMANDE_MESSAGE.value()).getValue();
			throw new ClientMessageException(msg);
		}
		try {
			sendApplication(cmisService.getAdminSession(), 
					newApplication.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), 
					callService.getGroupsCallToApplication(call));
			jmsQueueC.sendRecvAsync(newApplication.getId(), new MessageListener() {
				@Override
				public void onMessage(Message arg0) {
					String nodeRef = null;
					try {
						ObjectMessage objMessage = (ObjectMessage)arg0;
						nodeRef = (String)objMessage.getObject();
						if (LOGGER.isInfoEnabled())
							LOGGER.info("Start send application with id: " + nodeRef);
						Folder application = loadApplicationById(cmisService.createAdminSession(), nodeRef, result);
						Folder call = loadCallById(cmisService.createAdminSession(), application.getParentId(), result);
						CMISUser applicationUser;
						try {
							applicationUser = (CMISUser)userService.loadUserForConfirm(
									(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
						} catch (CoolUserFactoryException e) {
							throw new ClientMessageException("User not found");
						}
						result.put("email_comunicazione", applicationUser.getEmail());
						sendConfirmMail(cmisService.createAdminSession(), applicationUser, result, application, call, contextURL, locale);
						if (LOGGER.isInfoEnabled())
							LOGGER.info("End send application with id: " + nodeRef);
					} catch (Exception e) {
						LOGGER.error("Error on Message for send application with id:" + nodeRef , e);
					}
				}
			});
			/**
			 * Aggiungo la stampa ad ogni riga di curriculum e di prodotti
			 */
			addContentToChild(newApplication.getId(), cmisService.createAdminSession(), i18nService.loadLabels(locale), contextURL);
		} catch (Exception e) {
			mailService.sendErrorMessage(userId, contextURL, contextURL, new CMISApplicationException("999", e));
			throw new ClientMessageException("message.error.confirm.incomplete");
		}
		return Collections.singletonMap("email_comunicazione", applicationUser.getEmail());
	}

	private void sendConfirmMail(Session session, CMISUser applicationUser, Map<String, Object> model,
			Folder applicationFolder, Folder callFolder, String contextURL, Locale locale) throws MailException, TemplateException, IOException {
		model.put("folder", applicationFolder);
		model.put("call", callFolder);
		String body = Util.processTemplate(model, "/pages/application/application.registration.html.ftl");
		EmailMessage message = new EmailMessage();
		List<String> emailList = new ArrayList<String>(), emailBccList = new ArrayList<String>();
		emailList.add(applicationUser.getEmail());
		model.put("email_comunicazione", applicationUser.getEmail());
		message.setRecipients(emailList);
		if (emailBccList.isEmpty())
			message.setBccRecipients(emailBccList);
		message.setSubject("[concorsi] " + i18nService.getLabel("subject-confirm-domanda", locale, callFolder.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())));
		message.setBody(body);
		byte[] stampaByte = printService.getRicevutaReportModel(session, applicationFolder, contextURL, locale);

		String nameRicevutaReportModel = printService.getNameRicevutaReportModel(cmisService.createAdminSession(), applicationFolder);
		printService.archiviaRicevutaReportModel(applicationFolder, new ByteArrayInputStream(stampaByte),nameRicevutaReportModel, true);
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(JCONONPropertyIds.APPLICATION_DUMMY.value(), "{\"stampa_archiviata\" : true}");
		applicationFolder.updateProperties(properties);
		message.setAttachments(Arrays.asList(new AttachmentBean(nameRicevutaReportModel, stampaByte)));
		mailService.send(message);
	}
	
	public String printSchedaValutazione(Session cmisSession, String nodeRef,
			String contextURL, String userId, Locale locale) throws IOException {
		Folder application = (Folder) cmisSession.getObject(nodeRef);
		Folder call = (Folder) cmisSession.getObject(application.getParentId());
		application.refresh();
		InputStream is = new ByteArrayInputStream(printService.getSchedaValutazione(
				cmisSession, application, contextURL, locale));
		String nameRicevutaReportModel = printService.getSchedaValutazioneName(cmisSession, application);
		ContentStream contentStream = new ContentStreamImpl(nameRicevutaReportModel,
				BigInteger.valueOf(is.available()),
				"application/vnd.ms-excel",
				is);
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_VALUTAZIONE.value());
		properties.put(PropertyIds.NAME, nameRicevutaReportModel);

		properties.put(JCONONPropertyIds.ATTACHMENT_USER.value(), userId);
		properties.put(JCONONPropertyIds.ATTACHMENT_SCHEDA_VALUTAZIONE_COMMENTO.value(), "Scheda vuota");

		Document doc = application.createDocument(properties, contentStream, VersioningState.MAJOR);

		Map<String, ACLType> aces = new HashMap<String, ACLType>();
		aces.put(callService.getCallGroupName(call), ACLType.Coordinator);
		Folder macroCall = callService.getMacroCall(cmisService.createAdminSession(), call);
		if (macroCall!=null) {
			String groupNameMacroCall = callService.getCallGroupName(macroCall);
			aces.put(groupNameMacroCall, ACLType.Coordinator);
		}
		aclService.addAcl(cmisService.getAdminSession(),
				doc.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
		aclService.setInheritedPermission(cmisService.getAdminSession(), 
				doc.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);
		nodeVersionService.addAutoVersion(doc, false);
		return doc.getId();
	}

	public Boolean print(Session currentCMISSession, String nodeRef, String contextURL, String userId, Locale locale) {
		printService.printApplication(jmsQueueB, nodeRef, contextURL, locale, true);
		return true;
	}



	protected Folder loadApplicationByCall(Session cmisSession, String callId, Map<String, Object> model, String userId) {
		if (model!=null && !model.isEmpty() && model.get("application")!=null)
			return (Folder)model.get("application");
		Folder call = loadCallById(cmisSession, callId, model);
		Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
		criteria.addColumn(PropertyIds.OBJECT_ID);
		criteria.add(Restrictions.inFolder(call.getId()));
		criteria.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_USER.value(), userId));
		ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
		if (iterable.getTotalNumItems()==0 || iterable.getTotalNumItems()== -1) {
			return null;
		}
		else if (iterable.getTotalNumItems()>1)
			throw new ClientMessageException("message.error.domanda.multipla");
		for (QueryResult queryResult : iterable) {
			Folder folder = (Folder)cmisSession.getObject((String)queryResult.getPropertyValueById(PropertyIds.OBJECT_ID));
			folder.refresh();
			model.put("folder", folder);
			return folder;
		}
		throw new ClientMessageException("message.error.domanda.multipla");
	}
	
    protected CMISUser getApplicationUser(Folder application) {
    	CMISUser applicationUser = null;
		if (application != null) {
			String userId = (String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value());
			try {
				applicationUser = (CMISUser)userService.loadUserForConfirm(userId);
			} catch (CoolUserFactoryException e) {
				throw new ClientMessageException(i18nService.getLabel("message.error.caller.user.not.found", Locale.ITALIAN, userId));
			}
		}
		return applicationUser;
    }
    
	protected void validateMacroCall(Folder call, CMISUser user) {
		validateMacroCall(call, user.getId());
	}
	
	private void manageApplicationPermission(Folder application, String userId){
		aclService.setInheritedPermission(cmisService.getAdminSession(),
				application.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);
		Map<String, ACLType> aces = new HashMap<String, ACLType>();
		aces.put(userId, ACLType.Contributor);
		aces.put(GroupsEnum.CONCORSI.value(), ACLType.Contributor);
		aclService.addAcl(cmisService.getAdminSession(), application.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(),
				aces);
	}
	
    private Map<String, Object> getSiperProperties(BindingSession siperCurrentBindingSession, CMISUser user, Folder folder) {
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(PropertyIds.OBJECT_TYPE_ID, folder.getType().getId());
		String matricola = String.valueOf(user.getMatricola());
		try {
			JsonObject jsonAnadip = siperService.getAnagraficaDipendente(matricola, siperCurrentBindingSession);
			if (jsonAnadip!=null && !jsonAnadip.isJsonNull()){
				for (Entry<String, JsonElement> entry : jsonAnadip.entrySet()) {
					if (entry.getValue().isJsonArray()) {
						JsonArray values = (JsonArray) entry.getValue();
						List<String> propertyValues = new ArrayList<String>();
						for (JsonElement jsonElement : values) {
							propertyValues.add(jsonElement.getAsString());
						}
						properties.put("jconon_application:"+entry.getKey(), propertyValues);
					} else {
						properties.put("jconon_application:"+entry.getKey(), entry.getValue().getAsString());
					}
				}
				for (Iterator<String> iterator = properties.keySet().iterator(); iterator.hasNext();) {
					String property = iterator.next();
					if (!isCorrectValue(property, properties.get(property).toString(), folder))
						iterator.remove();
				}
			}
		}catch(Exception ex) {
			LOGGER.error("Errore nel recupero delle informazioni del dipendente da SIPER, matricola:"+matricola, ex);
		}
    	return properties;
    }

    private boolean isCorrectValue(String property, String value, Folder folder) {
		boolean isCorrectValue = false;
		PropertyDefinition<?> propertyDefinition = getPropertyDefinition(folder, property);
		if (propertyDefinition == null)
			return isCorrectValue;
		if (propertyDefinition.getChoices() != null && !propertyDefinition.getChoices().isEmpty()) {
			for (Choice<?> choice : propertyDefinition.getChoices()) {
				if (String.valueOf(choice.getValue().get(0)).equals(value))
					isCorrectValue = true;
			}
		} else {
			isCorrectValue = true;
		}
		return isCorrectValue;
    }

    private PropertyDefinition<?> getPropertyDefinition(Folder folder, String property) {
    	PropertyDefinition<?> propertyDefinition = folder.getType().getPropertyDefinitions().get(property);
    	if (propertyDefinition == null) {
    		for (ObjectType aspect : folder.getSecondaryTypes()) {
    			propertyDefinition = aspect.getPropertyDefinitions().get(property);
    			if (propertyDefinition != null)
    				return propertyDefinition;
			}
    	}
    	return propertyDefinition;
    }
	
	protected Folder createInitialFolder(CMISUser loginUser, Map<String, Object> model, Session cmisSession, Folder call, 
			BindingSession siperCurrentBindingSession) {
		Folder folder = null;		
		try {
    		Map<String, Object> properties = new HashMap<String, Object>();
			properties.put(PropertyIds.OBJECT_TYPE_ID,  JCONONFolderType.JCONON_APPLICATION.value());
			properties.put(JCONONPropertyIds.APPLICATION_COGNOME.value(), loginUser.getLastName());
			properties.put(JCONONPropertyIds.APPLICATION_NOME.value(), loginUser.getFirstName());
			properties.put(JCONONPropertyIds.APPLICATION_USER.value(), loginUser.getId());
			properties.put(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value(), loginUser.getEmail());
			properties.put(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), CallService.DOMANDA_INIZIALE);
			properties.put(PropertyIds.NAME, folderService.integrityChecker("Domanda di "+((String)properties.get(JCONONPropertyIds.APPLICATION_COGNOME.value())).toUpperCase()+" "+
						((String)properties.get(JCONONPropertyIds.APPLICATION_NOME.value())).toUpperCase()+" - "+loginUser.getId()));

			if (loginUser.getSesso()!=null && !loginUser.getSesso().equals(""))
				properties.put(JCONONPropertyIds.APPLICATION_SESSO.value(), loginUser.getSesso());
			if (loginUser.getDataDiNascita()!=null && !loginUser.getDataDiNascita().equals("")){
				properties.put(JCONONPropertyIds.APPLICATION_DATA_NASCITA.value(), loginUser.getDataDiNascita());
			}
			if (loginUser.getCodicefiscale()!=null && !loginUser.getCodicefiscale().equals(""))
				properties.put(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value(), loginUser.getCodicefiscale());
			if (loginUser.getStraniero()!=null)
				properties.put(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value(), !loginUser.getStraniero());
			if (loginUser.getStatoestero()!=null && !loginUser.getStatoestero().equals(""))
				properties.put(JCONONPropertyIds.APPLICATION_NAZIONE_CITTADINANZA.value(), loginUser.getStatoestero());

			folder = (Folder) cmisService.createAdminSession().getObject(
					cmisService.createAdminSession().createFolder(properties, call));
			List<Object> secondaryTypes = new ArrayList<Object>();
			secondaryTypes.addAll(call.getProperty(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value()).getValues());
			secondaryTypes.addAll(call.getProperty(JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_CNR.value()).getValues());
			secondaryTypes.addAll(call.getProperty(JCONONPropertyIds.CALL_ELENCO_ASPECTS_ULTERIORI_DATI.value()).getValues());
			properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, secondaryTypes);
					
			manageApplicationPermission(folder, loginUser.getId());

			if (loginUser.getMatricola()!=null) {
				try {
		        	Map<String, Object> siperProperties = nodeMetadataService
							.populateMetadataType(cmisSession, 
									getSiperProperties(siperCurrentBindingSession, loginUser, folder), null);
					folder.updateProperties(siperProperties);
				} catch (Exception ex) {
					String subject = "Error in import Siper data for user " + loginUser.getMatricola();
					LOGGER.error(subject, ex);
					StringWriter sw = new StringWriter();
					ex.printStackTrace(new PrintWriter(sw));
					mailService.sendErrorMessage(loginUser.getId(), subject,
							sw.toString());
				}
			}
		} catch(CmisContentAlreadyExistsException ex) {
			throw ClientMessageException.FILE_ALREDY_EXISTS;
		}
    	return folder;
	}

	public Folder load(Session currentCMISSession, String callId,
			String applicationId, String userId, String contextURL,
			Locale locale, BindingSession siperBindingSession) {
		Map<String, Object> result = new HashMap<String, Object>();
		Folder application = null;
		try {
			CMISUser loginUser = userService.loadUserForConfirm(userId), applicationUser = null;
			Folder call = loadCallById(currentCMISSession, callId, result);
			if (applicationId!=null && !applicationId.isEmpty()) {
				application = loadApplicationById(currentCMISSession, applicationId, result);
				//la chiamata con il parametro applicationId deve prevedere sempre l'esistenza della domanda
				if (application==null)
					throw new ClientMessageException("message.error.caller");
				else {
					// la chiamata con il parametro applicationId può essere fatta
					// solo dall'amministratore se l'utente collegato non
					//coincide con quello della domanda
					if (!loginUser.isAdmin() && !loginUser.getId().equals(application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value())))
						throw new ClientMessageException("message.error.caller.user");
					else if (!application.getParentId().equals(call.getId()))
						throw new ClientMessageException("message.error.caller");
				}
			} else
				application = loadApplicationByCall(currentCMISSession, callId, result, userId);
			//Carico lo user dell'application
			applicationUser = getApplicationUser(application);

			// In un bando per dipendenti può accedere solo un dipendente
			// Se application è vuoto vuol dire che si sta creando la domanda e
			// quindi l'utente collegato deve essere un dipendente
			// Se application è pieno vuol dire che l'utente della domanda deve
			// essere un dipendente
			if (call.getType().getId().equals(JCONONFolderType.JCONON_CALL_EMPLOYEES.value()) &&
					((application==null && loginUser.getMatricola()==null) || (applicationUser!=null && applicationUser.getMatricola()==null))) {
				throw new ClientMessageException("message.error.bando.tipologia.employees");
			}
			// In un bando di mobilità può accedere solo un non dipendente
			// Se application è vuoto vuol dire che si sta creando la domanda e
			// quindi l'utente collegato non deve essere un dipendente
			// Se application è pieno vuol dire che l'utente della domanda deve
			// essere un dipendente
			if (JCONONFolderType.isMobilityCall(call.getType().getId()) &&
					((application==null && loginUser.getMatricola()!=null) || (applicationUser!=null && applicationUser.getMatricola()!=null))) {
				throw new ClientMessageException("message.error.bando.tipologia.mobility");
			}


			// Effettuo il controllo sul numero massimo di domande validate solo se
			// non è stata ancora inserita la domanda.
			//Se presente e validata, entra...... Se presente e non validata il blocco lo ha in fase di invio.
			if (application==null)
				validateMacroCall(call, loginUser);
			else if (application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(CallService.DOMANDA_INIZIALE))
				validateMacroCall(call, applicationUser);
			else if (application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(CallService.DOMANDA_CONFERMATA) &&
					 application.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value())!=null && !loginUser.isAdmin()){
					throw new ClientMessageException("message.error.domanda.inviata.accesso");
			}
			callService.isBandoInCorso(call, loginUser);

			if (application != null) {
				try {
					validateAllegatiLinked(call, application, currentCMISSession);
				} catch (ClientMessageException e) {
					result.put("validateAllegatiLinkedEmpty", e.getKeyMessage());
				}
			}
			if (application == null)
				application = createInitialFolder(loginUser, result, cmisService.createAdminSession(), call, siperBindingSession);
		} catch (CoolUserFactoryException e) {
			throw new CMISApplicationException("Load Application error.", e);
		}
		return application;
	}
	
	public Folder save(Session currentCMISSession,
			String contextURL, Locale locale,
			String userId, Map<String, Object> properties,
			Map<String, Object> aspectProperties) {
		Folder application = (Folder) currentCMISSession.getObject((String) properties.get(PropertyIds.OBJECT_ID));
		properties.put(JCONONPropertyIds.APPLICATION_DUMMY.value(), StringUtil.CMIS_DATEFORMAT.format(new Date()));
		if (application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()) == null ||
				application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(CallService.DOMANDA_INIZIALE)) {
			properties.put(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), CallService.DOMANDA_PROVVISORIA);
		}							
		properties.putAll(aspectProperties);
		cmisService.createAdminSession().getObject(application).updateProperties(properties, true);
		return application;
	}	

	/**
	 * 
	 * pre-condition : L'utente collegato ha accesso alla domanda e la domanda non risulta inviata.
	 * @param cmisSession
	 * @param contextURL
	 * @param objectId
	 */
	public void delete(Session cmisSession, String contextURL, String objectId) {
		Folder application = (Folder) cmisSession.getObject(objectId);
		if (application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()) != null &&
				application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(CallService.DOMANDA_CONFERMATA)) {
			throw new ClientMessageException("message.error.domanda.inviata.accesso");
		}
		((Folder) cmisService.createAdminSession().getObject(application)).deleteTree(true, UnfileObject.DELETE, true);	
	}
}
