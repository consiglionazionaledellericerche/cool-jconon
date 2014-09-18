package it.cnr.doccnr.service.copy;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.utility.Util;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ObjectId;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.Ace;
import org.apache.chemistry.opencmis.commons.enums.AclPropagation;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.UnfileObject;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.junit.After;
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
@ContextConfiguration(locations = { "classpath:/META-INF/cool-doccnr-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class CopyServiceTest {
	private static final String NAME_COPIA = "copia di test";
	private static final String NAME_PARENT = "da copiare";
	private static final String NAME_DOCUMENT = "name document";
	private static final String NAME_CHILDREN = "children da copiare";
	private static final String PATH_TO_TEST = "/TEST";
	private Session adminSession;
	private Folder folderToCopy;
	private Folder copy;

    @Autowired
	private CopyService copyService;
	@Autowired
	private CMISService cmisService;
	@Autowired
	@Qualifier("cmisAclOperationContext")
	private OperationContext cmisAclOperationContext;

	@Before
	public void setUp() {
		adminSession = cmisService.createAdminSession();
        Folder folderToTest;
        try {
			folderToTest = (Folder) adminSession.getObjectByPath(PATH_TO_TEST);
		} catch (CmisObjectNotFoundException e) {
			Map<String, String> properties = new HashMap<String, String>();
			properties.put(PropertyIds.NAME, "TEST");
			properties.put(PropertyIds.OBJECT_TYPE_ID,
					BaseTypeId.CMIS_FOLDER.value());
			folderToTest = (Folder) adminSession
					.getObject(adminSession.createFolder(properties,
							adminSession.getObjectByPath("/")));
		}
		// elimino le folder create da test vecchi
		for (CmisObject children : folderToTest.getChildren()) {
			if (children.getName().equals(NAME_PARENT)
					|| children.getName().equals(NAME_COPIA)) {
				((Folder) children)
						.deleteTree(true, UnfileObject.DELETE, false);
				break;
			}

		}
		// Creo una folder parent con una folder children e all'interno un
		// documento
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(PropertyIds.NAME, NAME_PARENT);
		properties.put(PropertyIds.OBJECT_TYPE_ID,
				BaseTypeId.CMIS_FOLDER.value());

		List<Ace> addAces = Util.getAcesToTest();

		folderToCopy = (Folder) adminSession.getObject(adminSession
				.createFolder(properties, folderToTest, null, null, null),
				cmisAclOperationContext);
		folderToCopy.applyAcl(addAces, folderToCopy.getAcl().getAces(),
				AclPropagation.PROPAGATE);

		Map<String, Object> propertiesChild = new HashMap<String, Object>();
		propertiesChild.put(PropertyIds.NAME, NAME_CHILDREN);
		propertiesChild.put(PropertyIds.OBJECT_TYPE_ID,
				BaseTypeId.CMIS_FOLDER.value());
		ObjectId nodeRefChildrenToCopy = adminSession.createFolder(
				propertiesChild, new ObjectIdImpl(folderToCopy.getId()));

		Map<String, Object> propertiesDocument = new HashMap<String, Object>();
		propertiesDocument.put(PropertyIds.NAME, NAME_DOCUMENT);
		propertiesDocument.put(PropertyIds.OBJECT_TYPE_ID,
				BaseTypeId.CMIS_DOCUMENT.value());
		// non metto gli aces perché il documento eredita quelli della cartella
		adminSession.createDocument(propertiesDocument, nodeRefChildrenToCopy,
				null, VersioningState.MAJOR, null, null, null);
		Assert.assertNotNull(adminSession.getObjectByPath(PATH_TO_TEST + "/"
				+ NAME_PARENT));
	}

	@After
	public void teardown() {
		// cancello la certella da copiare
		folderToCopy.deleteTree(true, UnfileObject.DELETE, false);
		// cancello la copia della cortella
		copy.deleteTree(true, UnfileObject.DELETE, false);
	}

	@Test
	public void testCopyService() throws IOException, InterruptedException {

		Map<String, Object> response = copyService.copyFolder(
				(Folder) adminSession.getObjectByPath(PATH_TO_TEST,
						cmisAclOperationContext), folderToCopy, NAME_COPIA);
		copy = (Folder) response.get("folder");

		// verifico la presenza della cartella da copiare
		Assert.assertNotNull(adminSession.getObjectByPath(PATH_TO_TEST + "/"
				+ NAME_PARENT));
		// verifico la presenza della copia
		Assert.assertNotNull(adminSession.getObjectByPath(PATH_TO_TEST + "/"
				+ NAME_COPIA + "/" + NAME_CHILDREN + "/" + NAME_DOCUMENT));
		// verifico gli Aces della folder copiata
		Assert.assertEquals(folderToCopy.getAcl().getAces().size(), copy
				.getAcl().getAces().size());
		// verifico gli Aces del documento copiato
		Assert.assertEquals(
				adminSession
						.getObjectByPath(
								PATH_TO_TEST + "/" + NAME_PARENT + "/"
										+ NAME_CHILDREN + "/" + NAME_DOCUMENT,
								cmisAclOperationContext).getAcl().getAces()
						.size(),
				adminSession
						.getObjectByPath(
								PATH_TO_TEST + "/" + NAME_COPIA + "/"
										+ NAME_CHILDREN + "/" + NAME_DOCUMENT,
								cmisAclOperationContext).getAcl().getAces()
						.size());
	}
}