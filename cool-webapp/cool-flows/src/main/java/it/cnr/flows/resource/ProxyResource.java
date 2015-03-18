package it.cnr.flows.resource;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.ProxyService;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.HandlerMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by francesco on 17/02/15.
 */

@Controller
@RequestMapping("rest")
public class ProxyResource {

    private final static String PROXY = "proxy";

    private static final Logger LOGGER = LoggerFactory.getLogger(ProxyResource.class);

    @Autowired
    private CMISService cmisService;

    @Autowired
    private ProxyService proxyService;


    @RequestMapping(value = "/" + PROXY, method = RequestMethod.GET)
    @ResponseBody
    public void get(HttpServletRequest req, HttpServletResponse res) throws IOException {
        BindingSession bindingSession = cmisService.getCurrentBindingSession(req);
        UrlBuilder urlBuilder = ProxyService.getUrl(req, cmisService.getBaseURL());
        proxyService.processGet(bindingSession, urlBuilder, res);
    }


    @RequestMapping(value = "/" + PROXY, method = RequestMethod.POST)
    @ResponseBody
    public void post(HttpServletRequest req, HttpServletResponse res) throws IOException {
        proxyService.processRequest(req, res, true);
    }


    @RequestMapping(value = "/" + PROXY, method = RequestMethod.PUT)
    @ResponseBody
    public void put(HttpServletRequest req, HttpServletResponse res) throws IOException {
        proxyService.processRequest(req, res, false);
    }



    @RequestMapping(value = "/" + PROXY + "/**", method = RequestMethod.GET)
    @ResponseBody
    public void getURL(HttpServletRequest req, HttpServletResponse res) throws IOException {

        String suffix = (String) req.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);

        int s = suffix.indexOf(PROXY) + PROXY.length() + 1;

        String path = suffix.substring(s);

        LOGGER.debug(path);

        BindingSession bindingSession = cmisService.getCurrentBindingSession(req);
        UrlBuilder urlBuilder = ProxyService.getUrl(req, cmisService.getBaseURL() + path);

        LOGGER.debug(urlBuilder.toString());
        proxyService.processGet(bindingSession, urlBuilder, res);

    }



}
