package it.cnr.jconon.web.scripts.application;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.JMSService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.cool.web.scripts.exception.ValidationException;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.service.application.ApplicationService;
import it.cnr.jconon.service.call.CallService;
import it.cnr.jconon.web.scripts.print.PrintApplication;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;

import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.OperationContext;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ModelObjectService;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Container;
import org.springframework.extensions.webscripts.Format;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class ApplicationReopenWebScript extends ApplicationWebScript {
	private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationReopenWebScript.class);

	@Autowired
	private CMISService cmisService;
	@Autowired
	private CallService callService;
	@Autowired
	private ApplicationService applicationService;
	@Autowired
	private JMSService jmsQueueA;
	@Autowired
	private PrintApplication printApplication;

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
		Folder newApplication = applicationService.loadApplicationById(getCMISSession(), objectId, model);
		if (newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_DATA_DOMANDA.value()) == null ||
				!newApplication.getPropertyValue(JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value()).equals(CallService.DOMANDA_CONFERMATA)) {
			throw new ClientMessageException("message.error.domanda.no.confermata");
		}
	}

	@Override
	protected void executeAfterPost(WebScriptRequest req, Status status, Cache cache, Map<String, Object> model, Session cmisSession, Boolean created, Folder folder) throws ValidationException {
		super.executeAfterPost(req, status, cache, model, cmisSession, created, folder);
		Folder application = applicationService.loadApplicationById(getCMISSession(), folder.getId(), model);
		Folder call = applicationService.loadCallById(getCMISSession(), application.getParentId(), model);
		callService.isBandoInCorso(call);
		String contextURL = req.getServerPath() + ThreadLocalRequestContext.getRequestContext().getContextPath();
		reopenApplication(cmisService.getAdminSession(), application.getId(), contextURL);
	}

	public void reopenApplication(BindingSession cmisSession, final String applicationSourceId, final String contextURL) {
		String link = cmisService.getBaseURL().concat("service/manage-application/reopen");
		UrlBuilder url = new UrlBuilder(link);
		Response resp = cmisService.getHttpInvoker(cmisSession).invokePOST(url, Format.JSON.mimetype(),
				new Output() {
			@Override
			public void write(OutputStream out) throws Exception {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("applicationSourceId", applicationSourceId);
				out.write(jsonObject.toString().getBytes());
			}
		}, cmisSession);
		int status = resp.getResponseCode();
		if (status == HttpStatus.SC_NOT_FOUND|| status == HttpStatus.SC_BAD_REQUEST|| status == HttpStatus.SC_INTERNAL_SERVER_ERROR) {
			throw new WebScriptException("Reopen Application error. Exception: " + resp.getErrorContent());
		}

		final ModelObjectService modelObjectService = ThreadLocalRequestContext.getRequestContext().getObjectService();
		final Container container = getContainer();

		jmsQueueA.sendRecvAsync(applicationSourceId, new MessageListener() {
			@Override
			public void onMessage(Message arg0) {
				try {
					ObjectMessage objMessage = (ObjectMessage)arg0;
					String applicationSourceId = (String) objMessage.getObject();

					LOGGER.info("Start print application for reopen width id: " + applicationSourceId);

					Session cmisSession = cmisService.createAdminSession();
					Folder application = (Folder) cmisSession.getObject(applicationSourceId);
					application.refresh();
					String nameRicevutaReportModel = applicationService.getNameRicevutaReportModel(cmisSession, application);
					byte[] stampaByte = printApplication.getRicevutaReportModel(cmisSession, application,
							container, modelObjectService, contextURL);
					InputStream is = new ByteArrayInputStream(stampaByte);
					printApplication.archiviaRicevutaReportModel(cmisSession, application, is, nameRicevutaReportModel, false);

					LOGGER.info("End print application for reopen width id: " + applicationSourceId);
				} catch(Exception t) {
					LOGGER.error("Error while print application for reopen width id:" + applicationSourceId, t);
				}
			}
		});


	}
}
