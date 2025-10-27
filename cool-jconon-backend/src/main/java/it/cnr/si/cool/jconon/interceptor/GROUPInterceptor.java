package it.cnr.si.cool.jconon.interceptor;

import it.cnr.cool.interceptor.ProxyInterceptor;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.JcononGroups;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

@Service
public class GROUPInterceptor extends ProxyInterceptor implements InitializingBean {

    @Autowired
    ProxyInterceptor proxyInterceptor;

    @Autowired
    CallService callService;

    @Override
    public void afterPropertiesSet() throws Exception {
        setPath("service/cnr/groups/children");
        proxyInterceptor.register(this);
    }

    @Override
    public void invokeBeforeDelete(String url, HttpServletRequest req) {
        String childFullName = req.getParameter("childFullName");
        CMISUser user = cmisService.getCMISUserFromSession(req);
        /**
         * Se sto cercando di eliminare l'associazione al gruppo gestori, controllo che sia un amministratore
         * o che faccia parte del gruppo concorsi o del gruppo stesso
         */
        if (childFullName.equalsIgnoreCase(JcononGroups.GESTORI_BORSE_DI_STUDIO.group())) {
            if (!(
                    user.isAdmin() ||
                    callService.isMemberOfConcorsiGroup(user) ||
                    callService.isMemberOfJcononGroup(user, JcononGroups.GESTORI_BORSE_DI_STUDIO)
                )
            ) {
                throw new ClientMessageException("message.error.cannot.remove.group");
            }
        }
        super.invokeBeforeDelete(url, req);
    }
}
