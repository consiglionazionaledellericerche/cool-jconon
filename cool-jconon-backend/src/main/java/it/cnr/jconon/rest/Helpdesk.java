package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.jconon.model.HelpdeskBean;
import it.cnr.jconon.service.helpdesk.HelpdeskService;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;


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


    @GET
    @Path("/esperti")
    public Response esperti(@Context HttpServletRequest req, @QueryParam("idCategoria") Integer idCategoria) {
    	return Response.ok(helpdeskService.getEsperti(idCategoria)).build();
    }

    @PUT
    @Path("/esperti")
    public Response addEsperto(@Context HttpServletRequest req, @QueryParam("idCategoria") Integer idCategoria, @QueryParam("idEsperto") String idEsperto) {
    	return Response.ok(helpdeskService.manageEsperto(idCategoria, idEsperto, false)).build();
    }

    @DELETE
    @Path("/esperti")
    public Response deleteEsperto(@Context HttpServletRequest req, @QueryParam("idCategoria") Integer idCategoria, @QueryParam("idEsperto") String idEsperto) {
    	return Response.ok(helpdeskService.manageEsperto(idCategoria, idEsperto, true)).build();
    }

    @POST
    @Path("/send")
    public Response send(@Context HttpServletRequest req) {

        MultipartHttpServletRequest mRequest = resolver.resolveMultipart(req);
        ResponseBuilder builder = null;

        HelpdeskBean hdBean = new HelpdeskBean();
        hdBean.setIp(req.getRemoteAddr());

        try {
            BeanUtils.populate(hdBean, mRequest.getParameterMap());

            if (mRequest.getParameter("id") != null && mRequest.getParameter("azione") != null) {
                helpdeskService.sendReopenMessage(hdBean);
            } else {
                helpdeskService.post(hdBean, mRequest
                        .getFileMap().get("allegato"), cmisService
                                             .getCMISUserFromSession(req));
            }
            builder = Response.ok();
        } catch (IllegalAccessException | InvocationTargetException | IOException | MailException | CmisObjectNotFoundException exception) {
            builder = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(exception.getMessage());
        }
        return builder.build();
    }
}
