package it.cnr.flows.resource;

import it.cnr.cool.service.ProxyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by francesco on 17/02/15.
 */

@Controller
public class ProxyResource {

    @Autowired
    private ProxyService proxyService;

    @RequestMapping(value = "/proxy", method = RequestMethod.GET)
    @ResponseBody
    public void get(HttpServletRequest req, HttpServletResponse res) throws IOException {
        proxyService.processGet(req, null, res);
    }

    @RequestMapping(value = "/proxy", method = RequestMethod.POST)
    @ResponseBody
    public void post(HttpServletRequest req, HttpServletResponse res) throws IOException {
        proxyService.processRequest(req, res, true);
    }

}
