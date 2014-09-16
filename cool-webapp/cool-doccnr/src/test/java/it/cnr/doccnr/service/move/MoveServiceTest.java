package it.cnr.doccnr.service.move;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.utility.Util;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ObjectId;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.Ace;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.UnfileObject;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-doccnr-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class MoveServiceTest {
	private static final String NAME_DESTINAZIONE = "destinazione";
	private static final String NAME_DOCUMENT = "name document";
	private static final String NAME_CHILDREN = "children da tagliare";
	private static final String NAME_PARENT = "da tagliare";
	private static final String PATH_TO_TEST = "/TEST";

	@Autowired
	private MoveService moveService;
	@Autowired
	private CMISService cmisService;

	private Session adminSession;
	private ObjectId parentToCut;
	private ObjectId destinazione;

	@Rule
	public ExpectedException exception = ExpectedException.none();
	private List<Ace> aces;

	@Autowired
	@Qualifier("cmisAclOperationContext")
	private OperationContext cmisAclOperationContext;

	@Before
	public void setUp() {
		// Creo una folder parent con una folder children e all'interno un
		// documento
		aces = Util.getAcesToTest();
		adminSession = cmisService.createAdminSession();
		Folder testFolder = (Folder) adminSession.getObjectByPath(PATH_TO_TEST);

		// elimino le folder create da test vecchi
		for (CmisObject children : testFolder.getChildren()) {
			if (children.getName().equals(NAME_PARENT)) {
				((Folder) children)
						.deleteTree(true, UnfileObject.DELETE, false);
				break;
			}

		}

		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(PropertyIds.NAME, NAME_PARENT);
		properties.put(PropertyIds.OBJECT_TYPE_ID,
				BaseTypeId.CMIS_FOLDER.value());
		parentToCut = adminSession.createFolder(properties, testFolder);

		Map<String, Object> propertiesChild = new HashMap<String, Object>();
		propertiesChild.put(PropertyIds.NAME, NAME_CHILDREN);
		propertiesChild.put(PropertyIds.OBJECT_TYPE_ID,
				BaseTypeId.CMIS_FOLDER.value());
		ObjectId nodeRefChildrenToCopy = adminSession.createFolder(
				propertiesChild, parentToCut);

		Map<String, Object> propertiesDest = new HashMap<String, Object>();
		propertiesDest.put(PropertyIds.NAME, NAME_DESTINAZIONE);
		propertiesDest.put(PropertyIds.OBJECT_TYPE_ID,
				BaseTypeId.CMIS_FOLDER.value());
		destinazione = adminSession.createFolder(propertiesDest, testFolder,
				null, aces, null);

		Map<String, Object> propertiesDocument = new HashMap<String, Object>();
		propertiesDocument.put(PropertyIds.NAME, NAME_DOCUMENT);
		propertiesDocument.put(PropertyIds.OBJECT_TYPE_ID,
				BaseTypeId.CMIS_DOCUMENT.value());
		adminSession.createDocument(propertiesDocument, nodeRefChildrenToCopy,
				null, VersioningState.MAJOR, null, aces, null);

		Assert.assertNotNull(adminSession.getObjectByPath(PATH_TO_TEST + "/"
				+ NAME_PARENT));
	}

	@After
	public void teardown() {
		// cancello la folder destinazione del paste/cut
		((Folder) adminSession.getObject(destinazione)).deleteTree(true,
				UnfileObject.DELETE, false);
	}

	@Test
	public void testMoveService() throws IOException, InterruptedException,
			JobExecutionException {
		Map<String, String> response = moveService.move(parentToCut.getId(),
				destinazione.getId());
		Assert.assertEquals(response.get("status"), "ok");
		// verifico la presenta della cartella incollata
		Document documentoSpostato = (Document) adminSession.getObjectByPath(
				PATH_TO_TEST + "/" + NAME_DESTINAZIONE + "/" + NAME_PARENT
						+ "/" + NAME_CHILDREN + "/" + NAME_DOCUMENT,
				cmisAclOperationContext);
		Assert.assertNotNull(documentoSpostato);
		// verifico l'assenza della cartella tagliata (getObjectByPath lancia
		// una CmisObjectNotFoundException)
		exception.expect(CmisObjectNotFoundException.class);
		Assert.assertNotNull(adminSession.getObjectByPath(PATH_TO_TEST + "/"
				+ NAME_PARENT));

		// verifico gli Aces della folder copiata
		Assert.assertEquals(
				aces.size(),
				adminSession
						.getObjectByPath(PATH_TO_TEST + "/" + NAME_DESTINAZIONE)
						.getAcl().getAces().size());
		// verifico gli Aces del documento copiato
		Assert.assertEquals(aces.size(), documentoSpostato.getAcl().getAces()
				.size());
	}
}