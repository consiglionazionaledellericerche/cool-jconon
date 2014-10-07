package it.cnr.doccnr.service.zipper;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;

import java.util.HashMap;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.SessionImpl;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-variazioni-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class ZipperServiceTest {
	private static final String BAD_VARIAZIONE = "2415";
	private static final String VARIAZIONE = "2414";
	private static final String CDS = "075";
	private static final String ESERCIZIO = "2014";
	private static final String PATH = "/User Homes/spaclient";
	private static final String zipName = "test zip";

	@Autowired
	private CMISService cmisService;

	private Session adminSession;
	private HashMap<String, String> queryParam;
	private CMISUser user;

	@Autowired
	@Qualifier("zipperServiceAsynchronous")
	ZipperServiceAsynchronous zipperService;
	private SessionImpl bindingSession;

	@Before
	public void setUp() {
		adminSession = cmisService.createAdminSession();

		user = new CMISUser("spaclient");
		user.setEmail("");
		user.setPassword("sp@si@n0");

		bindingSession = cmisService.createBindingSession(user.getId(),
				user.getPassword());
	}

	@Test
	public void testZipper() {
		queryParam = new HashMap<String, String>();
		queryParam.put(ZipperServiceAsynchronous.KEY_VARIAZIONI, VARIAZIONE);
		queryParam.put(ZipperServiceAsynchronous.KEY_ESERCIZIO, ESERCIZIO);
		queryParam.put(ZipperServiceAsynchronous.KEY_CDS, CDS);

		zipperService.setCmisSession(adminSession);
		zipperService.setQueryParam(queryParam);
		zipperService.setUser(user);
		zipperService.setZipName(zipName);
		zipperService.setBindingsession(bindingSession);

		new Thread(zipperService).run();

		CmisObject zip = adminSession.getObjectByPath(PATH + "/" + zipName
				+ ".zip");
		Assert.assertNotNull(zip);
		zip.delete(true);
	}

	@Test(expected = CmisObjectNotFoundException.class)
	public void testZipperResultEmpty() {
		queryParam = new HashMap<String, String>();
		queryParam
				.put(ZipperServiceAsynchronous.KEY_VARIAZIONI, BAD_VARIAZIONE);
		queryParam.put(ZipperServiceAsynchronous.KEY_ESERCIZIO, ESERCIZIO);
		queryParam.put(ZipperServiceAsynchronous.KEY_CDS, CDS);

		zipperService.setCmisSession(adminSession);
		zipperService.setQueryParam(queryParam);
		zipperService.setUser(user);
		zipperService.setZipName(zipName);
		zipperService.setBindingsession(bindingSession);

		new Thread(zipperService).run();

		adminSession.getObjectByPath(PATH + "/" + zipName + ".zip");
	}
}