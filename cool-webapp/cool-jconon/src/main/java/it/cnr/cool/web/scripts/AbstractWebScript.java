package it.cnr.cool.web.scripts;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.controller.WebScriptController;
import it.cnr.cool.exception.CoolClientException;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.web.PermissionServiceImpl;
import it.cnr.cool.web.scripts.exception.CMISApplicationException;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.cool.web.scripts.processor.LocaleFTLTemplateProcessor;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.exceptions.CmisPermissionDeniedException;
import org.apache.commons.httpclient.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.extensions.surf.ModelObjectService;
import org.springframework.extensions.surf.ObjectPersistenceService;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.surf.site.AuthenticationUtil;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.surf.types.Component;
import org.springframework.extensions.surf.types.Page;
import org.springframework.extensions.surf.util.I18NUtil;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Container;
import org.springframework.extensions.webscripts.Description.RequiredAuthentication;
import org.springframework.extensions.webscripts.Match;
import org.springframework.extensions.webscripts.MessageMethod;
import org.springframework.extensions.webscripts.ScriptContent;
import org.springframework.extensions.webscripts.ScriptMessage;
import org.springframework.extensions.webscripts.ScriptProcessor;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.StatusTemplate;
import org.springframework.extensions.webscripts.StatusTemplateFactory;
import org.springframework.extensions.webscripts.URLHelper;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptPropertyResourceBundle;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;
import org.springframework.extensions.webscripts.connector.User;
import org.springframework.web.servlet.LocaleResolver;

