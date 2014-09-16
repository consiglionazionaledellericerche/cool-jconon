package it.cnr.jconon.service.application;


import it.cnr.bulkinfo.BulkInfo;
import it.cnr.bulkinfo.BulkInfoImpl.FieldProperty;
import it.cnr.bulkinfo.BulkInfoImpl.FieldPropertySet;
import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.NodeVersionService;
import it.cnr.cool.cmis.service.UserCache;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.util.Pair;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.PermissionServiceImpl;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.cmis.model.JCONONRelationshipType;
import it.cnr.jconon.service.call.CallService;
import it.cnr.jconon.web.scripts.model.ApplicationModel;
import it.cnr.jconon.web.scripts.model.PrintDetailBulk;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.Order;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.nio.charset.Charset;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.TreeMap;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JsonDataSource;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.JRXlsExporterParameter;
import net.sf.jasperreports.engine.fill.JRGzipVirtualizer;

import org.alfresco.cmis.client.AlfrescoDocument;
import org.alfresco.cmis.client.AlfrescoFolder;
import org.alfresco.cmis.client.type.AlfrescoType;
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
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.definitions.PropertyBooleanDefinition;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDateTimeDefinition;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDecimalDefinition;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.Cardinality;
import org.apache.chemistry.opencmis.commons.enums.IncludeRelationships;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisPermissionDeniedException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisRuntimeException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.util.I18NUtil;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.connector.User;
import org.springframework.extensions.webscripts.ui.common.StringUtils;
import org.springframework.format.number.NumberFormatter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class ApplicationService implements UserCache, InitializingBean {
	@Autowired
	private CMISService cmisService;
	@Autowired
	private PermissionServiceImpl permission;
	@Autowired
	private CacheService cacheService;

	@Autowired
	private ACLService aclService;

	@Autowired
	private NodeVersionService nodeVersionService;

	@Autowired
	private BulkInfoCoolService bulkInfoService;

	// TODO passare a guava?
	private Map<String, String> cache;

	private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationService.class);

	@Autowired
    private MailService mailService;
	@Autowired
	private UserService userService;
	@Autowired
	private CallService callService;

	public final static String FINAL_APPLICATION = "Domande definitive",
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
		criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), DOMANDA_CONFERMATA));
		OperationContext context = cmisSession.getDefaultContext();
		context.setMaxItemsPerPage(1000);
		ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, context);
		for (QueryResult queryResultDomande : domande) {
			String applicationAttach = findAttachmentId(cmisSession, (String)queryResultDomande.getPropertyValueById(PropertyIds.OBJECT_ID) ,
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

    public void sollecitaApplication(Session cmisSession, Integer giorniScadenzaPresDomande){
		Calendar dataLimite = Calendar.getInstance();
		dataLimite.add(Calendar.DAY_OF_YEAR, giorniScadenzaPresDomande);

		Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
		criteria.add(Restrictions.le(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), dataLimite.getTime()));
		criteria.add(Restrictions.ge(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), Calendar.getInstance().getTime()));
		ItemIterable<QueryResult> bandi = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());

		for (QueryResult queryResult : bandi) {
			Criteria criteriaDomande = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
			criteriaDomande.add(Restrictions.inFolder((String)queryResult.getPropertyValueById(PropertyIds.OBJECT_ID)));
			criteriaDomande.add(Restrictions.eq(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value(), DOMANDA_PROVVISORIA));
			ItemIterable<QueryResult> domande = criteriaDomande.executeQuery(cmisSession, false, cmisSession.getDefaultContext());

			for (QueryResult queryResultDomande : domande) {
				EmailMessage message = new EmailMessage();
				List<String> emailList = new ArrayList<String>();
				try {
					User user = userService.loadUserForConfirm((String)queryResultDomande.getPropertyValueById(JCONONPropertyIds.APPLICATION_USER.value()));
					if (user!=null && user.getEmail()!=null && !user.getEmail().equals("nomail")) {
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
					}
				} catch (CoolUserFactoryException e) {
					LOGGER.error("User not found", e);
				}
			}
		}
	}

	// Preferire un util standardizzato (o spostare in un util)
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

	// TODO get what?!
	@Override
	public String get(CMISUser user, BindingSession session) {
		if (cache.containsKey(user.getId()))
			return cache.get(user.getId());
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
					LOGGER.error("errore di formattazione JSON", e);
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

	public String getNameRicevutaReportModel(Session cmisSession, Folder application) throws WebScriptException {
		String shortNameEnte = "CNR";
		Folder call = loadCallById(cmisSession, application.getParentId());
		DateFormat formatter = new SimpleDateFormat("yyyy/MM/dd");
		GregorianCalendar dataDomanda = application.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value());
		String dataApplication = "PROVVISORIA";
		if (dataDomanda != null)
			dataApplication = formatter.format(dataDomanda.getTime()).replace("/", "_");

		return shortNameEnte +
				"-" +
				call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())+
				"-RD-" +
				application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value())+
				"-" +
				dataApplication +
				".pdf";
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
		}
		if (((AlfrescoFolder)call).hasAspect(JCONONPolicyType.JCONON_MACRO_CALL.value()))
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
		}
		application.refresh();
		if (model != null)
			model.put("folder", application);
		return application;
	}

	public String getSchedaValutazioneName(Session cmisSession, Folder application) throws WebScriptException {
		String shortNameEnte = "CNR";
		Folder call = loadCallById(cmisSession, application.getParentId());
		DateFormat formatter = new SimpleDateFormat("yyyy/MM/dd");
		GregorianCalendar dataDomanda = application.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value());
		String dataApplication = "PROVVISORIA";
		if (dataDomanda != null)
			dataApplication = formatter.format(dataDomanda.getTime()).replace("/", "_");
		return shortNameEnte +
				"-" +
				call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())+
				"-RD-" +
				application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value())+
				"-" +
				dataApplication +
				".xls";
	}

	public String printSchedaValutazione(Session cmisSession, String nodeRef,
			String contextURL, String userId) throws IOException {
		Folder application = (Folder) cmisSession.getObject(nodeRef);
		Folder call = loadCallById(cmisSession, application.getParentId());
		application.refresh();
		InputStream is = new ByteArrayInputStream(getSchedaValutazione(
				cmisSession, application, contextURL));
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

		AlfrescoDocument doc = (AlfrescoDocument) application.createDocument(properties, contentStream, VersioningState.MAJOR);

		Map<String, ACLType> aces = new HashMap<String, ACLType>();
		aces.put(callService.getCallGroupName(call), ACLType.Coordinator);
		Folder macroCall = callService.getMacroCall(cmisService.createAdminSession(), call);
		if (macroCall!=null) {
			String groupNameMacroCall = callService.getCallGroupName(macroCall);
			aces.put(groupNameMacroCall, ACLType.Coordinator);
		}
		aclService.addAcl(cmisService.getAdminSession(),
				doc.getVersionSeriesId(), aces);
		aclService.setInheritedPermission(cmisService.getAdminSession(), doc.getVersionSeriesId(), false);
		nodeVersionService.addAutoVersion(doc, false);
		return doc.getId();

	}

	// TODO aggiornare i JR deprecati
	@SuppressWarnings({"unchecked", "deprecation"})
	public byte[] getSchedaValutazione(Session cmisSession, Folder application,
			String contextURL) throws WebScriptException {
		Folder call = application.getFolderParent();
		ApplicationModel applicationBulk = new ApplicationModel(application,
				cmisSession.getDefaultContext(), I18NUtil.getAllMessages(),
				contextURL);

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
			applicationBulk
					.getProperties()
					.put("allegati",
							getAllegati(
					((List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS.value())),
									(AlfrescoFolder) application,
									JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT,
									cmisSession, applicationBulk, false));
		}

		if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM.value()) != null) {
			applicationBulk
					.getProperties()
					.put("curriculum",
							getCurriculum(
					(List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM.value()),
											(AlfrescoFolder) application,
											cmisSession, applicationBulk, false));
		}
		if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()) != null) {
			applicationBulk
					.getProperties()
					.put("prodotti",
							getProdotti(
					(List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()),
											(AlfrescoFolder) application,
											JCONONPolicyType.PEOPLE_NO_SELECTED_PRODUCT,
											cmisSession, applicationBulk, false));
			applicationBulk
					.getProperties()
					.put("prodottiScelti",
							getProdotti(
					(List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()),
											(AlfrescoFolder) application,
											JCONONPolicyType.PEOPLE_SELECTED_PRODUCT,
											cmisSession, applicationBulk, false));
		}

		String json = "{\"properties\":"+gson.toJson(applicationBulk.getProperties())+"}";
		if (LOGGER.isDebugEnabled())
			LOGGER.debug(json);
		try {

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

			ClassLoader classLoader = ClassLoader.getSystemClassLoader();
			parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);

			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			JasperPrint jasperPrint = JasperFillManager.fillReport(this.getClass().getResourceAsStream("/it/cnr/jconon/print/scheda_valutazione.jasper"), parameters);
			JRXlsExporter exporterXLS = new JRXlsExporter();
			exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint);
			exporterXLS.setParameter(JRXlsExporterParameter.OUTPUT_STREAM, baos);
			exporterXLS.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
			exporterXLS.setParameter(JRXlsExporterParameter.IS_DETECT_CELL_TYPE, Boolean.TRUE);
			exporterXLS.setParameter(JRXlsExporterParameter.IS_WHITE_PAGE_BACKGROUND, Boolean.FALSE);
			exporterXLS.setParameter(JRXlsExporterParameter.IS_REMOVE_EMPTY_SPACE_BETWEEN_ROWS, Boolean.TRUE);

			exporterXLS.setParameter(JRXlsExporterParameter.IS_COLLAPSE_ROW_SPAN, Boolean.FALSE);
			exporterXLS.exportReport();
			return baos.toByteArray();
		} catch (Exception e) {
			throw new WebScriptException("Error in JASPER", e);
		}
	}

	@SuppressWarnings("unchecked")
	public void addContentToChild(String nodeRefApplication, Session cmisSession,
 Map<String, String> messages, String contextURL) {
    	Folder application = loadApplicationById(cmisSession, nodeRefApplication, new HashMap<String, Object>());
    	Folder call = loadCallById(cmisSession, application.getParentId(), new HashMap<String, Object>());
		ApplicationModel applicationBulk = new ApplicationModel(application,
				cmisSession.getDefaultContext(), messages, contextURL);
		List<String> types = new ArrayList<String>();
		types.addAll(((List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_CURRICULUM.value())));
		types.addAll((List<String>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SEZIONE_PRODOTTI.value()));
		for (CmisObject cmisObject : application.getChildren()) {
			if (types.contains(cmisObject.getType().getId())) {
				cmisObject.refresh();
		    	addContentToCmisObject(applicationBulk, cmisObject);
			}
		}
	}

	// TODO aggiornare i JR deprecati
	@SuppressWarnings("deprecation")
	private void addContentToCmisObject(ApplicationModel applicationBulk,
			CmisObject cmisObject) {
		BulkInfo bulkInfo = bulkInfoService.find(cmisObject.getType().getId().replace(":", "_"));
		Map<String, Object> parameters = new HashMap<String, Object>();
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
		List<Pair<String, String>> fields = new ArrayList<Pair<String, String>>();
		fields.addAll(getFields(cmisObject, applicationBulk));
		applicationBulk.getProperties().put("fields", new PrintDetailBulk(null, null, null, fields, null));
		String json = "{\"properties\":"+gson.toJson(applicationBulk.getProperties())+"}";

		JRGzipVirtualizer vir = new JRGzipVirtualizer(100);
		final ResourceBundle resourceBundle = ResourceBundle.getBundle(
				"net.sf.jasperreports.view.viewer", I18NUtil.getLocale());
		try {
			JRDataSource datasource = new JsonDataSource(new ByteArrayInputStream(json.getBytes(Charset.forName("UTF-8"))), "properties");
			parameters.put(JRParameter.REPORT_LOCALE, I18NUtil.getLocale());
			parameters.put(JRParameter.REPORT_RESOURCE_BUNDLE, resourceBundle);
			parameters.put(JRParameter.REPORT_DATA_SOURCE, datasource);
			parameters.put(JRParameter.REPORT_VIRTUALIZER, vir);
			parameters.put("title", bulkInfo.getLongDescription());
			parameters.put("DIR_IMAGE", this.getClass().getResource("/it/cnr/jconon/print/").getPath());
			parameters.put("SUBREPORT_DIR", this.getClass().getResource("/it/cnr/jconon/print/").getPath());
			parameters.put("title", bulkInfo.getLongDescription());
			ClassLoader classLoader = ClassLoader.getSystemClassLoader();
			parameters.put(JRParameter.REPORT_CLASS_LOADER, classLoader);

			JasperPrint jasperPrint = JasperFillManager.fillReport(this.getClass().getResourceAsStream("/it/cnr/jconon/print/prodotti.jasper"), parameters);
			InputStream stream = new ByteArrayInputStream(JasperExportManager.exportReportToPdf(jasperPrint));
			ContentStream contentStream = new ContentStreamImpl(cmisObject.getName(), new BigInteger(String.valueOf(stream.available())), "application/pdf", stream);
			((Document)cmisObject).setContentStream(contentStream, true);
		} catch (Exception e) {
			LOGGER.error("Error during print report for object: " + cmisObject.getId(), e);
		}
	}
	
	private void printField(FieldPropertySet printForm, ApplicationModel applicationModel, Folder application, PrintDetailBulk detail) {
		for (FieldProperty printFieldProperty : printForm
				.getFieldProperties()) { // extract method
			String message = applicationModel
							.getMessage(printFieldProperty
									.getAttribute("label")); // mix
								// view
			String value;
			Object objValue = application
					.getPropertyValue(printFieldProperty
							.getProperty());
			if (objValue == null)
				return;
			else {
				if (application.getProperty(
						printFieldProperty.getProperty())
						.isMultiValued()) {
					List<Object> values = (List<Object>) objValue;
					if (values.isEmpty())
						return;
					if (values.size() > 1) {
						for (int k = 0; k < values.size(); k++) {
							detail.addField(new Pair<String, String>(k == 0 ? (message + "<br>"): "", String.valueOf(values.get(k))));
						}									
					} else {
						value = StringUtils.join(
								((List<Object>) objValue).toArray(),
								", ");
						detail.addField(new Pair<String, String>(message, value));	
					}
				} else {
					if (printFieldProperty.getAttribute("widget") != null) {
						if (printFieldProperty.getAttribute("widget").contains("ui.datepicker")) {
							value = StringUtil.DATEFORMAT.format(((Calendar)objValue).getTime());
						} else if (printFieldProperty.getAttribute("widget").contains("ui.datetimepicker")) {
							value = StringUtil.DATETIMEFORMAT.format(((Calendar)objValue).getTime());
						} else {
							if (objValue instanceof Boolean)
								value = Boolean.valueOf(String.valueOf(objValue))?"Si":"No";
							else
								value = String.valueOf(objValue);										
						}
					} else {	
						value = String.valueOf(objValue);
					}	
					detail.addField(new Pair<String, String>(message, value));								
				}
			}
		}		
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
	 * 
	 */
	// TODO: questo metodo non viene utilizzato internamente
	// considerare se spostarlo in una classe controller/util apposita
	@SuppressWarnings("unchecked")
	public List<PrintDetailBulk> getDichiarazioni(BulkInfo bulkInfo,
			AlfrescoFolder application, JCONONPropertyIds callProperty,
			ApplicationModel applicationModel){
		List<PrintDetailBulk> result = new ArrayList<PrintDetailBulk>();
		// Recupero il bando
		Folder call = application.getParents().get(0); // chi e' il parent?
		List<String> associations = call.getPropertyValue(callProperty.value());
		for (int i = 0; i < associations.size(); i++) {
			String association = associations.get(i);
			if (!application.hasAspect(association)) {
				continue;
			}

			// immagino che questa logica serva anche da altre parti. Possiamo
			// considerare di spostarla in BulkInfoService, oppure direttamente
			// in BulkInfoImpl?
			FieldPropertySet printForm = bulkInfo.getPrintForms().get(
					association);
			if (printForm != null) {
				String applicationValue = String.valueOf(application
						.getPropertyValue(printForm.getKey())); // ?? questa
																// dichiarazione
																// va spostata
																// nell'else del
																// seguente if
				FieldProperty fieldProperty = printForm
						.getFieldProperty(applicationValue); // ?? questa
																// dichiarazione
																// va spostata
																// nell'else del
																// seguente if
				PrintDetailBulk detail = new PrintDetailBulk();
				detail.setTitle(String.valueOf(
						Character.toChars(i + 65)[0]).concat(") "));
				if (printForm.getKey() == null) {
					printField(printForm, applicationModel, application, detail);
				} else { // extract method
					if (application.getPropertyValue(printForm.getKey()) == null) // considerare
																					// di
																					// unire
																					// questi
																					// tre
																					// if
																					// in
																					// uno
																					// solo
																					// (perche'
																					// no?)
						continue;
					if (fieldProperty == null)
						continue;
					String labelKey = fieldProperty.getAttribute("label");
					if (labelKey == null)
						continue;
					String message = "";
					if (fieldProperty.getAttribute("formName") != null) {
						List<Object> params = new ArrayList<Object>();
						FieldPropertySet printForm1 = bulkInfo.getPrintForms().get(fieldProperty.getAttribute("formName"));
						if (printForm1 != null && printForm1.getKey() != null && printForm1.getKey().equals("false")) {
							detail.addField(new Pair<String, String>(null, applicationModel.getMessage(
									labelKey)));
							printField(printForm1, applicationModel, application, detail);
						} else {
							for (FieldProperty paramFieldProperty : bulkInfo
									.getPrintForm(fieldProperty
											.getAttribute("formName"))) {
								Object param = applicationModel.getProperties()
										.get(paramFieldProperty
												.getAttribute("property"));
								if (param == null)
									param = "";
								params.add(param);
							}
							message = message.concat(applicationModel.getMessage(
									labelKey, params.toArray())); // invece di
																	// costruire un
																	// array, si
																	// puo' usare
																	// direttamente
																	// getMessage()
																	// ?							
						}
					} else {
						message = message.concat(applicationModel
								.getMessage(labelKey));
					}
					detail.addField(new Pair<String, String>(null, message));
				}
				if (detail.getFields() != null && !detail.getFields().isEmpty())
					result.add(detail);
			}
		}
		return result;
	}

	// TODO: questo metodo non viene utilizzato internamente
	// considerare se spostarlo in una classe controller/util apposita
	public List<PrintDetailBulk> getAllegati(List<String> propertyValue,
			AlfrescoFolder application, JCONONPolicyType allegati,
			Session cmisSession, ApplicationModel applicationModel) {
		return getAllegati(propertyValue, application,
				allegati, cmisSession, applicationModel, true);
	}

	// TODO: questo metodo non viene utilizzato internamente e usa una sola
	// variabile d'istanza
	// considerare se spostarlo in una classe controller/util apposita
	public List<PrintDetailBulk> getAllegati(List<String> propertyValue,
			AlfrescoFolder application, JCONONPolicyType allegati,
			Session cmisSession, ApplicationModel applicationModel,
			boolean printDetail) {

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
								.getPropertyValueById(PropertyIds.OBJECT_ID));
				String link = null;
				if (((BigInteger) riga
						.getPropertyValue(PropertyIds.CONTENT_STREAM_LENGTH))
						.compareTo(BigInteger.ZERO) == 1) {
					link = applicationModel.getContextURL()
							+ "/search/content?nodeRef=" + riga.getId();
				}
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

	// TODO: questo metodo non viene utilizzato internamente e usa una sola
	// variabile
	// d'istanza
	// considerare se spostarlo in una classe controller/util apposita
	public List<PrintDetailBulk> getCurriculum(List<String> propertyValue,
			AlfrescoFolder application, Session cmisSession,
			ApplicationModel applicationModel) {
		return getCurriculum(propertyValue, application,
				cmisSession, applicationModel, true);
	}

	public List<PrintDetailBulk> getCurriculum(List<String> propertyValue,
			AlfrescoFolder application, Session cmisSession,
			ApplicationModel applicationModel, boolean printDetail) {
		List<PrintDetailBulk> result = new ArrayList<PrintDetailBulk>();
		Map<String, List<Pair<String, String>>> sezioni = getSezioni(propertyValue);
		for (String key : sezioni.keySet()) {
			for (Pair<String, String> pair : sezioni.get(key)) {
				Criteria criteria = CriteriaFactory.createCriteria(pair
						.getSecond());
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
										.getPropertyValueById(PropertyIds.OBJECT_ID));
						if (printDetail) {
							result.add(new PrintDetailBulk(key,
									pair.getFirst(), null, getFields(riga,
											applicationModel), null));
						} else {
							String link = null;
							if (((BigInteger) riga
									.getPropertyValue(PropertyIds.CONTENT_STREAM_LENGTH))
									.compareTo(BigInteger.ZERO) == 1) {
								link = applicationModel.getContextURL()
										+ "/search/content?nodeRef="
										+ riga.getId();
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
							if (ruolo != null){
								ruolo = ruolo.replace("_", " ");
								ruolo += " - ";
							} else {
								ruolo = "";
							}

							String title = riga
									.getPropertyValue("cvelement:denominazioneIncarico");
							if (title == null)
								title = riga
										.getPropertyValue("cvelement:denominazioneIstituto");
							if (title == null)
								title = riga
										.getPropertyValue("cvelement:titoloProgetto");
							if (title == null)
								title = riga
										.getPropertyValue("cvelement:denominazioneStruttura");
							if (title == null)
								title = riga
										.getPropertyValue("cvelement:rivista");
							if (title == null)
								title = riga
										.getPropertyValue("cvelement:tipologiaOrganismo");
							if (title == null)
								title = riga
										.getPropertyValue("cvelement:titoloEvento");
							if (title == null)
								title = riga
										.getPropertyValue("cvelement:descrizionePremio");
							if (riga.getPropertyValue("cvelement:attivitaSvolta") != null)
								title += " - "
										+ riga.getPropertyValue("cvelement:attivitaSvolta");
							if (riga.getPropertyValue("cvelement:descrizionePartecipazione") != null)
								title += " - "
										+ riga.getPropertyValue("cvelement:descrizionePartecipazione");
							PrintDetailBulk detail = new PrintDetailBulk(null,
									pair.getFirst(), link, ruolo + title, null);
							String periodo = "";
							SimpleDateFormat dateFormat = new SimpleDateFormat(
									"dd/MM/yyyy");
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
												.getPropertyValue("cvelement:oreComplessive"))).setScale(0,BigDecimal.ROUND_DOWN);

							detail.setPeriodo(periodo);
							result.add(detail);
						}
					}
				}
			}
		}
		return result;
	}

	// TODO: non c'e' molto da rifattorizzare qui (tranne l'if segnalata)
	// considerare se rendere private
	@SuppressWarnings("unchecked")
	public List<Pair<String, String>> getFields(CmisObject riga,
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
							value = StringUtils.join(
									((List<Object>) objValue).toArray(), ", ");
						} else {
							if (propertyDefinition instanceof PropertyDateTimeDefinition) {
								value = new SimpleDateFormat("dd/MM/yyyy",
										Locale.ITALY)
										.format(((GregorianCalendar) objValue)
												.getTime());
							} else if (propertyDefinition instanceof PropertyDecimalDefinition) {
								value = new NumberFormatter("").print(
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
						results.add(new Pair<String, String>(applicationModel
								.getMessage(getLabel(fieldProperty,
										applicationModel)), message));
					}
				}
			}
		}
		return results;
	}

	private void addOrderCurriculum(Session cmisSession, String queryName,
			Criteria criteria) {
		AlfrescoType type = (AlfrescoType) cmisSession.getTypeDefinition("D:"
				.concat(queryName));
		String aspectQueryName = null, aspectPropertyOrder = null;
		if (type.getMandatoryAspects().contains(
				JCONONPolicyType.CV_COMMON_METADATA_ASPECT2.value())) {
			aspectQueryName = JCONONPolicyType.CV_COMMON_METADATA_ASPECT2
					.queryName();
			aspectPropertyOrder = "common.cvelement:periodAttivitaDal";
		} else if (type.getMandatoryAspects().contains(
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

	// TODO questo metodo non viene utilizzato internamente e usa una sola
	// variabile d'istanza
	// considerare se spostarlo in una classe controller/util apposita
	public List<PrintDetailBulk> getProdotti(List<String> propertyValue,
			AlfrescoFolder application, JCONONPolicyType peopleProduct,
			Session cmisSession, ApplicationModel applicationModel) {
		return getProdotti(propertyValue, application,
				peopleProduct, cmisSession, applicationModel, true);
	}

	public List<PrintDetailBulk> getProdotti(List<String> propertyValue,
			AlfrescoFolder application, JCONONPolicyType peopleProduct,
			Session cmisSession, ApplicationModel applicationModel,
			boolean printDetail) {
		List<PrintDetailBulk> result = new ArrayList<PrintDetailBulk>();
		OperationContext ocRel = new OperationContextImpl(
				cmisSession.getDefaultContext());
		ocRel.setIncludeRelationships(IncludeRelationships.SOURCE);
		Map<String, List<Pair<String, String>>> sezioni = getSezioni(propertyValue);
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
					for (QueryResult queryResult : queryResults
							.getPage(Integer.MAX_VALUE)) {
						List<PrintDetailBulk> rels = new ArrayList<PrintDetailBulk>();
						CmisObject riga = cmisSession
								.getObject(
										(String) queryResult
												.getPropertyValueById(PropertyIds.OBJECT_ID),
										ocRel);
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
									String link = applicationModel
											.getContextURL()
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
									.compareTo(BigInteger.ZERO) == 1) {
								link = applicationModel.getContextURL()
										+ "/search/content?nodeRef="
										+ riga.getId();
							}
							String title = riga
									.getPropertyValue("cvpeople:id_tipo_txt");
							title += " - "
									+ riga.getPropertyValue("cvpeople:titolo");
							if (riga.getProperty("cvpeople:ruoloSvolto") != null
									&& riga.getProperty("cvpeople:ruoloSvolto")
											.getValues().size() != 0)
								title += " - "
										+ riga.getProperty(
												"cvpeople:ruoloSvolto")
												.getValuesAsString();
							if (riga.getProperty("cvpeople:altroRuoloSvolto") != null
									&& riga.getProperty(
											"cvpeople:altroRuoloSvolto")
											.getValues().size() != 0)
								title += " - "
										+ riga.getProperty(
												"cvpeople:altroRuoloSvolto")
												.getValuesAsString();

							PrintDetailBulk detail = new PrintDetailBulk(key,
									pair.getFirst(), link, title, rels);
							detail.setPeriodo(String.valueOf(riga
									.getPropertyValue("cvpeople:anno")));
							result.add(detail);
						}
					}
				}
			}
		}
		return result;
	}

	private Map<String, List<Pair<String, String>>> getSezioni(List<String> propertyValue) {
		Map<String, List<Pair<String, String>>> sezioni = new TreeMap<String, List<Pair<String, String>>>();
		for (String type : propertyValue) {

			String bulkInfoName = type.replace(":", "_");
			BulkInfo bulkInfo = bulkInfoService.find(bulkInfoName);

			String sezione = bulkInfo.getShortDescription();
			String sottoSezione = bulkInfo.getLongDescription();
			String queryName = bulkInfo.getCmisQueryName();
			if (sezioni.containsKey(sezione)) {
				sezioni.get(sezione).add(
						new Pair<String, String>(sottoSezione, queryName));
			} else {
				List<Pair<String, String>> lista = new ArrayList<Pair<String, String>>();
				lista.add(new Pair<String, String>(sottoSezione, queryName));
				sezioni.put(sezione, lista);
			}
		}
		for (List<Pair<String, String>> values : sezioni.values()) {
			Collections.sort(values, new Comparator<Pair<String, String>>() {
				@Override
				public int compare(Pair<String, String> o1,
						Pair<String, String> o2) {
					Integer firstValue = StringUtil.romanConvert(o1.getFirst()
							.substring(0, o1.getFirst().indexOf("."))), secondValue = StringUtil
							.romanConvert(o2.getFirst().substring(0,
									o2.getFirst().indexOf(".")));
					if (firstValue != 0 && secondValue != 0)
						return firstValue.compareTo(secondValue);
					return o1.compareTo(o2);
				}

			});
		}
		return sezioni;
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
		else if (fieldProperty.getAttribute("jsonlabel") != null) {
			JsonElement item = new JsonParser().parse(fieldProperty
					.getAttribute("jsonlabel"));
			String key = item.getAsJsonObject().get("key").getAsString();
			String defaultLabel = item.getAsJsonObject().get("default")
					.getAsString();
			if (applicationModel.getMessage(key).equals(key))
				return defaultLabel;
			else
				return key;
		} else
			return null;
	}

	public void reject(Session currentCMISSession, String nodeRef) {
		Folder application = loadApplicationById(currentCMISSession, nodeRef);
		Map<String, Serializable> properties = new HashMap<String, Serializable>();
		properties.put("jconon_application:esclusione_rinuncia", "E");
		application.updateProperties(properties);
		Map<String, ACLType> acesToRemove = new HashMap<String, ACLType>();
		List<String> groups = callService.getGroupsCallToApplication(application.getFolderParent());
		for (String group : groups) {
			acesToRemove.put(group, ACLType.Contributor);
		}
		aclService.removeAcl(cmisService.getAdminSession(), application.getId(), acesToRemove);
	}

}
