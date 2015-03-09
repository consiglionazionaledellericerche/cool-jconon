package it.cnr.flows.resource;

import it.cnr.cool.cmis.service.CMISService;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by francesco on 09/03/15.
 */

@Controller
public class LogoutResource {

    @Autowired
    private CMISService cmisService;

    private static final Logger LOGGER = LoggerFactory.getLogger(LogoutResource.class);

    @RequestMapping(value = "/security/logout", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> logout(HttpServletRequest req)  {

        String ticket = req.getHeader(CMISService.AUTHENTICATION_HEADER);

        LOGGER.info("logout " + ticket);

        BindingSession bindingSession = cmisService.getCurrentBindingSession(req);

        String link = cmisService.getBaseURL().concat("service/api/login/ticket/" + ticket);
        UrlBuilder url = new UrlBuilder(link);

        int status = CmisBindingsHelper.getHttpInvoker(bindingSession).invokeDELETE(url, bindingSession).getResponseCode();

        if (status == org.apache.commons.httpclient.HttpStatus.SC_OK) {
            return new ResponseEntity<String>("ticket " + ticket + " deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("unable to delete ticket " + ticket, HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }

}
