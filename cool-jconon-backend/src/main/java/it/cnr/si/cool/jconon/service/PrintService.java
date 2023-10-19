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

package it.cnr.si.cool.jconon.service;

import com.google.gson.*;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.oned.Code39Writer;
import it.cnr.bulkinfo.BulkInfo;
import it.cnr.bulkinfo.BulkInfoImpl.FieldProperty;
import it.cnr.bulkinfo.BulkInfoImpl.FieldPropertySet;
import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeVersionService;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.AttachmentBean;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.rest.util.Util;
import it.cnr.cool.security.GroupsEnum;
import it.cnr.cool.security.service.GroupService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISAuthority;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.Pair;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.util.UriUtils;
import it.cnr.cool.web.scripts.exception.CMISApplicationException;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.*;
import it.cnr.si.cool.jconon.model.ApplicationModel;
import it.cnr.si.cool.jconon.model.PrintDetailBulk;
import it.cnr.si.cool.jconon.model.PrintParameterModel;
import it.cnr.si.cool.jconon.pagopa.model.PAGOPAPropertyIds;
import it.cnr.si.cool.jconon.pagopa.service.PAGOPAService;
import it.cnr.si.cool.jconon.repository.CacheRepository;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.service.application.ApplicationService.StatoDomanda;
import it.cnr.si.cool.jconon.service.cache.CompetitionFolderService;
import it.cnr.si.cool.jconon.util.CMISPropertyIds;
import it.cnr.si.cool.jconon.util.JcononGroups;
import it.cnr.si.cool.jconon.util.QrCodeUtil;
import it.cnr.si.cool.jconon.util.StatoComunicazione;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.Order;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JsonDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRPdfExporterParameter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.fill.JRGzipVirtualizer;
import net.sf.jasperreports.export.SimpleDocxReportConfiguration;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleXlsReportConfiguration;
import net.sf.jasperreports.repo.InputStreamResource;
import net.sf.jasperreports.repo.ReportResource;
import net.sf.jasperreports.repo.RepositoryService;
import net.sf.jasperreports.repo.Resource;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.definitions.PropertyBooleanDefinition;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDateTimeDefinition;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDecimalDefinition;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.enums.*;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisRuntimeException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisStreamNotSupportedException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.NotImplementedException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.PDPageContentStream.AppendMode;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.JPEGFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.*;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.format.number.NumberStyleFormatter;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.awt.Color;
import java.io.*;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Service
public class PrintService {
    public static final String VUOTO = "vuoto";
    public static final String JCONON_CALL_PUNTEGGIO_1 = "jconon_call:punteggio_1";
    public static final String JCONON_CALL_PUNTEGGIO_2 = "jconon_call:punteggio_2";
    public static final String JCONON_CALL_PUNTEGGIO_3 = "jconon_call:punteggio_3";
    public static final String JCONON_CALL_PUNTEGGIO_4 = "jconon_call:punteggio_4";
    public static final String JCONON_CALL_PUNTEGGIO_5 = "jconon_call:punteggio_5";
    public static final String JCONON_CALL_PUNTEGGIO_6 = "jconon_call:punteggio_6";
    public static final String JCONON_CALL_PUNTEGGIO_7 = "jconon_call:punteggio_7";

    public static final String JCONON_APPLICATION_PUNTEGGIO_TITOLI = "jconon_application:punteggio_titoli";
    public static final String JCONON_APPLICATION_PUNTEGGIO_SCRITTO = "jconon_application:punteggio_scritto";
    public static final String JCONON_APPLICATION_PUNTEGGIO_SECONDO_SCRITTO = "jconon_application:punteggio_secondo_scritto";
    public static final String JCONON_APPLICATION_PUNTEGGIO_COLLOQUIO = "jconon_application:punteggio_colloquio";
    public static final String JCONON_APPLICATION_PUNTEGGIO_PROVA_PRATICA = "jconon_application:punteggio_prova_pratica";
    public static final String JCONON_APPLICATION_PUNTEGGIO_6 = "jconon_application:punteggio_6";
    public static final String JCONON_APPLICATION_PUNTEGGIO_7 = "jconon_application:punteggio_7";
    public static final String TESTO = "Testo";
    private static final String P_JCONON_APPLICATION_ASPECT_ISCRIZIONE_LISTE_ELETTORALI = "P:jconon_application:aspect_iscrizione_liste_elettorali";
    private static final String P_JCONON_APPLICATION_ASPECT_GODIMENTO_DIRITTI = "P:jconon_application:aspect_godimento_diritti";
    private static final Logger LOGGER = LoggerFactory.getLogger(PrintService.class);
    private static final String SHEET_DOMANDE = "domande";
    private static final String PRINT_RESOURCE_PATH = "/it/cnr/si/cool/jconon/print/";
    private final List<String> headCSVApplication = Arrays.asList(
            "Codice bando", "Struttura di Riferimento", "MacroArea", "Settore Tecnologico",
            "Matricola", "Cognome", "Nome", "Data di nascita", "Sesso", "Nazione di nascita",
            "Luogo di nascita", "Prov. di nascita", "Nazione di Residenza", "Provincia di Residenza",
            "Comune di Residenza", "Indirizzo di Residenza", "CAP di Residenza", "Codice Fiscale",
            "Tipologia Documento", "Numero Documento", "Data Scadenza Documento", "Documento rilasciato da",
            "Struttura", "Ruolo", "Direttore in carica", "Struttura altra PA", "Ruolo altra PA",
            "Altra Struttura", "Altro Ruolo", "Profilo", "Struttura di appartenenza",
            "Settore tecnologico di competenza", "Area scientifica di competenza",
            "Email", "Email PEC", "Nazione Reperibilita'", "Provincia di Reperibilita'",
            "Comune di Reperibilita'", "Indirizzo di Reperibilita'",
            "CAP di Reperibilita'", "Telefono", "Data Invio Domanda",
            "Stato Domanda", "Esclusione/Rinuncia", "Numero Protocollo", "Data Protocollo", "Esito", "Note"
    );
    private final List<String> headCSVApplicationIstruttoria = Arrays.asList(
            "Codice bando", "Nome Utente", "Cognome", "Nome", "Codice Fiscale", "Matricola", "Stato Domanda"
    );
    private final List<String> headCSVCall = Arrays.asList(
            "Tipologia", "Codice bando", "Sede di lavoro", "Struttura di riferimento",
            "N° G.U.R.I.", "Data G.U.R.I.", "Data scadenza", "Responsabile (Nominativo)",
            "Email Responsabile.", "N. Posti", "Profilo/Livello",
            "Bando - Num. Protocollo", "Bando - Data Protocollo",
            "Commissione - Num. Protocollo", "Commissione - Data Protocollo",
            "Mod. Commissione - Num. Protocollo", "Mod. Commissione - Data Protocollo",
            "Nom. Segretario - Num. Protocollo", "Nom. Segretario - Data Protocollo",
            "Graduatoria - Num. Protocollo", "Graduatoria - Data Protocollo", "Num. Domande Inviate",
            "Num. Domande Attive", "Num. Domande Escluse"
    );
    private final List<String> headCSVCommission = Arrays.asList(
            "Codice bando", "UserName", "Appellativo",
            "Cognome", "Nome", "Sesso", "Qualifica", "Ruolo", "EMail"
    );
    private final List<String> headCSVPunteggi = Arrays.asList(
            "ID DOMANDA", "Cognome", "Nome", "Data di nascita", "Codice Fiscale", "Email", "Email PEC", "Stato");

    private final List<String> headCSVApplicationPunteggi = Arrays.asList(
            "Codice bando", "Sede di lavoro", "Struttura di riferimento", "N. Posti", "Profilo/Livello",
            "Cognome", "Nome", "Data di nascita", "Codice Fiscale", "Matricola", "Email", "Email PEC",
            "Totale Punteggi", "Graduatoria", "Esito", "Note",
            "Data Protocollo Graduatoria", "Numero Protocollo Graduatoria",
            "Data Protocollo Assunzione Idoneo", "Numero Protocollo Assunzione Idoneo"
    );

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
    private final SimpleDateFormat dateTimeFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

    @Autowired
    protected CMISService cmisService;
    @Autowired
    protected UserService userService;
    @Autowired
    protected I18nService i18nService;
    @Autowired
    protected MailService mailService;
    @Autowired
    protected NodeVersionService nodeVersionService;
    @Autowired
    protected BulkInfoCoolService bulkInfoService;
    @Autowired
    protected CompetitionFolderService competitionService;
    @Autowired
    protected ACLService aclService;
    @Autowired
    protected TypeService typeService;
    @Autowired
    protected GroupService groupService;
    @Autowired
    protected CacheRepository cacheRepository;

    @Autowired
    protected ApplicationContext context;

    @Autowired(required = false)
    protected SiperService siperService;

    @Autowired
    protected PAGOPAService pagopaService;

    @Value("${protocol.register.namespace}")
    protected String protocolNamespace;

    public Pair<String, byte[]> printApplicationImmediate(Session cmisSession, String nodeRef, final String contextURL, final Locale locale) {
        LOGGER.info("Start print application immediate width id: " + nodeRef);
        Folder application = (Folder) cmisSession.getObject(nodeRef);
        application.refresh();
        String nameRicevutaReportModel = getNameRicevutaReportModel(cmisSession, application, locale);
        byte[] stampaByte = getRicevutaReportModel(cmisSession,
                application, contextURL, nameRicevutaReportModel, true);
        if (LOGGER.isInfoEnabled())
            LOGGER.info("End print application immediate width id: " + nodeRef);
        return new Pair<String, byte[]>(nameRicevutaReportModel, stampaByte);
    }

    public void printApplicationImmediateAndSave(Session cmisSession, String nodeRef, final String contextURL, final Locale locale) {
        LOGGER.info("Start print application immediate and save width id: " + nodeRef);
        Folder application = (Folder) cmisSession.getObject(nodeRef);
        application.refresh();
        String nameRicevutaReportModel = getNameRicevutaReportModel(cmisSession, application, locale);
        byte[] stampaByte = getRicevutaReportModel(cmisSession,
                application, contextURL, nameRicevutaReportModel, false);
        InputStream is = new ByteArrayInputStream(stampaByte);
        archiviaRicevutaReportModel(cmisSession, application, is, nameRicevutaReportModel, true);
        if (LOGGER.isInfoEnabled())
            LOGGER.info("End print application immediate and save width id: " + nodeRef);
    }

    public Pair<String, byte[]> downloadPrintApplication(Session cmisSession, String nodeRef, final String contextURL, final Locale locale) {
        LOGGER.info("Download print application width id: " + nodeRef);
        Folder application = (Folder) cmisSession.getObject(nodeRef);
        application.refresh();

        return Optional.ofNullable(findRicevutaApplicationId(cmisSession, application))
                .map(objectId -> (Document) cmisSession.getObject(objectId))
                .map(document -> {
                    try {
                        return new Pair<String, byte[]>(document.getName(), IOUtils.toByteArray(document.getContentStream().getStream()));
                    } catch (IOException e) {
                        throw new ClientMessageException("Print not found of application " + nodeRef, e);
                    }
                }).orElseThrow(() -> new ClientMessageException("Print not found of application " + nodeRef));
    }

    protected boolean isConfirmed(Folder application) {
        return application.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(ApplicationService.StatoDomanda.CONFERMATA.getValue());
    }

