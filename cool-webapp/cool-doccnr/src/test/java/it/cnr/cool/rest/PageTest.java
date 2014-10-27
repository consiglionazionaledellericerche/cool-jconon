package it.cnr.cool.rest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import freemarker.template.TemplateException;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;

import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-doccnr-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class PageTest {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(PageTest.class);

	@Autowired
	private Page page;

	@Autowired
	private CMISAuthenticatorFactory cmisAuthenticatorFactory;

	@Autowired
	private CMISService cmisService;

	@Test
	public void testHome() throws TemplateException, IOException {

		MockHttpServletRequest req = new MockHttpServletRequest();
		HttpSession session = req.getSession();
		session.setAttribute(CMISUser.SESSION_ATTRIBUTE_KEY_USER_OBJECT,
				new CMISUser(
				"francesco.uliana"));

		Response response = getResponse("home", req, new MockHttpServletResponse());

		assertEquals(Status.OK.getStatusCode(), response.getStatus());
		LOGGER.info(response.getEntity().toString());
	}

	@Test
	public void testNonExisting() throws TemplateException, IOException {
		Response response = getResponse("foobar");
		assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
	}

	@Test
	public void testJsConsoleGuest() throws TemplateException, IOException {
		Response response = getResponse("jsConsole");

		String locationHeader = response.getHeaderString("Location");
		LOGGER.info("redirect to " + locationHeader);
		assertTrue(locationHeader.length() > 0);
		assertEquals(Status.SEE_OTHER.getStatusCode(), response.getStatus());
	}

	@Test
	public void testJsConsole() throws TemplateException, IOException {

		MockHttpServletRequest req = new MockHttpServletRequest();
		HttpSession session = req.getSession();
		CMISUser user = new CMISUser("spaclient");
		Map<String, Boolean> capabilities = new HashMap<String, Boolean>();
		capabilities.put(CMISUser.CAPABILITY_ADMIN, true);
		user.setCapabilities(capabilities);
		session.setAttribute(CMISUser.SESSION_ATTRIBUTE_KEY_USER_OBJECT, user);

		Response response = getResponse("jsConsole", req, new MockHttpServletResponse());
		assertEquals(Status.OK.getStatusCode(), response.getStatus());
		LOGGER.info(response.getEntity().toString());
	}

	@Test
	public void testLogin() throws TemplateException, IOException {
		Response response = getResponse("login");
		assertEquals(Status.OK.getStatusCode(), response.getStatus());
		LOGGER.info(response.getEntity().toString());
	}

	private Response getResponse(String id, HttpServletRequest req, HttpServletResponse res) {
		return page.html(req, res, id, Locale.getDefault().getLanguage(), Locale.getDefault().getLanguage());
	}

	private Response getResponse(String id) {
		return getResponse(id, new MockHttpServletRequest(), new MockHttpServletResponse());
	}

}
