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
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

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

    @GET
    public Response get(@Context HttpServletRequest req) {

        CMISUser user = cmisService.getCMISUserFromSession(req);
        BindingSession bindingSession = cmisService
                .getCurrentBindingSession(req);
        Map<String, Object> model = commonRestService.getStringObjectMap(user);
        List<Pair<String, String>> caches = cacheService.getCaches(user, bindingSession);
        caches.add(getGroupsPair(req));
        model.put("caches", caches);
        return commonRestService.getResponse(model);
    }

    private Pair<String, String> getGroupsPair(HttpServletRequest req) {
        CMISUser cmisUserFromSession = cmisService.getCMISUserFromSession(req);
        List<CMISGroup> groups = cmisUserFromSession.getGroups();
        String md5 = getMd5(groups);
        return new Pair<String, String>("groupsHash", String.format("\"%s\"", md5));
    }

    static String getMd5(List<CMISGroup> groups) {

        if (groups == null) {
            return "";
        }

        List<String> l = new ArrayList<>();

        for (CMISGroup g: groups) {
            String group_name = g.getGroup_name();
            LOGGER.debug(group_name);
            l.add(group_name);
        }

        LOGGER.info(l.toString());
        Collections.sort(l);
        LOGGER.info(l.toString());
        String s = StringUtils.collectionToDelimitedString(l, "-");
        LOGGER.info(s);
        String v = StringUtil.getMd5(s.getBytes());
        LOGGER.info(v);
        return v;
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
        }
    }


}
