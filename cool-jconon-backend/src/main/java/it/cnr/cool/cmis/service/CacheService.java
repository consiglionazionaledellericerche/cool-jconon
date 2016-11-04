package it.cnr.cool.cmis.service;

import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.Pair;

import java.util.List;

import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;

public interface CacheService {
	public void register(GlobalCache globalCache);
	public void register(UserCache userCache);
	public List<Pair<String, String>> getCaches(CMISUser user, BindingSession session);
	public List<Pair<String, Object>> getPublicCaches();
	public void clearCache();
	public void clearCache(String userId);
	public void clearGroupCache(String groupName, BindingSession cmisSession);
	public void clearCacheWithName(String name);
}
