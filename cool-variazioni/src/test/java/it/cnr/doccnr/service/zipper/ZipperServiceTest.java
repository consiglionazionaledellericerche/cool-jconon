package it.cnr.doccnr.service.zipper;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;

import java.io.InputStream;
import java.math.BigInteger;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.SessionImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import it.cnr.cool.util.MimeTypes;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-variazioni-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class ZipperServiceTest {
	private static final String USER_NAME = "test.gestdoc";
	private static final String FOLDER_NAME = "CdR 075.002.000 Variazione 02414";
	private static final String BAD_VARIAZIONE = "2415";
	private static final String VARIAZIONE = "2414";
	private static final String CDS = "075";
	private static final String ESERCIZIO = "2014";
	private static final String PATH = "/User Homes/" + USER_NAME;
	private static final String zipName = "test zip";
	private static final String FILE_NAME = "Variazione al PdG n. 2414 CdR proponente 075.002.000.pdf";

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
		bindingSession = cmisService.getAdminSession();
		user = new CMISUser(USER_NAME);
		Map<String, Object> propertiesFolder = new HashMap<String, Object>();
		propertiesFolder.put(PropertyIds.NAME, FOLDER_NAME);
		propertiesFolder.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_FOLDER.value());	
		
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(PropertyIds.OBJECT_TYPE_ID, "D:varpianogest:document");	
		properties.put(PropertyIds.NAME, FILE_NAME);
		properties.put("varpianogest:esercizio", Integer.valueOf(ESERCIZIO));
		properties.put("varpianogest:numeroVariazione", Integer.valueOf(VARIAZIONE));
		properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, Collections.singletonList("P:strorg:cds"));
		properties.put("strorgcds:codice", CDS);	
		InputStream stream = this.getClass().getResourceAsStream("/" + FILE_NAME);
		ContentStream contentStream = new ContentStreamImpl(FILE_NAME, BigInteger.ZERO, "application/pdf", stream);
		try {
			adminSession.createFolder(propertiesFolder, adminSession.getObjectByPath(PATH));
			adminSession.createDocument(properties, adminSession.getObjectByPath(PATH + "/" + FOLDER_NAME), 
				contentStream, VersioningState.MAJOR);
		} catch (CmisContentAlreadyExistsException _ex) {
		}
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
				+ MimeTypes.ZIP.getExtension());
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

		adminSession.getObjectByPath(PATH + "/" + zipName + MimeTypes.ZIP.getExtension());
	}	
}