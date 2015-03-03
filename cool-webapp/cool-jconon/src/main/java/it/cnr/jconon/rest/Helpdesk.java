package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.jconon.model.HelpdeskBean;
import it.cnr.jconon.service.helpdesk.HelpdeskService;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;


/**
 * Created by cirone on 27/10/2014.
 */
@Path("helpdesk")
@Component
@Produces(MediaType.APPLICATION_JSON)
@SecurityChecked
public class Helpdesk {
    @Autowired
    private HelpdeskService helpdeskService;
    @Autowired
    private CMISService cmisService;
    @Autowired
    private CommonsMultipartResolver resolver;


    @POST
    @Path("/send")
    public Response send(@Context HttpServletRequest req) {

        Map<String, Object> model = new HashMap<String, Object>();
        MultipartHttpServletRequest mRequest = resolver.resolveMultipart(req);
        ResponseBuilder builder = null;

        HelpdeskBean hdBean = new HelpdeskBean();
        hdBean.setIp(req.getRemoteAddr());

        try {
            BeanUtils.populate(hdBean, mRequest.getParameterMap());

            if (mRequest.getParameter("id") != null && mRequest.getParameter("azione") != null) {
                model = helpdeskService.postReopen(hdBean);
            } else {
                model = helpdeskService.post(hdBean, mRequest
                        .getFileMap().get("allegato"), cmisService
                                                     .getCMISUserFromSession(req));
            }
            Response.ok(model);
        } catch (IllegalAccessException | InvocationTargetException | IOException | MailException exception) {
            builder = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(exception.getMessage());
        }
        return builder.build();
    }
}
