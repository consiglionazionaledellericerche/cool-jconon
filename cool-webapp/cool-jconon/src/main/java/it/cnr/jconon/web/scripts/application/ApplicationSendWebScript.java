package it.cnr.jconon.web.scripts.application;

import it.cnr.bulkinfo.BulkInfo;
import it.cnr.bulkinfo.BulkInfoImpl.FieldProperty;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.AttachmentBean;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.service.JMSService;
import it.cnr.cool.util.JSONErrorPair;
import it.cnr.cool.web.scripts.CMISWebScript;
import it.cnr.cool.web.scripts.exception.CMISApplicationException;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.cool.web.scripts.exception.ValidationException;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.service.application.ApplicationService;
import it.cnr.jconon.service.call.CallService;
import it.cnr.jconon.web.scripts.print.PrintApplication;

import java.io.ByteArrayInputStream;
import java.io.OutputStream;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.Property;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisPermissionDeniedException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ModelObjectService;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.surf.util.I18NUtil;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Container;
import org.springframework.extensions.webscripts.Format;
import org.springframework.extensions.webscripts.MessageMethod;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.mail.MailException;

public class ApplicationSendWebScript extends ApplicationWebScript{
	@Autowired
	private CMISService cmisService;
    @Autowired
    private PrintApplication printApplication;
	@Autowired
    private MailService mailService;
	@Autowired
	private UserService userService;
	@Autowired
	private JMSService jmsQueueB;
	@Autowired
	private JMSService jmsQueueC;
	@Autowired
    private ApplicationService applicationService;
	@Autowired
    private CallService callService;

	@Autowired
    private BulkInfoCoolService bulkInfoService;

    private static final Logger LOGGER = LoggerFactory.getLogger(CMISWebScript.class);


	@Override
	protected void completeProperties(WebScriptRequest req, Status status, Cache cache, Map<String, Object> model, Session cmisSession, String objectId, Map<String, Object> properties, Map<String, Object> aspectProperties) {
		/**
		 * Carico la domanda con la sessione dell'utente collegato per controllare i diritti di accesso
		 */
		try {
			OperationContext oc = new OperationContextImpl(cmisSession.getDefaultContext());
			oc.setFilterString(PropertyIds.OBJECT_ID);
			cmisSession.getObject(objectId);
		} catch (CmisObjectNotFoundException ex){
			throw new ClientMessageException("message.error.domanda.assente");
		} catch (CmisPermissionDeniedException ex){
			throw new ClientMessageException("message.error.domanda.assente");
		}
	}

	@Override
	protected void validateProperties(WebScriptRequest req, Status status, Cache cache, Map<String, Object> model, Session cmisSession, String objectId, Map<String, Object> properties, Map<String, Object> aspectProperties) throws ValidationException{
		super.validateProperties(req, status, cache, model, cmisSession, objectId, properties, aspectProperties);

		Folder call = applicationService.loadCallById(getCMISSession(), (String)properties.get("cmis:parentId"), model);
		Folder newApplication = applicationService.loadApplicationById(getCMISSession(), objectId, model);

		if (newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value())!=null &&
			newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(CallService.DOMANDA_CONFERMATA))
			throw new ClientMessageException("message.error.domanda.inviata.accesso");

