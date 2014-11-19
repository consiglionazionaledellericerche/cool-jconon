package it.cnr.jconon.service.call;


import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.FolderService;
import it.cnr.cool.cmis.service.UserCache;
import it.cnr.cool.cmis.service.VersionService;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.security.GroupsEnum;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.UriUtils;
import it.cnr.cool.web.PermissionServiceImpl;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.service.cache.CompetitionFolderService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.FileableCmisObject;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.Property;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.UnfileObject;
import org.apache.chemistry.opencmis.commons.enums.Updatability;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisRuntimeException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

public class CallService implements UserCache, InitializingBean{
	@Autowired
	private CMISService cmisService;
	@Autowired
	private PermissionServiceImpl permission;
	@Autowired
	private CacheService cacheService;
	@Autowired
	private I18nService i18NService;
	@Autowired
	private CompetitionFolderService competitionFolderService;
	@Autowired
	private FolderService folderService;
	@Autowired
	private VersionService versionService;	
	@Autowired
	private ACLService aclService;

	private Cache<String, String> cache;

	private static final Logger LOGGER = LoggerFactory.getLogger(CallService.class);
	private static String BANDO_NAME = "BANDO ";
	private static String GROUP_COMMISSIONI_CONCORSO = "COMMISSIONI_CONCORSO",
			GROUP_CONCORSI = "GROUP_CONCORSI",
			GROUP_EVERYONE = "GROUP_EVERYONE";

	@Autowired
    private MailService mailService;
	@Autowired
	private UserService userService;

	public final static String FINAL_APPLICATION = "Domande definitive",
			DOMANDA_INIZIALE = "I",
			DOMANDA_CONFERMATA = "C",
			DOMANDA_PROVVISORIA = "P";

    public Folder getMacroCall(Session cmisSession, Folder call){
		Folder currCall = call;
		while (currCall != null && cmisService.hasSecondaryType(currCall, JCONONPolicyType.JCONON_MACRO_CALL.value())){
			if (currCall.getType().getId().equals(JCONONFolderType.JCONON_COMPETITION.value()))
				return null;
			currCall = currCall.getFolderParent();
		}
    	return currCall.equals(call) ? null : currCall;
    }

    @Deprecated
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

