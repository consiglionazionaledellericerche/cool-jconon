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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.chemistry.opencmis.client.api.Document;
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

	@After
	public void deleteOldTestModel() throws CmisObjectNotFoundException {
		Calendar startDate = Calendar.getInstance();
		OperationContext appo = new OperationContextImpl();
		// eliminare i template creati(prima di eliminare il loro aspect)
		Criteria criteriaOldTemplate = CriteriaFactory
				.createCriteria(BaseTypeId.CMIS_DOCUMENT.value());

		criteriaOldTemplate.add(Restrictions.lt(PropertyIds.CREATION_DATE,
				startDate.getTime()));
		criteriaOldTemplate.add(Restrictions.like(PropertyIds.NAME,
				ModelDesignerServiceTest.TEMPLATE_NAME + "%"));

		ItemIterable<QueryResult> oldTemplate = criteriaOldTemplate
				.executeQuery(cmisSession, false, appo);
		for (QueryResult qr : oldTemplate.getPage()) {
			Document template = (Document) cmisSession.getObject(qr
					.getPropertyValueById(PropertyIds.OBJECT_ID).toString());

			Map<String, String> properties = new HashMap<String, String>();
			properties.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, null);
			template.updateProperties(properties);
			template.delete(true);
		}

		Criteria criteriaOldModel = CriteriaFactory
				.createCriteria(ModelPropertiesIds.MODEL_QUERY_NAME.value());

		// prende i model rimasti in sospeso il giorno prima perché non
		// funzionano le query con l'orario
		criteriaOldModel.add(Restrictions.lt(PropertyIds.CREATION_DATE,
				startDate.getTime()));
		criteriaOldModel.add(Restrictions.like(PropertyIds.NAME,
				ModelDesignerServiceTest.MODEL_NAME + "%"));

		ItemIterable<QueryResult> oldModel = criteriaOldModel.executeQuery(
				cmisSession, false, appo);
		for (QueryResult qr : oldModel.getPage()) {
			String nodeRefModel = qr
					.getPropertyValueById(PropertyIds.OBJECT_ID);
			Map<String, Object> resp = modelDesignerService.deleteModel(
					cmisSession, nodeRefModel,
					cmisService.createBindingSession());
			try {
				assertTrue(resp.get("status").equals("ok"));
			} catch (AssertionError e) {
				System.err.println("Non è stato cancellato il model: "
						+ nodeRefModel);
			}

		}

	}

	@Test
	public void testGetModels() {
		List<AlfrescoModel> models = modelDesignerService
				.getModels(cmisSession);
		assertTrue(models.size() > 0);
	}
}