package it.cnr.jconon.service.call;


import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.FolderService;
import it.cnr.cool.cmis.service.NodeVersionService;
import it.cnr.cool.cmis.service.UserCache;
import it.cnr.cool.cmis.service.VersionService;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.rest.util.Util;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.GroupsUtils;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.StrServ;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.PermissionServiceImpl;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.model.PrintParameterModel;
import it.cnr.jconon.repository.CallRepository;
import it.cnr.jconon.repository.ProtocolRepository;
import it.cnr.jconon.service.PrintService;
import it.cnr.jconon.service.TypeService;
import it.cnr.jconon.service.application.ApplicationService.StatoDomanda;
import it.cnr.jconon.service.cache.CompetitionFolderService;
import it.cnr.jconon.service.helpdesk.HelpdeskService;
import it.cnr.jconon.util.Profile;
import it.cnr.jconon.util.SimplePECMail;
import it.cnr.jconon.util.StatoConvocazione;
import it.cnr.jconon.util.TipoSelezione;
import it.cnr.si.cool.jconon.QueueService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.Order;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectId;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.Property;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.SecondaryType;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.enums.Action;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.UnfileObject;
import org.apache.chemistry.opencmis.commons.enums.Updatability;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.mail.EmailException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class CallService implements UserCache, InitializingBean {
	public final static String FINAL_APPLICATION = "Domande definitive",
    		FINAL_SCHEDE = "Schede di valutazione";
    private static final Logger LOGGER = LoggerFactory.getLogger(CallService.class);
    public static String BANDO_NAME = "BANDO ";
    public static String GROUP_COMMISSIONI_CONCORSO = "GROUP_COMMISSIONI_CONCORSO",
    		GROUP_RDP_CONCORSO = "GROUP_RDP_CONCORSO",
            GROUP_CONCORSI = "GROUP_CONCORSI",
            GROUP_EVERYONE = "GROUP_EVERYONE";
    @Autowired
    private CMISService cmisService;
    @Autowired
    private PermissionServiceImpl permission;
    @Autowired
    private CacheService cacheService;
    @Autowired
    private I18nService i18NService;
    @Autowired
    private FolderService folderService;
    @Autowired
    private VersionService versionService;
    @Autowired
    private ACLService aclService;
    private Cache<String, String> cache;
    @Autowired
    private MailService mailService;
    @Autowired
    private UserService userService;
    @Autowired
    private TypeService typeService;
    @Autowired
    private HelpdeskService helpdeskService;
	@Autowired
	private ApplicationContext context;
	@Autowired
    private CallRepository callRepository;
	@Autowired
	private CompetitionFolderService competitionService;
	@Autowired
	private PrintService printService;
	@Autowired
	private NodeVersionService nodeVersionService;
	@Inject
    private Environment env;
    @Autowired
    private QueueService queueService;
    @Autowired
    private ProtocolRepository protocolRepository;
	public static SimpleDateFormat ISO8601DATEFORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.ITALY);

    @Deprecated
    public long findTotalNumApplication(Session cmisSession, Folder call) {
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.addColumn(PropertyIds.NAME);
        criteria.add(Restrictions.inTree(call.getId()));
        ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        return iterable.getTotalNumItems();
    }

    public long getTotalNumApplication(Session cmisSession, Folder call, String userId, String statoDomanda) {
        Folder macroCall = competitionService.getMacroCall(cmisSession, call);
        if (macroCall != null) {
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

    public List<String> findDocumentFinal(Session cmisSession, BindingSession bindingSession, String objectIdBando, JCONONDocumentType documentType) {
    	List<String> result = new ArrayList<String>();
        Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaDomande.add(Restrictions.inTree(objectIdBando));
        criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue()));
        criteriaDomande.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
            String applicationAttach = competitionService.findAttachmentId(cmisSession, (String) queryResultDomande.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue(),
            		documentType, true);
            if (applicationAttach != null) {
            	result.add(applicationAttach);
            }
        }
        return result;
    }


    public String findAttachmentName(Session cmisSession, String source, String name) {
        Criteria criteria = CriteriaFactory.createCriteria(BaseTypeId.CMIS_DOCUMENT.value());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.addColumn(PropertyIds.NAME);
        criteria.add(Restrictions.inFolder(source));
        criteria.add(Restrictions.eq(PropertyIds.NAME, name));
        ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        for (QueryResult queryResult : iterable) {
            return (String) queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue();
        }
        return null;
    }

    public void sollecitaApplication(Session cmisSession) {

        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        ItemIterable<QueryResult> bandi = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());

        for (QueryResult queryResult : bandi.getPage(Integer.MAX_VALUE)) {
            BigInteger numGiorniSollecito = (BigInteger) queryResult.getPropertyById(
                    JCONONPropertyIds.CALL_NUM_GIORNI_MAIL_SOLLECITO.value()).getFirstValue();
            if (numGiorniSollecito == null)
                numGiorniSollecito = new BigInteger("8");
            Calendar dataLimite = Calendar.getInstance();
            dataLimite.add(Calendar.DAY_OF_YEAR, numGiorniSollecito.intValue());

            Calendar dataFineDomande = (Calendar) queryResult.getPropertyById(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value()).getFirstValue();
            if (dataFineDomande == null)
            	continue;
            if (dataFineDomande.before(dataLimite) && dataFineDomande.after(Calendar.getInstance())) {
                Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
                criteriaDomande.add(Restrictions.inFolder((String) queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue()));
                criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.PROVVISORIA.getValue()));
                ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, cmisSession.getDefaultContext());

                for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
                    EmailMessage message = new EmailMessage();
                    List<String> emailList = new ArrayList<String>();
                    try {
                        CMISUser user = userService.loadUserForConfirm((String) queryResultDomande.getPropertyById(JCONONPropertyIds.APPLICATION_USER.value()).getFirstValue());
                        if (user != null && user.getEmail() != null) {
                            emailList.add(user.getEmail());

                            message.setRecipients(emailList);
                            message.setSubject("[concorsi] " + i18NService.getLabel("subject-reminder-domanda", Locale.ITALY,
                                    queryResult.getPropertyById(JCONONPropertyIds.CALL_CODICE.value()).getFirstValue(),
                                    removeHtmlFromString((String) queryResult.getPropertyById(JCONONPropertyIds.CALL_DESCRIZIONE.value()).getFirstValue())));
                            Map<String, Object> templateModel = new HashMap<String, Object>();
                            templateModel.put("call", queryResult);
                            templateModel.put("folder", queryResultDomande);
                            templateModel.put("message", context.getBean("messageMethod", Locale.ITALY));                            
                            String body = Util.processTemplate(templateModel, "/pages/call/call.reminder.application.html.ftl");
                            message.setBody(body);
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

    private String removeHtmlFromString(String stringWithHtml) {
        if (stringWithHtml == null) return null;
        stringWithHtml = stringWithHtml.replace("&rsquo;", "'");
        stringWithHtml = stringWithHtml.replace("&amp;", "'");
        stringWithHtml = stringWithHtml.replaceAll("\\<.*?>", "");
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

    private void populateCallTypes(List<ObjectType> callTypes, String callType) {
        ItemIterable<ObjectType> objectTypes = cmisService.createAdminSession().
                getTypeChildren(callType, false);
        for (ObjectType objectType : objectTypes) {
        	callTypes.add(objectType);
        	populateCallTypes(callTypes, objectType.getId());
        }    	
    }
    
    public List<ObjectType> findCallTypes() {
    	List<ObjectType> callTypes = new ArrayList<>();
    	populateCallTypes(callTypes, JCONONFolderType.JCONON_CALL.value());
    	return callTypes;
    }
    
    @Override
    public String get(final CMISUser user, BindingSession session) {
        try {
            return cache.get(user.getId(), new Callable<String>() {
                @Override
                public String call() throws Exception {
                	List<ObjectType> objectTypes = findCallTypes();
                    JSONArray json = new JSONArray();

                    for (ObjectType objectType : objectTypes) {

                        boolean isAuthorized = permission.isAuthorized(objectType.getId(), "PUT",
                                user.getId(), GroupsUtils.getGroups(user));
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

    public String getCodiceBando(Folder call) {
        return call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString();
    }

    public String getCodiceBandoTruncated(Folder call) {
        String codiceBando = getCodiceBando(call);
        if (codiceBando.length() > 12)
            codiceBando = codiceBando.substring(0, 12);
        return codiceBando.trim();
    }

    private String createGroupCommissioneName(Folder call) {
        String codiceBando = getCodiceBandoTruncated(call);
        return "COMMISSIONE_".concat(codiceBando);
    }

    private String createGroupRdPName(Folder call) {
        String codiceBando = getCodiceBandoTruncated(call);
        return "RDP_".concat(codiceBando);
    }

    public String getCallGroupRdPName(Folder call) {
        return call.getProperty(JCONONPropertyIds.CALL_RDP.value()).getValueAsString();
    }

    public List<String> getGroupsCallToApplication(Folder call) {
        List<String> results = new ArrayList<String>();
        results.add("GROUP_" + call.getProperty(JCONONPropertyIds.CALL_COMMISSIONE.value()).getValueAsString());
        Folder macroCall = competitionService.getMacroCall(cmisService.createAdminSession(), call);
        if (macroCall != null) {
            results.add("GROUP_" + macroCall.getProperty(JCONONPropertyIds.CALL_COMMISSIONE.value()).getValueAsString());
        }
        return results;
    }

    public void isBandoInCorso(Folder call, CMISUser loginUser) {
        Calendar dtPubblBando = (Calendar) call.getPropertyValue(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value());
        Calendar dtScadenzaBando = (Calendar) call.getPropertyValue(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value());
        Calendar currDate = new GregorianCalendar();
        Boolean isBandoInCorso = Boolean.FALSE;
        if (dtScadenzaBando == null && dtPubblBando != null && dtPubblBando.before(currDate))
            isBandoInCorso = Boolean.TRUE;
        if (dtScadenzaBando != null && dtPubblBando != null && dtPubblBando.before(currDate) && dtScadenzaBando.after(currDate))
            isBandoInCorso = Boolean.TRUE;
        if (!isBandoInCorso && !loginUser.isAdmin())
            throw new ClientMessageException("message.error.bando.scaduto");
    }

    private void moveCall(Session cmisSession, GregorianCalendar dataInizioInvioDomande, Folder call) {
        String year = String.valueOf(dataInizioInvioDomande.get(Calendar.YEAR));
        String month = String.valueOf(dataInizioInvioDomande.get(Calendar.MONTH) + 1);
        Folder folderYear = folderService.createFolderFromPath(cmisSession, competitionService.getCompetition().getPath(), year);
        Folder folderMonth = folderService.createFolderFromPath(cmisSession, folderYear.getPath(), month);
        Folder callFolder = ((Folder) cmisSession.getObject(call.getId()));

        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteria.add(Restrictions.inTree(call.getId()));
        ItemIterable<QueryResult> applications = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        if (applications.getTotalNumItems() == 0 && !folderMonth.getId().equals(callFolder.getParentId())) {
            callFolder.move(new ObjectIdImpl(callFolder.getParentId()), folderMonth);
        }
    }

    public boolean isAlphaNumeric(String s){
        String pattern= "^[a-zA-Z0-9 .,-]*$";
        if(s.matches(pattern)){
            return true;
        }
        return false;   
    }
    
    private boolean existsProvvedimentoProrogaTermini (Session cmisSession, Folder call) {
        Criteria criteria = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_CALL_ABSTRACT.queryName());
        criteria.add(Restrictions.inFolder(call.getId()));
        ItemIterable<QueryResult> attachments = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
    	for (QueryResult queryResult : attachments) {
    		if (queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue().equals(JCONONDocumentType.JCONON_ATTACHMENT_CALL_CORRECTION.value())  ||
    				queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue().equals(JCONONDocumentType.JCONON_ATTACHMENT_CALL_CORRECTION_PROROGATION.value()) )
    			return true;
		}
    	return false;
    }
    
    public Folder save(Session cmisSession, BindingSession bindingSession, String contextURL, Locale locale, String userId,
                       Map<String, Object> properties, Map<String, Object> aspectProperties) {
        Folder call;
        properties.putAll(aspectProperties);
        String codiceBando = (String)properties.get(JCONONPropertyIds.CALL_CODICE.value());
        /**
         * Verifico inizialmente se sto in creazione del Bando
         */
        if (codiceBando == null)
            throw new ClientMessageException("message.error.required.codice");

        if (!isAlphaNumeric(codiceBando)) {
            throw new ClientMessageException("message.error.codice.not.valid");			
		}
        String name = BANDO_NAME.concat(codiceBando);
        if (properties.get(JCONONPropertyIds.CALL_SEDE.value()) != null)
            name = name.concat(" - ").
                    concat(properties.get(JCONONPropertyIds.CALL_SEDE.value()).toString());
        properties.put(PropertyIds.NAME, folderService.integrityChecker(name));
        GregorianCalendar dataInizioInvioDomande = (GregorianCalendar) properties.get(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value());
        Map<String, Object> otherProperties = new HashMap<String, Object>();
        if (properties.get(PropertyIds.OBJECT_ID) == null) {
            if (properties.get(PropertyIds.PARENT_ID) == null)
                properties.put(PropertyIds.PARENT_ID, competitionService.getCompetition().getId());
            call = (Folder) cmisSession.getObject(
                    cmisSession.createFolder(properties, new ObjectIdImpl((String) properties.get(PropertyIds.PARENT_ID))));
            aclService.setInheritedPermission(bindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);
            if (dataInizioInvioDomande != null && properties.get(PropertyIds.PARENT_ID) == null) {
            	moveCall(cmisSession, dataInizioInvioDomande, call);
            }
        } else {
            call = (Folder) cmisSession.getObject((String) properties.get(PropertyIds.OBJECT_ID));
        	CMISUser user = userService.loadUserForConfirm(userId);    	
            if ((Boolean)call.getPropertyValue(JCONONPropertyIds.CALL_PUBBLICATO.value()) && !(user.isAdmin() || isMemeberOfConcorsiGroup(user))) {
            	if (!existsProvvedimentoProrogaTermini(cmisSession, call))
            		throw new ClientMessageException("message.error.call.cannnot.modify");
            }            
            call.updateProperties(properties, true);
            if (!call.getParentId().equals(properties.get(PropertyIds.PARENT_ID)) && properties.get(PropertyIds.PARENT_ID) != null)
                call.move(call.getFolderParent(), new ObjectIdImpl((String) properties.get(PropertyIds.PARENT_ID)));

        }
        if (cmisSession.getObject(call.getParentId()).getType().getId().equals(call.getType().getId()))
            otherProperties.put(JCONONPropertyIds.CALL_HAS_MACRO_CALL.value(), true);
        else
            otherProperties.put(JCONONPropertyIds.CALL_HAS_MACRO_CALL.value(), false);
        List<Object> secondaryTypes = call.getProperty(PropertyIds.SECONDARY_OBJECT_TYPE_IDS).getValues();
        if (!typeService.hasSecondaryType(call, JCONONPolicyType.JCONON_MACRO_CALL.value())) {
            secondaryTypes.add(JCONONPolicyType.JCONON_CALL_SUBMIT_APPLICATION.value());
        } else {
            secondaryTypes.remove(JCONONPolicyType.JCONON_CALL_SUBMIT_APPLICATION.value());
        }
        otherProperties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, secondaryTypes);
        call.updateProperties(otherProperties);
        creaGruppoRdP(call, userId);
        
        Map<String, ACLType> aces = new HashMap<String, ACLType>();
        aces.put(GROUP_CONCORSI, ACLType.Coordinator);
        aclService.addAcl(bindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
        
        //reset cache
        cacheService.clearCacheWithName("nodeParentsCache");
        return call;
    }

    public void delete(Session cmisSession, String contextURL, String objectId,
                       String objectTypeId, String userId) {
        Folder call = (Folder) cmisSession.getObject(objectId);    	
    	CMISUser user = userService.loadUserForConfirm(userId);    	
        if ((Boolean)call.getPropertyValue(JCONONPropertyIds.CALL_PUBBLICATO.value()) && !(user.isAdmin() || isMemeberOfConcorsiGroup(user))) {
        	throw new ClientMessageException("message.error.call.cannnot.modify");
        }    	
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteria.add(Restrictions.ne(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), "I"));
        criteria.add(Restrictions.inTree(objectId));
        ItemIterable<QueryResult> applications = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        if (applications.getTotalNumItems() > 0)
            throw new ClientMessageException("message.error.call.cannot.delete");
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("Try to delete :" + objectId);
        call.deleteTree(true, UnfileObject.DELETE, true);
    }

    private boolean isCallAttachmentPresent(Session cmisSession, Folder source, JCONONDocumentType documentType) {
        Criteria criteria = CriteriaFactory.createCriteria(documentType.queryName());
        criteria.add(Restrictions.inFolder(source.getId()));
        if (criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext()).getTotalNumItems() == 0)
            return false;
        return true;
    }

    private void addACL(String principal, ACLType aclType, String nodeRef) {
        Map<String, ACLType> aces = new HashMap<String, ACLType>();
        aces.put(principal, aclType);
        aclService.addAcl(cmisService.getAdminSession(), nodeRef, aces);    	
    }
    
    private void addContibutorCommission(String groupName, String nodeRefCall) {
    	addACL("GROUP_" + groupName, ACLType.Contributor, nodeRefCall);
    }

    private void addCoordinatorRdp(String groupName, String nodeRefCall) {
    	addACL("GROUP_" + groupName, ACLType.Coordinator, nodeRefCall);
    }

    private void creaGruppoRdP(final Folder call, String userId) {
    	if (call.getPropertyValue(JCONONPropertyIds.CALL_RDP.value()) != null)
    		return;
        //Creazione del gruppo per i Responsabili del Procedimento
        final String groupRdPName = createGroupRdPName(call);
        try {
            String link = cmisService.getBaseURL().concat("service/cnr/groups/group");
            UrlBuilder url = new UrlBuilder(link);
            Response response = CmisBindingsHelper.getHttpInvoker(
            		cmisService.getAdminSession()).invokePOST(url, MimeTypes.JSON.mimetype(),
                    new Output() {
                        @Override
                        public void write(OutputStream out) throws Exception {
                        	String groupJson = "{";
                        	groupJson = groupJson.concat("\"parent_group_name\":\"" + GROUP_RDP_CONCORSO + "\",");
                        	groupJson = groupJson.concat("\"group_name\":\"" + groupRdPName + "\",");
                        	groupJson = groupJson.concat("\"display_name\":\"" + "RESPONSABILI BANDO [".concat((String) call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())) + "]\",");
                        	groupJson = groupJson.concat("\"zones\":[\"AUTH.ALF\",\"APP.DEFAULT\"]");                        	
                        	groupJson = groupJson.concat("}");
                        	out.write(groupJson.getBytes());
                        }
                    }, cmisService.getAdminSession());
            JSONObject jsonObject = new JSONObject(StringUtil.convertStreamToString(response.getStream()));            
            String nodeRefRdP = jsonObject.optString("nodeRef");
            if (nodeRefRdP == "")
            	return;
            /**
             * Aggiorno il bando con il NodeRef del gruppo commissione
             */
            Map<String, Object> propertiesRdP = new HashMap<String, Object>();
            propertiesRdP.put(JCONONPropertyIds.CALL_RDP.value(), groupRdPName);            
            call.updateProperties(propertiesRdP, true);
            /**
             * Il Gruppo dei responsabili del procedimento deve avere il controllo completo sul bando
             */
            addCoordinatorRdp(groupRdPName, 
            		call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString());
            Map<String, ACLType> acesGroup = new HashMap<String, ACLType>();
            acesGroup.put(userId, ACLType.FullControl);
            acesGroup.put(GROUP_CONCORSI, ACLType.FullControl);
            aclService.addAcl(cmisService.getAdminSession(), nodeRefRdP, acesGroup);
        } catch (Exception e) {
            LOGGER.error("ACL error", e);
        }    	
    }
    
    private void creaGruppoCommissione(final Folder call, String userId) {
    	if (call.getPropertyValue(JCONONPropertyIds.CALL_COMMISSIONE.value()) != null)
    		return;    	
        //Creazione del gruppo per la commissione di Concorso
        final String groupRdPName = getCallGroupRdPName(call);
        final String groupCommissioneName = createGroupCommissioneName(call);
        try {
            String link = cmisService.getBaseURL().concat("service/cnr/groups/group");
            UrlBuilder url = new UrlBuilder(link);
            Response response = CmisBindingsHelper.getHttpInvoker(
            		cmisService.getAdminSession()).invokePOST(url, MimeTypes.JSON.mimetype(),
                    new Output() {
                        @Override
                        public void write(OutputStream out) throws Exception {
                        	String groupJson = "{";
                        	groupJson = groupJson.concat("\"parent_group_name\":\"" + GROUP_COMMISSIONI_CONCORSO + "\",");
                        	groupJson = groupJson.concat("\"group_name\":\"" + groupCommissioneName + "\",");
                        	groupJson = groupJson.concat("\"display_name\":\"" + "COMMISSIONE BANDO [".concat((String) call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())) + "]\",");
                        	groupJson = groupJson.concat("\"zones\":[\"AUTH.ALF\",\"APP.DEFAULT\"]");
                        	groupJson = groupJson.concat("}");
                        	out.write(groupJson.getBytes());
                        }
                    }, cmisService.getAdminSession());
            JSONObject jsonObject = new JSONObject(StringUtil.convertStreamToString(response.getStream()));            
            String nodeRef = jsonObject.optString("nodeRef");
            if (nodeRef == "")
            	return;
            
            /**
             * Aggiorno il bando con il NodeRef del gruppo commissione
             */
            Map<String, Object> propertiesCommissione = new HashMap<String, Object>();
            propertiesCommissione.put(JCONONPropertyIds.CALL_COMMISSIONE.value(), groupCommissioneName);            
            call.updateProperties(propertiesCommissione, true);
            /**
             * Il Gruppo della Commissione deve avere il ruolo di contributor sul bando
             */
            addContibutorCommission(groupCommissioneName, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString());
            Map<String, ACLType> acesGroup = new HashMap<String, ACLType>();
            acesGroup.put(GROUP_CONCORSI, ACLType.FullControl);
            acesGroup.put("GROUP_" + groupRdPName, ACLType.FullControl);
            aclService.addAcl(cmisService.getAdminSession(), nodeRef, acesGroup);
        } catch (Exception e) {
            LOGGER.error("ACL error", e);
        }    	
    }
    
    public boolean isMemeberOfConcorsiGroup (CMISUser user) {
    	for (CMISGroup group : user.getGroups()) {
			if (group.getGroup_name().equalsIgnoreCase(GROUP_CONCORSI))
				return true;
		}
    	return false;
    }

    public boolean isMemeberOfRDPGroup(CMISUser user, Folder call) {
    	for (CMISGroup group : user.getGroups()) {
			if (group.getGroup_name().equalsIgnoreCase("GROUP_" + getCallGroupRdPName(call)))
				return true;
		}
    	return false;
    }

    public Folder publish(Session cmisSession, BindingSession currentBindingSession, String userId, String objectId, boolean publish,
                          String contextURL, Locale locale) {
        final Folder call = (Folder) cmisSession.getObject(objectId);        
        Map<String, ACLType> aces = new HashMap<String, ACLType>();
        aces.put(GROUP_CONCORSI, ACLType.Coordinator);
        aces.put(GROUP_EVERYONE, ACLType.Consumer);
    	CMISUser user = userService.loadUserForConfirm(userId);    	
        if (!publish && !(user.isAdmin() || isMemeberOfConcorsiGroup(user))) {
        	throw new ClientMessageException("message.error.call.cannnot.modify");
        }
        if (JCONONPolicyType.isIncomplete(call))
            throw new ClientMessageException("message.error.call.incomplete");

        if (call.getType().getId().equalsIgnoreCase(JCONONFolderType.JCONON_CALL_MOBILITY.value()) ||
                call.getType().getId().equalsIgnoreCase(JCONONFolderType.JCONON_CALL_MOBILITY_OPEN.value())) {
            if (!isCallAttachmentPresent(cmisSession, call, JCONONDocumentType.JCONON_ATTACHMENT_CALL_MOBILITY))
                throw new ClientMessageException("message.error.call.mobility.incomplete.attachment");
        } else {
            if (!isCallAttachmentPresent(cmisSession, call, JCONONDocumentType.JCONON_ATTACHMENT_CALL_IT))
                throw new ClientMessageException("message.error.call.incomplete.attachment");
        }
        GregorianCalendar dataInizioInvioDomande = (GregorianCalendar) call.getPropertyValue(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value());
        if (dataInizioInvioDomande != null && call.getParentId().equals(competitionService.getCompetition().getId())) {
        	moveCall(cmisSession, dataInizioInvioDomande, call);
        }        
        Map<String, Object> properties = new HashMap<String, Object>();
        properties.put(JCONONPropertyIds.CALL_PUBBLICATO.value(), publish);        
        if (publish) {
            creaGruppoCommissione(call, userId);
        	if (call.getPropertyValue(JCONONPropertyIds.CALL_ID_CATEGORIA_TECNICO_HELPDESK.value()) == null) {
                Integer idCategoriaCallType = helpdeskService.getCategoriaMaster(call.getType().getId());       	
            	Integer idCategoriaHelpDESK = helpdeskService.createCategoria(idCategoriaCallType, 
            			"BANDO " + getCodiceBandoTruncated(call), 
            			"BANDO " + call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()));
            	Integer idCategoriaTecnicoHelpDESK = helpdeskService.createCategoria(idCategoriaHelpDESK, "Problema Tecnico", "Problema Tecnico");
            	Integer idCategoriaNormativaHelpDESK = helpdeskService.createCategoria(idCategoriaHelpDESK, "Problema Normativo", "Problema Normativo");
                properties.put(JCONONPropertyIds.CALL_ID_CATEGORIA_TECNICO_HELPDESK.value(), idCategoriaTecnicoHelpDESK);        	
                properties.put(JCONONPropertyIds.CALL_ID_CATEGORIA_NORMATIVA_HELPDESK.value(), idCategoriaNormativaHelpDESK);        	        		
        	}
            aclService.addAcl(currentBindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
        } else {
            aclService.removeAcl(currentBindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
        }
        call.updateProperties(properties, true);
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
        List<String> secondaryTypes = ((List<String>) properties.get(PropertyIds.SECONDARY_OBJECT_TYPE_IDS));
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
                    String.valueOf(attachment.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue()));
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

    public JsonObject getJSONLabels(ObjectId objectId, Session cmisSession) {
		LOGGER.debug("loading json labels for " + objectId);
		String labelId = findAttachmentName(cmisSession, objectId.getId(), CallRepository.LABELS_JSON);
		if (labelId != null)
			return new JsonParser().parse(new InputStreamReader(cmisSession.getContentStream(new ObjectIdImpl(labelId)).getStream())).getAsJsonObject();
		return null;
	}

    public JsonObject storeDynamicLabels(ObjectId objectId, Session cmisSession, String key, String oldLabel, String newLabel, boolean delete) {
		LOGGER.debug("store dynamic labels for " + objectId);
		String labelId = callRepository.findAttachmentLabels(cmisSession, objectId.getId());
		ContentStreamImpl contentStream = new ContentStreamImpl();
		JsonObject labels = new JsonObject();
		if (labelId != null) {				
			contentStream = (ContentStreamImpl) cmisSession.getContentStream(new ObjectIdImpl(labelId));
			labels = new JsonParser().parse(new InputStreamReader(cmisSession.getContentStream(new ObjectIdImpl(labelId)).getStream())).getAsJsonObject();
		}
		if (delete) {
			labels.remove(key);
		} else {
			if (labels.has(key)) {
				JsonObject value = labels.get(key).getAsJsonObject();
				value.addProperty("newLabel", newLabel);
			} else {
				JsonObject value = new JsonObject();
				value.addProperty("oldLabel", oldLabel);
				value.addProperty("newLabel", newLabel);			
				labels.add(key, value);				
			}
		}
		contentStream.setStream(new ByteArrayInputStream(labels.toString().getBytes()));
		if (labelId != null) {
			((Document)cmisSession.getObject(labelId)).setContentStream(contentStream, true);				
		} else {
			contentStream.setMimeType("application/json");
			Map<String, Object> properties = new HashMap<String, Object>();
			properties.put(PropertyIds.NAME, CallRepository.LABELS_JSON);
			properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
			cmisSession.createDocument(properties,  objectId, contentStream, VersioningState.MAJOR);
		}
		callRepository.removeDynamicLabels(objectId.getId());
		return labels;
	}
    
	public Long convocazioni(Session session, BindingSession bindingSession, String contextURL, Locale locale, String userId, String callId, String tipoSelezione, String luogo, Calendar data, 
			String note, String firma, Integer numeroConvocazione, List<String> applicationsId) {
    	Folder call = (Folder) session.getObject(String.valueOf(callId));
    	if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
    		throw new ClientMessageException("message.error.call.cannnot.modify");
        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaApplications.add(Restrictions.inFolder((String) call.getPropertyValue(PropertyIds.OBJECT_ID)));
        criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue()));
        criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        applicationsId.stream().filter(string -> !string.isEmpty()).findAny().map(map -> criteriaApplications.add(Restrictions.in(PropertyIds.OBJECT_ID, applicationsId.toArray())));

        ItemIterable<QueryResult> applications = criteriaApplications.executeQuery(session, false, session.getDefaultContext());      
        for (QueryResult application : applications.getPage(Integer.MAX_VALUE)) {
        	Folder applicationObject = (Folder) session.getObject((String)application.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());        	
        	byte[]  bytes = printService.printConvocazione(session, applicationObject, contextURL, locale, TipoSelezione.valueOf(tipoSelezione).value(), luogo, data, note, firma);
        	String name = "CONV_" + applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value()) + " " +
        			applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value()) +
        			"_" + applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()) + "_" +
        			StrServ.lpad(String.valueOf(numeroConvocazione), 4)+ ".pdf";
        	Map<String, Object> properties = new HashMap<String, Object>();
    		properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_CONVOVCAZIONE.value());
    		properties.put(PropertyIds.NAME, name);    		
    		properties.put(JCONONPropertyIds.ATTACHMENT_USER.value(), applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
    		properties.put("jconon_convocazione:numero", numeroConvocazione);
    		properties.put("jconon_convocazione:stato", StatoConvocazione.GENERATO.name());
    		properties.put("jconon_convocazione:data", data);
    		properties.put("jconon_convocazione:luogo", luogo);
    		properties.put("jconon_convocazione:tipoSelezione", tipoSelezione);
    		properties.put("jconon_convocazione:email", applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value()));
    		properties.put("jconon_convocazione:email_pec", applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value()));
    		properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, 
    				Arrays.asList(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value(), 
    						JCONONPolicyType.JCONON_ATTACHMENT_FROM_RDP.value()));
    		
    		ContentStreamImpl contentStream = new ContentStreamImpl();
    		contentStream.setStream(new ByteArrayInputStream(bytes));
    		contentStream.setMimeType("application/pdf");
    		String documentPresentId = findAttachmentName(session, applicationObject.getId(), name);
    		if (documentPresentId == null) {
    			Document doc = applicationObject.createDocument(properties, contentStream, VersioningState.MAJOR);
    			aclService.setInheritedPermission(bindingSession, doc.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()), false);
    			Map<String, ACLType> acesGroup = new HashMap<String, ACLType>();
                acesGroup.put(GROUP_CONCORSI, ACLType.Coordinator);
                acesGroup.put("GROUP_" + getCallGroupRdPName(call), ACLType.Coordinator);
                aclService.addAcl(bindingSession, doc.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()), acesGroup);
    		} else {
    			Document doc = (Document) session.getObject(documentPresentId);
    			doc.updateProperties(properties);
    			doc.setContentStream(contentStream, true);
    		}
        }
		if (numeroConvocazione >= Optional.ofNullable(call.getPropertyValue("jconon_call:numero_convocazione")).map(map -> Integer.valueOf(map.toString())).orElse(1)) {
        	Map<String, Object> callProperties = new HashMap<String, Object>();
        	callProperties.put("jconon_call:numero_convocazione", numeroConvocazione);
        	call.updateProperties(callProperties);    			
		}        
        return applications.getTotalNumItems();
	}

	public Long firmaConvocazioni(Session session, BindingSession bindingSession, String query, String contexURL, String userId,  String userName, 
			String password, String otp, String firma) throws IOException {
		List<String> nodeRefs = new ArrayList<String>();
        ItemIterable<QueryResult> applications = session.query(query, false);
        for (QueryResult application : applications.getPage(Integer.MAX_VALUE)) {
        	nodeRefs.add(String.valueOf(application.getPropertyById(CoolPropertyIds.ALFCMIS_NODEREF.value()).getFirstValue()));
		}
        String link = cmisService.getBaseURL().concat("service/cnr/firma/convocazioni");
        UrlBuilder url = new UrlBuilder(link);

		JSONObject params = new JSONObject();
		params.put("nodes", nodeRefs);
		params.put("userName", userName);
		params.put("password", password);
		params.put("otp", otp);
		params.put("firma", firma);
		
		Response resp = CmisBindingsHelper.getHttpInvoker(bindingSession).invokePOST(url, MimeTypes.JSON.mimetype(),
				new Output() {
					@Override
					public void write(OutputStream out) throws Exception {
            			out.write(params.toString().getBytes());
            		}
        		}, bindingSession);
		int status = resp.getResponseCode();
		if (status == HttpStatus.SC_NOT_FOUND|| status == HttpStatus.SC_BAD_REQUEST|| status == HttpStatus.SC_INTERNAL_SERVER_ERROR ||status == HttpStatus.SC_CONFLICT) {
			JSONTokener tokenizer = new JSONTokener(resp.getErrorContent());
		    JSONObject jsonObject = new JSONObject(tokenizer);
		    String jsonMessage = jsonObject.getString("message");
			throw new ClientMessageException(errorSignMessage(jsonMessage));
		}        
		return applications.getTotalNumItems();
    }
	
	public Long inviaConvocazioni(Session session, BindingSession bindingSession, String query, String contexURL, String userId,  String callId, String userName, 
			String password) throws IOException {
		Folder call = (Folder)session.getObject(callId);		
        ItemIterable<QueryResult> convocazioni = session.query(query, false);
        long index = 0;
        for (QueryResult convocazione : convocazioni.getPage(Integer.MAX_VALUE)) {        	
        	Document convocazioneObject = (Document) session.getObject((String)convocazione.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
        	String contentURL = contexURL + "/rest/application/convocazione?nodeRef=" + convocazioneObject.getId();
        	String address = Optional.ofNullable(convocazioneObject.getProperty("jconon_convocazione:email_pec").getValueAsString()).orElse(convocazioneObject.getProperty("jconon_convocazione:email").getValueAsString());        	
        	if (env.acceptsProfiles(Profile.DEVELOPMENT.value())) {
            	address = env.getProperty("mail.to.error.message");        		
        	}
        	SimplePECMail simplePECMail = new SimplePECMail(userName, password);
        	simplePECMail.setHostName("smtps.pec.aruba.it");
        	simplePECMail.setSubject("[concorsi] " + i18NService.getLabel("subject-confirm-convocazione", Locale.ITALIAN, call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString()));
        	String content = "Con riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, " +
        			"Le inviamo il <a href=\""+contentURL+"\">link</a> per scaricare la sua convocazione, <br/>qualora non dovesse funzionare copi questo [" +contentURL+"] nella barra degli indirizzi del browser.<br/><br/><br/><hr/>";
        	content += "<b>Questo messaggio e' stato generato da un sistema automatico. Si prega di non rispondere.</b><br/><br/>";
        	simplePECMail.setContent(content, "text/html");
        	try {        		
            	simplePECMail.setFrom(userName);
            	simplePECMail.setReplyTo(Collections.singleton(new InternetAddress("undisclosed-recipients")));
            	simplePECMail.setTo(Collections.singleton(new InternetAddress(address)));
        		simplePECMail.send();
	        	Map<String, Object> properties = new HashMap<String, Object>();
	        	properties.put("jconon_convocazione:stato", StatoConvocazione.SPEDITO.name());
	        	convocazioneObject.updateProperties(properties);
	        	index++;
        	} catch (EmailException | AddressException e) {
        		LOGGER.error("Cannot send email to {}", address, e);
			}
		}
		return index;
    }	
	public String errorSignMessage(String messageException) {
	    if (messageException.contains("0001"))
	    	return "Errore generico nel processo di firma";
    	else if (messageException.contains("0002"))
    		return "Parametri non corretti per il tipo di trasporto indicato";
    	else if (messageException.contains("0003"))
    		return "Errore in fase di verifica delle credenziali";
    	else if (messageException.contains("0003"))
    		return "Errore in fase di verifica delle credenziali";
    	else if (messageException.contains("0004"))
    		return "Errore nel PIN";
    	else if (messageException.contains("0005"))
    		return "Tipo di trasporto non valido";
    	else if (messageException.contains("0006"))
    		return "Tipo di trasporto non autorizzato";
    	else if (messageException.contains("0007"))
    		return "Profilo Di firma PDF non valido";
    	else if (messageException.contains("0008"))
    		return "Impossibile completare l'operazione di marcatura temporale (es irraggiungibilit&agrave; del servizio, marche residue terminate, etc..)";
    	else if (messageException.contains("0009"))
    		return "Credenziali di delega non valide";
    	else if (messageException.contains("0010"))
    		return "Lo stato dell'utente non è valido (es. utente sospeso)";
	    return messageException;		
	}	
	
	public void extractionApplication(Session session, String query, String contextURL, String userId) throws IOException {
		List<String> ids = new ArrayList<>();
        ItemIterable<QueryResult> calls = session.query(query, false);
        for (QueryResult call : calls.getPage(Integer.MAX_VALUE)) {
            Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
            criteriaApplications.addColumn(PropertyIds.OBJECT_ID);
            criteriaApplications.add(Restrictions.inFolder((String) call.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue()));
            criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue()));
            ItemIterable<QueryResult> applications = criteriaApplications.executeQuery(session, false, session.getDefaultContext());           
            for (QueryResult application : applications.getPage(Integer.MAX_VALUE)) {
            	ids.add(String.valueOf(application.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue()));
            }            
		}
        CMISUser user = userService.loadUserForConfirm(userId);        
        PrintParameterModel parameter = new PrintParameterModel(contextURL, true);
        parameter.setIds(ids);
        parameter.setIndirizzoEmail(user.getEmail());
        parameter.setUserId(userId);
		queueService.queueApplicationsXLS().add(parameter);
	}	

	public Map<String, Object> extractionApplicationFromConvocazioni(Session session, String query, String contextURL, String userId) throws IOException {
		List<String> ids = new ArrayList<String>();
        ItemIterable<QueryResult> convocazioni = session.query(query, false);
        for (QueryResult convocazione : convocazioni.getPage(Integer.MAX_VALUE)) {
        	Document convocazioneDoc = (Document) session.getObject(String.valueOf(convocazione.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue()));
        	for (Folder application : convocazioneDoc.getParents()) {
        		ids.add(application.getId());
			}
		}
		String objectId = printService.extractionApplication(cmisService.createAdminSession(), 
				ids.stream().distinct().collect(Collectors.toList()), 
				contextURL, userId);
    	Map<String, Object> model = new HashMap<String, Object>();
		model.put("objectId", objectId);
		return model;

	}	
	
    public Map<String, Object> extractionApplicationForSingleCall(Session session, String query, String contexURL, String userId) throws IOException {
    	return printService.extractionApplicationForSingleCall(session, query, contexURL, userId);
    }	
    
    public void protocolApplication(Session session) throws Exception {
    	Calendar midNight = Calendar.getInstance();
    	midNight.set(Calendar.HOUR, 0);
    	midNight.set(Calendar.MINUTE, 0);
    	midNight.set(Calendar.SECOND, 0);
	    Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        criteria.add(Restrictions.le(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), ISO8601DATEFORMAT.format(Calendar.getInstance().getTime())));
        criteria.add(Restrictions.ge(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), ISO8601DATEFORMAT.format(midNight.getTime())));
	    ItemIterable<QueryResult> bandi = criteria.executeQuery(session, false, session.getDefaultContext());	
	    for (QueryResult queryResult : bandi.getPage(Integer.MAX_VALUE)) {
        	Folder call = (Folder) session.getObject((String)queryResult.getPropertyValueById(PropertyIds.OBJECT_ID));        	
	    	protocolApplication(session, call);
	    }
    }

    public void deleteApplicationInitial(Session session) throws Exception {
    	Calendar midNight = Calendar.getInstance();
    	midNight.set(Calendar.HOUR, 0);
    	midNight.set(Calendar.MINUTE, 0);
    	midNight.set(Calendar.SECOND, 0);
	    Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        criteria.add(Restrictions.le(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), ISO8601DATEFORMAT.format(Calendar.getInstance().getTime())));
        criteria.add(Restrictions.ge(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), ISO8601DATEFORMAT.format(midNight.getTime())));
	    ItemIterable<QueryResult> bandi = criteria.executeQuery(session, false, session.getDefaultContext());	
	    for (QueryResult queryResult : bandi.getPage(Integer.MAX_VALUE)) {
        	Folder call = (Folder) session.getObject((String)queryResult.getPropertyValueById(PropertyIds.OBJECT_ID));        	
        	Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
            criteriaDomande.add(Restrictions.inFolder(call.getId()));
            criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.INIZIALE.getValue()));
            ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(session, false, session.getDefaultContext());
            if (domande.getTotalNumItems() != 0 ) {
            	for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
                	Folder domanda = (Folder) session.getObject((String)queryResultDomande.getPropertyValueById(PropertyIds.OBJECT_ID));    
                	LOGGER.info("Delete application initial: {}", domanda.getName());
                	domanda.delete();                	
            	}            	
            }
	    }
    }
    
    public void protocolApplication(Session session, String statement, String userId) throws Exception {
    	CMISUser user = userService.loadUserForConfirm(userId);
    	if (!user.isAdmin())
    		return;
    	ItemIterable<QueryResult> calls = session.query(statement, false);
    	for (QueryResult queryResult : calls) {
        	Folder call = (Folder) session.getObject((String)queryResult.getPropertyValueById(PropertyIds.OBJECT_ID));   
        	protocolApplication(session, call);
		}
    }   
    
    public void protocolApplication(Session session, Folder call) throws Exception {
    	LOGGER.info("Start protocol application for call {}", call.getName());
    	Calendar dataFineDomande = (Calendar) call.getProperty(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value()).getFirstValue();
    	SecondaryType objectTypeProtocollo = (SecondaryType)session.getTypeDefinition("P:jconon_protocollo:common");
    	Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaDomande.add(Restrictions.inFolder(call.getId()));
        criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue()));
        criteriaDomande.addOrder(Order.asc(JCONONPropertyIds.APPLICATION_COGNOME.value()));
        ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(session, false, session.getDefaultContext());
        if (domande.getTotalNumItems() != 0 ) {
            long numProtocollo = protocolRepository.getNumProtocollo(ProtocolRepository.ProtocolRegistry.DOM.name(), String.valueOf(dataFineDomande.get(Calendar.YEAR)));
            try {
                for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
                	Folder domanda = (Folder) session.getObject((String)queryResultDomande.getPropertyValueById(PropertyIds.OBJECT_ID));        	
    				List<SecondaryType> secondaryTypes = domanda.getSecondaryTypes();
    				if (secondaryTypes.contains(objectTypeProtocollo))
    					continue;
                	numProtocollo++;
                	LOGGER.info("Start protocol application {} with protocol: {}", domanda.getName(), numProtocollo);
                	try {
        				printService.addProtocolToApplication(
        						(Document)session.getObject(competitionService.findAttachmentId(session, domanda.getId(), JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION)), 
        						numProtocollo, 
        						dataFineDomande.getTime());
        				Map<String, Object> properties = new HashMap<String, Object>();
        				List<String> secondaryTypesId = new ArrayList<String>();
        				for (SecondaryType secondaryType : secondaryTypes) {
        					secondaryTypesId.add(secondaryType.getId());
    					}
        				secondaryTypesId.add(objectTypeProtocollo.getId());
        				properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, secondaryTypesId);
        				properties.put("jconon_protocollo:numero", String.format("%7s", numProtocollo).replace(' ', '0'));
        				properties.put("jconon_protocollo:data", dataFineDomande);								
        				domanda.updateProperties(properties);				
        			} catch (IOException e) {
        				numProtocollo--;
        				LOGGER.error("Cannot add protocol to application", e);
        			}        	
                } 
            } catch(Exception _ex){
            	LOGGER.error("Cannot add protocol to application", _ex);
            } finally {
            	protocolRepository.putNumProtocollo(ProtocolRepository.ProtocolRegistry.DOM.name(), String.valueOf(dataFineDomande.get(Calendar.YEAR)), numProtocollo);
            }        	
        }
    }
}