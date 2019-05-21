package it.cnr.si.cool.jconon.service.call;


import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.*;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.rest.util.Util;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.StrServ;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.PermissionServiceImpl;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPolicyType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.dto.VerificaPECTask;
import it.cnr.si.cool.jconon.model.PrintParameterModel;
import it.cnr.si.cool.jconon.repository.CallRepository;
import it.cnr.si.cool.jconon.repository.ProtocolRepository;
import it.cnr.si.cool.jconon.rest.Call;
import it.cnr.si.cool.jconon.service.PrintService;
import it.cnr.si.cool.jconon.service.QueueService;
import it.cnr.si.cool.jconon.service.TypeService;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.service.cache.CompetitionFolderService;
import it.cnr.si.cool.jconon.service.helpdesk.HelpdeskService;
import it.cnr.si.cool.jconon.util.EnvParameter;
import it.cnr.si.cool.jconon.util.Profile;
import it.cnr.si.cool.jconon.util.SimplePECMail;
import it.cnr.si.cool.jconon.util.StatoComunicazione;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.Order;
import it.spasia.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.enums.*;
import org.apache.chemistry.opencmis.commons.exceptions.CmisRuntimeException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.mail.EmailAttachment;
import org.apache.commons.mail.EmailException;
import org.apache.commons.text.StrSubstitutor;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.inject.Inject;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Store;
import javax.mail.URLName;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.search.*;
import javax.mail.util.ByteArrayDataSource;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Call Service
 */
