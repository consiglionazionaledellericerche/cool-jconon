package it.cnr.jconon.service.cache;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.GlobalCache;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;

import java.util.HashMap;
import java.util.Map;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectId;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

public class CompetitionFolderService implements GlobalCache , InitializingBean{
	@Autowired
	private CMISService cmisService;
	@Autowired
	private CacheService cacheService;
	private static final Logger LOGGER = LoggerFactory.getLogger(CompetitionFolderService.class);

	private final String COMPETITION = "competition";
	private Folder cache;
	@Override
	public void afterPropertiesSet() throws Exception {
		cacheService.register(this);
	}

	@Override
	public String name() {
		return COMPETITION;
	}

	@Override
	public void clear() {
		cache = null;
	}

	public Folder getCompetition() {
		get();
		return cache;
	}

	@Override
	public String get() {
		if (cache == null) {
			Session session = cmisService.createAdminSession();
			Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_COMPETITION.queryName());
			ItemIterable<QueryResult> results = criteria.executeQuery(session, false, session.getDefaultContext());
			if (results.getTotalNumItems() == 0) {
				Map<String, String> properties = new HashMap<String, String>();
				properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONFolderType.JCONON_COMPETITION.value());
				properties.put(PropertyIds.NAME, "Selezioni on-line");
				cache = (Folder) session.getObject(session.createFolder(properties, session.getRootFolder()));
			} else {
				for (QueryResult queryResult : results) {
					ObjectId objectId = session.createObjectId((String) queryResult.getPropertyValueById(PropertyIds.OBJECT_ID));
					cache = (Folder) session.getObject(objectId);
				}
			}
		}
		JSONObject jsonObj = new JSONObject();
		try {
			jsonObj.put("id", cache.getId());
			jsonObj.put("path", cache.getPath());
		} catch (JSONException e) {
			LOGGER.error(e.getMessage(), e);
		}
		return jsonObj.toString();
	}
}
