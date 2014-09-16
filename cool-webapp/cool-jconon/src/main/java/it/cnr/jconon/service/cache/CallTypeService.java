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

	@Override
	public String get() {
		if (cache != null)
			return cache;
		ItemIterable<ObjectType> objectTypes = cmisService.createAdminSession().
				getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false);
		JSONArray json = new JSONArray();

		for (ObjectType objectType : objectTypes) {
			try {
				JSONObject jsonObj = new JSONObject();
				jsonObj.put("id", objectType.getId());
				jsonObj.put("title", objectType.getDisplayName());
				jsonObj.put("queryName", objectType.getQueryName());
				json.put(jsonObj);
			} catch (JSONException e) {
				LOGGER.error(e.getMessage(), e);
			}
		}
		cache = json.toString();
		return cache;
	}
}
