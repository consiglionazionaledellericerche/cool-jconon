package it.cnr.jconon.web.scripts.application;

import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.PolicyType;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.FolderService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.security.GroupsEnum;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.search.SiperService;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.cool.web.scripts.exception.ValidationException;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.cmis.model.JCONONRelationshipType;
import it.cnr.jconon.service.application.ApplicationService;
import it.cnr.jconon.service.call.CallService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigInteger;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.alfresco.cmis.client.AlfrescoFolder;
import org.alfresco.cmis.client.type.AlfrescoDocumentType;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Relationship;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.definitions.Choice;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.IncludeRelationships;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.surf.util.I18NUtil;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class ApplicationWebScript extends it.cnr.cool.web.scripts.ManageFolderWebScript {
	private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationWebScript.class);

	@Autowired
    private CallService callService;
	@Autowired
    private ApplicationService applicationService;

	@Autowired
	private FolderService folderService;
	@Autowired
	private CMISService cmisService;
	@Autowired
	private SiperService siperService;
	@Autowired
	private UserService userService;

	@Autowired
	private NodeMetadataService nodeMetadataService;

	@Autowired
	private ACLService aclService;

	@Autowired
	private MailService mailService;

	private List<String> documentsNotRequired;

	protected final static List<String> EXCLUDED_TYPES = Arrays
			.asList("{http://www.cnr.it/model/jconon_attachment/cmis}application");

	public void setDocumentsNotRequired(List<String> documentsNotRequired) {
		this.documentsNotRequired = documentsNotRequired;
	}

    @Override
    protected Session getCMISSession() {
    	return cmisService.createAdminSession();
    }

    @Override
    protected void executeBeforeGet(WebScriptRequest req, Status status, Cache cache, Map<String, Object> model, Session cmisSession) {
    	super.executeBeforeGet(req, status, cache, model, cmisSession);

		CMISUser loginUser = ((CMISUser)ThreadLocalRequestContext.getRequestContext().getUser()), applicationUser = null;

		Folder call = applicationService.loadCallById(getCMISSession(), req.getParameter("callId"), model), application;
		String applicationId = req.getParameter("applicationId");
		if (applicationId!=null && !applicationId.isEmpty()) {
			application = applicationService.loadApplicationById(getCMISSession(), applicationId, model);

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
			application = loadApplicationByCall(getCMISSession(), req.getParameter("callId"), model);

		//Carico lo user dell'appllicazione
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
		callService.isBandoInCorso(call);

		if (application != null) {
			try {
				validateAllegatiLinked(call, application, cmisSession);
			} catch (ClientMessageException e) {
				model.put("validateAllegatiLinkedEmpty", e.getKeyMessage());
			}
		}

    }

    @Override
	protected void executeAfterGet(WebScriptRequest req, Status status, Cache cache, Map<String, Object> model, Session cmisSession) {
		super.executeAfterGet(req, status, cache, model, cmisSession);
		Folder application;
		if (req.getParameter("applicationId")!=null && !req.getParameter("applicationId").isEmpty())
			application = applicationService.loadApplicationById(getCMISSession(), req.getParameter("applicationId"), model);
		else
			application = loadApplicationByCall(getCMISSession(), req.getParameter("callId"), model);
		if (application==null)
			createInitialFolder(req, model, cmisSession);
	}

	protected void validateMacroCall(Folder call, CMISUser user) {
		validateMacroCall(call, user.getId());
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

	@Override
	protected void completeProperties(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model, Session cmisSession,
			String objectId, Map<String, Object> properties,
			Map<String, Object> aspectProperties) {
		super.completeProperties(req, status, cache, model, cmisSession, objectId,
				properties, aspectProperties);
		properties.put(JCONONPropertyIds.APPLICATION_DUMMY.value(), StringUtil.CMIS_DATEFORMAT.format(new Date()));
		if (objectId != null) {
			Folder folder = (Folder) cmisSession.getObject(
					cmisSession.createObjectId(objectId));
			if (folder.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()) == null ||
					folder.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(CallService.DOMANDA_INIZIALE)) {
				properties.put(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), CallService.DOMANDA_PROVVISORIA);
			}					
		}
	}
	@Override
	protected void executeAfterPost(WebScriptRequest req, Status status, Cache cache, Map<String, Object> model, Session cmisSession, Boolean created, Folder folder) throws ValidationException {
		super.executeAfterPost(req, status, cache, model, cmisSession, created, folder);
		if (created)
			manageApplicationPermission(folder, (String)folder.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
	}

	@Override
	protected void executeBeforeDelete(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model, Session cmisSession,
			Folder folder) {
		super.executeBeforeDelete(req, status, cache, model, cmisSession, folder);
		if (folder.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()) != null &&
				folder.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(CallService.DOMANDA_CONFERMATA)) {
			throw new ClientMessageException("message.error.domanda.inviata.accesso");
		}		
		
	}
	protected Folder loadApplicationByCall(Session cmisSession, String callId, Map<String, Object> model) {
		if (model!=null && !model.isEmpty() && model.get("application")!=null)
			return (Folder)model.get("application");
		Folder call = applicationService.loadCallById(cmisSession, callId, model);
		Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
		criteria.addColumn(PropertyIds.OBJECT_ID);
		criteria.add(Restrictions.inFolder(call.getId()));
		criteria.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_USER.value(), ThreadLocalRequestContext.getRequestContext().getUserId()));
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

	protected Map<String, ACLType> getCallAceToApplication(Folder call){
		//PERMESSO al Gruppo del Bando
		Map<String, ACLType> acesMap = new HashMap<String, ACLType>();
		String groupName = callService.getCallGroupName(call);
		acesMap.put(groupName, ACLType.Contributor);

		Folder macroCall = callService.getMacroCall(cmisService.createAdminSession(), call);
		if (macroCall!=null) {
			String groupNameMacroCall = callService.getCallGroupName(macroCall);
			acesMap.put(groupNameMacroCall, ACLType.Contributor);
		}
		return acesMap;
	}

	protected void manageApplicationSendPermission(Folder folder, String userId) {
		Map<String, ACLType> acesToRemove = new HashMap<String, ACLType>();
		acesToRemove.put(userId, ACLType.Contributor);
		aclService.removeAcl(cmisService.getAdminSession(), folder.getId(), acesToRemove);

		Map<String, ACLType> aces = new HashMap<String, ACLType>();
		aces.put(userId, ACLType.Consumer);
		aclService.addAcl(cmisService.getAdminSession(), folder.getId(), aces);
		/**
		 * Change Ownership of Document
		 */
		aclService.changeOwnership(cmisService.getAdminSession(),
				folder.getId(),
				cmisService.getAdminUserId(),
				true,
				EXCLUDED_TYPES);
	}

	protected void manageApplicationReopenPermission(Folder folder, String userId) {
		Map<String, ACLType> acesToRemove = new HashMap<String, ACLType>();
		acesToRemove.put(userId, ACLType.Consumer);
		aclService.removeAcl(cmisService.getAdminSession(), folder.getId(), acesToRemove);

		Map<String, ACLType> aces = new HashMap<String, ACLType>();
		aces.put(userId, ACLType.Contributor);
		aclService.addAcl(cmisService.getAdminSession(), folder.getId(), aces);
		/**
		 * Change Ownership of Document
		 */
		aclService.changeOwnership(cmisService.getAdminSession(),
				folder.getId(), userId, true, EXCLUDED_TYPES);
	}

	private void manageApplicationPermission(Folder application, String userId){
		aclService.setInheritedPermission(cmisService.getAdminSession(),
				application.getId(), false);
		Map<String, ACLType> aces = new HashMap<String, ACLType>();
		aces.put(userId, ACLType.Contributor);
		aces.put(GroupsEnum.CONCORSI.value(), ACLType.Contributor);
		aclService.addAcl(cmisService.getAdminSession(), application.getId(),
				aces);
	}

	protected Folder createInitialFolder(WebScriptRequest req, Map<String, Object> model, Session cmisSession) {
		return createInitialFolder(req, model, cmisSession, req.getParameter("callId"));
	}

	@SuppressWarnings( "unchecked" )
	protected Folder createInitialFolder(WebScriptRequest req, Map<String, Object> model, Session cmisSession, String callId) {
		Folder call = applicationService.loadCallById(cmisSession, callId, model);
		AlfrescoFolder folder = null;		
		CMISUser loginUser = (CMISUser)ThreadLocalRequestContext.getRequestContext().getUser();
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

			folder = (AlfrescoFolder) call.createFolder(properties);

			for (String aspect : (List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value())) {
				folder.addAspect(aspect);
			}
			for (String aspect : (List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_CNR.value())) {
				folder.addAspect(aspect);
			}
			for (String aspect : (List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS_ULTERIORI_DATI.value())) {
				folder.addAspect(aspect);
			}
			manageApplicationPermission(folder, loginUser.getId());

			if (loginUser.getMatricola()!=null) {
	        	Map<String, Object> siperProperties = getSiperProperties(folder);
	        	siperProperties.put(PropertyIds.OBJECT_TYPE_ID, JCONONFolderType.JCONON_APPLICATION.value());
				List<String> aspects = new ArrayList<String>();
	        	for (ObjectType aspectType : folder.getAspects()) {
	        		aspects.add(aspectType.getId());
				}
	        	siperProperties.put(PolicyType.ASPECT_REQ_PARAMETER_NAME, aspects.toArray(new String[aspects.size()]));
	        	properties = new HashMap<String, Object>();
	        	HttpServletRequest request = ServletUtil.getRequest();
				properties.putAll(nodeMetadataService.populateMetadataType(cmisSession,
						siperProperties, request));
				properties.putAll(nodeMetadataService.populateMetadataAspect(
						cmisSession, siperProperties, request));
				try {
					folder.updateProperties(properties);
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
		} catch (ParseException e) {
			throw new WebScriptException("Error in import Siper data", e);
		}
    	return folder;
	}

    private Map<String, Object> getSiperProperties(AlfrescoFolder folder) {
		Map<String, Object> properties = new HashMap<String, Object>();
		String matricola = String.valueOf(((CMISUser)ThreadLocalRequestContext.getRequestContext().getUser()).getMatricola());
		try {
			HttpSession session = ServletUtil.getSession(false);

			BindingSession siperCurrentBindingSession = cmisService.getSiperCurrentBindingSession(session);


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

    private boolean isCorrectValue(String property, String value, AlfrescoFolder folder) {
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

    private PropertyDefinition<?> getPropertyDefinition(AlfrescoFolder folder, String property) {
    	PropertyDefinition<?> propertyDefinition = folder.getType().getPropertyDefinitions().get(property);
    	if (propertyDefinition == null) {
    		for (ObjectType aspect : folder.getAspects()) {
    			propertyDefinition = aspect.getPropertyDefinitions().get(property);
    			if (propertyDefinition != null)
    				return propertyDefinition;
			}
    	}
    	return propertyDefinition;
    }

    protected CMISUser getApplicationUser(Folder application) {
    	CMISUser applicationUser = null;
		if (application != null) {
			String userId = (String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value());
			try {
				applicationUser = (CMISUser)userService.loadUserForConfirm(userId);
			} catch (CoolUserFactoryException e) {
				throw new ClientMessageException(I18NUtil.getMessage("message.error.caller.user.not.found", userId));
			}
		}
		return applicationUser;
    }

	public boolean hasMandatoryAspect(AlfrescoDocumentType alfrescoObjectType, String aspectName) {
		if (alfrescoObjectType.getMandatoryAspects() != null && !alfrescoObjectType.getMandatoryAspects().isEmpty())
			return alfrescoObjectType.getMandatoryAspects().contains(aspectName);
		return false;
	}

	public boolean hasParentType(ObjectType alfrescoObjectType, String parentTypeName) {
		ObjectType type = alfrescoObjectType.getParentType();
		while (!type.getId().equals(BaseTypeId.CMIS_DOCUMENT.value())) {
			if (type.getId().equals(parentTypeName)) {
				return true;
			}
			type = type.getParentType();
		}
		return false;
	}

	public void validateAllegatiLinked(Folder call, Folder application,
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
							I18NUtil.getMessage("message.error.allegati.empty"));
				}
			}
			if (hasParentType(objectType, JCONONDocumentType.JCONON_ATTACHMENT_MONO.value())){
				if (totalNumItems == 0
						&& !documentsNotRequired.contains(objectType.getId()) &&
						!hasMandatoryAspect((AlfrescoDocumentType) objectType, "P:jconon_attachment:document_not_required")) {
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
			messageError.append((messageError.length()!=0?"</br></br>":"")+I18NUtil.getMessage("message.error.allegati.required", listMonoRequired));
		}
		if (listMonoMultiInserted.length() > 0) {
			messageError.append((messageError.length()!=0?"</br></br>":"")+I18NUtil.getMessage("message.error.allegati.mono.multi.inserted", listMonoMultiInserted));
		}
		if (ctrlAlternativeAttivita) {
			if (!existVerificaAttivita && !existRelazioneAttivita) {
				messageError.append((messageError.length()!=0?"</br></br>":"")+I18NUtil.getMessage("message.error.allegati.alternative.attivita.not.exists"));
			}
			if (existVerificaAttivita && existRelazioneAttivita) {
				messageError.append((messageError.length()!=0?"</br></br>":"")+I18NUtil.getMessage("message.error.allegati.alternative.attivita.all.exists"));
			}

			Criteria criteriaCurr = CriteriaFactory.createCriteria("jconon_attachment:cv_element");
			criteriaCurr.add(Restrictions.inFolder(application.getId()));
			OperationContext operationContextCurr = cmisSession.getDefaultContext();
			operationContextCurr.setIncludeRelationships(IncludeRelationships.SOURCE);
			long numRigheCurriculum = criteriaCurr.executeQuery(cmisSession, false, operationContextCurr).getTotalNumItems();
			if (!existCurriculum && numRigheCurriculum<=0) {
				messageError.append((messageError.length()!=0?"</br></br>":"")+I18NUtil.getMessage("message.error.allegati.alternative.curriculum.not.exists"));
			}
			if (existCurriculum && numRigheCurriculum>0) {
				messageError.append((messageError.length()!=0?"</br></br>":"")+I18NUtil.getMessage("message.error.allegati.alternative.curriculum.all.exists"));
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
											I18NUtil.getMessage("message.error.prodotti.scelti.allegato.empty"));
							}
						}
					}
				}
				if (!existsRelProdotto)
					throw new ClientMessageException(
							I18NUtil.getMessage("message.error.prodotti.scelti.senza.allegato"));
			}
			if (numMaxProdotti != null && totalNumItems > numMaxProdotti.longValue()) {
				throw new ClientMessageException(I18NUtil.getMessage(
						"message.error.troppi.prodotti.scelti",
						String.valueOf(totalNumItems),
						String.valueOf(numMaxProdotti)));
			}
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected List<String> getSezioniDomandaList(Folder call) {
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

	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected List<String> getAssociationList(Folder call) {
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

}
