package it.cnr.cool.cmis.service;

import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.Pair;

import java.util.List;

import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;

public interface CacheService {
	void register(GlobalCache globalCache);
	void register(UserCache userCache);
	List<Pair<String, String>> getCaches(CMISUser user, BindingSession session);
	List<Pair<String, Object>> getPublicCaches();
	void clearCache();
	void clearCache(String userId);
	void clearGroupCache(String groupName, BindingSession cmisSession);
	void clearCacheWithName(String name);
}
