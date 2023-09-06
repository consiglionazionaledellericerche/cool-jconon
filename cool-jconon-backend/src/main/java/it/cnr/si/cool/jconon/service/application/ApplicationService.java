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

package it.cnr.si.cool.jconon.service.application;


import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import it.cnr.bulkinfo.BulkInfo;
import it.cnr.bulkinfo.BulkInfoImpl.FieldProperty;
import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.model.PolicyType;
import it.cnr.cool.cmis.service.*;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.security.GroupsEnum;
import it.cnr.cool.security.service.GroupService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.*;
import it.cnr.cool.web.scripts.exception.CMISApplicationException;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.*;
import it.cnr.si.cool.jconon.model.PrintParameterModel;
import it.cnr.si.cool.jconon.pagopa.model.PAGOPAObjectType;
import it.cnr.si.cool.jconon.pagopa.model.PAGOPAPropertyIds;
import it.cnr.si.cool.jconon.pagopa.model.Pendenza;
import it.cnr.si.cool.jconon.pagopa.model.PendenzaDTO;
import it.cnr.si.cool.jconon.pagopa.model.pagamento.RiferimentoAvvisoResponse;
import it.cnr.si.cool.jconon.pagopa.service.PAGOPAService;
import it.cnr.si.cool.jconon.repository.ProtocolRepository;
import it.cnr.si.cool.jconon.service.*;
import it.cnr.si.cool.jconon.service.cache.CompetitionFolderService;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.*;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.Order;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.client.util.OperationContextUtils;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.definitions.Choice;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.IncludeRelationships;
import org.apache.chemistry.opencmis.commons.enums.UnfileObject;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.*;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.*;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoField;
import java.util.*;
import java.util.Map.Entry;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Service
public class ApplicationService implements InitializingBean {
    public final static String FINAL_APPLICATION = "Domande definitive";
    protected final static List<String> EXCLUDED_TYPES = Arrays
            .asList("{http://www.cnr.it/model/jconon_attachment/cmis}application");
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
    @Autowired(required = false)
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
    private GroupService groupService;
    @Autowired
    private PAGOPAService pagopaService;
    @Autowired
    protected ProtocolRepository protocolRepository;
    @Autowired
    protected CommonsMultipartResolver resolver;

    @Value("${user.admin.username}")
    private String adminUserName;
    @Value("${block.submit.employee}")
    private Boolean blockSubmitEmployee;

    @Value("${application.reopen.email}")
    private Boolean emailOnReopen;

    @Autowired
    private QueueService queueService;
    @Value("${application.documents.notrequired}")
    private String[] documentsNotRequired;

    @Value("${application.send.validate-bean}")
    private String[] validateBeans;

    public Folder getMacroCall(Session cmisSession, Folder call) {
        Folder currCall = (Folder) cmisSession.getObject(call.getId());
        while (currCall != null &&
                !(typeService.hasSecondaryType(currCall, JCONONPolicyType.JCONON_MACRO_CALL.value()))) {
            if (currCall.getType().getId().equals(JCONONFolderType.JCONON_COMPETITION.value()))
                return null;
            currCall = currCall.getFolderParent();
        }
        return currCall;
    }

    public long findTotalNumApplication(Session cmisSession, Folder call) {
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.addColumn(PropertyIds.NAME);
        criteria.add(Restrictions.inTree(call.getId()));
        ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        return iterable.getTotalNumItems();
    }