@Service
public class CallService {
    public static final String FINAL_APPLICATION = "Domande definitive",
            FINAL_SCHEDE = "Schede di valutazione";
    public static final String
            GROUP_COMMISSIONI_CONCORSO = "GROUP_COMMISSIONI_CONCORSO",
            GROUP_RDP_CONCORSO = "GROUP_RDP_CONCORSO",
            GROUP_CONCORSI = "GROUP_CONCORSI",
            GROUP_EVERYONE = "GROUP_EVERYONE";
    public static final String JCONON_ESCLUSIONE_STATO = "jconon_esclusione:stato";
    public static final String JCONON_COMUNICAZIONE_STATO = "jconon_comunicazione:stato";
    public static final SimpleDateFormat DATEFORMAT = new SimpleDateFormat("dd/MM/yyyy", Locale.ITALY);
    public static final SimpleDateFormat ISO8601DATEFORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.ITALY);
    private static final Logger LOGGER = LoggerFactory.getLogger(CallService.class);
    private static final String JCONON_CONVOCAZIONE_STATO = "jconon_convocazione:stato";
    public static final String GROUP_CONCORSI_RDP = "GROUP_CONCORSI_RDP";
    public static final String GROUP_CONCORSI_COMMISSIONE = "GROUP_CONCORSI_COMMISSIONE";
    @Autowired
    private CMISService cmisService;
    @Autowired
    private PermissionServiceImpl permission;
    @Autowired
    private I18nService i18NService;
    @Autowired
    private FolderService folderService;
    @Autowired
    private VersionService versionService;
    @Autowired
    private ACLService aclService;
    @Autowired
    private CommonsMultipartResolver resolver;
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

    @Deprecated
    public long findTotalNumApplication(Session cmisSession, Folder call) {
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.addColumn(PropertyIds.NAME);
        criteria.add(Restrictions.inTree(call.getId()));
        ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        return iterable.getTotalNumItems();
    }

    public long getTotalNumApplication(Session cmisSession, Folder macroCall, String userId, String statoDomanda) {
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
        criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
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
                criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.PROVVISORIA.getValue()));
                ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, cmisSession.getDefaultContext());

                for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
                    EmailMessage message = new EmailMessage();
                    List<String> emailList = new ArrayList<String>();
                    try {
                        CMISUser user = userService.loadUserForConfirm((String) queryResultDomande.getPropertyById(JCONONPropertyIds.APPLICATION_USER.value()).getFirstValue());
                        if (user != null && user.getEmail() != null) {
                            emailList.add(user.getEmail());

                            message.setRecipients(emailList);
                            message.setSubject(i18NService.getLabel("subject-info", Locale.ITALY) + i18NService.getLabel("subject-reminder-domanda", Locale.ITALY,
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
        return stringWithHtml
                .replace("&rsquo;", "'")
                .replace("&amp;", "'")
                .replaceAll("\\<.*?>", "")
                .replaceAll("\\&.*?\\;", "")
                .replace("\r\n", " ")
                .replace("\r", " ")
                .replace("\n", " ");
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
        return "COMMISSIONE_".concat(codiceBando).concat("_").concat(call.getId());
    }

    private String createGroupRdPName(Folder call) {
        String codiceBando = getCodiceBandoTruncated(call);
        return "RDP_".concat(codiceBando).concat("_").concat(call.getId());
    }

    public String getCallGroupRdPName(Folder call) {
        return call.getProperty(JCONONPropertyIds.CALL_RDP.value()).getValueAsString();
    }

    public String getCallGroupCommissioneName(Folder call) {
        return call.getProperty(JCONONPropertyIds.CALL_COMMISSIONE.value()).getValueAsString();
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

    public boolean isBandoInCorso(Folder call) {
        Calendar dtPubblBando = call.getPropertyValue(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value());
        Calendar dtScadenzaBando = call.getPropertyValue(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value());
        Calendar currDate = new GregorianCalendar();
        Boolean isBandoInCorso = Boolean.FALSE;
        if (dtScadenzaBando == null && dtPubblBando != null && dtPubblBando.before(currDate))
            isBandoInCorso = Boolean.TRUE;
        if (dtScadenzaBando != null && dtPubblBando != null && dtPubblBando.before(currDate) && dtScadenzaBando.after(currDate))
            isBandoInCorso = Boolean.TRUE;
        return isBandoInCorso;
    }

    public void isBandoInCorso(Folder call, CMISUser loginUser) {
        if (!isBandoInCorso(call) && !loginUser.isAdmin())
            throw new ClientMessageException("message.error.bando.scaduto");
    }


    private void moveCall(Session cmisSession, GregorianCalendar dataInizioInvioDomande, Folder call) {
        String year = String.valueOf(dataInizioInvioDomande.get(Calendar.YEAR));
        String month = String.valueOf(dataInizioInvioDomande.get(Calendar.MONTH) + 1);
        Folder folderYear = folderService.createFolderFromPath(cmisSession, competitionService.getCompetitionFolder().getString("path"), year);
        Folder folderMonth = folderService.createFolderFromPath(cmisSession, folderYear.getPath(), month);
        Folder callFolder = ((Folder) cmisSession.getObject(call.getId()));

        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        if (Boolean.valueOf(env.getProperty(EnvParameter.QUERY_INDEX_ENABLE, "true")))
            criteria.add(Restrictions.inTree(call.getId()));
        else
            criteria.add(Restrictions.inFolder(call.getId()));
        ItemIterable<QueryResult> applications = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        if (applications.getTotalNumItems() == 0 && !folderMonth.getId().equals(callFolder.getParentId())) {
            callFolder.move(new ObjectIdImpl(callFolder.getParentId()), folderMonth);
        }
    }

    public boolean isAlphaNumeric(String s) {
        String pattern = "^[a-zA-Z0-9 .,-]*$";
        return s.matches(pattern);
    }

    private boolean existsProvvedimentoProrogaTermini(Session cmisSession, Folder call) {
        Criteria criteria = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_CALL_ABSTRACT.queryName());
        criteria.add(Restrictions.inFolder(call.getId()));
        ItemIterable<QueryResult> attachments = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        for (QueryResult queryResult : attachments) {
            if (queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue().equals(JCONONDocumentType.JCONON_ATTACHMENT_CALL_CORRECTION.value()) ||
                    queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue().equals(JCONONDocumentType.JCONON_ATTACHMENT_CALL_CORRECTION_PROROGATION.value()))
                return true;
        }
        return false;
    }

    public Folder save(Session cmisSession, BindingSession bindingSession, String contextURL, Locale locale, String userId,
                       Map<String, Object> properties, Map<String, Object> aspectProperties) {
        Folder call;
        properties.putAll(aspectProperties);
        String codiceBando = (String) properties.get(JCONONPropertyIds.CALL_CODICE.value());
        /**
         * Verifico inizialmente se sto in creazione del Bando
         */
        if (codiceBando == null)
            throw new ClientMessageException("message.error.required.codice");

        if (!isAlphaNumeric(codiceBando)) {
            throw new ClientMessageException("message.error.codice.not.valid");
        }
        String name = Optional.ofNullable(i18NService.getLabel("call.name", locale)).orElse("").concat(codiceBando);
        if (properties.get(JCONONPropertyIds.CALL_SEDE.value()) != null)
            name = name.concat(" - ").
                    concat(properties.get(JCONONPropertyIds.CALL_SEDE.value()).toString());
        properties.put(PropertyIds.NAME, folderService.integrityChecker(name));
        GregorianCalendar dataInizioInvioDomande = (GregorianCalendar) properties.get(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value());
        Map<String, Object> otherProperties = new HashMap<String, Object>();
        if (properties.get(PropertyIds.OBJECT_ID) == null) {
            if (properties.get(PropertyIds.PARENT_ID) == null)
                properties.put(PropertyIds.PARENT_ID, competitionService.getCompetitionFolder().get("id"));
            call = (Folder) cmisSession.getObject(
                    cmisSession.createFolder(properties, new ObjectIdImpl((String) properties.get(PropertyIds.PARENT_ID))));
            aclService.setInheritedPermission(bindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);
            if (dataInizioInvioDomande != null && properties.get(PropertyIds.PARENT_ID) == null) {
                moveCall(cmisSession, dataInizioInvioDomande, call);
            }
        } else {
            call = (Folder) cmisSession.getObject((String) properties.get(PropertyIds.OBJECT_ID));
            CMISUser user = userService.loadUserForConfirm(userId);
            if ((Boolean) call.getPropertyValue(JCONONPropertyIds.CALL_PUBBLICATO.value()) && !(user.isAdmin() || isMemberOfConcorsiGroup(user))) {
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
        return call;
    }

    public void delete(Session cmisSession, String contextURL, String objectId,
                       String objectTypeId, String userId) {
        Folder call = (Folder) cmisSession.getObject(objectId);
        CMISUser user = userService.loadUserForConfirm(userId);
        if ((Boolean) call.getPropertyValue(JCONONPropertyIds.CALL_PUBBLICATO.value()) && !(user.isAdmin() || isMemberOfConcorsiGroup(user))) {
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

    protected boolean isCallAttachmentPresent(Session cmisSession, Folder source, JCONONDocumentType documentType) {
        Criteria criteria = CriteriaFactory.createCriteria(documentType.queryName());
        criteria.add(Restrictions.inFolder(source.getId()));
        return criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext()).getTotalNumItems() != 0;
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

    protected void creaGruppoRdP(final Folder call, String userId) {
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
                            groupJson = groupJson.concat("\"display_name\":\"" + "RESPONSABILI BANDO [".concat(call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())) + "]\",");
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
                            groupJson = groupJson.concat("\"display_name\":\"" + "COMMISSIONE BANDO [".concat(call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())) + "]\",");
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

    public boolean isMemberOfConcorsiGroup(CMISUser user) {
        return user.getGroups()
                .stream()
                .map(CMISGroup::getGroup_name)
                .anyMatch(s -> s.equalsIgnoreCase(GROUP_CONCORSI));
    }

    public boolean isMemberOfRDPGroup(CMISUser user, Folder call) {
        return user.getGroups()
                .stream()
                .map(CMISGroup::getGroup_name)
                .anyMatch(s -> s.equalsIgnoreCase("GROUP_" + getCallGroupRdPName(call)) ||
                        s.equalsIgnoreCase(GROUP_CONCORSI_RDP));
    }

    public boolean isMemberOfCommissioneGroup(CMISUser user, Folder call) {
        return user.getGroups()
                .stream()
                .map(CMISGroup::getGroup_name)
                .anyMatch(s -> s.equalsIgnoreCase("GROUP_" + getCallGroupCommissioneName(call))||
                        s.equalsIgnoreCase(GROUP_CONCORSI_COMMISSIONE));
    }

    public Folder publish(Session cmisSession, BindingSession currentBindingSession, String userId, String objectId, boolean publish,
                          String contextURL, Locale locale) {
        final Folder call = (Folder) cmisSession.getObject(objectId);
        CMISUser user = userService.loadUserForConfirm(userId);
        if (!(user.isAdmin() || isMemberOfConcorsiGroup(user) || call.getPropertyValue(PropertyIds.CREATED_BY).equals(userId)))
            throw new ClientMessageException("message.error.call.cannot.publish");

        Map<String, ACLType> aces = new HashMap<String, ACLType>();
        aces.put(GROUP_EVERYONE, ACLType.Consumer);
        GregorianCalendar dataInizioInvioDomande = call.getPropertyValue(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value());
        if (!publish && !(user.isAdmin() || isMemberOfConcorsiGroup(user))) {
            if (!dataInizioInvioDomande.after(Calendar.getInstance()))
                throw new ClientMessageException("message.error.call.cannot.publish");
        }
        if (JCONONPolicyType.isIncomplete(call))
            throw new ClientMessageException("message.error.call.incomplete");

        if (call.getType().getId().equalsIgnoreCase(JCONONFolderType.JCONON_CALL_MOBILITY.value()) ||
                call.getType().getId().equalsIgnoreCase(JCONONFolderType.JCONON_CALL_MOBILITY_OPEN.value())) {
            if (!isCallAttachmentPresent(cmisSession, call, JCONONDocumentType.JCONON_ATTACHMENT_CALL_MOBILITY)) {
                throw new ClientMessageException("message.error.call.mobility.incomplete.attachment");
            }
        } else if (call.getType().getId().equalsIgnoreCase(JCONONFolderType.JCONON_CALL_MAN_INTESESSE.value())) {
            if (!isCallAttachmentPresent(cmisSession, call, JCONONDocumentType.JCONON_ATTACHMENT_CALL_MANIFESTAZIONE_INTERESSE)) {
                throw new ClientMessageException("message.error.call.man.intesse.incomplete.attachment");
            }
        } else {
            if (!isCallAttachmentPresent(cmisSession, call, JCONONDocumentType.JCONON_ATTACHMENT_CALL_IT))
                throw new ClientMessageException("message.error.call.incomplete.attachment");
        }
        if (dataInizioInvioDomande != null && call.getParentId().equals(competitionService.getCompetitionFolder().get("id"))) {
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
            aces.put(GROUP_CONCORSI, ACLType.Coordinator);
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
        String name = i18NService.getLabel("call.name", locale).concat(properties.get(JCONONPropertyIds.CALL_CODICE.value()).toString());
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
            Document newDocument = child.createDocument(initialProperties, attachmentFile.getContentStream(), VersioningState.MAJOR);
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
            ((Document) cmisSession.getObject(labelId)).setContentStream(contentStream, true);
        } else {
            contentStream.setMimeType("application/json");
            Map<String, Object> properties = new HashMap<String, Object>();
            properties.put(PropertyIds.NAME, CallRepository.LABELS_JSON);
            properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
            cmisSession.createDocument(properties, objectId, contentStream, VersioningState.MAJOR);
        }
        callRepository.removeDynamicLabels(objectId.getId());
        return labels;
    }

    public Long convocazioni(Session session, BindingSession bindingSession, String contextURL, Locale locale, String userId, String callId, String tipoSelezione,
                             String luogo, Calendar data, boolean testoLibero, String note, String firma, Integer numeroConvocazione, List<String> applicationsId) {
        Folder call = (Folder) session.getObject(String.valueOf(callId));
        if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
            throw new ClientMessageException("message.error.call.cannnot.modify");
        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaApplications.add(Restrictions.inFolder(call.getPropertyValue(PropertyIds.OBJECT_ID)));
        criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        applicationsId.stream().filter(string -> !string.isEmpty()).findAny().map(map -> criteriaApplications.add(Restrictions.in(PropertyIds.OBJECT_ID, applicationsId.toArray())));
        long index = 0;
        ItemIterable<QueryResult> applications = criteriaApplications.executeQuery(session, false, session.getDefaultContext());
        for (QueryResult application : applications.getPage(Integer.MAX_VALUE)) {
            Folder applicationObject = (Folder) session.getObject((String) application.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            StrSubstitutor sub = formatPlaceHolder(applicationObject, applicationObject.getFolderParent());

            byte[] bytes = printService.printConvocazione(session, applicationObject, contextURL, locale,
                    Optional.ofNullable(tipoSelezione)
                            .map(s -> call.<String>getPropertyValue(s))
                            .map(s -> maleFemale(s, " il ", " la ") + s + maleFemale(s, " previsto ", " prevista "))
                            .orElse(null), luogo, data, testoLibero, sub.replace(note), firma);
            String name = "CONV_" + applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value()) + " " +
                    applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value()) +
                    "_" + applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()) + "_" +
                    StrServ.lpad(String.valueOf(numeroConvocazione), 4) + ".pdf";
            Map<String, Object> properties = new HashMap<String, Object>();
            properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_CONVOVCAZIONE.value());
            properties.put(PropertyIds.NAME, name);
            properties.put(JCONONPropertyIds.ATTACHMENT_USER.value(), applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
            properties.put("jconon_convocazione:numero", numeroConvocazione);
            properties.put("jconon_convocazione:stato", StatoComunicazione.GENERATO.name());
            properties.put("jconon_convocazione:data", data);
            properties.put("jconon_convocazione:luogo", luogo);
            properties.put("jconon_convocazione:tipoSelezione", Optional.ofNullable(tipoSelezione)
                    .map(s -> call.<String>getPropertyValue(s)).orElse(null));
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
                index++;
                Document doc = applicationObject.createDocument(properties, contentStream, VersioningState.MAJOR);
                aclService.setInheritedPermission(bindingSession, doc.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()), false);
                Map<String, ACLType> acesGroup = new HashMap<String, ACLType>();
                acesGroup.put(GROUP_CONCORSI, ACLType.Coordinator);
                acesGroup.put("GROUP_" + getCallGroupRdPName(call), ACLType.Coordinator);
                aclService.addAcl(bindingSession, doc.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()), acesGroup);
            } else {
                Document doc = (Document) session.getObject(documentPresentId);
                if (doc.getPropertyValue("jconon_convocazione:stato").equals(StatoComunicazione.GENERATO.name())) {
                    index++;
                    doc.updateProperties(properties);
                    doc.setContentStream(contentStream, true);
                }
            }
        }
        if (numeroConvocazione >= Optional.ofNullable(call.getPropertyValue("jconon_call:numero_convocazione")).map(map -> Integer.valueOf(map.toString())).orElse(1)) {
            Map<String, Object> callProperties = new HashMap<String, Object>();
            callProperties.put("jconon_call:numero_convocazione", numeroConvocazione);
            call.updateProperties(callProperties);
        }
        return index;
    }

    private String maleFemale(String source, String male, String female) {
        return source.toUpperCase().endsWith("O") ? male : female;
    }

    public Long esclusioni(Session session, BindingSession bindingSession, String contextURL, Locale locale, String userId, String callId,
                           String note, String firma, List<String> applicationsId, String query, boolean stampaPunteggi) {
        Folder call = (Folder) session.getObject(String.valueOf(callId));
        if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
            throw new ClientMessageException("message.error.call.cannnot.modify");

        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaApplications.add(Restrictions.inFolder(call.getPropertyValue(PropertyIds.OBJECT_ID)));
        criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        applicationsId.stream().filter(string -> !string.isEmpty()).findAny().map(map -> criteriaApplications.add(Restrictions.in(PropertyIds.OBJECT_ID, applicationsId.toArray())));

        long result = 0;
        ItemIterable<QueryResult> applications;
        if (applicationsId.stream().filter(string -> !string.isEmpty()).findAny().filter(s -> s.length() > 0).isPresent()) {
            applications = criteriaApplications.executeQuery(session, false, session.getDefaultContext());
        } else {
            applications = session.query(query, false, session.getDefaultContext());
        }
        for (QueryResult application : applications.getPage(Integer.MAX_VALUE)) {
            Folder applicationObject = (Folder) session.getObject((String) application.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            List<String> proveConseguite = new ArrayList<String>();
            boolean flPunteggioTitoli = Optional.ofNullable(applicationObject.<Boolean>getPropertyValue("jconon_application:fl_punteggio_titoli")).orElse(false),
                    flPunteggioScritto = Optional.ofNullable(applicationObject.<Boolean>getPropertyValue("jconon_application:fl_punteggio_scritto")).orElse(false),
                    flPunteggioSecondoScritto = Optional.ofNullable(applicationObject.<Boolean>getPropertyValue("jconon_application:fl_punteggio_secondo_scritto")).orElse(false),
                    flPunteggioColloquio = Optional.ofNullable(applicationObject.<Boolean>getPropertyValue("jconon_application:fl_punteggio_colloquio")).orElse(false),
                    flPunteggioProvaPratica = Optional.ofNullable(applicationObject.<Boolean>getPropertyValue("jconon_application:fl_punteggio_prova_pratica")).orElse(false);
            result++;
            if (flPunteggioTitoli)
                proveConseguite.add(call.getPropertyValue("jconon_call:punteggio_1"));
            if (flPunteggioScritto)
                proveConseguite.add(call.getPropertyValue("jconon_call:punteggio_2"));
            if (flPunteggioSecondoScritto)
                proveConseguite.add(call.getPropertyValue("jconon_call:punteggio_3"));
            if (flPunteggioColloquio)
                proveConseguite.add(call.getPropertyValue("jconon_call:punteggio_4"));
            if (flPunteggioProvaPratica)
                proveConseguite.add(call.getPropertyValue("jconon_call:punteggio_5"));

            StrSubstitutor sub = formatPlaceHolder(applicationObject, applicationObject.getFolderParent());

            byte[] bytes = printService.printEsclusione(session, applicationObject, contextURL, locale,
                    stampaPunteggi, sub.replace(note), firma, proveConseguite.stream().collect(Collectors.joining(", ")));


            String name = "ESCLUSIONE_" + applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value()) + " " +
                    applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value()) +
                    "_" + applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()) +
                    "_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss")) +
                    ".pdf";

            Map<String, Object> properties = new HashMap<String, Object>();
            properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_ESCLUSIONE.value());
            properties.put(PropertyIds.NAME, name);
            properties.put(JCONONPropertyIds.ATTACHMENT_USER.value(), applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
            properties.put(JCONON_ESCLUSIONE_STATO, StatoComunicazione.GENERATO.name());
            properties.put("jconon_esclusione:email", applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value()));
            properties.put("jconon_esclusione:email_pec", applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value()));
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
        return result;
    }

    private StrSubstitutor formatPlaceHolder(Folder application, Folder call) {
        final Map<String, String> collect = Stream.concat(application.getProperties().stream(), call.getProperties().stream())
                .filter(property -> !call.getBaseType().getPropertyDefinitions().keySet().contains(property.getId()))
                .collect(Collectors.toMap(Property::getId, property -> {
                    if (Optional.ofNullable(property.getValueAsString()).isPresent()) {
                        if (property.getDefinition().getPropertyType().equals(PropertyType.DATETIME)) {
                            return DATEFORMAT.format(property.<Calendar>getValue().getTime());
                        } else if (property.getDefinition().getPropertyType().equals(PropertyType.DECIMAL)) {
                            return NumberFormat.getNumberInstance(Locale.ITALIAN).format(property.<BigDecimal>getValue());
                        } else {
                            return property.getValueAsString();
                        }
                    }
                    return "";
                }));
        return new StrSubstitutor(collect, "[[", "]]");
    }

    public Long comunicazioni(Session session, BindingSession bindingSession, String contextURL, Locale locale, String userId, String callId,
                              String note, String firma, List<String> applicationsId, String filtersProvvisorieInviate) {
        Folder call = (Folder) session.getObject(String.valueOf(callId));
        if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
            throw new ClientMessageException("message.error.call.cannnot.modify");

        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaApplications.add(Restrictions.inTree(call.getPropertyValue(PropertyIds.OBJECT_ID)));
        if (Optional.ofNullable(filtersProvvisorieInviate).isPresent() && !filtersProvvisorieInviate.equalsIgnoreCase("tutte") &&
                !filtersProvvisorieInviate.equalsIgnoreCase("attive") && !filtersProvvisorieInviate.equalsIgnoreCase("escluse")) {
            criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), filtersProvvisorieInviate));
        }
        if (Optional.ofNullable(filtersProvvisorieInviate).isPresent() && filtersProvvisorieInviate.equalsIgnoreCase("attive")) {
            criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
            criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        }
        if (Optional.ofNullable(filtersProvvisorieInviate).isPresent() && filtersProvvisorieInviate.equalsIgnoreCase("escluse")) {
            criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
            criteriaApplications.add(Restrictions.isNotNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        }
        applicationsId.stream().filter(string -> !string.isEmpty()).findAny().map(map -> criteriaApplications.add(Restrictions.in(PropertyIds.OBJECT_ID, applicationsId.toArray())));

        long result = 0;
        ItemIterable<QueryResult> applications = criteriaApplications.executeQuery(session, false, session.getDefaultContext());
        for (QueryResult application : applications.getPage(Integer.MAX_VALUE)) {
            Folder applicationObject = (Folder) session.getObject((String) application.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            StrSubstitutor sub = formatPlaceHolder(applicationObject, applicationObject.getFolderParent());

            byte[] bytes = printService.printComunicazione(session, applicationObject, contextURL, locale, sub.replace(note), firma);
            String name = "COMUNICAZIONE_" + applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value()) + " " +
                    applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value()) +
                    "_" + applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()) +
                    "_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss")) +
                    ".pdf";
            result++;
            Map<String, Object> properties = new HashMap<String, Object>();
            properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_COMUNICAZIONE.value());
            properties.put(PropertyIds.NAME, name);
            properties.put(JCONONPropertyIds.ATTACHMENT_USER.value(), applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
            properties.put(JCONON_COMUNICAZIONE_STATO, StatoComunicazione.GENERATO.name());
            properties.put("jconon_comunicazione:email", applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value()));
            properties.put("jconon_comunicazione:email_pec", applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value()));
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
        return result;
    }

    public Long eliminaAllegatiGeneratiSullaDomanda(Session session, String query, String userId) throws IOException {
        ItemIterable<QueryResult> applications = session.query(query, false);
        long result = 0;
        for (QueryResult document : applications.getPage(Integer.MAX_VALUE)) {
            try {
                String stato = Optional.ofNullable(document.<String>getPropertyValueById(JCONON_COMUNICAZIONE_STATO))
                        .orElse(Optional.ofNullable(document.<String>getPropertyValueById(JCONON_ESCLUSIONE_STATO))
                                .orElse(Optional.ofNullable(document.<String>getPropertyValueById(JCONON_CONVOCAZIONE_STATO)).orElse(null)));
                if (Optional.ofNullable(stato).isPresent() &&
                        (stato.equalsIgnoreCase(StatoComunicazione.GENERATO.name()) || stato.equalsIgnoreCase(StatoComunicazione.FIRMATO.name()))) {
                    session.delete(new ObjectIdImpl(document.<String>getPropertyValueById(PropertyIds.OBJECT_ID)));
                    result++;
                }
            } catch (CmisRuntimeException _ex) {
                LOGGER.error("Impossibile eliminare il documento con id: {} tramite l'utente {}",
                        document.getPropertyValueById(PropertyIds.OBJECT_ID), userId, _ex);
            }
        }
        return result;
    }

    public Long firma(Session session, BindingSession bindingSession, String query, String contexURL, String userId, String userName,
                      String password, String otp, String firma, String property, String description) throws IOException {
        List<String> nodeRefs = new ArrayList<String>();
        ItemIterable<QueryResult> applications = session.query(query, false);
        long result = 0;
        for (QueryResult queryResult : applications.getPage(Integer.MAX_VALUE)) {
            String stato = Optional.ofNullable(queryResult.<String>getPropertyValueById(property)).orElse(null);
            if (Optional.ofNullable(stato).isPresent() && stato.equalsIgnoreCase(StatoComunicazione.GENERATO.name())) {
                nodeRefs.add(String.valueOf(queryResult.getPropertyById(CoolPropertyIds.ALFCMIS_NODEREF.value()).getFirstValue()));
                result++;
            }
        }
        String link = cmisService.getBaseURL().concat("service/cnr/firma/convocazioni");
        UrlBuilder url = new UrlBuilder(link);

        JSONObject params = new JSONObject();
        params.put("nodes", nodeRefs);
        params.put("userName", userName);
        params.put("password", password);
        params.put("otp", otp);
        params.put("firma", firma);
        params.put("property", property);
        params.put("description", description);


        Response resp = CmisBindingsHelper.getHttpInvoker(bindingSession).invokePOST(url, MimeTypes.JSON.mimetype(),
                new Output() {
                    @Override
                    public void write(OutputStream out) throws Exception {
                        out.write(params.toString().getBytes());
                    }
                }, bindingSession);
        int status = resp.getResponseCode();
        if (status == HttpStatus.SC_NOT_FOUND || status == HttpStatus.SC_BAD_REQUEST || status == HttpStatus.SC_INTERNAL_SERVER_ERROR || status == HttpStatus.SC_CONFLICT) {
            JSONTokener tokenizer = new JSONTokener(resp.getErrorContent());
            JSONObject jsonObject = new JSONObject(tokenizer);
            String jsonMessage = jsonObject.getString("message");
            throw new ClientMessageException(errorSignMessage(jsonMessage));
        }
        return result;
    }

    public void verifyPEC(VerificaPECTask verificaPECTask) {
        Properties props = new Properties();
        props.put("mail.imap.host", "imaps.pec.aruba.it");
        props.put("mail.imap.auth", true);
        props.put("mail.imap.ssl.enable", true);
        props.put("mail.imap.port", 995);
        props.put("mail.imap.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.imap.connectiontimeout", 5000);
        props.put("mail.imap.timeout", 5000);
        final javax.mail.Session session = javax.mail.Session.getInstance(props);
        URLName urlName = new URLName("imaps://imaps.pec.aruba.it");
        Store store = null;
        javax.mail.Folder folder = null;
        try {
            store = session.getStore(urlName);
            store.connect(verificaPECTask.getUserName(), verificaPECTask.getPassword());
            folder = store.getFolder("INBOX");
            folder.open(javax.mail.Folder.READ_ONLY);
            SearchTerm searchTerm = new SubjectTerm("CONSEGNA: " + verificaPECTask.getOggetto());
            List<Message> messages = Arrays.asList(folder.search(searchTerm))
                    .stream()
                    .sorted(Comparator.comparing(o -> {
                        try {
                            return o.getReceivedDate();
                        } catch (MessagingException e) {
                            return null;
                        }
                    })).collect(Collectors.toList());
            for (Message message : messages) {
                final String subjectMessage = message.getSubject();
                Optional<String> cmisObjectId = Optional.of(message.getSubject()).
                        map(subject -> subject.indexOf("$$")).
                        filter(index -> index > -1)
                        .map(index -> subjectMessage.substring(index + 3));
                if (cmisObjectId.isPresent()) {
                    final Date receivedDate = message.getReceivedDate();
                    LOGGER.info("Trovata Convocazione sulla PEC con id: {}", cmisObjectId.get());
                    if (Optional.ofNullable(verificaPECTask.getSendDate())
                            .map(date -> date.before(receivedDate))
                            .orElse(Boolean.TRUE)) {
                        CmisObject cmisObject = cmisService.createAdminSession().getObject(cmisObjectId.get());
                        if (Optional.ofNullable(cmisObject.getPropertyValue(verificaPECTask.getPropertyName()))
                                .filter(x -> x.equals(StatoComunicazione.SPEDITO.name())).isPresent()) {
                            Map<String, Object> properties = new HashMap<String, Object>();
                            properties.put(verificaPECTask.getPropertyName(),
                                    subjectMessage.startsWith("AVVISO DI MANCATA CONSEGNA") ?
                                            StatoComunicazione.NON_CONSEGNATO.name() : StatoComunicazione.CONSEGNATO.name());
                            cmisObject.updateProperties(properties);
                        }
                    }
                }
            }
        } catch (MessagingException e) {
            LOGGER.error("ERROR while SCAN PEC MAIL", e);
        } finally {
            Optional.ofNullable(folder).ifPresent(x -> {
                try {
                    x.close(true);
                } catch (Exception e) {
                    LOGGER.error("CANNOT CLOSE FOLDER", e);
                }
            });
            Optional.ofNullable(store).ifPresent(x -> {
                try {
                    x.close();
                } catch (Exception e) {
                    LOGGER.error("CANNOT CLOSE FOLDER", e);
                }
            });

        }
    }

    public Long inviaConvocazioni(Session session, BindingSession bindingSession, String query, String contexURL, String userId,
                                  String callId, String userName, String password, Call.AddressType addressFromApplication) throws IOException {
        Folder call = (Folder) session.getObject(callId);
        ItemIterable<QueryResult> convocazioni = session.query(query, false);
        long index = 0;
        String subject = i18NService.getLabel("subject-info", Locale.ITALIAN) +
                i18NService.getLabel("subject-confirm-convocazione", Locale.ITALIAN,
                        call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString());
        for (QueryResult convocazione : convocazioni.getPage(Integer.MAX_VALUE)) {
            Document convocazioneObject = (Document) session.getObject((String) convocazione.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            String contentURL = contexURL + "/rest/application/convocazione?nodeRef=" + convocazioneObject.getId();
            String address = obtainAddress(convocazioneObject,
                    "jconon_convocazione:email_pec",
                    "jconon_convocazione:email",
                    addressFromApplication);

            SimplePECMail simplePECMail = new SimplePECMail(userName, password);
            simplePECMail.setHostName("smtps.pec.aruba.it");
            simplePECMail.setSubject(subject + " $$ " + convocazioneObject.getId());
            String content = "Con riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, si invia in allegato la relativa convocazione.<br>" +
                    "Per i candidati che non hanno indicato in domanda un indirizzo PEC o che non lo hanno comunicato in seguito, e' richiesta conferma di ricezione della presente cliccando sul seguente <a href=\"" + contentURL + "\">link</a> , <br/>qualora non dovesse funzionare copi questo [" + contentURL + "] nella barra degli indirizzi del browser.<br/>";
            content += "Distinti saluti.<br/><br/><br/><hr/>";
            content += "<b>Questo messaggio e' stato generato da un sistema automatico. Si prega di non rispondere.</b><br/><br/>";
            try {
                simplePECMail.setFrom(userName);
                simplePECMail.setReplyTo(Collections.singleton(new InternetAddress("undisclosed-recipients")));
                simplePECMail.setTo(Collections.singleton(new InternetAddress(address)));
                simplePECMail.attach(new ByteArrayDataSource(new ByteArrayInputStream(content.getBytes()),
                        "text/html"), "", "", EmailAttachment.INLINE);
                simplePECMail.attach(new ByteArrayDataSource(convocazioneObject.getContentStream().getStream(),
                                convocazioneObject.getContentStreamMimeType()),
                        convocazioneObject.getName(), convocazioneObject.getName());
                simplePECMail.send();
                Map<String, Object> properties = new HashMap<String, Object>();
                properties.put(JCONON_CONVOCAZIONE_STATO, StatoComunicazione.SPEDITO.name());
                convocazioneObject.updateProperties(properties);
                index++;
            } catch (EmailException | AddressException e) {
                LOGGER.error("Cannot send email to {}", address, e);
            }
        }
        callRepository.verificaPECTask(userName, password, subject, JCONON_CONVOCAZIONE_STATO);
        return index;
    }

    public Long inviaEsclusioni(Session session, BindingSession bindingSession, String query, String contexURL,
                                String userId, String callId, String userName, String password, Call.AddressType addressFromApplication) throws IOException {
        Folder call = (Folder) session.getObject(callId);
        ItemIterable<QueryResult> esclusioni = session.query(query, false);
        String subject = i18NService.getLabel("subject-info", Locale.ITALIAN) +
                i18NService.getLabel("subject-confirm-esclusione",
                        Locale.ITALIAN,
                        call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString());
        long index = 0;
        for (QueryResult esclusione : esclusioni.getPage(Integer.MAX_VALUE)) {
            Document esclusioneObject = (Document) session.getObject((String) esclusione.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            String address = obtainAddress(esclusioneObject,
                    "jconon_esclusione:email_pec",
                    "jconon_esclusione:email",
                    addressFromApplication);

            SimplePECMail simplePECMail = new SimplePECMail(userName, password);
            simplePECMail.setHostName("smtps.pec.aruba.it");
            simplePECMail.setSubject(subject + " $$ " + esclusioneObject.getId());
            String content = "Con riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, si invia in allegato la relativa esclusione.<br>";
            content += "Distinti saluti.<br/><br/><br/><hr/>";
            content += "<b>Questo messaggio e' stato generato da un sistema automatico. Si prega di non rispondere.</b><br/><br/>";
            try {
                simplePECMail.setFrom(userName);
                simplePECMail.setReplyTo(Collections.singleton(new InternetAddress("undisclosed-recipients")));
                simplePECMail.setTo(Collections.singleton(new InternetAddress(address)));
                simplePECMail.attach(new ByteArrayDataSource(new ByteArrayInputStream(content.getBytes()),
                        "text/html"), "", "", EmailAttachment.INLINE);
                simplePECMail.attach(new ByteArrayDataSource(esclusioneObject.getContentStream().getStream(),
                                esclusioneObject.getContentStreamMimeType()),
                        esclusioneObject.getName(), esclusioneObject.getName());
                simplePECMail.send();
                Map<String, Object> properties = new HashMap<String, Object>();
                properties.put(JCONON_ESCLUSIONE_STATO, StatoComunicazione.SPEDITO.name());
                esclusioneObject.updateProperties(properties);
                index++;
            } catch (EmailException | AddressException e) {
                LOGGER.error("Cannot send email to {}", address, e);
            }
        }
        callRepository.verificaPECTask(userName, password, subject, JCONON_ESCLUSIONE_STATO);
        return index;
    }

    public List<String> inviaAllegato(Session session, BindingSession bindingSession, String objectId, String contexURL, String userId, String callId, String userName,
                                      String password) throws IOException {
        List<String> result = new ArrayList<String>();
        Folder call = (Folder) session.getObject(callId);
        Document doc = (Document) session.getObject(objectId);
        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaApplications.add(Restrictions.inFolder(call.getPropertyValue(PropertyIds.OBJECT_ID)));
        criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        ItemIterable<QueryResult> attive = criteriaApplications.executeQuery(session, false, session.getDefaultContext());
        for (QueryResult domanda : attive.getPage(Integer.MAX_VALUE)) {
            Folder domandaObject = (Folder) session.getObject((String) domanda.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            String address = Optional.ofNullable(domandaObject.getProperty(JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value()).getValueAsString()).
                    orElse(domandaObject.getProperty(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value()).getValueAsString());
            if (env.acceptsProfiles(Profile.DEVELOPMENT.value())) {
                address = env.getProperty("mail.to.error.message");
            }
            SimplePECMail simplePECMail = new SimplePECMail(userName, password);
            simplePECMail.setHostName("smtps.pec.aruba.it");
            simplePECMail.setSubject(i18NService.getLabel("subject-info", Locale.ITALIAN) + i18NService.getLabel("subject-confirm-comunicazione", Locale.ITALIAN, call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString()));
            String content = "Con riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, si invia in allegato il provvedimento contenente \"" + doc.getType().getDisplayName() + "\"<br>";
            content += "Distinti saluti.<br/><br/><br/><hr/>";
            content += "<b>Questo messaggio e' stato generato da un sistema automatico. Si prega di non rispondere.</b><br/><br/>";
            try {
                simplePECMail.setFrom(userName);
                simplePECMail.setReplyTo(Collections.singleton(new InternetAddress("undisclosed-recipients")));
                simplePECMail.setTo(Collections.singleton(new InternetAddress(address)));
                simplePECMail.attach(new ByteArrayDataSource(new ByteArrayInputStream(content.getBytes()),
                        "text/html"), "", "", EmailAttachment.INLINE);
                simplePECMail.attach(new ByteArrayDataSource(doc.getContentStream().getStream(),
                                doc.getContentStreamMimeType()),
                        doc.getName(), doc.getName());
                simplePECMail.send();
                result.add(address);
            } catch (EmailException | AddressException e) {
                LOGGER.error("Cannot send email to {}", address, e);
            }
        }
        return result;
    }

    private String obtainAddress(Document document, String propertyEmailPec, String propertyEmail, Call.AddressType fromApplication) {
        String address = Optional.ofNullable(document.getProperty(propertyEmailPec).getValueAsString())
                .orElse(document.getProperty(propertyEmail).getValueAsString());
        if (address == null || !fromApplication.equals(Call.AddressType.DOC)) {
            address = document.getParents()
                    .stream()
                    .filter(folder -> folder.getFolderType().getId().equals(JCONONFolderType.JCONON_APPLICATION.value()))
                    .map(application -> Optional.ofNullable(application.getProperty(
                            fromApplication.equals(Call.AddressType.PEC) ? JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value() :
                                    JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value()
                    ).getValueAsString()).orElse(application.getProperty(
                            JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value()
                    ).getValueAsString())).findFirst().get();
        }
        if (env.acceptsProfiles(Profile.DEVELOPMENT.value())) {
            address = env.getProperty("mail.to.error.message");
        }
        return address;
    }

    public Long inviaComunicazioni(Session session, BindingSession bindingSession, String query, String contexURL, String userId,
                                   String callId, String userName, String password, Call.AddressType addressFromApplication) throws IOException {
        Folder call = (Folder) session.getObject(callId);
        String subject = i18NService.getLabel("subject-info", Locale.ITALIAN) +
                i18NService.getLabel("subject-confirm-comunicazione",
                        Locale.ITALIAN,
                        call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString());
        ItemIterable<QueryResult> comunicazioni = session.query(query, false);
        long index = 0;
        for (QueryResult comunicazione : comunicazioni.getPage(Integer.MAX_VALUE)) {
            Document comunicazioneObject = (Document) session.getObject((String) comunicazione.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            String address = obtainAddress(comunicazioneObject,
                    "jconon_comunicazione:email_pec",
                    "jconon_comunicazione:email",
                    addressFromApplication);

            SimplePECMail simplePECMail = new SimplePECMail(userName, password);
            simplePECMail.setHostName("smtps.pec.aruba.it");
            simplePECMail.setSubject(subject + " $$ " + comunicazioneObject.getId());
            String content = "Con riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, si invia in allegato la relativa comunicazione.<br>";
            content += "Distinti saluti.<br/><br/><br/><hr/>";
            content += "<b>Questo messaggio e' stato generato da un sistema automatico. Si prega di non rispondere.</b><br/><br/>";
            try {
                simplePECMail.setFrom(userName);
                simplePECMail.setReplyTo(Collections.singleton(new InternetAddress("undisclosed-recipients")));
                simplePECMail.setTo(Collections.singleton(new InternetAddress(address)));
                simplePECMail.attach(new ByteArrayDataSource(new ByteArrayInputStream(content.getBytes()),
                        "text/html"), "", "", EmailAttachment.INLINE);
                simplePECMail.attach(new ByteArrayDataSource(comunicazioneObject.getContentStream().getStream(),
                                comunicazioneObject.getContentStreamMimeType()),
                        comunicazioneObject.getName(), comunicazioneObject.getName());
                simplePECMail.send();
                Map<String, Object> properties = new HashMap<String, Object>();
                properties.put(JCONON_COMUNICAZIONE_STATO, StatoComunicazione.SPEDITO.name());
                comunicazioneObject.updateProperties(properties);
                index++;
            } catch (EmailException | AddressException e) {
                LOGGER.error("Cannot send email to {}", address, e);
            }
        }
        callRepository.verificaPECTask(userName, password, subject, JCONON_COMUNICAZIONE_STATO);
        return index;
    }

    public String errorSignMessage(String messageException) {
        if (messageException.contains("0001"))
            return "Errore generico nel processo di firma";
        else if (messageException.contains("0002"))
            return "Parametri non corretti per il tipo di trasporto indicato";
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

    public Map<String, Object> extractionApplication(Session session, String query, String type, String queryType, String contextURL, String userId) throws IOException {
        List<String> ids = new ArrayList<>();
        Map<String, Object> result = new HashMap<>();
        ItemIterable<QueryResult> queryResults = session.query(query, false);
        for (QueryResult queryResult : queryResults.getPage(Integer.MAX_VALUE)) {
            if (Optional.ofNullable(queryType).filter(s -> s.equals("call")).isPresent()) {
                if (!queryResult.getAllowableActions().getAllowableActions().contains(Action.CAN_CREATE_DOCUMENT)) {
                    continue;
                }
            }
            ids.add(queryResult.getPropertyValueById(PropertyIds.OBJECT_ID));
        }
        CMISUser user = userService.loadUserForConfirm(userId);
        PrintParameterModel parameter = new PrintParameterModel(contextURL, true);
        parameter.setIds(ids);
        parameter.setType(type);
        parameter.setQueryType(queryType);
        parameter.setIndirizzoEmail(user.getEmail());
        parameter.setUserId(userId);
        if (queryType.equalsIgnoreCase("application")) {
            result.put("objectId", printService.extractionApplication(
                    session,
                    ids,
                    type,
                    queryType,
                    contextURL,
                    userId));
        } else {
            queueService.queueApplicationsXLS().add(parameter);
        }
        return result;
    }

    public void visualizzaSchedeNonAnonime(Session session, String id, Locale locale, String contextURL, CMISUser user) throws IOException {
        PrintParameterModel parameter = new PrintParameterModel(contextURL, true);
        parameter.setIds(Arrays.asList(id));
        parameter.setIndirizzoEmail(user.getEmail());
        parameter.setUserId(user.getUserName());
        queueService.queueApplicationsSchedaNonAnonima().add(parameter);
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
                ids.stream().distinct().collect(Collectors.toList()), null, null,
                contextURL, userId);
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("objectId", objectId);
        return model;

    }

    public Map<String, Object> extractionApplicationForSingleCall(Session session, String query, String contexURL, String userId) throws IOException {
        return printService.extractionApplicationForSingleCall(session, query, contexURL, userId);
    }

    public Map<String, Object> extractionApplicationForPunteggi(Session session, String callId, String contexURL, String userId) throws IOException {
        return printService.extractionApplicationForPunteggi(session, callId, contexURL, userId);
    }

    public Long importEsclusioniFirmate(Session session, HttpServletRequest req, CMISUser user) throws IOException, ParseException {
        final String userId = user.getId();
        long index = 0;
        MultipartHttpServletRequest mRequest = resolver.resolveMultipart(req);
        String idCall = mRequest.getParameter("callId");
        String tipo = mRequest.getParameter("tipo");
        Calendar calDataProtocollo = Calendar.getInstance();
        Date dataProtocollo = StringUtil.CMIS_DATEFORMAT.parse(
                mRequest.getParameter(JCONONPropertyIds.PROTOCOLLO_DATA.value())
        );
        calDataProtocollo.setTime(dataProtocollo);
        String numeroProtocollo = mRequest.getParameter(JCONONPropertyIds.PROTOCOLLO_NUMERO.value());

        MultipartFile file = mRequest.getFile("file");
        if (!Optional.ofNullable(mRequest.getParameterValues("application")).isPresent())
            throw new ClientMessageException("Bisogna selezionare almeno una domanda!");
        List<String> applications = Arrays.asList(mRequest.getParameterValues("application"));
        for (String application : applications) {
            Folder applicationObject = (Folder) session.getObject(application);
            Map<String, Object> properties = new HashMap<String, Object>();
            properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_ESCLUSIONE.value());
            properties.put(PropertyIds.NAME, file.getOriginalFilename());
            properties.put(JCONONPropertyIds.ATTACHMENT_USER.value(), applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
            properties.put(JCONON_ESCLUSIONE_STATO, StatoComunicazione.FIRMATO.name());
            properties.put("jconon_esclusione:email", applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value()));
            properties.put("jconon_esclusione:email_pec", applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value()));
            properties.put(JCONONPropertyIds.PROTOCOLLO_NUMERO.value(), numeroProtocollo);
            properties.put(JCONONPropertyIds.PROTOCOLLO_DATA.value(), calDataProtocollo);

            properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
                    Arrays.asList(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value(),
                            JCONONPolicyType.JCONON_ATTACHMENT_FROM_RDP.value(),
                            JCONONPolicyType.JCONON_PROTOCOLLO.value()));

            ContentStreamImpl contentStream = new ContentStreamImpl();
            contentStream.setStream(file.getInputStream());
            contentStream.setMimeType("application/pdf");
            applicationObject.createDocument(properties, contentStream, VersioningState.MAJOR);


            Map<String, Serializable> propertiesApplication = new HashMap<String, Serializable>();
            propertiesApplication.put("jconon_application:esclusione_rinuncia", tipo.equalsIgnoreCase("RINUNCIA") ? "R" : "E");
            cmisService.createAdminSession().getObject(applicationObject).updateProperties(propertiesApplication);
            Map<String, ACLType> acesToRemove = new HashMap<String, ACLType>();
            List<String> groups = getGroupsCallToApplication(applicationObject.getFolderParent());
            for (String group : groups) {
                acesToRemove.put(group, ACLType.Contributor);
            }
            aclService.removeAcl(cmisService.getAdminSession(),
                    applicationObject.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), acesToRemove);
            index++;
        }
        return index;
    }

    public String impostaPunteggio(Folder call, Map<String, PropertyDefinition<?>> propertyDefinitions,
                                   Map<String, Object> properties, BigDecimal punteggio,
                                   String propertyCallPunteggio, String propertyCallPunteggioMin, String propertyCallPunteggioLimite,
                                   String propertyApplicationPunteggio, String propertyApplicationFlPunteggio) {
        if (Optional.ofNullable(punteggio).isPresent()) {
            final String labelPunteggio = Optional.ofNullable(call.<String>getPropertyValue(propertyCallPunteggio))
                    .orElse((String) propertyDefinitions.get(propertyCallPunteggio).getDefaultValue().get(0));
            final BigDecimal punteggioMin = Optional.ofNullable(call.<String>getPropertyValue(propertyCallPunteggioMin))
                    .map(s -> Integer.valueOf(s))
                    .map(integer -> BigDecimal.valueOf(integer))
                    .orElseThrow(() -> new ClientMessageException("Il punteggio minimo di ammissione per [" + labelPunteggio + "] non è stato impostato!"));
            final BigDecimal punteggioLimite = Optional.ofNullable(call.<String>getPropertyValue(propertyCallPunteggioLimite))
                    .map(s -> Integer.valueOf(s))
                    .map(integer -> BigDecimal.valueOf(integer))
                    .orElseThrow(() -> new ClientMessageException("Il punteggio massimo di ammissione per [" + labelPunteggio + "] non è stato impostato!"));
            if (punteggio.compareTo(punteggioLimite) > 0)
                throw new ClientMessageException("Il punteggio [" + punteggio + "] relativo a [" + labelPunteggio + "] supera il massimo ["+ punteggioLimite + "]");

            properties.put(propertyApplicationPunteggio, NumberFormat.getNumberInstance(Locale.ITALIAN).format(punteggio));
            final Boolean nonAmmesso = convertIntToBoolean(punteggioMin.compareTo(punteggio));
            properties.put(propertyApplicationFlPunteggio, nonAmmesso);
            if (nonAmmesso)
                return "<p>Candidato non ammesso a [<b>" + labelPunteggio + "</b>]</p>";
        } else {
            properties.put(propertyApplicationPunteggio, null);
            properties.put(propertyApplicationFlPunteggio, Boolean.FALSE);
        }
        return "";
    }

    private Boolean convertIntToBoolean(int i) {
        return i > 0 ? Boolean.TRUE : Boolean.FALSE;
    }

    public Map<String, Object> importApplicationForPunteggi(Session session, HttpServletRequest req, CMISUser user) throws IOException {
        final String userId = user.getId();
        MultipartHttpServletRequest mRequest = resolver.resolveMultipart(req);
        String idCall = mRequest.getParameter("objectId");
        LOGGER.debug("Import application for call: {}", idCall);

        Folder callObject = Optional.ofNullable(session.getObject(idCall))
                    .filter(Folder.class::isInstance)
                    .map(Folder.class::cast)
                    .orElseThrow(() -> new ClientMessageException("Call not found with id:" + idCall));

        if (!isMemberOfRDPGroup(user, callObject) && !user.isAdmin()) {
            LOGGER.error("USER:" + userId + " try to importApplicationForPunteggi for call:" + idCall);
            throw new ClientMessageException("USER:" + userId + " try to importApplicationForPunteggi for call:" + idCall);
        }
        Session adminSession = cmisService.createAdminSession();

        MultipartFile file = mRequest.getFile("xls");
        HSSFWorkbook workbook = new HSSFWorkbook(file.getInputStream());
        int indexRow = 0;
        try {
            HSSFSheet sheet = workbook.getSheetAt(0);
            for (Iterator<Row> iterator = sheet.iterator(); iterator.hasNext(); ) {
                Row row = iterator.next();
                if (indexRow != 0) {
                    String idDomanda = row.getCell(0).getStringCellValue();
                    Folder domanda = Optional.ofNullable(adminSession.getObject(idDomanda))
                            .filter(Folder.class::isInstance)
                            .map(Folder.class::cast)
                            .orElseThrow(() -> new ClientMessageException("Domanda non trovata alla riga:" + String.valueOf(row.getRowNum())));
                    final Map<String, PropertyDefinition<?>> propertyDefinitions = session.getTypeDefinition("P:jconon_call:aspect_punteggi").getPropertyDefinitions();
                    Map<String, Object> properties = new HashMap<String, Object>();

                    List<Object> aspects = domanda.getProperty(PropertyIds.SECONDARY_OBJECT_TYPE_IDS).getValues();
                    aspects.add(JCONONPolicyType.JCONON_APPLICATION_PUNTEGGI.value());
                    properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, aspects);

                    final AtomicInteger startCell = new AtomicInteger(8);

                    BigDecimal punteggioTitoli =
                            Optional.ofNullable(callObject.<String>getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_1))
                            .filter(s1 -> !s1.equalsIgnoreCase(PrintService.VUOTO))
                            .map(s1 -> {
                                return Optional.ofNullable(row.getCell(startCell.getAndIncrement()))
                                        .map(cell -> getCellValue(cell))
                                        .filter(s -> s.length() > 0)
                                        .map(s -> getBigDecimal(s))
                                        .orElse(null);
                            }).orElse(null);
                    BigDecimal punteggioProvaScritta =
                            Optional.ofNullable(callObject.<String>getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_2))
                                    .filter(s1 -> !s1.equalsIgnoreCase(PrintService.VUOTO))
                                    .map(s1 -> {
                                        return Optional.ofNullable(row.getCell(startCell.getAndIncrement()))
                                                .map(cell -> getCellValue(cell))
                                                .filter(s -> s.length() > 0)
                                                .map(s -> getBigDecimal(s))
                                                .orElse(null);
                                    }).orElse(null);
                    BigDecimal punteggioSecondProvaScritta =
                            Optional.ofNullable(callObject.<String>getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_3))
                                    .filter(s1 -> !s1.equalsIgnoreCase(PrintService.VUOTO))
                                    .map(s1 -> {
                                        return Optional.ofNullable(row.getCell(startCell.getAndIncrement()))
                                                .map(cell -> getCellValue(cell))
                                                .filter(s -> s.length() > 0)
                                                .map(s -> getBigDecimal(s))
                                                .orElse(null);
                                    }).orElse(null);
                    BigDecimal punteggioColloquio =
                            Optional.ofNullable(callObject.<String>getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_4))
                                    .filter(s1 -> !s1.equalsIgnoreCase(PrintService.VUOTO))
                                    .map(s1 -> {
                                        return Optional.ofNullable(row.getCell(startCell.getAndIncrement()))
                                                .map(cell -> getCellValue(cell))
                                                .filter(s -> s.length() > 0)
                                                .map(s -> getBigDecimal(s))
                                                .orElse(null);
                                    }).orElse(null);
                    BigDecimal punteggioProvaPratica =
                            Optional.ofNullable(callObject.<String>getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_5))
                                    .filter(s1 -> !s1.equalsIgnoreCase(PrintService.VUOTO))
                                    .map(s1 -> {
                                        return Optional.ofNullable(row.getCell(startCell.getAndIncrement()))
                                                .map(cell -> getCellValue(cell))
                                                .filter(s -> s.length() > 0)
                                                .map(s -> getBigDecimal(s))
                                                .orElse(null);
                                    }).orElse(null);
                    //Salto un collonna pdove c'è il totale punteggio
                    startCell.getAndIncrement();
                    BigInteger
                            graduatoria =
                            Optional.ofNullable(row.getCell(startCell.getAndIncrement()))
                                    .map(cell -> getCellValue(cell))
                                    .filter(s -> s.length() > 0)
                                    .map(s -> BigInteger.valueOf(Double.valueOf(s).longValue()))
                                    .orElse(null);

                    Optional.ofNullable(row.getCell(startCell.getAndIncrement()))
                            .map(cell -> getCellValue(cell))
                            .filter(s -> Arrays.asList("V","I","S", "").indexOf(s) != -1)
                            .ifPresent(s -> {
                                properties.put(JCONONPropertyIds.APPLICATION_ESITO_CALL.value(), s);
                            });
                    Optional.ofNullable(row.getCell(startCell.getAndIncrement()))
                            .map(cell -> getCellValue(cell))
                            .ifPresent(s -> {
                                properties.put("jconon_application:punteggio_note", s);
                            });

                    properties.put("jconon_application:graduatoria", graduatoria);
                    impostaPunteggio(callObject, propertyDefinitions, properties, punteggioTitoli,
                            PrintService.JCONON_CALL_PUNTEGGIO_1, "jconon_call:punteggio_1_min", "jconon_call:punteggio_1_limite",
                            "jconon_application:punteggio_titoli", "jconon_application:fl_punteggio_titoli");

                    impostaPunteggio(callObject, propertyDefinitions, properties, punteggioProvaScritta,
                            PrintService.JCONON_CALL_PUNTEGGIO_2, "jconon_call:punteggio_2_min", "jconon_call:punteggio_2_limite",
                            "jconon_application:punteggio_scritto", "jconon_application:fl_punteggio_scritto");
                    impostaPunteggio(callObject, propertyDefinitions, properties, punteggioSecondProvaScritta,
                            PrintService.JCONON_CALL_PUNTEGGIO_3, "jconon_call:punteggio_3_min", "jconon_call:punteggio_3_limite",
                            "jconon_application:punteggio_secondo_scritto", "jconon_application:fl_punteggio_secondo_scritto");
                    impostaPunteggio(callObject, propertyDefinitions, properties, punteggioColloquio,
                            PrintService.JCONON_CALL_PUNTEGGIO_4, "jconon_call:punteggio_4_min", "jconon_call:punteggio_4_limite",
                            "jconon_application:punteggio_colloquio", "jconon_application:fl_punteggio_colloquio");
                    impostaPunteggio(callObject, propertyDefinitions, properties, punteggioProvaPratica,
                            PrintService.JCONON_CALL_PUNTEGGIO_5, "jconon_call:punteggio_5_min", "jconon_call:punteggio_5_limite",
                            "jconon_application:punteggio_prova_pratica", "jconon_application:fl_punteggio_prova_pratica");
                    final BigDecimal totalePunteggio = Arrays.asList(
                            Optional.ofNullable(punteggioTitoli).orElse(BigDecimal.ZERO),
                            Optional.ofNullable(punteggioProvaScritta).orElse(BigDecimal.ZERO),
                            Optional.ofNullable(punteggioSecondProvaScritta).orElse(BigDecimal.ZERO),
                            Optional.ofNullable(punteggioColloquio).orElse(BigDecimal.ZERO),
                            Optional.ofNullable(punteggioProvaPratica).orElse(BigDecimal.ZERO)
                    ).stream().reduce(BigDecimal.ZERO, BigDecimal::add);
                    properties.put("jconon_application:totale_punteggio", totalePunteggio);

                    domanda.updateProperties(properties);
                }
                indexRow++;
            }
        } catch (Exception _ex) {
            LOGGER.error("error call {} user {}", idCall, userId, _ex);
            throw new ClientMessageException(_ex.getMessage());
        } finally {
            workbook.close();
        }
        return Collections.singletonMap("righe", indexRow - 1);
    }

    private BigDecimal getBigDecimal(String s) {
        try {
            return BigDecimal.valueOf(NumberFormat.getNumberInstance(Locale.ITALIAN).parse(s.replace('.',',')).doubleValue());
        } catch (ParseException e) {
            throw new ClientMessageException("Numero non valido [" + s + "]");
        }
    }

    private String getCellValue(Cell cell) {
        return cell.getCellType() == Cell.CELL_TYPE_NUMERIC ? String.valueOf(cell.getNumericCellValue()): cell.getStringCellValue();
    }

    private Boolean convertFromString(String s) {
        if (s.equalsIgnoreCase("S") || s.equalsIgnoreCase("Y"))
            return Boolean.TRUE;
        return null;
    }


    public void protocolApplication(Session session) {
        Calendar midNight = Calendar.getInstance();
        midNight.set(Calendar.HOUR, 0);
        midNight.set(Calendar.MINUTE, 0);
        midNight.set(Calendar.SECOND, 0);
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        criteria.add(Restrictions.le(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), ISO8601DATEFORMAT.format(Calendar.getInstance().getTime())));
        criteria.add(Restrictions.ge(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), ISO8601DATEFORMAT.format(midNight.getTime())));
        ItemIterable<QueryResult> bandi = criteria.executeQuery(session, false, session.getDefaultContext());
        for (QueryResult queryResult : bandi.getPage(Integer.MAX_VALUE)) {
            Folder call = (Folder) session.getObject((String) queryResult.getPropertyValueById(PropertyIds.OBJECT_ID));
            protocolApplication(session, call);
        }
    }

    public void deleteApplicationInitial(Session session) {
        Calendar midNight = Calendar.getInstance();
        midNight.set(Calendar.HOUR, 0);
        midNight.set(Calendar.MINUTE, 0);
        midNight.set(Calendar.SECOND, 0);
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        criteria.add(Restrictions.le(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), ISO8601DATEFORMAT.format(Calendar.getInstance().getTime())));
        criteria.add(Restrictions.ge(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), ISO8601DATEFORMAT.format(midNight.getTime())));
        ItemIterable<QueryResult> bandi = criteria.executeQuery(session, false, session.getDefaultContext());
        for (QueryResult queryResult : bandi.getPage(Integer.MAX_VALUE)) {
            Folder call = (Folder) session.getObject((String) queryResult.getPropertyValueById(PropertyIds.OBJECT_ID));
            Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
            criteriaDomande.add(Restrictions.inFolder(call.getId()));
            criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.INIZIALE.getValue()));
            ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(session, false, session.getDefaultContext());
            if (domande.getTotalNumItems() != 0) {
                for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
                    Folder domanda = (Folder) session.getObject((String) queryResultDomande.getPropertyValueById(PropertyIds.OBJECT_ID));
                    LOGGER.info("Delete application initial: {}", domanda.getName());
                    domanda.delete();
                }
            }
        }
    }

    public void protocolApplication(Session session, String statement, String userId) {
        CMISUser user = userService.loadUserForConfirm(userId);
        if (!user.isAdmin())
            return;
        ItemIterable<QueryResult> calls = session.query(statement, false);
        for (QueryResult queryResult : calls) {
            Folder call = (Folder) session.getObject((String) queryResult.getPropertyValueById(PropertyIds.OBJECT_ID));
            protocolApplication(session, call);
        }
    }

    public void protocolApplication(Session session, Folder call) {
        LOGGER.info("Start protocol application for call {}", call.getName());
        Calendar dataFineDomande = (Calendar) call.getProperty(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value()).getFirstValue();
        SecondaryType objectTypeProtocollo = (SecondaryType) session.getTypeDefinition("P:jconon_protocollo:common");
        Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaDomande.add(Restrictions.inTree(call.getId()));
        criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaDomande.addOrder(Order.asc(JCONONPropertyIds.APPLICATION_COGNOME.value()));
        ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(session, false, session.getDefaultContext());
        if (domande.getTotalNumItems() != 0) {
            long numProtocollo = protocolRepository.getNumProtocollo(ProtocolRepository.ProtocolRegistry.DOM.name(), String.valueOf(dataFineDomande.get(Calendar.YEAR)));
            try {
                for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
                    Folder domanda = (Folder) session.getObject((String) queryResultDomande.getPropertyValueById(PropertyIds.OBJECT_ID));
                    List<SecondaryType> secondaryTypes = domanda.getSecondaryTypes();
                    if (secondaryTypes.contains(objectTypeProtocollo))
                        continue;
                    numProtocollo++;
                    LOGGER.info("Start protocol application {} with protocol: {}", domanda.getName(), numProtocollo);
                    try {
                        printService.addProtocolToApplication(
                                (Document) session.getObject(competitionService.findAttachmentId(session, domanda.getId(), JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION)),
                                numProtocollo,
                                dataFineDomande.getTime());
                        Map<String, Object> properties = new HashMap<String, Object>();
                        List<String> secondaryTypesId = new ArrayList<String>();
                        for (SecondaryType secondaryType : secondaryTypes) {
                            secondaryTypesId.add(secondaryType.getId());
                        }
                        secondaryTypesId.add(objectTypeProtocollo.getId());
                        properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, secondaryTypesId);
                        properties.put(JCONONPropertyIds.PROTOCOLLO_NUMERO.value(), String.format("%7s", numProtocollo).replace(' ', '0'));
                        properties.put(JCONONPropertyIds.PROTOCOLLO_DATA.value(), dataFineDomande);
                        domanda.updateProperties(properties);
                    } catch (IOException e) {
                        numProtocollo--;
                        LOGGER.error("Cannot add protocol to application", e);
                    }
                }
            } catch (Exception _ex) {
                LOGGER.error("Cannot add protocol to application", _ex);
            } finally {
                protocolRepository.putNumProtocollo(ProtocolRepository.ProtocolRegistry.DOM.name(), String.valueOf(dataFineDomande.get(Calendar.YEAR)), numProtocollo);
            }
        }
    }

    public void graduatoria(Session currentCMISSession, String idCall, Locale locale, String contextURL, CMISUser user) {
        final String userId = user.getId();
        Folder call = (Folder) currentCMISSession.getObject(idCall);
        if (!isMemberOfRDPGroup(user, (Folder) currentCMISSession.getObject(idCall)) && !user.isAdmin()) {
            LOGGER.error("USER:" + userId + " try to generaSchedeValutazione for call:" + idCall);
            throw new ClientMessageException("USER:" + userId + " try to genera graduatoria for call:" + idCall);
        }
        OperationContext context = currentCMISSession.getDefaultContext();
        context.setMaxItemsPerPage(Integer.MAX_VALUE);

        Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaDomande.add(Restrictions.inTree(idCall));
        criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaDomande.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(currentCMISSession, false, context);
        Map<String, BigDecimal> result = new HashMap<String, BigDecimal>();
        for (QueryResult item : domande) {
            Folder domanda = (Folder) currentCMISSession.getObject(item.<String>getPropertyValueById(PropertyIds.OBJECT_ID));
            result.put(
                    domanda.getId(),
                    Arrays.asList(
                            printService.formatPunteggio(domanda.<String>getPropertyValue("jconon_application:punteggio_titoli")),
                            printService.formatPunteggio(domanda.<String>getPropertyValue("jconon_application:punteggio_scritto")),
                            printService.formatPunteggio(domanda.<String>getPropertyValue("jconon_application:punteggio_secondo_scritto")),
                            printService.formatPunteggio(domanda.<String>getPropertyValue("jconon_application:punteggio_colloquio")),
                            printService.formatPunteggio(domanda.<String>getPropertyValue("jconon_application:punteggio_prova_pratica"))
                    ).stream().reduce(BigDecimal.ZERO, BigDecimal::add)
            );
        }
        int[] idx = {0};
        result.entrySet().stream()
                .sorted(Comparator.comparing(stringBigDecimalEntry -> stringBigDecimalEntry.getValue(), Comparator.reverseOrder()))
                .forEach(stringBigDecimalEntry -> {
                    Map<String, Object> properties = new HashMap<String, Object>();
                    properties.put("jconon_application:graduatoria", ++idx[0]);
                    cmisService.createAdminSession().getObject(stringBigDecimalEntry.getKey()).updateProperties(properties);
                });
    }

    public void aggiornaProtocolloGraduatoria(Folder call, String numeroProtocollo, GregorianCalendar dataProtocollo) {
        if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
            throw new ClientMessageException("message.error.call.cannnot.modify");
        Session session = cmisService.createAdminSession();
        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaApplications.add(Restrictions.inFolder(call.getPropertyValue(PropertyIds.OBJECT_ID)));
        criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        criteriaApplications.add(Restrictions.in(JCONONPropertyIds.APPLICATION_ESITO_CALL.value(), "V", "I"));
        ItemIterable<QueryResult> domande = criteriaApplications.executeQuery(session, false, session.getDefaultContext());
        for (QueryResult item : domande.getPage(Integer.MAX_VALUE)) {
            Folder domanda = (Folder) session.getObject(item.<String>getPropertyValueById(PropertyIds.OBJECT_ID));
            domanda.updateProperties(
                    Stream.of(
                            new AbstractMap.SimpleEntry<>("jconon_application:protocollo_numero_graduatoria", numeroProtocollo),
                            new AbstractMap.SimpleEntry<>("jconon_application:protocollo_data_graduatoria", dataProtocollo))
                            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
            );
        }
    }

    public void aggiornaProtocolloScorrimento(Folder call, String numeroProtocollo, GregorianCalendar dataProtocollo) {
        if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
            throw new ClientMessageException("message.error.call.cannnot.modify");
        Session session = cmisService.createAdminSession();
        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaApplications.add(Restrictions.inFolder(call.getPropertyValue(PropertyIds.OBJECT_ID)));
        criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_ESITO_CALL.value(), "S"));
        ItemIterable<QueryResult> domande = criteriaApplications.executeQuery(session, false, session.getDefaultContext());
        for (QueryResult item : domande.getPage(Integer.MAX_VALUE)) {
            Folder domanda = (Folder) session.getObject(item.<String>getPropertyValueById(PropertyIds.OBJECT_ID));
            domanda.updateProperties(
                    Stream.of(
                            new AbstractMap.SimpleEntry<>("jconon_application:protocollo_numero_assunzione_idoneo", numeroProtocollo),
                            new AbstractMap.SimpleEntry<>("jconon_application:protocollo_data_assunzione_idoneo", dataProtocollo))
                            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
            );
        }
    }
}