    public Folder finalCall(Session cmisSession, BindingSession bindingSession, String objectIdBando){
		Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
		criteriaDomande.add(Restrictions.inTree(objectIdBando));
		criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), DOMANDA_CONFERMATA));
		ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
		Folder folderId = null;
		for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
			String applicationAttach = findAttachmentId(cmisSession, (String)queryResultDomande.getPropertyValueById(PropertyIds.OBJECT_ID) ,
					JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION);
			if (applicationAttach != null){
				folderId = createFolderFinal(cmisSession, bindingSession, objectIdBando);
				try{
					((FileableCmisObject)cmisSession.getObject(applicationAttach)).addToFolder(folderId, true);
				}catch(CmisRuntimeException _ex){
					LOGGER.error("Errore cmis", _ex);
				}
			}
		}
		return folderId;
    }

    @SuppressWarnings("AvoidThreadGroup")
    private Folder createFolderFinal(Session cmisSession, BindingSession bindingSession, String folderId) {
		Folder parent = (Folder) cmisSession.getObject(folderId);
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_FOLDER.value());
		properties.put(PropertyIds.NAME, FINAL_APPLICATION + " al " + new SimpleDateFormat("dd-MM-yyyy HH.mm.ss").format(new java.util.Date()));
		Folder folder;
		try{
			folder = parent.createFolder(properties);
			aclService.setInheritedPermission(bindingSession, folder.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(),
					false);
			Map<String, ACLType> aces = new HashMap<String, ACLType>();
			aces.put(GroupsEnum.CONCORSI.value(), ACLType.Consumer);
			aclService.addAcl(cmisService.getAdminSession(), folder.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
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

    public void sollecitaApplication(Session cmisSession){

		Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
		ItemIterable<QueryResult> bandi = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());

		for (QueryResult queryResult : bandi.getPage(Integer.MAX_VALUE)) {
			BigInteger numGiorniSollecito = queryResult.getPropertyValueById(
					JCONONPropertyIds.CALL_NUM_GIORNI_MAIL_SOLLECITO.value());
			if (numGiorniSollecito == null)
				numGiorniSollecito = new BigInteger("8");
			Calendar dataLimite = Calendar.getInstance();
			dataLimite.add(Calendar.DAY_OF_YEAR, numGiorniSollecito.intValue());

			Calendar dataFineDomande = queryResult.getPropertyValueById(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value());

			if (dataFineDomande.before(dataLimite) && dataFineDomande.after(Calendar.getInstance())) {
				Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
				criteriaDomande.add(Restrictions.inFolder((String)queryResult.getPropertyValueById(PropertyIds.OBJECT_ID)));
				criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), DOMANDA_PROVVISORIA));
				ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, cmisSession.getDefaultContext());

				for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
					EmailMessage message = new EmailMessage();
					List<String> emailList = new ArrayList<String>();
					try {
						CMISUser user = userService.loadUserForConfirm((String)queryResultDomande.getPropertyValueById(JCONONPropertyIds.APPLICATION_USER.value()));
						if (user!=null && user.getEmail()!=null) {
							emailList.add(user.getEmail());

							message.setRecipients(emailList);
							message.setSubject("[concorsi] " + i18NService.getLabel("subject-reminder-domanda", Locale.ITALIAN,
									queryResult.getPropertyValueById(JCONONPropertyIds.CALL_CODICE.value()),
									removeHtmlFromString((String)queryResult.getPropertyValueById(JCONONPropertyIds.CALL_DESCRIZIONE.value()))));
							message.setTemplateBody("/pages/call/call.reminder.application.html.ftl");
							Map<String, Object> templateModel = new HashMap<String, Object>();
							templateModel.put("call", queryResult);
							templateModel.put("folder", queryResultDomande);
							message.setTemplateModel(templateModel);
							mailService.send(message);
							LOGGER.info("Spedita mail a " + user.getEmail() + " per il bando " + message.getSubject());
						}
					} catch (Exception e) {
						LOGGER.error("Cannot send email for scheduler reminder application for call", e);
					}
				}
			}
		}
	}

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

	/**
	 * Metodi per la cache delle Abilitazioni
	 */
	@Override
	public String name() {
		return "enableTypeCalls";
	}

	@Override
	public void clear() {
		cache.invalidateAll();
	}

	@Override
	public void clear(String username) {
		cache.invalidate(username);
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		cache = CacheBuilder.newBuilder()
				.expireAfterWrite(1, versionService.isProduction() ? TimeUnit.HOURS : TimeUnit.MINUTES)
				.build();
		cacheService.register(this);
	}

	@Override
	public String get(final CMISUser user, BindingSession session) {
		try {
			return cache.get(user.getId(), new Callable<String>() {
				@Override
				public String call() throws Exception {
					ItemIterable<ObjectType> objectTypes = cmisService.createAdminSession().
							getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false);
					JSONArray json = new JSONArray();

					for (ObjectType objectType : objectTypes) {
						boolean isAuthorized = permission.isAuthorized(objectType.getId(), "PUT",
								user);
						LOGGER.debug(objectType.getId() + " "
								+ (isAuthorized ? "authorized" : "unauthorized"));
						if (isAuthorized) {
							try {
								JSONObject jsonObj = new JSONObject();
								jsonObj.put("id", objectType.getId());
								jsonObj.put("title", objectType.getDisplayName());
								json.put(jsonObj);
							} catch (JSONException e) {
								LOGGER.error("errore nel parsing del JSON", e);
							}
						}
					}
					return json.toString();
				}
			});
		} catch (ExecutionException e) {
			LOGGER.error("Cannot load enableTypeCalls cache for user:" + user.getId(), e);
			throw new ClientMessageException(e.getMessage());
		}
	}

	public String getCallGroupName(Folder call){
		String groupName = "GROUP_".concat((String)call.getPropertyValue(PropertyIds.NAME));
		if (groupName.length() > 100)
			groupName = groupName.substring(0, 100);
		return groupName;
	}

	public List<String> getGroupsCallToApplication(Folder call){
		List<String> results = new ArrayList<String>();
		results.add(getCallGroupName(call));
		Folder macroCall = getMacroCall(cmisService.createAdminSession(), call);
		if (macroCall!=null) {
			results.add(getCallGroupName(macroCall));
		}
		return results;
	}

	public void isBandoInCorso(Folder call, CMISUser loginUser) {
		Calendar dtPubblBando = (Calendar)call.getPropertyValue(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value());
		Calendar dtScadenzaBando = (Calendar)call.getPropertyValue(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value());
		Calendar currDate = new GregorianCalendar();
		Boolean isBandoInCorso = Boolean.FALSE;
		if (dtScadenzaBando == null && dtPubblBando != null && dtPubblBando.before(currDate))
			isBandoInCorso = Boolean.TRUE;
		if (dtScadenzaBando != null && dtPubblBando != null && dtPubblBando.before(currDate) && dtScadenzaBando.after(currDate))
			isBandoInCorso = Boolean.TRUE;
		if (!isBandoInCorso && !loginUser.isAdmin())
			throw new ClientMessageException("message.error.bando.scaduto");
	}

	public Folder save(Session cmisSession, BindingSession bindingSession, String contextURL, Locale locale, String userId, 
			Map<String, Object> properties, Map<String, Object> aspectProperties) {
		Folder call;
		properties.putAll(aspectProperties);
		/**
		 * Verifico inizialmente se sto in creazione del Bando
		 */
		if (properties.get(JCONONPropertyIds.CALL_CODICE.value()) == null )
			throw new ClientMessageException("message.error.required.codice");

		String name = BANDO_NAME.concat(properties.get(JCONONPropertyIds.CALL_CODICE.value()).toString());
		if (properties.get(JCONONPropertyIds.CALL_SEDE.value()) != null)
			name = name.concat(" - ").
				concat(properties.get(JCONONPropertyIds.CALL_SEDE.value()).toString());
		properties.put(PropertyIds.NAME, folderService.integrityChecker(name));
		
		if (properties.get(PropertyIds.OBJECT_ID) == null) {
			if (properties.get(PropertyIds.PARENT_ID) == null)
				properties.put(PropertyIds.PARENT_ID, competitionFolderService.getCompetition().getId());
			call = (Folder) cmisSession.getObject(
					cmisSession.createFolder(properties, new ObjectIdImpl((String)properties.get(PropertyIds.PARENT_ID))));			
			aclService.setInheritedPermission(bindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);
		} else {
			call = (Folder) cmisSession.getObject((String)properties.get(PropertyIds.OBJECT_ID));
			call.updateProperties(properties, true);
			if (!call.getParentId().equals(properties.get(PropertyIds.PARENT_ID)) && properties.get(PropertyIds.PARENT_ID) != null)
				call.move(call.getFolderParent(), new ObjectIdImpl((String)properties.get(PropertyIds.PARENT_ID)));

		}
		GregorianCalendar dataInizioInvioDomande = (GregorianCalendar) properties.get(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value());
		if (dataInizioInvioDomande != null && properties.get(PropertyIds.PARENT_ID) == null){
			String year = String.valueOf(dataInizioInvioDomande.get(Calendar.YEAR));
			String month = String.valueOf(dataInizioInvioDomande.get(Calendar.MONTH) + 1);
			Folder folderYear = folderService.createFolderFromPath(cmisSession, competitionFolderService.getCompetition().getPath(), year);
			Folder folderMonth = folderService.createFolderFromPath(cmisSession, folderYear.getPath(), month);
			Folder callFolder = ((Folder)cmisSession.getObject(call.getId()));

			Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
			criteria.add(Restrictions.inTree(call.getId()));
			ItemIterable<QueryResult> applications = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
			if (applications.getTotalNumItems() == 0 && !folderMonth.getId().equals(callFolder.getParentId())) {
                callFolder.move(new ObjectIdImpl(callFolder.getParentId()), folderMonth);
            }
		}
		Map<String, Object> otherProperties = new HashMap<String, Object>();
		if (cmisSession.getObject(call.getParentId()).getType().getId().equals(call.getType().getId()))
			otherProperties.put(JCONONPropertyIds.CALL_HAS_MACRO_CALL.value(), true);
		else
			otherProperties.put(JCONONPropertyIds.CALL_HAS_MACRO_CALL.value(), false);
		List<Object> secondaryTypes = call.getProperty(PropertyIds.SECONDARY_OBJECT_TYPE_IDS).getValues();
		if (!cmisService.hasSecondaryType(call, JCONONPolicyType.JCONON_MACRO_CALL.value())){
			secondaryTypes.add(JCONONPolicyType.JCONON_CALL_SUBMIT_APPLICATION.value());
		} else {
			secondaryTypes.remove(JCONONPolicyType.JCONON_CALL_SUBMIT_APPLICATION.value());
		}
		otherProperties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, secondaryTypes);
		call.updateProperties(otherProperties);
		//reset cache 
		cacheService.clearCacheWithName("nodeParentsCache");
		return call;
	}

	public void delete(Session cmisSession, String contextURL, String objectId,
			String objectTypeId) {
		Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
		criteria.add(Restrictions.inTree(objectId));
		ItemIterable<QueryResult> applications = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
		if (applications.getTotalNumItems() > 0)
			throw new ClientMessageException("message.error.call.cannot.delete");
		if (LOGGER.isDebugEnabled())
			LOGGER.debug("Try to delete :"+objectId);
		Folder call = (Folder) cmisSession.getObject(objectId);
		call.deleteTree(true, UnfileObject.DELETE, true);
	}

	private boolean isCallAttachmentPresent(Session cmisSession, Folder source, JCONONDocumentType documentType){
		Criteria criteria = CriteriaFactory.createCriteria(documentType.queryName());
		criteria.add(Restrictions.inFolder(source.getId()));
		if (criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext()).getTotalNumItems() == 0)
			return false;
		return true;
	}

	private String getNodeRefOfGroup(String fullGroupName) {
		String link = cmisService.getBaseURL().concat("service/search/autocomplete/group?filter=").
				concat(UriUtils.encode(fullGroupName));
		UrlBuilder url = new UrlBuilder(link);
		Response resp = CmisBindingsHelper.getHttpInvoker(cmisService.getAdminSession()).invokeGET(url, cmisService.getAdminSession());
		int status = resp.getResponseCode();
		if (status == HttpStatus.SC_NOT_FOUND
				|| status == HttpStatus.SC_BAD_REQUEST
				|| status == HttpStatus.SC_INTERNAL_SERVER_ERROR) {
			return null;
		}
		try {
			JSONObject jsonObj = new JSONObject(IOUtils.toString(resp.getStream()));
			return ((JSONObject)jsonObj.getJSONArray("groups").get(0)).getString("nodeRef");
		} catch (JSONException e) {
			LOGGER.error("Cannot convert json object", e);
		} catch (IOException e) {
			LOGGER.error("Cannot convert json object", e);
		}
		return null;
	}

	private void addContibutorCommission(String groupName, String nodeRefCall) {
		Map<String, ACLType> acesGroup = new HashMap<String, ACLType>();
		acesGroup.put(groupName, ACLType.Contributor);
		aclService.addAcl(cmisService.getAdminSession(), nodeRefCall, acesGroup);
	}

	public Folder publish(Session cmisSession, BindingSession currentBindingSession, String userId, String objectId, boolean publish,
			String contextURL, Locale locale) {
		Folder call = (Folder) cmisSession.getObject(objectId);
		Map<String, ACLType> aces = new HashMap<String, ACLType>();
		aces.put(GROUP_CONCORSI, ACLType.Coordinator);
		aces.put(GROUP_EVERYONE, ACLType.Consumer);

		if(JCONONPolicyType.isIncomplete(call))
			throw new ClientMessageException("message.error.call.incomplete");

		if (call.getType().getId().equalsIgnoreCase(JCONONFolderType.JCONON_CALL_MOBILITY.value()) ||
				call.getType().getId().equalsIgnoreCase(JCONONFolderType.JCONON_CALL_MOBILITY_OPEN.value())){
			if (!isCallAttachmentPresent(cmisSession, call, JCONONDocumentType.JCONON_ATTACHMENT_CALL_MOBILITY))
				throw new ClientMessageException("message.error.call.mobility.incomplete.attachment");
		}else {
			if (!isCallAttachmentPresent(cmisSession, call, JCONONDocumentType.JCONON_ATTACHMENT_CALL_IT))
				throw new ClientMessageException("message.error.call.incomplete.attachment");
		}
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(JCONONPropertyIds.CALL_PUBBLICATO.value(), publish);
		if (publish) {
			aclService.addAcl(currentBindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
		}else {
			aclService.removeAcl(currentBindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
		}
		call.updateProperties(properties, true);
		//Creazione del gruppo per la commissione di Concorso
		String groupName = getCallGroupName(call);
		try {
			String link = cmisService.getBaseURL().concat("service/api/groups/").
					concat(GROUP_COMMISSIONI_CONCORSO).
					concat("/children/").
					concat(UriUtils.encode(groupName));
			UrlBuilder url = new UrlBuilder(link);
			CmisBindingsHelper.getHttpInvoker(cmisService.getAdminSession()).invokePOST(url, MimeTypes.JSON.mimetype(),
				new Output() {
					@Override
					public void write(OutputStream out) throws Exception {
					}
				}, cmisService.getAdminSession());
			String nodeRef = getNodeRefOfGroup(groupName);
			/**
			 * Il Gruppo della Commissione deve avere il ruolo di contributor sul bando
			 */
			addContibutorCommission(groupName, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString());
			Map<String, ACLType> acesGroup = new HashMap<String, ACLType>();
			acesGroup.put(userId, ACLType.FullControl);
			acesGroup.put(GROUP_CONCORSI, ACLType.FullControl);
			aclService.addAcl(cmisService.getAdminSession(), nodeRef, acesGroup);
		} catch (Exception e) {
			LOGGER.error("ACL error", e);
		}
		return call;
	}

	@SuppressWarnings("unchecked")
	public void crateChildCall(Session cmisSession, BindingSession currentBindingSession, String userId,
			Map<String, Object> extractFormParams, String contextURL,
			Locale locale) {
		Folder parent = (Folder) cmisSession.getObject(String.valueOf(extractFormParams.get(PropertyIds.PARENT_ID)));
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.putAll(extractFormParams);
		for (Property<?> property : parent.getProperties()) {
			if (!extractFormParams.containsKey(property.getId()) &&
					!property.getDefinition().getUpdatability().equals(Updatability.READONLY)) {
				LOGGER.debug("Add property " + property.getId() + " for create child.");
				properties.put(property.getId(), property.getValue());
			}
		}
		String name = BANDO_NAME.concat(properties.get(JCONONPropertyIds.CALL_CODICE.value()).toString());
		if (properties.get(JCONONPropertyIds.CALL_SEDE.value()) != null)
			name = name.concat(" - ").
				concat(properties.get(JCONONPropertyIds.CALL_SEDE.value()).toString());
		properties.put(PropertyIds.NAME, folderService.integrityChecker(name));
		
		for (PropertyDefinition<?> property : cmisSession.getTypeDefinition(JCONONPolicyType.JCONON_MACRO_CALL.value()).
				getPropertyDefinitions().values()) {
			if (!property.isInherited())
				properties.remove(property.getId());
		}
		properties.put(JCONONPropertyIds.CALL_HAS_MACRO_CALL.value(), true);
		List<String> secondaryTypes =((List<String>) properties.get(PropertyIds.SECONDARY_OBJECT_TYPE_IDS));
		secondaryTypes.add(JCONONPolicyType.JCONON_CALL_SUBMIT_APPLICATION.value());
		properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, secondaryTypes);
		properties.put(JCONONPropertyIds.CALL_PUBBLICATO.value(), false);
		
		Folder child = parent.createFolder(properties);
		aclService.setInheritedPermission(currentBindingSession, 
				child.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(),
				false);
		
		Criteria criteria = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_CALL_ABSTRACT.queryName());
		criteria.addColumn(PropertyIds.OBJECT_ID);
		criteria.add(Restrictions.inFolder(child.getParentId()));
		ItemIterable<QueryResult> attachments = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
		for (QueryResult attachment : attachments) {
			Document attachmentFile = (Document) cmisSession.getObject(
					String.valueOf(attachment.getPropertyValueById(PropertyIds.OBJECT_ID)));
			Map<String, Object> childProperties = new HashMap<String, Object>();
			for (Property<?> property : attachmentFile.getProperties()) {
				if (!property.getDefinition().getUpdatability().equals(Updatability.READONLY))
					childProperties.put(property.getId(), property.getValue());
			}
			Map<String, Object> initialProperties = new HashMap<String, Object>();
			initialProperties.put(PropertyIds.NAME, childProperties.get(PropertyIds.NAME));
			initialProperties.put(PropertyIds.OBJECT_TYPE_ID, childProperties.get(PropertyIds.OBJECT_TYPE_ID));
			Document newDocument = (Document)
					child.createDocument(initialProperties, attachmentFile.getContentStream(), VersioningState.MAJOR);
			newDocument.updateProperties(childProperties);
		}
	}
}