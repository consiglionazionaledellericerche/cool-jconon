package it.cnr.cool.cmis.service.impl;

import it.cnr.cool.cmis.service.Cache;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.GlobalCache;
import it.cnr.cool.cmis.service.UserCache;
import it.cnr.cool.cmis.service.VersionService;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.Pair;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

public class CacheServiceImpl implements CacheService, InitializingBean{

	private List<GlobalCache> globalCaches;
	private List<UserCache> userCaches;
	@Autowired
	private VersionService versionService;
	@Autowired
	private UserService userService;

	private static final Logger LOGGER = LoggerFactory
			.getLogger(CacheServiceImpl.class);

	@Override
	public void afterPropertiesSet() throws Exception {
		globalCaches = new ArrayList<GlobalCache>();
		userCaches = new ArrayList<UserCache>();
	}

	@Override
	public void register(GlobalCache globalCache){
		globalCaches.add(globalCache);
		if (versionService.isProduction()) {
			LOGGER.debug("Loading global cache " + globalCache.name());
			globalCache.get();			
		}
	}

	@Override
	public void register(UserCache userCache){
		userCaches.add(userCache);
	}

	@Override
	public List<Pair<String, String>> getCaches(CMISUser user,
			BindingSession session) {
		List<Pair<String, String>> caches = new ArrayList<Pair<String, String>>();
		if (user != null && !user.isGuest()) {
			for (UserCache userCache : userCaches) {
				caches.add(new Pair<String, String>(userCache.name(), userCache.get(user, session)));
			}
		}
		return caches;
	}

	@Override
	public List<Pair<String, Object>> getPublicCaches() {
		List<Pair<String, Object>> caches = new ArrayList<Pair<String, Object>>();
		for (GlobalCache globalCache : globalCaches) {
			LOGGER.info("Start cache with name: {} at {}", globalCache.name(), new Date());
			caches.add(new Pair<String, Object>(globalCache.name(), globalCache
					.get()));
			LOGGER.info("End cache with name: {} at {}", globalCache.name(), new Date());
		}
		return caches;
	}

	@Override
	public void clearCacheWithName(String name){
		LOGGER.debug("Reset cache service with name: " + name);
		for (Cache cache : globalCaches) {
			if (cache.name().equals(name))
				cache.clear();
		}
		for (Cache cache : userCaches) {
			if (cache.name().equals(name))
				cache.clear();
		}
	}

	
	@Override
	public void clearCache(){
		LOGGER.debug("Reset cache service");
		for (Cache cache : globalCaches) {
			cache.clear();
		}
		for (Cache cache : userCaches) {
			cache.clear();
		}
	}

	@Override
	public void clearCache(String username) {
		for (UserCache cache : userCaches) {
			cache.clear(username);
		}		
	}

	@Override
	public void clearGroupCache(String groupName, BindingSession cmisSession) {
		try {
			for (String username : userService.findMembers(groupName, cmisSession)) {
				clearCache(username);
			}
		} catch (CoolUserFactoryException e) {
			LOGGER.error("Cannot clear cache for group:" + groupName, e);
		}
	}
}