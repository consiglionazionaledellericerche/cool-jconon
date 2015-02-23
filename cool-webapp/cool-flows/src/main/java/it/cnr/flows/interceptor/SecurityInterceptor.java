package it.cnr.flows.interceptor;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.GroupsUtils;
import it.cnr.cool.web.PermissionService;
import it.cnr.flows.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by francesco on 19/02/15.
 */
public class SecurityInterceptor extends HandlerInterceptorAdapter {

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityInterceptor.class);

    @Autowired
    private CMISService cmisService;

    @Autowired
    private PermissionService permission;

    @Override
    public final boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {

        CMISUser user = cmisService.getCMISUserFromSession(request);
        LOGGER.debug(user != null ? user.getId() : "guest");

        String pathInfo = request.getPathInfo();
        LOGGER.debug(pathInfo);

        if (Utils.isPublicUrl(pathInfo)) {
            LOGGER.info(pathInfo + " is public");
            return true;
        }

        if ((user == null || user.isGuest())) {
            LOGGER.info("unauthorized " + pathInfo);
            handleNotAuthorized(response);
            return false;
        }


        if (!permission.isAuthorized(pathInfo, request.getMethod(),
                user.getId(), GroupsUtils.getGroups(user))) {
            LOGGER.info("access forbidden to service: " + pathInfo);
            handleNotAuthorized(response);
            return false;
        }

        LOGGER.info("user authorized to access " + pathInfo);

        return true;
    }


    private void handleNotAuthorized(HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED);

    }

}