public abstract class AbstractWebScript extends
		org.springframework.extensions.webscripts.AbstractWebScript implements
		ApplicationContextAware {
	// Logger
	private static final Logger LOGGER = LoggerFactory
			.getLogger(AbstractWebScript.class);

	private static final String CRUD_STATUS = "crudStatus";
	private static final String STATUS_TO_BE_INSERT = "INSERT";
	private static final String STATUS_TO_BE_UPDATE = "UPDATE";
	private static final String STATUS_TO_BE_DELETE = "DELETE";

	protected ApplicationContext applicationContext;
	protected ObjectPersistenceService objectPersistenceService;
	// MessageMessage helper - thread safe single instance
	private ScriptMessage webScriptMessage = null;
	private MessageMethod messageMethod = null;

	protected PermissionServiceImpl permission;
	protected UserService userService;
	private LocaleResolver localeResolver;

	@Autowired
	private CMISService cmisService;

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public void setPermission(PermissionServiceImpl permission) {
		this.permission = permission;
	}

	public void setLocaleResolver(LocaleResolver localeResolver) {
		this.localeResolver = localeResolver;
	}

	public LocaleFTLTemplateProcessor getFreemarkerTemplateProcessor() {
		return applicationContext.getBean(
				"webframework.webscripts.templateprocessor.locale.freemarker",
				LocaleFTLTemplateProcessor.class);
	}

	public void setObjectPersistenceService(
			ObjectPersistenceService objectPersistenceService) {
		this.objectPersistenceService = objectPersistenceService;
	}

	protected URLHelper getURLHelper() {
		return new URLHelper(ThreadLocalRequestContext.getRequestContext());
	}

	private String getMethod() {
		if (ServletUtil.getRequest().getParameter("httpMethod") != null)
			return ServletUtil.getRequest().getParameter("httpMethod");
		return ServletUtil.getRequest().getMethod();
	}

	protected String getCRUDStatus() {
		return ServletUtil.getRequest().getParameter(CRUD_STATUS);
	}

	protected boolean isStatusToBeInsert() {
		return getCRUDStatus() == null
				|| getCRUDStatus().equalsIgnoreCase(STATUS_TO_BE_INSERT);
	}

	protected boolean isStatusToBeUpdate() {
		return STATUS_TO_BE_UPDATE.equalsIgnoreCase(getCRUDStatus());
	}

	protected boolean isStatusToBeDelete() {
		return STATUS_TO_BE_DELETE.equalsIgnoreCase(getCRUDStatus());
	}

	protected boolean isGET() {
		return getMethod().equals(WebScriptController.METHOD_GET);
	}

	protected boolean isPOST() {
		return getMethod().equals(WebScriptController.METHOD_POST);
	}

	protected boolean isPUT() {
		return getMethod().equals(WebScriptController.METHOD_PUT);
	}

	protected boolean isDELETE() {
		return getMethod().equals(WebScriptController.METHOD_DELETE);
	}

	protected String getServerPath() {
		return ServletUtil
				.getRequest()
				.getRequestURL()
				.subSequence(
						0,
						ServletUtil.getRequest().getRequestURL()
								.indexOf(getURLHelper().getContext()))
				.toString();
	}

	/**
	 * @return the ScriptMessage instance for this WebScript
	 */
	protected ScriptMessage getWebScriptMessage() {
		if (this.webScriptMessage == null) {
			this.webScriptMessage = new ScriptMessage(this);
		}
		return this.webScriptMessage;
	}

	/**
	 * @return the MessageMethod instance for this WebScript
	 */
	private MessageMethod getMessageMethod() {
		if (this.messageMethod == null) {
			this.messageMethod = new MessageMethod(this);
		}
		return this.messageMethod;
	}

	protected Map<String, Object> addToTemplateModel(
			Map<String, Object> templateModel) {
		templateModel.put("url", getURLHelper());
		templateModel.put("serverPath", getServerPath());
		templateModel.put("message", getMessageMethod());
		return templateModel;
	}

	protected void handleCMISApplicationException(String msgId, Throwable cause) {
		throw new CMISApplicationException(msgId, cause);
	}

	protected void handleCMISApplicationException(String msgId) {
		throw new CMISApplicationException(msgId);
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		this.applicationContext = applicationContext;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.alfresco.web.scripts.WebScript#execute(org.alfresco.web.scripts.
	 * WebScriptRequest, org.alfresco.web.scripts.WebScriptResponse)
	 */
	@Override
	public void execute(WebScriptRequest req, WebScriptResponse res)
			throws IOException {
		localeResolver.resolveLocale(ServletUtil.getRequest());
		String url = req.getServiceMatch().getPath();
		String method = ServletUtil.getRequest().getMethod();
		User user = (User) ServletUtil.getRequest().getUserPrincipal();
		if (user == null) {
			user = ThreadLocalRequestContext.getRequestContext().getUser();
		}
		// Controllo i permessi su rbac solo se l'authentication del webscript è
		// dichiarata user.
		if (RequiredAuthentication.user.equals(getDescription()
				.getRequiredAuthentication()) && !permission.isAuthorized(url, method, user.isGuest() ? null
					: (CMISUser) user)) {
				String message = user.getId() + " unauthorized to " + method
						+ " " + url;
				throw createStatusException(new WebScriptException(HttpStatus.SC_FORBIDDEN, message), req, res);

		}

		// retrieve requested format
		String format = req.getFormat();

		try {
			// establish mimetype from format
			String mimetype = getContainer().getFormatRegistry().getMimeType(
					req.getAgent(), format);
			if (mimetype == null) {
				throw new WebScriptException("Web Script format '" + format
						+ "' is not registered");
			}

			// construct model for script / template
			Status status = new Status();
			Cache cache = new Cache(getDescription().getRequiredCache());
			Map<String, Object> model;
			try {
				model = executeImpl(req, status, cache);
			} catch (ClientMessageException e) {
				model = new HashMap<String, Object>();
				status.setCode(e.getStatus());
				status.setMessage(e.getMessage());
				status.setException(e);
				status.setRedirect(true);
			}

			if (model == null) {
				model = new HashMap<String, Object>(8, 1.0f);
			}
			model.put("status", status);
			model.put("cache", cache);
			model.put("permission", permission);

			try {
				// execute script if it exists
				ScriptDetails script = getExecuteScript(req.getContentType());

				if (script != null) {

					if (LOGGER.isDebugEnabled())
						LOGGER.debug("Executing script "
								+ script.getContent().getPathDescription());

					Map<String, Object> scriptModel = createScriptParameters(
							req, res, script, model);

					//TODO: UN TEMPO QUI SI SAREBBE MESSO NEL MODEL MODEL_BULKINFO = 'scriptBulkInfo'

					// add return model allowing script to add items to template
					// model
					Map<String, Object> returnModel = new HashMap<String, Object>(
							8, 1.0f);
					scriptModel.put("model", returnModel);
					executeScript(script.getContent(), scriptModel);
					mergeScriptModelIntoTemplateModel(script.getContent(),
							returnModel, model);
				}


				// create model for template rendering
				Map<String, Object> templateModel = createTemplateParameters(
						req, res, model);

				// is a redirect to a status specific template required?
				if (status.getRedirect()) {
					sendStatus(req, res, status, cache, format, templateModel);
				} else {
					// render output
					int statusCode = status.getCode();
					if (statusCode != HttpServletResponse.SC_OK
							&& !req.forceSuccessStatus()) {
						if (LOGGER.isDebugEnabled()) {
							LOGGER.debug("Force success status header in response: "
									+ req.forceSuccessStatus());
							LOGGER.debug("Setting status " + statusCode);
						}
						res.setStatus(statusCode);
					}

					// apply location
					String location = status.getLocation();
					if (location != null && location.length() > 0) {
						if (LOGGER.isDebugEnabled())
							LOGGER.debug("Setting location to " + location);
						res.setHeader(WebScriptResponse.HEADER_LOCATION,
								location);
					}

					// apply cache
					res.setCache(cache);

					String callback = null;
					if (getContainer().allowCallbacks()) {
						callback = req.getJSONCallback();
					}
					if (format.equals(WebScriptResponse.JSON_FORMAT)
							&& callback != null) {
						if (LOGGER.isDebugEnabled())
							LOGGER.debug("Rendering JSON callback response: content type="
									+ MimeTypes.JAVASCRIPT.mimetype()
									+ ", status="
									+ statusCode
									+ ", callback="
									+ callback);

						// NOTE: special case for wrapping JSON results in a
						// javascript function callback
						res.setContentType(MimeTypes.JAVASCRIPT.mimetype()
								+ ";charset=UTF-8");
						res.getWriter().write(callback + "(");
					} else {
						if (LOGGER.isDebugEnabled())
							LOGGER.debug("Rendering response: content type="
									+ mimetype + ", status=" + statusCode);

						res.setContentType(mimetype + ";charset=UTF-8");
					}

					// render response according to requested format
					renderFormatTemplate(format, templateModel, res.getWriter());

					if (format.equals(WebScriptResponse.JSON_FORMAT)
							&& callback != null) {
						// NOTE: special case for wrapping JSON results in a
						// javascript function callback
						res.getWriter().write(")");
					}
				}
			} finally {
				// perform any necessary cleanup
				executeFinallyImpl(req, status, cache, model);
			}
		} catch (Throwable e) {
			if (LOGGER.isDebugEnabled()) {
				StringWriter stack = new StringWriter();
				e.printStackTrace(new PrintWriter(stack));
				LOGGER.debug("Caught exception; decorating with appropriate status template : "
						+ stack.toString());
			}
			throw handleException(e, req, res);
		}
	}


	protected WebScriptException handleException(Throwable throwable, final WebScriptRequest req, final WebScriptResponse res) {
        try
        {

			try {
				throw throwable;
			} catch (CoolClientException coolClientException) {
				throw new ClientMessageException(
						coolClientException.getMessage());
			}


        }
        catch(final ClientMessageException clientMessageException)
        {
        	clientMessageException.setStatusTemplateFactory(new StatusTemplateFactory()
            {
                @Override
				public Map<String, Object> getStatusModel()
                {
                    return createTemplateParameters(req, res, null);
                }

                @Override
				public StatusTemplate getStatusTemplate()
                {
                    int statusCode = clientMessageException.getStatus();
                    String format = req.getFormat();
                    String scriptId = getDescription().getId();
                    return AbstractWebScript.this.getStatusTemplate(scriptId, statusCode, (format == null) ? "" : format);
                }
            });
        	return clientMessageException;
        }
        catch(CMISApplicationException applicationException)
        {
        	return applicationException;
        }
        catch(CmisPermissionDeniedException permissionDeniedException)
        {
        	/**
        	 * Pre-Condition: Controllo la validità del ticket di Alfresco
        	 * Post-Condition: Se il ticket è ancora valido lancio HttpStatus.SC_FORBIDDEN altrimenti
        	 * lancio HttpStatus.SC_UNAUTHORIZED  e richiamo AuthenticationUtil.logout(request, response);
        	 * da cnr.url.js verrà mostrato il warning di sessione scaduta.
        	 */
        	HttpSession session = ServletUtil.getSession(false);
			String ticket = (String) session.getAttribute(CMISService.ALFRESCO_TICKET);
        	int status;

        	BindingSession bindingSession = (BindingSession) session.getAttribute(CMISService.BINDING_SESSION);

        	if (cmisService.validateTicket(ticket, bindingSession)) {
        		status = HttpStatus.SC_FORBIDDEN;
        	} else {
        		AuthenticationUtil.logout(ServletUtil.getRequest(), null);
        		status = HttpStatus.SC_UNAUTHORIZED;
        	}
        	return new WebScriptException(status, permissionDeniedException.getErrorContent());


        }
        catch(WebScriptException webScriptException)
        {
        	if (webScriptException.getCause() != null)
        		return handleException(webScriptException.getCause(), req, res);
			return webScriptException;
        }
        catch(Throwable throwable1)
        {
        	WebScriptException webScriptException = createStatusException(throwable1, req, res);
			if (webScriptException.getStatus() < 1000) {
				applicationContext.getBean("mailService", MailService.class)
						.sendErrorMessage(
								ThreadLocalRequestContext.getRequestContext()
										.getUserId(), req.getURL(), req.getServerPath(), webScriptException);
			}
			return webScriptException;
        }
	}

	/**
	 * Merge script generated model into template-ready model
	 *
	 * @param scriptContent
	 *            script content
	 * @param scriptModel
	 *            script model
	 * @param templateModel
	 *            template model
	 */
	final private void mergeScriptModelIntoTemplateModel(
			ScriptContent scriptContent, Map<String, Object> scriptModel,
			Map<String, Object> templateModel) {
		// determine script processor
		ScriptProcessor scriptProcessor = getContainer()
				.getScriptProcessorRegistry().getScriptProcessor(scriptContent);
		if (scriptProcessor != null) {
			for (Map.Entry<String, Object> entry : scriptModel.entrySet()) {
				// retrieve script model value
				Object value = entry.getValue();
				Object templateValue = scriptProcessor.unwrapValue(value);
				templateModel.put(entry.getKey(), templateValue);
			}
		}
	}


	/**
	 * Execute custom Java logic
	 *
	 * @param req
	 *            Web Script request
	 * @param status
	 *            Web Script status
	 * @param cache
	 *            Web Script cache
	 * @return custom service model
	 */
	protected Map<String, Object> executeImpl(WebScriptRequest req,
			Status status, Cache cache) {
		// NOTE: Redirect to those web scripts implemented before cache support
		// and v2.9
		return new HashMap<String, Object>();
	}

	/**
	 * Execute custom Java logic to clean up any resources
	 *
	 * @param req
	 *            Web Script request
	 * @param status
	 *            Web Script status
	 * @param cache
	 *            Web Script cache
	 * @param model
	 *            model
	 */
	protected void executeFinallyImpl(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model) {
	}

	/**
	 * Render a template (of given format) to the Web Script Response
	 *
	 * @param format
	 *            template format (null, default format)
	 * @param model
	 *            data model to render
	 * @param writer
	 *            where to output
	 */
	final protected void renderFormatTemplate(String format,
			Map<String, Object> model, Writer writer) {
		format = (format == null) ? "" : format;

		String templatePath = getDescription().getId() + "." + format;

		if (LOGGER.isDebugEnabled())
			LOGGER.debug("Rendering template '" + templatePath + "'");

		renderTemplate(templatePath, model, writer);
	}

	/**
	 * Get map of template parameters that are available with given request.
	 * This method is for FreeMarker Editor Extension plugin of Surf Dev Tools.
	 *
	 * @param req
	 *            webscript request
	 * @param res
	 *            webscript response
	 * @return
	 * @throws IOException
	 */
	public Map<String, Object> getTemplateModel(WebScriptRequest req,
			WebScriptResponse res) throws IOException {
		// construct model for script / template
		Status status = new Status();
		Cache cache = new Cache(getDescription().getRequiredCache());
		Map<String, Object> model = new HashMap<String, Object>(8, 1.0f);

		model.put("status", status);
		model.put("cache", cache);

		// execute script if it exists
		ScriptDetails script = getExecuteScript(req.getContentType());
		if (script != null) {
			Map<String, Object> scriptModel = createScriptParameters(req, res,
					script, model);
			// add return model allowing script to add items to template model
			Map<String, Object> returnModel = new HashMap<String, Object>(8,
					1.0f);
			scriptModel.put("model", returnModel);
			executeScript(script.getContent(), scriptModel);
			mergeScriptModelIntoTemplateModel(script.getContent(), returnModel,
					model);
		}
		// create model for template rendering
		return createTemplateParameters(req, res, model);
	}

	public Map<String, String> getMessages(String method, String uri){
		return getMessages(method, uri, getContainer(), ThreadLocalRequestContext
				.getRequestContext().getObjectService());
	}

	public Map<String, String> getMessages(String method, String uri, Container container, ModelObjectService modelObjectService){
		Component component = modelObjectService.getComponent(Page.TYPE_ID, "main", uri);

		Map<String, String> global = new HashMap<String, String>();
		global.putAll(I18NUtil.getAllMessages());
		if (method != null && uri != null && component != null) {
			String webScriptUri = component.getURL();

			Match match = container.getRegistry().findWebScript(method,
					webScriptUri);

			if (match != null) {
				WebScriptPropertyResourceBundle properties = (WebScriptPropertyResourceBundle) match
						.getWebScript()
						.getResources();

				if (properties != null) {
					for (String key : properties.keySet()) {
						global.put(key, properties.getString(key));
					}
				}
			} else {
				LOGGER.warn("properties not found for path " + method + " "
						+ uri);
			}

		}
		return global;

	}
}
