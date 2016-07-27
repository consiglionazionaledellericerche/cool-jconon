package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.CommonRestService;
import it.cnr.cool.util.Pair;
import it.cnr.cool.util.StringUtil;

import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

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
    private CacheService cacheService;
	@Inject
    private Environment env;

    @GET
    public Response get(@Context HttpServletRequest req, @QueryParam("pageId") String pageId) {

        CMISUser user = cmisService.getCMISUserFromSession(req);
        BindingSession bindingSession = cmisService
                .getCurrentBindingSession(req);
        Map<String, Object> model = commonRestService.getStringObjectMap(user);
        List<Pair<String, String>> caches = cacheService.getCaches(user, bindingSession);
        caches.add(getGroupsPair(req));
        caches.add(new Pair<String, String>("profile", String.format("\"%s\"", String.join(",", env.getActiveProfiles()))));
        model.put("caches", caches);
        model.put("pageId", pageId);        
        return commonRestService.getResponse(model);
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

    @DELETE
    public void delete(@Context HttpServletRequest req, @QueryParam("authortiyName") String authortiyName) {
        BindingSession bindingSession = cmisService
                .getCurrentBindingSession(req);
        if (authortiyName != null) {
            if (authortiyName.startsWith("GROUP_"))
                cacheService.clearGroupCache(authortiyName, bindingSession);
            else
                cacheService.clearCache(authortiyName);
        } else {
        	cacheService.clearCache();
        }
    }


}
