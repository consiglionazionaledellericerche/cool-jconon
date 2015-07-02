package it.cnr.jconon.service.cache;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.GlobalCache;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;

import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

public class ApplicationFieldNotRequiredService implements GlobalCache , InitializingBean{
	@Autowired
	private CMISService cmisService;
	@Autowired
	private CacheService cacheService;
	private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationFieldNotRequiredService.class);

	private final String JSONLIST_APPLICATION_FIELD_NOT_REQUIRED = "jsonlistApplicationFieldsNotRequired";
	private String cache;
	@Override
	public void afterPropertiesSet() throws Exception {
		cacheService.register(this);
	}

	@Override
	public String name() {
		return JSONLIST_APPLICATION_FIELD_NOT_REQUIRED;
	}

	@Override
	public void clear() {
		cache = null;
	}

	@Override
	public String get() {
		if (cache != null)
			return cache;
		ObjectType objectType = cmisService.createAdminSession().
				getTypeDefinition(JCONONFolderType.JCONON_APPLICATION.value());
		JSONArray json = new JSONArray();

		for (PropertyDefinition<?> propertyDefinition : objectType.getPropertyDefinitions().values()) {
			if (propertyDefinition.isInherited())
				continue;
			LOGGER.debug(propertyDefinition.getId() + " is property of " + JCONONFolderType.JCONON_APPLICATION.value());
			try {
				JSONObject jsonObj = new JSONObject();
				jsonObj.put("key", propertyDefinition.getId());
				jsonObj.put("label", propertyDefinition.getId());
				jsonObj.put("defaultLabel", propertyDefinition.getDisplayName());
				json.put(jsonObj);
			} catch (JSONException e) {
				LOGGER.error(e.getMessage(), e);
			}
		}
		ObjectType objectAspectType = cmisService.createAdminSession().getTypeDefinition(JCONONPolicyType.JCONON_APPLICATION_ASPECT.value());
		completeWithChildren(objectAspectType, json);

		cache = json.toString();
		return cache;
	}

	private void completeWithChildren(ObjectType objectAspectType, JSONArray json) {
		for (ObjectType child : objectAspectType.getChildren()) {
			for (PropertyDefinition<?> propertyDefinition : child.getPropertyDefinitions().values()) {
				if (propertyDefinition.isInherited())
					continue;
				LOGGER.debug(propertyDefinition.getId() + " is property of " + JCONONFolderType.JCONON_APPLICATION.value());
				try {
					JSONObject jsonObj = new JSONObject();
					jsonObj.put("key", propertyDefinition.getId());
					jsonObj.put("label", propertyDefinition.getId());
					jsonObj.put("defaultLabel", child.getDisplayName()+"["+propertyDefinition.getDisplayName()+"]");
					json.put(jsonObj);
				} catch (JSONException e) {
					LOGGER.error(e.getMessage(), e);
				}
			}			
			completeWithChildren(child, json);
		}		
		
	}
}
