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

package it.cnr.si.cool.jconon.service.call;


import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.*;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.rest.util.Util;
import it.cnr.cool.security.GroupsEnum;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.StrServ;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.PermissionServiceImpl;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jada.firma.arss.ArubaSignServiceClient;
import it.cnr.jada.firma.arss.ArubaSignServiceException;
import it.cnr.jada.firma.arss.stub.PdfSignApparence;
import it.cnr.si.cool.jconon.cmis.model.*;
import it.cnr.si.cool.jconon.configuration.PECConfiguration;
import it.cnr.si.cool.jconon.configuration.SignConfiguration;
import it.cnr.si.cool.jconon.dto.VerificaPECTask;
import it.cnr.si.cool.jconon.io.model.InlineResponse201;
import it.cnr.si.cool.jconon.io.model.MessageContent2;
import it.cnr.si.cool.jconon.io.model.NewMessage;
import it.cnr.si.cool.jconon.io.repository.IO;
import it.cnr.si.cool.jconon.model.PrintParameterModel;
import it.cnr.si.cool.jconon.pagopa.model.PAGOPAObjectType;
import it.cnr.si.cool.jconon.pagopa.model.PAGOPAPropertyIds;
import it.cnr.si.cool.jconon.repository.CacheRepository;
import it.cnr.si.cool.jconon.repository.CallRepository;
import it.cnr.si.cool.jconon.repository.ProtocolRepository;
import it.cnr.si.cool.jconon.service.PrintService;
import it.cnr.si.cool.jconon.service.QueueService;
import it.cnr.si.cool.jconon.service.TypeService;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.service.cache.CompetitionFolderService;
import it.cnr.si.cool.jconon.service.helpdesk.HelpdeskService;
import it.cnr.si.cool.jconon.util.*;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.Order;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.client.util.OperationContextUtils;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.PropertyData;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.enums.*;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisRuntimeException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.mail.EmailAttachment;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.MultiPartEmail;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.inject.Inject;
import javax.mail.*;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.search.SearchTerm;
import javax.mail.search.SubjectTerm;
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
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Call Service
 */
@Service
public class CallService {
    public static final String FINAL_APPLICATION = "Domande definitive",
            FINAL_SCHEDE = "Schede di valutazione";