    public void printCurriculumStrutturato(Session cmisSession, String nodeRef, final String contextURL, final Locale locale) {
        try {
            LOGGER.info("Start print curriculum for application width id: {}", nodeRef);
            Folder application = (Folder) cmisSession.getObject(nodeRef);
            String nameRicevutaReportModel = "Curriculum strutturato.docx";
            byte[] stampaByte = getCurriculumStrutturatoReportModel(cmisSession,
                    application, contextURL, nameRicevutaReportModel, false);
            InputStream is = new ByteArrayInputStream(stampaByte);
            Map<String, Object> properties = new HashMap<String, Object>();
            properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE_STRUTTURATO.value());
            properties.put(PropertyIds.NAME, nameRicevutaReportModel);
            ContentStream contentStream = new ContentStreamImpl(nameRicevutaReportModel,
                    BigInteger.valueOf(is.available()),
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    is);
            Document doc = application.createDocument(properties, contentStream, VersioningState.MAJOR);
            if (LOGGER.isInfoEnabled())
                LOGGER.info("End generate curriculum for application width id: {} and document id: {}", nodeRef, doc.getId());
        } catch (Exception t) {
            LOGGER.error("Error while print curriculum for application width id:" + nodeRef, t);
        }
    }

    public void printApplication(String nodeRef, final String contextURL, final Locale locale, final boolean email) {
        try {
            LOGGER.info("Start print application width id: " + nodeRef);
            Session cmisSession = cmisService.createAdminSession();
            Folder application = (Folder) cmisSession.getObject(nodeRef);
            Boolean confirmed = isConfirmed(application);
            Folder call = (Folder) cmisSession.getObject(application.getParentId());
            application.refresh();
            CMISUser applicationUser;
            try {
                applicationUser = userService.loadUserForConfirm(
                        application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
            } catch (CoolUserFactoryException e) {
                throw new ClientMessageException("User not found of application " + nodeRef, e);
            }
            String nameRicevutaReportModel = getNameRicevutaReportModel(cmisSession, application, locale);
            byte[] stampaByte = getRicevutaReportModel(cmisSession,
                    application, contextURL, nameRicevutaReportModel, false);
            InputStream is = new ByteArrayInputStream(stampaByte);
            archiviaRicevutaReportModel(cmisSession, application, is, nameRicevutaReportModel, confirmed);

            /**
             * Spedisco la mail con la stampa allegata
             */
            if (email) {
                Map<String, Object> mailModel = new HashMap<String, Object>();
                List<String> emailList = new ArrayList<String>();
                final String emailComunicazione = Optional.ofNullable(
                        application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value())
                ).orElse(applicationUser.getEmail());

                emailList.add(emailComunicazione);
                mailModel.put("contextURL", contextURL);
                mailModel.put("folder", application);
                mailModel.put("call", call);
                mailModel.put("message", context.getBean("messageMethod", locale));
                mailModel.put("email_comunicazione", emailComunicazione);
                EmailMessage message = new EmailMessage();
                message.setRecipients(emailList);
                message.setCcRecipients(getCcRecipientsForPrint(confirmed));
                message.setBccRecipients(getBccRecipientsForPrint(confirmed));
                String body;
                if (confirmed) {
                    body = Util.processTemplate(mailModel, "/pages/application/application.registration.html.ftl");
                    message.setSubject(i18nService.getLabel("subject-info", locale) + i18nService.getLabel("subject-confirm-domanda", locale, call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString()));
                    Map<String, Object> properties = new HashMap<String, Object>();
                    properties.put(JCONONPropertyIds.APPLICATION_DUMMY.value(), "{\"stampa_archiviata\" : true}");
                    application.updateProperties(properties);
                } else {
                    body = Util.processTemplate(mailModel, "/pages/application/application.print.html.ftl");
                    message.setSubject(i18nService.getLabel("subject-info", locale) +
                            i18nService.getLabel("subject-print-domanda", locale, call.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString()));
                }
                message.setBody(body);
                message.setAttachments(Arrays.asList(new AttachmentBean(nameRicevutaReportModel, stampaByte)));
                mailService.send(message);
            }
            if (LOGGER.isInfoEnabled())
                LOGGER.info("End print application width id: " + nodeRef);
        } catch (Exception t) {
            LOGGER.error("Error while print application width id:" + nodeRef, t);
        }
    }

    protected List<String> getCcRecipientsForPrint(boolean confirmed) {
        return Collections.emptyList();
    }

    protected List<String> getBccRecipientsForPrint(boolean confirmed) {
        return Collections.emptyList();
    }

    public String getNameRicevutaReportModel(Session cmisSession, Folder application, Locale locale) throws CMISApplicationException {
        String shortNameEnte = i18nService.getLabel("shortNameEnte", locale);
        Folder call = (Folder) cmisSession.getObject(application.getParentId());
        DateFormat formatter = new SimpleDateFormat("yyyy/MM/dd");
        GregorianCalendar dataDomanda = application.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value());
        String dataApplication = "PROVVISORIA";
        if (dataDomanda != null)
            dataApplication = formatter.format(dataDomanda.getTime()).replace("/", "_");

        return shortNameEnte +
                "-" +
                call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()) +
                "-RD-" +
                application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()) +
                "-" +
                dataApplication +
                ".pdf";
    }

    public byte[] getCurriculumStrutturatoReportModel(Session cmisSession, Folder application, String contextURL, String nameRicevutaReportModel, boolean immediate)
            throws CMISApplicationException {
        Folder call = application.getFolderParent();
        Locale locale = Locale.ITALY;
        Properties props = i18nService.loadLabels(locale);
        props.putAll(competitionService.getDynamicLabels(call, cmisSession));
        ApplicationModel applicationModel = new ApplicationModel(application,
                cmisSession.getDefaultContext(),
                props, contextURL);
        try {
            CMISUser applicationUser = userService.loadUserForConfirm(application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
            applicationModel.getProperties().put("jasperReport:user_matricola", applicationUser.getMatricola());
            applicationModel.getProperties().put("jasperReport:user_email_comunicazione", Optional.ofNullable(
                    application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value())
            ).orElse(applicationUser.getEmail()));
        } catch (CoolUserFactoryException e) {
            LOGGER.error("User not found", e);
        }

        final Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(GregorianCalendar.class, new JsonSerializer<GregorianCalendar>() {
                    @Override
                    public JsonElement serialize(GregorianCalendar src, Type typeOfSrc,
                                                 JsonSerializationContext context) {
                        return context.serialize(src.getTime());
                    }
                }).create();

        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM.value()) != null) {
            applicationModel.getProperties().put("curriculum", getCurriculum(
                    call
                            .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM
                                    .value()),
                    application, cmisSession, applicationModel));
        }
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM_ULTERIORE.value()) != null) {
            applicationModel.getProperties().put("curriculum_ulteriore", getCurriculum(
                    call
                            .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM_ULTERIORE
                                    .value()),
                    application, cmisSession, applicationModel));
        }
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()) != null) {
            applicationModel.getProperties().put("prodotti", getProdotti(
                    call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()),
                    application, JCONONPolicyType.PEOPLE_NO_SELECTED_PRODUCT, cmisSession, applicationModel));
            applicationModel.getProperties().put("prodottiScelti", getProdotti(
                    call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()),
                    application, JCONONPolicyType.PEOPLE_SELECTED_PRODUCT, cmisSession, applicationModel));
        }
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_SCHEDE_ANONIME.value()) != null) {
            applicationModel.getProperties().put("schedeAnonime", getCurriculum(
                    call
                            .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_SCHEDE_ANONIME
                                    .value()),
                    application, cmisSession, applicationModel));
        }
        String labelSottoscritto = i18nService.getLabel(
                "application.text.sottoscritto.lower." + application.getPropertyValue(JCONONPropertyIds.APPLICATION_SESSO.value()), locale);

        for (Object key : call.getProperty(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA.value()).getValues()) {
            applicationModel.getProperties().put(String.valueOf(key), props.get(key));
        }
        if (immediate) {
            applicationModel.getProperties().put(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue());
            applicationModel.getProperties().put(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value(), Calendar.getInstance());
        }
        String json = "{\"properties\":" + gson.toJson(applicationModel.getProperties()) + "}";

        try {

            Map<String, Object> parameters = new HashMap<String, Object>();
            JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)), "properties");
            JRGzipVirtualizer vir = new JRGzipVirtualizer(100);
            final ResourceBundle resourceBundle = ResourceBundle.getBundle(
                    "net.sf.jasperreports.view.viewer", locale);
            parameters.put(JRParameter.REPORT_LOCALE, locale);
            parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
            parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
            parameters.put(JRParameter.REPORT_VIRTUALIZER, vir);
            parameters.put("DIR_IMAGE", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());
            parameters.put("SUBREPORT_DIR", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());

            ClassLoader classLoader = ClassLoader.getSystemClassLoader();
            parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);

            JasperReport jasperReport = cacheRepository.jasperReport(PRINT_RESOURCE_PATH + "CurriculumStrutturato.jrxml", jasperCompileManager());
            JasperPrint jasperPrint = jasperFillManager().fill(jasperReport, parameters);

            ByteArrayOutputStream os = new ByteArrayOutputStream();
            JRDocxExporter export = new JRDocxExporter();
            export.setExporterInput(new SimpleExporterInput(jasperPrint));
            export.setExporterOutput(new SimpleOutputStreamExporterOutput(os));

            SimpleDocxReportConfiguration config = new SimpleDocxReportConfiguration();
            config.setFlexibleRowHeight(false); //Set desired configuration
            config.setFramesAsNestedTables(false);
            export.setConfiguration(config);
            export.exportReport();

            return os.toByteArray();
        } catch (Exception e) {
            throw new CMISApplicationException("Error in JASPER", e);
        }
    }

    @SuppressWarnings({"unchecked", "deprecation"})
    public byte[] getRicevutaReportModel(Session cmisSession, Folder application, String contextURL, String nameRicevutaReportModel, boolean immediate)
            throws CMISApplicationException {
        Folder call = application.getFolderParent();
        Locale locale = Locale.ITALY;
        Properties props = i18nService.loadLabels(locale);
        props.putAll(competitionService.getDynamicLabels(call, cmisSession));
        ApplicationModel applicationModel = new ApplicationModel(application,
                cmisSession.getDefaultContext(),
                props, contextURL);
        try {
            CMISUser applicationUser = userService.loadUserForConfirm(application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
            applicationModel.getProperties().put("jasperReport:user_matricola", applicationUser.getMatricola());
            applicationModel.getProperties().put(
                    "jasperReport:user_email_comunicazione",
                    Optional.ofNullable(
                            application.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value())
                    ).orElse(applicationUser.getEmail())
            );
            applicationModel.getProperties().put("jconon_application:objectId", application.getId());
        } catch (CoolUserFactoryException e) {
            LOGGER.error("User not found", e);
        }

        final Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(GregorianCalendar.class, new JsonSerializer<GregorianCalendar>() {
                    @Override
                    public JsonElement serialize(GregorianCalendar src, Type typeOfSrc,
                                                 JsonSerializationContext context) {
                        return context.serialize(src.getTime());
                    }
                }).create();
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS
                .value()) != null) {
            applicationModel
                    .getProperties()
                    .put("allegati",
                            getAllegati(
                                    application,
                                    JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT,
                                    cmisSession, applicationModel));
        }

        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM.value()) != null) {
            applicationModel.getProperties().put("curriculum", getCurriculum(
                    call
                            .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM
                                    .value()),
                    application, cmisSession, applicationModel));
        }
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM_ULTERIORE.value()) != null) {
            applicationModel.getProperties().put("curriculum_ulteriore", getCurriculum(
                    call
                            .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM_ULTERIORE
                                    .value()),
                    application, cmisSession, applicationModel));
        }
        final List<String> elencoSezioneProdotti = call.<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value());
        if (elencoSezioneProdotti != null) {
            if (elencoSezioneProdotti.contains(JCONONDocumentType.JCONON_CVPEOPLE_ATTACHMENT_PRODOTTI_SCELTI_MULTIPLO.value())) {
                applicationModel.getProperties().put("prodotti", getAllegati(
                        application,
                        JCONONPolicyType.PEOPLE_NO_SELECTED_PRODUCT,
                        cmisSession, applicationModel));

                applicationModel.getProperties().put("prodottiScelti", getAllegati(
                        application,
                        JCONONPolicyType.PEOPLE_SELECTED_PRODUCT,
                        cmisSession, applicationModel));
            } else {
                applicationModel.getProperties().put("prodotti", getProdotti(
                        elencoSezioneProdotti,
                        application, JCONONPolicyType.PEOPLE_NO_SELECTED_PRODUCT, cmisSession, applicationModel));
                applicationModel.getProperties().put("prodottiScelti", getProdotti(
                        elencoSezioneProdotti,
                        application, JCONONPolicyType.PEOPLE_SELECTED_PRODUCT, cmisSession, applicationModel));
            }
        }
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_SCHEDE_ANONIME.value()) != null) {
            applicationModel.getProperties().put("schedeAnonime", getCurriculum(
                    call
                            .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_SCHEDE_ANONIME
                                    .value()),
                    application, cmisSession, applicationModel));
        }
        applicationModel.getProperties().put(Dichiarazioni.dichiarazioni.name(),
                getDichiarazioni(
                        bulkInfoService.find(application.getType().getId()),
                        application,
                        JCONONPropertyIds.CALL_ELENCO_ASPECTS,
                        applicationModel, Dichiarazioni.dichiarazioni));
        applicationModel.getProperties().put(Dichiarazioni.datiCNR.name(), getDichiarazioni(
                bulkInfoService.find(application.getType().getId()),
                application,
                JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_CNR,
                applicationModel, Dichiarazioni.datiCNR));
        applicationModel.getProperties().put(Dichiarazioni.ulterioriDati.name(), getDichiarazioni(
                bulkInfoService.find(application.getType().getId()),
                application,
                JCONONPropertyIds.CALL_ELENCO_ASPECTS_ULTERIORI_DATI,
                applicationModel, Dichiarazioni.ulterioriDati));
        applicationModel.getProperties().put(Dichiarazioni.sezione4.name(), getDichiarazioni(
                bulkInfoService.find(application.getType().getId()),
                application,
                JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_4,
                applicationModel, Dichiarazioni.sezione4));
        applicationModel.getProperties().put(Dichiarazioni.sezione5.name(), getDichiarazioni(
                bulkInfoService.find(application.getType().getId()),
                application,
                JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_5,
                applicationModel, Dichiarazioni.sezione5));
        String labelSottoscritto = i18nService.getLabel(
                "application.text.sottoscritto.lower." + application.getPropertyValue(JCONONPropertyIds.APPLICATION_SESSO.value()), locale);

        String labelSanzioniPenali =
                i18nService.getLabel("text.jconon_application_dichiarazione_sanzioni_penali_" + call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()), locale);
        if (labelSanzioniPenali == null)
            labelSanzioniPenali = i18nService.getLabel("text.jconon_application_dichiarazione_sanzioni_penali", locale, labelSottoscritto);
        else
            labelSanzioniPenali = i18nService.getLabel("text.jconon_application_dichiarazione_sanzioni_penali_" + call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()), locale, labelSottoscritto);

        applicationModel.getProperties().put("label_jconon_application_dichiarazione_sanzioni_penali", labelSanzioniPenali);
        applicationModel.getProperties().put("label_jconon_application_dichiarazione_dati_personali",
                i18nService.getLabel("text.jconon_application_dichiarazione_dati_personali", locale, labelSottoscritto));
        for (Object key : call.getProperty(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA.value()).getValues()) {
            String sectionLabel = (String)props.get(key);
            final int i = sectionLabel.indexOf("<sub>");
            if (i != -1)
                sectionLabel = sectionLabel.substring(0, i);
            applicationModel.getProperties().put(String.valueOf(key), sectionLabel);
        }
        if (immediate) {
            applicationModel.getProperties().put(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue());
            applicationModel.getProperties().put(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value(), Calendar.getInstance());
        }
        String json = "{\"properties\":" + gson.toJson(applicationModel.getProperties()) + "}";

        try {
            /**
             * Calcolo il QRCODE del link alla stampa
             */
            ByteArrayOutputStream qrcode = QrCodeUtil.getQrcode(contextURL + "/rest/application/print-download?nodeRef=" + application.getId());

            Map<String, Object> parameters = new HashMap<String, Object>();
            JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)), "properties");
            JRGzipVirtualizer vir = new JRGzipVirtualizer(100);
            final ResourceBundle resourceBundle = ResourceBundle.getBundle(
                    "net.sf.jasperreports.view.viewer", locale);
            parameters.put(JRParameter.REPORT_LOCALE, locale);
            parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
            parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
            parameters.put(JRParameter.REPORT_VIRTUALIZER, vir);
            parameters.put("DIR_IMAGE", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());
            parameters.put("SUBREPORT_DIR", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());

            if (qrcode != null) {
                parameters.put("QRCODE", new ByteArrayInputStream(qrcode.toByteArray()));
            }
            ClassLoader classLoader = ClassLoader.getSystemClassLoader();
            parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);

            JasperReport jasperReport = cacheRepository.jasperReport(PRINT_RESOURCE_PATH + "DomandaConcorso.jrxml", jasperCompileManager());
            JasperPrint jasperPrint = jasperFillManager().fill(jasperReport, parameters);

            ByteArrayOutputStream os = new ByteArrayOutputStream();
            JRPdfExporter exporter = new JRPdfExporter();
            exporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
            exporter.setParameter(JRExporterParameter.OUTPUT_STREAM, os);
            exporter.setParameter(JRPdfExporterParameter.FORCE_LINEBREAK_POLICY, Boolean.TRUE);
            exporter.exportReport();
            return os.toByteArray();
        } catch (Exception e) {
            throw new CMISApplicationException("Error in JASPER", e);
        }
    }

    public String archiviaRicevutaReportModel(Folder application, InputStream is, String nameRicevutaReportModel, boolean confermata) throws CMISApplicationException {
        Session cmisSession = cmisService.createAdminSession();
        return archiviaRicevutaReportModel(cmisSession, application, is, nameRicevutaReportModel, confermata);
    }

    public String archiviaRicevutaReportModel(Session cmisSession, Folder application,
                                              InputStream is, String nameRicevutaReportModel, boolean confermata) throws CMISApplicationException {
        Map<String, Object> properties = new HashMap<String, Object>();
        properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION.value());
        properties.put(PropertyIds.NAME, nameRicevutaReportModel);
        return archiviaRicevutaReportModel(cmisSession, application, properties, is, nameRicevutaReportModel, confermata);
    }

    public String archiviaRicevutaReportModel(Session cmisSession, Folder application, Map<String, Object> properties,
                                              InputStream is, String nameRicevutaReportModel, boolean confermata) throws CMISApplicationException {
        try {
            ContentStream contentStream = new ContentStreamImpl(nameRicevutaReportModel,
                    BigInteger.valueOf(is.available()),
                    "application/pdf",
                    is);
            String docId = findRicevutaApplicationId(cmisSession, application);
            if (docId != null) {
                try {
                    Document doc = (Document) cmisSession.getObject(docId);
                    if (confermata) {
                        int pointPosition = nameRicevutaReportModel.lastIndexOf('.');
                        String nameRicevutaReportModels = nameRicevutaReportModel.substring(0, pointPosition).
                                concat("-").concat(doc.getVersionLabel()).concat(".pdf");
                        doc.setContentStream(contentStream, true, true);
                        doc = doc.getObjectOfLatestVersion(false);
                        docId = checkInPrint(cmisService.getAdminSession(), doc.getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()), is, nameRicevutaReportModels);
                    } else {
                        doc = cmisSession.getLatestDocumentVersion(doc.updateProperties(properties, true));
                        doc.setContentStream(contentStream, true, true);
                        doc = doc.getObjectOfLatestVersion(false);
                        docId = doc.getId();
                    }
                } catch (CmisObjectNotFoundException e) {
                    LOGGER.warn("cmis object not found {}", nameRicevutaReportModel, e);
                    docId = createApplicationDocument(application, contentStream, properties);
                } catch (CmisStreamNotSupportedException ex) {
                    LOGGER.error("Cannot set Content Stream on id:" + docId + " ------" + ex.getErrorContent(), ex);
                    throw ex;
                }
            } else {
                docId = createApplicationDocument(application, contentStream, properties);
            }
            return docId;
        } catch (Exception e) {
            throw new CMISApplicationException("Error in JASPER", e);
        }
    }

    protected String checkInPrint(BindingSession cmisSession, final String applicationPrintId, final InputStream is, final String name) {
        String link = cmisService.getBaseURL().concat("service/cnr/jconon/manage-application/checkIn");
        UrlBuilder url = new UrlBuilder(link);
        url = url.addParameter("applicationPrintId", applicationPrintId);
        url = url.addParameter("name", name);
        Response resp = cmisService.getHttpInvoker(cmisSession).invokePOST(url, MimeTypes.JSON.mimetype(),
                new Output() {
                    @Override
                    public void write(OutputStream out) throws Exception {
                        IOUtils.copy(is, out);
                    }
                }, cmisSession);
        int status = resp.getResponseCode();
        if (status == HttpStatus.SC_NOT_FOUND || status == HttpStatus.SC_BAD_REQUEST || status == HttpStatus.SC_INTERNAL_SERVER_ERROR)
            throw new CMISApplicationException("ChechIn Application error. Exception: " + resp.getErrorContent());
        try {
            return new JSONObject(IOUtils.toString(resp.getStream())).getString("objectId");
        } catch (JSONException | IOException e) {
            throw new CMISApplicationException("ChechIn Application error.", e);
        }
    }

    private String createApplicationDocument(Folder application, ContentStream contentStream, Map<String, Object> properties) {
        Document doc = application.createDocument(properties, contentStream, VersioningState.MINOR);
        nodeVersionService.addAutoVersion(doc, false);
        return doc.getId();
    }

    public String findDocRiconoscimentoId(Session cmisSession, Folder source) {
        return findAttachmentId(cmisSession, source, JCONONDocumentType.JCONON_ATTACHMENT_DOCUMENTO_RICONOSCIMENTO);
    }

    public String findCurriculumId(Session cmisSession, Folder source) {
        return findAttachmentId(cmisSession, source, JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE);
    }

    public String findRicevutaApplicationId(Session cmisSession, Folder source) {
        return findAttachmentId(cmisSession, source, JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION, false);
    }

    public String findAttachmentId(Session cmisSession, Folder source, JCONONDocumentType documentType) {
        return findAttachmentId(cmisSession, source, documentType, true);
    }

    public String findAttachmentId(Session cmisSession, Folder source, JCONONDocumentType documentType, boolean search) {
        if (search) {
            Criteria criteria = CriteriaFactory.createCriteria(documentType.queryName());
            criteria.addColumn(PropertyIds.OBJECT_ID);
            criteria.addColumn(PropertyIds.NAME);
            criteria.add(Restrictions.inFolder(source.getId()));
            ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
            for (QueryResult queryResult : iterable) {
                return queryResult.<String>getPropertyById(PropertyIds.OBJECT_ID).getFirstValue();
            }
        } else {
            for (CmisObject cmisObject : source.getChildren()) {
                if (cmisObject.getType().getId().equals(documentType.value()))
                    return cmisObject.getId();
            }
        }
        return null;
    }

    /**
     * 1. Prendiamo tutte le associazioni della domanda (application)
     * 2. Per ogni associazione prendiamo il corrispondente PrintForm dal BulkInfo
     * (passato come parametro)
     * 3. Per ogni fieldProperty del PrintForm si costruisce una riga(?) dell'output
     *
     * @param bulkInfo
     * @param application
     * @param callProperty
     * @return
     */
    protected List<PrintDetailBulk> getDichiarazioni(BulkInfo bulkInfo,
                                                     Folder application, JCONONPropertyIds callProperty,
                                                     ApplicationModel applicationModel, Dichiarazioni dichiarazione) {
        List<PrintDetailBulk> result = new ArrayList<PrintDetailBulk>();
        // Recupero il bando
        Folder call = application.getParents().get(0); // chi e' il parent?
        List<String> associations = call.getPropertyValue(callProperty.value());
        boolean isCittadinoItaliano = (boolean) Optional.ofNullable(application.getProperty(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())).map(Property::getValue).orElse(Boolean.TRUE);
        if (isCittadinoItaliano) {
            associations.remove(P_JCONON_APPLICATION_ASPECT_GODIMENTO_DIRITTI);
        } else {
            associations.remove(P_JCONON_APPLICATION_ASPECT_ISCRIZIONE_LISTE_ELETTORALI);
        }
        for (int i = 0; i < associations.size(); i++) {
            String association = associations.get(i);
            FieldProperty fieldProperty = null;
            FieldPropertySet printForm = bulkInfoService.find(association).getPrintForms().get(
                    association);
            if (printForm != null) {
                Property<?> property = application.getProperty(printForm.getKey());
                if (property != null) {
                    fieldProperty = printForm
                            .getFieldProperty(property.getValueAsString());
                }
                PrintDetailBulk detail = new PrintDetailBulk();
                detail.setTitle(getTitle(i, dichiarazione));
                if (printForm.getKey() == null) {
                    printField(printForm, applicationModel, application, detail, bulkInfo);
                } else {
                    String labelKey = fieldProperty != null ? fieldProperty.getAttribute("label") : null;
                    if (application.getPropertyValue(printForm.getKey()) == null || fieldProperty == null || labelKey == null) {
                        final Optional<String> dichiarazioniEmptyMessage = getDichiarazioniEmptyMessage();
                        if (!dichiarazioniEmptyMessage.isPresent()) {
                            continue;
                        } else {
                            detail.addField(new Pair<String, String>(null, dichiarazioniEmptyMessage.get()));
                        }
                    } else {
                        detail.addField(new Pair<String, String>(null, formNameMessage(fieldProperty, bulkInfo, detail, applicationModel, application, labelKey)));
                    }
                }
                if (detail.getFields() != null && !detail.getFields().isEmpty())
                    result.add(detail);
            }
        }
        return result;
    }

    protected Optional<String> getDichiarazioniEmptyMessage() {
        return Optional.empty();
    }

    protected String getTitle(int i, Dichiarazioni dichiarazione) {
        return String.valueOf(
                Character.toChars(i + getFirstLetterOfDichiarazioni())[0]).concat(") ");
    }

    protected int getFirstLetterOfDichiarazioni() {
        return 65;
    }

    private String formNameMessage(FieldProperty fieldProperty, BulkInfo bulkInfo, PrintDetailBulk detail,
                                   ApplicationModel applicationModel, Folder application, String labelKey) {
        String message = "";
        if (fieldProperty.getAttribute("formName") != null) {
            List<Object> params = new ArrayList<Object>();
            FieldPropertySet printForm1 = bulkInfo.getPrintForms().get(fieldProperty.getAttribute("formName"));
            if (printForm1 != null && printForm1.getKey() != null && printForm1.getKey().equals("false")) {
                if (labelKey != null)
                    detail.addField(new Pair<String, String>(null, applicationModel.getMessage(
                            labelKey)));
                printField(printForm1, applicationModel, application, detail, bulkInfo);
            } else {
                for (FieldProperty paramFieldProperty : bulkInfo
                        .getPrintForm(fieldProperty
                                .getAttribute("formName"))) {
                    Object param = applicationModel.getProperties()
                            .get(paramFieldProperty
                                    .getAttribute("property"));
                    if (param == null)
                        param = application.getPropertyValue(paramFieldProperty
                                .getAttribute("property"));
                    if (param == null)
                        param = "";
                    params.add(param);
                }
                message = message.concat(applicationModel.getMessage(
                        labelKey, params.toArray()));
            }
        } else {
            message = message.concat(applicationModel
                    .getMessage(labelKey));
        }
        return message;
    }

    private List<PrintDetailBulk> getAllegati(Folder application, JCONONPolicyType allegati,
                                              Session cmisSession, ApplicationModel applicationModel) {
        return getAllegati(application,
                allegati, cmisSession, applicationModel, true, true);
    }

    private List<PrintDetailBulk> getAllegati(Folder application, JCONONPolicyType allegati,
                                              Session cmisSession, ApplicationModel applicationModel,
                                              boolean printDetail, boolean allAllegati) {

        List<PrintDetailBulk> result = new ArrayList<PrintDetailBulk>();
        Criteria criteria = CriteriaFactory
                .createCriteria(allegati.queryName());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.add(Restrictions.inFolder(application.getId()));
        ItemIterable<QueryResult> queryResults = criteria.executeQuery(
                cmisSession, false, cmisSession.getDefaultContext());
        if (queryResults.getTotalNumItems() > 0) {
            for (QueryResult queryResult : queryResults
                    .getPage(Integer.MAX_VALUE)) {
                Document riga = (Document) cmisSession
                        .getObject((String) queryResult
                                .getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
                if (Optional.ofNullable(riga)
                        .map(document -> document.<List<String>>getPropertyValue(PropertyIds.SECONDARY_OBJECT_TYPE_IDS))
                        .filter(listProperty -> listProperty.contains(JCONONPolicyType.JCONON_ATTACHMENT_FROM_RDP.value()))
                        .isPresent())
                    continue;
                if (!allAllegati &&
                        Optional.ofNullable(riga)
                                .map(Document::getDocumentType)
                                .map(DocumentType::getId)
                                .filter(type -> Arrays.asList(
                                        JCONONDocumentType.JCONON_ATTACHMENT_DOCUMENTO_RICONOSCIMENTO.value(),
                                        JCONONDocumentType.JCONON_ATTACHMENT_DIC_SOST.value()
                                ).contains(type))
                                .isPresent())
                    continue;

                String link = applicationModel.getContextURL()
                        + "/search/content?nodeRef=" + riga.getId();
                String type = applicationModel.getMessage(riga.getType()
                        .getId());
                if (type.equals(riga.getType().getId()))
                    type = riga.getType().getDisplayName();
                List<Pair<String, String>> detail;
                Pair<String, String> pairName = new Pair<String, String>(riga
                        .getProperty(PropertyIds.NAME).getDisplayName(), riga
                        .getProperty(PropertyIds.NAME).getValueAsString());
                if (printDetail) {
                    detail = getFields(riga, applicationModel);
                    if (!detail.contains(pairName))
                        detail.add(pairName);
                    result.add(new PrintDetailBulk(null, type, link, detail,
                            null));
                } else {
                    result.add(new PrintDetailBulk(null, type, link, riga
                            .getProperty(PropertyIds.NAME).getValueAsString(),
                            null));
                }
            }
        }
        return result;
    }

    private List<PrintDetailBulk> getCurriculum(List<String> propertyValue,
                                                Folder application, Session cmisSession,
                                                ApplicationModel applicationModel) {
        return getCurriculum(propertyValue, application,
                cmisSession, applicationModel, true);
    }

    private List<PrintDetailBulk> getCurriculum(List<String> propertyValue,
                                                Folder application, Session cmisSession,
                                                ApplicationModel applicationModel, boolean printDetail) {
        List<PrintDetailBulk> result = new ArrayList<PrintDetailBulk>();
        Map<String, List<Pair<String, String>>> sezioni = getSezioni(propertyValue, cmisSession);
        for (String key : sezioni.keySet()) {
            for (Pair<String, String> pair : sezioni.get(key)) {
                Criteria criteria = CriteriaFactory.createCriteria(pair.getSecond());
                criteria.addColumn(PropertyIds.OBJECT_ID);
                criteria.add(Restrictions.inFolder(application.getId()));
                addOrderCurriculum(cmisSession, pair.getSecond(), criteria);
                ItemIterable<QueryResult> queryResults = criteria.executeQuery(
                        cmisSession, false, cmisSession.getDefaultContext());
                if (queryResults.getTotalNumItems() > 0) {
                    for (QueryResult queryResult : queryResults
                            .getPage(Integer.MAX_VALUE)) {
                        CmisObject riga = cmisSession
                                .getObject((String) queryResult
                                        .getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
                        if (!riga.getType().getQueryName().equalsIgnoreCase(pair.getSecond()))
                            continue;
                        if (printDetail) {
                            result.add(new PrintDetailBulk(key,
                                    pair.getFirst(), null, getFields(riga,
                                    applicationModel), null));
                        } else {
                            String link = null;
                            if (Optional.ofNullable(
                                    riga.<BigInteger>getPropertyValue(PropertyIds.CONTENT_STREAM_LENGTH)
                            ).orElse(BigInteger.ZERO).compareTo(BigInteger.ZERO) > 0
                            ) {
                                link = applicationModel.getContextURL()
                                        + "/search/content?nodeRef="+ riga.getId() + "&fileName=" + UriUtils.encode(riga.getName()) + ".pdf";
                            }
                            String ruolo = riga
                                    .getPropertyValue("cvelement:altroRuoloProgetto");
                            if (ruolo == null)
                                ruolo = riga
                                        .getPropertyValue("cvelement:ruoloProgetto");
                            if (ruolo == null)
                                ruolo = riga
                                        .getPropertyValue("cvelement:altroRuoloIncarico");
                            if (ruolo == null)
                                ruolo = riga
                                        .getPropertyValue("cvelement:ruoloIncarico");
                            if (ruolo != null) {
                                ruolo = ruolo.replace("_", " ");
                                ruolo += " - ";
                            } else {
                                ruolo = "";
                            }

                            String title = riga.getPropertyValue("cvelement:denominazioneIncarico");
                            if (title == null)
                                title = riga.getPropertyValue("cvelement:denominazioneIstituto");
                            if (title == null)
                                title = riga.getPropertyValue("cvelement:titoloProgetto");
                            if (title == null)
                                title = riga.getPropertyValue("cvelement:denominazioneStruttura");
                            if (title == null)
                                title = riga.getPropertyValue("cvelement:rivista");
                            if (title == null)
                                title = riga.getPropertyValue("cvelement:tipologiaOrganismo");
                            if (title == null)
                                title = riga.getPropertyValue("cvelement:titoloEvento");
                            if (title == null)
                                title = riga.getPropertyValue("cvelement:descrizionePremio");
                            if (title == null)
                                title = riga.getPropertyValue("cvelement:commonAltroEnteCodice");
                            if (riga.getPropertyValue("cvelement:attivitaSvolta") != null)
                                title += " - "+ riga.getPropertyValue("cvelement:attivitaSvolta");
                            if (riga.getPropertyValue("cvelement:descrizionePartecipazione") != null)
                                title += " - "+ riga.getPropertyValue("cvelement:descrizionePartecipazione");
                            PrintDetailBulk detail = new PrintDetailBulk(null, pair.getFirst(), link, ruolo + title, null);
                            String periodo = "";
                            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
                            if (riga.getPropertyValue("cvelement:periodAttivitaDal") != null)
                                periodo += "Dal "
                                        + dateFormat
                                        .format(((Calendar) riga
                                                .getPropertyValue("cvelement:periodAttivitaDal"))
                                                .getTime());
                            if (riga.getPropertyValue("cvelement:periodAttivitaAl") != null)
                                periodo += " Al "
                                        + dateFormat
                                        .format(((Calendar) riga
                                                .getPropertyValue("cvelement:periodAttivitaAl"))
                                                .getTime());
                            if (riga.getPropertyValue("cvelement:attivitainCorso") != null)
                                periodo += " attivita in corso";
                            if (riga.getPropertyValue("cvelement:oreComplessive") != null)
                                periodo += " Ore complessive "
                                        + ((BigDecimal) (riga
                                        .getPropertyValue("cvelement:oreComplessive"))).setScale(0, BigDecimal.ROUND_DOWN);

                            detail.setPeriodo(periodo);
                            result.add(detail);
                        }
                    }
                }
            }
        }
        return result;
    }

    private List<PrintDetailBulk> getProdotti(List<String> propertyValue,
                                              Folder application, JCONONPolicyType peopleProduct,
                                              Session cmisSession, ApplicationModel applicationModel) {
        return getProdotti(propertyValue, application,
                peopleProduct, cmisSession, applicationModel, true);
    }

    private List<PrintDetailBulk> getProdotti(List<String> propertyValue,
                                              Folder application, JCONONPolicyType peopleProduct,
                                              Session cmisSession, ApplicationModel applicationModel,
                                              boolean printDetail) {
        List<PrintDetailBulk> result = new ArrayList<PrintDetailBulk>();
        OperationContext ocRel = new OperationContextImpl(
                cmisSession.getDefaultContext());
        ocRel.setIncludeRelationships(IncludeRelationships.SOURCE);
        Map<String, List<Pair<String, String>>> sezioni = getSezioni(propertyValue, cmisSession);
        for (String key : sezioni.keySet()) {
            for (Pair<String, String> pair : sezioni.get(key)) {
                Criteria criteria = CriteriaFactory.createCriteria(pair
                        .getSecond());
                Criteria criteriaAspect = criteria.createCriteria(
                        peopleProduct.queryName(), "people");
                Criteria criteriaCommon = criteria.createCriteria(
                        "cvpeople:commonMetadata", "common");
                criteriaAspect.addJoinCriterion(Restrictions.eqProperty(
                        criteria.prefix(PropertyIds.OBJECT_ID),
                        criteriaAspect.prefix(PropertyIds.OBJECT_ID)));
                criteriaCommon.addJoinCriterion(Restrictions.eqProperty(
                        criteria.prefix(PropertyIds.OBJECT_ID),
                        criteriaCommon.prefix(PropertyIds.OBJECT_ID)));
                criteria.addColumn(PropertyIds.OBJECT_ID);
                criteriaCommon.addOrder(Order.desc("common.cvpeople:anno"));
                criteria.add(Restrictions.inFolder(application.getId()));
                criteria.addOrder(Order.desc(PropertyIds.NAME));
                ItemIterable<QueryResult> queryResults = criteria.executeQuery(
                        cmisSession, false, cmisSession.getDefaultContext());
                if (queryResults.getTotalNumItems() > 0) {
                    for (QueryResult queryResult : queryResults.getPage(Integer.MAX_VALUE)) {
                        List<PrintDetailBulk> rels = new ArrayList<PrintDetailBulk>();
                        CmisObject riga = cmisSession
                                .getObject(
                                        (String) queryResult
                                                .getPropertyById(PropertyIds.OBJECT_ID).getFirstValue(),
                                        ocRel);
                        if (!riga.getType().getQueryName().equalsIgnoreCase(pair.getSecond()))
                            continue;
                        if (riga.getRelationships() != null
                                && !riga.getRelationships().isEmpty()) {
                            for (Relationship relationship : riga
                                    .getRelationships()) {
                                if (relationship
                                        .getType()
                                        .getId()
                                        .equals(JCONONRelationshipType.JCONON_ATTACHMENT_IN_PRODOTTO
                                                .value())) {
                                    CmisObject target = cmisSession
                                            .getObject(relationship.getTarget());
                                    String link = applicationModel.getContextURL()
                                            + "/search/content?nodeRef="
                                            + target.getId();
                                    if (printDetail)
                                        rels.add(new PrintDetailBulk(null,
                                                "Allegati", link, getFields(target,
                                                applicationModel), null));
                                    else {
                                        rels.add(new PrintDetailBulk(null,
                                                "Allegati", link,
                                                target.getProperty(
                                                                PropertyIds.NAME)
                                                        .getValueAsString(),
                                                null));
                                    }
                                }
                            }
                        }
                        if (printDetail) {
                            result.add(new PrintDetailBulk(key,
                                    pair.getFirst(), null, getFields(riga,
                                    applicationModel), rels));
                        } else {
                            String link = null;
                            if (((BigInteger) riga
                                    .getPropertyValue(PropertyIds.CONTENT_STREAM_LENGTH))
                                    .compareTo(BigInteger.ZERO) > 0) {
                                link = applicationModel.getContextURL()
                                        + "/search/content?nodeRef="
                                        + riga.getId() + "&fileName=" + UriUtils.encode(riga.getName()) + ".pdf";
                            }
                            String title = riga
                                    .getPropertyValue("cvpeople:id_tipo_txt");
                            title += " - "
                                    + riga.getPropertyValue("cvpeople:titolo");

                            PrintDetailBulk detail = new PrintDetailBulk(key,
                                    pair.getFirst(), link, title, rels);
                            detail.setPeriodo(String.valueOf(riga
                                    .getProperty("cvpeople:anno").getFirstValue()));
                            //Richieste di ampliamento della scheda di valutazione

                            if (riga.getProperty("cvpeople:numeroCitazioni") != null
                                    && riga.getProperty("cvpeople:numeroCitazioni")
                                    .getValues().size() != 0)
                                detail.setNroCitazioni(((BigInteger) riga.getProperty(
                                                "cvpeople:numeroCitazioni")
                                        .getValue()).intValue());
                            if (riga.getProperty("cvpeople:ifRivistaValore") != null
                                    && riga.getProperty("cvpeople:ifRivistaValore")
                                    .getValues().size() != 0) {
                                try {
                                    detail.setIfValore(riga.getProperty(
                                                    "cvpeople:ifRivistaValore")
                                            .getValueAsString());
                                } catch (NumberFormatException _ex) {
                                    LOGGER.error("Estrazione scheda di valutazione NumberFormatException for " + riga.getProperty(
                                                    "cvpeople:ifRivistaValore")
                                            .getValueAsString() + " objectId:" + riga.getId());
                                }
                            }

                            if (riga.getProperty("cvpeople:altroRuoloSvolto") != null
                                    && riga.getProperty(
                                            "cvpeople:altroRuoloSvolto")
                                    .getValues().size() != 0) {
                                detail.setRuolo(riga.getProperty(
                                                "cvpeople:altroRuoloSvolto")
                                        .getValueAsString());
                            }
                            if (riga.getProperty("cvpeople:ruoloSvolto") != null
                                    && riga.getProperty("cvpeople:ruoloSvolto")
                                    .getValues().size() != 0) {
                                for (Object ruoloSvolto : riga.getProperty("cvpeople:ruoloSvolto").getValues()) {
                                    if (!ruoloSvolto.equals("Altro")) {
                                        if (detail.getRuolo() != null) {
                                            detail.setRuolo(String.valueOf(ruoloSvolto).replace("_", " ") + "," + detail.getRuolo());
                                        } else {
                                            detail.setRuolo(String.valueOf(ruoloSvolto).replace("_", " "));
                                        }
                                    }
                                }
                            }
                            if (riga.getProperty("cvpeople:altroIfRivistaFonte") != null
                                    && riga.getProperty(
                                            "cvpeople:altroIfRivistaFonte")
                                    .getValues().size() != 0) {
                                detail.setIfFonte(riga.getProperty(
                                                "cvpeople:altroIfRivistaFonte")
                                        .getValueAsString());
                            }

                            if (riga.getProperty("cvpeople:SjrQuartile") != null
                                    && riga.getProperty("cvpeople:SjrQuartile")
                                    .getValues().size() != 0) {
                                detail.setQuartile(riga.getProperty("cvpeople:SjrQuartile").getValueAsString());
                            }

                            if (riga.getProperty("cvpeople:ifRivistaFonte") != null
                                    && riga.getProperty("cvpeople:ifRivistaFonte")
                                    .getValues().size() != 0) {
                                for (Object ifRivistaFonte : riga.getProperty("cvpeople:ifRivistaFonte").getValues()) {
                                    if (!ifRivistaFonte.equals("Altro")) {
                                        if (detail.getIfFonte() != null) {
                                            detail.setIfFonte(String.valueOf(ifRivistaFonte).replace("_", " ") + "," + detail.getIfFonte());
                                        } else {
                                            detail.setIfFonte(String.valueOf(ifRivistaFonte).replace("_", " "));
                                        }
                                    }
                                }
                            }


                            result.add(detail);
                        }
                    }
                }
            }
        }
        return result;
    }

    private Map<String, List<Pair<String, String>>> getSezioni(List<String> propertyValue, Session cmisSession) {
        Map<String, List<Pair<String, String>>> sezioni = new LinkedHashMap<String, List<Pair<String, String>>>();
        for (String type : propertyValue) {
            BulkInfo bulkInfo = bulkInfoService.find(type);
            String sezione = bulkInfo.getShortDescription();
            if (sezione == null || sezione.length() == 0)
                sezione = cmisSession.getTypeDefinition(type).getDisplayName();
            String sottoSezione = bulkInfo.getLongDescription();
            String queryName = bulkInfo.getCmisQueryName();
            if (sezioni.containsKey(sezione)) {
                sezioni.get(sezione).add(
                        new Pair<String, String>(sottoSezione, queryName));
            } else {
                List<Pair<String, String>> lista = new ArrayList<Pair<String, String>>();
                lista.add(new Pair<String, String>(Optional.ofNullable(sottoSezione).orElse(sezione), queryName));
                sezioni.put(sezione, lista);
            }
        }
        return sezioni;
    }

    @SuppressWarnings("unchecked")
    private void printField(FieldPropertySet printForm, ApplicationModel applicationModel, Folder application, PrintDetailBulk detail, BulkInfo bulkInfo) {
        for (FieldProperty printFieldProperty : printForm.getFieldProperties()) {
            if (printFieldProperty.getAttribute("formName") != null) {
                Object objValue = application.getPropertyValue(printFieldProperty.getAttribute("formName"));
                FieldPropertySet printFormDetail = bulkInfo.getPrintForms().get(printFieldProperty.getAttribute("formName"));
                for (FieldProperty printFieldPropertyDetail : printFormDetail.getFieldProperties()) {
                    if (printFieldPropertyDetail.getAttribute("key") != null && printFieldPropertyDetail.getAttribute("key").equals(String.valueOf(objValue))) {
                        detail.addField(new Pair<String, String>(null, applicationModel.getMessage(printFieldPropertyDetail.getAttribute("label"))));
                    }
                }
                final Optional<String> dichiarazioniEmptyMessage = getDichiarazioniEmptyMessage();
                if (dichiarazioniEmptyMessage.isPresent() && Optional.ofNullable(detail.getFields()).orElse(Collections.emptyList()).isEmpty()) {
                    detail.addField(new Pair<String, String>(null, dichiarazioniEmptyMessage.get()));
                }
                continue;
            }
            String message = null;
            String label = printFieldProperty.getAttribute("label");
            if (label == null) {
                String labelJSON = printFieldProperty.getAttribute("jsonlabel");
                if (labelJSON != null) {
                    JSONObject jsonLabel = new JSONObject(labelJSON);
                    message = applicationModel.getMessage(jsonLabel.getString("key"));
                    if (message == null || message.equalsIgnoreCase(jsonLabel.getString("key")))
                        message = jsonLabel.getString("default");
                } else {
                    FieldProperty subProperty = printFieldProperty.getSubProperty("jsonlabel");
                    label = subProperty.getAttribute("key");
                    message = applicationModel.getMessage(label);
                    if (message == null || message.equalsIgnoreCase(subProperty.getAttribute("key")))
                        message = subProperty.getAttribute("default");
                }
            } else {
                message = applicationModel.getMessage(label);
            }
            String value;
            Object objValue = application.getPropertyValue(printFieldProperty.getProperty());
            if (objValue == null && printFieldProperty.getProperty() != null) {
                final Optional<String> dichiarazioniEmptyMessage = getDichiarazioniEmptyMessage();
                if (dichiarazioniEmptyMessage.isPresent() && Optional.ofNullable(detail.getFields()).orElse(Collections.emptyList()).isEmpty()) {
                    detail.addField(new Pair<String, String>(null, dichiarazioniEmptyMessage.get()));
                }
                continue;
            } else if (printFieldProperty.getProperty() == null) {
                detail.addField(new Pair<String, String>(null, message));
            } else {
                if (application.getProperty(printFieldProperty.getProperty()).isMultiValued()) {
                    List<Object> values = (List<Object>) objValue;
                    if (values.isEmpty()) {
                        final Optional<String> dichiarazioniEmptyMessage = getDichiarazioniEmptyMessage();
                        if (dichiarazioniEmptyMessage.isPresent() && Optional.ofNullable(detail.getFields()).orElse(Collections.emptyList()).isEmpty()) {
                            detail.addField(new Pair<String, String>(null, dichiarazioniEmptyMessage.get()));
                        }
                        return;
                    }
                    if (values.size() > 1) {
                        for (int k = 0; k < values.size(); k++) {
                            detail.addField(new Pair<String, String>(k == 0 ? (message + "<br>") : "", String.valueOf(values.get(k))));
                        }
                    } else {
                        value = StringUtils.collectionToDelimitedString(((Collection<?>) objValue), ", ");
                        detail.addField(new Pair<String, String>(message, value));
                    }
                } else {
                    if (printFieldProperty.getAttribute("widget") != null) {
                        if (printFieldProperty.getAttribute("widget").contains("ui.datepicker")) {
                            value = StringUtil.DATEFORMAT.format(((Calendar) objValue).getTime());
                        } else if (printFieldProperty.getAttribute("widget").contains("ui.datetimepicker")) {
                            value = StringUtil.DATETIMEFORMAT.format(((Calendar) objValue).getTime());
                        } else {
                            if (objValue instanceof Boolean) {
                                if (printFieldProperty.getAttribute("generated") != null)
                                    value = Boolean.valueOf(String.valueOf(objValue)) ? "" : "No";
                                else
                                    value = "";
                            } else {
                                value = String.valueOf(objValue);
                            }
                        }
                    } else {
                        value = String.valueOf(objValue);
                    }
                    if (Optional.ofNullable(label).isPresent()) {
                        final String finalLabel = label.concat("_").concat(value);
                        final Optional<String> message1 = Optional.ofNullable(applicationModel.getMessage(finalLabel));
                        if (message1.isPresent() && !message1.get().equals(finalLabel)) {
                            message = message1.get();
                            value = "";
                        }
                    }
                    detail.addField(new Pair<String, String>(message, value));
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    private List<Pair<String, String>> getFields(CmisObject riga,
                                                 ApplicationModel applicationModel) {

        BulkInfo bulkInfo = bulkInfoService.find(riga.getType().getId());

        List<Pair<String, String>> results = new ArrayList<Pair<String, String>>();
        if (bulkInfo == null) {
            for (Property<?> property : riga.getProperties()) {
                if (!property.getDefinition().isInherited()
                        && !property.getDefinition().getId()
                        .startsWith("cm:owner")) {
                    results.add(new Pair<String, String>(property
                            .getDisplayName(), property.getValueAsString()));
                }
            }
            results.add(new Pair<String, String>(riga.getProperty(
                    PropertyIds.NAME).getDisplayName(), riga.getProperty(
                    PropertyIds.NAME).getValueAsString()));
        } else {
            for (FieldProperty fieldProperty : bulkInfo.getForm("default")) {
                String value;
                Object objValue = riga.getPropertyValue(fieldProperty
                        .getProperty());
                if (riga.getProperty(fieldProperty.getProperty()) != null) {
                    PropertyDefinition<?> propertyDefinition = riga
                            .getProperty(fieldProperty.getProperty())
                            .getDefinition();
                    Cardinality cardinality = propertyDefinition
                            .getCardinality();
                    if ((cardinality.equals(Cardinality.SINGLE) && objValue != null)
                            || (cardinality.equals(Cardinality.MULTI)
                            && objValue != null && !((List<Object>) objValue)
                            .isEmpty())) { // ci sono due objValue
                        // != null
                        if (cardinality.equals(Cardinality.MULTI)) {
                            value = StringUtils.collectionToDelimitedString(((Collection<?>) objValue), ", ");
                        } else {
                            if (propertyDefinition instanceof PropertyDateTimeDefinition) {
                                value = new SimpleDateFormat("dd/MM/yyyy",
                                        Locale.ITALY)
                                        .format(((GregorianCalendar) objValue)
                                                .getTime());
                            } else if (propertyDefinition instanceof PropertyDecimalDefinition) {
                                value = new NumberStyleFormatter("").print(
                                        (BigDecimal) objValue, Locale.ITALY);
                            } else if (propertyDefinition instanceof PropertyBooleanDefinition) {
                                if (!Boolean.valueOf(objValue.toString()))
                                    continue;
                                value = "";
                            } else {
                                value = objValue.toString();
                            }
                        }
                        String message = displayValue(fieldProperty, value,
                                applicationModel);
                        if (Optional.ofNullable(fieldProperty)
                                .flatMap(fieldProperty1 -> Optional.ofNullable(fieldProperty1.getAttribute("widget")))
                                .map(s -> !s.equals("ui.sedi"))
                                .orElse(Boolean.TRUE)) {
                            results.add(new Pair<String, String>(applicationModel
                                    .getMessage(getLabel(fieldProperty,
                                            applicationModel)), message));
                        }
                    }
                }
            }
        }
        return results;
    }

    private void addOrderCurriculum(Session cmisSession, String queryName,
                                    Criteria criteria) {
        ObjectType type = cmisSession.getTypeDefinition("D:"
                .concat(queryName));
        LOGGER.debug(type.getDisplayName());
        String aspectQueryName = null, aspectPropertyOrder = null;
        if (typeService.getMandatoryAspects(type).contains(
                JCONONPolicyType.CV_COMMON_METADATA_ASPECT2.value())) {
            aspectQueryName = JCONONPolicyType.CV_COMMON_METADATA_ASPECT2
                    .queryName();
            aspectPropertyOrder = "common.cvelement:periodAttivitaDal";
        } else if (typeService.getMandatoryAspects(type).contains(
                JCONONPolicyType.CV_COMMON_PREMIO.value())) {
            aspectQueryName = JCONONPolicyType.CV_COMMON_PREMIO.queryName();
            aspectPropertyOrder = "common.cvelement:data";
        }
        if (aspectQueryName != null) {
            Criteria criteriaCommon = criteria.createCriteria(aspectQueryName,
                    "common");
            criteriaCommon.addJoinCriterion(Restrictions.eqProperty(
                    criteria.prefix(PropertyIds.OBJECT_ID),
                    criteriaCommon.prefix(PropertyIds.OBJECT_ID)));
            criteriaCommon.addOrder(Order.desc(aspectPropertyOrder));
        }
        criteria.addOrder(Order.desc(PropertyIds.NAME));
    }

    private String displayValue(FieldProperty fieldProperty, String value,
                                ApplicationModel applicationModel) {
        if (fieldProperty.getAttribute("jsonlist") != null) {
            String jsonString = fieldProperty.getAttribute("jsonlist");
            JsonElement item = new JsonParser().parse(jsonString);
            JsonArray json = item.getAsJsonArray();
            for (int i = 0; i < json.size(); i++) {
                JsonObject appo = json.get(i).getAsJsonObject();
                if (value.equals(appo.get("key").getAsString())) {
                    String i18nLabel = appo.get("label").getAsString();
                    if (i18nLabel
                            .equals(applicationModel.getMessage(i18nLabel)))
                        return appo.get("defaultLabel").getAsString();
                    return applicationModel.getMessage(i18nLabel);
                }
            }
        }
        return value;
    }

    private String getLabel(FieldProperty fieldProperty,
                            ApplicationModel applicationModel) {
        if (fieldProperty.getAttribute("label") != null)
            return fieldProperty.getAttribute("label");
        else if (fieldProperty.getSubProperty("jsonlabel") != null) {
            String key = fieldProperty.getSubProperty("jsonlabel").getAttribute("key");
            String defaultLabel = fieldProperty.getSubProperty("jsonlabel").getAttribute("default");
            if (applicationModel.getMessage(key).equals(key))
                return defaultLabel;
            else
                return key;
        } else
            return fieldProperty.getAttribute("name");
    }

    public String getSchedaValutazioneName(Session cmisSession, Folder application) throws CMISApplicationException {
        String shortNameEnte = "CNR";
        Folder call = (Folder) cmisSession.getObject(application.getParentId());
        DateFormat formatter = new SimpleDateFormat("yyyy/MM/dd");
        GregorianCalendar dataDomanda = application.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value());
        String dataApplication = "PROVVISORIA";
        if (dataDomanda != null)
            dataApplication = formatter.format(dataDomanda.getTime()).replace("/", "_");
        return shortNameEnte +
                "-" +
                call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()) +
                "-RD-" +
                application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()) +
                "-" +
                dataApplication +
                ".xls";
    }

    public String getSchedaAnonimaSinteticaName(Session cmisSession, Folder application, int index) throws CMISApplicationException {
        String shortNameEnte = "CNR";
        Folder call = (Folder) cmisSession.getObject(application.getParentId());
        return shortNameEnte +
                "-" +
                call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()) +
                "-RD-" +
                String.format("%4s", index).replace(' ', '0') +
                ".pdf";
    }

    public byte[] getSchedaValutazione(Session cmisSession, Folder application,
                                       String contextURL, Locale locale) throws CMISApplicationException {
        Folder call = application.getFolderParent();
        ApplicationModel applicationModel = new ApplicationModel(application,
                cmisSession.getDefaultContext(),
                i18nService.loadLabels(locale), contextURL, false);

        final Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(GregorianCalendar.class, new JsonSerializer<GregorianCalendar>() {
                    @Override
                    public JsonElement serialize(GregorianCalendar src, Type typeOfSrc,
                                                 JsonSerializationContext context) {
                        return context.serialize(src.getTime());
                    }
                }).create();
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS.value()) != null) {
            applicationModel
                    .getProperties()
                    .put("allegati",
                            getAllegati(
                                    application,
                                    JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT,
                                    cmisSession, applicationModel, false, false));
        }

        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM.value()) != null) {
            applicationModel
                    .getProperties()
                    .put("curriculum",
                            getCurriculum(
                                    call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM.value()),
                                    application,
                                    cmisSession, applicationModel, false));
        }
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()) != null) {
            applicationModel
                    .getProperties()
                    .put("prodotti",
                            getProdotti(
                                    call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()),
                                    application,
                                    JCONONPolicyType.PEOPLE_NO_SELECTED_PRODUCT,
                                    cmisSession, applicationModel, false));
            applicationModel
                    .getProperties()
                    .put("prodottiScelti",
                            getProdotti(
                                    call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()),
                                    application,
                                    JCONONPolicyType.PEOPLE_SELECTED_PRODUCT,
                                    cmisSession, applicationModel, false));
        }

        String json = "{\"properties\":" + gson.toJson(applicationModel.getProperties()) + "}";
        LOGGER.debug(json);
        try {

            Map<String, Object> parameters = new HashMap<String, Object>();
            JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)), "properties");
            final ResourceBundle resourceBundle = ResourceBundle.getBundle(
                    "net.sf.jasperreports.view.viewer", locale);
            parameters.put(JRParameter.REPORT_LOCALE, locale);
            parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
            parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
            parameters.put("DIR_IMAGE", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());
            parameters.put("SUBREPORT_DIR", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());

            ClassLoader classLoader = ClassLoader.getSystemClassLoader();
            parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            JasperReport report = JasperCompileManager.compileReport(new ClassPathResource(PRINT_RESOURCE_PATH + "scheda_valutazione.jrxml").getInputStream());
            JasperPrint jasperPrint = jasperFillManager().fill(report, parameters);

            JRXlsExporter exporter = new JRXlsExporter();
            exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(baos));
            SimpleXlsReportConfiguration configuration = new SimpleXlsReportConfiguration();
            configuration.setOnePagePerSheet(false);
            configuration.setDetectCellType(true);
            configuration.setCollapseRowSpan(false);
            configuration.setRemoveEmptySpaceBetweenRows(true);
            configuration.setWhitePageBackground(false);
            exporter.setConfiguration(configuration);
            exporter.exportReport();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new CMISApplicationException("Error in JASPER", e);
        }
    }

    @SuppressWarnings("unchecked")
    public byte[] getSchedaAnonimaSintetica(Session cmisSession, Folder application,
                                            String contextURL, Locale locale, int index) throws CMISApplicationException {
        Folder call = application.getFolderParent();
        ApplicationModel applicationModel = new ApplicationModel(application,
                cmisSession.getDefaultContext(),
                i18nService.loadLabels(locale), contextURL, false);

        final Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(GregorianCalendar.class, new JsonSerializer<GregorianCalendar>() {
                    @Override
                    public JsonElement serialize(GregorianCalendar src, Type typeOfSrc,
                                                 JsonSerializationContext context) {
                        return context.serialize(src.getTime());
                    }
                }).create();
        if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_SCHEDE_ANONIME.value()) != null) {
            applicationModel.getProperties().put("schedeAnonime", getCurriculum(
                    call
                            .getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_SCHEDE_ANONIME
                                    .value()),
                    application, cmisSession, applicationModel));
        }
        String json = "{\"properties\":" + gson.toJson(applicationModel.getProperties()) + "}";
        try {
            Map<String, Object> parameters = new HashMap<String, Object>();
            JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)), "properties");
            JRGzipVirtualizer vir = new JRGzipVirtualizer(100);
            final ResourceBundle resourceBundle = ResourceBundle.getBundle(
                    "net.sf.jasperreports.view.viewer", locale);
            parameters.put(JRParameter.REPORT_LOCALE, locale);
            parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
            parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
            parameters.put(JRParameter.REPORT_VIRTUALIZER, vir);
            parameters.put("INDICE", index);
            parameters.put("DIR_IMAGE", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());
            parameters.put("SUBREPORT_DIR", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());

            ClassLoader classLoader = ClassLoader.getSystemClassLoader();
            parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);

            JasperReport jasperReport = cacheRepository.jasperReport(PRINT_RESOURCE_PATH + "SchedaAnonima.jrxml", jasperCompileManager());
            JasperPrint jasperPrint = jasperFillManager().fill(jasperReport, parameters);

            ByteArrayOutputStream os = new ByteArrayOutputStream();
            JRPdfExporter exporter = new JRPdfExporter();
            exporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
            exporter.setParameter(JRExporterParameter.OUTPUT_STREAM, os);
            exporter.setParameter(JRPdfExporterParameter.FORCE_LINEBREAK_POLICY, Boolean.TRUE);
            exporter.exportReport();
            return os.toByteArray();
        } catch (Exception e) {
            throw new CMISApplicationException("Error in JASPER", e);
        }
    }

    public void addContentToApplication(PrintParameterModel item) {
        Session cmisSession = cmisService.createAdminSession();
        Folder application = (Folder) cmisSession.getObject(item.getApplicationId());
        Folder call = (Folder) cmisSession.getObject(application.getParentId());
        addContentToChild(application, call, cmisSession, i18nService.loadLabels(Locale.ITALY), item.getContextURL());
    }

    @SuppressWarnings("unchecked")
    public void addContentToChild(Folder application, Folder call, Session cmisSession, Properties messages, String contextURL) {
        ApplicationModel applicationModel = new ApplicationModel(application,
                cmisSession.getDefaultContext(),
                messages, contextURL);
        List<String> types = new ArrayList<String>();
        types.addAll(call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM.value()));
        types.addAll(call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()));
        types.addAll(call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_SCHEDE_ANONIME.value()));
        types.remove(JCONONDocumentType.JCONON_CVPEOPLE_ATTACHMENT_ELENCO_PRODOTTI_SCELTI.value());
        types.remove(JCONONDocumentType.JCONON_CVPEOPLE_ATTACHMENT_PRODOTTI_SCELTI_MULTIPLO.value());
        for (CmisObject cmisObject : application.getChildren()) {
            if (types.contains(cmisObject.getType().getId())) {
                cmisObject.refresh();
                addContentToCmisObject(applicationModel, cmisObject, Locale.ITALY);
            }
        }
    }

    public void addContentToCmisObject(ApplicationModel applicationBulk,
                                       CmisObject cmisObject, Locale locale) {
        BulkInfo bulkInfo = bulkInfoService.find(cmisObject.getType().getId());
        String title = bulkInfo.getLongDescription();
        if (title == null || title.length() == 0)
            title = cmisObject.getType().getDisplayName();

        Map<String, Object> parameters = new HashMap<String, Object>();
        final Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(GregorianCalendar.class, new JsonSerializer<GregorianCalendar>() {
                    @Override
                    public JsonElement serialize(GregorianCalendar src, Type typeOfSrc,
                                                 JsonSerializationContext context) {
                        return context.serialize(src.getTime());
                    }
                }).create();
        List<Pair<String, String>> fields = new ArrayList<Pair<String, String>>();
        fields.addAll(getFields(cmisObject, applicationBulk));
        applicationBulk.getProperties().put("fields", new PrintDetailBulk(null, null, null, fields, null));
        String json = "{\"properties\":" + gson.toJson(applicationBulk.getProperties()) + "}";

        JRGzipVirtualizer vir = new JRGzipVirtualizer(100);
        final ResourceBundle resourceBundle = ResourceBundle.getBundle(
                "net.sf.jasperreports.view.viewer", locale);
        try {
            JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)), "properties");
            parameters.put(JRParameter.REPORT_LOCALE, locale);
            parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
            parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
            parameters.put(JRParameter.REPORT_VIRTUALIZER, vir);
            parameters.put("DIR_IMAGE", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());
            parameters.put("SUBREPORT_DIR", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());
            parameters.put("title", title);
            ClassLoader classLoader = ClassLoader.getSystemClassLoader();
            parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);

            JasperReport jasperReport = cacheRepository.jasperReport(PRINT_RESOURCE_PATH + "prodotti.jrxml", jasperCompileManager());
            JasperPrint jasperPrint = jasperFillManager().fill(jasperReport, parameters);

            InputStream stream = new ByteArrayInputStream(JasperExportManager.exportReportToPdf(jasperPrint));
            ContentStream contentStream = new ContentStreamImpl(cmisObject.getName(), new BigInteger(String.valueOf(stream.available())), "application/pdf", stream);
            ((Document) cmisObject).setContentStream(contentStream, true);
        } catch (Exception e) {
            LOGGER.error("Error during print report for object: " + cmisObject.getId(), e);
        }
    }

    public byte[] printDichiarazioneSostitutiva(Session cmisSession, String nodeRef, String contextURL, Locale locale) throws CMISApplicationException {
        return getModuloDaFirmare(cmisSession, (Folder) cmisSession.getObject(nodeRef), contextURL, locale, "DichiarazioneSostitutiva.jrxml");
    }

    public byte[] printTrattamentoDatiPersonali(Session cmisSession, String nodeRef, String contextURL, Locale locale) throws CMISApplicationException {
        return getModuloDaFirmare(cmisSession, (Folder) cmisSession.getObject(nodeRef), contextURL, locale, "DichiarazioneDatiPersonali.jrxml");
    }

    public byte[] getModuloDaFirmare(Session cmisSession, Folder application, String contextURL, Locale locale, String jasperName) throws CMISApplicationException {
        ApplicationModel applicationBulk = new ApplicationModel(application,
                cmisSession.getDefaultContext(),
                i18nService.loadLabels(locale), contextURL);

        final Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(GregorianCalendar.class, new JsonSerializer<GregorianCalendar>() {
                    @Override
                    public JsonElement serialize(GregorianCalendar src, Type typeOfSrc,
                                                 JsonSerializationContext context) {
                        return context.serialize(src.getTime());
                    }
                }).create();
        String json = "{\"properties\":" + gson.toJson(applicationBulk.getProperties()) + "}";
        LOGGER.debug(json);
        try {
            Map<String, Object> parameters = new HashMap<String, Object>();
            JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)), "properties");
            JRGzipVirtualizer vir = new JRGzipVirtualizer(100);
            final ResourceBundle resourceBundle = ResourceBundle.getBundle(
                    "net.sf.jasperreports.view.viewer", locale);
            parameters.put(JRParameter.REPORT_LOCALE, locale);
            parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
            parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
            parameters.put(JRParameter.REPORT_VIRTUALIZER, vir);
            parameters.put("DIR_IMAGE", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());
            parameters.put("SUBREPORT_DIR", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());

            ClassLoader classLoader = ClassLoader.getSystemClassLoader();
            parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);
            JasperReport jasperReport = cacheRepository.jasperReport(PRINT_RESOURCE_PATH + jasperName, jasperCompileManager());

            JasperPrint jasperPrint = jasperFillManager().fill(jasperReport, parameters);
            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new CMISApplicationException("Error in JASPER", e);
        }
    }

    public byte[] printConvocazione(Session cmisSession, Folder application, String contextURL, Locale locale, String tipoSelezione, String luogo,
                                    Calendar data, Boolean testoLibero, String note, String firma) throws CMISApplicationException {

        ApplicationModel applicationBulk = new ApplicationModel(application,
                cmisSession.getDefaultContext(),
                i18nService.loadLabels(locale), contextURL, false);
        applicationBulk.getProperties().put("tipoSelezione", tipoSelezione);
        applicationBulk.getProperties().put("luogo", luogo);
        applicationBulk.getProperties().put("data", data);
        applicationBulk.getProperties().put("note", note);
        applicationBulk.getProperties().put("firma", firma);
        applicationBulk.getProperties().put("testoLibero", testoLibero);
        final Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(GregorianCalendar.class, new JsonSerializer<GregorianCalendar>() {
                    @Override
                    public JsonElement serialize(GregorianCalendar src, Type typeOfSrc,
                                                 JsonSerializationContext context) {
                        return context.serialize(src.getTime());
                    }
                }).create();
        String json = "{\"properties\":" + gson.toJson(applicationBulk.getProperties()) + "}";
        LOGGER.debug(json);
        try {

            Map<String, Object> parameters = new HashMap<String, Object>();
            JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)), "properties");
            JRGzipVirtualizer vir = new JRGzipVirtualizer(100);
            final ResourceBundle resourceBundle = ResourceBundle.getBundle(
                    "net.sf.jasperreports.view.viewer", locale);
            parameters.put(JRParameter.REPORT_LOCALE, locale);
            parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
            parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
            parameters.put(JRParameter.REPORT_VIRTUALIZER, vir);
            parameters.put("DIR_IMAGE", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());
            parameters.put("SUBREPORT_DIR", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());

            ClassLoader classLoader = ClassLoader.getSystemClassLoader();
            parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);
            JasperReport jasperReport = cacheRepository.jasperReport(PRINT_RESOURCE_PATH + "convocazione.jrxml", jasperCompileManager());
            JasperPrint jasperPrint = jasperFillManager().fill(jasperReport, parameters);
            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new CMISApplicationException("Error in JASPER", e);
        }
    }

    public byte[] printEsclusione(Session cmisSession, Folder application, String contextURL, Locale locale,
                                  boolean stampaPunteggi, String note, String firma, String proveConseguite) throws CMISApplicationException {

        ApplicationModel applicationBulk = new ApplicationModel(application,
                cmisSession.getDefaultContext(),
                i18nService.loadLabels(locale), contextURL, false);
        applicationBulk.getProperties().put("stampaPunteggi", stampaPunteggi);
        applicationBulk.getProperties().put("note", note);
        applicationBulk.getProperties().put("firma", firma);
        applicationBulk.getProperties().put("proveConseguite", proveConseguite);

        final Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(GregorianCalendar.class, new JsonSerializer<GregorianCalendar>() {
                    @Override
                    public JsonElement serialize(GregorianCalendar src, Type typeOfSrc,
                                                 JsonSerializationContext context) {
                        return context.serialize(src.getTime());
                    }
                }).create();
        String json = "{\"properties\":" + gson.toJson(applicationBulk.getProperties()) + "}";
        LOGGER.debug(json);
        try {

            Map<String, Object> parameters = new HashMap<String, Object>();
            JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)), "properties");
            JRGzipVirtualizer vir = new JRGzipVirtualizer(100);
            final ResourceBundle resourceBundle = ResourceBundle.getBundle(
                    "net.sf.jasperreports.view.viewer", locale);
            parameters.put(JRParameter.REPORT_LOCALE, locale);
            parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
            parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
            parameters.put(JRParameter.REPORT_VIRTUALIZER, vir);
            parameters.put("DIR_IMAGE", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());
            parameters.put("SUBREPORT_DIR", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());

            ClassLoader classLoader = ClassLoader.getSystemClassLoader();
            parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);

            JasperReport jasperReport = cacheRepository.jasperReport(PRINT_RESOURCE_PATH + "esclusione.jrxml", jasperCompileManager());
            JasperPrint jasperPrint = jasperFillManager().fill(jasperReport, parameters);

            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new CMISApplicationException("Error in JASPER", e);
        }
    }

    public byte[] printComunicazione(Session cmisSession, Folder application, String contextURL, Locale locale, String note, String firma) throws CMISApplicationException {
        ApplicationModel applicationBulk = new ApplicationModel(application,
                cmisSession.getDefaultContext(),
                i18nService.loadLabels(locale), contextURL, false);
        applicationBulk.getProperties().put("note", note);
        applicationBulk.getProperties().put("firma", firma);

        final Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .excludeFieldsWithoutExposeAnnotation()
                .registerTypeAdapter(GregorianCalendar.class, new JsonSerializer<GregorianCalendar>() {
                    @Override
                    public JsonElement serialize(GregorianCalendar src, Type typeOfSrc,
                                                 JsonSerializationContext context) {
                        return context.serialize(src.getTime());
                    }
                }).create();
        String json = "{\"properties\":" + gson.toJson(applicationBulk.getProperties()) + "}";
        LOGGER.debug(json);
        try {

            Map<String, Object> parameters = new HashMap<String, Object>();
            JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)), "properties");
            JRGzipVirtualizer vir = new JRGzipVirtualizer(100);
            final ResourceBundle resourceBundle = ResourceBundle.getBundle(
                    "net.sf.jasperreports.view.viewer", locale);
            parameters.put(JRParameter.REPORT_LOCALE, locale);
            parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
            parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
            parameters.put(JRParameter.REPORT_VIRTUALIZER, vir);
            parameters.put("DIR_IMAGE", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());
            parameters.put("SUBREPORT_DIR", new ClassPathResource(PRINT_RESOURCE_PATH).getPath());

            ClassLoader classLoader = ClassLoader.getSystemClassLoader();
            parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);

            JasperReport jasperReport = cacheRepository.jasperReport(PRINT_RESOURCE_PATH + "comunicazione.jrxml", jasperCompileManager());
            JasperPrint jasperPrint = jasperFillManager().fill(jasperReport, parameters);

            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new CMISApplicationException("Error in JASPER", e);
        }
    }

    public String printSchedaValutazione(Session cmisSession, String nodeRef,
                                         String contextURL, String userId, Locale locale) throws IOException {
        Folder application = (Folder) cmisSession.getObject(nodeRef);
        Folder call = (Folder) cmisSession.getObject(application.getParentId());
        application.refresh();
        InputStream is = new ByteArrayInputStream(getSchedaValutazione(
                cmisSession, application, contextURL, locale));
        String nameRicevutaReportModel = getSchedaValutazioneName(cmisSession, application);
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
        aces.put(GroupsEnum.CONCORSI.value(), ACLType.Coordinator);
        aces.put("GROUP_" + call.getPropertyValue(JCONONPropertyIds.CALL_RDP.value()), ACLType.Consumer);
        aces.put("GROUP_" + call.getPropertyValue(JCONONPropertyIds.CALL_COMMISSIONE.value()), ACLType.Coordinator);
        Folder macroCall = competitionService.getMacroCall(cmisService.createAdminSession(), call);
        if (macroCall != null) {
            String groupNameMacroCall = competitionService.getCallGroupCommissioneName(macroCall);
            aces.put("GROUP_" + groupNameMacroCall, ACLType.Coordinator);
        }
        aclService.addAcl(cmisService.getAdminSession(),
                doc.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
        aclService.setInheritedPermission(cmisService.getAdminSession(),
                doc.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);
        nodeVersionService.addAutoVersion(doc, false);
        return doc.getId();
    }

    public String printSchedaAnonimaDiValutazione(Session cmisSession, String nodeRef,
                                                  String contextURL, String userId, Locale locale, int index) throws IOException {
        Folder application = (Folder) cmisSession.getObject(nodeRef);
        Folder call = (Folder) cmisSession.getObject(application.getParentId());
        application.refresh();
        InputStream is = new ByteArrayInputStream(getSchedaAnonimaSintetica(
                cmisSession, application, contextURL, locale, index));
        String nameRicevutaReportModel = getSchedaAnonimaSinteticaName(cmisSession, application, index);
        ContentStream contentStream = new ContentStreamImpl(nameRicevutaReportModel,
                BigInteger.valueOf(is.available()),
                "application/pdf",
                is);
        Map<String, Object> properties = new HashMap<String, Object>();
        properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA_SINTETICA_GENERATED.value());
        properties.put(PropertyIds.NAME, nameRicevutaReportModel);
        properties.put(JCONONPropertyIds.ATTACHMENT_USER.value(), userId);
        properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, Arrays.asList("P:jconon_scheda_anonima:valutazione"));
        String schedaAnonima = competitionService.findAttachmentId(cmisSession, nodeRef, JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA_SINTETICA_GENERATED);
        if (schedaAnonima != null)
            cmisSession.delete(cmisSession.createObjectId(schedaAnonima));
        Document doc = application.createDocument(properties, contentStream, VersioningState.MAJOR);

        Map<String, ACLType> aces = new HashMap<String, ACLType>();
        aces.put(JcononGroups.CONCORSI.group(), ACLType.Coordinator);
        aces.put("GROUP_" + call.getPropertyValue(JCONONPropertyIds.CALL_COMMISSIONE.value()), ACLType.Editor);
        aces.put("GROUP_" + call.getPropertyValue(JCONONPropertyIds.CALL_RDP.value()), ACLType.Editor);
        Folder macroCall = competitionService.getMacroCall(cmisService.createAdminSession(), call);
        if (macroCall != null) {
            String groupNameMacroCall = competitionService.getCallGroupCommissioneName(macroCall);
            aces.put("GROUP_" + groupNameMacroCall, ACLType.Editor);
        }
        aclService.addAcl(cmisService.getAdminSession(),
                doc.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), aces);
        aclService.setInheritedPermission(cmisService.getAdminSession(),
                doc.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);
        nodeVersionService.addAutoVersion(doc, false);
        return doc.getId();
    }

    public void generaScheda(PrintParameterModel printParameterModel) {
        if (printParameterModel.getTipoScheda().equals(PrintParameterModel.TipoScheda.SCHEDA_VALUTAZIONE)) {
            generaSchedeValutazione(printParameterModel.getApplicationId(), printParameterModel.getContextURL(), Locale.ITALY, printParameterModel.getIndirizzoEmail(), printParameterModel.getUserId());
        } else if (printParameterModel.getTipoScheda().equals(PrintParameterModel.TipoScheda.SCHEDA_ANONIMA)) {
            generaSchedeAnonima(printParameterModel.getApplicationId(), printParameterModel.getContextURL(), Locale.ITALY, printParameterModel.getIndirizzoEmail(), printParameterModel.getUserId());
        }
    }

    private void generaSchedeValutazione(String nodeRef, final String contextURL, final Locale locale, final String indirizzoEmail, final String userId) {
        try {
            Session adminCMISSession = cmisService.createAdminSession();
            Folder bando = (Folder) adminCMISSession.getObject(nodeRef);
            Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
            criteriaDomande.add(Restrictions.inTree(nodeRef));
            criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
            criteriaDomande.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
            OperationContext context = adminCMISSession.getDefaultContext();
            context.setMaxItemsPerPage(10000);
            ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(adminCMISSession, false, context);
            int domandeEstratte = 0;
            for (QueryResult queryResultDomande : domande) {
                String applicationAttach = competitionService.findAttachmentId(adminCMISSession, (String) queryResultDomande.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue(),
                        JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_VALUTAZIONE);
                if (applicationAttach != null) {
                    Document scheda = (Document) adminCMISSession.getObject(applicationAttach);
                    if (scheda.getVersionLabel().equalsIgnoreCase("1.0")) {
                        scheda.deleteAllVersions();
                    } else {
                        continue;
                    }
                }
                try {
                    printSchedaValutazione(adminCMISSession, (String) queryResultDomande.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue(), contextURL, userId, locale);
                    domandeEstratte++;
                } catch (IOException e) {
                    LOGGER.error("Error while generaSchedeValutazione", e);
                }
            }
            EmailMessage message = new EmailMessage();
            message.setBody("Il processo di estrazione delle schede relative bando " + bando.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString() +
                    " è terminato.<br>Sono state estratte " + domandeEstratte + " schede.");
            message.setHtmlBody(true);
            message.setSubject(i18nService.getLabel("subject-info", locale) + "Schede di valutazione");
            message.setRecipients(Arrays.asList(indirizzoEmail));
            mailService.send(message);
        } catch (Exception e) {
            LOGGER.error("Error on Message for generaSchedeValutazione with id:" + nodeRef, e);
        }
    }

    private Long getNumberOfSchedeAnonime(String nodeRef, Session adminCMISSession) {
        Criteria criteriaSchedeAnonime = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA_SINTETICA_GENERATED.queryName());
        criteriaSchedeAnonime.add(Restrictions.inTree(nodeRef));
        return criteriaSchedeAnonime.executeQuery(adminCMISSession, false, adminCMISSession.getDefaultContext()).getTotalNumItems();
    }

    private void generaSchedeAnonima(String nodeRef, final String contextURL, final Locale locale, final String indirizzoEmail, final String userId) {
        try {
            Session adminCMISSession = cmisService.createAdminSession();
            Folder bando = (Folder) adminCMISSession.getObject(nodeRef);
            Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
            criteriaDomande.add(Restrictions.inTree(nodeRef));
            criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), ApplicationService.StatoDomanda.CONFERMATA.getValue()));
            OperationContext context = adminCMISSession.getDefaultContext();
            context.setMaxItemsPerPage(10000);
            ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(adminCMISSession, false, context);
            int schedeEstratte = 0, numeroScheda = getNumberOfSchedeAnonime(nodeRef, adminCMISSession).intValue();
            String messaggio = "";
            for (QueryResult queryResultDomande : domande) {
                String applicationAttach = competitionService.findAttachmentId(adminCMISSession, (String) queryResultDomande.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue(),
                        JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA_SINTETICA_GENERATED);

                if (queryResultDomande.getPropertyById(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()) != null &&
                        queryResultDomande.getPropertyById(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()).getFirstValue() != null) {
                    if (applicationAttach != null)
                        adminCMISSession.getObject(applicationAttach).delete();
                    continue;
                }

                if (applicationAttach != null) {
                    if (adminCMISSession.getObject(applicationAttach).getPropertyValue(JCONONPropertyIds.SCHEDA_ANONIMA_VALUTAZIONE_ESITO.value()) != null) {
                        messaggio = "<BR><b>Alcune schede risultano già valutate, pertanto non sono state estratte nuovamente.</b>";
                        continue;
                    } else {
                        adminCMISSession.getObject(applicationAttach).delete();
                    }
                }
                try {
                    numeroScheda++;
                    printSchedaAnonimaDiValutazione(adminCMISSession, (String) queryResultDomande.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue(), contextURL, userId, locale, numeroScheda);
                    schedeEstratte++;
                } catch (IOException e) {
                    LOGGER.error("Error while generaSchedeValutazione", e);
                }
            }
            EmailMessage message = new EmailMessage();
            message.setBody("Il processo di estrazione delle schede sintetiche anonime relative bando " + bando.getProperty(JCONONPropertyIds.CALL_CODICE.value()).getValueAsString() +
                    " è terminato.<br>Sono state estratte " + schedeEstratte + " schede." + messaggio);
            message.setHtmlBody(true);
            message.setSubject(i18nService.getLabel("subject-info", locale) + "Schede Sintetiche Anonime");
            message.setRecipients(Arrays.asList(indirizzoEmail));
            mailService.send(message);
        } catch (Exception e) {
            LOGGER.error("Error on Message for generaSchedeValutazione with id:" + nodeRef, e);
        }
    }

    public void extractionApplication(PrintParameterModel item) {
        String objectId = extractionApplication(cmisService.createAdminSession(), item.getIds(), item.getType(), item.getQueryType(), item.getContextURL(), item.getUserId());
        EmailMessage message = new EmailMessage();
        message.setBody("<b>Il processo di estrazione è terminato.</b><br>È possibile scaricare il file dal seguente <a href=\"" + item.getContextURL() +
                "/rest/content?deleteAfterDownload=true&nodeRef=" + objectId + "\">link</a>");
        message.setHtmlBody(true);
        message.setSubject(i18nService.getLabel("subject-info", Locale.ITALIAN) + "Estrazione");
        message.setRecipients(Arrays.asList(item.getIndirizzoEmail()));
        mailService.send(message);
    }

    public String extractionApplication(Session session, List<String> ids, String type, String queryType, String contexURL, String userId) {
        HSSFWorkbook wb = null;
        if (Optional.ofNullable(type).isPresent()) {
            if (queryType.equalsIgnoreCase("call")) {
                if (type.equalsIgnoreCase("application")) {
                    wb = createHSSFWorkbook(headCSVApplication);
                    HSSFSheet sheet = wb.getSheet(SHEET_DOMANDE);
                    final int[] index = {1};
                    for (String callId : ids) {
                        Folder call = Optional.ofNullable(session.getObject(callId))
                                .filter(Folder.class::isInstance)
                                .map(Folder.class::cast)
                                .orElseThrow(() -> new RuntimeException("Cannot find call"));
                        StreamSupport.stream(call.getChildren().spliterator(), false)
                                .filter(cmisObject -> cmisObject.getType().getId().equals(JCONONFolderType.JCONON_APPLICATION.value()))
                                .filter(cmisObject -> cmisObject.getPropertyValue(
                                        JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(ApplicationService.StatoDomanda.CONFERMATA.getValue()))
                                .filter(Folder.class::isInstance)
                                .map(Folder.class::cast)
                                .forEach(applicationObject -> {
                                    CMISUser user = null;
                                    try {
                                        user = userService.loadUserForConfirm(applicationObject.getPropertyValue("jconon_application:user"));
                                    } catch (CoolUserFactoryException _ex) {
                                        LOGGER.error("USER {} not found", userId, _ex);
                                        user = new CMISUser(applicationObject.getPropertyValue("jconon_application:user"));
                                    }
                                    LOGGER.info("XLS application index {}", index);
                                    getRecordCSV(session, applicationObject.getFolderParent(), applicationObject, user, contexURL, sheet, index[0]++);
                                });
                    }
                } else if (type.equalsIgnoreCase("call")) {
                    wb = createHSSFWorkbook(headCSVCall, "Bandi");
                    HSSFSheet sheet = wb.getSheetAt(0);
                    int index = 1;
                    for (String callId : ids) {
                        Folder callObject = (Folder) session.getObject(callId);
                        CMISUser user = userService.loadUserForConfirm(callObject.getPropertyValue(PropertyIds.CREATED_BY));
                        getRecordCSVCall(session, callObject, user, contexURL, sheet, index++);
                    }
                } else if (type.equalsIgnoreCase("commission")) {
                    wb = createHSSFWorkbook(headCSVCommission, "Commissioni");
                    HSSFSheet sheet = wb.getSheetAt(0);
                    int index = 1;
                    for (String callId : ids) {
                        Folder callObject = (Folder) session.getObject(callId);
                        Criteria criteriaCommissions = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_COMMISSIONE_METADATA.queryName());
                        criteriaCommissions.addColumn(PropertyIds.OBJECT_ID);
                        criteriaCommissions.add(Restrictions.inFolder(callId));
                        ItemIterable<QueryResult> commissions = criteriaCommissions.executeQuery(session, false, session.getDefaultContext());
                        for (QueryResult commission : commissions.getPage(Integer.MAX_VALUE)) {
                            Document commissionObject = (Document) session.getObject(commission.<String>getPropertyValueById(PropertyIds.OBJECT_ID));
                            getRecordCSVCommission(session, callObject, commissionObject, sheet, index++);
                        }
                    }
                } else if (type.equalsIgnoreCase("score")) {
                    wb = createHSSFWorkbook(headCSVApplicationPunteggi, "Punteggi");
                    HSSFSheet sheet = wb.getSheetAt(0);
                    int[] index = {1};
                    for (String callId : ids) {
                        Folder call = Optional.ofNullable(session.getObject(callId))
                                .filter(Folder.class::isInstance)
                                .map(Folder.class::cast)
                                .orElseThrow(() -> new RuntimeException("Cannot find call"));
                        StreamSupport.stream(call.getChildren().spliterator(), false)
                                .filter(cmisObject -> cmisObject.getType().getId().equals(JCONONFolderType.JCONON_APPLICATION.value()))
                                .filter(cmisObject -> cmisObject.getPropertyValue(
                                        JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(ApplicationService.StatoDomanda.CONFERMATA.getValue()))
                                .filter(cmisObject -> cmisObject.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()) == null)
                                .filter(Folder.class::isInstance)
                                .map(Folder.class::cast)
                                .forEach(applicationObject -> {
                                    CMISUser user = null;
                                    try {
                                        user = userService.loadUserForConfirm(applicationObject.getPropertyValue("jconon_application:user"));
                                    } catch (CoolUserFactoryException _ex) {
                                        LOGGER.error("USER {} not found", userId, _ex);
                                        user = new CMISUser(applicationObject.getPropertyValue("jconon_application:user"));
                                    }
                                    LOGGER.info("XLS score index {}", index[0]);
                                    getRecordCSVPunteggi(session, applicationObject.getFolderParent(), applicationObject, user, contexURL, sheet, index[0]++);
                                });
                    }
                } else if (type.equalsIgnoreCase("istruttoria")) {
                    wb = new HSSFWorkbook();
                    int indexSheet = 0;
                    for (String callId : ids) {
                        indexSheet++;
                        Folder callObject = (Folder) session.getObject(callId);
                        Locale locale = Locale.ITALY;
                        Properties props = i18nService.loadLabels(locale);
                        props.putAll(competitionService.getDynamicLabels(callObject, session));

                        List<PropertyDefinition<?>> headPropertyDefinition = createHeadApplicationAll(
                                session,
                                callObject,
                                JCONONPropertyIds.CALL_ELENCO_ASPECTS
                        );
                        headPropertyDefinition.addAll(
                                createHeadApplicationAll(
                                        session,
                                        callObject,
                                        JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_CNR
                                )
                        );
                        headPropertyDefinition.addAll(
                                createHeadApplicationAll(
                                        session,
                                        callObject,
                                        JCONONPropertyIds.CALL_ELENCO_ASPECTS_ULTERIORI_DATI
                                )
                        );
                        headPropertyDefinition.addAll(
                                createHeadApplicationAll(
                                        session,
                                        callObject,
                                        JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_4
                                )
                        );
                        headPropertyDefinition.addAll(
                                createHeadApplicationAll(
                                        session,
                                        callObject,
                                        JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_5
                                )
                        );
                        final List<String> columns = Arrays.asList("Codice Sede", "Descrizione Sede", "Livello Profilo", "Profilo", "Tipo Contratto");
                        Stream<String> concat = headCSVApplicationIstruttoria.stream();
                        if (Optional.ofNullable(siperService).isPresent()) {
                             concat = Stream.concat(headCSVApplicationIstruttoria.stream(), columns.stream());
                        }
                        final List<String> columnsHead = Stream.concat(concat, headPropertyDefinition
                                        .stream()
                                        .map(propertyDefinition -> {
                                            return Optional.ofNullable(props.getProperty("label.".concat(propertyDefinition.getId().replace(":", "."))))
                                                    .filter(s -> s.length() > 0)
                                                    .orElse(
                                                            Optional.ofNullable(propertyDefinition.getDisplayName())
                                                                    .filter(s -> s.length() > 0)
                                                                    .orElse(TESTO)
                                                    );
                                        }))
                                .collect(Collectors.toList());
                        if (Optional.ofNullable(callObject.<Boolean>getPropertyValue(PAGOPAPropertyIds.CALL_PAGAMENTO_PAGOPA.value())).orElse(Boolean.FALSE)){
                            columnsHead.add("Stato Pagamento pagoPA");
                        }
                        final HSSFSheet sheet = createSheet(wb,indexSheet + " - " + callObject.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()),columnsHead);
                        final int[] index = {1};
                        Stream<Folder> folderStream;
                        if (callObject.getSecondaryTypes()
                                .stream()
                                .map(SecondaryType::getId)
                                .filter(s -> s.equalsIgnoreCase(JCONONPolicyType.JCONON_MACRO_CALL.value()))
                                .findAny().isPresent()) {
                            Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
                            criteriaDomande.addColumn(PropertyIds.OBJECT_ID);
                            criteriaDomande.add(Restrictions.inTree(callObject.getId()));
                            criteriaDomande.add(Restrictions.ne(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.INIZIALE.getValue()));
                            ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(session, false, session.getDefaultContext());
                            folderStream = StreamSupport.stream(domande.spliterator(), false)
                                    .map(queryResult -> session.getObject(queryResult.<String>getPropertyValueById(PropertyIds.OBJECT_ID)))
                                    .filter(Folder.class::isInstance)
                                    .map(Folder.class::cast);
                        } else {
                            folderStream = StreamSupport.stream(callObject.getChildren().spliterator(), false)
                                    .filter(cmisObject -> cmisObject.getType().getId().equals(JCONONFolderType.JCONON_APPLICATION.value()))
                                    .filter(cmisObject -> cmisObject.getPropertyValue(
                                            JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(ApplicationService.StatoDomanda.CONFERMATA.getValue()))
                                    .filter(Folder.class::isInstance)
                                    .map(Folder.class::cast);
                        }
                        folderStream.forEach(applicationObject -> {
                            CMISUser user = null;
                            try {
                                user = userService.loadUserForConfirm(applicationObject.getPropertyValue("jconon_application:user"));
                            } catch (CoolUserFactoryException _ex) {
                                LOGGER.error("USER {} not found", userId, _ex);
                                user = new CMISUser(applicationObject.getPropertyValue("jconon_application:user"));
                            }
                            LOGGER.info("XLS Istruttoria index {}", index[0]);
                            getRecordCSVIstruttoria(session, applicationObject.getFolderParent(), applicationObject, user, contexURL, sheet, headPropertyDefinition, index[0]++);
                        });
                    }
                }
            } else if (queryType.equalsIgnoreCase("application")) {
                if (type.equalsIgnoreCase("application")) {
                    wb = createHSSFWorkbook(headCSVApplication);
                    HSSFSheet sheet = wb.getSheet(SHEET_DOMANDE);
                    int index = 1;
                    for (String applicationId : ids) {
                        Folder applicationObject = (Folder) session.getObject(applicationId);
                        CMISUser user = null;
                        try {
                            user = userService.loadUserForConfirm(applicationObject.getPropertyValue("jconon_application:user"));
                        } catch (CoolUserFactoryException _ex) {
                            LOGGER.error("USER {} not found", userId, _ex);
                            user = new CMISUser(applicationObject.getPropertyValue("jconon_application:user"));
                        }
                        getRecordCSV(session, applicationObject.getFolderParent(), applicationObject, user, contexURL, sheet, index++);
                    }
                } else if (type.equalsIgnoreCase("score")) {
                    wb = createHSSFWorkbook(headCSVApplicationPunteggi, "Punteggi");
                    HSSFSheet sheet = wb.getSheetAt(0);
                    int index = 1;
                    for (String applicationId : ids) {
                        Folder applicationObject = (Folder) session.getObject(applicationId);
                        CMISUser user = null;
                        try {
                            user = userService.loadUserForConfirm(applicationObject.getPropertyValue("jconon_application:user"));
                        } catch (CoolUserFactoryException _ex) {
                            LOGGER.error("USER {} not found", userId, _ex);
                            user = new CMISUser(applicationObject.getPropertyValue("jconon_application:user"));
                        }
                        getRecordCSVPunteggi(session, applicationObject.getFolderParent(), applicationObject, user, contexURL, sheet, index++);
                    }
                } else if (type.equalsIgnoreCase("istruttoria")) {
                    wb = new HSSFWorkbook();
                    final List<Folder> applications = Optional.ofNullable(ids)
                            .map(List::stream)
                            .orElse(Stream.empty())
                            .map(s -> session.getObject(s))
                            .filter(Folder.class::isInstance)
                            .map(Folder.class::cast)
                            .collect(Collectors.toList());
                    final Map<String, List<Folder>> bandi = applications.stream()
                            .collect(Collectors.groupingBy(folder -> folder.getParentId()));
                    int indexBandi = 0;
                    for (String callId : bandi.keySet()) {
                        indexBandi++;
                        Folder callObject = Optional.ofNullable(callId)
                                .map(s -> session.getObject(s))
                                .filter(Folder.class::isInstance)
                                .map(Folder.class::cast)
                                .orElseThrow(() -> new ClientMessageException("Estrazione excel Bando non trovato: " + callId));
                        Locale locale = Locale.ITALY;
                        Properties props = i18nService.loadLabels(locale);
                        props.putAll(competitionService.getDynamicLabels(callObject, session));

                        List<PropertyDefinition<?>> headPropertyDefinition = createHeadApplicationAll(
                                session,
                                callObject,
                                JCONONPropertyIds.CALL_ELENCO_ASPECTS
                        );
                        headPropertyDefinition.addAll(
                                createHeadApplicationAll(
                                        session,
                                        callObject,
                                        JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_CNR
                                )
                        );
                        headPropertyDefinition.addAll(
                                createHeadApplicationAll(
                                        session,
                                        callObject,
                                        JCONONPropertyIds.CALL_ELENCO_ASPECTS_ULTERIORI_DATI
                                )
                        );
                        headPropertyDefinition.addAll(
                                createHeadApplicationAll(
                                        session,
                                        callObject,
                                        JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_4
                                )
                        );
                        headPropertyDefinition.addAll(
                                createHeadApplicationAll(
                                        session,
                                        callObject,
                                        JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_5
                                )
                        );
                        Stream<String> concat = headCSVApplicationIstruttoria.stream();
                        if (Optional.ofNullable(siperService).isPresent()) {
                            concat = Stream.concat(
                                    headCSVApplicationIstruttoria.stream(),
                                    Arrays.asList("Codice Sede", "Descrizione Sede", "Livello Profilo", "Profilo", "Tipo Contratto").stream()
                            );
                        }
                        final List<String> columnsHead = Stream.concat(concat, headPropertyDefinition
                                        .stream()
                                        .map(propertyDefinition -> {
                                            return Optional.ofNullable(props.getProperty("label.".concat(propertyDefinition.getId().replace(":", "."))))
                                                    .filter(s -> s.length() > 0)
                                                    .orElse(
                                                            Optional.ofNullable(propertyDefinition.getDisplayName())
                                                                    .filter(s -> s.length() > 0)
                                                                    .orElse(TESTO)
                                                    );
                                        }))
                                .collect(Collectors.toList());
                        if (Optional.ofNullable(callObject.<Boolean>getPropertyValue(PAGOPAPropertyIds.CALL_PAGAMENTO_PAGOPA.value())).orElse(Boolean.FALSE)){
                            columnsHead.add("Stato Pagamento pagoPA");
                        }

                        final HSSFSheet sheet = createSheet(
                                wb,
                                indexBandi + " - " + callObject.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()),
                                columnsHead
                        );
                        int index = 1;
                        for (Folder applicationObject : bandi.get(callId)) {
                            CMISUser user = null;
                            try {
                                user = userService.loadUserForConfirm(applicationObject.getPropertyValue("jconon_application:user"));
                            } catch (CoolUserFactoryException _ex) {
                                LOGGER.error("USER {} not found", userId, _ex);
                                user = new CMISUser(applicationObject.getPropertyValue("jconon_application:user"));
                            }
                            LOGGER.info("XLS Istruttoria index {}", index);
                            getRecordCSVIstruttoria(session, callObject, applicationObject, user, contexURL, sheet, headPropertyDefinition, index++);
                        }
                    }
                }
            }
        } else {
            wb = createHSSFWorkbook(headCSVApplication);
            HSSFSheet sheet = wb.getSheet(SHEET_DOMANDE);
            int index = 1;
            for (String application : ids) {
                Folder applicationObject = (Folder) session.getObject(application);
                CMISUser user = userService.loadUserForConfirm(applicationObject.getPropertyValue("jconon_application:user"));
                getRecordCSV(session, applicationObject.getFolderParent(), applicationObject, user, contexURL, sheet, index++);
            }
        }
        autoSizeColumns(wb);
        try {
            return createXLSDocument(session, wb, userId).getId();
        } catch (IOException e) {
            LOGGER.error("Error while extractionApplication", e);
            return null;
        }
    }

    private List<PropertyDefinition<?>> createHeadApplicationAll(Session session, Folder callObject, JCONONPropertyIds callProperty) {
        return callObject.<List<String>>getPropertyValue(callProperty.value())
                .stream()
                .filter(s -> !s.equalsIgnoreCase(JCONONPolicyType.JCONON_APPLICATION_ASPECT_POSSESSO_REQUISITI.value()))
                .map(s -> {
                    return session.getTypeDefinition(bulkInfoService.find(s).getCmisTypeName())
                            .getPropertyDefinitions()
                            .values()
                            .stream()
                            .filter(propertyDefinition -> !CMISPropertyIds.ids().contains(propertyDefinition.getId()))
                            .collect(Collectors.toList());
                })
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

    private HSSFSheet createSheet(HSSFWorkbook wb, String sheetName, List<String> head) {
        HSSFSheet sheet = wb.createSheet(sheetName);
        HSSFRow headRow = sheet.createRow(0);
        headRow.setHeight((short) 500);
        HSSFCellStyle headStyle = wb.createCellStyle();
        headStyle.setAlignment(HorizontalAlignment.CENTER);
        headStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        headStyle.setBorderBottom(BorderStyle.THIN);
        headStyle.setBorderRight(BorderStyle.THIN);
        headStyle.setBorderLeft(BorderStyle.THIN);
        headStyle.setBorderTop(BorderStyle.THIN);
        headStyle.setLocked(true);
        HSSFFont font = wb.createFont();
        font.setBold(true);
        headStyle.setFont(font);
        for (int i = 0; i < head.size(); i++) {
            HSSFCell cell = headRow.createCell(i);
            cell.setCellStyle(headStyle);
            cell.setCellValue(head.get(i));
        }
        return sheet;
    }

    private void getRecordCSVCommission(Session session, Folder callObject, Document commissionObject, HSSFSheet sheet, int index) {
        int column = 0;
        HSSFRow row = sheet.createRow(index);
        row.createCell(column++).setCellValue(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()));
        row.createCell(column++).setCellValue(
                Optional.ofNullable(commissionObject.<String>getPropertyValue(JCONONPropertyIds.COMMISSIONE_USERNAME.value()))
                        .orElse("")
        );
        row.createCell(column++).setCellValue(
                Optional.ofNullable(commissionObject.<String>getPropertyValue(JCONONPropertyIds.COMMISSIONE_APPELLATIVO.value()))
                        .orElse("")
        );
        row.createCell(column++).setCellValue(
                Optional.ofNullable(commissionObject.<String>getPropertyValue(JCONONPropertyIds.COMMISSIONE_COGNOME.value()))
                        .orElse("")
        );
        row.createCell(column++).setCellValue(
                Optional.ofNullable(commissionObject.<String>getPropertyValue(JCONONPropertyIds.COMMISSIONE_NOME.value()))
                        .orElse("")
        );
        row.createCell(column++).setCellValue(
                Optional.ofNullable(commissionObject.<String>getPropertyValue(JCONONPropertyIds.COMMISSIONE_SESSO.value()))
                        .orElse("")
        );
        row.createCell(column++).setCellValue(
                Optional.ofNullable(commissionObject.<String>getPropertyValue(JCONONPropertyIds.COMMISSIONE_QUALIFICA.value()))
                        .orElse("")
        );
        row.createCell(column++).setCellValue(
                i18nService.getLabel("label.jconon_commissione.ruolo_".concat(Optional.ofNullable(commissionObject.<String>getPropertyValue(JCONONPropertyIds.COMMISSIONE_RUOLO.value()))
                        .orElse("notfound")), Locale.ITALIAN)
        );
        row.createCell(column++).setCellValue(
                Optional.ofNullable(commissionObject.<String>getPropertyValue(JCONONPropertyIds.COMMISSIONE_EMAIL.value()))
                        .orElse("")
        );
    }

    private void getRecordCSVCall(Session session, Folder callObject, CMISUser user, String contexURL, HSSFSheet sheet, int index) {
        int column = 0;
        HSSFRow row = sheet.createRow(index);
        row.createCell(column++).setCellValue(
                Optional.ofNullable(i18nService.getLabel(callObject.getType().getId(), Locale.ITALY))
                        .orElse(callObject.getType().getDisplayName())
        );

        row.createCell(column++).setCellValue(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()));
        row.createCell(column++).setCellValue(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_STRUTTURA_DESTINATARIA.value()));
        row.createCell(column++).setCellValue(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_SEDE.value()));
        row.createCell(column++).setCellValue(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_NUMERO_GU.value()));
        row.createCell(column++).setCellValue(Optional.ofNullable(callObject.getPropertyValue(JCONONPropertyIds.CALL_DATA_GU.value())).map(
                map -> dateFormat.format(((Calendar) map).getTime())).orElse(""));
        row.createCell(column++).setCellValue(Optional.ofNullable(callObject.getPropertyValue(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value())).map(
                map -> dateFormat.format(((Calendar) map).getTime())).orElse(""));

        final List<CMISAuthority> users = groupService.children(
                callObject.getPropertyValue(JCONONPropertyIds.CALL_RDP.value()),
                cmisService.getAdminSession()
        ).stream().collect(Collectors.toList());

        row.createCell(column++).setCellValue(
                Optional.ofNullable(users)
                        .filter(strings -> !strings.isEmpty())
                        .orElse(Collections.emptyList())
                        .stream()
                        .filter(cmisAuthority -> cmisAuthority.getAuthorityType().equalsIgnoreCase("USER"))
                        .map(CMISAuthority::getFullName)
                        .collect(Collectors.joining(","))
        );

        row.createCell(column++).setCellValue(
                Optional.ofNullable(users)
                        .filter(strings -> !strings.isEmpty())
                        .orElse(Collections.emptyList())
                        .stream()
                        .filter(cmisAuthority -> cmisAuthority.getAuthorityType().equalsIgnoreCase("USER"))
                        .map(CMISAuthority::getShortName)
                        .map(s -> userService.loadUserForConfirm(s).getEmail())
                        .collect(Collectors.joining(","))
        );

        row.createCell(column++).setCellValue(
                Optional.ofNullable(callObject.<BigInteger>getPropertyValue(JCONONPropertyIds.CALL_NUMERO_POSTI.value()))
                        .map(BigInteger::toString)
                        .orElse("")
        );
        row.createCell(column++).setCellValue(
                Optional.ofNullable(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_PROFILO.value()))
                        .orElse("")
        );
        final Map<JCONONDocumentType, Pair<String, String>> protocollo = getProtocollo(session, callObject);

        final Pair<String, String> protocolloBando = protocollo.getOrDefault(JCONONDocumentType.JCONON_ATTACHMENT_CALL_IT, new Pair<String, String>("", ""));
        row.createCell(column++).setCellValue(protocolloBando.getFirst());
        row.createCell(column++).setCellValue(protocolloBando.getSecond());

        final Pair<String, String> protocolloCommissione = protocollo.getOrDefault(JCONONDocumentType.JCONON_ATTACHMENT_CALL_COMMISSION, new Pair<String, String>("", ""));
        row.createCell(column++).setCellValue(protocolloCommissione.getFirst());
        row.createCell(column++).setCellValue(protocolloCommissione.getSecond());
        final Pair<String, String> protocolloModificaCommissione = protocollo.getOrDefault(JCONONDocumentType.JCONON_ATTACHMENT_CALL_COMMISSION_MODIFICATION, new Pair<String, String>("", ""));
        row.createCell(column++).setCellValue(protocolloModificaCommissione.getFirst());
        row.createCell(column++).setCellValue(protocolloModificaCommissione.getSecond());
        final Pair<String, String> protocolloNominaSegretario = protocollo.getOrDefault(JCONONDocumentType.JCONON_ATTACHMENT_CALL_NOMINA_SEGRETARIO, new Pair<String, String>("", ""));
        row.createCell(column++).setCellValue(protocolloNominaSegretario.getFirst());
        row.createCell(column++).setCellValue(protocolloNominaSegretario.getSecond());
        final Pair<String, String> protocolloGraduatoria = protocollo.getOrDefault(JCONONDocumentType.JCONON_ATTACHMENT_CALL_CLASSIFICATION, new Pair<String, String>("", ""));
        row.createCell(column++).setCellValue(protocolloGraduatoria.getFirst());
        row.createCell(column++).setCellValue(protocolloGraduatoria.getSecond());

        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.addColumn(PropertyIds.NAME);
        criteria.add(Restrictions.inTree(callObject.getId()));
        criteria.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue()));
        ItemIterable<QueryResult> iterable = criteria.executeQuery(session, false, session.getDefaultContext());
        final long totalNumItems = iterable.getTotalNumItems();
        row.createCell(column++).setCellValue(
                Optional.ofNullable(totalNumItems)
                        .orElse(Long.valueOf(0))
        );

        Criteria criteriaAttive = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaAttive.addColumn(PropertyIds.OBJECT_ID);
        criteriaAttive.addColumn(PropertyIds.NAME);
        criteriaAttive.add(Restrictions.inTree(callObject.getId()));
        criteriaAttive.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue()));
        criteriaAttive.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        ItemIterable<QueryResult> iterableAttive = criteriaAttive.executeQuery(session, false, session.getDefaultContext());
        final long totalNumItemsAttive = iterableAttive.getTotalNumItems();
        row.createCell(column++).setCellValue(
                Optional.ofNullable(totalNumItemsAttive)
                        .orElse(Long.valueOf(0))
        );

        row.createCell(column++).setCellValue(
                Optional.ofNullable(totalNumItems - totalNumItemsAttive)
                        .orElse(Long.valueOf(0))
        );


    }

    private Map<JCONONDocumentType, Pair<String, String>> getProtocollo(Session session, Folder callObject) {
        Map<JCONONDocumentType, Pair<String, String>> result = new HashMap<>();
        Optional.ofNullable(findAttachmentId(
                        session,
                        callObject,
                        callObject.getType().getId().equalsIgnoreCase(JCONONFolderType.JCONON_CALL_MOBILITY.value()) ?
                                JCONONDocumentType.JCONON_ATTACHMENT_CALL_MOBILITY:
                                JCONONDocumentType.JCONON_ATTACHMENT_CALL_IT,
                        true
                ))
                .map(s -> session.getObject(s))
                .ifPresent(cmisObject -> {
                    result.put(JCONONDocumentType.JCONON_ATTACHMENT_CALL_IT,
                            new Pair<>(
                                    cmisObject.getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                                    Optional.ofNullable(cmisObject.<Calendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value()))
                                            .map(Calendar::getTime)
                                            .map(date -> dateFormat.format(date))
                                            .orElse("")
                            )
                    );
                });
        Optional.ofNullable(findAttachmentId(session, callObject, JCONONDocumentType.JCONON_ATTACHMENT_CALL_COMMISSION, true))
                .map(s -> session.getObject(s))
                .ifPresent(cmisObject -> {
                    result.put(JCONONDocumentType.JCONON_ATTACHMENT_CALL_COMMISSION,
                            new Pair<>(
                                    cmisObject.getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                                    Optional.ofNullable(cmisObject.<Calendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value()))
                                            .map(Calendar::getTime)
                                            .map(date -> dateFormat.format(date))
                                            .orElse("")
                            )
                    );
                });
        Optional.ofNullable(findAttachmentId(session, callObject, JCONONDocumentType.JCONON_ATTACHMENT_CALL_COMMISSION_MODIFICATION, true))
                .map(s -> session.getObject(s))
                .ifPresent(cmisObject -> {
                    result.put(JCONONDocumentType.JCONON_ATTACHMENT_CALL_COMMISSION_MODIFICATION,
                            new Pair<>(
                                    cmisObject.getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                                    Optional.ofNullable(cmisObject.<Calendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value()))
                                            .map(Calendar::getTime)
                                            .map(date -> dateFormat.format(date))
                                            .orElse("")
                            )
                    );
                });
        Optional.ofNullable(findAttachmentId(session, callObject, JCONONDocumentType.JCONON_ATTACHMENT_CALL_NOMINA_SEGRETARIO, true))
                .map(s -> session.getObject(s))
                .ifPresent(cmisObject -> {
                    result.put(JCONONDocumentType.JCONON_ATTACHMENT_CALL_NOMINA_SEGRETARIO,
                            new Pair<>(
                                    cmisObject.getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                                    Optional.ofNullable(cmisObject.<Calendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value()))
                                            .map(Calendar::getTime)
                                            .map(date -> dateFormat.format(date))
                                            .orElse("")
                            )
                    );
                });
        Optional.ofNullable(findAttachmentId(session, callObject, JCONONDocumentType.JCONON_ATTACHMENT_CALL_CLASSIFICATION, true))
                .map(s -> session.getObject(s))
                .ifPresent(cmisObject -> {
                    result.put(JCONONDocumentType.JCONON_ATTACHMENT_CALL_CLASSIFICATION,
                            new Pair<>(
                                    cmisObject.getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                                    Optional.ofNullable(cmisObject.<Calendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value()))
                                            .map(Calendar::getTime)
                                            .map(date -> dateFormat.format(date))
                                            .orElse("")
                            )
                    );
                });
        return result;
    }

    private void getRecordCSVPunteggi(Session session, Folder callObject, Folder applicationObject, CMISUser user, String contexURL, HSSFSheet sheet, int index) {
        int column = 0;
        HSSFRow row = sheet.createRow(index);
        row.createCell(column++).setCellValue(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()));
        row.createCell(column++).setCellValue(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_STRUTTURA_DESTINATARIA.value()));
        row.createCell(column++).setCellValue(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_SEDE.value()));
        row.createCell(column++).setCellValue(
                Optional.ofNullable(callObject.<BigInteger>getPropertyValue(JCONONPropertyIds.CALL_NUMERO_POSTI.value()))
                        .map(BigInteger::toString)
                        .orElse("")
        );
        row.createCell(column++).setCellValue(
                Optional.ofNullable(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_PROFILO.value()))
                        .orElse("")
        );
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value()).toUpperCase());
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value()).toUpperCase());
        row.createCell(column++).setCellValue(Optional.ofNullable(applicationObject.getProperty(JCONONPropertyIds.APPLICATION_DATA_NASCITA.value()).getValue()).map(
                map -> dateFormat.format(((Calendar) map).getTime())).orElse(""));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value()));
        row.createCell(column++).setCellValue(
                Optional.ofNullable(user)
                        .flatMap(cmisUser -> Optional.ofNullable(cmisUser.getMatricola()))
                        .map(integer -> integer.toString())
                        .orElse("")
        );
        row.createCell(column++).setCellValue(
                Optional.ofNullable(applicationObject.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value()))
                        .filter(s -> !s.isEmpty())
                        .orElse(user.getEmail())
        );
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value()));
        createCellNumeric(row, column++).setCellValue(
                Optional.ofNullable(applicationObject.<BigDecimal>getPropertyValue(JCONONPropertyIds.APPLICATION_TOTALE_PUNTEGGIO.value()))
                        .map(bigDecimal -> {
                            return NumberFormat.getNumberInstance(Locale.ITALIAN).format(bigDecimal);
                        })
                        .orElse(null));
        createCellNumeric(row, column++).setCellValue(
                Optional.ofNullable(applicationObject.<BigInteger>getPropertyValue(JCONONPropertyIds.APPLICATION_GRADUATORIA.value()))
                        .map(bigInteger -> {
                            return String.valueOf(bigInteger);
                        })
                        .orElse(null));
        createCellString(row, column++).setCellValue(applicationObject.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_ESITO_CALL.value()));
        createCellString(row, column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:punteggio_note"));

        createCellString(row, column++).setCellValue(
                Optional.ofNullable(applicationObject.getProperty("jconon_application:protocollo_data_graduatoria").getValue())
                        .map(map -> dateFormat.format(((Calendar) map).getTime())).orElse(""));

        createCellString(row, column++).setCellValue(
                Optional.ofNullable(applicationObject.<String>getPropertyValue("jconon_application:protocollo_numero_graduatoria"))
                        .orElse(""));
        createCellString(row, column++).setCellValue(
                Optional.ofNullable(applicationObject.getProperty("jconon_application:protocollo_data_assunzione_idoneo").getValue())
                        .map(map -> dateFormat.format(((Calendar) map).getTime())).orElse(""));

        createCellString(row, column++).setCellValue(
                Optional.ofNullable(applicationObject.<String>getPropertyValue("jconon_application:protocollo_numero_assunzione_idoneo"))
                        .orElse(""));
    }

    private void getRecordCSV(Session session, Folder callObject, Folder applicationObject, CMISUser user, String contexURL, HSSFSheet sheet, int index) {
        int column = 0;
        HSSFRow row = sheet.createRow(index);
        row.createCell(column++).setCellValue(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()));
        row.createCell(column++).setCellValue(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_SEDE.value()));
        row.createCell(column++).setCellValue(Optional.ofNullable(callObject.getProperty("jconon_call:elenco_macroaree")).map(Property::getValueAsString).orElse(""));
        row.createCell(column++).setCellValue(Optional.ofNullable(callObject.getProperty("jconon_call:elenco_settori_tecnologici")).map(Property::getValueAsString).orElse(""));
        row.createCell(column++).setCellValue(Optional.ofNullable(user.getMatricola()).map(map -> map.toString()).orElse(""));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:cognome").toUpperCase());
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:nome").toUpperCase());
        row.createCell(column++).setCellValue(Optional.ofNullable(applicationObject.getProperty("jconon_application:data_nascita").getValue()).map(
                map -> dateFormat.format(((Calendar) map).getTime())).orElse(""));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:sesso"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:nazione_nascita"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:comune_nascita"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:provincia_nascita"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:nazione_residenza"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:provincia_residenza"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:comune_residenza"));
        row.createCell(column++).setCellValue(Optional.ofNullable(applicationObject.getProperty("jconon_application:indirizzo_residenza")).map(Property::getValueAsString).orElse("").concat(" - ").concat(
                Optional.ofNullable(applicationObject.getProperty("jconon_application:num_civico_residenza")).map(Property::getValueAsString).orElse("")));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:cap_residenza"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:codice_fiscale"));

        final Optional<CmisObject> documentoRiconoscimento = Optional.ofNullable(
                competitionService.findAttachmentId(session, applicationObject.getId(), JCONONDocumentType.JCONON_ATTACHMENT_DOCUMENTO_RICONOSCIMENTO)
        ).map(objectId -> session.getObject(objectId));
        row.createCell(column++).setCellValue(documentoRiconoscimento.map(
                cmisObject -> cmisObject.<String>getPropertyValue("jconon_documento_riconoscimento:tipologia")).orElse(""));
        row.createCell(column++).setCellValue(documentoRiconoscimento.map(
                cmisObject -> cmisObject.<String>getPropertyValue("jconon_documento_riconoscimento:numero")).orElse(""));
        row.createCell(column++).setCellValue(documentoRiconoscimento.map(
                cmisObject -> cmisObject.getPropertyValue("jconon_documento_riconoscimento:data_scadenza")).map(
                map -> dateFormat.format(((Calendar) map).getTime())).orElse(""));
        row.createCell(column++).setCellValue(documentoRiconoscimento.map(
                cmisObject -> cmisObject.<String>getPropertyValue("jconon_documento_riconoscimento:emittente")).orElse(""));


        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:struttura_cnr"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:titolo_servizio_cnr"));
        row.createCell(column++).setCellValue(Optional.ofNullable(applicationObject.getProperty("jconon_application:fl_direttore")).map(Property::getValueAsString).orElse(""));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:struttura_altre_amministrazioni"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:titolo_servizio_altre_amministrazioni"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:sede_altra_attivita"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:ruolo_altra_attivita"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:profilo"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:struttura_appartenenza"));
        row.createCell(column++).setCellValue(Optional.ofNullable(applicationObject.getProperty("jconon_application:settore_scientifico_tecnologico")).map(Property::getValueAsString).orElse(""));
        row.createCell(column++).setCellValue(Optional.ofNullable(applicationObject.getProperty("jconon_application:area_scientifica")).map(Property::getValueAsString).orElse(""));
        row.createCell(column++).setCellValue(Optional.ofNullable(applicationObject.<String>getPropertyValue("jconon_application:email_comunicazioni")).filter(s -> !s.isEmpty()).orElse(user.getEmail()));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:email_pec_comunicazioni"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:nazione_comunicazioni"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:provincia_comunicazioni"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:comune_comunicazioni"));
        row.createCell(column++).setCellValue(Optional.ofNullable(applicationObject.getProperty("jconon_application:indirizzo_comunicazioni")).map(Property::getValueAsString).orElse("").concat(" - ").concat(
                Optional.ofNullable(applicationObject.getProperty("jconon_application:num_civico_comunicazioni")).map(Property::getValueAsString).orElse("")));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:cap_comunicazioni"));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:telefono_comunicazioni"));
        row.createCell(column++).setCellValue(Optional.ofNullable(applicationObject.getPropertyValue("jconon_application:data_domanda")).map(map ->
                dateTimeFormat.format(((Calendar) applicationObject.getPropertyValue("jconon_application:data_domanda")).getTime())).orElse(""));
        row.createCell(column++).setCellValue(ApplicationService.StatoDomanda.fromValue(applicationObject.getPropertyValue("jconon_application:stato_domanda")).displayValue());
        row.createCell(column++).setCellValue(Optional.ofNullable(applicationObject.getPropertyValue("jconon_application:esclusione_rinuncia")).map(map ->
                ApplicationService.StatoDomanda.fromValue(applicationObject.getPropertyValue("jconon_application:esclusione_rinuncia")).displayValue()).orElse(""));
        row.createCell(column++).setCellValue(
                Optional.ofNullable(applicationObject.getProperty(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()))
                        .map(Property::getValueAsString)
                        .orElse("")
        );
        row.createCell(column++).setCellValue(
                Optional.ofNullable(applicationObject.getProperty(JCONONPropertyIds.PROTOCOLLO_DATA.value()))
                        .flatMap(objectProperty -> Optional.ofNullable(objectProperty.getValue()))
                        .filter(Calendar.class::isInstance)
                        .map(Calendar.class::cast)
                        .map(value -> dateFormat.format(value.getTime()))
                        .orElse("")
        );
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_ESITO_CALL.value()));
        row.createCell(column++).setCellValue(applicationObject.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_PUNTEGGIO_NOTE.value()));

    }

    private void getRecordCSVIstruttoria(Session session, Folder callObject, Folder applicationObject, CMISUser user, String contexURL,
                                         HSSFSheet sheet, List<PropertyDefinition<?>> headPropertyDefinition, int index) {
        final AtomicInteger column = new AtomicInteger();
        HSSFRow row = sheet.createRow(index);
        row.createCell(column.getAndIncrement()).setCellValue(callObject.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()));
        row.createCell(column.getAndIncrement()).setCellValue(user.getId());
        row.createCell(column.getAndIncrement()).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:cognome").toUpperCase());
        row.createCell(column.getAndIncrement()).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:nome").toUpperCase());
        row.createCell(column.getAndIncrement()).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:codice_fiscale"));
        row.createCell(column.getAndIncrement()).setCellValue(Optional.ofNullable(user.getMatricola()).map(String::valueOf).orElse(""));
        createCellString(row, column.getAndIncrement()).setCellValue(
                Optional.ofNullable(applicationObject.<String>getPropertyValue("jconon_application:esclusione_rinuncia"))
                        .map(x -> StatoDomanda.fromValue(x).displayValue())
                        .orElse(StatoDomanda.fromValue(applicationObject.getPropertyValue("jconon_application:stato_domanda")).displayValue())
        );

        if (Optional.ofNullable(siperService).isPresent()) {
            if (Optional.ofNullable(user.getMatricola()).isPresent()) {
                final JsonObject anagraficaDipendente = siperService.getAnagraficaDipendente(user.getUserName());
                if (anagraficaDipendente != null && !anagraficaDipendente.isJsonNull()) {
                    row.createCell(column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(anagraficaDipendente.get("codice_sede"))
                                    .map(JsonElement::getAsString)
                                    .orElse("")
                    );
                    row.createCell(column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(anagraficaDipendente.get("struttura_appartenenza"))
                                    .map(JsonElement::getAsString)
                                    .orElse("")
                    );
                    row.createCell(column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(anagraficaDipendente.get("livello_profilo"))
                                    .map(JsonElement::getAsString)
                                    .orElse("")
                    );
                    row.createCell(column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(anagraficaDipendente.get("profilo"))
                                    .map(JsonElement::getAsString)
                                    .orElse("")
                    );
                    row.createCell(column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(anagraficaDipendente.get("tipo_contratto"))
                                    .map(JsonElement::getAsString)
                                    .orElse("")
                    );
                } else {
                    row.createCell(column.getAndIncrement()).setCellValue("");
                    row.createCell(column.getAndIncrement()).setCellValue("");
                    row.createCell(column.getAndIncrement()).setCellValue("");
                    row.createCell(column.getAndIncrement()).setCellValue("");
                    row.createCell(column.getAndIncrement()).setCellValue("");
                }
            } else {
                row.createCell(column.getAndIncrement()).setCellValue("");
                row.createCell(column.getAndIncrement()).setCellValue("");
                row.createCell(column.getAndIncrement()).setCellValue("");
                row.createCell(column.getAndIncrement()).setCellValue("");
                row.createCell(column.getAndIncrement()).setCellValue("");
            }
        }
        headPropertyDefinition
                .stream()
                .forEach(propertyDefinition -> {
                    final Optional<Object> propertyValue = Optional.ofNullable(applicationObject.getPropertyValue(propertyDefinition.getId()));
                    String value = "";
                    if (propertyValue.isPresent()) {
                        if (Optional.ofNullable(propertyDefinition.getCardinality())
                                .filter(cardinality -> cardinality.equals(Cardinality.MULTI))
                                .isPresent()) {
                            if (propertyDefinition.getPropertyType().equals(PropertyType.DATETIME)) {
                                final Stream<Calendar> stream = propertyValue
                                        .filter(List.class::isInstance)
                                        .map(List.class::cast)
                                        .map(list -> list.stream())
                                        .orElse(Stream.empty());
                                value = String.join(",", stream.map(o -> dateFormat.format(o.getTime()))
                                        .collect(Collectors.toList()));
                            } else if (propertyDefinition.getPropertyType().equals(PropertyType.BOOLEAN)) {
                                final Stream<Boolean> stream = propertyValue
                                        .filter(List.class::isInstance)
                                        .map(List.class::cast)
                                        .map(list -> list.stream())
                                        .orElse(Stream.empty());
                                value = String.join(",",
                                        stream.map(o -> o ? "SI" : "NO")
                                                .collect(Collectors.toList()));
                            } else {
                                final Stream<Object> stream = propertyValue
                                        .filter(List.class::isInstance)
                                        .map(List.class::cast)
                                        .map(list -> list.stream())
                                        .orElse(Stream.empty());
                                value = String.join(",",
                                        stream.map(o -> String.valueOf(o))
                                                .collect(Collectors.toList()));
                            }
                        } else {
                            if (propertyDefinition.getPropertyType().equals(PropertyType.DATETIME)) {
                                value = dateFormat.format(((Calendar) propertyValue.get()).getTime());
                            } else if (propertyDefinition.getPropertyType().equals(PropertyType.BOOLEAN)) {
                                value = (Boolean) propertyValue.get() ? "SI" : "NO";
                            } else {
                                value = String.valueOf(propertyValue.get());
                            }
                        }
                    }
                    row.createCell(column.getAndIncrement()).setCellValue(value);
                });
        if (Optional.ofNullable(callObject.<Boolean>getPropertyValue(PAGOPAPropertyIds.CALL_PAGAMENTO_PAGOPA.value())).orElse(Boolean.FALSE)){
            row.createCell(column.getAndIncrement()).setCellValue(
                    Optional.ofNullable(applicationObject.<BigInteger>getPropertyValue(PAGOPAPropertyIds.APPLICATION_NUMERO_PROTOCOLLO_PAGOPA.value()))
                            .map(String::valueOf)
                            .map(s -> pagopaService.getStatoPendenza(s))
                            .orElse("INDETERMINATA")
            );
        }
    }

    private void getRecordCSVForPunteggi(Session session, Folder callObject, Folder applicationObject, CMISUser user, String contexURL, HSSFSheet sheet, int index) {
        final AtomicInteger column = new AtomicInteger();
        HSSFRow row = sheet.createRow(index);
        createCellString(row, column.getAndIncrement()).setCellValue(applicationObject.getId());
        createCellString(row, column.getAndIncrement()).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:cognome").toUpperCase());
        createCellString(row, column.getAndIncrement()).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:nome").toUpperCase());
        createCellString(row, column.getAndIncrement()).setCellValue(
                Optional.ofNullable(applicationObject.getProperty("jconon_application:data_nascita").getValue())
                        .map(map -> dateFormat.format(((Calendar) map).getTime())).orElse(""));
        createCellString(row, column.getAndIncrement()).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:codice_fiscale"));
        createCellString(row, column.getAndIncrement()).setCellValue(
                Optional.ofNullable(applicationObject.<String>getPropertyValue("jconon_application:email_comunicazioni"))
                        .filter(s -> !s.isEmpty()).orElse(user.getEmail())
        );
        createCellString(row, column.getAndIncrement()).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:email_pec_comunicazioni"));
        createCellString(row, column.getAndIncrement()).setCellValue(
                Optional.ofNullable(applicationObject.<String>getPropertyValue("jconon_application:esclusione_rinuncia"))
                        .map(x -> StatoDomanda.fromValue(x).displayValue())
                        .orElse(StatoDomanda.fromValue(applicationObject.getPropertyValue("jconon_application:stato_domanda")).displayValue())
        );

        Optional.ofNullable(callObject.<String>getPropertyValue(JCONON_CALL_PUNTEGGIO_1))
                .filter(s1 -> !s1.equalsIgnoreCase(VUOTO))
                .ifPresent(s1 -> {
                    createCellNumeric(row, column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(applicationObject.<String>getPropertyValue(JCONON_APPLICATION_PUNTEGGIO_TITOLI)).orElse(null)
                    );
                });
        Optional.ofNullable(callObject.<String>getPropertyValue(JCONON_CALL_PUNTEGGIO_2))
                .filter(s1 -> !s1.equalsIgnoreCase(VUOTO))
                .ifPresent(s1 -> {
                    createCellNumeric(row, column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(applicationObject.<String>getPropertyValue(JCONON_APPLICATION_PUNTEGGIO_SCRITTO)).orElse(null)
                    );
                });
        Optional.ofNullable(callObject.<String>getPropertyValue(JCONON_CALL_PUNTEGGIO_3))
                .filter(s1 -> !s1.equalsIgnoreCase(VUOTO))
                .ifPresent(s1 -> {
                    createCellNumeric(row, column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(applicationObject.<String>getPropertyValue(JCONON_APPLICATION_PUNTEGGIO_SECONDO_SCRITTO)).orElse(null)
                    );
                });
        Optional.ofNullable(callObject.<String>getPropertyValue(JCONON_CALL_PUNTEGGIO_4))
                .filter(s1 -> !s1.equalsIgnoreCase(VUOTO))
                .ifPresent(s1 -> {
                    createCellNumeric(row, column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(applicationObject.<String>getPropertyValue(JCONON_APPLICATION_PUNTEGGIO_COLLOQUIO)).orElse(null)
                    );
                });
        Optional.ofNullable(callObject.<String>getPropertyValue(JCONON_CALL_PUNTEGGIO_5))
                .filter(s1 -> !s1.equalsIgnoreCase(VUOTO))
                .ifPresent(s1 -> {
                    createCellNumeric(row, column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(applicationObject.<String>getPropertyValue(JCONON_APPLICATION_PUNTEGGIO_PROVA_PRATICA)).orElse(null)
                    );
                });
        Optional.ofNullable(callObject.<String>getPropertyValue(JCONON_CALL_PUNTEGGIO_6))
                .filter(s1 -> !s1.equalsIgnoreCase(VUOTO))
                .ifPresent(s1 -> {
                    createCellNumeric(row, column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(applicationObject.<String>getPropertyValue(JCONON_APPLICATION_PUNTEGGIO_6)).orElse(null)
                    );
                });
        Optional.ofNullable(callObject.<String>getPropertyValue(JCONON_CALL_PUNTEGGIO_7))
                .filter(s1 -> !s1.equalsIgnoreCase(VUOTO))
                .ifPresent(s1 -> {
                    createCellNumeric(row, column.getAndIncrement()).setCellValue(
                            Optional.ofNullable(applicationObject.<String>getPropertyValue(JCONON_APPLICATION_PUNTEGGIO_7)).orElse(null)
                    );
                });

        createCellNumeric(row, column.getAndIncrement()).setCellValue(
                Optional.ofNullable(applicationObject.<BigDecimal>getPropertyValue(JCONONPropertyIds.APPLICATION_TOTALE_PUNTEGGIO.value()))
                        .map(bigDecimal -> {
                            return NumberFormat.getNumberInstance(Locale.ITALIAN).format(bigDecimal);
                        })
                        .orElse(null));
        createCellNumeric(row, column.getAndIncrement()).setCellValue(
                Optional.ofNullable(applicationObject.<BigInteger>getPropertyValue(JCONONPropertyIds.APPLICATION_GRADUATORIA.value()))
                        .map(bigInteger -> {
                            return String.valueOf(bigInteger);
                        })
                        .orElse(null));
        createCellString(row, column.getAndIncrement()).setCellValue(applicationObject.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_ESITO_CALL.value()));
        createCellString(row, column.getAndIncrement()).setCellValue(applicationObject.<String>getPropertyValue("jconon_application:punteggio_note"));

        createCellString(row, column.getAndIncrement()).setCellValue(
                Optional.ofNullable(applicationObject.getProperty("jconon_application:protocollo_data_graduatoria").getValue())
                        .map(map -> dateFormat.format(((Calendar) map).getTime())).orElse(""));

        createCellString(row, column.getAndIncrement()).setCellValue(
                Optional.ofNullable(applicationObject.<String>getPropertyValue("jconon_application:protocollo_numero_graduatoria"))
                        .orElse(""));
        createCellString(row, column.getAndIncrement()).setCellValue(
                Optional.ofNullable(applicationObject.getProperty("jconon_application:protocollo_data_assunzione_idoneo").getValue())
                        .map(map -> dateFormat.format(((Calendar) map).getTime())).orElse(""));

        createCellString(row, column.getAndIncrement()).setCellValue(
                Optional.ofNullable(applicationObject.<String>getPropertyValue("jconon_application:protocollo_numero_assunzione_idoneo"))
                        .orElse(""));
    }

    public BigDecimal formatPunteggio(String punteggio) {
        return Optional.ofNullable(punteggio)
                .filter(s -> s.length() > 0)
                .map(s -> {
                    try {
                        return NumberFormat.getNumberInstance(Locale.ITALIAN).parse(s.replace('.', ','));
                    } catch (ParseException e) {
                        throw new ClientMessageException("Errore di formattazione per " + punteggio);
                    }
                })
                .map(aDouble -> BigDecimal.valueOf(aDouble.doubleValue()))
                .orElse(BigDecimal.ZERO);
    }

    private HSSFCell createCellString(HSSFRow row, int index) {
        HSSFCell cell = row.createCell(index);
        cell.setCellType(Cell.CELL_TYPE_STRING);
        return cell;
    }

    private HSSFCell createCellNumeric(HSSFRow row, int index) {
        HSSFCell cell = row.createCell(index);
        cell.setCellType(Cell.CELL_TYPE_NUMERIC);
        return cell;
    }

    protected HSSFWorkbook createHSSFWorkbook(List<String> head, String sheetName) {
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet(sheetName);
        HSSFRow headRow = sheet.createRow(0);
        headRow.setHeight((short) 500);
        HSSFCellStyle headStyle = wb.createCellStyle();
        headStyle.setAlignment(HorizontalAlignment.CENTER);
        headStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        headStyle.setBorderBottom(BorderStyle.THIN);
        headStyle.setBorderRight(BorderStyle.THIN);
        headStyle.setBorderLeft(BorderStyle.THIN);
        headStyle.setBorderTop(BorderStyle.THIN);
        headStyle.setLocked(true);
        HSSFFont font = wb.createFont();
        font.setBold(true);
        headStyle.setFont(font);
        for (int i = 0; i < head.size(); i++) {
            HSSFCell cell = headRow.createCell(i);
            cell.setCellStyle(headStyle);
            cell.setCellValue(head.get(i));
        }
        return wb;
    }


    protected HSSFWorkbook createHSSFWorkbook(List<String> head) {
        return createHSSFWorkbook(head, SHEET_DOMANDE);
    }

    protected Document createXLSDocument(Session session, HSSFWorkbook wb, String userId) throws IOException {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        wb.write(stream);
        ContentStreamImpl contentStream = new ContentStreamImpl();
        contentStream.setMimeType("application/vnd.ms-excel");
        contentStream.setStream(new ByteArrayInputStream(stream.toByteArray()));
        Map<String, Object> properties = new HashMap<String, Object>();
        properties.put(PropertyIds.NAME, UUID.randomUUID().toString().concat("-").concat(wb.getSheetAt(0).getSheetName()).concat(".xls"));
        properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
        Folder userHomeFolder = (Folder) session.getObject(userService.loadUserForConfirm(userId).getHomeFolder());
        return userHomeFolder.createDocument(properties, contentStream, VersioningState.MAJOR);
    }

    public Map<String, Object> extractionApplicationForSingleCall(Session session, String query, String contexURL, String userId) throws IOException {
        Map<String, Object> model = new HashMap<String, Object>();
        HSSFWorkbook wb = createHSSFWorkbook(headCSVApplication);
        HSSFSheet sheet = wb.getSheet(SHEET_DOMANDE);
        int index = 1;
        Folder callObject = null;
        ItemIterable<QueryResult> applications = session.query(query, false);
        for (QueryResult application : applications.getPage(Integer.MAX_VALUE)) {
            Folder applicationObject = (Folder) session.getObject(String.valueOf(application.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue()));
            callObject = (Folder) session.getObject(applicationObject.getParentId());
            CMISUser user = userService.loadUserForConfirm(applicationObject.getPropertyValue("jconon_application:user"));
            getRecordCSV(session, callObject, applicationObject, user, contexURL, sheet, index++);
        }
        autoSizeColumns(wb);
        Document doc = createXLSDocument(session, wb, userId);
        model.put("objectId", doc.getId());
        model.put("nameBando", competitionService.getCallName(callObject));
        return model;
    }

    private void addHeaderPunteggi(Folder callObject, Map<String, PropertyDefinition<?>> propertyDefinitions, List<String> columns, String propertyName) {
        Optional.ofNullable(callObject.<String>getPropertyValue(propertyName))
                .filter(s1 -> !s1.equalsIgnoreCase(VUOTO))
                .ifPresent(s1 -> {
                    final String min = Optional.ofNullable(callObject.<String>getPropertyValue(propertyName.concat("_min"))).orElse("");
                    final String max = Optional.ofNullable(callObject.<String>getPropertyValue(propertyName.concat("_limite"))).orElse("");
                    columns.add(s1 + " Min: " + min + " Max: " + max);
                });
    }

    public Map<String, Object> extractionApplicationForPunteggi(Session session, String callId, String contexURL, String userId) throws IOException {
        Map<String, Object> model = new HashMap<String, Object>();
        List<String> columns = new ArrayList<>();
        columns.addAll(headCSVPunteggi);
        int[] idx = {1};
        final Map<String, PropertyDefinition<?>> propertyDefinitions = session.getTypeDefinition("P:jconon_call:aspect_punteggi").getPropertyDefinitions();
        Folder call = Optional.ofNullable(session.getObject(callId))
                .filter(Folder.class::isInstance)
                .map(Folder.class::cast)
                .orElseThrow(() -> new ClientMessageException("Bando non trovato!"));
        addHeaderPunteggi(call, propertyDefinitions, columns, JCONON_CALL_PUNTEGGIO_1);
        addHeaderPunteggi(call, propertyDefinitions, columns, JCONON_CALL_PUNTEGGIO_2);
        addHeaderPunteggi(call, propertyDefinitions, columns, JCONON_CALL_PUNTEGGIO_3);
        addHeaderPunteggi(call, propertyDefinitions, columns, JCONON_CALL_PUNTEGGIO_4);
        addHeaderPunteggi(call, propertyDefinitions, columns, JCONON_CALL_PUNTEGGIO_5);
        addHeaderPunteggi(call, propertyDefinitions, columns, JCONON_CALL_PUNTEGGIO_6);
        addHeaderPunteggi(call, propertyDefinitions, columns, JCONON_CALL_PUNTEGGIO_7);
        columns.add("Totale Punteggi");
        columns.add("Graduatoria");
        columns.add("Esito");
        columns.add("Note");
        columns.add("Data Protocollo Graduatoria");
        columns.add("Numero Protocollo Graduatoria");
        columns.add("Data Protocollo Assunzione Idoneo");
        columns.add("Numero Protocollo Assunzione Idoneo");

        HSSFWorkbook wb = createHSSFWorkbook(columns);
        final HSSFSheet sheet = wb.getSheet(SHEET_DOMANDE);
        sheet.setColumnHidden(0, true);
        List<CmisObject> applications = new ArrayList<>();

        Criteria criteriaApplication = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        Criteria criteriaPunteggi = criteriaApplication.createCriteria(
                JCONONPolicyType.JCONON_APPLICATION_PUNTEGGI.queryName());
        criteriaPunteggi.addJoinCriterion(Restrictions.eqProperty(
                criteriaApplication.prefix(PropertyIds.OBJECT_ID),
                criteriaPunteggi.prefix(PropertyIds.OBJECT_ID)));
        criteriaApplication.addColumn(PropertyIds.OBJECT_ID);
        criteriaApplication.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue()));
        criteriaApplication.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        criteriaApplication.add(Restrictions.inTree(callId));
        ItemIterable<QueryResult> iterablePunteggi = criteriaApplication.executeQuery(session, false, session.getDefaultContext());
        final int maxItemsPerPage = session.getDefaultContext().getMaxItemsPerPage();
        int skipTo = 0;
        do {
            iterablePunteggi = iterablePunteggi.skipTo(skipTo).getPage(maxItemsPerPage);
            for (QueryResult queryResult : iterablePunteggi) {
                final String propertyValueById = queryResult.<String>getPropertyValueById(PropertyIds.OBJECT_ID);
                LOGGER.info("Estrazione punteggi domanda: {} Totale domande: {}", propertyValueById, applications.size());
                applications.add(session.getObject(propertyValueById));
            }
            skipTo = skipTo + maxItemsPerPage;
        } while (iterablePunteggi.getHasMoreItems());
        applications.stream()
                .filter(Folder.class::isInstance)
                .map(Folder.class::cast)
                .filter(folder -> folder.getType().getId().equalsIgnoreCase(JCONONFolderType.JCONON_APPLICATION.value()))
                .filter(folder -> folder.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(StatoDomanda.CONFERMATA.getValue()))
                .sorted(Comparator.comparing(folder -> Optional.ofNullable(folder.<BigInteger>getPropertyValue(JCONONPropertyIds.APPLICATION_GRADUATORIA.value()))
                        .orElse(BigInteger.valueOf(Integer.MAX_VALUE))))
                .forEach(folder -> {
                    final String userApplicationId = folder.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value());
                    CMISUser user = null;
                    try {
                        user = userService.loadUserForConfirm(userApplicationId);
                    } catch (CoolUserFactoryException _ex) {
                        LOGGER.error("USER {} not found", userId, _ex);
                        user = new CMISUser(userId);
                    }
                    LOGGER.info("Estrazione punteggi riga: {}", idx[0]);
                    getRecordCSVForPunteggi(session, call, folder, user, contexURL, sheet, idx[0]++);
                });

        autoSizeColumns(wb);
        Document doc = createXLSDocument(session, wb, userId);
        model.put("objectId", doc.getId());
        model.put("nameBando", competitionService.getCallName(call));
        return model;
    }

    protected void autoSizeColumns(HSSFWorkbook workbook) {
        int numberOfSheets = workbook.getNumberOfSheets();
        HSSFCellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setAlignment(HorizontalAlignment.LEFT);
        cellStyle.setBorderBottom(BorderStyle.THIN);
        cellStyle.setBorderRight(BorderStyle.THIN);
        cellStyle.setBorderLeft(BorderStyle.THIN);
        cellStyle.setBorderTop(BorderStyle.THIN);
        for (int i = 0; i < numberOfSheets; i++) {
            List<Integer> columnAlredySize = new ArrayList<>();
            HSSFSheet sheet = workbook.getSheetAt(i);
            if (sheet.getPhysicalNumberOfRows() > 0) {
                int indexRow = 0;
                for (Iterator<Row> iterator = sheet.rowIterator(); iterator.hasNext(); ) {
                    Row row = iterator.next();
                    Iterator<Cell> cellIterator = row.cellIterator();
                    while (cellIterator.hasNext()) {
                        Cell cell = cellIterator.next();
                        if (indexRow != 0)
                            cell.setCellStyle(cellStyle);
                        int columnIndex = cell.getColumnIndex();
                        if (!columnAlredySize.contains(columnIndex)) {
                            sheet.autoSizeColumn(columnIndex);
                            columnAlredySize.add(columnIndex);
                        }
                    }
                    indexRow++;
                }
            }
        }
    }

    public void addProtocolToApplication(Document doc, long numProtocollo, Date dataProtocollo) throws IOException {
        PDDocument pdoc = PDDocument.load(doc.getContentStream().getStream());
        PDPage page = pdoc.getDocumentCatalog().getPages().get(0);
        PDRectangle pageSize = page.getMediaBox();
        PDFont pdfFont = PDType1Font.TIMES_BOLD;
        float x = 410, y = 790, w = 150, h = 35, a = 15, lineWith = new Float(0.5);
        String numeroProtocollo = "N. " + String.format("%7s", numProtocollo).replace(' ', '0');
        String dataProtocolloFormat = new SimpleDateFormat("dd/MM/yyyy").format(dataProtocollo);

        PDPageContentStream content = new PDPageContentStream(pdoc, page, AppendMode.APPEND, true, true);
        content.addRect(pageSize.getLowerLeftX() + x, pageSize.getLowerLeftY() + y, w, h);
        content.setNonStrokingColor(Color.WHITE);
        content.fill();

        //Linea superiore
        content.addRect(pageSize.getLowerLeftX() + x, pageSize.getLowerLeftY() + y + h, w, lineWith);
        //Linea Inferiore
        content.addRect(pageSize.getLowerLeftX() + x, pageSize.getLowerLeftY() + y, w, lineWith);
        //Linea Sinistra
        content.addRect(pageSize.getLowerLeftX() + x, pageSize.getLowerLeftY() + y, lineWith, h);
        //Linea Destra
        content.addRect(pageSize.getLowerLeftX() + x + w, pageSize.getLowerLeftY() + y, lineWith, h);
        //Linea Orizzontale per testo Tipo protocollo
        content.addRect(pageSize.getLowerLeftX() + x, pageSize.getLowerLeftY() + y + h - a, w, lineWith);
        //Linea verticale centrale
        content.addRect(pageSize.getLowerLeftX() + x + (w / 2), pageSize.getLowerLeftY() + y, lineWith, (h - a));

        content.setNonStrokingColor(Color.BLACK);
        content.fill();

        content.beginText();
        content.setFont(pdfFont, 10);
        content.newLineAtOffset(pageSize.getLowerLeftX() + x + 40, pageSize.getLowerLeftY() + y + h - 10);
        content.showText(protocolNamespace);
        content.setNonStrokingColor(Color.BLACK);
        content.endText();

        //Numero Protocollo
        content.beginText();
        content.setFont(pdfFont, 14);
        content.newLineAtOffset(pageSize.getLowerLeftX() + x + 5, pageSize.getLowerLeftY() + y + h - 30);
        content.showText(numeroProtocollo);
        content.setNonStrokingColor(Color.BLACK);
        content.endText();

        //Data Protocollo
        content.beginText();
        content.setFont(pdfFont, 14);
        content.newLineAtOffset(pageSize.getLowerLeftX() + x + (w / 2) + 5, pageSize.getLowerLeftY() + y + h - 30);
        content.showText(dataProtocolloFormat);
        content.setNonStrokingColor(Color.BLACK);
        content.endText();

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            BitMatrix bitMatrix = new Code39Writer().encode(numeroProtocollo + "-" + dataProtocolloFormat, BarcodeFormat.CODE_39, 150, 15, null);
            MatrixToImageWriter.writeToStream(bitMatrix, "jpg", out);
            PDImageXObject ximage = JPEGFactory.createFromStream(pdoc, new ByteArrayInputStream(out.toByteArray()));
            content.drawImage(ximage, x, y - h + 20, 150, 15);
        } catch (WriterException e) {
            LOGGER.error("Cannot write barcode", e);
        }
        content.close();

        ByteArrayOutputStream outFile = new ByteArrayOutputStream();
        pdoc.save(outFile);
        pdoc.close();

        ContentStreamImpl contentStream = new ContentStreamImpl();
        contentStream.setStream(new ByteArrayInputStream(outFile.toByteArray()));
        contentStream.setMimeType(doc.getContentStreamMimeType());
        contentStream.setFileName(doc.getContentStreamFileName());

        doc.setContentStream(contentStream, true, true);
    }

    public void schedeNonAnonime(PrintParameterModel item) {
        final Session adminSession = cmisService.createAdminSession();
        final String idCall = Optional.ofNullable(item.getIds())
                .map(List::stream)
                .map(Stream::findFirst)
                .orElseThrow(() -> new ClientMessageException("ID CALL NOT FOUND"))
                .orElseThrow(() -> new ClientMessageException("ID CALL NOT FOUND"));
        final String callCodice = adminSession.getObject(idCall).getPropertyValue(JCONONPropertyIds.CALL_CODICE.value());

        String messageBody = schedeNonAnonime(adminSession, idCall, item.getContextURL());
        EmailMessage message = new EmailMessage();
        message.setBody("<b>Il processo di controllo delle schede anonime relative al bando " + callCodice + " è terminato.</b><br>" + messageBody);
        message.setHtmlBody(true);
        message.setSubject(i18nService.getLabel("subject-info", Locale.ITALIAN) +
                "Controllo delle schede anonime - " +
                callCodice);
        message.setRecipients(Arrays.asList(item.getIndirizzoEmail()));
        mailService.send(message);
    }

    public String schedeNonAnonime(Session adminSession, String idCall, String contextURL) {
        final StringBuffer message = new StringBuffer();
        Criteria criteriaApplications = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
        criteriaApplications.add(Restrictions.inFolder(idCall));
        criteriaApplications.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), StatoDomanda.CONFERMATA.getValue()));
        criteriaApplications.add(Restrictions.isNull(JCONONPropertyIds.APPLICATION_ESCLUSIONE_RINUNCIA.value()));
        ItemIterable<QueryResult> attive = criteriaApplications.executeQuery(adminSession, false, adminSession.getDefaultContext());
        for (QueryResult domanda : attive.getPage(Integer.MAX_VALUE)) {
            Folder applicationFolder = Optional.ofNullable(
                            adminSession.getObject(domanda.<String>getPropertyValueById(PropertyIds.OBJECT_ID))
                    ).filter(Folder.class::isInstance)
                    .map(Folder.class::cast)
                    .orElse(null);
            if (Optional.ofNullable(applicationFolder).isPresent()) {
                StreamSupport.stream(applicationFolder.getChildren().spliterator(), false)
                        .filter(cmisObject -> cmisObject.getType().getParentType()
                                .getId().equalsIgnoreCase(JCONONDocumentType.JCONON_ATTACHMENT_SCHEDA_ANONIMA.value()))
                        .filter(Document.class::isInstance)
                        .map(Document.class::cast)
                        .forEach(document -> {
                            PDDocument pdDocument = null;
                            try {
                                final Optional<InputStream> inputStream =
                                        Optional.ofNullable(document)
                                                .flatMap(document1 -> Optional.ofNullable(document1.getContentStream()))
                                                .flatMap(contentStream -> Optional.ofNullable(contentStream.getStream()));
                                if (inputStream.isPresent()) {
                                    pdDocument = PDDocument.load(inputStream.get());
                                    PDFTextStripper printer = new PDFTextStripper();
                                    final Optional<String> text = Optional.ofNullable(printer.getText(pdDocument));
                                    if (text.isPresent()) {
                                        final String cognome = applicationFolder.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value()).toLowerCase();
                                        final String nome = applicationFolder.<String>getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value()).toLowerCase();
                                        final int indiceCognome = text.get().toLowerCase().indexOf(cognome);
                                        final int indiceNome = text.get().toLowerCase().indexOf(nome);

                                        if (indiceCognome != -1 || indiceNome != -1) {
                                            if (message.length() == 0) {
                                                message.append("<ol>");
                                            }
                                            message.append("<li>");
                                            message.append("<p><b>" + applicationFolder.<String>getPropertyValue(PropertyIds.NAME) + "</b></p>");
                                            message.append(
                                                    "<p><b style=\"color:red\">[" +
                                                            getTextFragment(text.get(), indiceCognome, indiceNome, cognome.length(), nome.length(), 40)
                                                            + "]</b></p>"
                                            );
                                            message.append("<p>È possibile scaricare il file dal seguente <a href=\"" + contextURL + "/rest/content?fileName=scheda-anonima.pdf&nodeRef=" + document.getId() + "\">link</a></p>");
                                            message.append("</li>");
                                            LOGGER.info("Testo cercato {} {} in {}", cognome, nome, text.get());
                                        }
                                    }
                                } else {
                                    LOGGER.error("SCHEDE NON ANONIME STREAM NUll id:{} name:{}", document.getId(), document.getName());
                                }
                            } catch (IOException e) {
                                LOGGER.error("SCHEDE NON ANONIME CANNOT LOAD PDF DOCUMENT", e);
                            } finally {
                                Optional.ofNullable(pdDocument)
                                        .ifPresent(pdDocument1 -> {
                                            try {
                                                pdDocument1.close();
                                            } catch (IOException e) {
                                                LOGGER.error("SCHEDE NON ANONIME CANNOT LOAD PDF DOCUMENT", e);
                                            }
                                        });
                            }
                        });
            }
        }
        return Optional.ofNullable(message)
                .filter(stringBuffer -> stringBuffer.length() > 0)
                .map(StringBuffer::toString)
                .map(s -> s.concat("</ol>"))
                .orElse("<p><b>Nessun risultato trovato.</b></p>");
    }

    public String getTextFragment(String text, int indice1, int indice2, int length1, int length2, int iFragment) {
        String result = "";
        if (indice1 != -1) {
            String first = text.substring(Math.max(0, indice1 - iFragment), Math.min(text.length(), indice1));
            String middle = "<u>" + text.substring(indice1, Math.min(indice1 + length1, text.length())) + "</u>";
            String last = text.substring(indice1 + length1, Math.min(text.length(), indice1 + iFragment));
            result += "..." + first + middle + last + "...";
        }
        if (indice2 != -1) {
            String first = text.substring(Math.max(0, indice2 - iFragment), Math.min(text.length(), indice2));
            String middle = "<u>" + text.substring(indice2, Math.min(indice2 + length2, text.length())) + "</u>";
            String last = text.substring(indice2 + length2, Math.min(text.length(), indice2 + iFragment));
            result += "..." + first + middle + last + "...";
        }
        return result;
    }

    @Bean
    public JasperFillManager jasperFillManager() {
        return JasperFillManager.getInstance(jasperReportsContext());
    }

    @Bean
    public JasperReportsContext jasperReportsContext() {
        DefaultJasperReportsContext defaultJasperReportsContext = DefaultJasperReportsContext.getInstance();
        return new CacheAwareJasperReportsContext(defaultJasperReportsContext);
    }

    @Bean
    public JasperCompileManager jasperCompileManager() {
        return JasperCompileManager.getInstance(jasperReportsContext());
    }

    protected enum Dichiarazioni {
        dichiarazioni, datiCNR, ulterioriDati,sezione4,sezione5
    }

    class CacheAwareJasperReportsContext implements JasperReportsContext {

        private final JasperReportsContext jasperReportsContext;

        public CacheAwareJasperReportsContext(JasperReportsContext jasperReportsContext) {
            this.jasperReportsContext = jasperReportsContext;
        }

        @Override
        public Object getValue(String key) {
            return jasperReportsContext.getValue(key);
        }

        @Override
        public Object getOwnValue(String key) {
            return jasperReportsContext.getOwnValue(key);
        }

        @Override
        public void setValue(String key, Object value) {
            jasperReportsContext.setValue(key, value);
        }

        @Override
        public <T> List<T> getExtensions(Class<T> extensionType) {
            if (extensionType.isAssignableFrom(RepositoryService.class)) {
                return (List<T>) Arrays.asList(new CacheAwareRepositoryService());
            } else {
                return jasperReportsContext.getExtensions(extensionType).stream().distinct().collect(Collectors.toList());
            }
        }

        @Override
        public String getProperty(String key) {
            return jasperReportsContext.getProperty(key);
        }

        @Override
        public void setProperty(String key, String value) {
            jasperReportsContext.setProperty(key, value);

        }

        @Override
        public void removeProperty(String key) {
            jasperReportsContext.removeProperty(key);
        }

        @Override
        public Map<String, String> getProperties() {
            return jasperReportsContext.getProperties();
        }
    }

    class CacheAwareRepositoryService implements RepositoryService {

        @Override
        public Resource getResource(String uri) {
            throw new NotImplementedException("unable to get resource " + uri);
        }

        @Override
        public void saveResource(String uri, Resource resource) {
            throw new NotImplementedException("cannot save resource " + uri + " " + resource.getName());
        }

        @Override
        public <K extends Resource> K getResource(String uri, Class<K> resourceType) {

            if (resourceType.isAssignableFrom(ReportResource.class)) {
                ReportResource reportResource = new ReportResource();
                JasperReport report = cacheRepository.jasperSubReport(uri, jasperCompileManager());
                reportResource.setReport(report);
                return (K) reportResource;
            } else if (resourceType.isAssignableFrom(InputStreamResource.class)) {
                InputStreamResource inputStreamResource = new InputStreamResource();
                byte[] bytes = cacheRepository.imageReport(uri);
                InputStream inputStream = new ByteArrayInputStream(bytes);
                inputStreamResource.setInputStream(inputStream);
                return (K) inputStreamResource;
            }

            throw new NotImplementedException("unable to serve resource " + uri + " of type " + resourceType.getCanonicalName());
        }
    }
}