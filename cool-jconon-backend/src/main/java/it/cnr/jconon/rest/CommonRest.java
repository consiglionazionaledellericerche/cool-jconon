package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.CommonRestService;
import it.cnr.cool.util.Pair;
import it.cnr.cool.util.StringUtil;
import it.cnr.jconon.repository.CommonRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Created by francesco on 13/07/15.
 */

@Path("common")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class CommonRest {

    private static final Logger LOGGER = LoggerFactory.getLogger(CommonRest.class);

    @Autowired
    private CMISService cmisService;
    @Autowired
    private CommonRestService commonRestService;
    @Autowired
    private CommonRepository commonRepository;
    @Autowired
	private UserService userService;
    
	@Inject
    private Environment env;

    @GET
    public Response get(@Context HttpServletRequest req, @QueryParam("pageId") String pageId) throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
        CMISUser user = cmisService.getCMISUserFromSession(req);
        BindingSession bindingSession = cmisService
                .getCurrentBindingSession(req);
        Map<String, Object> model = commonRestService.getStringObjectMap(user);
        List<Pair<String, String>> caches = new ArrayList<Pair<String,String>>();
        caches.add(getGroupsPair(req));
        caches.add(new Pair<String, String>("enableTypeCalls", commonRepository.getEnableTypeCalls(user.getId(), user, bindingSession)));    
        caches.add(new Pair<String, String>("managers-call", objectMapper.writeValueAsString(
        		commonRepository.getManagersCall(user.getId(), bindingSession))
        ));    
        caches.add(new Pair<String, String>("profile", String.format("\"%s\"", String.join(",", env.getActiveProfiles()))));
        model.put("caches", caches);
        model.put("pageId", pageId);        
        model.put("ga", env.getProperty("analytics.id"));
        return commonRestService.getResponse(model);
    }
    
    @DELETE
    public void delete(@Context HttpServletRequest req, @QueryParam("authortiyName") String authortiyName) {
        BindingSession bindingSession = cmisService
                .getCurrentBindingSession(req);
        if (authortiyName != null) {
            if (authortiyName.startsWith("GROUP_")) {
            	for (String username : userService.findMembers(authortiyName, bindingSession)) {
                	commonRepository.evictEnableTypeCalls(username);
                	commonRepository.evictManagersCall(username);
    			}            	
            } else {
            	commonRepository.evictEnableTypeCalls(authortiyName);
            	commonRepository.evictManagersCall(authortiyName);
            }
        }
    }
    
    private Pair<String, String> getGroupsPair(HttpServletRequest req) {
        CMISUser cmisUserFromSession = cmisService.getCMISUserFromSession(req);
        List<CMISGroup> groups = cmisUserFromSession.getGroups();
        String md5 = getMd5(groups);
        return new Pair<String, String>("groupsHash", String.format("\"%s\"", md5));
    }

    static String getMd5(List<CMISGroup> cmisGroups) {

        if (cmisGroups == null) {
            return "";
        }

        List<String> groups = new ArrayList<>();

        for (CMISGroup group: cmisGroups) {
            String group_name = group.getGroup_name();
            LOGGER.debug(group_name);
            groups.add(group_name);
        }

        Collections.sort(groups);
        String groupsConcatenation = StringUtils.collectionToDelimitedString(groups, "-");
        LOGGER.debug(groupsConcatenation);
        String md5 = StringUtil.getMd5(groupsConcatenation.getBytes());
        LOGGER.debug(md5);
        return md5;
    }
}