package it.cnr.cool.web.scripts;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.FolderService;
import it.cnr.cool.cmis.service.VersionService;
import it.cnr.cool.security.PermissionEnum;
import it.cnr.cool.util.CalendarUtil;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.scripts.exception.StatusApplicationException;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpSession;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectId;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.Property;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.Updatability;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class CMISWebScript extends AbstractWebScript implements InitializingBean{
	private static final Logger LOGGER = LoggerFactory.getLogger(CMISWebScript.class);

	private static final Set<Updatability> CREATE_UPDATABILITY = new HashSet<Updatability>();

	static {
		CREATE_UPDATABILITY.add(Updatability.ONCREATE);
		CREATE_UPDATABILITY.add(Updatability.READWRITE);
	}
	@Autowired
	protected CMISService cmisService;
	@Autowired
	protected FolderService folderService;
	@Autowired
	protected CacheService cacheService;

	@Autowired
	protected ArrayList<?> externalLink;
	@Autowired
	protected OperationContext cmisAclOperationContext;

	protected String dataDictionaryPath;
	protected VersionService versionService;


	public void setVersionService(VersionService versionService) {
		this.versionService = versionService;
	}

	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req,
			Status status, Cache cache) {
		Map<String, Object> model = super.executeImpl(req, status, cache);
		model.put("calendarUtil", new CalendarUtil());
		model.put("cmisBaseProperty", staticFieldProperty(PropertyIds.class));
		model.put("cmisPermission", enumProperty(PermissionEnum.class));
		model.put("dataDictionary", folderService.getDataDictionaryId());
		BindingSession bindingSession = cmisService.getCurrentBindingSession(ServletUtil.getRequest());
		model.put("caches", cacheService.getCaches(
				ThreadLocalRequestContext.getRequestContext().getUser(), bindingSession ));
		model.put("publicCaches", cacheService.getPublicCaches());
		model.put("cmisService", cmisService);
		model.put("cmisSession", getCMISSession());
		model.put("cmisAclOperationContext",cmisAclOperationContext);
		model.put("cmisDateFormat", StringUtil.CMIS_DATEFORMAT);
		model.put("artifact_version", versionService.getVersion());
		model.put("isProduction", versionService.isProduction());
		return model;
	}

	private Map<String, Object> enumProperty(Class<?> clazz){
		Map<String, Object> model = new HashMap<String, Object>();
		if (clazz.getEnumConstants() != null){
			for (Object value : Arrays.asList(clazz.getEnumConstants())) {
				Enum<?> enumValue = (Enum<?>)value;
				model.put(enumValue.name(), enumValue);
			}
		}
		return model;
	}

	private Map<String, Object> staticFieldProperty(Class<?> clazz){
		Map<String, Object> model = new HashMap<String, Object>();
		for (Field field : clazz.getDeclaredFields()) {
			if (Modifier.isStatic(field.getModifiers()))
				try {
					model.put(field.getName(), field.get(null));
				} catch (IllegalArgumentException e) {
					throw new WebScriptException("", e);
				} catch (IllegalAccessException e) {
					throw new WebScriptException("", e);
				}
		}
		return model;
	}

	protected Session getCMISSession(){
		HttpSession session = ServletUtil.getSession(false);
		return applicationContext.getBean("cmisService", CMISService.class).getCurrentCMISSession(session );
	}

	@SuppressWarnings("unchecked")
	protected ItemIterable<QueryResult> getCMISQueryResult(){
		return (ItemIterable<QueryResult>) ServletUtil.getRequest().getSession(false).getAttribute(CMISService.QUERY_RESULT);
	}

	protected void setCMISQueryResult(ItemIterable<QueryResult> queryResult){
		ServletUtil.getRequest().getSession(false).setAttribute(CMISService.QUERY_RESULT, queryResult);
	}

	public ObjectId createObjectId(String id) {
		return new ObjectIdImpl(id);
	}

	protected Map<String, Object> populateMetadataFromFolder(Folder folder) throws ParseException{
		final boolean debug = LOGGER.isDebugEnabled();
		Map<String, Object> properties = new HashMap<String, Object>();
		for (Property<?> property : folder.getProperties()) {
			Serializable propertyValue = (Serializable)property.getValue();
			if (debug)
				LOGGER.debug(property.getId() + " has value "+propertyValue);
			properties.put(property.getId(), propertyValue);
		}
		return properties;
	}




	protected void generateStatus(Status status, StatusApplicationException e) {
		status.setCode(e.getStatus().getCode());
		status.setMessage(e.getStatus().getMessage());
		status.setRedirect(e.getStatus().getRedirect());
	}

	protected void handleStatusException(String message) throws StatusApplicationException{
		throw new StatusApplicationException(message);
	}

	protected void handleStatusException(int code, String message) throws StatusApplicationException{
		throw new StatusApplicationException(code, message);
	}

	@Override
	public void afterPropertiesSet() throws Exception {
	}

	public void setDataDictionaryPath(String dataDictionaryPath) {
		this.dataDictionaryPath = dataDictionaryPath;
	}

	public String getDataDictionaryPath() {
		return dataDictionaryPath;
	}
}