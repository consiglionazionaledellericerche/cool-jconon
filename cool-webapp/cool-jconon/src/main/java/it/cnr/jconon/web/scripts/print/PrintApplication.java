package it.cnr.jconon.web.scripts.print;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeVersionService;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.AttachmentBean;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.service.JMSService;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.scripts.CMISWebScript;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.service.application.ApplicationService;
import it.cnr.jconon.web.scripts.model.ApplicationModel;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.StringWriter;
import java.lang.reflect.Type;
import java.math.BigInteger;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;
import javax.servlet.http.HttpSession;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JsonDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRPdfExporterParameter;
import net.sf.jasperreports.engine.fill.JRGzipVirtualizer;

import org.alfresco.cmis.client.AlfrescoDocument;
import org.alfresco.cmis.client.AlfrescoFolder;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisStreamNotSupportedException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ModelObjectService;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.surf.util.I18NUtil;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Container;
import org.springframework.extensions.webscripts.MessageMethod;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class PrintApplication extends CMISWebScript {
	private static final Logger LOGGER = LoggerFactory.getLogger(PrintApplication.class);
	@Autowired
	private CMISService cmisService;
	@Autowired
	private UserService userService;
	@Autowired
	private MailService mailService;
	@Autowired
	private ApplicationService applicationService;
	@Autowired
	private BulkInfoCoolService bulkInfoService;

	@Autowired
	private NodeVersionService nodeVersionService;

	@Autowired
	private JMSService jmsQueueA;

	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req,
			Status status, Cache cache) {
		Map<String, Object> model = super.executeImpl(req, status, cache);
		String nodeRef = req.getParameter("nodeRef");
		/**
		 * Controllo se lo User collegato ha l'accesso alla domanda
		 */
		Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
		criteria.addColumn(PropertyIds.OBJECT_ID);
		criteria.add(Restrictions.eq(PropertyIds.OBJECT_ID, nodeRef));
		HttpSession session = ServletUtil.getSession(false);
		Session cmisSession = cmisService.getCurrentCMISSession(session );
		ItemIterable<QueryResult> queryResults = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
		if (queryResults.getTotalNumItems() == 0) {
			throw new ClientMessageException("message.access.denieded");
		}
		final Map<String, Object> mailModel = new HashMap<String, Object>();
		mailModel.putAll(model);
		mailModel.put("url", getURLHelper());
		mailModel.put("serverPath", getServerPath());
		mailModel.put("message", new MessageMethod(this));
		final ModelObjectService modelObjectService = ThreadLocalRequestContext.getRequestContext().getObjectService();
		final Container container = getContainer();
		final String contextURL = req.getServerPath() + ThreadLocalRequestContext.getRequestContext().getContextPath();
	
		jmsQueueA.sendRecvAsync(nodeRef, new MessageListener() {
			@Override
			public void onMessage(Message arg0) {
				String nodeRef = null;
				try {
					ObjectMessage objMessage = (ObjectMessage)arg0;
					nodeRef = (String) objMessage.getObject();
					LOGGER.info("Start print application width id: " + nodeRef);

					Session cmisSession = cmisService.createAdminSession();
					Folder application = (Folder) cmisSession.getObject(nodeRef);
					Folder call = (Folder) cmisSession.getObject(application.getParentId());
					application.refresh();
					CMISUser applicationUser;
					try {
						applicationUser = userService.loadUserForConfirm(
								(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
					} catch (CoolUserFactoryException e) {
						throw new ClientMessageException("User not found");
					}
					String nameRicevutaReportModel = applicationService.getNameRicevutaReportModel(cmisSession, application);
					byte[] stampaByte = getRicevutaReportModel(cmisSession,
							application, container, modelObjectService,
							contextURL);
					InputStream is = new ByteArrayInputStream(stampaByte);
					archiviaRicevutaReportModel(cmisSession, application, is, nameRicevutaReportModel, false);
					/**
					 * Spedisco la mail con la stampa allegata
					 */
					final StringWriter htmlWriter = new StringWriter();
					mailModel.put("folder", application);
					mailModel.put("call", call);
					getFreemarkerTemplateProcessor().process("/pages/application/application.print.html.ftl",
							mailModel, htmlWriter);
					EmailMessage message = new EmailMessage();
					List<String> emailList = new ArrayList<String>(), emailBccList = new ArrayList<String>();
					emailList.add(applicationUser.getEmail());
					mailModel.put("email_comunicazione", applicationUser.getEmail());
					message.setRecipients(emailList);
					if (emailBccList.isEmpty()) {
						message.setBccRecipients(emailBccList);
					}
					message.setSubject("[concorsi] " + I18NUtil.getMessage("subject-print-domanda",call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())));
					message.setBody(htmlWriter.getBuffer());

					message.setAttachments(Arrays.asList(new AttachmentBean(nameRicevutaReportModel, stampaByte)));
					mailService.send(message);

					if (LOGGER.isInfoEnabled())
						LOGGER.info("End print application width id: " + nodeRef);
				} catch(Exception t) {
					LOGGER.error("Error while print application width id:" + nodeRef, t);
				}
			}
		});
		model.put("esito", true);
		return model;
	}


	public byte[] getRicevutaReportModel(Folder domanda, Container container, ModelObjectService modelObjectService,
			String contextURL)
					throws WebScriptException {
		Session cmisSession = cmisService.createAdminSession();
		return getRicevutaReportModel(cmisSession, domanda, container, modelObjectService, contextURL);
	}

	public String findAttachmentId(Session cmisSession, Folder source, JCONONDocumentType documentType){
		Criteria criteria = CriteriaFactory.createCriteria(documentType.queryName());
		criteria.addColumn(PropertyIds.OBJECT_ID);
		criteria.addColumn(PropertyIds.NAME);
		criteria.add(Restrictions.inFolder(source.getId()));
		ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
		for (QueryResult queryResult : iterable) {
			return queryResult.getPropertyValueById(PropertyIds.OBJECT_ID);
		}
		return null;
	}

	public String findDocRiconoscimentoId(Session cmisSession, Folder source){
		return findAttachmentId(cmisSession, source, JCONONDocumentType.JCONON_ATTACHMENT_DOCUMENTO_RICONOSCIMENTO);
	}

	public String findCurriculumId(Session cmisSession, Folder source){
		return findAttachmentId(cmisSession, source, JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE);
	}

	public String findRicevutaApplicationId(Session cmisSession, Folder source){
		return findAttachmentId(cmisSession, source, JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION);
	}

	// TODO refactor (and reindent)
	@SuppressWarnings({ "deprecation", "unchecked" })
	public byte[] getRicevutaReportModel(Session cmisSession, Folder application, Container container,
			ModelObjectService modelObjectService, String contextURL)
					throws WebScriptException {
		Folder call = application.getFolderParent();
		ApplicationModel applicationModel = new ApplicationModel(application,
				cmisSession.getDefaultContext(),
				getMessages("GET",
						"manage-application", container, modelObjectService),
						contextURL);
		try {
			CMISUser applicationUser = userService.loadUserForConfirm((String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
			applicationModel.getProperties().put("jasperReport:user_matricola", applicationUser.getMatricola());
			applicationModel.getProperties().put("jasperReport:user_email_comunicazione", applicationUser.getEmail());
			//					((CMISUser)ThreadLocalRequestContext.getRequestContext().getUser()).getEmail());
		} catch (CoolUserFactoryException e) {
			LOGGER.error("User not found", e);
			applicationModel.getProperties().put("jasperReport:user_matricola",((CMISUser)ThreadLocalRequestContext.getRequestContext().getUser()).getMatricola());
			applicationModel.getProperties().put("jasperReport:user_email_comunicazione",((CMISUser)ThreadLocalRequestContext.getRequestContext().getUser()).getEmail());
		}

		final Gson gson = new GsonBuilder()
		.setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
		.excludeFieldsWithoutExposeAnnotation()
		.registerTypeAdapter(GregorianCalendar.class, new JsonSerializer<GregorianCalendar>() {
			@Override
			public JsonElement serialize(GregorianCalendar src, Type typeOfSrc,
					JsonSerializationContext context) {
				return  context.serialize(src.getTime());
			}
		}).create();
		if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS.value()) != null) {
			applicationModel
			.getProperties()
			.put("allegati",
					applicationService
					.getAllegati(
							((List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS.value())),
							(AlfrescoFolder) application,
							JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT,
							cmisSession, applicationModel));
		}

		if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM.value()) != null) {
			applicationModel.getProperties().put("curriculum", applicationService.getCurriculum(
					(List<String>) call
					.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM
							.value()),
							(AlfrescoFolder) application, cmisSession, applicationModel));
		}
		if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()) != null) {
			applicationModel.getProperties().put("prodotti", applicationService.getProdotti(
					(List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()),
					(AlfrescoFolder) application, JCONONPolicyType.PEOPLE_NO_SELECTED_PRODUCT, cmisSession, applicationModel));
			applicationModel.getProperties().put("prodottiScelti", applicationService.getProdotti(
					(List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()),
					(AlfrescoFolder) application, JCONONPolicyType.PEOPLE_SELECTED_PRODUCT, cmisSession, applicationModel));
		}
		applicationModel.getProperties().put("dichiarazioni", applicationService
				.getDichiarazioni(
						bulkInfoService.find(application.getType().getId().replace(":", "_")),
						(AlfrescoFolder) application,
						JCONONPropertyIds.CALL_ELENCO_ASPECTS,
						applicationModel));
		applicationModel.getProperties().put("datiCNR", applicationService.getDichiarazioni(
				bulkInfoService.find(application.getType().getId().replace(":", "_")),
				(AlfrescoFolder) application,
				JCONONPropertyIds.CALL_ELENCO_ASPECTS_SEZIONE_CNR,
				applicationModel));
		applicationModel.getProperties().put("ulterioriDati", applicationService.getDichiarazioni(
				bulkInfoService.find(application.getType().getId().replace(":", "_")),
				(AlfrescoFolder) application,
				JCONONPropertyIds.CALL_ELENCO_ASPECTS_ULTERIORI_DATI,
				applicationModel));
		
		String json = "{\"properties\":"+gson.toJson(applicationModel.getProperties())+"}";
		LOGGER.debug(json);

		try {
			/**
			 * Calcolo dell'MD5 ed QRCODE del curriculum
			 */
			String docRiconoscimentoId = findDocRiconoscimentoId(cmisSession, application);
			String md5 = null;
			ByteArrayOutputStream qrcode = null;
			if (docRiconoscimentoId != null){
				InputStream isCurriculum = ((Document)cmisSession.getObject(docRiconoscimentoId)).getContentStream().getStream();
				md5 = StringUtil.getMd5(isCurriculum);
				qrcode = QrCodeUtil.getQrcode(md5);
			}

			Map<String, Object> parameters = new HashMap<String, Object>();
			JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(Charset.forName("UTF-8"))), "properties");
			JRGzipVirtualizer vir = new JRGzipVirtualizer(100);
			final ResourceBundle resourceBundle = ResourceBundle.getBundle(
					"net.sf.jasperreports.view.viewer", I18NUtil.getLocale());
			parameters.put(JRParameter.REPORT_LOCALE, I18NUtil.getLocale());
			parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
			parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
			parameters.put(JRParameter.REPORT_VIRTUALIZER, vir);
			parameters.put("DIR_IMAGE", this.getClass().getResource("/it/cnr/jconon/print/").getPath());
			parameters.put("SUBREPORT_DIR", this.getClass().getResource("/it/cnr/jconon/print/").getPath());
			parameters.put("MD5", md5);

			if (qrcode != null) {
				parameters.put("QRCODE", new ByteArrayInputStream(qrcode.toByteArray()));
			}
			ClassLoader classLoader = ClassLoader.getSystemClassLoader();
			parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);

			JasperPrint jasperPrint = JasperFillManager.fillReport(this.getClass().getResourceAsStream("/it/cnr/jconon/print/DomandaConcorso.jasper"), parameters);


			ByteArrayOutputStream os = new ByteArrayOutputStream();
			JRPdfExporter exporter = new JRPdfExporter();
			exporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
			exporter.setParameter(JRExporterParameter.OUTPUT_STREAM, os);
			exporter.setParameter(JRPdfExporterParameter.FORCE_LINEBREAK_POLICY, Boolean.TRUE);
			exporter.exportReport();
			return os.toByteArray();
		} catch (Exception e) {
			throw new WebScriptException("Error in JASPER", e);
		}
	}

	public String archiviaRicevutaReportModel(Folder application, InputStream is, String nameRicevutaReportModel, boolean confermata) throws WebScriptException {
		Session cmisSession = cmisService.createAdminSession();
		return archiviaRicevutaReportModel(cmisSession, application, is, nameRicevutaReportModel, confermata);
	}

	public String archiviaRicevutaReportModel(Session cmisSession, Folder application,
			InputStream is, String nameRicevutaReportModel, boolean confermata) throws WebScriptException {
		try {
			ContentStream contentStream = new ContentStreamImpl(nameRicevutaReportModel,
					BigInteger.valueOf(is.available()),
					"application/pdf",
					is);
			Map<String, Object> properties = new HashMap<String, Object>();
			properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION.value());
			properties.put(PropertyIds.NAME, nameRicevutaReportModel);
			String docId = findRicevutaApplicationId(cmisSession, application);
			if (docId!=null) {
				try{
					Document doc = (Document) cmisSession.getObject(docId);
					if (confermata) {
						int pointPosition = nameRicevutaReportModel.lastIndexOf('.');
						nameRicevutaReportModel = nameRicevutaReportModel.substring(0, pointPosition).
								concat("-").concat(doc.getVersionLabel()).concat(".pdf");
						properties.put(PropertyIds.NAME, nameRicevutaReportModel);
						Document pwc = (Document) cmisSession.getObject(doc.checkOut());
						pwc.checkIn(true, properties, contentStream, "Domanda Inviata.");
						docId = pwc.getId();
					} else {
						doc.setContentStream(contentStream, true, true);
						doc = doc.getObjectOfLatestVersion(false);
						docId = doc.getId();
					}
				}catch (CmisObjectNotFoundException e) {
					docId = createApplicationDocument(application, contentStream, properties);
				}catch(CmisStreamNotSupportedException ex) {
					LOGGER.error("Cannot set Content Stream on id:"+ docId + " ------" + ex.getErrorContent(), ex);
					throw ex;
				}
			} else {
				docId = createApplicationDocument(application, contentStream, properties);
			}
			return docId;
		} catch (Exception e) {
			throw new WebScriptException("Error in JASPER", e);
		}
	}

	private String createApplicationDocument(Folder application, ContentStream contentStream, Map<String, Object> properties){
		AlfrescoDocument doc = (AlfrescoDocument) application.createDocument(properties, contentStream, VersioningState.MAJOR);
		nodeVersionService.addAutoVersion(doc);
		return doc.getId();
	}

}