package it.cnr.jconon.service.call;


import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.UserCache;
import it.cnr.cool.cmis.service.VersionService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.search.SiperService;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;

import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class ManagersCallService implements UserCache, InitializingBean {
	@Autowired
	private CacheService cacheService;
	@Autowired
	private CMISService cmisService;
	@Autowired
	private SiperService siperService;
	@Autowired
	private VersionService versionService;

	private String zone;
	
	private Cache<String, String> cache;

	private static final Logger LOGGER = LoggerFactory.getLogger(ManagersCallService.class);

	private static final String DEFINITIONS_URL = "service/cnr/jconon/sedi/gestori/", 
			CACHE_NAME = "managers-call";

	public void setZone(String zone) {
		this.zone = zone;
	}

	@Override
	public String name() {
		return CACHE_NAME;
	}

	@Override
	public void clear() {
		cache.invalidateAll();
	}

	@Override
	public void clear(String username) {
		cache.invalidate(username);
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		cache = CacheBuilder.newBuilder()
				.expireAfterWrite(1, versionService.isProduction() ? TimeUnit.HOURS : TimeUnit.MINUTES)
				.build();
		cacheService.register(this);
	}

	@Override
	public String get(final CMISUser user, final BindingSession session) {
		try {
			return cache.get(user.getId(), new Callable<String>() {
				@Override
				public String call() throws Exception {
					String link = cmisService.getBaseURL().concat(DEFINITIONS_URL).concat(user.getId());
					UrlBuilder urlBuilder = new UrlBuilder(link);
					urlBuilder.addParameter("zone", zone);
					Response response = CmisBindingsHelper.getHttpInvoker(session).invokeGET(urlBuilder, session);
					if (response.getResponseCode() == HttpStatus.SC_OK) {
						JsonObject jsonObject = new JsonParser().parse(
								StringUtil.convertStreamToString(response.getStream())).getAsJsonObject();
						for (Map.Entry<String, JsonElement> key : jsonObject.entrySet()) {
							JsonArray sediKeys = key.getValue().getAsJsonArray();
							JsonArray sediFull = new JsonArray();
							for (Iterator<JsonElement> iterator = sediKeys.iterator(); iterator.hasNext();) {
								sediFull.add(siperService.getSede(iterator.next().getAsString()));
								iterator.remove();
							}
							sediKeys.addAll(sediFull);
						}						
						return String.valueOf(jsonObject);
					} 
					return "{}";
				}
			});
		} catch (ExecutionException e) {
			LOGGER.error("Cannot load managers-call cache for user:" + user.getId(), e);
			throw new ClientMessageException(e.getMessage());
		}
	}
}