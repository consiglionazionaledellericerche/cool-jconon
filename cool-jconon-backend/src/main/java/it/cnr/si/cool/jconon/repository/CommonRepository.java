package it.cnr.si.cool.jconon.repository;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.GroupsUtils;
import it.cnr.cool.web.PermissionService;
import it.cnr.si.cool.jconon.dto.SiperSede;
import it.cnr.si.cool.jconon.repository.dto.ObjectTypeCache;
import it.cnr.si.cool.jconon.service.SiperService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class CommonRepository {
    private static final String AUTH_EXT_GESTORI = "AUTH.EXT.gestori";
	private static final Logger LOGGER = LoggerFactory.getLogger(CommonRepository.class);
    private static final String DEFINITIONS_URL = "service/cnr/jconon/sedi/gestori/";
    
    @Autowired
    private CMISService cmisService;
    @Autowired
    private PermissionService permission;
	@Autowired
	private SiperService siperService;
	@Autowired
	private CacheRepository cacheRepository;

    @Cacheable(value="managers-call", key="#userId")
    public Map<String, List<SiperSede>> getManagersCall(String userId, BindingSession session){
    	Map<String, List<SiperSede>> result = new HashMap<String, List<SiperSede>>();
    	try {
    		String link = cmisService.getBaseURL().concat(DEFINITIONS_URL).concat(userId);
    		UrlBuilder urlBuilder = new UrlBuilder(link);
    		urlBuilder.addParameter("zone", AUTH_EXT_GESTORI);
    		Response response = CmisBindingsHelper.getHttpInvoker(session).invokeGET(urlBuilder, session);
    		ObjectMapper objectMapper = new ObjectMapper();
    		if (response.getResponseCode() == HttpStatus.SC_OK) {
    			@SuppressWarnings("unchecked")
				Map<String, List<String>> readValue = objectMapper.readValue(response.getStream(), Map.class);
    			for (String key : readValue.keySet()) {
    				List<SiperSede> sedi = new ArrayList<SiperSede>();
    				readValue.get(key).forEach(sedeId -> sedi.add(siperService.cacheableSiperSede(sedeId).get()));
    				result.put(key, sedi);
    			}
    		}     		
    	} catch(IOException _ex) {
    		LOGGER.error("Cannot read magagers call for sedi", _ex);    		
    	}
		return result;
    }
    
    @Cacheable(value="enableTypeCalls", key="#userId")
    public List<ObjectTypeCache> getEnableTypeCalls(String userId, CMISUser user, BindingSession session) {
    	List<ObjectTypeCache> result = new ArrayList<ObjectTypeCache>();
    	List<ObjectTypeCache> callType = cacheRepository.getCallType();
    	callType.stream().forEach(x -> {
            boolean isAuthorized = permission.isAuthorized(x.getId(), "PUT",
                    userId, GroupsUtils.getGroups(user));
            LOGGER.debug(x.getId() + " "
                    + (isAuthorized ? "authorized" : "unauthorized"));
            if (isAuthorized) {
            	result.add(x);
            }    		
    	});
        return result;
    }

    @CacheEvict(value="enableTypeCalls", key="#userId")
    public void evictEnableTypeCalls(String userId){
    	LOGGER.info("Evict cache enableTypeCalls for user: {}", userId);
    }

    @CacheEvict(value="managers-call", key="#userId")
    public void evictManagersCall(String userId){
    	LOGGER.info("Evict cache managers-call for user: {}", userId);
    }
    
}