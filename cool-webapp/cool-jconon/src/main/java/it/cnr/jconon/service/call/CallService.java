package it.cnr.jconon.service.call;

import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.UserCache;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.security.GroupsEnum;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.web.PermissionServiceImpl;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.alfresco.cmis.client.AlfrescoFolder;
import org.apache.chemistry.opencmis.client.api.FileableCmisObject;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisRuntimeException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.util.I18NUtil;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.webscripts.connector.User;

public class CallService implements UserCache, InitializingBean{
	@Autowired
	private CMISService cmisService;
	@Autowired
	private PermissionServiceImpl permission;
	@Autowired
	private CacheService cacheService;

	@Autowired
	private ACLService aclService;

	private Map<String, String> cache;

	private static final Logger LOGGER = LoggerFactory.getLogger(CallService.class);

	@Autowired
    private MailService mailService;
	@Autowired
	private UserService userService;

	public final static String FINAL_APPLICATION = "Domande definitive",
			DOMANDA_INIZIALE = "I",
			DOMANDA_CONFERMATA = "C",
			DOMANDA_PROVVISORIA = "P";

    public Folder getMacroCall(Session cmisSession, Folder call){
    	call = (Folder) cmisSession.getObject(call.getId());
		Folder currCall = call;
		while (currCall!=null &&
				!((AlfrescoFolder)currCall).hasAspect(JCONONPolicyType.JCONON_MACRO_CALL.value())){
			if (currCall.getType().getId().equals(JCONONFolderType.JCONON_COMPETITION.value()))
				return null;
			currCall = currCall.getFolderParent();
		}
    	return currCall;
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

    private Folder createFolderFinal(Session cmisSession, BindingSession bindingSession, String folderId) {
		Folder parent = (Folder) cmisSession.getObject(folderId);
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_FOLDER.value());
		properties.put(PropertyIds.NAME,FINAL_APPLICATION);
		Folder folder;
		try{
			folder = parent.createFolder(properties);
			aclService.setInheritedPermission(bindingSession, folder.getId(),
					false);
			Map<String, ACLType> aces = new HashMap<String, ACLType>();
			aces.put(GroupsEnum.CONCORSI.value(), ACLType.Consumer);
			aclService.addAcl(cmisService.getAdminSession(), folder.getId(), aces);
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
						User user = userService.loadUserForConfirm((String)queryResultDomande.getPropertyValueById(JCONONPropertyIds.APPLICATION_USER.value()));
						if (user!=null && user.getEmail()!=null) {
							emailList.add(user.getEmail());

							message.setRecipients(emailList);
							message.setSubject("[concorsi] " + I18NUtil.getMessage("subject-reminder-domanda",
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
		cache.clear();
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		cache = new HashMap<String, String>();
		cacheService.register(this);
	}

	@Override
	public String get(CMISUser user, BindingSession session) {
		if (cache.containsKey(user.getId())) {
			return cache.get(user.getId());
		}
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
		return cache.put(user.getId(), json.toString());
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

	public void isBandoInCorso(Folder call) {
		CMISUser loginUser = ((CMISUser)ThreadLocalRequestContext.getRequestContext().getUser());		
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
}
