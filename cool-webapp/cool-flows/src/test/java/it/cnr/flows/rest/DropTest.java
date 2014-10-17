package it.cnr.flows.rest;

import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.file.StreamDataBodyPart;
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

	@Test
	public void testPost() throws ParseException, IOException {
		
		String timestamp = "" + System.currentTimeMillis();
		
		FormDataContentDisposition formDataContentDisposition = null;
		
		MockHttpServletRequest req = new MockHttpServletRequest();
		
		String bb = IOUtils.toString(DropTest.class.getResourceAsStream("/req.txt"));
		InputStream is =  IOUtils.toInputStream(bb);
		
		req.setContent(bb.getBytes());
		
		StreamDataBodyPart bdp = new StreamDataBodyPart("aaa",
				IOUtils.toInputStream(""));

		Response foo = drop.post("aux", timestamp, USERNAME, is,
				formDataContentDisposition, bdp, req);
		
		LOGGER.info(foo.getEntity().toString());
		
		assertTrue(foo.getStatus() == Status.OK.getStatusCode());
		
	}

}
