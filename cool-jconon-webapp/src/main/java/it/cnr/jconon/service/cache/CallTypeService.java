package it.cnr.jconon.service.cache;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.GlobalCache;
import it.cnr.jconon.cmis.model.JCONONFolderType;

import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

public class CallTypeService implements GlobalCache , InitializingBean{
	@Autowired
	private CMISService cmisService;
	@Autowired
	private CacheService cacheService;
	private static final Logger LOGGER = LoggerFactory.getLogger(CallTypeService.class);

	private final String JSONLIST_CALL_TYPE = "jsonlistCallType";
	private String cache;
	@Override
	public void afterPropertiesSet() throws Exception {
		cacheService.register(this);
	}

	@Override
	public String name() {
		return JSONLIST_CALL_TYPE;
	}

	@Override
	public void clear() {
		cache = null;
	}

	private void populateJsonlistCallType(JSONArray json, ItemIterable<ObjectType> objectTypes, JSONArray jsonDisplay) {
		for (ObjectType objectType : objectTypes) {
			try {
				JSONObject jsonObj = new JSONObject();
				jsonObj.put("id", objectType.getId());
				jsonObj.put("title", objectType.getDisplayName());
				jsonObj.put("description", objectType.getDescription());
				jsonObj.put("queryName", objectType.getQueryName());
				jsonObj.put("display", true);
				json.put(jsonObj);
				if (jsonDisplay != null) {
					jsonObj.put("display", false);
					jsonDisplay.put(jsonObj);
				}					
				ItemIterable<ObjectType> childTypes = cmisService.createAdminSession().getTypeChildren(objectType.getId(), false);
				if (childTypes.getTotalNumItems() > 0) {
					JSONArray jsonChilds = new JSONArray();
					jsonObj.put("childs", jsonChilds);
					populateJsonlistCallType(jsonChilds, childTypes, json);
				}
			} catch (JSONException e) {
				LOGGER.error(e.getMessage(), e);
			}
		}
		
	}
	@Override
	public String get() {
		if (cache != null)
			return cache;
		ItemIterable<ObjectType> objectTypes = cmisService.createAdminSession().
				getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false);
		JSONArray json = new JSONArray();
		populateJsonlistCallType(json, objectTypes, null);
		cache = json.toString();
		return cache;
	}
}