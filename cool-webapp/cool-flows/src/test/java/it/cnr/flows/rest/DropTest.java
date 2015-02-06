package it.cnr.flows.rest;

import static org.junit.Assert.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;


import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import it.cnr.cool.cmis.service.CMISService;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.SessionImpl;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.file.StreamDataBodyPart;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-flows-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class DropTest {

	private static final String USERNAME = "francesco.uliana";

	private static final Logger LOGGER = LoggerFactory.getLogger(DropTest.class);

	@Autowired
	private Drop drop;


    @Autowired
    private CMISService cmisService;

	@Test
	public void testPost() throws ParseException, IOException {

		String timestamp = "" + System.currentTimeMillis();

		FormDataContentDisposition formDataContentDisposition = null;
		SessionImpl cmisBindingSession = cmisService.getAdminSession();

		MockHttpServletRequest req = new MockHttpServletRequest();

		String bb = IOUtils.toString(DropTest.class.getResourceAsStream("/req.txt"));
		InputStream is =  IOUtils.toInputStream(bb);

		req.setContent(bb.getBytes());

		StreamDataBodyPart bdp = new StreamDataBodyPart("aaa",
				IOUtils.toInputStream(""));

		Response foo = drop.post("Allegato", timestamp, USERNAME, null, is,
				formDataContentDisposition, bdp, req);

		LOGGER.info(foo.getEntity().toString());

		assertTrue(foo.getStatus() == Status.OK.getStatusCode());

	}

    @Test
    @Ignore
    public void testPostUpdate() throws ParseException, IOException {


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

        StreamDataBodyPart bdp = new StreamDataBodyPart("aaa",
                IOUtils.toInputStream(""));


        MockHttpServletRequest req = new MockHttpServletRequest();

        String bb = IOUtils.toString(DropTest.class.getResourceAsStream("/req.txt"));
        InputStream is =  IOUtils.toInputStream(bb);

        req.setContent(bb.getBytes());

        drop.post(null, null, null, doc.getId(), new ByteArrayInputStream("aaa".getBytes()), null, bdp, req);

    }



}