    public long getTotalNumApplication(Session cmisSession, Folder call, String userId, String statoDomanda) {
        Folder macroCall = getMacroCall(cmisSession, call);
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

    public void finalCall(Session cmisSession, String objectId) {
        Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaDomande.add(Restrictions.inTree(objectId));
        criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue()));
        OperationContext context = cmisSession.getDefaultContext();
        context.setMaxItemsPerPage(1000);
        ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, context);
        for (QueryResult queryResultDomande : domande) {
            String applicationAttach = competitionService.findAttachmentId(cmisSession, (String) queryResultDomande.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue(),
                    JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION);
            if (applicationAttach != null) {
                Folder folderId = createFolderFinal(cmisSession, objectId);
                try {
                    ((FileableCmisObject) cmisSession.getObject(applicationAttach)).addToFolder(folderId, true);
                } catch (CmisRuntimeException _ex) {
                    LOGGER.error("Cannot find folder", _ex);
                }
            }
        }
    }

    private Folder createFolderFinal(Session cmisSession, String folderId) {
        Folder parent = (Folder) cmisSession.getObject(folderId);
        Map<String, Object> properties = new HashMap<String, Object>();
        properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_FOLDER.value());
        properties.put(PropertyIds.NAME, FINAL_APPLICATION);
        Folder folder;
        try {
            folder = parent.createFolder(properties);
        } catch (CmisContentAlreadyExistsException _ex) {
            LOGGER.error("error creating folder final {}", folderId, _ex);
            folder = (Folder) cmisSession.getObjectByPath(parent.getPath().concat("/").concat(FINAL_APPLICATION));
        }
        return folder;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
    }

    public String getCallGroupName(Folder call) {
        String groupName = "GROUP_".concat(call.getPropertyValue(PropertyIds.NAME));
        if (groupName.length() > 100)
            groupName = groupName.substring(0, 100);
        return groupName;
    }

    public Folder loadCallById(Session cmisSession, String callId) {
        return loadCallById(cmisSession, callId, null);
    }

    public Folder loadCallById(Session cmisSession, String callId, Map<String, Object> model) {
        if (callId == null || callId.isEmpty())
            throw new ClientMessageException("message.error.caller");
        if (model != null && !model.isEmpty() && model.get("call") != null && model.get("call").equals(callId))
            return (Folder) model.get("call");
        Folder call = null;
        try {
            call = (Folder) cmisSession.getObject(callId);
        } catch (CmisObjectNotFoundException ex) {
            throw new ClientMessageException("message.error.bando.assente", ex);
        } catch (CmisPermissionDeniedException ex) {
            throw new ClientMessageException("message.error.bando.assente", ex);
        } catch (CmisUnauthorizedException ex) {
            throw new ClientMessageException("message.error.user.not.authorized", ex);
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
        if (folderId == null || folderId.isEmpty())
            throw new ClientMessageException("message.error.caller");
        if (model != null && !model.isEmpty() && model.get("folder") != null && model.get("folder").equals(folderId))
            return (Folder) model.get("folder");
        Folder application = null;
        try {
            application = (Folder) cmisSession.getObject(folderId);
        } catch (CmisObjectNotFoundException ex) {
            throw new ClientMessageException("message.error.domanda.assente", ex);
        } catch (CmisUnauthorizedException|CmisPermissionDeniedException ex) {
            throw new ClientMessageException("message.error.user.not.authorized", ex);
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
                    if (relationship.getType().getId().equals(JCONONRelationshipType.JCONON_ATTACHMENT_IN_PRODOTTO.value())) {
                        relationship.getTarget().delete(true);
                    }
                }
            }
        }
        properties.put(
                PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
                secondaryTypes
                        .stream()
                        .map(SecondaryType::getId)
                        .collect(Collectors.toList())
        );
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
        } catch (CmisPermissionDeniedException _ex) {
            throw new ClientMessageException("user.cannot.access.to.application", _ex);
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
                throw new ClientMessageException("message.application.for.copy.alredy.exists", e);
            }
        }
        if (stato == HttpStatus.SC_NOT_FOUND) {
            throw new ClientMessageException("Paste Application error. Exception: " + resp.getErrorContent());
        }
        try {
            JSONObject jsonObject = new JSONObject(StringUtil.convertStreamToString(resp.getStream()));
            return jsonObject.getString("cmis:objectId");
        } catch (JSONException e) {
            throw new ClientMessageException("Paste Application error. Exception: " + resp.getErrorContent(), e);
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
        } catch (CmisPermissionDeniedException _ex) {
            throw new ClientMessageException("user.cannot.access.to.application", _ex);
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
                        jsonObject.put("groupConsumer", JcononGroups.APPLICATION_CONSUMER.group());
                        out.write(jsonObject.toString().getBytes());
                    }
                }, cmisService.getAdminSession());
        int status = resp.getResponseCode();
        if (status == HttpStatus.SC_NOT_FOUND || status == HttpStatus.SC_BAD_REQUEST || status == HttpStatus.SC_INTERNAL_SERVER_ERROR) {
            throw new CMISApplicationException("Reopen Application error. Exception: " + resp.getErrorContent());
        }
        addToQueueForPrint(applicationSourceId, contextURL, emailOnReopen);
    }

    protected void validateMacroCall(Folder call, Folder application, String userId) {
        Folder macroCall = competitionService.getMacroCall(cmisService.createAdminSession(), call);
        if (macroCall != null) {
            macroCall.refresh();
            Long numMaxDomandeMacroCall = Optional.ofNullable(macroCall.<BigInteger>getPropertyValue(JCONONPropertyIds.CALL_NUMERO_MAX_DOMANDE.value())).map(x -> x.longValue()).orElse(null);
            if (numMaxDomandeMacroCall != null) {
                Long numDomandeConfermate = callService.getTotalNumApplication(cmisService.createAdminSession(), macroCall, application, userId, StatoDomanda.CONFERMATA.getValue());
                if (numDomandeConfermate.compareTo(numMaxDomandeMacroCall) >= 0) {
                    if (!Optional.ofNullable(macroCall.<String>getPropertyValue(JCONONPropertyIds.CALL_GROUP_MULTIPLE_APPLICATION.value()))
                        .map(s -> s.substring(6))
                        .map(s -> groupService.children(s, cmisService.getAdminSession()))
                        .orElse(Collections.emptyList())
                        .stream()
                        .filter(cmisAuthority -> {
                            return cmisAuthority.getShortName().equalsIgnoreCase(userId);
                        })
                        .findAny()
                        .isPresent())
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

    @SuppressWarnings({"unchecked", "rawtypes"})
    private List<String> getAssociationList(Folder call) {
        List<String> associationList = new ArrayList<String>();
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS
                .value()) != null
                && !((List<?>) call
                .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS
                        .value())).isEmpty()) {
            associationList
                    .addAll(call
                            .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS
                                    .value()));
            associationList
                    .addAll(call
                            .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI
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

    @SuppressWarnings({"unchecked", "rawtypes"})
    private List<String> getSezioniDomandaList(Folder call) {
        List<String> sezioniDomandaList = new ArrayList<String>();
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA
                .value()) != null
                && !((List<?>) call
                .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA
                        .value())).isEmpty()) {
            sezioniDomandaList
                    .addAll(call
                            .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA
                                    .value()));
        }
        return sezioniDomandaList;
    }

    public void validateAllegatiLinked(Folder call, Folder application, Session cmisSession, Locale locale) {
        Properties props = i18nService.loadLabels(locale);
        props.putAll(competitionService.getDynamicLabels(call, cmisSession));

        StringBuilder listMonoRequired = new StringBuilder(), listMonoMultiInserted = new StringBuilder();
        boolean ctrlAlternativeAttivita = false, existVerificaAttivita = false, existRelazioneAttivita = false, existCurriculum = false;
        for (String associationCmisType : getAssociationList(call)) {
            ObjectType objectType = cmisSession.getTypeDefinition(associationCmisType);
            List<CmisObject> children = StreamSupport.stream(application.getChildren().spliterator(), false)
                    .filter(cmisObject -> cmisObject.getType().getId().equals(objectType.getId()))
                    .collect(Collectors.toList());
            long totalNumItems = 0;
            for (CmisObject cmisObject : children) {
                totalNumItems++;
                if (cmisObject.getProperty(PropertyIds.CONTENT_STREAM_LENGTH).getFirstValue() == null ||
                        ((BigInteger) cmisObject.getProperty(PropertyIds.CONTENT_STREAM_LENGTH).getFirstValue()).compareTo(BigInteger.ZERO) <= 0) {
                    throw new ClientMessageException("message.error.allegati.empty", i18nService.getLabel("message.error.allegati.empty", locale, cmisObject.getName()));
                }
            }
            if (hasParentType(objectType, JCONONDocumentType.JCONON_ATTACHMENT_MONO.value())) {
                if (totalNumItems == 0
                        && !Arrays.asList(documentsNotRequired).contains(objectType.getId()) &&
                        !hasMandatoryAspect(objectType, "P:jconon_attachment:document_not_required")) {
                    //Gestione del nulla Osta di Appartenenza associato all'aspect
                    if (!(objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_NULLAOSTA_ALTRO_ENTE.value()) &&
                            application.getProperty(JCONONPropertyIds.APPLICATION_FL_NULLA_OSTA.value()) != null &&
                            !Boolean.valueOf(application.getProperty(JCONONPropertyIds.APPLICATION_FL_NULLA_OSTA.value()).getValueAsString())))
                        listMonoRequired
                                .append((listMonoRequired.length() == 0 ? "" : ", ")
                                        + Optional.ofNullable(props.get(objectType.getId())).orElse(objectType.getDisplayName()));
                } else if (totalNumItems > 1) {
                    listMonoMultiInserted.append((listMonoMultiInserted
                            .length() == 0 ? "" : ", ")
                            + Optional.ofNullable(props.get(objectType.getId())).orElse(objectType.getDisplayName()));
                }
            }
            if ((objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE.value()) ||
                    objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE_NOT_REQUIRED.value()) ||
                    objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE_STRUTTURATO.value()) ||
                            objectType.getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE_FORMATO_EUROPEO.value())
                ) && totalNumItems != 0) {
                existCurriculum = true;
            }
            if (getAssociationList(call)
                    .stream()
                    .filter(s -> s.equals(JCONONDocumentType.JCONON_ATTACHMENT_VERIFICA_ATTIVITA.value())
                            || s.equals(JCONONDocumentType.JCONON_ATTACHMENT_RELAZIONE_ATTIVITA.value()))
                    .count() == 2) {
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
        StringBuilder messageError = new StringBuilder();
        if (listMonoRequired.length() > 0) {
            messageError.append((messageError.length() != 0 ? "<br>" : "") + i18nService.getLabel("message.error.allegati.required", locale, listMonoRequired));
        }
        if (listMonoMultiInserted.length() > 0) {
            messageError.append((messageError.length() != 0 ? "<br>" : "") + i18nService.getLabel("message.error.allegati.mono.multi.inserted", locale, listMonoMultiInserted));
        }

        verificaAttivita(
                ctrlAlternativeAttivita,
                existVerificaAttivita,
                existRelazioneAttivita,
                existCurriculum,
                messageError,
                application,
                cmisSession
        );

        if (messageError.length() != 0) {
            throw new ClientMessageException(messageError.toString());
        }

        List<String> listSezioniDomanda = getSezioniDomandaList(call);
        BigInteger numMaxProdotti = call.getPropertyValue(JCONONPropertyIds.CALL_NUMERO_MAX_PRODOTTI.value());
        final List<Object> collect = Stream.concat(
                call.getProperty(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS.value()).getValues().stream(),
                call.getProperty(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()).getValues().stream()
        ).collect(Collectors.toList());
        if (collect.contains(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_PROD_SCELTI_MULTIPLO.value()) ||
                collect.contains(JCONONDocumentType.JCONON_CVPEOPLE_ATTACHMENT_PRODOTTI_SCELTI_MULTIPLO.value())) {
            long totalNumItems = StreamSupport.stream(application.getChildren().spliterator(), false)
                    .filter(cmisObject -> {
                        return  cmisObject.getType().getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_PROD_SCELTI_MULTIPLO.value()) ||
                                cmisObject.getType().getId().equals(JCONONDocumentType.JCONON_CVPEOPLE_ATTACHMENT_PRODOTTI_SCELTI_MULTIPLO.value());
                    })
                    .count();
            if (numMaxProdotti != null && totalNumItems > numMaxProdotti.longValue())
                throw new ClientMessageException(i18nService.getLabel(
                        "message.error.troppi.prodotti.scelti",
                        locale,
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
            for (QueryResult queryResult : criteria.executeQuery(cmisSession,false, cmisSession.getDefaultContext())) {
                if (hasParentType(cmisSession.getTypeDefinition(queryResult.getPropertyValueById(PropertyIds.OBJECT_TYPE_ID)), JCONONDocumentType.JCONON_ATTACHMENT_PRODOTTO.value())) {
                    totalNumItems++;
                    boolean existsRelProdotto = false;
                    if (!(queryResult.getRelationships() == null
                            || queryResult.getRelationships().isEmpty())) {
                        for (Relationship relationship : queryResult.getRelationships()) {
                            if (relationship.getType().getId().equals(JCONONRelationshipType.JCONON_ATTACHMENT_IN_PRODOTTO.value())) {
                                existsRelProdotto = true;
                                if (((BigInteger) relationship.getTarget().getPropertyValue("cmis:contentStreamLength"))
                                        .compareTo(BigInteger.ZERO) <= 0) {
                                    throw new ClientMessageException(
                                            i18nService.getLabel("message.error.prodotti.scelti.allegato.empty", locale));
                                }
                            }
                        }
                    }
                    if (!existsRelProdotto)
                        throw new ClientMessageException(
                                i18nService.getLabel("message.error.prodotti.scelti.senza.allegato", locale));
                }
                if (numMaxProdotti != null && totalNumItems > numMaxProdotti.longValue()) {
                    throw new ClientMessageException(i18nService.getLabel(
                            "message.error.troppi.prodotti.scelti",
                            locale,
                            String.valueOf(totalNumItems),
                            String.valueOf(numMaxProdotti)));
                }
            }
        }
    }

    protected void verificaAttivita(Boolean ctrlAlternativeAttivita,
                                    Boolean existVerificaAttivita,
                                    Boolean existRelazioneAttivita,
                                    Boolean existCurriculum,
                                    StringBuilder messageError,
                                    Folder application,
                                    Session cmisSession) {
        if (ctrlAlternativeAttivita) {
            if (!existVerificaAttivita) {
                messageError.append((messageError.length() != 0 ? "<br>" : "") + i18nService.getLabel("message.error.allegati.attivita.ver.not.exists", Locale.ITALY));
            }
            if (!existRelazioneAttivita) {
                messageError.append((messageError.length() != 0 ? "<br>" : "") + i18nService.getLabel("message.error.allegati.attivita.rel.not.exists", Locale.ITALY));
            }

            Criteria criteriaCurr = CriteriaFactory.createCriteria("jconon_attachment:cv_element");
            criteriaCurr.add(Restrictions.inFolder(application.getId()));
            OperationContext operationContextCurr = cmisSession.getDefaultContext();
            operationContextCurr.setIncludeRelationships(IncludeRelationships.SOURCE);
            long numRigheCurriculum = criteriaCurr.executeQuery(cmisSession, false, operationContextCurr).getTotalNumItems();
            if (!existCurriculum && numRigheCurriculum <= 0) {
                messageError.append((messageError.length() != 0 ? "<br>" : "") + i18nService.getLabel("message.error.allegati.alternative.curriculum.not.exists", Locale.ITALY));
            }
            if (existCurriculum && numRigheCurriculum > 0) {
                messageError.append((messageError.length() != 0 ? "<br>" : "") + i18nService.getLabel("message.error.allegati.alternative.curriculum.all.exists", Locale.ITALY));
            }
        }
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private List<String> getDichiarazioniList(Folder call, Folder application) {
        List<String> dichiarazioniList = new ArrayList<String>();
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value()) != null &&
                !((List<?>) call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value())).isEmpty())
            dichiarazioniList.addAll(call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value()));
        if (application != null &&
                application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()) != null &&
                application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()).equals(Boolean.TRUE)) {
            dichiarazioniList.remove("P:jconon_application:aspect_godimento_diritti");
            dichiarazioniList.remove("P:jconon_application:aspect_conoscenza_lingua_italiana");
        } else {
            dichiarazioniList.remove("P:jconon_application:aspect_iscrizione_liste_elettorali");
        }
        return dichiarazioniList;
    }

    protected List<JSONErrorPair> validateAspects(Map<String, Object> map, Folder call, Folder application, Session cmisSession) {
        List<JSONErrorPair> listError = new ArrayList<JSONErrorPair>();
        List<String> listAspect = getDichiarazioniList(call, application);
        for (String aspect : listAspect) {
            BulkInfo bulkInfoAspect = bulkInfoService.find(aspect);
            FieldProperty flag = null;
            if (bulkInfoAspect != null) {
                for (FieldProperty fieldProperty : bulkInfoAspect.getForm(aspect)) {
                    if (fieldProperty.isRadioGroupType() || fieldProperty.isCheckboxType()) {
                        flag = fieldProperty;
                        break;
                    }
                }
                for (FieldProperty fieldProperty : bulkInfoAspect.getForm(aspect)) {
                    if (flag != null) {
                        if (!fieldProperty.equals(flag) &&
                                fieldProperty.getAttributes().get("class").contains(
                                        flag.getName() + '_' + map.get(flag.getProperty())) &&
                                !fieldProperty.isNullable() &&
                                !Optional.ofNullable(fieldProperty.getAttributes().get("class"))
                                        .map(s -> s.contains("double_show"))
                                        .orElse(Boolean.FALSE)) {
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

    private void addError(List<JSONErrorPair> listError, Map<String, Object> map, String nomeCampo, String label) {
        if (map.get(nomeCampo) == null)
            listError.add(new JSONErrorPair(
                    Optional.ofNullable(label).map(x -> nomeCampo.concat(" - ").concat(x)).orElse(nomeCampo),
                    "message.required.field"));
    }

    protected List<JSONErrorPair> validateBaseTableMap(Map<String, Object> map, Folder call, Folder application, Session cmisSession) {
        List<JSONErrorPair> listError = new ArrayList<JSONErrorPair>();
        listError.addAll(validateAspects(map, call, application, cmisSession));

        List<String> listSezioniDomanda = getSezioniDomandaList(call);
        BulkInfo bulkInfo = bulkInfoService.find(JCONONFolderType.JCONON_APPLICATION.value().replace(":", "_"));
        for (String sezione : listSezioniDomanda) {
            for (FieldProperty fieldProperty : bulkInfo.getForm(sezione)) {
                if (Optional.ofNullable(fieldProperty.getProperty()).isPresent() && Optional.ofNullable(fieldProperty.getAttribute("visible")).filter(x -> x.equalsIgnoreCase("true")).isPresent()) {
                    //TAB DATI ANAGRAFICI - Controlli particolari
                    if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())) {
                        addError(listError, map, fieldProperty.getProperty());
                        if (map.get(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()) != null) {
                            if ((Boolean) map.get(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())) {
                                addError(listError, map, JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());
                                Object codiceFiscale = map.get(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());
                                if (codiceFiscale != null) {
                                    // controllo formale della validita' del codice fiscale
                                    controllaCodiceFiscale(map, application);
                                }
                            } else
                                addError(listError, map, JCONONPropertyIds.APPLICATION_NAZIONE_CITTADINANZA.value());
                        }
                    } else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value()) ||
                            fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_NAZIONE_CITTADINANZA.value())) {
                        LOGGER.debug("field " + fieldProperty.getProperty());
                    } else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_CAP_RESIDENZA.value())) {
                        if (map.get(JCONONPropertyIds.APPLICATION_NAZIONE_RESIDENZA.value()) != null &&
                                ((String) map.get(JCONONPropertyIds.APPLICATION_NAZIONE_RESIDENZA.value())).toUpperCase().equals("ITALIA"))
                            addError(listError, map, JCONONPropertyIds.APPLICATION_CAP_RESIDENZA.value());
                    } else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_CAP_COMUNICAZIONI.value())) {
                        if (map.get(JCONONPropertyIds.APPLICATION_NAZIONE_COMUNICAZIONI.value()) != null &&
                                ((String) map.get(JCONONPropertyIds.APPLICATION_NAZIONE_COMUNICAZIONI.value())).toUpperCase().equals("ITALIA"))
                            addError(listError, map, JCONONPropertyIds.APPLICATION_CAP_COMUNICAZIONI.value());
                    } else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value())) {
                        if (application == null || application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()) == null ||
                                application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()).equals(Boolean.FALSE))
                            addError(listError, map, JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value());
                    } else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value())) {
                        if (application == null || application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()) == null ||
                                application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()).equals(Boolean.TRUE))
                            addError(listError, map, JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value());
                    } else
                        addError(listError, map, fieldProperty.getProperty(),
                                application.getType().getPropertyDefinitions().get(fieldProperty.getProperty()).getDisplayName());

                    if ((fieldProperty.isRadioGroupType() || fieldProperty.isCheckboxType()) && !fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_SESSO.value())
                            && map.get(fieldProperty.getProperty()) != null) {
                        Collection<FieldProperty> radioForm = bulkInfo.getForm(fieldProperty.getProperty() + ((Boolean) map.get(fieldProperty.getProperty()) ? "_true" : "_false").replace(":", "_"));
                        if (radioForm != null && !radioForm.isEmpty()) {
                            for (FieldProperty radioFieldProperty : bulkInfo.getForm(fieldProperty.getProperty() + ((Boolean) map.get(fieldProperty.getProperty()) ? "_true" : "_false").replace(":", "_"))) {
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
        if (properties != null) {
            for (String property : properties) {
                for (Iterator<JSONErrorPair> iterator = listError.iterator(); iterator.hasNext(); ) {
                    JSONErrorPair error = iterator.next();
                    if (error.getFirst().startsWith(property))
                        iterator.remove();
                }
            }
        }
        return listError;
    }

    private void controllaCodiceFiscale(Map<String, Object> map, Folder application) throws CMISApplicationException {
        GregorianCalendar dataNascita = Optional.ofNullable(map.get(JCONONPropertyIds.APPLICATION_DATA_NASCITA.value()))
                .filter(GregorianCalendar.class::isInstance)
                .map(GregorianCalendar.class::cast)
                .orElse(null);
        if (dataNascita == null)
            return;
        String cognome, nome, sesso, codiceFiscale, cdCatastale = null;
        if (map.get(JCONONPropertyIds.APPLICATION_COGNOME.value()) != null)
            cognome = (String) map.get(JCONONPropertyIds.APPLICATION_COGNOME.value());
        else
            cognome = application.getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value());

        if (map.get(JCONONPropertyIds.APPLICATION_NOME.value()) != null)
            nome = (String) map.get(JCONONPropertyIds.APPLICATION_NOME.value());
        else
            nome = application.getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value());

        if (map.get(JCONONPropertyIds.APPLICATION_SESSO.value()) != null)
            sesso = (String) map.get(JCONONPropertyIds.APPLICATION_SESSO.value());
        else
            sesso = application.getPropertyValue(JCONONPropertyIds.APPLICATION_SESSO.value());

        if (map.get(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value()) != null)
            codiceFiscale = (String) map.get(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());
        else
            codiceFiscale = application.getPropertyValue(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());

        CodiceFiscaleControllo.parseCodiceFiscale(
                cognome,
                nome,
                String.valueOf(dataNascita.get(GregorianCalendar.YEAR) % 100),
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
                        jsonObject.put("userAdmin", cmisConfig.getServerParameters().get(CMISConfig.CMISSessionParameter.ADMIN_USERNAME.value()));
                        jsonObject.put("groupRdP", groupRdP);
                        jsonObject.put("groupConsumer", JcononGroups.APPLICATION_CONSUMER.group());
                        out.write(jsonObject.toString().getBytes());
                    }
                }, cmisSession);
        int status = resp.getResponseCode();
        if (status == HttpStatus.SC_NOT_FOUND || status == HttpStatus.SC_BAD_REQUEST || status == HttpStatus.SC_INTERNAL_SERVER_ERROR)
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
        } catch (CmisPermissionDeniedException _ex) {
            throw new ClientMessageException("user.cannot.access.to.application", _ex);
        }
        Folder newApplication = loadApplicationById(cmisService.createAdminSession(), applicationSourceId, result);
        Folder call = loadCallById(currentCMISSession, newApplication.getPropertyValue(PropertyIds.PARENT_ID), result);
        CMISUser applicationUser, currentUser;
        try {
            applicationUser = userService.loadUserForConfirm(
                    newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
            currentUser = userService.loadUserForConfirm(userId);
        } catch (CoolUserFactoryException e) {
            throw new ClientMessageException("User not found", e);
        }
        if (!currentUser.isAdmin() && isDomandaInviata(newApplication, applicationUser))
            throw new ClientMessageException(
                    "message.error.domanda.inviata.accesso");
        Arrays.asList(validateBeans).stream().forEach(s -> {
            context.getBean(s, ApplicationValidateSend.class).validate(call, newApplication);
        });
        /*
         * Effettuo il controllo sul numero massimo di domande validate passandogli lo User
         * della domanda che deve essere sempre valorizzata
         */
        validateMacroCall(call, newApplication, (String) newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
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
        validateAllegatiLinked(call, newApplication, cmisService.createAdminSession(), locale);
        Property<Boolean> blocco = call.getProperty(JCONONPropertyIds.CALL_BLOCCO_INVIO_DOMANDE.value());
        if (blocco != null && blocco.getValue() != null
                && blocco.getFirstValue()) {
            String msg = call.getProperty(JCONONPropertyIds.CALL_BLOCCO_INVIO_DOMANDE_MESSAGE.value()).getValue();
            throw new ClientMessageException(msg);
        }
        try {
            if (!currentUser.isAdmin() && !isDomandaInviata(newApplication, applicationUser)) {
                Boolean flagSchedaAnonima = call.getPropertyValue(JCONONPropertyIds.CALL_FLAG_SCHEDA_ANONIMA_SINTETICA.value());
                sendApplication(cmisService.getAdminSession(),
                        newApplication.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(),
                        flagSchedaAnonima != null && flagSchedaAnonima ? Collections.EMPTY_LIST : callService.getGroupsCallToApplication(call),
                        "GROUP_" + call.getPropertyValue(JCONONPropertyIds.CALL_RDP.value()));
            }
            addToQueueForSend(newApplication.getId(), contextURL, true);
        } catch (Exception e) {
            mailService.sendErrorMessage(userId, contextURL, contextURL, new CMISApplicationException("999", e));
            throw new ClientMessageException("message.error.confirm.incomplete");
        }
        return Collections.singletonMap(
                "email_comunicazione",
                Optional.ofNullable(
                        newApplication.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value())
                ).orElse(applicationUser.getEmail())
        );
    }

    protected void addToQueueForSend(String id, String contextURL, boolean email) {
        queueService.queueSendApplication().add(new PrintParameterModel(id, contextURL, email));
        queueService.queueAddContentToApplication().add(new PrintParameterModel(id, contextURL, email));
    }

    public Boolean print(Session currentCMISSession, String nodeRef, String contextURL, String userId, Locale locale) {
        try {
            Folder newApplication = (Folder) currentCMISSession.getObject(nodeRef);
            try {
                validateAllegatiLinked(
                        loadCallById(currentCMISSession, newApplication.getParentId()),
                        newApplication,
                        cmisService.createAdminSession(),
                        locale
                );
            } catch (ClientMessageException _ex) {
                if (_ex.equals(ClientMessageException.FILE_EMPTY))
                    throw _ex;
            }
            addToQueueForPrint(nodeRef, contextURL, !userService.loadUserForConfirm(userId).isAdmin());
            return true;
        } catch (CmisUnauthorizedException|CmisPermissionDeniedException _ex) {
            LOGGER.error("Try to print application Unauthorized UserId:" + userId + " - applicationId:" + nodeRef, _ex);
            return false;
        }
    }

    protected void addToQueueForPrint(String nodeRef, String contextURL, Boolean email) {
        queueService.queuePrintApplication().add(new PrintParameterModel(nodeRef, contextURL, email));
    }

    protected Folder loadApplicationByCall(Session cmisSession, String callId, Map<String, Object> model, String userId) {
        if (model != null && !model.isEmpty() && model.get("application") != null)
            return (Folder) model.get("application");
        Folder call = loadCallById(cmisSession, callId, model);
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.add(Restrictions.inFolder(call.getId()));
        criteria.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_USER.value(), userId));
        ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        if (iterable.getTotalNumItems() == 0 || iterable.getTotalNumItems() == -1) {
            return null;
        } else if (iterable.getTotalNumItems() > 1)
            throw new ClientMessageException("message.error.domanda.multipla");
        for (QueryResult queryResult : iterable) {
            Folder folder = (Folder) cmisSession.getObject((String) queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            folder.refresh();
            model.put("folder", folder);
            return folder;
        }
        throw new ClientMessageException("message.error.domanda.multipla");
    }

    protected CMISUser getApplicationUser(Folder application) {
        CMISUser applicationUser = null;
        if (application != null) {
            String userId = application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value());
            try {
                applicationUser = userService.loadUserForConfirm(userId);
            } catch (CoolUserFactoryException e) {
                throw new ClientMessageException(i18nService.getLabel("message.error.caller.user.not.found", Locale.ITALY, userId), e);
            }
        }
        return applicationUser;
    }

    protected void validateMacroCall(Folder call, Folder application, CMISUser user) {
        validateMacroCall(call, application, user.getId());
    }

    private void manageApplicationPermission(Folder application, String userId) {
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
            if (jsonAnadip != null && !jsonAnadip.isJsonNull()) {
                for (Entry<String, JsonElement> entry : jsonAnadip.entrySet()) {
                    if (entry.getValue().isJsonArray()) {
                        JsonArray values = (JsonArray) entry.getValue();
                        List<String> propertyValues = new ArrayList<String>();
                        for (JsonElement jsonElement : values) {
                            propertyValues.add(jsonElement.getAsString());
                        }
                        properties.put("jconon_application:" + entry.getKey(), propertyValues);
                    } else {
                        properties.put("jconon_application:" + entry.getKey(), entry.getValue().getAsString());
                    }
                }
                for (Iterator<String> iterator = properties.keySet().iterator(); iterator.hasNext(); ) {
                    String property = iterator.next();
                    if (!isCorrectValue(property, properties.get(property).toString(), folder))
                        iterator.remove();
                }
            }
        } catch (Exception ex) {
            LOGGER.error("Errore nel recupero delle informazioni del dipendente da SIPER, matricola:" + username, ex);
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
            properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONFolderType.JCONON_APPLICATION.value());
            properties.put(JCONONPropertyIds.APPLICATION_COGNOME.value(), loginUser.getLastName());
            properties.put(JCONONPropertyIds.APPLICATION_NOME.value(), loginUser.getFirstName());
            properties.put(JCONONPropertyIds.APPLICATION_USER.value(), loginUser.getId());
            properties.put(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value(), loginUser.getEmail());
            properties.put(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.INIZIALE.getValue());
            properties.put(PropertyIds.NAME, folderService.integrityChecker("Domanda di " + properties.get(JCONONPropertyIds.APPLICATION_COGNOME.value()) + " " +
                    properties.get(JCONONPropertyIds.APPLICATION_NOME.value()) + " - " + loginUser.getId()));

            if (loginUser.getSesso() != null && !loginUser.getSesso().equals(""))
                properties.put(JCONONPropertyIds.APPLICATION_SESSO.value(), loginUser.getSesso());
            if (loginUser.getDataDiNascita() != null && !loginUser.getDataDiNascita().equals("")) {
                properties.put(JCONONPropertyIds.APPLICATION_DATA_NASCITA.value(), loginUser.getDataDiNascita());
            }
            if (loginUser.getCodicefiscale() != null && !loginUser.getCodicefiscale().equals(""))
                properties.put(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value(), loginUser.getCodicefiscale());
            properties.put(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value(),
                    Optional.ofNullable(loginUser.getStraniero())
                            .map(aBoolean -> !aBoolean)
                            .orElse(Boolean.TRUE)
            );
            if (loginUser.getStatoestero() != null && !loginUser.getStatoestero().equals(""))
                properties.put(JCONONPropertyIds.APPLICATION_NAZIONE_CITTADINANZA.value(), loginUser.getStatoestero());

            folder = (Folder) cmisService.createAdminSession().getObject(
                    cmisService.createAdminSession().createFolder(properties, call));
            List<Object> secondaryTypes = new ArrayList<Object>();
            secondaryTypes.addAll(call.getProperty(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value()).getValues());
            secondaryTypes.addAll(call.getProperty(JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_CNR.value()).getValues());
            secondaryTypes.addAll(call.getProperty(JCONONPropertyIds.CALL_ELENCO_ASPECTS_ULTERIORI_DATI.value()).getValues());
            secondaryTypes.addAll(call.getProperty(JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_4.value()).getValues());
            secondaryTypes.addAll(call.getProperty(JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_5.value()).getValues());
            properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, secondaryTypes);

            manageApplicationPermission(folder, loginUser.getId());

            if (loginUser.getMatricola() != null) {
                try {
                    if (Optional.ofNullable(siperService).isPresent()) {
                        Map<String, Object> siperProperties = nodeMetadataService
                                .populateMetadataType(cmisSession,
                                        getSiperProperties(loginUser, folder), null);
                        folder.updateProperties(siperProperties);
                    }
                } catch (Exception ex) {
                    String subject = "Error in import Siper data for user " + loginUser.getMatricola();
                    LOGGER.error(subject, ex);
                    StringWriter sw = new StringWriter();
                    ex.printStackTrace(new PrintWriter(sw));
                    mailService.sendErrorMessage(loginUser.getId(), subject,
                            sw.toString());
                }
            }
        } catch (CmisContentAlreadyExistsException ex) {
            LOGGER.warn("content already exists", ex);
            throw ClientMessageException.FILE_ALREDY_EXISTS;
        }
        return folder;
    }

    public boolean isApplicationPreview(boolean preview, CMISUser loginUser, Folder call) {
        return preview && (
                loginUser.isAdmin() ||
                call.getPropertyValue(PropertyIds.CREATED_BY).equals(loginUser.getId()) ||
                callService.isMemberOfRDPGroup(loginUser, call)
        );
    }

    public Folder load(Session currentCMISSession, String callId,
                       String applicationId, String userId, boolean preview, String contextURL,
                       Locale locale) {
        Map<String, Object> result = new HashMap<String, Object>();
        Folder application = null;
        CMISUser loginUser = userService.loadUserForConfirm(userId), applicationUser = null;
        Folder call = loadCallById(currentCMISSession, callId, result);
        try {
            if (applicationId != null && !applicationId.isEmpty()) {
                application = loadApplicationById(currentCMISSession, applicationId, result);
                //la chiamata con il parametro applicationId deve prevedere sempre l'esistenza della domanda
                if (application == null)
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
                    ((application == null && loginUser.getMatricola() == null) || (applicationUser != null && applicationUser.getMatricola() == null))) {
                if (!isApplicationPreview(preview, loginUser, call) && blockSubmitEmployee)
                    throw new ClientMessageException("message.error.bando.tipologia.employees");
            }
            final Optional<String> canSubmitApplicationOnlySPID =
                    Optional.ofNullable(call.<String>getPropertyValue(JCONONPropertyIds.CALL_ONLY_USER_SPID_CAN_SUBMIT_APPLICATION.value()));
            if (canSubmitApplicationOnlySPID
                    .map(Boolean::valueOf)
                    .filter(aBoolean -> {
                        return aBoolean.booleanValue();
                    })
                    .map(aBoolean -> {
                        return !Optional.ofNullable(loginUser.getApplication())
                                .filter(s -> !s.isEmpty())
                                .filter(s -> s.equals("SPID"))
                                .isPresent();
                    })
                    .orElse(Boolean.FALSE) && !isApplicationPreview(preview, loginUser, call)) {
                throw new ClientMessageException(
                        i18nService.getLabel("message.error.bando.cannot.submit.application.spid", locale));
            }

            /**
             * Se nel bando è valorizzato il gruppo delle utenze viene controllata la presenza
             * dell'utenza specifica nel gruppo
             */
            final Optional<String> groupCanSubmitApplication =
                    Optional.ofNullable(call.<String>getPropertyValue(JCONONPropertyIds.CALL_GROUP_CAN_SUBMIT_APPLICATION.value()));
            if (groupCanSubmitApplication
                        .map(groupName -> !loginUser.getGroupsArray().contains(groupName))
                        .orElse(Boolean.FALSE)) {
                throw new ClientMessageException(
                        i18nService.getLabel("message.error.bando.cannot.submit.application",
                                locale,
                                groupService.loadGroup(
                                        groupCanSubmitApplication
                                            .map(s -> s.replaceAll("GROUP_", ""))
                                            .orElseThrow(() -> new CMISApplicationException("Cannot find GROUP")),
                                        cmisService.getAdminSession()
                                ).getDisplay_name())
                );
            }

            // In un bando di mobilità può accedere solo un non dipendente
            // Se application è vuoto vuol dire che si sta creando la domanda e
            // quindi l'utente collegato non deve essere un dipendente
            // Se application è pieno vuol dire che l'utente della domanda deve
            // essere un dipendente
            if (JCONONFolderType.isMobilityCall(call.getType().getId()) &&
                    ((application == null && loginUser.getMatricola() != null) || (applicationUser != null && applicationUser.getMatricola() != null))) {
                if (!isApplicationPreview(preview, loginUser, call))
                    throw new ClientMessageException("message.error.bando.tipologia.mobility");
            }


            // Effettuo il controllo sul numero massimo di domande validate solo se
            // non è stata ancora inserita la domanda.
            //Se presente e validata, entra...... Se presente e non validata il blocco lo ha in fase di invio.
            if (application == null)
                validateMacroCall(call, null, loginUser);
            else if (application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(StatoDomanda.INIZIALE.getValue()))
                validateMacroCall(call, application, applicationUser);
            else if (isDomandaInviata(application, loginUser)) {
                throw new ClientMessageException("message.error.domanda.inviata.accesso");
            }
            if (!isApplicationPreview(preview, loginUser, call))
                callService.isBandoInCorso(call, loginUser);

            if (application != null) {
                /**
                 * Controllo di consistenza su nome e cognome dell'utenza
                 */
                if (!loginUser.isAdmin() && loginUser.getId().equals(application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()))) {
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
            }
            if (application == null)
                application = createInitialFolder(loginUser, result, cmisService.createAdminSession(), call);
        } catch (CoolUserFactoryException e) {
            throw new CMISApplicationException("Load Application error.", e);
        }
        return application;
    }

    protected boolean isDomandaInviata(Folder application, CMISUser loginUser) {
        return application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(StatoDomanda.CONFERMATA.getValue()) &&
                application.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value()) != null && !loginUser.isAdmin();
    }

    public Folder save(Session currentCMISSession,
                       String contextURL, Locale locale,
                       String userId, Map<String, Object> properties,
                       Map<String, Object> aspectProperties) {
        Folder application = (Folder) currentCMISSession.getObject((String) properties.get(PropertyIds.OBJECT_ID));
        try {
            validateAllegatiLinked(
                    loadCallById(currentCMISSession, application.getParentId()),
                    application,
                    cmisService.createAdminSession(),
                    locale
            );
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
        try {
            if (application.<List<String>>getPropertyValue(PropertyIds.SECONDARY_OBJECT_TYPE_IDS).contains(PAGOPAObjectType.JCONON_APPLICATION_PAGOPA.value())) {
                Optional.ofNullable(properties.get(PropertyIds.SECONDARY_OBJECT_TYPE_IDS))
                        .filter(List.class::isInstance)
                        .map(List.class::cast)
                        .map(list -> {
                            list.add(PAGOPAObjectType.JCONON_APPLICATION_PAGOPA.value());
                            return list;
                        }).ifPresent(list -> {
                            properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, list);
                        });

            }
            return (Folder) cmisService.createAdminSession().getObject(
                    cmisService.createAdminSession().getObject(application).updateProperties(properties, true));
        } catch (CmisConstraintException _ex) {
            throw new ClientMessageException(
                    Optional.ofNullable(_ex.getMessage())
                        .filter(s -> s.contains("Constraint:"))
                         .map(s -> s.substring(s.indexOf("Constraint:")))
                        .orElseGet(() -> _ex.getMessage()),
                    _ex);
        }
    }

    /**
     * pre-condition : L'utente collegato ha accesso alla domanda e la domanda non risulta inviata.
     *
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
        Optional.ofNullable(application)
                .map(folder -> folder.<BigInteger>getPropertyValue(PAGOPAPropertyIds.APPLICATION_NUMERO_PROTOCOLLO_PAGOPA.value()))
                .ifPresent(protocollo -> {
                    try {
                        pagopaService.annullaPendenza(protocollo.longValue());
                    } catch (Exception _ex) {
                        LOGGER.error("Errore nella cancellazione della pendenza con protocollo num. {}", protocollo);
                    }
                });
        ((Folder) cmisService.createAdminSession().getObject(application)).deleteTree(true, UnfileObject.DELETE, true);
    }

    public void reject(Session currentCMISSession, String nodeRef, String nodeRefDocumento) {
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
        addCoordinatorToConcorsiGroup(nodeRefDocumento);
    }

    public void addCoordinatorToConcorsiGroup(String nodeRef) {
        CmisObject cmisObject = cmisService.createAdminSession().getObject(
                Optional.ofNullable(nodeRef)
                        .filter(s -> s.contains(";"))
                        .map(s -> s.substring(0, s.indexOf(";")))
                        .orElse(nodeRef)
        );
        if (Optional.ofNullable(cmisObject).isPresent()) {
            aclService.addAcl(cmisService.getAdminSession(),
                    cmisObject.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(),
                    Collections.singletonMap(GroupsEnum.CONCORSI.value(), ACLType.Coordinator));

        }

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
        addCoordinatorToConcorsiGroup(nodeRef);
    }

    public void retirement(Session currentCMISSession, String nodeRef) {
        Folder application = loadApplicationById(currentCMISSession, nodeRef);
        Map<String, Serializable> properties = new HashMap<String, Serializable>();
        properties.put("jconon_application:fl_ritiro", Boolean.TRUE);
        cmisService.createAdminSession().getObject(application).updateProperties(properties);
    }

    public void readmission(Session currentCMISSession, String nodeRef) {
        Folder application = loadApplicationById(currentCMISSession, nodeRef);
        Folder call = loadCallById(currentCMISSession, application.getPropertyValue(PropertyIds.PARENT_ID));

        Map<String, Serializable> properties = new HashMap<String, Serializable>();
        properties.put("jconon_application:esclusione_rinuncia", null);
        cmisService.createAdminSession().getObject(application).updateProperties(properties);
        if (!Optional.ofNullable(call.<Boolean>getPropertyValue(JCONONPropertyIds.CALL_FLAG_SCHEDA_ANONIMA_SINTETICA.value()))
                .orElse(Boolean.FALSE)) {
            Map<String, ACLType> acesToRemove = new HashMap<String, ACLType>();
            List<String> groups = callService.getGroupsCallToApplication(call);
            for (String group : groups) {
                acesToRemove.put(group, ACLType.Contributor);
            }
            aclService.addAcl(cmisService.getAdminSession(),
                    application.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), acesToRemove);
        }
        addCoordinatorToConcorsiGroup(nodeRef);
    }

    /**
     * Ritorna una Map con key il COGNOME e NOME dell'utente e come value l'id della scheda
     *
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
            String applicationAttach = competitionService.findAttachmentId(currentCMISSession, (String) queryResultDomande.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue(),
                    JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_VALUTAZIONE);
            if (applicationAttach != null) {
                result.put(queryResultDomande.getPropertyById(JCONONPropertyIds.APPLICATION_COGNOME.value()).getFirstValue() + " " +
                                queryResultDomande.getPropertyById(JCONONPropertyIds.APPLICATION_NOME.value()).getFirstValue(),
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
                InputStream stream = ((Document) currentCMISSession.getObject(schede.get(sheetName))).getContentStream().getStream();
                try {
                    HSSFWorkbook workbook = new HSSFWorkbook(stream);
                    int pictureId = 0;
                    for (HSSFPictureData picture : workbook.getAllPictures()) {
                        pictureId = wb.addPicture(picture.getData(), picture.getFormat());
                    }
                    HSSFSheet newSheet = wb.createSheet(sheetName);
                    HSSFPrintSetup ps = newSheet.getPrintSetup();
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
            Map<String, String> finalZip = exportApplicationsService.invokePost(documents, fileName, cmisService.getAdminSession(), user, false, null);
            return finalZip.get("nodeRef");
        } else {
            throw new CMISApplicationException("Formato non supportato");
        }
    }

    public void generaSchedeValutazione(Session currentCMISSession, String idCall, final Locale locale, final String contextURL, final CMISUser user, final String email) {
        final String userId = user.getId();
        if (!callService.isMemberOfRDPGroup(user, (Folder) currentCMISSession.getObject(idCall)) && !user.isAdmin()) {
            LOGGER.error("USER:" + userId + " try to generaSchedeValutazione for call:" + idCall);
            return;
        }
        queueService.queueSchedaValutazione().add(new PrintParameterModel(
                idCall, contextURL, true, email, userId, PrintParameterModel.TipoScheda.SCHEDA_VALUTAZIONE));
    }

    public void generaSchedeAnonime(Session currentCMISSession, String idCall, final Locale locale, final String contextURL, final CMISUser user, final String email) {
        final String userId = user.getId();
        if (!callService.isMemberOfRDPGroup(user, (Folder) currentCMISSession.getObject(idCall)) && !user.isAdmin()) {
            LOGGER.error("USER:" + userId + " try to generaSchedeValutazione for call:" + idCall);
            return;
        }
        queueService.queueSchedaValutazione().add(new PrintParameterModel(
                idCall, contextURL, true, email, userId, PrintParameterModel.TipoScheda.SCHEDA_ANONIMA));
    }

    public String concludiProcessoSchedeAnonime(Session currentCMISSession, String idCall, Locale locale, String contextURL, CMISUser user) {
        final String userId = user.getId();
        if (!callService.isMemberOfRDPGroup(user, (Folder) currentCMISSession.getObject(idCall)) && !user.isAdmin()) {
            LOGGER.error("USER:" + userId + " try to generaSchedeValutazione for call:" + idCall);
            throw new ClientMessageException("USER:" + userId + " try to generaSchedeValutazione for call:" + idCall);
        }
        OperationContext context = currentCMISSession.getDefaultContext();
        context.setMaxItemsPerPage(Integer.MAX_VALUE);

        String message = "";
        Criteria criteriaSchedeAnonime = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA_SINTETICA_GENERATED.queryName(), "doc");
        criteriaSchedeAnonime.add(Restrictions.inTree(idCall));

        Criteria criteriaValutazione = criteriaSchedeAnonime.createCriteria(JCONONPolicyType.JCONON_SCHEDA_ANONIMA_VALUTAZIONE.queryName(), "val");
        criteriaValutazione.addJoinCriterion(Restrictions.eqProperty(criteriaSchedeAnonime.prefix(PropertyIds.OBJECT_ID), criteriaValutazione.prefix(PropertyIds.OBJECT_ID)));
        criteriaValutazione.add(Restrictions.isNull(criteriaValutazione.getTypeAlias() + "." + JCONONPropertyIds.SCHEDA_ANONIMA_VALUTAZIONE_ESITO.value()));

        if (criteriaSchedeAnonime.executeQuery(currentCMISSession, false, context).getTotalNumItems() > 0)
            throw new ClientMessageException("message.concludi.processo.schede.anonime.interrotto");

        Criteria criteria = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA_SINTETICA_GENERATED.queryName(), "doc");
        criteria.add(Restrictions.inTree(idCall));
        ItemIterable<QueryResult> schede = criteria.executeQuery(currentCMISSession, false, context);
        int domandeConfermate = 0, domandeEscluse = 0;
        for (QueryResult scheda : schede) {
            Document schedaAnonimaSintetica = (Document) currentCMISSession.getObject((String) scheda.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            Folder domanda = schedaAnonimaSintetica.getParents().get(0);
            if (schedaAnonimaSintetica.<Boolean>getPropertyValue(JCONONPropertyIds.SCHEDA_ANONIMA_VALUTAZIONE_ESITO.value())) {
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
            properties.put(JCONONPropertyIds.CALL_STATO.value(), CallStato.PROCESSO_SCHEDE_ANONIME_CONCLUSO_COMMISSIONE_NON_ABILITATA.name());
            call.updateProperties(properties);
        }
        return message;
    }

    public String abilitaProcessoSchedeAnonime(Session currentCMISSession, String idCall, Locale locale, String contextURL, CMISUser user) {
        final String userId = user.getId();
        Folder call = (Folder) currentCMISSession.getObject(idCall);
        if (!callService.isMemberOfRDPGroup(user, (Folder) currentCMISSession.getObject(idCall)) && !user.isAdmin()) {
            LOGGER.error("USER:" + userId + " try to generaSchedeValutazione for call:" + idCall);
            throw new ClientMessageException("USER:" + userId + " try to generaSchedeValutazione for call:" + idCall);
        }
        OperationContext context = currentCMISSession.getDefaultContext();
        context.setMaxItemsPerPage(Integer.MAX_VALUE);

        Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaDomande.add(Restrictions.inTree(idCall));
        criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
        criteriaDomande.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(currentCMISSession, false, context);
        int domandeConfermate = 0;
        for (QueryResult item : domande) {
            Folder domanda = (Folder) currentCMISSession.getObject((String) item.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
            Map<String, ACLType> acesToADD = new HashMap<String, ACLType>();
            List<String> groups = callService.getGroupsCallToApplication(call);
            for (String group : groups) {
                acesToADD.put(group, ACLType.Contributor);
            }
            aclService.addAcl(cmisService.getAdminSession(), domanda.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()), acesToADD);
            domandeConfermate++;
        }
        Map<String, Object> properties = new HashMap<String, Object>();
        properties.put(JCONONPropertyIds.CALL_STATO.value(), CallStato.PROCESSO_SCHEDE_ANONIME_ABILITATA_COMMISSIONE.name());
        call.updateProperties(properties);

        String message = "Il processo di abilitazione si è concluso con:<br><b>Domande abilitate:</b> " + domandeConfermate;
        return message;
    }

    public Map<String, String[]> getAspectParams(Session cmisSession, Map<String, String[]> extractFormParams) {
        List<String> aspects = new ArrayList<>();
        for (String key : extractFormParams.keySet()) {
            if (key.equalsIgnoreCase(PolicyType.ASPECT_REQ_PARAMETER_NAME)) {
                for (String aspectName : extractFormParams.get(key)) {
                    try {
                        if (Optional.ofNullable(aspectName).filter(s -> !s.isEmpty()).isPresent()) {
                            ObjectType aspectType = cmisSession.getTypeDefinition(aspectName);
                            if (!aspectType.getParentTypeId().equals(BaseTypeId.CMIS_SECONDARY.value()))
                                aspects.add(aspectType.getParentTypeId());
                            aspects.add(aspectName);
                        }
                    } catch (CmisObjectNotFoundException|CmisInvalidArgumentException _ex) {
                        LOGGER.debug("object not found", _ex);
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
        if (!callService.isMemberOfRDPGroup(user, call) && !user.isAdmin()) {
            LOGGER.error("USER:" + userId + " try to generaSchedeValutazione for call:" + call.getId());
            throw new ClientMessageException("USER:" + userId + " try to generaSchedeValutazione for call:" + call.getId());
        }
        queueService.queueAddContentToApplication().add(new PrintParameterModel(application.getId(), contextURL, false));
    }

    public String punteggi(Session cmisSession, String userId, String callId, String applicationId,
                           BigDecimal punteggio_titoli, BigDecimal punteggio_scritto, BigDecimal punteggio_secondo_scritto,
                           BigDecimal punteggio_colloquio, BigDecimal punteggio_prova_pratica, BigDecimal punteggio_6,BigDecimal punteggio_7,
                           BigDecimal graduatoria, String esitoCall, String punteggioNote) {
        Folder application = (Folder) cmisSession.getObject(applicationId);
        Folder call = (Folder) cmisSession.getObject(callId);
        CMISUser user = userService.loadUserForConfirm(userId);
        if (!callService.isMemberOfRDPGroup(user, call) && !callService.isMemberOfCommissioneGroup(user, call) &&
                !callService.isMemberOfConcorsiGroup(user) && !user.isAdmin()) {
            LOGGER.error("USER: {} try to set punteggi for application {}", userId, applicationId);
            throw new ClientMessageException("Non è possibile aggiornare i punteggi, permesso negato!");
        }
        final Map<String, PropertyDefinition<?>> propertyDefinitions = cmisSession.getTypeDefinition("P:jconon_call:aspect_punteggi").getPropertyDefinitions();

        String result = "";
        Map<String, Object> properties = new HashMap<String, Object>();

        List<Object> aspects = application.getProperty(PropertyIds.SECONDARY_OBJECT_TYPE_IDS).getValues();
        aspects.add(JCONONPolicyType.JCONON_APPLICATION_PUNTEGGI.value());
        properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, aspects);

        result = result.concat(callService.impostaPunteggio(call, propertyDefinitions, properties, punteggio_titoli,
                PrintService.JCONON_CALL_PUNTEGGIO_1, "jconon_call:punteggio_1_min", "jconon_call:punteggio_1_limite",
                "jconon_application:punteggio_titoli", "jconon_application:fl_punteggio_titoli"));

        result = result.concat(callService.impostaPunteggio(call, propertyDefinitions, properties, punteggio_scritto,
                PrintService.JCONON_CALL_PUNTEGGIO_2, "jconon_call:punteggio_2_min", "jconon_call:punteggio_2_limite",
                "jconon_application:punteggio_scritto", "jconon_application:fl_punteggio_scritto"));

        result = result.concat(callService.impostaPunteggio(call, propertyDefinitions, properties, punteggio_secondo_scritto,
                PrintService.JCONON_CALL_PUNTEGGIO_3, "jconon_call:punteggio_3_min", "jconon_call:punteggio_3_limite",
                "jconon_application:punteggio_secondo_scritto", "jconon_application:fl_punteggio_secondo_scritto"));

        result = result.concat(callService.impostaPunteggio(call, propertyDefinitions, properties, punteggio_colloquio,
                PrintService.JCONON_CALL_PUNTEGGIO_4, "jconon_call:punteggio_4_min", "jconon_call:punteggio_4_limite",
                "jconon_application:punteggio_colloquio", "jconon_application:fl_punteggio_colloquio"));

        result = result.concat(callService.impostaPunteggio(call, propertyDefinitions, properties, punteggio_prova_pratica,
                PrintService.JCONON_CALL_PUNTEGGIO_5, "jconon_call:punteggio_5_min", "jconon_call:punteggio_5_limite",
                "jconon_application:punteggio_prova_pratica", "jconon_application:fl_punteggio_prova_pratica"));

        result = result.concat(callService.impostaPunteggio(call, propertyDefinitions, properties, punteggio_6,
                PrintService.JCONON_CALL_PUNTEGGIO_6, "jconon_call:punteggio_6_min", "jconon_call:punteggio_6_limite",
                "jconon_application:punteggio_6", "jconon_application:fl_punteggio_6"));

        result = result.concat(callService.impostaPunteggio(call, propertyDefinitions, properties, punteggio_7,
                PrintService.JCONON_CALL_PUNTEGGIO_7, "jconon_call:punteggio_7_min", "jconon_call:punteggio_7_limite",
                "jconon_application:punteggio_7", "jconon_application:fl_punteggio_7"));


        final BigDecimal totalePunteggio = Arrays.asList(
                Optional.ofNullable(punteggio_titoli).orElse(BigDecimal.ZERO),
                Optional.ofNullable(punteggio_scritto).orElse(BigDecimal.ZERO),
                Optional.ofNullable(punteggio_secondo_scritto).orElse(BigDecimal.ZERO),
                Optional.ofNullable(punteggio_colloquio).orElse(BigDecimal.ZERO),
                Optional.ofNullable(punteggio_prova_pratica).orElse(BigDecimal.ZERO),
                Optional.ofNullable(punteggio_6).orElse(BigDecimal.ZERO),
                Optional.ofNullable(punteggio_7).orElse(BigDecimal.ZERO)
        ).stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        properties.put("jconon_application:totale_punteggio", totalePunteggio);
        properties.put("jconon_application:graduatoria",
                Optional.ofNullable(graduatoria)
                        .map(BigDecimal::intValue)
                        .orElse(null));
        properties.put(JCONONPropertyIds.APPLICATION_ESITO_CALL.value(),
                Optional.ofNullable(esitoCall).orElse(null));
        properties.put("jconon_application:punteggio_note",
                Optional.ofNullable(punteggioNote).orElse(null));
        cmisService.createAdminSession().getObject(applicationId).updateProperties(properties);
        return result;
    }

    public void addContributorForProductAfterCommission(Folder call, Folder application, Session cmisSession, CMISUser user, Locale locale) {
        Calendar now = new GregorianCalendar();
        String applicationUser = application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value());
        List<String> users = call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_SELECTED_PRODUCT_USERS.value());
        if (!call.<List<String>>getPropertyValue(PropertyIds.SECONDARY_OBJECT_TYPE_IDS)
                .stream()
                .anyMatch(s -> s.equalsIgnoreCase(JCONONPolicyType.JCONON_CALL_ASPECT_PRODUCTS_AFTER_COMMISSION.value())) ||
            !(now.after(Optional.ofNullable(call.<Calendar>getPropertyValue(JCONONPropertyIds.CALL_SELECTED_PRODUCT_START_DATE.value()))
                    .orElse(now)) && now.before(Optional.ofNullable(call.<Calendar>getPropertyValue(JCONONPropertyIds.CALL_SELECTED_PRODUCT_END_DATE.value()))
                    .orElse(now)))) {
            throw new ClientMessageException(i18nService.getLabel("message.call.configuration.error", locale));
        }
        if (!(user.isAdmin() || callService.isMemberOfConcorsiGroup(user) || applicationUser.equals(user.getId())) &&
                Optional.ofNullable(application.getPropertyValue(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value())).isPresent()
        ) {
            throw new ClientMessageException(i18nService.getLabel("message.access.denieded", locale));
        }
        if (!(users.isEmpty() || (users.contains(user.getId()) || user.isAdmin() || callService.isMemberOfConcorsiGroup(user)))) {
            throw new ClientMessageException(i18nService.getLabel("message.access.denieded", locale));
        }
        aclService.addAcl(
                cmisService.getAdminSession(),
                application.<String>getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                Collections.singletonMap(user.getId(), ACLType.Contributor)
        );
        StreamSupport.stream(application.getChildren().spliterator(), false)
                .filter(cmisObject -> call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()).contains(cmisObject.getType().getId()))
                .filter(cmisObject -> {
                        return Optional.ofNullable(cmisObject.<String>getPropertyValue(JCONONPropertyIds.CM_OWNER.value()))
                                .map(owner -> owner.equalsIgnoreCase(adminUserName))
                                .orElse(Boolean.TRUE);
                })
                .forEach(cmisObject -> {
                    cmisService.createAdminSession()
                            .getObject(cmisObject)
                            .updateProperties(
                                    Stream.of(
                                            new AbstractMap.SimpleEntry<>(JCONONPropertyIds.CM_OWNER.value(), applicationUser),
                                            new AbstractMap.SimpleEntry<>(PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
                                                    Stream.concat(
                                                            cmisObject.getSecondaryTypes().stream().map(SecondaryType::getId),
                                                            Stream.of(JCONONPolicyType.OWNABLE.value())
                                                    ).collect(Collectors.toList())
                                            )).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                            );
                });
        cmisService.createAdminSession()
            .getObject(application)
            .updateProperties(
                Collections.singletonMap(JCONONPropertyIds.APPLICATION_FL_SELECTED_PRODUCT_FINISHED.value(), Boolean.FALSE)
            );
    }

    public void removeContributorForProductAfterCommission(Folder call, Folder application, Session cmisSession, CMISUser user, Locale locale) {
        Calendar now = new GregorianCalendar();
        String applicationUser = application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value());
        if (!call.<List<String>>getPropertyValue(PropertyIds.SECONDARY_OBJECT_TYPE_IDS)
                .stream()
                .anyMatch(s -> s.equalsIgnoreCase(JCONONPolicyType.JCONON_CALL_ASPECT_PRODUCTS_AFTER_COMMISSION.value())) ||
                !(now.after(Optional.ofNullable(call.<Calendar>getPropertyValue(JCONONPropertyIds.CALL_SELECTED_PRODUCT_START_DATE.value()))
                        .orElse(now)) && now.before(Optional.ofNullable(call.<Calendar>getPropertyValue(JCONONPropertyIds.CALL_SELECTED_PRODUCT_END_DATE.value()))
                        .orElse(now)))) {
            throw new ClientMessageException(i18nService.getLabel("message.call.configuration.error", locale));
        }
        if (!(user.isAdmin() || callService.isMemberOfConcorsiGroup(user) || applicationUser.equals(user.getId()))) {
            throw new ClientMessageException(i18nService.getLabel("message.access.denieded", locale));
        }
        aclService.removeAcl(
                cmisService.getAdminSession(),
                application.<String>getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                Collections.singletonMap(user.getId(), ACLType.Contributor)
        );
        StreamSupport.stream(application.getChildren().spliterator(), false)
                .filter(cmisObject -> call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()).contains(cmisObject.getType().getId()))
                .filter(cmisObject -> {
                    return Optional.ofNullable(cmisObject.<String>getPropertyValue(JCONONPropertyIds.CM_OWNER.value()))
                            .map(owner -> owner.equalsIgnoreCase(applicationUser))
                            .orElse(Boolean.TRUE);
                })
                .forEach(cmisObject -> {
                    cmisService.createAdminSession()
                            .getObject(cmisObject)
                            .updateProperties(
                                    Stream.of(
                                            new AbstractMap.SimpleEntry<>(JCONONPropertyIds.CM_OWNER.value(), adminUserName),
                                            new AbstractMap.SimpleEntry<>(PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
                                                    Stream.concat(
                                                            cmisObject.getSecondaryTypes().stream().map(SecondaryType::getId),
                                                            Stream.of(JCONONPolicyType.OWNABLE.value())
                                                    ).collect(Collectors.toList())
                                            )).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                            );
                });
        cmisService.createAdminSession()
            .getObject(application)
            .updateProperties(
                    Collections.singletonMap(JCONONPropertyIds.APPLICATION_FL_SELECTED_PRODUCT_FINISHED.value(), Boolean.TRUE)
            );
    }

    private Optional<ApplicationState> applicationState(Session session, StatoDomanda statoDomanda, boolean esclusione) {
        final OperationContext defaultContext = OperationContextUtils.copyOperationContext(session.getDefaultContext());
        defaultContext.setMaxItemsPerPage(1);
        defaultContext.setIncludeAllowableActions(Boolean.FALSE);
        defaultContext.setIncludePathSegments(Boolean.FALSE);
        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName(), "root");
        criteriaApplications.addColumn(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value());
        criteriaApplications.addColumn(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value());
        criteriaApplications.add(Restrictions.inTree(competitionService.getCompetitionFolder().getString("id")));
        if (esclusione) {
            criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value(), statoDomanda.value));
        } else {
            criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), statoDomanda.value));
            criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        }
        ItemIterable<QueryResult> applications = criteriaApplications.executeQuery(session, false, defaultContext);
        final long totalNumItems = applications.getTotalNumItems();
        if (totalNumItems != 0) {
            return Optional.of(
                    new ApplicationState(
                            !esclusione?statoDomanda.value:null,
                            esclusione?statoDomanda.value:null,
                            totalNumItems
                    )
            );
        }
        return Optional.empty();
    }

    public List<ApplicationState> findAllApplicationState(Session session) {
        List<ApplicationState> applicationStates = new ArrayList<ApplicationState>();
        applicationState(session, StatoDomanda.PROVVISORIA, Boolean.FALSE).ifPresent(applicationState -> applicationStates.add(applicationState));
        applicationState(session, StatoDomanda.CONFERMATA, Boolean.FALSE).ifPresent(applicationState -> applicationStates.add(applicationState));
        applicationState(session, StatoDomanda.ESCLUSA, Boolean.TRUE).ifPresent(applicationState -> applicationStates.add(applicationState));
        applicationState(session, StatoDomanda.RINUNCIA, Boolean.TRUE).ifPresent(applicationState -> applicationStates.add(applicationState));
        applicationState(session, StatoDomanda.NON_AMMESSO, Boolean.TRUE).ifPresent(applicationState -> applicationStates.add(applicationState));
        applicationState(session, StatoDomanda.SCHEDA_ANONIMA_RESPINTA, Boolean.TRUE).ifPresent(applicationState -> applicationStates.add(applicationState));
        applicationState(session, StatoDomanda.SOSPESA, Boolean.TRUE).ifPresent(applicationState -> applicationStates.add(applicationState));
        return applicationStates;
    }

    public List<ApplicationState> findApplicationState(Session session, String user) {
        final OperationContext defaultContext = OperationContextUtils.copyOperationContext(session.getDefaultContext());
        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName(), "root");
        criteriaApplications.addColumn(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value());
        criteriaApplications.addColumn(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value());
        criteriaApplications.add(Restrictions.ne(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.INIZIALE.value));
        criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_USER.value(), user));
        ItemIterable<QueryResult> applications = criteriaApplications.executeQuery(session, false, defaultContext);
        return StreamSupport.stream(applications.getPage(Integer.MAX_VALUE).spliterator(), false)
                .map(queryResult -> {
                    return new ApplicationState(
                        queryResult.<String>getPropertyValueById(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()),
                        queryResult.<String>getPropertyValueById(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value())
                    );
                })
                .collect(Collectors.groupingBy(
                        Function.identity(),
                        Collectors.counting())).entrySet().stream()
                .map(applicationStateLongEntry -> {
                    return new ApplicationState(
                            applicationStateLongEntry.getKey().getStato_domanda(),
                            applicationStateLongEntry.getKey().getEsclusione_rinuncia(),
                            applicationStateLongEntry.getValue()
                    );
                }).collect(Collectors.toList());
    }

    public Map<String, Object> findApplications(Session session, boolean inTree, Integer page, Integer offset, String user, boolean fetchCall,
                                                String type, FilterType filterType, String callCode, LocalDate inizioScadenza,
                                                LocalDate fineScadenza, String applicationStatus,
                                                String firstname, String lastname, String codicefiscale,
                                                String callId) {
        Map<String, Object> model = new HashMap<String, Object>();
        final OperationContext defaultContext = OperationContextUtils.copyOperationContext(session.getDefaultContext());
        defaultContext.setMaxItemsPerPage(offset);
        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName(), "root");
        criteriaApplications.addColumn(PropertyIds.OBJECT_ID);
        criteriaApplications.addColumn(PropertyIds.PARENT_ID);
        if (inTree) {
            criteriaApplications.add(Restrictions.inTree(
                    Optional.ofNullable(callId).filter(s -> !s.isEmpty()).orElseGet(() -> competitionService.getCompetitionFolder().getString("id")))
            );
        }
        criteriaApplications.add(Restrictions.ne(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.INIZIALE.value));
        if (Optional.ofNullable(user).filter(s -> s.length() > 0).isPresent()) {
            criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_USER.value(), user));
        }
        final Optional<String> applicationStatusOpt = Optional.ofNullable(applicationStatus).filter(s -> !s.isEmpty()).filter(s -> !s.equalsIgnoreCase("all"));
        final Optional<String> typeOpt = Optional.ofNullable(type).filter(s -> !s.isEmpty());
        final Optional<String> firstnameOpt = Optional.ofNullable(firstname).filter(s -> !s.isEmpty());
        final Optional<String> lastnameOpt = Optional.ofNullable(lastname).filter(s -> !s.isEmpty());
        final Optional<String> codicefiscaleOpt = Optional.ofNullable(codicefiscale).filter(s -> !s.isEmpty());

        if (applicationStatusOpt.isPresent()) {
            switch (applicationStatusOpt.get()) {
                case "P" :
                    criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.PROVVISORIA.value));
                    break;
                case "C" :
                    criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.value));
                    break;
                case "active" :
                    criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.value));
                    criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
                    break;
                case "excluded" :
                    criteriaApplications.add(Restrictions.isNotNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
                    break;
            }
        }
        if (firstnameOpt.isPresent()) {
            criteriaApplications.add(Restrictions.contains(JCONONPropertyIds.APPLICATION_NOME.value(),
                    firstnameOpt
                            .map(s -> s.replace("'", "''"))
                            .map(s -> "\'*".concat(s).concat("*\''"))
                            .orElse("")
            ));
        }
        if (lastnameOpt.isPresent()) {
            criteriaApplications.add(Restrictions.contains(JCONONPropertyIds.APPLICATION_COGNOME.value(),
                    lastnameOpt
                            .map(s -> s.replace("'", "''"))
                            .map(s -> "\'*".concat(s).concat("*\''"))
                            .orElse("")
            ));
        }
        if (codicefiscaleOpt.isPresent()) {
            criteriaApplications.add(Restrictions.like(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value(),
                    codicefiscaleOpt
                            .map(String::toUpperCase)
                            .map(s -> "%".concat(s).concat("%"))
                            .orElse("")
            ));
        }

        List<Map<String, Object>> items = new ArrayList<>();
        ItemIterable<QueryResult> applications = criteriaApplications.executeQuery(session, false, defaultContext);
        long totalNumItems = applications.getTotalNumItems();
        for (QueryResult result : applications.skipTo(page * defaultContext.getMaxItemsPerPage()).getPage(defaultContext.getMaxItemsPerPage())) {
            final Map<String, Object> applicationMap = CMISUtil.convertToProperties(session.getObject(result.<String>getPropertyValueById(PropertyIds.OBJECT_ID), defaultContext));
            if (fetchCall) {
                final Folder call = Optional.ofNullable(session.getObject(result.<String>getPropertyValueById(PropertyIds.PARENT_ID), defaultContext))
                                                .filter(Folder.class::isInstance)
                                                .map(Folder.class::cast)
                                                .orElseThrow(() -> new CmisInvalidArgumentException("Parent object is not folder!"));
                if (typeOpt.isPresent() && !call.getType().getQueryName().equals(typeOpt.get())) {
                    totalNumItems--;
                    continue;
                }
                if (Optional.ofNullable(filterType).isPresent()) {
                    if ((filterType.equals(FilterType.active) && !callService.isBandoInCorso(call)) ||
                            (filterType.equals(FilterType.expire) && callService.isBandoInCorso(call))) {
                        totalNumItems--;
                        continue;
                    }
                }
                if (Optional.ofNullable(callCode).filter(s -> s.length() > 0).isPresent()) {
                    if (Optional.ofNullable(call.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()))
                                .map(s -> s.toUpperCase())
                                .filter(s -> !s.contains(callCode.toUpperCase()))
                                .isPresent()
                    )  {
                        totalNumItems--;
                        continue;
                    }
                }
                if (Optional.ofNullable(inizioScadenza).isPresent()) {
                    if (Optional.ofNullable(call.<Calendar>getPropertyValue(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value()))
                            .map(cal -> LocalDateTime.ofInstant(cal.toInstant(), ZoneId.systemDefault()))
                            .filter(dateTime -> dateTime.isBefore(inizioScadenza.atStartOfDay()))
                            .isPresent()
                    )  {
                        totalNumItems--;
                        continue;
                    }
                }
                if (Optional.ofNullable(fineScadenza).isPresent()) {
                    if (Optional.ofNullable(call.<Calendar>getPropertyValue(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value()))
                            .map(cal -> LocalDateTime.ofInstant(cal.toInstant(), ZoneId.systemDefault()))
                            .filter(dateTime -> dateTime.isAfter(fineScadenza.atStartOfDay()))
                            .isPresent()
                    )  {
                        totalNumItems--;
                        continue;
                    }
                }
                applicationMap.put("call", CMISUtil.convertToProperties(call));
            }
            items.add(applicationMap);
        }
        model.put("count", totalNumItems);
        model.put("page", page);
        model.put("offset", defaultContext.getMaxItemsPerPage());
        model.put("items", items);
        return model;
    }

    private Folder creaPendenza(Folder application, Folder call) throws InterruptedException {
        final LocalDateTime dataFineInvioDomande = LocalDateTime.ofInstant(
                call.<Calendar>getPropertyValue(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value()).toInstant(), ZoneId.systemDefault()
        );
        String registro = ProtocolRepository.ProtocolRegistry.PAGOPA.name();
        String anno = String.valueOf(LocalDateTime.now().get(ChronoField.YEAR));
        Long numeroProtocolloPagopa = null;
        try {
            numeroProtocolloPagopa = getNumeroProtocolloPagopa(anno, registro, 0);
            PendenzaDTO pendenzaDTO = new PendenzaDTO();
            pendenzaDTO.setProtocollo(numeroProtocolloPagopa);

            pendenzaDTO.setCausale("Pagamento diritti di segreteria, bando di concorso ".concat(call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())));
            pendenzaDTO.setCodicefiscale(
                    Optional.ofNullable(application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value()))
                            .orElse(
                                    StringUtils.substring(application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()),0,16)
                            )
            );
            pendenzaDTO.setAnagrafica(
                    application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value()).toUpperCase()
                            .concat(" ").concat(application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value()).toUpperCase())
            );
            pendenzaDTO.setIndirizzo(
                    Optional.ofNullable(application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_INDIRIZZO_RESIDENZA.value()))
                            .map(s -> s.substring(0, Math.min(70, s.length())))
                            .orElse("")
            );
            pendenzaDTO.setCap(
                    Optional.ofNullable(application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_CAP_RESIDENZA.value()))
                            .map(s -> {
                                try {
                                    return Integer.valueOf(s);
                                }catch (NumberFormatException _ex) {
                                    return null;
                                }
                            })
                            .orElse(null)
            );
            pendenzaDTO.setLocalita(application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_COMUNE_RESIDENZA.value()));
            pendenzaDTO.setProvincia(application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_PROVINCIA_RESIDENZA.value()));
            pendenzaDTO.setEmail(application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value()));
            pendenzaDTO.setImporto(call.<BigDecimal>getPropertyValue(PAGOPAPropertyIds.CALL_IMPORTO_PAGAMENTO_PAGOPA.value()));

            pendenzaDTO.setAnno(dataFineInvioDomande.get(ChronoField.YEAR));
            pendenzaDTO.setDataScadenza(dataFineInvioDomande);
            pendenzaDTO.setDataNotificaAvviso(LocalDateTime.now());
            pendenzaDTO.setDataPromemoriaScadenza(
                    dataFineInvioDomande.minusDays(
                            Optional.ofNullable(call.<BigInteger>getPropertyValue(JCONONPropertyIds.CALL_NUM_GIORNI_MAIL_SOLLECITO.value()))
                                    .orElse(BigInteger.TEN).longValue()
                    )
            );
            final Pendenza pendenza = pagopaService.creaPendenza(pendenzaDTO, numeroProtocolloPagopa);
            final Map<String, ?> properties = Collections.unmodifiableMap(Stream.of(
                            new AbstractMap.SimpleEntry<>(PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
                                    Stream.concat(
                                            application.getSecondaryTypes().stream().map(SecondaryType::getId),
                                            Stream.of(PAGOPAObjectType.JCONON_APPLICATION_PAGOPA.value())
                                    ).collect(Collectors.toList())
                            ),
                            new AbstractMap.SimpleEntry<>(PAGOPAPropertyIds.APPLICATION_NUMERO_AVVISO_PAGOPA.value(), pendenza.getNumeroAvviso()),
                            new AbstractMap.SimpleEntry<>(PAGOPAPropertyIds.APPLICATION_NUMERO_PROTOCOLLO_PAGOPA.value(), numeroProtocolloPagopa))
                    .collect(Collectors.toMap((e) -> e.getKey(), (e) -> e.getValue())));
            return (Folder) cmisService.createAdminSession().getObject(cmisService.createAdminSession().getObject(application).updateProperties(properties, Boolean.TRUE));
        } finally {
            if (numeroProtocolloPagopa != null) {
                protocolRepository.putNumProtocollo(registro, anno, numeroProtocolloPagopa);
            }
        }
    }

    public String pagaAvvisoPagopa(Session currentCMISSession, String applicationId, String contextURL, Locale locale) throws InterruptedException {
        Folder application = Optional.of(currentCMISSession.getObject(applicationId))
                .filter(Folder.class::isInstance)
                .map(Folder.class::cast)
                .orElseThrow(() -> new CmisInvalidArgumentException("Application folder not found!"));
        Folder call = Optional.of(currentCMISSession.getObject(application.getParentId()))
                .filter(Folder.class::isInstance)
                .map(Folder.class::cast)
                .orElseThrow(() -> new CmisInvalidArgumentException("Call folder not found!"));
        String numProtocollo = null;
        if (application.<List<String>>getPropertyValue(PropertyIds.SECONDARY_OBJECT_TYPE_IDS).contains(PAGOPAObjectType.JCONON_APPLICATION_PAGOPA.value())) {
            numProtocollo = application.<BigInteger>getPropertyValue(PAGOPAPropertyIds.APPLICATION_NUMERO_PROTOCOLLO_PAGOPA.value()).toString();
        } else {
            numProtocollo = creaPendenza(application, call).<BigInteger>getPropertyValue(PAGOPAPropertyIds.APPLICATION_NUMERO_PROTOCOLLO_PAGOPA.value()).toString();
        }
        final String statoPendenza = pagopaService.getStatoPendenza(numProtocollo);
        if (statoPendenza.equalsIgnoreCase("ESEGUITA")) {
            throw new ClientMessageException("Il pagamento risulta già eseguito!");
        }
        return pagopaService.pagaAvviso(numProtocollo, contextURL).getRedirect();
    }

    public String creaPendenzaPagopa(Session currentCMISSession, String applicationId, String contextURL, Locale locale) throws InterruptedException {
        Folder application = Optional.of(currentCMISSession.getObject(applicationId))
                .filter(Folder.class::isInstance)
                .map(Folder.class::cast)
                .orElseThrow(() -> new CmisInvalidArgumentException("Application folder not found!"));
        Folder call = Optional.of(currentCMISSession.getObject(application.getParentId()))
                .filter(Folder.class::isInstance)
                .map(Folder.class::cast)
                .orElseThrow(() -> new CmisInvalidArgumentException("Call folder not found!"));
        String iuv;
        if (application.<List<String>>getPropertyValue(PropertyIds.SECONDARY_OBJECT_TYPE_IDS).contains(PAGOPAObjectType.JCONON_APPLICATION_PAGOPA.value())){
            iuv = application.<String>getPropertyValue(PAGOPAPropertyIds.APPLICATION_NUMERO_AVVISO_PAGOPA.value());
        } else {
            iuv = creaPendenza(application, call).<String>getPropertyValue(PAGOPAPropertyIds.APPLICATION_NUMERO_AVVISO_PAGOPA.value());
        }
        return iuv;
    }

    public byte[] printAvvisoPagopa(Session currentCMISSession, String applicationId, String contextURL, Locale locale) throws InterruptedException {
        return pagopaService.stampaAvviso(creaPendenzaPagopa(currentCMISSession, applicationId, contextURL, locale));
    }

    private Long getNumeroProtocolloPagopa(String anno, String registro, int iterazioni) throws InterruptedException {
        try {
            return Optional.ofNullable(protocolRepository.getNumProtocollo(registro, anno))
                    .map(aLong -> {
                        if (aLong < 1000) {
                            return new Long(1001);
                        }
                        return aLong + 1;
                    }).orElse(new Long(1001));
        } catch (Exception e) {
            throw new ClientMessageException("Non è stato possibile recuperare il numero di protocollo per generare l'avviso di pagamento pagoPA, riprovare in un secondo momento.");
        }
    }

    public void uploadListProductSelected(Session session, HttpServletRequest req, CMISUser user, Locale locale) throws IOException {
        final String userId = user.getId();
        MultipartHttpServletRequest mRequest = resolver.resolveMultipart(req);
        Folder application = Optional.ofNullable(session.getObject(mRequest.getParameter("applicationId")))
                .filter(Folder.class::isInstance)
                .map(Folder.class::cast)
                .orElseThrow(() -> new ClientMessageException("Domanda non trovata!"));
        Calendar now = new GregorianCalendar();
        String applicationUser = application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value());
        Folder call = Optional.ofNullable(session.getObject(mRequest.getParameter("callId")))
                .filter(Folder.class::isInstance)
                .map(Folder.class::cast)
                .orElseThrow(() -> new ClientMessageException("Bando non trovato!"));
        List<String> users = call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_SELECTED_PRODUCT_USERS.value());
        if (!call.<List<String>>getPropertyValue(PropertyIds.SECONDARY_OBJECT_TYPE_IDS)
                .stream()
                .anyMatch(s -> s.equalsIgnoreCase(JCONONPolicyType.JCONON_CALL_ASPECT_PRODUCTS_AFTER_COMMISSION.value())) ||
                !(now.after(Optional.ofNullable(call.<Calendar>getPropertyValue(JCONONPropertyIds.CALL_SELECTED_PRODUCT_START_DATE.value()))
                        .orElse(now)) && now.before(Optional.ofNullable(call.<Calendar>getPropertyValue(JCONONPropertyIds.CALL_SELECTED_PRODUCT_END_DATE.value()))
                        .orElse(now)))) {
            throw new ClientMessageException(i18nService.getLabel("message.call.configuration.error", locale));
        }
        if (!(user.isAdmin() || callService.isMemberOfConcorsiGroup(user) || applicationUser.equals(user.getId())) &&
                Optional.ofNullable(application.getPropertyValue(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value())).isPresent()
        ) {
            throw new ClientMessageException(i18nService.getLabel("message.access.denieded", locale));
        }
        if (!(users.isEmpty() || (users.contains(user.getId()) || user.isAdmin() || callService.isMemberOfConcorsiGroup(user)))) {
            throw new ClientMessageException(i18nService.getLabel("message.access.denieded", locale));
        }
        final Optional<Document> listaElencoProdotti = StreamSupport.stream(application.getChildren().spliterator(), false)
                .filter(cmisObject -> {
                    return cmisObject.getType().getId().equals(JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE_ELENCO_PRODOTTI_SCELTI.value()) ||
                            cmisObject.getType().getId().equals(JCONONDocumentType.JCONON_CVPEOPLE_ATTACHMENT_ELENCO_PRODOTTI_SCELTI.value());
                })
                .map(Document.class::cast)
                .findAny();
        MultipartFile file = mRequest.getFile("pdf");
        ContentStreamImpl contentStream = new ContentStreamImpl();
        contentStream.setStream(file.getInputStream());
        contentStream.setFileName(file.getOriginalFilename());
        contentStream.setMimeType(file.getContentType());
        if (listaElencoProdotti.isPresent()) {
            Optional.ofNullable(cmisService.createAdminSession().getObject(listaElencoProdotti.get()))
                    .filter(Document.class::isInstance)
                    .map(Document.class::cast)
                    .ifPresent(document -> {
                        document.setContentStream(contentStream, true, true);
                    });
        } else {
            Map<String, Object> properties = new HashMap<String, Object>();
            properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_CVPEOPLE_ATTACHMENT_ELENCO_PRODOTTI_SCELTI.value());
            properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, Arrays.asList(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value()));
            properties.put(PropertyIds.NAME, file.getOriginalFilename());
            Optional.ofNullable(cmisService.createAdminSession().getObject(application))
                    .filter(Folder.class::isInstance)
                    .map(Folder.class::cast)
                    .ifPresent(folder -> {
                        folder.createDocument(properties, contentStream, VersioningState.MAJOR);
                    });
        }
    }

    public enum StatoDomanda {
        CONFERMATA("C", "Inviata"), INIZIALE("I", "Iniziale"), PROVVISORIA("P", "Provvisoria"), ESCLUSA("E", "Esclusione"),
        RINUNCIA("R", "Rinuncia"), SCHEDA_ANONIMA_RESPINTA("S", "Scheda anonima respinta"), NON_AMMESSO("N", "Non Ammesso"),
        SOSPESA("A", "Sospesa");
        private final String value, displayValue;

        StatoDomanda(String value, String displayValue) {
            this.displayValue = displayValue;
            this.value = value;
        }

        public static StatoDomanda fromValue(String v) {
            for (StatoDomanda c : StatoDomanda.values()) {
                if (c.value.equals(v)) {
                    return c;
                }
            }
            throw new IllegalArgumentException(v);
        }

        public String displayValue() {
            return displayValue;
        }

        public String getValue() {
            return value;
        }

    }

    public class ApplicationState implements Serializable{
        private final String stato_domanda;
        private final String esclusione_rinuncia;
        private Long count;

        public ApplicationState(String stato_domanda, String esclusione_rinuncia) {
            this.stato_domanda = stato_domanda;
            this.esclusione_rinuncia = esclusione_rinuncia;
        }

        public ApplicationState(String stato_domanda, String esclusione_rinuncia, Long count) {
            this(stato_domanda, esclusione_rinuncia);
            this.count = count;
        }

        public String getStato_domanda() {
            return stato_domanda;
        }

        public String getEsclusione_rinuncia() {
            return esclusione_rinuncia;
        }

        public Long getCount() {
            return count;
        }

        public void setCount(Long count) {
            this.count = count;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ApplicationState that = (ApplicationState) o;
            return Objects.equals(stato_domanda, that.stato_domanda) &&
                    Objects.equals(esclusione_rinuncia, that.esclusione_rinuncia);
        }

        @Override
        public int hashCode() {
            return Objects.hash(stato_domanda, esclusione_rinuncia);
        }
    }

}