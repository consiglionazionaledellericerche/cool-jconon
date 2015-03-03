package it.cnr.flows.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.LoginException;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.flows.exception.DropException;
import it.cnr.flows.resource.DropResource;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.commons.io.IOUtils;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertTrue;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-flows-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class DropTest {

	private static final String USERNAME = "francesco.uliana";

	private static final Logger LOGGER = LoggerFactory.getLogger(DropTest.class);

	@Autowired
	private DropResource drop;

    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;


    @Autowired
    private CMISService cmisService;

	@Test
	public void testPost() throws ParseException, IOException, LoginException, DropException {

		String timestamp = "" + System.currentTimeMillis();

		BindingSession cmisBindingSession = cmisService.getAdminSession();

        MockHttpServletRequest req = createRequest();


        MultipartFile filez = getFile();
        ResponseEntity<?> foo = drop.post("Allegato", timestamp, USERNAME, filez, req);

		LOGGER.info(foo.getBody().toString());

		assertTrue(foo.getStatusCode() == HttpStatus.OK);

	}

    private MultipartFile getFile() {
        String name = "test-file";
        return new MockMultipartFile(name, name, "text/plain", "testo testo testo".getBytes());
    }

    private MockHttpServletRequest createRequest() throws LoginException {


        MockHttpServletRequest req = new MockHttpServletRequest();
        String ticket = cmisAuthenticatorFactory.getTicket("admin", "admin");
        req.addHeader(CMISService.AUTHENTICATION_HEADER, ticket);
        return req;
    }

    @Test
    @Ignore
    public void testPostUpdate() throws ParseException, IOException, LoginException, DropException {


        Session session = cmisService.createAdminSession();

        String name = "prova123";

        Document doc;

        try {
            CmisObject o = session.getObjectByPath("/" + name);
            doc = (Document) o;
        } catch(CmisObjectNotFoundException e) {

            Folder root = (Folder) session.getObjectByPath("/");

            Map<String, String> props = new HashMap<String, String>();

            props.put("cmis:name", name);
            props.put("cmis:objectTypeId", "cmis:document");

            doc = root.createDocument(props, null, VersioningState.MAJOR);
        }



        String bb = IOUtils.toString(DropTest.class.getResourceAsStream("/req.txt"));
        InputStream is =  IOUtils.toInputStream(bb);

        MockHttpServletRequest req = createRequest();
        
        req.setContent(bb.getBytes());

        drop.update(doc.getId(), null, req);

    }



}
