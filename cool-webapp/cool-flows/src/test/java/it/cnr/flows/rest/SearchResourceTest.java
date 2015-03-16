package it.cnr.flows.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.LoginException;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.flows.resource.SearchResource;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

/**
 * Created by francesco on 13/03/15.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-flows-test-context.xml" })
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class SearchResourceTest {

    @Autowired
    private SearchResource searchResource;

    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;

    private static final Logger LOGGER = LoggerFactory.getLogger(SearchResourceTest.class);

    private static final String ID = "df86dc7b-8418-4acf-835e-4f513b268176";

    @Test
    public void testGetDescentants() throws LoginException {


        MockHttpServletRequest req = new MockHttpServletRequest();

        req.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket("admin", "admin"));

        ResponseEntity<?> descendants = searchResource.getDescentants(ID, req);

        String body = descendants.getBody().toString();

        assertNotNull(body);

        assertFalse(body.isEmpty());

        LOGGER.info(body);

    }

}
