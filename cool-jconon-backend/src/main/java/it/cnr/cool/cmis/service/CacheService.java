package it.cnr.cool.cmis.service;

import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.Pair;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;

import java.io.Serializable;
import java.util.List;

public interface CacheService {
	void register(GlobalCache globalCache);
	void register(UserCache userCache);
	List<Pair<String, String>> getCaches(CMISUser user, BindingSession session);
	List<Pair<String, Serializable>> getPublicCaches();
	void clearCache();
	void clearCache(String userId);
	void clearGroupCache(String groupName, BindingSession cmisSession);
	void clearCacheWithName(String name);
}
