package it.cnr.jconon.service.cache;

import it.cnr.bulkinfo.cool.BulkInfoCool;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.GlobalCache;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.jconon.cmis.model.JCONONFolderType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

public class ApplicationAffixService implements GlobalCache , InitializingBean{
	@Autowired
	private CacheService cacheService;

	@Autowired
	private BulkInfoCoolService bulkInfoService;

	private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationAffixService.class);

	private final String JSONLIST_APPLICATION_AFFIX = "jsonlistAffixApplication";
	private String cache;
	@Override
	public void afterPropertiesSet() throws Exception {
		cacheService.register(this);
	}

	@Override
	public String name() {
		return JSONLIST_APPLICATION_AFFIX;
	}

	@Override
	public void clear() {
		cache = null;
	}

	@Override
	public String get() {
		if (cache != null)
			return cache;
		JSONArray json = new JSONArray();

		String bulkInfoName = JCONONFolderType.JCONON_APPLICATION.value().replace(":", "_");

		BulkInfoCool bulkInfo = bulkInfoService.find(bulkInfoName);

		for (String formName : bulkInfo.getForms().keySet()) {
			if (formName.startsWith("affix")) {
				try {
					JSONObject jsonObj = new JSONObject();
					jsonObj.put("key", formName);
					jsonObj.put("label", formName);
					jsonObj.put("defaultLabel", formName);
					json.put(jsonObj);
				} catch (JSONException e) {
					LOGGER.error(e.getMessage(), e);
				}
			}
		}
		cache = json.toString();
		return cache;
	}
}