    public static final String JCONON_ESCLUSIONE_STATO = "jconon_esclusione:stato";
    public static final String JCONON_COMUNICAZIONE_STATO = "jconon_comunicazione:stato";
    public static final SimpleDateFormat DATEFORMAT = new SimpleDateFormat("dd/MM/yyyy", Locale.ITALY);
    public static final SimpleDateFormat ISO8601DATEFORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.ITALY);
    public static final String GROUP_CONCORSI_RDP = "GROUP_CONCORSI_RDP";
    public static final String GROUP_CONCORSI_COMMISSIONE = "GROUP_CONCORSI_COMMISSIONE";
    private static final Logger LOGGER = LoggerFactory.getLogger(CallService.class);
    private static final String JCONON_CONVOCAZIONE_STATO = "jconon_convocazione:stato";
    @Autowired
    protected CMISService cmisService;
    @Autowired
    protected PermissionServiceImpl permission;
    @Autowired
    protected I18nService i18NService;
    @Autowired
    protected FolderService folderService;
    @Autowired
    protected VersionService versionService;
    @Autowired
    protected ACLService aclService;
    @Autowired
    protected CommonsMultipartResolver resolver;
    @Autowired
    protected MailService mailService;
    @Autowired
    protected UserService userService;
    @Autowired
    protected TypeService typeService;
    @Autowired
    protected HelpdeskService helpdeskService;
    @Autowired
    protected ApplicationContext context;
    @Autowired
    protected CallRepository callRepository;
    @Autowired
    protected CompetitionFolderService competitionService;
    @Autowired
    protected PrintService printService;
    @Autowired
    protected NodeVersionService nodeVersionService;
    @Inject
    private Environment env;
    @Autowired
    protected QueueService queueService;
    @Autowired
    protected ProtocolRepository protocolRepository;
    @Autowired
    protected CacheRepository cacheRepository;
    @Autowired
    protected PECConfiguration pecConfiguration;
    @Autowired(required = false)
    private IO ioClient;

    @Autowired
    protected SignConfiguration signConfiguration;
    @Autowired
    private ArubaSignServiceClient arubaSignServiceClient;

    @Deprecated
    public long findTotalNumApplication(Session cmisSession, Folder call) {
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.addColumn(PropertyIds.NAME);
        criteria.add(Restrictions.inTree(call.getId()));
        ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        return iterable.getTotalNumItems();
    }

    public long getTotalNumApplication(Session cmisSession, Folder macroCall, Folder application, String userId, String statoDomanda) {
        if (macroCall != null) {
            Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
            criteria.addColumn(PropertyIds.OBJECT_ID);
            criteria.addColumn(PropertyIds.NAME);
            criteria.addColumn(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value());

            criteria.add(Restrictions.inTree(macroCall.getId()));
            if (userId != null) {
                criteria.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_USER.value(), userId));
            }
            if (application != null) {
                criteria.add(Restrictions.ne(PropertyIds.OBJECT_ID, application.getId()));
            }
            ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
            return StreamSupport.stream(iterable.spliterator(), false)
                    .filter(queryResult -> {
                        if (statoDomanda != null)
                            return queryResult.getPropertyValueById(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(statoDomanda);
                        return Boolean.TRUE;
                    })
                    .count();
        } else {
            return 0;
        }
    }

    public List<String> findDocumentFinal(Session cmisSession, BindingSession bindingSession, String objectIdBando, JCONONDocumentType documentType) {
         return findDocumentFinal(cmisSession, bindingSession, objectIdBando, documentType, Collections.emptyList());
    }
    public List<String> findDocumentFinal(Session cmisSession, BindingSession bindingSession, String objectIdBando, JCONONDocumentType documentType, List<String> applications) {
        List<String> result = new ArrayList<String>();
        Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaDomande.addColumn(PropertyIds.OBJECT_ID);
        criteriaDomande.add(Restrictions.inTree(objectIdBando));
        criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaDomande.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        if(Optional.ofNullable(applications).filter(list -> !list.isEmpty()).isPresent()) {
            criteriaDomande.add(Restrictions.in(PropertyIds.OBJECT_ID, applications.toArray()));
        }
        ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        if (domande.getTotalNumItems() > 0) {
            for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
                final String applicationId = queryResultDomande.getPropertyValueById(PropertyIds.OBJECT_ID);
                Optional.ofNullable(competitionService.findAttachmentId(cmisSession, applicationId, documentType, true))
                        .ifPresent(s -> result.add(s));
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
        criteria.add(Restrictions.inTree(competitionService.getCompetitionFolder().getString("id")));
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
                criteriaDomande.addColumn(JCONONPropertyIds.APPLICATION_USER.value());
                criteriaDomande.addColumn(JCONONPropertyIds.APPLICATION_NOME.value());
                criteriaDomande.addColumn(JCONONPropertyIds.APPLICATION_COGNOME.value());
                criteriaDomande.addColumn(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value());
                criteriaDomande.add(Restrictions.inFolder((String) queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue()));
                criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.PROVVISORIA.getValue()));
                ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, cmisSession.getDefaultContext());

                for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
                    EmailMessage message = new EmailMessage();
                    List<String> emailList = new ArrayList<String>();
                    try {
                        CMISUser user = userService.loadUserForConfirm((String) queryResultDomande.getPropertyById(JCONONPropertyIds.APPLICATION_USER.value()).getFirstValue());
                        final String email = Optional.ofNullable(
                                queryResult.<String>getPropertyValueById(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value())
                        ).orElse(user.getEmail());
                        if (user != null && email != null) {
                            emailList.add(email);
                            message.setRecipients(emailList);
                            message.setSubject(
                                    i18NService.getLabel("subject-info", Locale.ITALY) +
                                            i18NService.getLabel("subject-reminder-domanda", Locale.ITALY,
                                    queryResult.getPropertyById(JCONONPropertyIds.CALL_CODICE.value()).getFirstValue(),
                                    removeHtmlFromString((String) queryResult.getPropertyById(JCONONPropertyIds.CALL_DESCRIZIONE.value()).getFirstValue())));
                            Map<String, Object> templateModel = new HashMap<String, Object>();
                            templateModel.put("call", queryResult);
                            templateModel.put("folder", queryResultDomande);
                            templateModel.put("message", context.getBean("messageMethod", Locale.ITALY));
                            String body = Util.processTemplate(templateModel, "/pages/call/call.reminder.application.html.ftl");
                            message.setBody(body);
                            mailService.send(message);
                            LOGGER.info("Spedita mail a {} per il bando {}", email, message.getSubject());
                        }
                    } catch (Exception e) {
                        LOGGER.error("Cannot send email for scheduler reminder application for call", e);
                    }
                }
            }
        }
    }

    public void sollecitaProdotti(Session cmisSession) {
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        Criteria criteriaProfile = criteria.createCriteria(
                JCONONPolicyType.JCONON_CALL_ASPECT_PRODUCTS_AFTER_COMMISSION.queryName(),
                JCONONPolicyType.JCONON_CALL_ASPECT_PRODUCTS_AFTER_COMMISSION.queryName()
        );
        criteriaProfile.addJoinCriterion(Restrictions.eqProperty(
                criteria.prefix(PropertyIds.OBJECT_ID),
                criteriaProfile.prefix(PropertyIds.OBJECT_ID)));
        ItemIterable<QueryResult> bandi = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        for (QueryResult queryResult : bandi.getPage(Integer.MAX_VALUE)) {
            Calendar dataInizioCaricamento = queryResult.<Calendar>getPropertyValueById(JCONONPropertyIds.CALL_SELECTED_PRODUCT_START_DATE.value());
            Calendar dataFineCaricamento = queryResult.<Calendar>getPropertyValueById(JCONONPropertyIds.CALL_SELECTED_PRODUCT_END_DATE.value());
            if (dataFineCaricamento == null || dataInizioCaricamento == null)
                continue;

            Calendar dataLimite = Calendar.getInstance();
            dataLimite.add(Calendar.DAY_OF_YEAR, 3);

            if (dataFineCaricamento.before(dataLimite) && dataFineCaricamento.after(Calendar.getInstance())) {
                Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
                criteriaDomande.add(Restrictions.inFolder((String) queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue()));
                criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
                criteriaDomande.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
                ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
                for (QueryResult queryResultDomande : domande.getPage(Integer.MAX_VALUE)) {
                    if (!Optional.ofNullable(competitionService.findAttachmentId(cmisSession, queryResultDomande.getPropertyValueById(PropertyIds.OBJECT_ID),
                            JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_PROD_SCELTI_MULTIPLO)).isPresent()) {
                        EmailMessage message = new EmailMessage();
                        List<String> emailList = new ArrayList<String>();
                        try {
                            CMISUser user = userService.loadUserForConfirm((String) queryResultDomande.getPropertyById(JCONONPropertyIds.APPLICATION_USER.value()).getFirstValue());
                            final String email = Optional.ofNullable(
                                    queryResult.<String>getPropertyValueById(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value())
                            ).orElse(user.getEmail());
                            if (user != null && email != null) {
                                emailList.add(email);
                                message.setRecipients(emailList);
                                message.setSubject(i18NService.getLabel("subject-info", Locale.ITALY) + i18NService.getLabel("subject-reminder-selectedproducts", Locale.ITALY,
                                        queryResult.getPropertyById(JCONONPropertyIds.CALL_CODICE.value()).getFirstValue(),
                                        removeHtmlFromString((String) queryResult.getPropertyById(JCONONPropertyIds.CALL_DESCRIZIONE.value()).getFirstValue())));
                                Map<String, Object> templateModel = new HashMap<String, Object>();
                                templateModel.put("call", queryResult);
                                templateModel.put("folder", queryResultDomande);
                                templateModel.put("message", context.getBean("messageMethod", Locale.ITALY));
                                String body = Util.processTemplate(templateModel, "/pages/call/call.reminder.selectedproducts.html.ftl");
                                message.setBody(body);
                                mailService.send(message);
                                LOGGER.info("Spedita mail a {} per il bando {} con testo {}", email, message.getSubject(), body);
                            }
                        } catch (Exception e) {
                            LOGGER.error("Cannot send email for scheduler reminder application for call", e);
                        }
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
        String pattern = "^[a-zA-Z0-9 .,-\\\\']*$";
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
        if (properties.get(PropertyIds.OBJECT_ID) == null) {
            properties.put(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value(), properties.get(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE_INITIAL.value()));
            properties.put(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), properties.get(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE_INITIAL.value()));
        }
        GregorianCalendar dataInizioInvioDomande = (GregorianCalendar) properties.get(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value());
        Map<String, Object> otherProperties = new HashMap<String, Object>();
        if (properties.get(PropertyIds.OBJECT_ID) == null) {
            try {
                if (properties.get(PropertyIds.PARENT_ID) == null)
                    properties.put(PropertyIds.PARENT_ID, competitionService.getCompetitionFolder().get("id"));
                call = (Folder) cmisSession.getObject(
                        cmisSession.createFolder(properties, new ObjectIdImpl((String) properties.get(PropertyIds.PARENT_ID))));
                aclService.setInheritedPermission(bindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);
                if (dataInizioInvioDomande != null && properties.get(PropertyIds.PARENT_ID) == null) {
                    moveCall(cmisSession, dataInizioInvioDomande, call);
                }
            } catch (CmisContentAlreadyExistsException _ex) {
                throw new ClientMessageException("message.error.call.already.exists");
            }
        } else {
            call = (Folder) cmisSession.getObject((String) properties.get(PropertyIds.OBJECT_ID));
            if (!call.<Boolean>getPropertyValue(JCONONPropertyIds.CALL_PUBBLICATO.value())) {
                properties.put(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value(), properties.get(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE_INITIAL.value()));
                properties.put(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), properties.get(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE_INITIAL.value()));
            }
            CMISUser user = userService.loadUserForConfirm(userId);
            if ((Boolean) call.getPropertyValue(JCONONPropertyIds.CALL_PUBBLICATO.value()) && !(user.isAdmin() || isMemberOfConcorsiGroup(user))) {
                if (!existsProvvedimentoProrogaTermini(cmisSession, call))
                    throw new ClientMessageException("message.error.call.cannnot.modify");
            }
            call.updateProperties(properties, true);
            if (!call.getParentId().equals(properties.get(PropertyIds.PARENT_ID)) && properties.get(PropertyIds.PARENT_ID) != null)
                call.move(call.getFolderParent(), new ObjectIdImpl((String) properties.get(PropertyIds.PARENT_ID)));

        }
        otherProperties.put(JCONONPropertyIds.CALL_HAS_MACRO_CALL.value(), cmisSession.getObject(call.getParentId()).getType().getId().equals(call.getType().getId()));
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
        aces.put(JcononGroups.CONCORSI.group(), ACLType.Coordinator);
        aclService.addAcl(bindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
        return call;
    }

    public void delete(Session cmisSession, String contextURL, String objectId,
                       String objectTypeId, String userId) {
        Folder call = (Folder) cmisSession.getObject(objectId);
        CMISUser user = userService.loadUserForConfirm(userId);
        if ((Boolean) call.getPropertyValue(JCONONPropertyIds.CALL_PUBBLICATO.value()) && isBandoInCorso(call) && !(user.isAdmin() || isMemberOfConcorsiGroup(user))) {
            throw new ClientMessageException("message.error.call.cannnot.modify");
        }
        if (Optional.ofNullable(call)
                .map(folder -> folder.getDescendants(2))
                .map(cmisObjects -> {
                    return cmisObjects
                            .stream()
                            .map(Tree::getItem)
                            .filter(fileableCmisObject -> fileableCmisObject.getType().getId().equals(JCONONFolderType.JCONON_APPLICATION.value()))
                            .filter(fileableCmisObject -> !fileableCmisObject.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value())
                                    .equals(ApplicationService.StatoDomanda.INIZIALE.getValue()))
                            .findAny().isPresent();
                }).orElse(Boolean.FALSE)) {
            throw new ClientMessageException("message.error.call.cannot.delete");
        }
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
                            groupJson = groupJson.concat("\"parent_group_name\":\"" + JcononGroups.RDP_CONCORSO.group() + "\",");
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
            acesGroup.put(JcononGroups.CONCORSI.group(), ACLType.FullControl);
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
                            groupJson = groupJson.concat("\"parent_group_name\":\"" + JcononGroups.COMMISSIONI_CONCORSO.group() + "\",");
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
            acesGroup.put(JcononGroups.CONCORSI.group(), ACLType.FullControl);
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
                .anyMatch(s -> s.equalsIgnoreCase(JcononGroups.CONCORSI.group()));
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
                .anyMatch(s -> s.equalsIgnoreCase("GROUP_" + getCallGroupCommissioneName(call)) ||
                        s.equalsIgnoreCase(GROUP_CONCORSI_COMMISSIONE));
    }

    public Folder publish(Session cmisSession, BindingSession currentBindingSession, String userId, String objectId, boolean publish,
                          String contextURL, Locale locale) {
        final Folder call = (Folder) cmisSession.getObject(objectId);
        CMISUser user = userService.loadUserForConfirm(userId);
        if (!(user.isAdmin() || isMemberOfConcorsiGroup(user) || isMemberOfRDPGroup(user, call) ||call.getPropertyValue(PropertyIds.CREATED_BY).equals(userId)))
            throw new ClientMessageException("message.error.call.cannot.publish");

        Map<String, ACLType> aces = new HashMap<String, ACLType>();
        aces.put(JcononGroups.EVERYONE.group(), ACLType.Consumer);
        GregorianCalendar dataInizioInvioDomande = call.getPropertyValue(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value());
        if (!publish && !(user.isAdmin() || isMemberOfConcorsiGroup(user))) {
            if (!dataInizioInvioDomande.after(Calendar.getInstance()) && getApplicationConfirmed(cmisService.createAdminSession(), call).getTotalNumItems() > 0)
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
        if (publish && call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA.value())
                .stream()
                .filter(s -> s.equalsIgnoreCase("affix_tabDichiarazioni"))
                .findAny().isPresent() &&
                Optional.ofNullable(call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value()))
                        .map(List::isEmpty).orElse(Boolean.TRUE)) {
            throw new ClientMessageException("message.error.call.incomplete.section.affix_tabDichiarazioni");
        }
        if (publish && call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA.value())
                .stream()
                .filter(s -> s.equalsIgnoreCase("affix_tabUlterioriDati"))
                .findAny().isPresent() &&
                Optional.ofNullable(call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS_ULTERIORI_DATI.value()))
                        .map(List::isEmpty).orElse(Boolean.TRUE)) {
            throw new ClientMessageException("message.error.call.incomplete.section.affix_tabUlterioriDati");
        }
        if (publish && call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA.value())
                .stream()
                .filter(s -> s.equalsIgnoreCase("affix_tabSezione4"))
                .findAny().isPresent() &&
                Optional.ofNullable(call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_4.value()))
                        .map(List::isEmpty).orElse(Boolean.TRUE)) {
            throw new ClientMessageException("message.error.call.incomplete.section.affix_tabSezione4");
        }
        if (publish && call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA.value())
                .stream()
                .filter(s -> s.equalsIgnoreCase("affix_tabSezione5"))
                .findAny().isPresent() &&
                Optional.ofNullable(call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_5.value()))
                        .map(List::isEmpty).orElse(Boolean.TRUE)) {
            throw new ClientMessageException("message.error.call.incomplete.section.affix_tabSezione5");
        }
        if (publish && call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA.value())
                .stream()
                .filter(s -> s.equalsIgnoreCase("affix_tabDatiCNR"))
                .findAny().isPresent() &&
                Optional.ofNullable(call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_CNR.value()))
                        .map(List::isEmpty).orElse(Boolean.TRUE)) {
            throw new ClientMessageException("message.error.call.incomplete.section.affix_tabDatiCNR");
        }
        if (publish && call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA.value())
                .stream()
                .filter(s -> s.equalsIgnoreCase("affix_tabTitoli"))
                .findAny().isPresent() &&
                Optional.ofNullable(call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS.value()))
                        .map(List::isEmpty).orElse(Boolean.TRUE)) {
            throw new ClientMessageException("message.error.call.incomplete.section.affix_tabTitoli");
        }
        if (publish && call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA.value())
                .stream()
                .filter(s -> s.equalsIgnoreCase("affix_tabCurriculum"))
                .findAny().isPresent() &&
                Optional.ofNullable(call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM.value()))
                        .map(List::isEmpty).orElse(Boolean.TRUE)) {
            throw new ClientMessageException("message.error.call.incomplete.section.affix_tabCurriculum");
        }
        if (publish && call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA.value())
                .stream()
                .filter(s -> s.equalsIgnoreCase("affix_tabElencoProdotti"))
                .findAny().isPresent() &&
                Optional.ofNullable(call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()))
                        .map(List::isEmpty).orElse(Boolean.TRUE)) {
            throw new ClientMessageException("message.error.call.incomplete.section.affix_tabElencoProdotti");
        }
        if (publish &&
                Optional.ofNullable(call.<Boolean>getPropertyValue(PAGOPAPropertyIds.CALL_PAGAMENTO_PAGOPA.value())).orElse(Boolean.FALSE) &&
                !Optional.ofNullable(call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS.value()))
                    .orElse(Collections.emptyList())
                    .stream()
                    .filter(s -> s.equalsIgnoreCase(PAGOPAObjectType.JCONON_ATTACHMENT_PAGAMENTI_DIRITTI_SEGRETERIA.value()))
                    .findAny()
                    .isPresent()
        ) {
            throw new ClientMessageException("message.error.call.incomplete.pagopa");
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
            aces.put(JcononGroups.CONCORSI.group(), ACLType.Coordinator);
            aclService.addAcl(currentBindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
        } else {
            aclService.removeAcl(currentBindingSession, call.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
        }
        call.updateProperties(properties, true);
        return call;
    }

    @SuppressWarnings("unchecked")
    public String createChildCall(Session cmisSession, BindingSession currentBindingSession, String userId,
                                Map<String, Object> extractFormParams, String contextURL,
                                Locale locale) {
        Folder parent = (Folder) cmisSession.getObject(String.valueOf(extractFormParams.get(PropertyIds.PARENT_ID)));
        Map<String, Object> properties = new HashMap<String, Object>();
        properties.putAll(extractFormParams);
        for (Property<?> property : parent.getProperties()
                .stream()
                .filter(property -> !property.getDefinition().getId().equalsIgnoreCase(JCONONPropertyIds.CALL_COMMISSIONE.value()))
                .filter(property -> !property.getDefinition().getId().equalsIgnoreCase(JCONONPropertyIds.CALL_RDP.value()))
                .filter(property -> !property.getDefinition().getId().startsWith("sys"))
                .collect(Collectors.toList())) {
            if (!extractFormParams.containsKey(property.getId()) &&
                    !property.getDefinition().getUpdatability().equals(Updatability.READONLY)) {
                LOGGER.debug("Add property " + property.getId() + " for create child.");
                properties.put(property.getId(), property.getValue());
            }
        }
        String codiceBando = String.valueOf(properties.get(JCONONPropertyIds.CALL_CODICE.value()));
        if (!isAlphaNumeric(codiceBando)) {
            throw new ClientMessageException("message.error.codice.not.valid");
        }
        String name = i18NService.getLabel("call.name", locale).concat(codiceBando);
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
        parent.<List<String>>getPropertyValue(PropertyIds.SECONDARY_OBJECT_TYPE_IDS)
                .stream()
                .filter(s -> s.equalsIgnoreCase(JCONONPolicyType.JCONON_CALL_ASPECT_GU.value()))
                .findAny()
                .ifPresent(s -> secondaryTypes.add(s));
        parent.<List<String>>getPropertyValue(PropertyIds.SECONDARY_OBJECT_TYPE_IDS)
                .stream()
                .filter(s -> s.equalsIgnoreCase(JCONONPolicyType.JCONON_CALL_ASPECT_INPA.value()))
                .findAny()
                .ifPresent(s -> secondaryTypes.add(s));
        properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, secondaryTypes);
        properties.put(JCONONPropertyIds.CALL_PUBBLICATO.value(), false);

        Folder child = parent.createFolder(properties);
        aclService.setInheritedPermission(currentBindingSession,
                child.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(),
                false);

        creaGruppoRdP(child, userId);

        Map<String, ACLType> aces = new HashMap<String, ACLType>();
        aces.put(JcononGroups.CONCORSI.group(), ACLType.Coordinator);
        aclService.addAcl(currentBindingSession, child.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);


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
        /**
         * Copio anche l'eventuale file delle etichette personalizzate
         */
        Optional.ofNullable(findAttachmentName(cmisSession, parent.getId(), CallRepository.LABELS_JSON))
                .map(s -> cmisSession.getObject(s))
                .filter(Document.class::isInstance)
                .map(Document.class::cast)
                .ifPresent(document -> {
                    Map<String, Object> propertiesLabels = new HashMap<String, Object>();
                    propertiesLabels.put(PropertyIds.NAME, document.getName());
                    propertiesLabels.put(PropertyIds.OBJECT_TYPE_ID, document.getDocumentType().getId());
                    child.createDocument(propertiesLabels, document.getContentStream(), VersioningState.MAJOR);
                });
        Optional.ofNullable(extractFormParams.get(JCONONPropertyIds.CALL_PUBBLICATO.value()))
                .ifPresent(o -> {
                    Folder call = publish(cmisSession, currentBindingSession, userId, child.getId(), true, contextURL, locale);
                    Optional.ofNullable(extractFormParams.get("helpdesk_tecnico"))
                            .map(String.class::cast)
                            .ifPresent(s -> {
                                helpdeskService.manageEsperto(
                                        call.getPropertyValue(JCONONPropertyIds.CALL_ID_CATEGORIA_TECNICO_HELPDESK.value()),
                                        s,
                                        false
                                );
                            });
                    Optional.ofNullable(extractFormParams.get("helpdesk_normativo"))
                            .map(String.class::cast)
                            .ifPresent(s -> {
                                helpdeskService.manageEsperto(
                                        call.getPropertyValue(JCONONPropertyIds.CALL_ID_CATEGORIA_NORMATIVA_HELPDESK.value()),
                                        s,
                                        false
                                );
                            });


                });

        return child.getId();
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

    @Async("threadPoolTaskExecutor")
    public Long convocazioniAsync(Session session, MultipartHttpServletRequest mRequest, BindingSession bindingSession, String contextURL, Locale locale, String userId) throws IOException {
        final Long aLong = convocazioni(session, mRequest, bindingSession, contextURL, locale, userId);
        CMISUser user = userService.loadUserForConfirm(userId);
        EmailMessage message = new EmailMessage();
        message.setBody(i18NService.getLabel("message.convocazioni.async.email.body", locale, aLong));
        message.setHtmlBody(true);
        message.setSubject(i18NService.getLabel("subject-info", locale));
        message.setRecipients(Arrays.asList(user.getEmail()));
        mailService.send(message);
        return aLong;
    }
    public Long convocazioniSync(Session session, MultipartHttpServletRequest mRequest, BindingSession bindingSession, String contextURL, Locale locale, String userId) throws IOException {
        return convocazioni(session, mRequest, bindingSession, contextURL, locale, userId);
    }
    protected Long convocazioni(Session session, MultipartHttpServletRequest mRequest, BindingSession bindingSession, String contextURL, Locale locale, String userId) throws IOException {

        String callId = mRequest.getParameter("callId");
        String tipoSelezione = mRequest.getParameter("tipoSelezione");
        Boolean testoLibero = Boolean.valueOf(mRequest.getParameter("testoLibero"));
        String luogo = mRequest.getParameter("luogo");
        Calendar data = Optional.ofNullable(mRequest.getParameter("data"))
                .filter(s -> s.length() > 0)
                .map(s -> {
                    try {
                        return DateUtils.parse(s);
                    } catch (ParseException e) {
                        return null;
                    }
                })
                .orElse(null);
        String note = Optional.ofNullable(mRequest.getParameter("note")).filter(s -> !s.equalsIgnoreCase("null")).orElse(null);
        String firma = Optional.ofNullable(mRequest.getParameter("firma")).filter(s -> !s.equalsIgnoreCase("null")).orElse(null);
        List<String> applicationsId = Arrays.asList(
                Optional.ofNullable(mRequest.getParameterValues("application")).orElse(new String[0])
        );
        Integer numeroConvocazione = Optional.ofNullable(mRequest.getParameter("numeroConvocazione"))
                .map(map -> Integer.valueOf(map))
                .orElse(1);

        Folder call = (Folder) session.getObject(String.valueOf(callId));
        if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
            throw new ClientMessageException("message.error.call.cannnot.modify");

        List<String> nodeRefAllegato = addAttachmentToCall(session, bindingSession, call, mRequest.getFiles("file"));

        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaApplications.add(Restrictions.inTree(call.getPropertyValue(PropertyIds.OBJECT_ID)));
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
            List<String> aspects = Stream.of(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value(),
                    JCONONPolicyType.JCONON_ATTACHMENT_FROM_RDP.value()).collect(Collectors.toList());
            if (!nodeRefAllegato.isEmpty()) {
                properties.put(JCONONPropertyIds.ATTACHMENT_RELATED.value(), nodeRefAllegato.stream().collect(Collectors.joining(",")));
                aspects.add(JCONONPolicyType.JCONON_ATTACHMENT_ATTACHED.value());
            }
            properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, aspects);

            ContentStreamImpl contentStream = new ContentStreamImpl();
            contentStream.setStream(new ByteArrayInputStream(bytes));
            contentStream.setMimeType("application/pdf");
            String documentPresentId = findAttachmentName(session, applicationObject.getId(), name);
            if (documentPresentId == null) {
                index++;
                Document doc = applicationObject.createDocument(properties, contentStream, VersioningState.MAJOR);
                aclService.setInheritedPermission(bindingSession, doc.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()), false);
                Map<String, ACLType> acesGroup = new HashMap<String, ACLType>();
                acesGroup.put(JcononGroups.CONCORSI.group(), ACLType.Coordinator);
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

    private List<String> addAttachmentToCall(Session session, BindingSession bindingSession, Folder call, List<MultipartFile> files) throws IOException {
        List<String> result = new ArrayList<String>();
        for (MultipartFile file : files) {
            if (!Optional.ofNullable(file).map(MultipartFile::isEmpty).orElse(Boolean.TRUE)) {
                ContentStreamImpl contentStream = new ContentStreamImpl();
                contentStream.setStream(file.getInputStream());
                contentStream.setMimeType(file.getContentType());
                Optional<String> nodeRefAllegato = Optional.ofNullable(findAttachmentName(session, call.getId(), file.getOriginalFilename()));
                if (!nodeRefAllegato.isPresent()) {
                    Document document = call.createDocument(
                            Stream.of(
                                    new AbstractMap.SimpleEntry<>(PropertyIds.NAME, file.getOriginalFilename()),
                                    new AbstractMap.SimpleEntry<>(PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
                                            Arrays.asList(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value())
                                    ),
                                    new AbstractMap.SimpleEntry<>(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_CALL_GENERIC.value()))
                                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)),
                            contentStream, VersioningState.MAJOR);
                    aclService.setInheritedPermission(
                            bindingSession,
                            document.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                            false
                    );
                    aclService.addAcl(
                            bindingSession,
                            document.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                            Stream.of(
                                    new AbstractMap.SimpleEntry<>(GroupsEnum.CONCORSI.value(), ACLType.Coordinator)
                            ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                    );
                    nodeRefAllegato = Optional.ofNullable(document.getId());
                }
                result.add(nodeRefAllegato.get());
            }
        }
        return result;
    }
    @Async("threadPoolTaskExecutor")
    public Long esclusioniAsync(Session session, MultipartHttpServletRequest mRequest, BindingSession bindingSession, String contextURL, Locale locale, String userId) throws IOException {
        final Long aLong = internalEsclusioni(session, mRequest, bindingSession, contextURL, locale, userId);
        CMISUser user = userService.loadUserForConfirm(userId);
        EmailMessage message = new EmailMessage();
        message.setBody(i18NService.getLabel("message.esclusioni.async.email.body", locale, aLong));
        message.setHtmlBody(true);
        message.setSubject(i18NService.getLabel("subject-info", locale));
        message.setRecipients(Arrays.asList(user.getEmail()));
        mailService.send(message);
        return aLong;
    }
    public Long esclusioniSync(Session session, MultipartHttpServletRequest mRequest, BindingSession bindingSession, String contextURL, Locale locale, String userId) throws IOException {
        return internalEsclusioni(session, mRequest, bindingSession, contextURL, locale, userId);
    }
    protected Long internalEsclusioni(Session session, MultipartHttpServletRequest mRequest, BindingSession bindingSession, String contextURL, Locale locale, String userId) throws IOException {
        String callId = mRequest.getParameter("callId");
        String note = Optional.ofNullable(mRequest.getParameter("note")).filter(s -> !s.equalsIgnoreCase("null")).orElse(null);
        String firma = Optional.ofNullable(mRequest.getParameter("firma")).filter(s -> !s.equalsIgnoreCase("null")).orElse(null);
        List<String> applicationsId = Arrays.asList(
                Optional.ofNullable(mRequest.getParameterValues("application")).orElse(new String[0])
        );
        String query = mRequest.getParameter("query");
        boolean stampaPunteggi = Boolean.valueOf(mRequest.getParameter("stampaPunteggi"));

        Folder call = (Folder) session.getObject(String.valueOf(callId));
        if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
            throw new ClientMessageException("message.error.call.cannnot.modify");

        List<String> nodeRefAllegato = addAttachmentToCall(session, bindingSession, call, mRequest.getFiles("file"));

        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaApplications.add(Restrictions.inTree(call.getPropertyValue(PropertyIds.OBJECT_ID)));
        criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaApplications.add(Restrictions.or(
                    Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()),
                    Restrictions.eq(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value(), ApplicationService.StatoDomanda.SCHEDA_ANONIMA_RESPINTA.getValue())
                )
        );
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
                    flPunteggioProvaPratica = Optional.ofNullable(applicationObject.<Boolean>getPropertyValue("jconon_application:fl_punteggio_prova_pratica")).orElse(false),
                    flPunteggio6 = Optional.ofNullable(applicationObject.<Boolean>getPropertyValue("jconon_application:fl_punteggio_6")).orElse(false);
            result++;
            if (flPunteggioTitoli)
                proveConseguite.add(call.getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_1));
            if (flPunteggioScritto)
                proveConseguite.add(call.getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_2));
            if (flPunteggioSecondoScritto)
                proveConseguite.add(call.getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_3));
            if (flPunteggioColloquio)
                proveConseguite.add(call.getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_4));
            if (flPunteggioProvaPratica)
                proveConseguite.add(call.getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_5));
            if (flPunteggio6)
                proveConseguite.add(call.getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_6));
            final Optional<String> attachmentId = Optional.ofNullable(
                    competitionService.findAttachmentId(
                            session,
                            applicationObject.getId(),
                            JCONONDocumentType.JCONON_ATTACHMENT_ESCLUSIONE
                    )
            );
            if (attachmentId.isPresent()){
                if (Optional.ofNullable(session.getObject(attachmentId.get()).<String>getPropertyValue(JCONON_ESCLUSIONE_STATO))
                        .filter(s -> s.equalsIgnoreCase(StatoComunicazione.GENERATO.name())).isPresent()){
                    continue;
                }
            }

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
            List<String> aspects = Stream.of(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value(),
                    JCONONPolicyType.JCONON_ATTACHMENT_FROM_RDP.value()).collect(Collectors.toList());
            if (!nodeRefAllegato.isEmpty()) {
                properties.put(JCONONPropertyIds.ATTACHMENT_RELATED.value(), nodeRefAllegato.stream().collect(Collectors.joining(",")));
                aspects.add(JCONONPolicyType.JCONON_ATTACHMENT_ATTACHED.value());
            }
            properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, aspects);
            ContentStreamImpl contentStream = new ContentStreamImpl();
            contentStream.setStream(new ByteArrayInputStream(bytes));
            contentStream.setMimeType("application/pdf");
            String documentPresentId = findAttachmentName(session, applicationObject.getId(), name);
            if (documentPresentId == null) {
                Document doc = applicationObject.createDocument(properties, contentStream, VersioningState.MAJOR);
                aclService.setInheritedPermission(bindingSession, doc.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()), false);
                Map<String, ACLType> acesGroup = new HashMap<String, ACLType>();
                acesGroup.put(JcononGroups.CONCORSI.group(), ACLType.Coordinator);
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
                .filter(property -> !call.getBaseType().getPropertyDefinitions().containsKey(property.getId()))
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
    @Async("threadPoolTaskExecutor")
    public Long comunicazioniAsync(Session session, MultipartHttpServletRequest mRequest, BindingSession bindingSession, String contextURL, Locale locale, String userId) throws IOException {
        final Long aLong = comunicazioni(session, mRequest, bindingSession, contextURL, locale, userId);
        CMISUser user = userService.loadUserForConfirm(userId);
        EmailMessage message = new EmailMessage();
        message.setBody(i18NService.getLabel("message.comunicazioni.async.email.body", locale, aLong));
        message.setHtmlBody(true);
        message.setSubject(i18NService.getLabel("subject-info", locale));
        message.setRecipients(Arrays.asList(user.getEmail()));
        mailService.send(message);
        return aLong;
    }
    public Long comunicazioniSync(Session session, MultipartHttpServletRequest mRequest, BindingSession bindingSession, String contextURL, Locale locale, String userId) throws IOException {
        return comunicazioni(session, mRequest, bindingSession, contextURL, locale, userId);
    }
    protected Long comunicazioni(Session session, MultipartHttpServletRequest mRequest, BindingSession bindingSession,
                              String contextURL, Locale locale, String userId) throws IOException {
        String callId = mRequest.getParameter("callId");
        String note = Optional.ofNullable(mRequest.getParameter("note")).filter(s -> !s.equalsIgnoreCase("null")).orElse(null);
        String firma = Optional.ofNullable(mRequest.getParameter("firma")).filter(s -> !s.equalsIgnoreCase("null")).orElse(null);
        String appellativo = Optional.ofNullable(mRequest.getParameter("appellativo")).filter(s -> !s.equalsIgnoreCase("null")).orElse(null);
        List<String> applicationsId = Arrays.asList(
                Optional.ofNullable(mRequest.getParameterValues("application")).orElse(new String[0])
        );
        String filtersProvvisorieInviate = mRequest.getParameter("filters-provvisorie_inviate");
        Integer totalepunteggioda = null, totalepunteggioa = null;
        try {
            totalepunteggioda = Optional.ofNullable(mRequest.getParameter("totalepunteggioda"))
                    .filter(s -> s.length() > 0)
                    .map(Integer::valueOf).orElse(null);
            totalepunteggioa = Optional.ofNullable(mRequest.getParameter("totalepunteggioa"))
                    .filter(s -> s.length() > 0)
                    .map(Integer::valueOf).orElse(null);
        } catch (NumberFormatException _ex) {
        }
        Folder call = (Folder) session.getObject(String.valueOf(callId));
        if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
            throw new ClientMessageException("message.error.call.cannnot.modify");

        List<String> nodeRefAllegato = addAttachmentToCall(session, bindingSession, call, mRequest.getFiles("file"));

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
        if (Optional.ofNullable(totalepunteggioda).isPresent()) {
            criteriaApplications.add(Restrictions.ge(JCONONPropertyIds.APPLICATION_TOTALE_PUNTEGGIO.value(), totalepunteggioda));
        }
        if (Optional.ofNullable(totalepunteggioa).isPresent()) {
            criteriaApplications.add(Restrictions.le(JCONONPropertyIds.APPLICATION_TOTALE_PUNTEGGIO.value(), totalepunteggioa));
        }
        applicationsId.stream().filter(string -> !string.isEmpty()).findAny().map(map -> criteriaApplications.add(Restrictions.in(PropertyIds.OBJECT_ID, applicationsId.toArray())));

        long result = 0;
        ItemIterable<QueryResult> applications = criteriaApplications.executeQuery(session, false, session.getDefaultContext());
        for (QueryResult application : applications.getPage(Integer.MAX_VALUE)) {
            Folder applicationObject = (Folder) session.getObject((String) application.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            final String attachmentId = competitionService.findAttachmentId(session, applicationObject.getId(), JCONONDocumentType.JCONON_ATTACHMENT_COMUNICAZIONE);
            if (attachmentId != null) {
                final CmisObject document = session.getObject(attachmentId);
                if (document.getPropertyValue(JCONON_COMUNICAZIONE_STATO) != null &&
                    document.getPropertyValue(JCONON_COMUNICAZIONE_STATO).equals(StatoComunicazione.GENERATO.name())) {
                    continue;
                }
            }
            StrSubstitutor sub = formatPlaceHolder(applicationObject, applicationObject.getFolderParent());

            byte[] bytes = printService.printComunicazione(session, applicationObject, contextURL, locale, sub.replace(note), firma, appellativo);
            String name = "COMUNICAZIONE_" + applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value()) + " " +
                    applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value()) +
                    "_" + applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()) +
                    "_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss")) +
                    ".pdf";
            result++;
            LOGGER.info("Generate comunication n. {} width name {}", result, name);
            Map<String, Object> properties = new HashMap<String, Object>();
            properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_COMUNICAZIONE.value());
            properties.put(PropertyIds.NAME, name);
            properties.put(JCONONPropertyIds.ATTACHMENT_USER.value(), applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
            properties.put(JCONON_COMUNICAZIONE_STATO, StatoComunicazione.GENERATO.name());
            properties.put("jconon_comunicazione:email", applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value()));
            properties.put("jconon_comunicazione:email_pec", applicationObject.getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value()));
            List<String> aspects = Stream.of(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value(),
                    JCONONPolicyType.JCONON_ATTACHMENT_FROM_RDP.value()).collect(Collectors.toList());
            if (!nodeRefAllegato.isEmpty()) {
                properties.put(JCONONPropertyIds.ATTACHMENT_RELATED.value(), nodeRefAllegato.stream().collect(Collectors.joining(",")));
                aspects.add(JCONONPolicyType.JCONON_ATTACHMENT_ATTACHED.value());
            }
            properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, aspects);
            ContentStreamImpl contentStream = new ContentStreamImpl();
            contentStream.setStream(new ByteArrayInputStream(bytes));
            contentStream.setMimeType("application/pdf");
            String documentPresentId = findAttachmentName(session, applicationObject.getId(), name);
            if (documentPresentId == null) {
                Document doc = applicationObject.createDocument(properties, contentStream, VersioningState.MAJOR);
                aclService.setInheritedPermission(bindingSession, doc.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()), false);
                Map<String, ACLType> acesGroup = new HashMap<String, ACLType>();
                acesGroup.put(JcononGroups.CONCORSI.group(), ACLType.Coordinator);
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

    public Long aggiungiAllegati(Session session, HttpServletRequest request, BindingSession bindingSession,
                              String contextURL, Locale locale, String userId) throws IOException {
        MultipartHttpServletRequest mRequest = resolver.resolveMultipart(request);

        String callId = mRequest.getParameter("callId");
        List<String> applicationsId = Arrays.asList(
                Optional.ofNullable(mRequest.getParameterValues("application")).orElse(new String[0])
        );
        String filtersProvvisorieInviate = mRequest.getParameter("filters-provvisorie_inviate");
        Integer totalepunteggioda = Optional.ofNullable(mRequest.getParameter("totalepunteggioda"))
                .filter(s -> s.length() > 0)
                .map(Integer::valueOf).orElse(null);
        Integer totalepunteggioa = Optional.ofNullable(mRequest.getParameter("totalepunteggioa"))
                .filter(s -> s.length() > 0)
                .map(Integer::valueOf).orElse(null);

        Folder call = (Folder) session.getObject(String.valueOf(callId));
        if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
            throw new ClientMessageException("message.error.call.cannnot.modify");
        Optional<MultipartFile> file = Optional.ofNullable(mRequest.getFile("file"));
        if (file.map(MultipartFile::isEmpty).orElse(Boolean.TRUE)) {
            throw new ClientMessageException("message.error.attachment.required");
        }

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
        if (Optional.ofNullable(totalepunteggioda).isPresent()) {
            criteriaApplications.add(Restrictions.ge(JCONONPropertyIds.APPLICATION_TOTALE_PUNTEGGIO.value(), totalepunteggioda));
        }
        if (Optional.ofNullable(totalepunteggioa).isPresent()) {
            criteriaApplications.add(Restrictions.le(JCONONPropertyIds.APPLICATION_TOTALE_PUNTEGGIO.value(), totalepunteggioa));
        }
        applicationsId.stream().filter(string -> !string.isEmpty()).findAny().map(map -> criteriaApplications.add(Restrictions.in(PropertyIds.OBJECT_ID, applicationsId.toArray())));
        long result = 0;
        ItemIterable<QueryResult> applications = criteriaApplications.executeQuery(session, false, session.getDefaultContext());
        for (QueryResult application : applications.getPage(Integer.MAX_VALUE)) {
            Folder applicationObject = (Folder) session.getObject((String) application.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            if (Optional.ofNullable(findAttachmentName(session, applicationObject.getId(), file.get().getOriginalFilename())).isPresent()) {
                continue;
            }
            ContentStreamImpl contentStream = new ContentStreamImpl();
            contentStream.setStream(file.get().getInputStream());
            contentStream.setMimeType(file.get().getContentType());
            Document document = applicationObject.createDocument(
                    Stream.of(
                            new AbstractMap.SimpleEntry<>(PropertyIds.NAME, file.get().getOriginalFilename()),
                            new AbstractMap.SimpleEntry<>(PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
                                    Arrays.asList(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value())
                            ),
                            new AbstractMap.SimpleEntry<>(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_ALLEGATO_GENERICO.value()))
                            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)),
                    contentStream, VersioningState.MAJOR);
            aclService.addAcl(
                    bindingSession,
                    document.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                    Stream.of(
                            new AbstractMap.SimpleEntry<>(GroupsEnum.CONCORSI.value(), ACLType.Coordinator)
                    ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
            );
            result++;
        }
        return result;
    }

    public Long eliminaAllegatiGeneratiSullaDomanda(Session session, String query, String userId) throws IOException {
        ItemIterable<QueryResult> applications = session.query(query, false);
        final int maxItemsPerPage = session.getDefaultContext().getMaxItemsPerPage();
        final long totalNumItems = applications.getTotalNumItems();
        long result = 0;
        int skipTo = 0;
        do {
            applications = applications.skipTo(skipTo).getPage(maxItemsPerPage);
            for (QueryResult document : applications) {
                try {
                    String stato = Optional.ofNullable(document.<String>getPropertyValueById(JCONON_COMUNICAZIONE_STATO))
                            .orElse(Optional.ofNullable(document.<String>getPropertyValueById(JCONON_ESCLUSIONE_STATO))
                                    .orElse(Optional.ofNullable(document.<String>getPropertyValueById(JCONON_CONVOCAZIONE_STATO)).orElse(null)));
                    if (Optional.ofNullable(stato).isPresent() &&
                            (stato.equalsIgnoreCase(StatoComunicazione.GENERATO.name()) || stato.equalsIgnoreCase(StatoComunicazione.FIRMATO.name()))) {
                        session.delete(new ObjectIdImpl(document.getPropertyValueById(PropertyIds.OBJECT_ID)));
                        result++;
                        LOGGER.info("Deleted node with id {}, index: {} of total {}", document.<String>getPropertyValueById(PropertyIds.OBJECT_ID), result, totalNumItems);
                    }
                } catch (CmisRuntimeException _ex) {
                    LOGGER.error("Unable to delete document with id: {} by user {}",
                            document.getPropertyValueById(PropertyIds.OBJECT_ID), userId, _ex);
                }
            }
            skipTo = skipTo + maxItemsPerPage;
        } while (applications.getHasMoreItems());
        return result;
    }

    public Long firma(Session session, BindingSession bindingSession, String query, String contexURL, String userId, String userName,
                      String password, String otp, String firma, String property, String description, Boolean firmaAutomatica) throws IOException {
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
        if (firmaAutomatica) {
            for(String nodeRef:nodeRefs) {
                Optional.ofNullable(session.getObject(nodeRef))
                        .filter(Document.class::isInstance)
                        .map(Document.class::cast)
                        .ifPresent(document -> {
                            try {
                                PdfSignApparence pdfSignApparence = new PdfSignApparence();
                                pdfSignApparence.setImage(signConfiguration.getImage());
                                pdfSignApparence.setLeftx(signConfiguration.getLeftx());
                                pdfSignApparence.setLefty(signConfiguration.getLefty());
                                pdfSignApparence.setLocation(signConfiguration.getLocation());
                                pdfSignApparence.setPage(signConfiguration.getPage());
                                pdfSignApparence.setReason(description);
                                pdfSignApparence.setRightx(signConfiguration.getRightx());
                                pdfSignApparence.setRighty(signConfiguration.getRighty());

                                final byte[] bytes = arubaSignServiceClient.pdfsignatureV2(userName, otp, password, IOUtils.toByteArray(document.getContentStream().getStream()), pdfSignApparence);
                                ContentStreamImpl contentStream = new ContentStreamImpl();
                                contentStream.setStream(new ByteArrayInputStream(bytes));
                                contentStream.setMimeType(document.getContentStreamMimeType());
                                contentStream.setFileName(document.getContentStreamFileName());
                                document.setContentStream(contentStream, true, true);
                                document = document.getObjectOfLatestVersion(false);
                                document.updateProperties(Collections.singletonMap(property, StatoComunicazione.FIRMATO.name()));
                                aclService.setInheritedPermission(bindingSession, nodeRef, Boolean.TRUE);

                                if (property.equalsIgnoreCase(JCONON_ESCLUSIONE_STATO)) {
                                    Optional.ofNullable(cmisService.createAdminSession().getObject(document))
                                            .filter(Document.class::isInstance)
                                            .map(Document.class::cast)
                                            .ifPresent(document1 -> {
                                                final Optional<Folder> application = document1.getParents()
                                                        .stream()
                                                        .findAny()
                                                        .filter(Folder.class::isInstance)
                                                        .map(Folder.class::cast);
                                                if (application.isPresent()) {
                                                    application.get().updateProperties(Collections.singletonMap(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value(), "N"));

                                                }
                                            });
                                }
                            } catch (IOException e) {
                                throw new RuntimeException(e);
                            }
                        });
            }
        } else {
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
        }
        return result;
    }


    public void verifyPEC(VerificaPECTask verificaPECTask) {
        Properties props = new Properties();
        props.put("mail.imap.host", pecConfiguration.getHostImap());
        props.put("mail.imap.auth", pecConfiguration.getAuth());
        props.put("mail.imap.ssl.enable", pecConfiguration.getSslEnable());
        props.put("mail.imap.port", pecConfiguration.getPort());
        props.put("mail.imap.socketFactory.class", pecConfiguration.getSocketFactoryClass());
        props.put("mail.imap.connectiontimeout", pecConfiguration.getConnectiontimeout());
        props.put("mail.imap.timeout", pecConfiguration.getTimeout());
        final javax.mail.Session session = javax.mail.Session.getInstance(props);
        URLName urlName = new URLName(pecConfiguration.getUrl());
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
                try {
                    Optional<String> cmisObjectId = Optional.of(message.getSubject()).
                            map(subject -> subject.indexOf("$$")).
                            filter(index -> index > -1)
                            .map(index -> subjectMessage.substring(index + 3));
                    if (cmisObjectId.isPresent()) {
                        final Date receivedDate = message.getReceivedDate();
                        LOGGER.info("Trovato messaggio sulla PEC con id: {} data spedizione: {} data ricezione: {}",
                                cmisObjectId.get(), verificaPECTask.getSendDate(), receivedDate);
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
                } catch (CmisObjectNotFoundException _ex) {
                    LOGGER.error("ERROR while SCAN PEC MAIL cannot find object with subject {}", subjectMessage, _ex);
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
                                  String callId, String userName, String password, AddressType addressFromApplication, Boolean pec) throws IOException {
        Folder call = (Folder) session.getObject(callId);
        ItemIterable<QueryResult> convocazioni = session.query(query, false);
        long index = 0;
        String subject = i18NService.getLabel("subject-info", Locale.ITALIAN) +
                i18NService.getLabel("subject-confirm-convocazione", Locale.ITALIAN,
                        call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString());
        for (QueryResult convocazione : convocazioni.getPage(Integer.MAX_VALUE)) {
            Document convocazioneObject = (Document) session.getObject((String) convocazione.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            aclService.setInheritedPermission(bindingSession,
                    convocazioneObject.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(),
                    true);
            String contentURL = contexURL + "/rest/application/convocazione?nodeRef=" + convocazioneObject.getId();
            if (!pec) {
                addressFromApplication = AddressType.EMAIL;
            }
            String address = obtainAddress(convocazioneObject,
                    "jconon_convocazione:email_pec",
                    "jconon_convocazione:email",
                    addressFromApplication);
            String user = convocazioneObject.<String>getPropertyValue(JCONONPropertyIds.ATTACHMENT_USER.value());

            List<Document> attachmentRelated =
                    Optional.ofNullable(convocazioneObject.<String>getPropertyValue(JCONONPropertyIds.ATTACHMENT_RELATED.value()))
                        .map(s -> Arrays.asList(s.split(",")))
                        .orElse(Collections.emptyList())
                        .stream()
                        .map(s -> session.getObject(s))
                        .filter(Document.class::isInstance)
                        .map(Document.class::cast)
                        .collect(Collectors.toList());
            String content = "Con riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, si invia in allegato la relativa convocazione.<br>";
            if (pec) {
                content += "Per i candidati che non hanno indicato in domanda un indirizzo PEC o che non lo hanno comunicato in seguito, ";
            }
            content += "é richiesta conferma di ricezione della presente cliccando sul seguente <a href=\"" + contentURL + "\">link</a>, <br/>qualora non dovesse funzionare copi questo [\"" + contentURL + "\"] nella barra degli indirizzi del browser.<br/><br/>";
            content += "Distinti saluti.<br/><br/><br/><hr/>";
            content += "<b>Questo messaggio e' stato generato da un sistema automatico. Si prega di non rispondere.</b><br/><br/>";

            MultiPartEmail simplePECMail = pec ? new SimplePECMail(userName, password):new MultiPartEmail();
            try {
                simplePECMail.setSubject(subject + " $$ " + convocazioneObject.getId());
                if (pec) {
                    simplePECMail.setHostName(pecConfiguration.getHostSmtp());
                    simplePECMail.setFrom(userName);
                } else {
                    final Optional<String> smtpuser = Optional.ofNullable(env.getProperty("mail.smtp.user")).filter(s -> !s.isEmpty());
                    final Optional<String> smtppassword = Optional.ofNullable(env.getProperty("mail.smtp.password")).filter(s -> !s.isEmpty());
                    if (smtpuser.isPresent() && smtppassword.isPresent()) {
                        simplePECMail.setAuthentication(smtpuser.get(),smtppassword.get());
                    }
                    simplePECMail.setHostName(env.getProperty("mail.smtp.host"));
                    simplePECMail.setFrom(env.getProperty("mail.from.default"));
                }
                simplePECMail.setReplyTo(Collections.singleton(new InternetAddress("undisclosed-recipients")));
                simplePECMail.setTo(Collections.singleton(new InternetAddress(address)));
                simplePECMail.attach(new ByteArrayDataSource(new ByteArrayInputStream(content.getBytes()),
                        "text/html"), "", "", EmailAttachment.INLINE);
                simplePECMail.attach(new ByteArrayDataSource(convocazioneObject.getContentStream().getStream(),
                                convocazioneObject.getContentStreamMimeType()),
                        convocazioneObject.getName(), convocazioneObject.getName());
                if (!attachmentRelated.isEmpty()) {
                    for (Document doc : attachmentRelated) {
                        simplePECMail.attach(new ByteArrayDataSource(doc.getContentStream().getStream(),
                                        doc.getContentStreamMimeType()),
                                doc.getName(), doc.getName());
                        aclService.addAcl(
                                bindingSession,
                                doc.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                                Stream.of(
                                        new AbstractMap.SimpleEntry<>(user, ACLType.Consumer)
                                ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                        );
                    }
                }
                simplePECMail.send();

                Map<String, Object> properties = new HashMap<String, Object>();
                properties.put(JCONON_CONVOCAZIONE_STATO, StatoComunicazione.SPEDITO.name());
                convocazioneObject.updateProperties(properties);
                index++;
            } catch (EmailException | AddressException e) {
                LOGGER.error("Cannot send email to {}", address, e);
                if (e.getCause() instanceof AuthenticationFailedException) {
                    throw new ClientMessageException("Autenticazione fallita controllare username e password!");
                }
            }
            if (Optional.ofNullable(ioClient).isPresent()) {
                Optional<String> fiscalCode =
                        convocazioneObject
                                .getParents()
                                .stream()
                                .findAny()
                                .flatMap(folder -> Optional.ofNullable(
                                            folder.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value())
                                        )
                                );
                if (fiscalCode.isPresent()) {
                    try {
                        NewMessage newMessage = new NewMessage();
                        newMessage.setTimeToLive(7200);
                        newMessage.setFiscalCode(fiscalCode.get());
                        MessageContent2 messageContent2 = new MessageContent2();
                        messageContent2.setSubject(
                                StringUtils.rightPad(
                                        "Bando ".concat(call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString()),
                                        10
                                )
                        );
                        messageContent2.setMarkdown("# Convocazione\n" +
                                "In riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, Le inviamo la seguente *Convocazione*, che può essere scaricata attraverso il seguente link:\n" +
                                "\n" +
                                "[Scarica la Convocazione]("+contentURL+")\n" +
                                "\n" +
                                "Distinti saluti.");
                        newMessage.setContent(messageContent2);
                        if (Optional.ofNullable(ioClient.getProfile(fiscalCode.get()))
                                .map(limitedProfile -> Optional.ofNullable(limitedProfile.getSenderAllowed()).orElse(Boolean.TRUE))
                                .orElse(Boolean.FALSE)) {
                            final InlineResponse201 inlineResponse201 = ioClient.submitMessageforUser(fiscalCode.get(), newMessage);
                            LOGGER.info("The IO message was successfully sent to {} with Id: {}", fiscalCode.get(), inlineResponse201.getId());
                        }
                    } catch (Exception e) {
                        LOGGER.error("Cannot send IO message to {}", fiscalCode.get(), e);
                    }
                }
            }
        }
        if (pec) {
            callRepository.removeVerificaPECTask(subject);
            callRepository.verificaPECTask(userName, password, subject, JCONON_CONVOCAZIONE_STATO);
        }
        return index;
    }

    public Long inviaEsclusioni(Session session, BindingSession bindingSession, String query, String contexURL,
                                String userId, String callId, String userName, String password, AddressType addressFromApplication, Boolean pec) throws IOException {
        Folder call = (Folder) session.getObject(callId);
        ItemIterable<QueryResult> esclusioni = session.query(query, false);
        String subject = i18NService.getLabel("subject-info", Locale.ITALIAN) +
                i18NService.getLabel("subject-confirm-esclusione",
                        Locale.ITALIAN,
                        call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString());
        long index = 0;
        for (QueryResult esclusione : esclusioni.getPage(Integer.MAX_VALUE)) {
            Document esclusioneObject = (Document) session.getObject((String) esclusione.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            final Optional<Folder> application = esclusioneObject.getParents().stream().findFirst();
            if (application.isPresent() &&
                    !Optional.ofNullable(
                            application.get().getPropertyValue(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value())
                    ).isPresent()) {
                Map<String, Serializable> properties = new HashMap<String, Serializable>();
                properties.put(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value(), ApplicationService.StatoDomanda.ESCLUSA.getValue());
                cmisService.createAdminSession().getObject(application.get()).updateProperties(properties);
                Map<String, ACLType> acesToRemove = new HashMap<String, ACLType>();
                List<String> groups = getGroupsCallToApplication(call);
                for (String group : groups) {
                    acesToRemove.put(group, ACLType.Contributor);
                }
                aclService.removeAcl(cmisService.getAdminSession(),
                        application.get().getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), acesToRemove);
            }
            aclService.setInheritedPermission(bindingSession,
                    esclusioneObject.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(),
                    true);
            String contentURL = contexURL + "/rest/application/esclusione?nodeRef=" + esclusioneObject.getId();
            String user = esclusioneObject.<String>getPropertyValue(JCONONPropertyIds.ATTACHMENT_USER.value());
            List<Document> attachmentRelated =
                    Optional.ofNullable(esclusioneObject.<String>getPropertyValue(JCONONPropertyIds.ATTACHMENT_RELATED.value()))
                            .map(s -> Arrays.asList(s.split(",")))
                            .orElse(Collections.emptyList())
                            .stream()
                            .map(s -> session.getObject(s))
                            .filter(Document.class::isInstance)
                            .map(Document.class::cast)
                            .collect(Collectors.toList());
            if (!pec) {
                addressFromApplication = AddressType.EMAIL;
            }
            String address = obtainAddress(esclusioneObject,
                    "jconon_esclusione:email_pec",
                    "jconon_esclusione:email",
                    addressFromApplication);
            String content = "Con riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, si invia in allegato la relativa esclusione.<br>";
            content += "Distinti saluti.<br/><br/><br/><hr/>";
            content += "<b>Questo messaggio e' stato generato da un sistema automatico. Si prega di non rispondere.</b><br/><br/>";

            MultiPartEmail simplePECMail = pec ? new SimplePECMail(userName, password):new MultiPartEmail();
            try {
                simplePECMail.setSubject(subject + " $$ " + esclusioneObject.getId());
                if (pec) {
                    simplePECMail.setHostName(pecConfiguration.getHostSmtp());
                    simplePECMail.setFrom(userName);
                } else {
                    final Optional<String> smtpuser = Optional.ofNullable(env.getProperty("mail.smtp.user")).filter(s -> !s.isEmpty());
                    final Optional<String> smtppassword = Optional.ofNullable(env.getProperty("mail.smtp.password")).filter(s -> !s.isEmpty());
                    if (smtpuser.isPresent() && smtppassword.isPresent()) {
                        simplePECMail.setAuthentication(smtpuser.get(),smtppassword.get());
                    }
                    simplePECMail.setHostName(env.getProperty("mail.smtp.host"));
                    simplePECMail.setFrom(env.getProperty("mail.from.default"));
                }
                simplePECMail.setReplyTo(Collections.singleton(new InternetAddress("undisclosed-recipients")));
                simplePECMail.setTo(Collections.singleton(new InternetAddress(address)));
                simplePECMail.attach(new ByteArrayDataSource(new ByteArrayInputStream(content.getBytes()),
                        "text/html"), "", "", EmailAttachment.INLINE);
                simplePECMail.attach(new ByteArrayDataSource(esclusioneObject.getContentStream().getStream(),
                                esclusioneObject.getContentStreamMimeType()),
                        esclusioneObject.getName(), esclusioneObject.getName());
                if (!attachmentRelated.isEmpty()) {
                    for (Document doc : attachmentRelated) {
                        simplePECMail.attach(new ByteArrayDataSource(doc.getContentStream().getStream(),
                                        doc.getContentStreamMimeType()),
                                doc.getName(), doc.getName());
                        aclService.addAcl(
                                bindingSession,
                                doc.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                                Stream.of(
                                        new AbstractMap.SimpleEntry<>(user, ACLType.Consumer)
                                ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                        );
                    }
                }
                simplePECMail.send();
                Map<String, Object> properties = new HashMap<String, Object>();
                properties.put(JCONON_ESCLUSIONE_STATO, StatoComunicazione.SPEDITO.name());
                esclusioneObject.updateProperties(properties);
                index++;
            } catch (EmailException | AddressException e) {
                LOGGER.error("Cannot send email to {}", address, e);
            }
            if (Optional.ofNullable(ioClient).isPresent()) {
                Optional<String> fiscalCode =
                        esclusioneObject
                                .getParents()
                                .stream()
                                .findAny()
                                .flatMap(folder -> Optional.ofNullable(
                                        folder.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value())
                                        )
                                );
                if (fiscalCode.isPresent()) {
                    try {
                        NewMessage newMessage = new NewMessage();
                        newMessage.setTimeToLive(7200);
                        newMessage.setFiscalCode(fiscalCode.get());
                        MessageContent2 messageContent2 = new MessageContent2();
                        messageContent2.setSubject(
                                StringUtils.rightPad(
                                        "Bando ".concat(call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString()),
                                        10
                                )
                        );
                        messageContent2.setMarkdown("# Esclusione\n" +
                                "In riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, Le inviamo la seguente *Esclusione*, che può essere scaricata attraverso il seguente link:\n" +
                                "\n" +
                                "[Scarica l'Esclusione]("+contentURL+")\n" +
                                "\n" +
                                "Distinti saluti.");
                        newMessage.setContent(messageContent2);
                        if (Optional.ofNullable(ioClient.getProfile(fiscalCode.get()))
                                .map(limitedProfile -> Optional.ofNullable(limitedProfile.getSenderAllowed()).orElse(Boolean.TRUE))
                                .orElse(Boolean.FALSE)) {
                            final InlineResponse201 inlineResponse201 = ioClient.submitMessageforUser(fiscalCode.get(), newMessage);
                            LOGGER.info("The IO message was successfully sent to {} with Id: {}", fiscalCode.get(), inlineResponse201.getId());
                        }
                    } catch (Exception e) {
                        LOGGER.error("Cannot send IO message to {}", fiscalCode.get(), e);
                    }
                }
            }
        }
        if (pec) {
            callRepository.removeVerificaPECTask(subject);
            callRepository.verificaPECTask(userName, password, subject, JCONON_ESCLUSIONE_STATO);
        }
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
            simplePECMail.setHostName(pecConfiguration.getHostSmtp());
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

    private String obtainAddress(Document document, String propertyEmailPec, String propertyEmail, AddressType fromApplication) {
        String address = Optional.ofNullable(document.getProperty(propertyEmailPec).getValueAsString())
                .orElse(document.getProperty(propertyEmail).getValueAsString());
        if (address == null || !fromApplication.equals(AddressType.DOC)) {
            address = document.getParents()
                    .stream()
                    .filter(folder -> folder.getFolderType().getId().equals(JCONONFolderType.JCONON_APPLICATION.value()))
                    .map(application -> Optional.ofNullable(application.getProperty(
                            fromApplication.equals(AddressType.PEC) ? JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value() :
                                    JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value()).getValueAsString())
                            .orElseGet(() -> {
                                CMISUser applicationUser;
                                try {
                                    applicationUser = userService.loadUserForConfirm(
                                            application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
                                } catch (CoolUserFactoryException e) {
                                    throw new ClientMessageException("User not found of application " + application, e);
                                }
                                return applicationUser.getEmail();
                            })
                    ).findFirst().get();
        }
        if (env.acceptsProfiles(Profile.DEVELOPMENT.value())) {
            address = env.getProperty("mail.to.error.message");
        }
        return address;
    }

    public Long inviaComunicazioni(Session session, BindingSession bindingSession, String query, String contexURL, String userId,
                                   String callId, String userName, String password, AddressType addressFromApplication, Boolean pec) throws IOException {
        Folder call = (Folder) session.getObject(callId);
        String subject = i18NService.getLabel("subject-info", Locale.ITALIAN) +
                i18NService.getLabel("subject-confirm-comunicazione",
                        Locale.ITALIAN,
                        call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString());
        ItemIterable<QueryResult> comunicazioni = session.query(query, false);
        long index = 0;
        for (QueryResult comunicazione : comunicazioni.getPage(Integer.MAX_VALUE)) {
            Document comunicazioneObject = (Document) session.getObject((String) comunicazione.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            aclService.setInheritedPermission(bindingSession,
                    comunicazioneObject.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(),
                    true);
            if (!pec) {
                addressFromApplication = AddressType.EMAIL;
            }
            String address = obtainAddress(comunicazioneObject,
                    "jconon_comunicazione:email_pec",
                    "jconon_comunicazione:email",
                    addressFromApplication);
            String contentURL = contexURL + "/rest/application/comunicazione?nodeRef=" + comunicazioneObject.getId();
            String user = comunicazioneObject.<String>getPropertyValue(JCONONPropertyIds.ATTACHMENT_USER.value());
            List<Document> attachmentRelated =
                    Optional.ofNullable(comunicazioneObject.<String>getPropertyValue(JCONONPropertyIds.ATTACHMENT_RELATED.value()))
                            .map(s -> Arrays.asList(s.split(",")))
                            .orElse(Collections.emptyList())
                            .stream()
                            .map(s -> session.getObject(s))
                            .filter(Document.class::isInstance)
                            .map(Document.class::cast)
                            .collect(Collectors.toList());
            String content = "Con riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, si invia in allegato la relativa comunicazione.<br>";
            content += "Distinti saluti.<br/><br/><br/><hr/>";
            content += "<b>Questo messaggio e' stato generato da un sistema automatico. Si prega di non rispondere.</b><br/><br/>";

            MultiPartEmail simplePECMail = pec ? new SimplePECMail(userName, password):new MultiPartEmail();
            try {
                simplePECMail.setSubject(subject + " $$ " + comunicazioneObject.getId());
                if (pec) {
                    simplePECMail.setHostName(pecConfiguration.getHostSmtp());
                    simplePECMail.setFrom(userName);
                } else {
                    final Optional<String> smtpuser = Optional.ofNullable(env.getProperty("mail.smtp.user")).filter(s -> !s.isEmpty());
                    final Optional<String> smtppassword = Optional.ofNullable(env.getProperty("mail.smtp.password")).filter(s -> !s.isEmpty());
                    if (smtpuser.isPresent() && smtppassword.isPresent()) {
                        simplePECMail.setAuthentication(smtpuser.get(),smtppassword.get());
                    }
                    simplePECMail.setHostName(env.getProperty("mail.smtp.host"));
                    simplePECMail.setFrom(env.getProperty("mail.from.default"));
                }
                simplePECMail.setReplyTo(Collections.singleton(new InternetAddress("undisclosed-recipients")));
                simplePECMail.setTo(Collections.singleton(new InternetAddress(address)));
                simplePECMail.attach(new ByteArrayDataSource(new ByteArrayInputStream(content.getBytes()),
                        "text/html"), "", "", EmailAttachment.INLINE);
                simplePECMail.attach(new ByteArrayDataSource(comunicazioneObject.getContentStream().getStream(),
                                comunicazioneObject.getContentStreamMimeType()),
                        comunicazioneObject.getName(), comunicazioneObject.getName());
                if (!attachmentRelated.isEmpty()) {
                    for (Document doc : attachmentRelated) {
                        simplePECMail.attach(new ByteArrayDataSource(doc.getContentStream().getStream(),
                                        doc.getContentStreamMimeType()),
                                doc.getName(), doc.getName());
                        aclService.addAcl(
                                bindingSession,
                                doc.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                                Stream.of(
                                        new AbstractMap.SimpleEntry<>(user, ACLType.Consumer)
                                ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                        );
                    }
                }
                simplePECMail.send();
                Map<String, Object> properties = new HashMap<String, Object>();
                properties.put(JCONON_COMUNICAZIONE_STATO, StatoComunicazione.SPEDITO.name());
                comunicazioneObject.updateProperties(properties);
                index++;
            } catch (EmailException | AddressException e) {
                LOGGER.error("Cannot send email to {}", address, e);
            }
            if (Optional.ofNullable(ioClient).isPresent()) {
                Optional<String> fiscalCode =
                        comunicazioneObject
                                .getParents()
                                .stream()
                                .findAny()
                                .flatMap(folder -> Optional.ofNullable(
                                        folder.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value())
                                        )
                                );
                if (fiscalCode.isPresent()) {
                    try {
                        NewMessage newMessage = new NewMessage();
                        newMessage.setTimeToLive(7200);
                        newMessage.setFiscalCode(fiscalCode.get());
                        MessageContent2 messageContent2 = new MessageContent2();
                        messageContent2.setSubject(
                                StringUtils.rightPad(
                                        "Bando ".concat(call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString()),
                                        10
                                )
                        );                        messageContent2.setSubject(
                                StringUtils.rightPad("Bando ".concat(call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString()), 80)
                        );
                        messageContent2.setMarkdown("# Comunicazione\n" +
                                "In riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, Le inviamo la seguente *Comunicazione*, che può essere scaricata attraverso il seguente link:\n" +
                                "\n" +
                                "[Scarica la Comunicazione]("+contentURL+")\n" +
                                "\n" +
                                "Distinti saluti.");
                        newMessage.setContent(messageContent2);
                        if (Optional.ofNullable(ioClient.getProfile(fiscalCode.get()))
                                .map(limitedProfile -> Optional.ofNullable(limitedProfile.getSenderAllowed()).orElse(Boolean.TRUE))
                                .orElse(Boolean.FALSE)) {
                            final InlineResponse201 inlineResponse201 = ioClient.submitMessageforUser(fiscalCode.get(), newMessage);
                            LOGGER.info("The IO message was successfully sent to {} with Id: {}", fiscalCode.get(),inlineResponse201.getId());
                        }
                    } catch (Exception e) {
                        LOGGER.error("Cannot send IO message to {}", fiscalCode.get(), e);
                    }
                }
            }
        }
        if (pec) {
            callRepository.removeVerificaPECTask(subject);
            callRepository.verificaPECTask(userName, password, subject, JCONON_COMUNICAZIONE_STATO);
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
        String[] applications = mRequest.getParameterValues("application");
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
                    .map(s -> Double.valueOf(s))
                    .map(integer -> BigDecimal.valueOf(integer))
                    .orElseThrow(() -> new ClientMessageException("Il punteggio minimo di ammissione per [" + labelPunteggio + "] non è stato impostato!"));
            final BigDecimal punteggioLimite = Optional.ofNullable(call.<String>getPropertyValue(propertyCallPunteggioLimite))
                    .map(s -> Double.valueOf(s))
                    .map(integer -> BigDecimal.valueOf(integer))
                    .orElseThrow(() -> new ClientMessageException("Il punteggio massimo di ammissione per [" + labelPunteggio + "] non è stato impostato!"));
            if (punteggio.compareTo(punteggioLimite) > 0)
                throw new ClientMessageException("Il punteggio [" + punteggio + "] relativo a [" + labelPunteggio + "] supera il massimo [" + punteggioLimite + "]");

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
                            .orElseThrow(() -> new ClientMessageException("Domanda non trovata alla riga:" + row.getRowNum()));
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
                    BigDecimal punteggioProva6 =
                            Optional.ofNullable(callObject.<String>getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_6))
                                    .filter(s1 -> !s1.equalsIgnoreCase(PrintService.VUOTO))
                                    .map(s1 -> {
                                        return Optional.ofNullable(row.getCell(startCell.getAndIncrement()))
                                                .map(cell -> getCellValue(cell))
                                                .filter(s -> s.length() > 0)
                                                .map(s -> getBigDecimal(s))
                                                .orElse(null);
                                    }).orElse(null);
                    BigDecimal punteggioProva7 =
                            Optional.ofNullable(callObject.<String>getPropertyValue(PrintService.JCONON_CALL_PUNTEGGIO_7))
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
                            .filter(s -> Arrays.asList("V", "I", "S", "R", "").indexOf(s) != -1)
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
                    impostaPunteggio(callObject, propertyDefinitions, properties, punteggioProva6,
                            PrintService.JCONON_CALL_PUNTEGGIO_6, "jconon_call:punteggio_6_min", "jconon_call:punteggio_6_limite",
                            "jconon_application:punteggio_6", "jconon_application:fl_punteggio_6");
                    impostaPunteggio(callObject, propertyDefinitions, properties, punteggioProva7,
                            PrintService.JCONON_CALL_PUNTEGGIO_7, "jconon_call:punteggio_7_min", "jconon_call:punteggio_7_limite",
                            "jconon_application:punteggio_7", "jconon_application:fl_punteggio_7");

                    final BigDecimal totalePunteggio = Arrays.asList(
                            Optional.ofNullable(punteggioTitoli).orElse(BigDecimal.ZERO),
                            Optional.ofNullable(punteggioProvaScritta).orElse(BigDecimal.ZERO),
                            Optional.ofNullable(punteggioSecondProvaScritta).orElse(BigDecimal.ZERO),
                            Optional.ofNullable(punteggioColloquio).orElse(BigDecimal.ZERO),
                            Optional.ofNullable(punteggioProvaPratica).orElse(BigDecimal.ZERO),
                            Optional.ofNullable(punteggioProva6).orElse(BigDecimal.ZERO),
                            Optional.ofNullable(punteggioProva7).orElse(BigDecimal.ZERO)
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
            return BigDecimal.valueOf(NumberFormat.getNumberInstance(Locale.ITALIAN).parse(s.replace('.', ',')).doubleValue());
        } catch (ParseException e) {
            throw new ClientMessageException("Numero non valido [" + s + "]");
        }
    }

    private String getCellValue(Cell cell) {
        return cell.getCellType() == Cell.CELL_TYPE_NUMERIC ? String.valueOf(cell.getNumericCellValue()) : cell.getStringCellValue();
    }

    private Boolean convertFromString(String s) {
        if (s.equalsIgnoreCase("S") || s.equalsIgnoreCase("Y"))
            return Boolean.TRUE;
        return null;
    }

    public void protocolApplication(Session session) {
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        criteria.add(
                Restrictions.le(
                    JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(),
                    ISO8601DATEFORMAT.format(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()))
                )
        );
        criteria.add(
                Restrictions.ge(
                    JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(),
                    ISO8601DATEFORMAT.format(Date.from(LocalDateTime.now().minusDays(1).atZone(ZoneId.systemDefault()).toInstant()))
                )
        );
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

    public Long getTotalApplicationSend(Folder call) {
        Iterator<CmisObject> iterator = call.getChildren().iterator();
        int characteristics = Spliterator.DISTINCT | Spliterator.SORTED | Spliterator.ORDERED;
        Spliterator<CmisObject> spliterator = Spliterators.spliteratorUnknownSize(iterator, characteristics);
        boolean parallel = false;
        Stream<CmisObject> children = StreamSupport.stream(spliterator, parallel);
        return children
                .filter(cmisObject -> cmisObject.getType().getId().equals(JCONONFolderType.JCONON_APPLICATION.value()))
                .filter(cmisObject -> cmisObject.getPropertyValue(
                        JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(ApplicationService.StatoDomanda.CONFERMATA.getValue()))
                .count();
    }

    public ItemIterable<QueryResult> getApplicationConfirmed(Session session, Folder call) {
        Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaDomande.add(Restrictions.inTree(call.getId()));
        criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaDomande.addOrder(Order.asc(JCONONPropertyIds.APPLICATION_COGNOME.value()));
        return criteriaDomande.executeQuery(session, false, session.getDefaultContext());
    }

    public boolean isMacroCall(Folder call) {
        return call.getSecondaryTypes()
                .stream()
                .map(SecondaryType::getId)
                .filter(s -> s.equalsIgnoreCase(JCONONPolicyType.JCONON_MACRO_CALL.value()))
                .findAny().isPresent();
    }

    public void protocolApplication(Session session, Folder call) {
        LOGGER.info("Start protocol application for call {}", call.getName());
        Calendar dataFineDomande = (Calendar) call.getProperty(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value()).getFirstValue();
        SecondaryType objectTypeProtocollo = (SecondaryType) session.getTypeDefinition("P:jconon_protocollo:common");
        ItemIterable<QueryResult> domande = getApplicationConfirmed(session, call);
        final long totalNumItems = domande.getTotalNumItems();
        if (totalNumItems != getTotalApplicationSend(call) && !isMacroCall(call)) {
            mailService.sendErrorMessage("protocol", "ERROR SOLR", "For call " + call.getName());
        }
        if (totalNumItems != 0) {
            long numProtocollo = protocolRepository.getNumProtocollo(ProtocolRepository.ProtocolRegistry.DOM.name(), String.valueOf(dataFineDomande.get(Calendar.YEAR)));
            try {
                List<Folder> applications = StreamSupport.stream(call.getChildren().spliterator(), false)
                        .filter(cmisObject -> cmisObject.getType().getId().equals(JCONONFolderType.JCONON_APPLICATION.value()))
                        .filter(cmisObject -> cmisObject.getPropertyValue(
                                JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(ApplicationService.StatoDomanda.CONFERMATA.getValue()))
                        .filter(Folder.class::isInstance)
                        .map(Folder.class::cast)
                        .collect(Collectors.toList());
                for (Folder domanda : applications) {
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

    public Map<String, String> aggiornaProtocolloDomande(Session currentCMISSession, String idCall, Locale locale, String contextURL, CMISUser user) {
        final String userId = user.getId();
        Folder call = (Folder) currentCMISSession.getObject(idCall);
        if (!isMemberOfRDPGroup(user, (Folder) currentCMISSession.getObject(idCall)) && !user.isAdmin() && !isMemberOfConcorsiGroup(user)) {
            LOGGER.error("USER:" + userId + " try to aggiornaProtocolloDomande for call:" + idCall);
            throw new ClientMessageException("USER:" + userId + " try to genera graduatoria for call:" + idCall);
        }
        final Optional<Document> docGraduatoria = Optional.ofNullable(competitionService.findAttachmentId(
                currentCMISSession,
                idCall,
                JCONONDocumentType.JCONON_ATTACHMENT_CALL_CLASSIFICATION))
                .map(s -> currentCMISSession.getObject(s))
                .filter(Document.class::isInstance)
                .map(Document.class::cast);
        final Optional<Document> docScorrimento = Optional.ofNullable(competitionService.findAttachmentId(
                currentCMISSession,
                idCall,
                JCONONDocumentType.JCONON_ATTACHMENT_CALL_RECRUITMENT_PROVISION))
                .map(s -> currentCMISSession.getObject(s))
                .filter(Document.class::isInstance)
                .map(Document.class::cast);

        if (docGraduatoria.isPresent()) {
            aggiornaProtocolloGraduatoria(
                    call,
                    docGraduatoria.get().getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                    docGraduatoria.get().getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value())
            );
        } else {
            throw new ClientMessageException(
                    i18NService.getLabel(
                            "message.jconon_call_message_graduatoria_not_found",
                            locale,
                            call.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())
                    )
            );
        }
        if (docScorrimento.isPresent()) {
            aggiornaProtocolloScorrimento(
                    call,
                    docScorrimento.get().getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                    docScorrimento.get().getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value())
            );
        }
        return Stream.of(new String[][]{
                {JCONONPropertyIds.PROTOCOLLO_NUMERO.value(), docGraduatoria.get().getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value())},
                {JCONONPropertyIds.PROTOCOLLO_DATA.value(),
                        docGraduatoria.get().<GregorianCalendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value())
                                .toZonedDateTime()
                                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                },
        }).collect(Collectors.toMap(data -> data[0], data -> data[1]));
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
            if (Optional.ofNullable(domanda.<Boolean>getPropertyValue(JCONONPropertyIds.APPLICATION_RITIRO.value()))
                    .orElse(Boolean.FALSE)) {
                continue;
            }
            result.put(
                    domanda.getId(),
                    Arrays.asList(
                            printService.formatPunteggio(domanda.getPropertyValue("jconon_application:punteggio_titoli")),
                            printService.formatPunteggio(domanda.getPropertyValue("jconon_application:punteggio_scritto")),
                            printService.formatPunteggio(domanda.getPropertyValue("jconon_application:punteggio_secondo_scritto")),
                            printService.formatPunteggio(domanda.getPropertyValue("jconon_application:punteggio_colloquio")),
                            printService.formatPunteggio(domanda.getPropertyValue("jconon_application:punteggio_prova_pratica")),
                            printService.formatPunteggio(domanda.getPropertyValue("jconon_application:punteggio_6")),
                            printService.formatPunteggio(domanda.getPropertyValue("jconon_application:punteggio_7"))
                    ).stream().reduce(BigDecimal.ZERO, BigDecimal::add)
            );
        }
        int[] idx = {0};
        result.entrySet().stream()
                .sorted(Comparator.comparing(stringBigDecimalEntry -> stringBigDecimalEntry.getValue(), Comparator.reverseOrder()))
                .forEach(stringBigDecimalEntry -> {
                    Map<String, Object> properties = new HashMap<String, Object>();
                    properties.put("jconon_application:graduatoria", ++idx[0]);
                    LOGGER.info("Domanda di {} graduatoria {}", cmisService.createAdminSession().getObject(stringBigDecimalEntry.getKey()).getName(), idx);
                    cmisService.createAdminSession().getObject(stringBigDecimalEntry.getKey()).updateProperties(properties);
                });
    }

    public void printCurriculumStrutturato(Session currentCMISSession, String idCall, Locale locale, String contextURL) {
        OperationContext context = currentCMISSession.getDefaultContext();
        context.setMaxItemsPerPage(Integer.MAX_VALUE);

        Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaDomande.addColumn(PropertyIds.OBJECT_ID);

        criteriaDomande.add(Restrictions.inTree(idCall));
        criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaDomande.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        criteriaDomande.add(Restrictions.or(
                Restrictions.isNull(JCONONPropertyIds.APPLICATION_RITIRO.value()),
                Restrictions.eq(JCONONPropertyIds.APPLICATION_RITIRO.value(), Boolean.FALSE)
        ));
        ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(currentCMISSession, false, context);
        for (QueryResult item : domande.getPage(Integer.MAX_VALUE)) {
            String applicationId = item.<String>getPropertyValueById(PropertyIds.OBJECT_ID);
            if (!Optional.ofNullable(competitionService.findAttachmentId(currentCMISSession, applicationId, JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE_STRUTTURATO)).isPresent()) {
                printService.printCurriculumStrutturato(currentCMISSession, applicationId, contextURL, locale);
            }
        }
    }

    public void aggiornaProtocolloGraduatoria(Folder call, String numeroProtocollo, GregorianCalendar dataProtocollo) {
        if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
            throw new ClientMessageException("message.error.call.cannnot.modify");
        Session session = cmisService.createAdminSession();
        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaApplications.add(Restrictions.inFolder(call.getPropertyValue(PropertyIds.OBJECT_ID)));
        criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        criteriaApplications.add(Restrictions.in(JCONONPropertyIds.APPLICATION_ESITO_CALL.value(), "V", "I", "S"));
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

    public Map<String, List<?>> estraiGraduatorie(Session session, String codice) {
        if (!Optional.ofNullable(codice).isPresent())
            throw new ClientMessageException("Valorizzare il codice del Bando");
        Criteria criteriaCalls = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        criteriaCalls.addColumn(PropertyIds.OBJECT_ID);
        criteriaCalls.addColumn(JCONONPropertyIds.CALL_CODICE.value());
        criteriaCalls.add(Restrictions.like(JCONONPropertyIds.CALL_CODICE.value(), "%".concat(codice.trim()).concat("%")));
        ItemIterable<QueryResult> calls = criteriaCalls.executeQuery(session, false, session.getDefaultContext());
        Map<String, List<?>> result = new HashMap<String, List<?>>();
        for (QueryResult call : calls.getPage(Integer.MAX_VALUE)) {
            List<Object> apps = new ArrayList<>();
            result.put(call.getPropertyValueById(JCONONPropertyIds.CALL_CODICE.value()), apps);
            Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());

            criteriaApplications.addColumn(JCONONPropertyIds.APPLICATION_USER.value());
            criteriaApplications.addColumn(JCONONPropertyIds.APPLICATION_NOME.value());
            criteriaApplications.addColumn(JCONONPropertyIds.APPLICATION_COGNOME.value());
            criteriaApplications.addColumn(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());
            criteriaApplications.addColumn(JCONONPropertyIds.APPLICATION_TOTALE_PUNTEGGIO.value());
            criteriaApplications.addColumn(JCONONPropertyIds.APPLICATION_GRADUATORIA.value());
            criteriaApplications.addColumn(JCONONPropertyIds.APPLICATION_ESITO_CALL.value());

            criteriaApplications.add(Restrictions.inTree(call.getPropertyValueById(PropertyIds.OBJECT_ID)));
            criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
            criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
            criteriaApplications.addOrder(Order.asc(JCONONPropertyIds.APPLICATION_GRADUATORIA.value()));

            ItemIterable<QueryResult> applications = criteriaApplications.executeQuery(session, false, session.getDefaultContext());
            for (QueryResult application : applications.getPage(Integer.MAX_VALUE)) {
                apps.add(application.getProperties()
                        .stream()
                        .collect(Collectors.toMap(
                                PropertyData::getId,
                                PropertyData::getFirstValue,
                                (oldValue, newValue) -> oldValue,
                                Hashtable::new
                        )));
            }
        }
        return result;
    }

    public Map<String, Object> findCalls(Session session, Integer page, Integer offset, String type, FilterType filterType, String callCode,
                                         LocalDate inizioScadenza, LocalDate fineScadenza, String profilo,
                                         String numeroGazzetta, LocalDate dataGazzetta, String requisiti,
                                         String struttura, String sede) {
        Map<String, Object> model = new HashMap<String, Object>();
        OperationContext defaultContext = OperationContextUtils.copyOperationContext(session.getDefaultContext());
        Optional.ofNullable(offset).ifPresent(integer -> defaultContext.setMaxItemsPerPage(integer));
        Criteria criteriaCalls = CriteriaFactory.createCriteria(type, "root");
        criteriaCalls.addColumn(PropertyIds.OBJECT_ID);
        criteriaCalls.add(Restrictions.inTree(competitionService.getCompetitionFolder().getString("id")));
        if (Optional.ofNullable(filterType).isPresent()) {
            if (filterType.equals(FilterType.active)) {
                criteriaCalls.add(Restrictions.le(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value(),
                        LocalDateTime.now().atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)));
                criteriaCalls.add(
                    Restrictions.or(
                        Restrictions.ge(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(),
                                LocalDateTime.now().atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)),
                        Restrictions.isNull(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value())
                    )
                );
            } else if (filterType.equals(FilterType.expire)){
                criteriaCalls.add(Restrictions.le(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(),
                        LocalDateTime.now().atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)));
            }
        }
        if (Optional.ofNullable(callCode).filter(s -> s.length() > 0).isPresent()) {
            criteriaCalls.add(Restrictions.contains(JCONONPropertyIds.CALL_CODICE.value(),
                    Optional.ofNullable(callCode)
                        .map(s -> "\'*".concat(s).concat("*\''"))
                        .orElse("")
            ));
        }
        if (Optional.ofNullable(inizioScadenza).isPresent()) {
            criteriaCalls.add(Restrictions.ge(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(),
                   inizioScadenza.atStartOfDay().format(DateTimeFormatter.ISO_DATE_TIME)
            ));
        }
        if (Optional.ofNullable(fineScadenza).isPresent()) {
            criteriaCalls.add(Restrictions.le(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(),
                    fineScadenza.atTime(23,59,59).format(DateTimeFormatter.ISO_DATE_TIME)
            ));
        }
        if (Optional.ofNullable(profilo).filter(s -> s.length() > 0).isPresent()) {
            Criteria criteriaProfile = criteriaCalls.createCriteria(
                    JCONONPolicyType.JCONON_CALL_ASPECT_INQUADRAMENTO.queryName(),
                    JCONONPolicyType.JCONON_CALL_ASPECT_INQUADRAMENTO.queryName()
            );
            criteriaProfile.addJoinCriterion(Restrictions.eqProperty(
                    criteriaCalls.prefix(PropertyIds.OBJECT_ID),
                    criteriaProfile.prefix(PropertyIds.OBJECT_ID)));

            criteriaProfile.add(Restrictions.eq(
                    JCONONPolicyType.JCONON_CALL_ASPECT_INQUADRAMENTO.queryName().concat(".").concat(JCONONPropertyIds.CALL_PROFILO.value()),
                    profilo)
            );
        }
        if (Optional.ofNullable(numeroGazzetta).filter(s -> s.length() > 0).isPresent() ||
                Optional.ofNullable(dataGazzetta).isPresent()) {
            Criteria criteriaGU = criteriaCalls.createCriteria(
                    JCONONPolicyType.JCONON_CALL_ASPECT_GU.queryName(),
                    JCONONPolicyType.JCONON_CALL_ASPECT_GU.queryName()
            );
            criteriaGU.addJoinCriterion(Restrictions.eqProperty(
                    criteriaCalls.prefix(PropertyIds.OBJECT_ID),
                    criteriaGU.prefix(PropertyIds.OBJECT_ID)));
            if (Optional.ofNullable(numeroGazzetta).filter(s -> s.length() > 0).isPresent()){
                criteriaGU.add(Restrictions.eq(
                        JCONONPolicyType.JCONON_CALL_ASPECT_GU.queryName().concat(".").concat(JCONONPropertyIds.CALL_NUMERO_GU.value()),
                        numeroGazzetta)
                );
            }
            if (Optional.ofNullable(dataGazzetta).isPresent()){
                criteriaGU.add(Restrictions.between(
                        JCONONPolicyType.JCONON_CALL_ASPECT_GU.queryName().concat(".").concat(JCONONPropertyIds.CALL_DATA_GU.value()),
                        dataGazzetta.atStartOfDay().format(DateTimeFormatter.ISO_DATE_TIME),
                        dataGazzetta.atTime(23,59,59).format(DateTimeFormatter.ISO_DATE_TIME))
                );
            }
        }
        if (Optional.ofNullable(requisiti).filter(s -> s.length() > 0).isPresent()) {
            criteriaCalls.add(Restrictions.contains(JCONONPropertyIds.CALL_REQUISITI.value(),
                    Optional.ofNullable(requisiti)
                            .map(s -> "\'*".concat(s).concat("*\''"))
                            .orElse("")
            ));
        }
        if (Optional.ofNullable(struttura).filter(s -> s.length() > 0).isPresent()) {
            criteriaCalls.add(Restrictions.contains(JCONONPropertyIds.CALL_SEDE.value(),
                    Optional.ofNullable(struttura)
                            .map(s -> "\'*".concat(s).concat("*\''"))
                            .orElse("")
            ));
        }
        if (Optional.ofNullable(sede).filter(s -> s.length() > 0).isPresent()) {
            criteriaCalls.add(Restrictions.contains(JCONONPropertyIds.CALL_STRUTTURA_DESTINATARIA.value(),
                    Optional.ofNullable(sede)
                            .map(s -> "\'*".concat(s).concat("*\''"))
                            .orElse("")
            ));
        }
        List<Map<String, Object>> items = new ArrayList<>();
        ItemIterable<QueryResult> calls = criteriaCalls.executeQuery(session, false, defaultContext)
                .skipTo(page * defaultContext.getMaxItemsPerPage()).getPage(defaultContext.getMaxItemsPerPage());
        final long totalNumItems = calls.getTotalNumItems();
        for (QueryResult result : calls) {
            items.add(
                CMISUtil.convertToProperties(
                        session.getObject(result.<String>getPropertyValueById(PropertyIds.OBJECT_ID), defaultContext)
                )
            );
        }
        model.put("count", totalNumItems);
        model.put("page", page);
        model.put("offset", defaultContext.getMaxItemsPerPage());
        model.put("items", items);
        model.put("hasMoreItems", calls.getHasMoreItems());
        return model;
    }

    public long generatePrintAndSave(Session session, String callId, final String contextURL, final Locale locale) {
        final ItemIterable<QueryResult> applicationConfirmed = getApplicationConfirmed(
                session,
                Optional.ofNullable(session.getObject(callId))
                        .filter(Folder.class::isInstance)
                        .map(Folder.class::cast)
                        .orElseThrow(() -> new ClientMessageException("Call not found"))
        );
        for (QueryResult application : applicationConfirmed.getPage(Integer.MAX_VALUE)) {
            printService.printApplicationImmediateAndSave(
                    session,
                    application.getPropertyValueById(PropertyIds.OBJECT_ID),
                    contextURL,
                    locale
            );
        }
        return applicationConfirmed.getTotalNumItems();
    }

    public Integer linkToCallChild(Session session, String callId, String id) {
        int index = 0;
        final Document document = Optional.ofNullable(session.getObject(id))
                .filter(Document.class::isInstance)
                .map(Document.class::cast)
                .orElseThrow(() -> new ClientMessageException("Document not found!"));

        Criteria criteriaCalls = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        criteriaCalls.addColumn(PropertyIds.OBJECT_ID);
        criteriaCalls.add(Restrictions.inFolder(callId));
        ItemIterable<QueryResult> calls = criteriaCalls.executeQuery(session, false, session.getDefaultContext());
        for (QueryResult queryResult : calls.getPage(Integer.MAX_VALUE)) {
            final String idChild = queryResult.<String>getPropertyValueById(PropertyIds.OBJECT_ID);
            try {
                document.addToFolder(session.getObject(idChild), true);
                index++;
            } catch (CmisRuntimeException _ex) {
                LOGGER.error("Cannot link file with id {} to folder width id {}", id, idChild);
            }
        }
        return index;
    }

    public Integer copyToCallChild(Session session, String callId, String id) {
        int index = 0;
        final Document document = Optional.ofNullable(session.getObject(id))
                .filter(Document.class::isInstance)
                .map(Document.class::cast)
                .orElseThrow(() -> new ClientMessageException("Document not found!"));

        Criteria criteriaCalls = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        criteriaCalls.addColumn(PropertyIds.OBJECT_ID);
        criteriaCalls.add(Restrictions.inFolder(callId));
        ItemIterable<QueryResult> calls = criteriaCalls.executeQuery(session, false, session.getDefaultContext());
        for (QueryResult queryResult : calls.getPage(Integer.MAX_VALUE)) {
            final String idChild = queryResult.<String>getPropertyValueById(PropertyIds.OBJECT_ID);
            try {
                final Folder folder = Optional.ofNullable(session.getObject(idChild))
                        .filter(Folder.class::isInstance)
                        .map(Folder.class::cast).orElseThrow(() -> new ClientMessageException("Cannot access to child folder!"));
                folder.createDocumentFromSource(document, Collections.emptyMap(), VersioningState.MAJOR);
                index++;
            } catch (CmisRuntimeException|CmisContentAlreadyExistsException _ex) {
                LOGGER.error("Cannot copy file with id {} to folder width id {}", id, idChild, _ex.getMessage());
            }
        }
        return index;
    }
}