		//Effettuo il controllo sul numero massimo di domande validate passandogli lo User della domanda che deve essere sempre valorizzata
		validateMacroCall(call, (String)newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));

		Map<String, Object> allProperties = new HashMap<String, Object>();
		allProperties.putAll(properties);
		allProperties.putAll(aspectProperties);

		List<JSONErrorPair> listError = validateBaseTableMap(allProperties, model, call, newApplication, cmisSession);

		if (!listError.isEmpty()) {
			String error = "";
			for (JSONErrorPair jsonErrorPair : listError) {
				error = error.concat("<p>").concat(jsonErrorPair.first + ": " + I18NUtil.getMessage(jsonErrorPair.second)).concat("</p>");
			}
			throw new ClientMessageException(error);
		}
		validateAllegatiLinked(call, newApplication, cmisSession);
	}

	private List<JSONErrorPair> validateBaseTableMap(Map<String, Object> map, Map<String, Object> model, Folder call, Folder application, Session cmisSession){
		List<JSONErrorPair> listError = new ArrayList<JSONErrorPair>();
		listError.addAll(validateAspects(map, model, call, application, cmisSession));

		List<String> listSezioniDomanda = getSezioniDomandaList(call);
		BulkInfo bulkInfo = (BulkInfo) bulkInfoService.find(JCONONFolderType.JCONON_APPLICATION.value().replace(":", "_"));
		for (String sezione : listSezioniDomanda) {
			for (FieldProperty fieldProperty : bulkInfo.getForm(sezione)) {
				if (fieldProperty.getProperty()!=null && (fieldProperty.getAttribute("visible")==null || fieldProperty.getAttribute("visible")=="true")) {
					//TAB DATI ANAGRAFICI - Controlli particolari
					if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())) {
							addError(listError, map, fieldProperty.getProperty());
							if (map.get(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())!=null) {
								if ((Boolean)map.get(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())) {
									addError(listError, map, JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());
									Object codiceFiscale = map.get(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());
									if (codiceFiscale!=null) {
										// controllo formale della validita' del codice fiscale
										controllaCodiceFiscale(map, application);
									}
								} else
									addError(listError, map, JCONONPropertyIds.APPLICATION_NAZIONE_CITTADINANZA.value());
							}
					}
					else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value()) ||
							 fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_NAZIONE_CITTADINANZA.value())) {
						LOGGER.info("campi già controllati nell'ambito del flag JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO");
					} else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_CAP_RESIDENZA.value())) {
						if (map.get(JCONONPropertyIds.APPLICATION_NAZIONE_RESIDENZA.value())!=null &&
							((String) map.get(JCONONPropertyIds.APPLICATION_NAZIONE_RESIDENZA.value())).toUpperCase().equals("ITALIA"))
							addError(listError, map, JCONONPropertyIds.APPLICATION_CAP_RESIDENZA.value());
					}
					else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_CAP_COMUNICAZIONI.value())) {
						if (map.get(JCONONPropertyIds.APPLICATION_NAZIONE_COMUNICAZIONI.value())!=null &&
							((String) map.get(JCONONPropertyIds.APPLICATION_NAZIONE_COMUNICAZIONI.value())).toUpperCase().equals("ITALIA"))
							addError(listError, map, JCONONPropertyIds.APPLICATION_CAP_COMUNICAZIONI.value());
					}
					else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value())) {
						if (application==null || application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())==null ||
							application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()).equals(Boolean.FALSE))
							addError(listError, map, JCONONPropertyIds.APPLICATION_EMAIL_COMUNICAZIONI.value());
					}
					else if (fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value())) {
						if (application==null || application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())==null ||
							application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()).equals(Boolean.TRUE))
							addError(listError, map, JCONONPropertyIds.APPLICATION_EMAIL_PEC_COMUNICAZIONI.value());
					}
					else
						addError(listError, map, fieldProperty.getProperty(),
								application.getType().getPropertyDefinitions().get(fieldProperty.getProperty()).getDisplayName());

					if ((fieldProperty.isRadioGroupType() || fieldProperty.isCheckboxType()) && !fieldProperty.getProperty().equals(JCONONPropertyIds.APPLICATION_SESSO.value())
						&& map.get(fieldProperty.getProperty())!=null) {
						Collection<FieldProperty> radioForm = bulkInfo.getForm(fieldProperty.getProperty()+((Boolean) map.get(fieldProperty.getProperty())?"_true":"_false").replace(":", "_"));
						if (radioForm!=null && !radioForm.isEmpty()) {
							for (FieldProperty radioFieldProperty : bulkInfo.getForm(fieldProperty.getProperty()+((Boolean) map.get(fieldProperty.getProperty())?"_true":"_false").replace(":", "_"))) {
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
		if (properties != null){
			for (String property : properties) {
				for (Iterator<JSONErrorPair> iterator = listError.iterator(); iterator.hasNext();) {
					JSONErrorPair error = iterator.next();
					if (error.getFirst().equals(property))
						iterator.remove();
				}
			}
		}
		return listError;
	}
	public List<JSONErrorPair> validateAspects(Map<String, Object> map, Map<String, Object> model, Folder call, Folder application, Session cmisSession){
		List<JSONErrorPair> listError = new ArrayList<JSONErrorPair>();
		List<String> listAspect = getDichiarazioniList(call,application);
		for (String aspect : listAspect) {
			BulkInfo bulkInfoAspect = (BulkInfo) bulkInfoService.find(aspect.replace(":", "_"));
			FieldProperty flag = null;
			if (bulkInfoAspect != null) {
				for (FieldProperty fieldProperty : bulkInfoAspect.getForm(aspect)) {
					if (fieldProperty.isRadioGroupType() || fieldProperty.isCheckboxType()) {
						flag=fieldProperty;
						break;
					}
				}
				for (FieldProperty fieldProperty : bulkInfoAspect.getForm(aspect)) {
					if (flag!=null) {
						if (!fieldProperty.equals(flag) &&
							fieldProperty.getAttributes().get("class").contains(
									flag.getName()+'_'+String.valueOf(map.get(flag.getProperty()))) &&
								!fieldProperty.isNullable()) {
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

	private void addError(List<JSONErrorPair> listError, Map<String, Object> map, String nomeCampo, String nomeCampoTarget) {
		if (map.get(nomeCampo)==null)
			listError.add(new JSONErrorPair(nomeCampoTarget!=null?nomeCampoTarget:nomeCampo, "message.required.field"));
	}
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private List<String> getDichiarazioniList(Folder call, Folder application) {
		List<String> dichiarazioniList = new ArrayList<String>();
		if (call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value())!=null &&
			!((List<?>)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value())).isEmpty())
			dichiarazioniList.addAll((List)call.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value()));
		if (application!=null &&
			application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value())!=null &&
			application.getPropertyValue(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value()).equals(Boolean.TRUE)) {
			dichiarazioniList.remove("P:jconon_application:aspect_godimento_diritti");
			dichiarazioniList.remove("P:jconon_application:aspect_conoscenza_lingua_italiana");
		} else {
			dichiarazioniList.remove("P:jconon_application:aspect_iscrizione_liste_elettorali");
		}
		return dichiarazioniList;
	}


	@Override
	protected void executeAfterPost(WebScriptRequest req, Status status, Cache cache, Map<String, Object> model, Session cmisSession, Boolean created, Folder folder) throws ValidationException {
		super.executeAfterPost(req, status, cache, model, cmisSession, created, folder);
		Folder application = applicationService.loadApplicationById(getCMISSession(), folder.getId(), model);
		Folder call = applicationService.loadCallById(getCMISSession(), application.getParentId(), model);

		Property<Boolean> blocco = call.getProperty(JCONONPropertyIds.CALL_BLOCCO_INVIO_DOMANDE.value());
		if (blocco != null && blocco.getValue() != null
				&& blocco.getFirstValue()) {
			String msg = call.getProperty(JCONONPropertyIds.CALL_BLOCCO_INVIO_DOMANDE_MESSAGE.value()).getValue();
			throw new ClientMessageException(msg);
		}

		final Map<String, Object> mailModel = new HashMap<String, Object>();
		mailModel.putAll(model);
		mailModel.put("url", getURLHelper());
		mailModel.put("serverPath", getServerPath());
		mailModel.put("message", new MessageMethod(this));
		CMISUser applicationUser;
		try {
			applicationUser = (CMISUser)userService.loadUserForConfirm(
					(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
		} catch (CoolUserFactoryException e) {
			throw new ClientMessageException("User not found");
		}
		model.put("email_comunicazione", applicationUser.getEmail());
		final Container container = getContainer();
		final ModelObjectService modelObjectService = ThreadLocalRequestContext.getRequestContext().getObjectService();

		final String contextURL = req.getServerPath() + ThreadLocalRequestContext.getRequestContext().getContextPath();
		try {
			sendApplication(cmisService.getAdminSession(), application.getId(), callService.getGroupsCallToApplication(call));
			jmsQueueB.sendRecvAsync(application.getId(), new MessageListener() {
				@Override
				public void onMessage(Message arg0) {
					String nodeRef = null;
					try {
						ObjectMessage objMessage = (ObjectMessage)arg0;
						nodeRef = (String)objMessage.getObject();
						if (LOGGER.isInfoEnabled())
							LOGGER.info("Start send application with id: " + nodeRef);
						Folder application = applicationService.loadApplicationById(getCMISSession(), nodeRef, mailModel);
						Folder call = applicationService.loadCallById(getCMISSession(), application.getParentId(), mailModel);
						CMISUser applicationUser;
						try {
							applicationUser = (CMISUser)userService.loadUserForConfirm(
									(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_USER.value()));
						} catch (CoolUserFactoryException e) {
							throw new ClientMessageException("User not found");
						}
						mailModel.put("email_comunicazione", applicationUser.getEmail());
						sendConfirmMail(applicationUser, mailModel, application, call, container, modelObjectService, contextURL);
						if (LOGGER.isInfoEnabled())
							LOGGER.info("End send application with id: " + nodeRef);
					} catch (JMSException e) {
						LOGGER.error("Error on Message for send application with id:" + nodeRef , e);
					}
				}
			});
			/**
			 * Aggiungo la stampa ad ogni riga di curriculum e di prodotti
			 */
			addContentToChild(application, call, container, modelObjectService, contextURL);
		} catch (Exception e) {
			mailService.sendErrorMessage(ThreadLocalRequestContext.getRequestContext().getUserId(), req.getURL(), req.getServerPath(), new WebScriptException("999", e));
			throw new ClientMessageException("message.error.confirm.incomplete");
		}
	}

	public void sendApplication(BindingSession cmisSession, final String applicationSourceId, final List<String> groupsCall) {
		String link = cmisService.getBaseURL().concat("service/manage-application/send");
        UrlBuilder url = new UrlBuilder(link);
		Response resp = cmisService.getHttpInvoker(cmisSession).invokePOST(url, Format.JSON.mimetype(),
				new Output() {
            		@Override
					public void write(OutputStream out) throws Exception {
            			JSONObject jsonObject = new JSONObject();
            			jsonObject.put("applicationSourceId", applicationSourceId);
            			jsonObject.put("groupsCall", groupsCall);
            			jsonObject.put("userAdmin", cmisService.getAdminUserId());
            			out.write(jsonObject.toString().getBytes());
            		}
        		}, cmisSession);
		int status = resp.getResponseCode();
		if (status == HttpStatus.SC_NOT_FOUND|| status == HttpStatus.SC_BAD_REQUEST|| status == HttpStatus.SC_INTERNAL_SERVER_ERROR)
			throw new WebScriptException("Send Application error. Exception: " + resp.getErrorContent());
	}

	public void addContentToChild(Folder application, Folder call, final Container container,
			final ModelObjectService modelObjectService, final String contextURL) {
		jmsQueueC.sendRecvAsync(application.getId(), new MessageListener() {
			@Override
			public void onMessage(Message arg0) {
				try {
		        	ObjectMessage objMessage = (ObjectMessage)arg0;
		        	String nodeRef = (String) objMessage.getObject();
		        	applicationService.addContentToChild(nodeRef, getCMISSession(),
		        			getMessages("GET", "manage-application", container, modelObjectService),
		        			contextURL);
				} catch (JMSException e) {
					LOGGER.error("Error on Message for addContentToChild application" , e);
				}
			}
		});
	}

	private void controllaCodiceFiscale(Map<String, Object> map, Folder application) throws CMISApplicationException {
		GregorianCalendar dataNascita = new GregorianCalendar();
		dataNascita.setTime(((GregorianCalendar)map.get(JCONONPropertyIds.APPLICATION_DATA_NASCITA.value())).getTime());

		String cognome, nome, sesso, codiceFiscale, cdCatastale=null;
		if (map.get(JCONONPropertyIds.APPLICATION_COGNOME.value())!=null)
			cognome=(String)map.get(JCONONPropertyIds.APPLICATION_COGNOME.value());
		else
			cognome=(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_COGNOME.value());

		if (map.get(JCONONPropertyIds.APPLICATION_NOME.value())!=null)
			nome=(String)map.get(JCONONPropertyIds.APPLICATION_NOME.value());
		else
			nome=(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_NOME.value());

		if (map.get(JCONONPropertyIds.APPLICATION_SESSO.value())!=null)
			sesso=(String)map.get(JCONONPropertyIds.APPLICATION_SESSO.value());
		else
			sesso=(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_SESSO.value());

		if (map.get(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value())!=null)
			codiceFiscale=(String)map.get(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());
		else
			codiceFiscale=(String)application.getPropertyValue(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());

		it.cnr.jconon.util.CodiceFiscaleControllo.parseCodiceFiscale(
			cognome,
			nome,
			String.valueOf(dataNascita.get(GregorianCalendar.YEAR)%100),
			String.valueOf(dataNascita.get(GregorianCalendar.MONTH)),
			String.valueOf(dataNascita.get(GregorianCalendar.DAY_OF_MONTH)),
			sesso,
			cdCatastale,
			codiceFiscale);
	}

	private void sendConfirmMail(CMISUser applicationUser, Map<String, Object> model,
			Folder applicationFolder, Folder callFolder, Container container, ModelObjectService modelObjectService,
			String contextURL) throws MailException {
		final StringWriter htmlWriter = new StringWriter();
		model.put("folder", applicationFolder);
		model.put("call", callFolder);
		getFreemarkerTemplateProcessor().process("/pages/application/application.registration.html.ftl",
				model, htmlWriter);
		EmailMessage message = new EmailMessage();
		List<String> emailList = new ArrayList<String>(), emailBccList = new ArrayList<String>();
		emailList.add(applicationUser.getEmail());
		model.put("email_comunicazione", applicationUser.getEmail());
		message.setRecipients(emailList);
		if (emailBccList.isEmpty())
			message.setBccRecipients(emailBccList);
		message.setSubject("[concorsi] " + I18NUtil.getMessage("subject-confirm-domanda",callFolder.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())));
		message.setBody(htmlWriter.getBuffer());
		byte[] stampaByte = printApplication.getRicevutaReportModel(applicationFolder, container, modelObjectService, contextURL);

		String nameRicevutaReportModel = applicationService.getNameRicevutaReportModel(cmisService.createAdminSession(), applicationFolder);
		printApplication.archiviaRicevutaReportModel(applicationFolder, new ByteArrayInputStream(stampaByte),nameRicevutaReportModel, true);
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(JCONONPropertyIds.APPLICATION_DUMMY.value(), "{\"stampa_archiviata\" : true}");
		applicationFolder.updateProperties(properties);
		message.setAttachments(Arrays.asList(new AttachmentBean(nameRicevutaReportModel, stampaByte)));
		mailService.send(message);
	}

}