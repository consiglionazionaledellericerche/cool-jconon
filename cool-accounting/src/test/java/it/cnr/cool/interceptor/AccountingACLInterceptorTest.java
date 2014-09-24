package it.cnr.cool.interceptor;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import it.cnr.cool.cmis.service.CMISService;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Session;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-accounting-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class AccountingACLInterceptorTest {

	@Autowired
	private CMISService cmisService;

	@Autowired
	private AccountingACLInterceptor accountingACLInterceptor;

	@Test
	public void testHasContabiliAspect() {
		Session session = cmisService.createAdminSession();

		CmisObject cmisObject = session
				.getObject("workspace://SpacesStore/79abce89-6955-4fd5-9bef-16e9f050bfac");

		assertTrue(cmisObject != null);

		assertTrue(accountingACLInterceptor.hasContabiliAspect(cmisObject));

	}

	@Test
	public void testtestHasNotContabiliAspect() {

		Session session = cmisService.createAdminSession();

		CmisObject cmisObject = session
				.getObject("workspace://SpacesStore/efa711a7-f807-40c3-913b-cfd416d982d5");

		assertTrue(cmisObject != null);

		assertFalse(accountingACLInterceptor.hasContabiliAspect(cmisObject));

	}

}
