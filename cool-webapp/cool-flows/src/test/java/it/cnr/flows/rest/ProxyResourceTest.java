package it.cnr.flows.rest;

import com.google.gson.JsonParser;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.LoginException;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.flows.resource.ProxyResource;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.servlet.HandlerMapping;

import javax.xml.bind.DatatypeConverter;
import java.io.IOException;

import static org.junit.Assert.assertEquals;

/**
 * Created by francesco on 18/03/15.
 */



@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-flows-test-context.xml" })
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class ProxyResourceTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProxyResourceTest.class);

    @Autowired
    private ProxyResource proxy;

    @Autowired
    private CMISService cmisService;

    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;

    @Test
    public void testGet() throws IOException {

        MockHttpServletRequest req = new MockHttpServletRequest();
        MockHttpServletResponse res = new MockHttpServletResponse();

        req.addParameter("url", "service/api/server");

        proxy.get(req, res);

        String json = res.getContentAsString();

        LOGGER.info(json);

        String edition = getAlfrescoEdition(json);
        assertEquals("Enterprise", edition);

    }

    private String getAlfrescoEdition(String json) {
        return new JsonParser().parse(json).getAsJsonObject().get("data").getAsJsonObject().get("edition").getAsString();
    }


    @Test
    public void testGetURL() throws IOException {

        MockHttpServletRequest req = new MockHttpServletRequest();
        MockHttpServletResponse res = new MockHttpServletResponse();

        req.setAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE, "/proxy/service/api/server");

        proxy.getURL(req, res);

        String s = res.getContentAsString();

        LOGGER.info(s);

        String edition = getAlfrescoEdition(s);
        assertEquals("Enterprise", edition);


    }

    @Test
    public void testGetURLBasicAuthentication() throws IOException {

        MockHttpServletRequest req = new MockHttpServletRequest();
        MockHttpServletResponse res = new MockHttpServletResponse();

        req.setAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE, "/proxy/service/cnr/person/whoami");

        String b64 = DatatypeConverter.printBase64Binary("admin:admin".getBytes());

        req.addHeader("Authorization", "Basic " + b64);

        proxy.getURL(req, res);

        String s = res.getContentAsString();
        LOGGER.info(s);

        assertEquals("admin", new JsonParser().parse(s).getAsJsonObject().get("userName").getAsString());

    }



    @Test
    public void testGetURLHeaderAuthentication() throws IOException, LoginException {

        MockHttpServletRequest req = new MockHttpServletRequest();
        MockHttpServletResponse res = new MockHttpServletResponse();

        req.setAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE, "/proxy/service/cnr/person/whoami");

        req.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket("admin", "admin"));

        proxy.getURL(req, res);

        String s = res.getContentAsString();
        LOGGER.info(s);

        assertEquals("admin", new JsonParser().parse(s).getAsJsonObject().get("userName").getAsString());

    }




}
