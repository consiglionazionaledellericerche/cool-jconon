package it.cnr.cool.service.modelDesigner;

import static org.junit.Assert.assertTrue;
import it.cnr.cool.cmis.model.ModelPropertiesIds;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.util.AlfrescoModel;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.IOException;
import java.util.Calendar;
import java.util.List;

import org.alfresco.cmis.client.AlfrescoDocument;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/spring/cool-model-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class GetModelTest {

	@Autowired
	private CMISService cmisService;

	private Session cmisSession;
	@Autowired
	private ModelDesignerService modelDesignerService;

	@Before
	public void createSession() throws IOException {
		cmisSession = cmisService.createAdminSession();
	}

	// @Test(expected = CmisObjectNotFoundException.class)
	@After
	public void deleteOldTestModel() throws CmisObjectNotFoundException {
		Criteria criteriaOldModel = CriteriaFactory
				.createCriteria(ModelPropertiesIds.MODEL_QUERY_NAME.value());

		Calendar startDate = Calendar.getInstance();
		// prende i model rimasti in sospeso il giorno prima perché non
		// funzionano le query con l'orario
		criteriaOldModel.add(Restrictions.lt(PropertyIds.CREATION_DATE,
				startDate.getTime()));
		criteriaOldModel.add(Restrictions.like(PropertyIds.NAME,
				ModelDesignerServiceTest.MODEL_NAME + "%"));

		OperationContext appo = new OperationContextImpl();
		ItemIterable<QueryResult> oldModel = criteriaOldModel.executeQuery(
				cmisSession, false, appo);
		for (QueryResult qr : oldModel.getPage()) {
			String nodeRefModel = qr
					.getPropertyValueById(PropertyIds.OBJECT_ID);
			modelDesignerService.deleteModel(cmisSession, nodeRefModel);
		}
		// eliminare i template creati(prima togliere l'aspect)
		Criteria criteriaOldTemplate = CriteriaFactory
				.createCriteria(BaseTypeId.CMIS_DOCUMENT.value());

		criteriaOldTemplate.add(Restrictions.lt(PropertyIds.CREATION_DATE,
				startDate.getTime()));
		criteriaOldTemplate.add(Restrictions.like(PropertyIds.NAME,
				ModelDesignerServiceTest.TEMPLATE_NAME + "%"));

		ItemIterable<QueryResult> oldTemplate = criteriaOldTemplate
				.executeQuery(cmisSession, false, appo);
		for (QueryResult qr : oldTemplate.getPage()) {
			AlfrescoDocument template = (AlfrescoDocument) cmisSession
					.getObject(qr.getPropertyValueById(PropertyIds.OBJECT_ID)
							.toString());

			template.removeAspect("P:" + ModelDesignerServiceTest.nameAspect
					+ ":aspect");
			template.delete(true);
		}
	}

	@Test
	public void testGetModels() {
		List<AlfrescoModel> models = modelDesignerService
				.getModels(cmisSession);
		assertTrue(models.size() > 0);
	}
}