package it.cnr.cool.service.modelDesigner;

import static org.junit.Assert.assertTrue;
import it.cnr.cool.cmis.model.ModelPropertiesIds;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.modelDesigner.ModelDesignerService;
import it.cnr.cool.service.util.AlfrescoModel;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.IOException;
import java.util.Calendar;
import java.util.List;

import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
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
	public void deleteOldTestModel() {
		Criteria criteria = CriteriaFactory
				.createCriteria(ModelPropertiesIds.MODEL_QUERY_NAME.value());

		Calendar startDate = Calendar.getInstance();
		// prende i model rimasti in sospeso il giorno prima perché non
		// funzionano le query con l'orario
		criteria.add(Restrictions.lt(PropertyIds.CREATION_DATE,
				startDate.getTime()));
		criteria.add(Restrictions.like(PropertyIds.NAME,
				ModelDesignerServiceTest.MODEL_NAME + "%"));

		OperationContext appo = new OperationContextImpl();
		ItemIterable<QueryResult> queryResult = criteria.executeQuery(
				cmisSession, false, appo);
		for (QueryResult qr : queryResult.getPage()) {
			String nodeRefModel = qr
					.getPropertyValueById(PropertyIds.OBJECT_ID);
			modelDesignerService.deleteModel(cmisSession, nodeRefModel);
		}
	}

	@Test
	public void testGetModels() {
		List<AlfrescoModel> models = modelDesignerService
				.getModels(cmisSession);
		assertTrue(models.size() > 0);
	}
}