package it.cnr.jconon.service.application;


import it.cnr.bulkinfo.BulkInfo;
import it.cnr.bulkinfo.BulkInfoImpl.FieldProperty;
import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.model.PolicyType;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISConfig;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.FolderService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.cmis.service.NodeVersionService;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.security.GroupsEnum;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.service.search.SiperService;
import it.cnr.cool.util.JSONErrorPair;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.scripts.exception.CMISApplicationException;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.cmis.model.JCONONRelationshipType;
import it.cnr.jconon.model.PrintParameterModel;
import it.cnr.jconon.service.TypeService;
import it.cnr.jconon.service.cache.CompetitionFolderService;
import it.cnr.jconon.service.call.CallService;
import it.cnr.jconon.util.CallStato;
import it.cnr.jconon.util.HSSFUtil;
import it.cnr.si.cool.jconon.QueueService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.Order;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Serializable;
import java.io.StringWriter;
import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
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
import java.util.TreeMap;

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
import org.apache.chemistry.opencmis.commons.exceptions.CmisUnauthorizedException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFPictureData;
import org.apache.poi.hssf.usermodel.HSSFPrintSetup;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class ApplicationService implements InitializingBean {
	private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationService.class);
	@Autowired
	private CMISService cmisService;
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
	private I18nService i18nService;
	@Autowired
	private FolderService folderService;
	@Autowired
	private NodeMetadataService nodeMetadataService;
	@Autowired
	private SiperService siperService;
	@Autowired
	private ExportApplicationsService exportApplicationsService;
	@Autowired
	private CompetitionFolderService competitionService;	
	@Autowired
	private ApplicationContext context;
    @Autowired
    private TypeService typeService;
    @Autowired
    private CMISConfig cmisConfig;   
    @Autowired
    private QueueService queueService;
	
	private List<String> documentsNotRequired;

	protected final static List<String> EXCLUDED_TYPES = Arrays
			.asList("{http://www.cnr.it/model/jconon_attachment/cmis}application");

	public void setDocumentsNotRequired(List<String> documentsNotRequired) {
		this.documentsNotRequired = documentsNotRequired;
	}
	
	public final static String FINAL_APPLICATION = "Domande definitive";

	public enum StatoDomanda {
		CONFERMATA("C", "Inviata"), INIZIALE("I", "Iniziale"), PROVVISORIA("P", "Provvisoria"), ESCLUSA("E","Esclusione"), RINUNCIA("R", "Rinuncia"), SCHEDA_ANONIMA_RESPINTA("S", "Scheda anonima respinta");
		private final String value, displayValue;		
		private StatoDomanda(String value, String displayValue){
			this.displayValue = displayValue;
			this.value = value;
		}		
		public String displayValue() {
			return displayValue;
		}
		public String getValue() {
			return value;
		}
		
	    public static StatoDomanda fromValue(String v) {
	        for (StatoDomanda c : StatoDomanda.values()) {
	            if (c.value.equals(v)) {
	                return c;
	            }
	        }
	        throw new IllegalArgumentException(v);
	    }
		
		
	}
	

    public Folder getMacroCall(Session cmisSession, Folder call){
    	call = (Folder) cmisSession.getObject(call.getId());
		Folder currCall = call;
		while (currCall!=null &&
				!(typeService.hasSecondaryType(currCall, JCONONPolicyType.JCONON_MACRO_CALL.value()))){
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
		criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue()));
		OperationContext context = cmisSession.getDefaultContext();
		context.setMaxItemsPerPage(1000);
		ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, context);
		for (QueryResult queryResultDomande : domande) {
			String applicationAttach = competitionService.findAttachmentId(cmisSession, (String)queryResultDomande.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue() ,
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
		} catch (CmisUnauthorizedException ex){
			throw new ClientMessageException("message.error.user.not.authorized");
		}
		if (typeService.hasSecondaryType(call, JCONONPolicyType.JCONON_MACRO_CALL.value()))
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
		} catch (CmisUnauthorizedException ex){
			throw new ClientMessageException("message.error.user.not.authorized");
		}
		application.refresh();
		if (model != null)
			model.put("folder", application);
		return application;
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
		if (typeService.hasSecondaryType(sourceDoc, JCONONPolicyType.PEOPLE_NO_SELECTED_PRODUCT.value())) {
			secondaryTypes.remove(peopleNoSelectedproduct);
			secondaryTypes.add(peopleSelectedproduct);
		} else if (typeService.hasSecondaryType(sourceDoc, JCONONPolicyType.PEOPLE_SELECTED_PRODUCT.value())) {
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
		final Folder call = loadCallById(currentCMISSession, newApplication.getParentId(), null);
		if (newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value()) == null ||
				!newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(StatoDomanda.CONFERMATA.getValue())) {
			throw new ClientMessageException("message.error.domanda.no.confermata");
		}
		try {
			callService.isBandoInCorso(call, 
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
				jsonObject.put("groupRdP", "GROUP_" + call.getPropertyValue(JCONONPropertyIds.CALL_RDP.value()));
				out.write(jsonObject.toString().getBytes());
			}
		}, cmisService.getAdminSession());
		int status = resp.getResponseCode();
		if (status == HttpStatus.SC_NOT_FOUND|| status == HttpStatus.SC_BAD_REQUEST|| status == HttpStatus.SC_INTERNAL_SERVER_ERROR) {
			throw new CMISApplicationException("Reopen Application error. Exception: " + resp.getErrorContent());
		}
		queueService.queuePrintApplication().add(new PrintParameterModel(applicationSourceId, contextURL, false));
	}	

	protected void validateMacroCall(Folder call, String userId) {
		Folder macroCall = competitionService.getMacroCall(cmisService.createAdminSession(), call);
		if (macroCall!=null) {
			macroCall.refresh();
			Long numMaxDomandeMacroCall = ((BigInteger)macroCall.getPropertyValue(JCONONPropertyIds.CALL_NUMERO_MAX_DOMANDE.value())).longValue();
			if (numMaxDomandeMacroCall!=null) {
				Long numDomandeConfermate = callService.getTotalNumApplication(cmisService.createAdminSession(), macroCall, userId, StatoDomanda.CONFERMATA.getValue());
				if (numDomandeConfermate.compareTo(numMaxDomandeMacroCall)!=-1){
					throw new ClientMessageException("message.error.max.raggiunto");
				}
			}
		}
	}
	protected void validateSchedeAnonime(Session cmisSession, Folder call, Folder application) {
		Boolean flagSchedaAnonima = call.getPropertyValue(JCONONPropertyIds.CALL_FLAG_SCHEDA_ANONIMA_SINTETICA.value());
		if (flagSchedaAnonima != null && flagSchedaAnonima) {
			Criteria criteriaSchedeAnonime = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA.queryName());
			criteriaSchedeAnonime.add(Restrictions.inFolder(application.getId()));
			long numRigheSchedeAnonime = criteriaSchedeAnonime.executeQuery(cmisSession, false, cmisSession.getDefaultContext()).getTotalNumItems();
			if (numRigheSchedeAnonime == 0) {
				throw new ClientMessageException("message.error.schede.anonime.not.found");
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
		return typeService.getMandatoryAspects(objectType).contains(aspectName);
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
				if (queryResult
						.getPropertyById("cmis:contentStreamLength").getFirstValue() == null ||
						((BigInteger) queryResult
						.getPropertyById("cmis:contentStreamLength").getFirstValue())
						.compareTo(BigInteger.ZERO) != 1) {
					throw ClientMessageException.FILE_EMPTY;
				}
			}
			if (hasParentType(objectType, JCONONDocumentType.JCONON_ATTACHMENT_MONO.value())){
				if (totalNumItems == 0
						&& !documentsNotRequired.contains(objectType.getId()) &&
						!hasMandatoryAspect(objectType, "P:jconon_attachment:document_not_required")) {
					//Gestione del nulla Osta di Appartenenza associato all'aspect
					if (!(objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_NULLAOSTA_ALTRO_ENTE.value()) && 
							application.getProperty(JCONONPropertyIds.APPLICATION_FL_NULLA_OSTA.value()) != null &&
							!Boolean.valueOf(application.getProperty(JCONONPropertyIds.APPLICATION_FL_NULLA_OSTA.value()).getValueAsString())))
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
			messageError.append((messageError.length()!=0?"<br>":"")+i18nService.getLabel("message.error.allegati.required", Locale.ITALY, listMonoRequired));
		}
		if (listMonoMultiInserted.length() > 0) {
			messageError.append((messageError.length()!=0?"<br>":"")+i18nService.getLabel("message.error.allegati.mono.multi.inserted", Locale.ITALY, listMonoMultiInserted));
		}
		if (ctrlAlternativeAttivita) {
			if (!existVerificaAttivita && !existRelazioneAttivita) {
				messageError.append((messageError.length()!=0?"<br>":"")+i18nService.getLabel("message.error.allegati.alternative.attivita.not.exists", Locale.ITALY));
			}
			if (existVerificaAttivita && existRelazioneAttivita) {
				messageError.append((messageError.length()!=0?"<br>":"")+i18nService.getLabel("message.error.allegati.alternative.attivita.all.exists", Locale.ITALY));
			}

			Criteria criteriaCurr = CriteriaFactory.createCriteria("jconon_attachment:cv_element");
			criteriaCurr.add(Restrictions.inFolder(application.getId()));
			OperationContext operationContextCurr = cmisSession.getDefaultContext();
			operationContextCurr.setIncludeRelationships(IncludeRelationships.SOURCE);
			long numRigheCurriculum = criteriaCurr.executeQuery(cmisSession, false, operationContextCurr).getTotalNumItems();
			if (!existCurriculum && numRigheCurriculum<=0) {
				messageError.append((messageError.length()!=0?"<br>":"")+i18nService.getLabel("message.error.allegati.alternative.curriculum.not.exists", Locale.ITALY));
			}
			if (existCurriculum && numRigheCurriculum>0) {
				messageError.append((messageError.length()!=0?"<br>":"")+i18nService.getLabel("message.error.allegati.alternative.curriculum.all.exists", Locale.ITALY));
			}
		}

		if (messageError.length()!=0) {
			throw new ClientMessageException(messageError.toString());
		}

		List<String> listSezioniDomanda = getSezioniDomandaList(call);
		BigInteger numMaxProdotti = (BigInteger) call
				.getPropertyValue(JCONONPropertyIds.CALL_NUMERO_MAX_PRODOTTI
						.value());
		if (call.getProperty(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS.value()).getValues().contains(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_PROD_SCELTI_MULTIPLO.value())) {
			Criteria criteria = CriteriaFactory
					.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_PROD_SCELTI_MULTIPLO.queryName());
			criteria.add(Restrictions.inFolder(application.getId()));
			long totalNumItems = criteria.executeQuery(cmisSession,
					false, cmisSession.getDefaultContext()).getTotalNumItems();
			if (numMaxProdotti != null && totalNumItems > numMaxProdotti.longValue())
				throw new ClientMessageException(i18nService.getLabel(
						"message.error.troppi.prodotti.scelti",
						Locale.ITALY,
						String.valueOf(totalNumItems),
						String.valueOf(numMaxProdotti)));			
		}
		
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
											i18nService.getLabel("message.error.prodotti.scelti.allegato.empty", Locale.ITALY));
							}
						}
					}
				}
				if (!existsRelProdotto)
					throw new ClientMessageException(
							i18nService.getLabel("message.error.prodotti.scelti.senza.allegato", Locale.ITALY));
			}
			if (numMaxProdotti != null && totalNumItems > numMaxProdotti.longValue()) {
				throw new ClientMessageException(i18nService.getLabel(
						"message.error.troppi.prodotti.scelti",
						Locale.ITALY,
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
	
	private List<JSONErrorPair> validateAspects(Map<String, Object> map, Folder call, Folder application, Session cmisSession){
		List<JSONErrorPair> listError = new ArrayList<JSONErrorPair>();
		List<String> listAspect = getDichiarazioniList(call,application);
		for (String aspect : listAspect) {
			BulkInfo bulkInfoAspect = (BulkInfo) bulkInfoService.find(aspect);
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
	
	private List<JSONErrorPair> validateBaseTableMap(Map<String, Object> map, Folder call, Folder application, Session cmisSession){
		List<JSONErrorPair> listError = new ArrayList<JSONErrorPair>();
		listError.addAll(validateAspects(map, call, application, cmisSession));

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
                        LOGGER.debug("field " + fieldProperty.getProperty().toString());
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

	private void sendApplication(BindingSession cmisSession, final String applicationSourceId, final List<String> groupsCall, final String groupRdP) {		
		String link = cmisService.getBaseURL().concat("service/cnr/jconon/manage-application/send");
        UrlBuilder url = new UrlBuilder(link);
		Response resp = cmisService.getHttpInvoker(cmisSession).invokePOST(url, MimeTypes.JSON.mimetype(),
				new Output() {
            		@Override
					public void write(OutputStream out) throws Exception {
            			JSONObject jsonObject = new JSONObject();
            			jsonObject.put("applicationSourceId", applicationSourceId);
            			jsonObject.put("groupsCall", groupsCall);
            			jsonObject.put("userAdmin", cmisConfig.getServerParameters().get(CMISConfig.ADMIN_USERNAME));
            			jsonObject.put("groupRdP", groupRdP);
            			out.write(jsonObject.toString().getBytes());
            		}
        		}, cmisSession);
		int status = resp.getResponseCode();
		if (status == HttpStatus.SC_NOT_FOUND|| status == HttpStatus.SC_BAD_REQUEST|| status == HttpStatus.SC_INTERNAL_SERVER_ERROR)
			throw new CMISApplicationException("Send Application error. Exception: " + resp.getErrorContent());
	}


	@SuppressWarnings("unchecked")
	public Map<String, String> sendApplication(Session currentCMISSession, final String applicationSourceId, final String contextURL, 
			final Locale locale, String userId, Map<String, Object> properties, Map<String, Object> aspectProperties) {
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
		CMISUser applicationUser, currentUser;		
		try {
			applicationUser = (CMISUser)userService.loadUserForConfirm(
					(String)newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
			currentUser = (CMISUser)userService.loadUserForConfirm(userId);
		} catch (CoolUserFactoryException e) {
			throw new ClientMessageException("User not found");
		}
		if (!currentUser.isAdmin() && newApplication
				.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA
						.value()) != null
				&& newApplication.getPropertyValue(
						JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value())
						.equals(StatoDomanda.CONFERMATA.getValue()))
			throw new ClientMessageException(
					"message.error.domanda.inviata.accesso");
		/*
		 * Effettuo il controllo sul numero massimo di domande validate passandogli lo User
		 * della domanda che deve essere sempre valorizzata  
		 */
		validateMacroCall(call, (String)newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
		/*
		 * Effettuo il controllo sul numero di sche anonime presenti nel bando di concorso
		 * 
		 */
		validateSchedeAnonime(currentCMISSession, call, newApplication);

		Map<String, Object> allProperties = new HashMap<String, Object>();
		allProperties.putAll(properties);
		allProperties.putAll(aspectProperties);
		List<JSONErrorPair> listError = validateBaseTableMap(allProperties, call, newApplication, cmisService.createAdminSession());

		if (!listError.isEmpty()) {
			String error = "";
			for (JSONErrorPair jsonErrorPair : listError) {
				error = error.concat("<p>").concat(jsonErrorPair.first + ": " + i18nService.getLabel(jsonErrorPair.second, Locale.ITALY)).concat("</p>");
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
			if (!currentUser.isAdmin() && !newApplication.getPropertyValue(
							JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value())
							.equals(StatoDomanda.CONFERMATA.getValue())) {	
				Boolean flagSchedaAnonima = call.getPropertyValue(JCONONPropertyIds.CALL_FLAG_SCHEDA_ANONIMA_SINTETICA.value());
				sendApplication(cmisService.getAdminSession(), 
						newApplication.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), 
						flagSchedaAnonima != null && flagSchedaAnonima ? Collections.EMPTY_LIST :callService.getGroupsCallToApplication(call), 
								 "GROUP_" + call.getPropertyValue(JCONONPropertyIds.CALL_RDP.value()));
			}
			queueService.queueSendApplication().add(new PrintParameterModel(newApplication.getId(), contextURL, true));
			queueService.queueAddContentToApplication().add(new PrintParameterModel(newApplication.getId(), contextURL, false));			
		} catch (Exception e) {
			mailService.sendErrorMessage(userId, contextURL, contextURL, new CMISApplicationException("999", e));
			throw new ClientMessageException("message.error.confirm.incomplete");
		}
		return Collections.singletonMap("email_comunicazione", applicationUser.getEmail());
	}
		
	public Boolean print(Session currentCMISSession, String nodeRef, String contextURL, String userId, Locale locale) {
		try {
			Folder newApplication = (Folder) currentCMISSession.getObject(nodeRef);
			try {
				validateAllegatiLinked(loadCallById(currentCMISSession, newApplication.getParentId()), newApplication, cmisService.createAdminSession());				
			} catch (ClientMessageException _ex) {
				if (_ex.equals(ClientMessageException.FILE_EMPTY))
					throw _ex;
			}
			queueService.queuePrintApplication().add(new PrintParameterModel(nodeRef, contextURL, !userService.loadUserForConfirm(userId).isAdmin()));
			return true;			
		} catch (CmisUnauthorizedException _ex) {
			LOGGER.error("Try to print application Unauthorized UserId:" + userId + " - applicationId:" + nodeRef);
			return false;
		}
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
			Folder folder = (Folder)cmisSession.getObject((String)queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
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
				throw new ClientMessageException(i18nService.getLabel("message.error.caller.user.not.found", Locale.ITALY, userId));
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
	
    private Map<String, Object> getSiperProperties(CMISUser user, Folder folder) {
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(PropertyIds.OBJECT_TYPE_ID, folder.getType().getId());
		String username = String.valueOf(user.getId());
		try {
			JsonObject jsonAnadip = siperService.getAnagraficaDipendente(username);
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
			LOGGER.error("Errore nel recupero delle informazioni del dipendente da SIPER, matricola:"+ username, ex);
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
	
	protected Folder createInitialFolder(CMISUser loginUser, Map<String, Object> model, Session cmisSession, Folder call) {
		Folder folder = null;		
		try {
    		Map<String, Object> properties = new HashMap<String, Object>();
			properties.put(PropertyIds.OBJECT_TYPE_ID,  JCONONFolderType.JCONON_APPLICATION.value());
			properties.put(JCONONPropertyIds.APPLICATION_COGNOME.value(), loginUser.getLastName());
			properties.put(JCONONPropertyIds.APPLICATION_NOME.value(), loginUser.getFirstName());
			properties.put(JCONONPropertyIds.APPLICATION_USER.value(), loginUser.getId());
			properties.put(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value(), loginUser.getEmail());
			properties.put(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.INIZIALE.getValue());
			properties.put(PropertyIds.NAME, folderService.integrityChecker("Domanda di "+ ((String)properties.get(JCONONPropertyIds.APPLICATION_COGNOME.value()))+" "+
						((String)properties.get(JCONONPropertyIds.APPLICATION_NOME.value())) + " - "+loginUser.getId()));

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
									getSiperProperties(loginUser, folder), null);
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

	public boolean isApplicationPreview(boolean preview, CMISUser loginUser, Folder call) {
		return preview && (loginUser.isAdmin() || call.getPropertyValue(PropertyIds.CREATED_BY).equals(loginUser.getId()));
	}
	
	public Folder load(Session currentCMISSession, String callId,
			String applicationId, String userId, boolean preview, String contextURL,
			Locale locale) {
		Map<String, Object> result = new HashMap<String, Object>();
		Folder application = null;
		CMISUser loginUser = userService.loadUserForConfirm(userId), applicationUser = null;
		Folder call = loadCallById(currentCMISSession, callId, result);
		try {
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
				if (!isApplicationPreview(preview, loginUser, call))
					throw new ClientMessageException("message.error.bando.tipologia.employees");
			}
			// In un bando di mobilità può accedere solo un non dipendente
			// Se application è vuoto vuol dire che si sta creando la domanda e
			// quindi l'utente collegato non deve essere un dipendente
			// Se application è pieno vuol dire che l'utente della domanda deve
			// essere un dipendente
			if (JCONONFolderType.isMobilityCall(call.getType().getId()) &&
					((application==null && loginUser.getMatricola()!=null) || (applicationUser!=null && applicationUser.getMatricola()!=null))) {
				if (!isApplicationPreview(preview, loginUser, call))
					throw new ClientMessageException("message.error.bando.tipologia.mobility");
			}


			// Effettuo il controllo sul numero massimo di domande validate solo se
			// non è stata ancora inserita la domanda.
			//Se presente e validata, entra...... Se presente e non validata il blocco lo ha in fase di invio.
			if (application==null)
				validateMacroCall(call, loginUser);
			else if (application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(StatoDomanda.INIZIALE.getValue()))
				validateMacroCall(call, applicationUser);
			else if (application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(StatoDomanda.CONFERMATA.getValue()) &&
					 application.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value())!=null && !loginUser.isAdmin()){
					throw new ClientMessageException("message.error.domanda.inviata.accesso");
			}			
			if (!isApplicationPreview(preview, loginUser, call))
				callService.isBandoInCorso(call, loginUser);

			if (application != null) {
				/**
				 * Controllo di consistenza su nome e cognome dell'utenza
				 */
				if (!loginUser.isAdmin() && loginUser.getId().equals(application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()))){						
					Map<String, Object> properties = new HashMap<String, Object>();
					if (!loginUser.getFirstName().equalsIgnoreCase(application.getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value()))) {
						properties.put(JCONONPropertyIds.APPLICATION_NOME.value(), loginUser.getFirstName());
					}
					if (!loginUser.getLastName().equalsIgnoreCase(application.getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value()))) {
						properties.put(JCONONPropertyIds.APPLICATION_COGNOME.value(), loginUser.getLastName());
					}
					if (!properties.isEmpty())
						cmisService.createAdminSession().getObject(application).updateProperties(properties, true);
				}
				try {
					validateAllegatiLinked(call, application, currentCMISSession);
				} catch (ClientMessageException e) {
					result.put("validateAllegatiLinkedEmpty", e.getKeyMessage());
				}
			}
			if (application == null)
				application = createInitialFolder(loginUser, result, cmisService.createAdminSession(), call);
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
		try {
			validateAllegatiLinked(loadCallById(currentCMISSession, application.getParentId()), application, cmisService.createAdminSession());
		} catch (ClientMessageException _ex) {
			if (_ex.equals(ClientMessageException.FILE_EMPTY))
				throw _ex;
		}	
		properties.put(JCONONPropertyIds.APPLICATION_DUMMY.value(), StringUtil.CMIS_DATEFORMAT.format(new Date()));
		if (application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()) == null ||
				application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(StatoDomanda.INIZIALE.getValue())) {
			properties.put(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.PROVVISORIA.getValue());
		}							
		properties.putAll(aspectProperties);
		properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONFolderType.JCONON_APPLICATION.value());		
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
				application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(StatoDomanda.CONFERMATA.getValue())) {
			throw new ClientMessageException("message.error.domanda.inviata.accesso");
		}
		((Folder) cmisService.createAdminSession().getObject(application)).deleteTree(true, UnfileObject.DELETE, true);	
	}

	public void reject(Session currentCMISSession, String nodeRef) {
		Folder application = loadApplicationById(currentCMISSession, nodeRef);
		Map<String, Serializable> properties = new HashMap<String, Serializable>();
		properties.put("jconon_application:esclusione_rinuncia", "E");
		cmisService.createAdminSession().getObject(application).updateProperties(properties);
		Map<String, ACLType> acesToRemove = new HashMap<String, ACLType>();
		List<String> groups = callService.getGroupsCallToApplication(application.getFolderParent());
		for (String group : groups) {
			acesToRemove.put(group, ACLType.Contributor);
		}
		aclService.removeAcl(cmisService.getAdminSession(), 
				application.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), acesToRemove);
	}

	public void waiver(Session currentCMISSession, String nodeRef) {
		Folder application = loadApplicationById(currentCMISSession, nodeRef);
		Map<String, Serializable> properties = new HashMap<String, Serializable>();
		properties.put("jconon_application:esclusione_rinuncia", "R");
		cmisService.createAdminSession().getObject(application).updateProperties(properties);
		Map<String, ACLType> acesToRemove = new HashMap<String, ACLType>();
		List<String> groups = callService.getGroupsCallToApplication(application.getFolderParent());
		for (String group : groups) {
			acesToRemove.put(group, ACLType.Contributor);
		}
		aclService.removeAcl(cmisService.getAdminSession(), 
				application.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), acesToRemove);		
	}

	public void readmission(Session currentCMISSession, String nodeRef) {
		Folder application = loadApplicationById(currentCMISSession, nodeRef);
		Map<String, Serializable> properties = new HashMap<String, Serializable>();
		properties.put("jconon_application:esclusione_rinuncia", null);
		cmisService.createAdminSession().getObject(application).updateProperties(properties);
		Map<String, ACLType> acesToRemove = new HashMap<String, ACLType>();
		List<String> groups = callService.getGroupsCallToApplication(application.getFolderParent());
		for (String group : groups) {
			acesToRemove.put(group, ACLType.Contributor);
		}
		aclService.addAcl(cmisService.getAdminSession(), 
				application.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), acesToRemove);		
	}
	/**
	 * Ritorna una Map con key il COGNOME e NOME dell'utente e come value l'id della scheda
	 * @param currentCMISSession
	 * @param idCall
	 * @return
	 */
	public Map<String, String> findSchedeValutazione(Session currentCMISSession, String idCall) {
		Map<String, String> result = new TreeMap<String, String>();
        Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
		criteriaDomande.add(Restrictions.inTree(idCall));
		criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue()));
		criteriaDomande.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
		criteriaDomande.addOrder(Order.asc(JCONONPropertyIds.APPLICATION_COGNOME.value()));
		OperationContext context = currentCMISSession.getDefaultContext();
		context.setMaxItemsPerPage(10000);
		ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(currentCMISSession, false, context);
		for (QueryResult queryResultDomande : domande) {
			String applicationAttach = competitionService.findAttachmentId(currentCMISSession, (String)queryResultDomande.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue() ,
					JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_VALUTAZIONE);
			if (applicationAttach != null){
				result.put((String)queryResultDomande.getPropertyById(JCONONPropertyIds.APPLICATION_COGNOME.value()).getFirstValue() + " " + 
						(String)queryResultDomande.getPropertyById(JCONONPropertyIds.APPLICATION_NOME.value()).getFirstValue(),
						applicationAttach);
			}
		}
		return result;
	}
	
	
	public String exportSchedeValutazione(Session currentCMISSession, String idCall, String format, CMISUser user) {
		Folder bando = (Folder) currentCMISSession.getObject(idCall);
		String fileName = "Schede del bando " + bando.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString() + " al " + new SimpleDateFormat("dd-MM-yyyy HH.mm.ss", Locale.ITALY).format(new Date());
		Map<String, String> schede = findSchedeValutazione(currentCMISSession, idCall);
		if (format.equalsIgnoreCase("xls")) {
			HSSFWorkbook wb = new HSSFWorkbook();
			Map<Integer, HSSFCellStyle> styleMap = new HashMap<Integer, HSSFCellStyle>();
			for (String sheetName : schede.keySet()) {
				InputStream stream = ((Document)currentCMISSession.getObject(schede.get(sheetName))).getContentStream().getStream();
				try {
					HSSFWorkbook workbook = new HSSFWorkbook(stream);
					int pictureId = 0;
					for (HSSFPictureData picture : workbook.getAllPictures()) {
						pictureId = wb.addPicture(picture.getData(), picture.getFormat());
					}
					HSSFSheet newSheet = wb.createSheet(sheetName);
					HSSFPrintSetup ps = (HSSFPrintSetup) newSheet.getPrintSetup();
					ps.setLandscape(false);
					HSSFUtil.copySheets(newSheet, workbook.getSheetAt(0), styleMap, pictureId);
					workbook.close();
			    } catch (IOException e) {
			    	throw new CMISApplicationException("HSSFWorkbook error.", e);
				}				
			}
			Map<String, Object> properties = new HashMap<String, Object>();
			properties.put(PropertyIds.NAME, fileName + ".xls");
			properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			try {
				wb.write(outputStream);
				wb.close();
			} catch (IOException e) {
				throw new CMISApplicationException("HSSFWorkbook error.", e);
			}	
			Document doc;
			ContentStream contentStream = new ContentStreamImpl(fileName, BigInteger.ZERO, "application/vnd.ms-excels", new ByteArrayInputStream(outputStream.toByteArray()));
			Folder homeFolder = (Folder) currentCMISSession.getObject(user.getHomeFolder());
			doc = homeFolder.createDocument(properties, contentStream, VersioningState.MAJOR);
			return doc.getId();
		} else if (format.equalsIgnoreCase("zip")) {
			List<String> documents = callService.findDocumentFinal(currentCMISSession, cmisService.getAdminSession(),
					idCall, JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_VALUTAZIONE);
	        if (documents.isEmpty()) {
	            // Se non ci sono domande definitive finalCall non viene creata
	            throw new ClientMessageException("Il bando "
	                    + bando.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString()
	                    + " non presenta schede di valutazione!");
	        }			
			String finalZip = exportApplicationsService.invokePost(documents, fileName, cmisService.getAdminSession(), user);
			return finalZip;
		} else {
			throw new CMISApplicationException("Formato non supportato");
		}
	}

	
	public void generaSchedeValutazione(Session currentCMISSession, String idCall, final Locale locale, final String contextURL, final CMISUser user, final String email) {
		final String userId = user.getId();		
		if (!callService.isMemeberOfRDPGroup(user, (Folder)currentCMISSession.getObject(idCall)) && !user.isAdmin()) {
			LOGGER.error("USER:" + userId + " try to generaSchedeValutazione for call:"+idCall);
			return;			
		}
		queueService.queueSchedaValutazione().add(new PrintParameterModel(
				idCall, contextURL, true, email, userId, PrintParameterModel.TipoScheda.SCHEDA_VALUTAZIONE));
	}
	
	public void generaSchedeAnonime(Session currentCMISSession, String idCall, final Locale locale, final String contextURL, final CMISUser user, final String email) {
		final String userId = user.getId();		
		if (!callService.isMemeberOfRDPGroup(user, (Folder)currentCMISSession.getObject(idCall)) && !user.isAdmin()) {
			LOGGER.error("USER:" + userId + " try to generaSchedeValutazione for call:"+idCall);
			return;			
		}
		queueService.queueSchedaValutazione().add(new PrintParameterModel(
				idCall, contextURL, true, email, userId, PrintParameterModel.TipoScheda.SCHEDA_ANONIMA));
	}
	
	public String concludiProcessoSchedeAnonime(Session currentCMISSession, String idCall, Locale locale, String contextURL, CMISUser user) {
		final String userId = user.getId();		
		if (!callService.isMemeberOfRDPGroup(user, (Folder)currentCMISSession.getObject(idCall)) && !user.isAdmin()) {
			LOGGER.error("USER:" + userId + " try to generaSchedeValutazione for call:"+idCall);
			throw new ClientMessageException("USER:" + userId + " try to generaSchedeValutazione for call:"+idCall);
		}
		OperationContext context = currentCMISSession.getDefaultContext();
		context.setMaxItemsPerPage(Integer.MAX_VALUE);

		String message = "";
        Criteria criteriaSchedeAnonime = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA_SINTETICA_GENERATED.queryName(), "doc");		
        criteriaSchedeAnonime.add(Restrictions.inTree(idCall));
        
        Criteria criteriaValutazione = criteriaSchedeAnonime.createCriteria(JCONONPolicyType.JCONON_SCHEDA_ANONIMA_VALUTAZIONE.queryName(),"val"); 
        criteriaValutazione.addJoinCriterion(Restrictions.eqProperty(criteriaSchedeAnonime.prefix(PropertyIds.OBJECT_ID), criteriaValutazione.prefix(PropertyIds.OBJECT_ID)));        
        criteriaValutazione.add(Restrictions.isNull(criteriaValutazione.getTypeAlias() + "." + JCONONPropertyIds.SCHEDA_ANONIMA_VALUTAZIONE_ESITO.value()));
		
		if (criteriaSchedeAnonime.executeQuery(currentCMISSession, false, context).getTotalNumItems() > 0)
			throw new ClientMessageException("message.concludi.processo.schede.anonime.interrotto");

        Criteria criteria = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA_SINTETICA_GENERATED.queryName(), "doc");		
        criteria.add(Restrictions.inTree(idCall));
		ItemIterable<QueryResult> schede = criteria.executeQuery(currentCMISSession, false, context);
		int domandeConfermate = 0, domandeEscluse = 0;
		for (QueryResult scheda : schede) {
			Document schedaAnonimaSintetica = (Document) currentCMISSession.getObject((String)scheda.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
			Folder domanda = schedaAnonimaSintetica.getParents().get(0);
			if (schedaAnonimaSintetica.<Boolean>getPropertyValue(JCONONPropertyIds.SCHEDA_ANONIMA_VALUTAZIONE_ESITO.value())){
				Map<String, ACLType> acesToADD = new HashMap<String, ACLType>();
				List<String> groups = callService.getGroupsCallToApplication(domanda.getFolderParent());
				for (String group : groups) {
					acesToADD.put(group, ACLType.Contributor);
				}				
				aclService.addAcl(cmisService.getAdminSession(), (String)domanda.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()), acesToADD);
				domandeConfermate++;
			} else {
				Map<String, Object> schedaAnonimaproperties = new HashMap<String, Object>();
				List<String> secondaryTypesId = new ArrayList<String>();
				for (SecondaryType secondaryType : schedaAnonimaSintetica.getSecondaryTypes()) {
					secondaryTypesId.add(secondaryType.getId());
				}
				secondaryTypesId.add(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value());
				schedaAnonimaproperties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, secondaryTypesId);				
				schedaAnonimaSintetica.updateProperties(schedaAnonimaproperties);	
				
				Map<String, Serializable> properties = new HashMap<String, Serializable>();
				properties.put("jconon_application:esclusione_rinuncia", "S");
				cmisService.createAdminSession().getObject(domanda).updateProperties(properties);	
				domandeEscluse++;
			}
			message = "Il processo di valutazione si è concluso con:<br><b>Domande Confermate:</b> " + domandeConfermate + "<br><b>Domande Escluse:</b>" + domandeEscluse;
		}
		if (schede.getTotalNumItems() != 0) {
			Folder call = (Folder) currentCMISSession.getObject(idCall);
			Map<String, Object> properties = new HashMap<String, Object>();
			properties.put(JCONONPropertyIds.CALL_STATO.value(), CallStato.PROCESSO_SCHEDE_ANONIME_CONCLUSO.name());
			call.updateProperties(properties);			
		}
		return message;
	}
	
	public Map<String, String[]> getAspectParams(Session cmisSession, Map<String, String[]> extractFormParams) {
		List<String> aspects = new ArrayList<>();
		for (String key : extractFormParams.keySet()) {
			if (key.equalsIgnoreCase(PolicyType.ASPECT_REQ_PARAMETER_NAME)) {
				for (String aspectName : extractFormParams.get(key)) {
					try {
						ObjectType aspectType = cmisSession.getTypeDefinition(aspectName);
						if (!aspectType.getParentTypeId().equals(BaseTypeId.CMIS_SECONDARY.value()))
							aspects.add(aspectType.getParentTypeId());							
						aspects.add(aspectName);
					} catch (CmisObjectNotFoundException _ex) {
						aspects.add(bulkInfoService.find(aspectName).getCmisTypeName());
					}
				}
			}
		}
		extractFormParams.put(PolicyType.ASPECT_REQ_PARAMETER_NAME, aspects.toArray(new String[aspects.size()]));
		return extractFormParams;
	}

	public void addContentToChild(Session currentCMISSession, String nodeRef, Locale locale, String contextURL, final CMISUser user) {
		Folder application = (Folder) currentCMISSession.getObject(nodeRef);
		Folder call = (Folder) currentCMISSession.getObject(application.getParentId());
		final String userId = user.getId();		
		if (!callService.isMemeberOfRDPGroup(user, call) && !user.isAdmin()) {
			LOGGER.error("USER:" + userId + " try to generaSchedeValutazione for call:"+call.getId());
			throw new ClientMessageException("USER:" + userId + " try to generaSchedeValutazione for call:"+ call.getId());
		}		
		queueService.queueAddContentToApplication().add(new PrintParameterModel(application.getId(), contextURL, false));		
	}
}