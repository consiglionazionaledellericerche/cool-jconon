package it.cnr.si.cool.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.listener.LogoutListener;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.CommonRestService;
import it.cnr.cool.util.StringUtil;
import it.cnr.si.cool.jconon.repository.CommonRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.annotation.PostConstruct;
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
        CMISUser user = cmisService.getCMISUserFromSession(req);
        BindingSession bindingSession = cmisService
                .getCurrentBindingSession(req);
        Map<String, Object> model = commonRestService.getStringObjectMap(user);
        model.put("groupsHash", getMd5(user.getGroups()));
        model.put("enableTypeCalls", commonRepository.getEnableTypeCalls(user.getId(), user, bindingSession));
        model.put("managers-call", commonRepository.getManagersCall(user.getId(), bindingSession));
        model.put("bootstrapVersion", "2");  
        Optional.ofNullable(pageId).map(x -> model.put("pageId", x));
        Optional.ofNullable(env.getProperty("analytics.id")).map(x -> model.put("ga", x));
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
	@PostConstruct
	public void init() {
		userService.addLogoutListener(new LogoutListener() {			
			@Override
			public void logout(String userId) {
				commonRepository.evictEnableTypeCalls(userId);
				commonRepository.evictManagersCall(userId);				
			}
		});		
	}    
    
}