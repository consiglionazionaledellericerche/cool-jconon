package it.cnr.si.cool.jconon.filter;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
public class EMailFilter implements Filter {
    public static final String CHANGE_USER_EMAIL = "/change-user-email";
    @Autowired
    private CMISService cmisService;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse res = (HttpServletResponse) servletResponse;
        final CMISUser cmisUser = cmisService.getCMISUserFromSession(req);
        if (!cmisUser.isGuest() &&
                !Optional.ofNullable(cmisUser.getEmail()).filter(s -> !s.trim().isEmpty()).isPresent()
                && !req.getRequestURI().equalsIgnoreCase(req.getContextPath() + CHANGE_USER_EMAIL)
                && !req.getRequestURI().startsWith(req.getContextPath() + "/res")){
            res.sendRedirect(req.getContextPath() + CHANGE_USER_EMAIL);
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
