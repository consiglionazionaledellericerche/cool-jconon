package it.cnr.doccnr.service.zipper;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;

import java.io.IOException;
import java.util.HashMap;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.SessionImpl;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-variazioni-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class ZipperServiceTest {
	private static final String BAD_VARIAZIONE = "3961";
	private static final String VARIAZIONE = "3960";
	private static final String CDS = "001";
	private static final String ESERCIZIO = "2013";
	private static final Logger LOGGER = LoggerFactory
			.getLogger(ZipperServiceTest.class);
	private static final String PATH = "/User Homes/spaclient";
	private static final String zipName = "test zip";
	@Autowired
	private ZipperServiceAsynchronous zipperService;
	@Autowired
	private CMISService cmisService;
	@Autowired
	private MailService mailService;

	private Session adminSession;
	private HashMap<String, String> queryParam;
	private CMISUser user;
	private String serverPath;
	private String contextPath;
	private SessionImpl bindingSession;

	@Before
	public void setUp() {
		adminSession = cmisService.createAdminSession();
		bindingSession = cmisService.createBindingSession("spaclient",
				"sp@si@n0");
		// TODO: creare un mockCmisUser ?
		user = new CMISUser("spaclient");
		user.setEmail("");
		MockHttpServletRequest req = new MockHttpServletRequest();

		serverPath = req.getServerName();
		contextPath = req.getContextPath();
	}

	@Test
	public void testZipper() throws IOException, InterruptedException,
			JobExecutionException {
		queryParam = new HashMap<String, String>();
		queryParam.put(zipperService.KEY_VARIAZIONI, VARIAZIONE);
		queryParam.put(zipperService.KEY_ESERCIZIO, ESERCIZIO);
		queryParam.put(zipperService.KEY_CDS, CDS);
		zipperService.zipperService(cmisService, mailService, adminSession,
				bindingSession, queryParam, zipName, serverPath + contextPath,
				user, LOGGER);
		CmisObject zip = adminSession.getObjectByPath(PATH + "/" + zipName
				+ ".zip");
		Assert.assertNotNull(zip);
		zip.delete(true);
	}

	@Test(expected = CmisObjectNotFoundException.class)
	public void testZipperResultEmpty() throws IOException,
			InterruptedException, JobExecutionException {
		queryParam = new HashMap<String, String>();
		queryParam.put(zipperService.KEY_VARIAZIONI, BAD_VARIAZIONE);
		queryParam.put(zipperService.KEY_ESERCIZIO, ESERCIZIO);
		queryParam.put(zipperService.KEY_CDS, CDS);

		zipperService.zipperService(cmisService, mailService, adminSession,
				bindingSession, queryParam, zipName, serverPath + contextPath,
				user, LOGGER);
		adminSession.getObjectByPath(PATH + "/" + zipName + ".zip");
	}
}
