package it.cnr.jconon.service;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.frontOffice.FrontOfficeService;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.service.application.ExportApplicationsService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static junit.framework.TestCase.assertTrue;

/**
 * Created by cirone on 29/01/2015.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/META-INF/cool-jconon-test-context.xml"})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class ExportApplicationServiceTest {

    @Autowired
    ExportApplicationsService exportApplicationsService;
    @Autowired
    CMISService cmisService;
    @Autowired
    private OperationContext cmisDefaultOperationContext;



    //non ho bisogno di cancellare lo zip perché verrà sempre ricreato e sovrascritto


    @Test
    public void exportApplicationsServiceTest(){

        Session adminSession = cmisService.createAdminSession();
        BindingSession bindingSession = cmisService.getAdminSession();

        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());

        criteria.add(Restrictions.le(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), FrontOfficeService.getNowUTC()));
        ItemIterable<QueryResult> queryResult = criteria.executeQuery(
                adminSession, false, cmisDefaultOperationContext);
        String nodeRefbando = ((QueryResult)queryResult.iterator().next()).getPropertyValueById(PropertyIds.OBJECT_ID);


        String query = "SELECT * from jconon_application:folder WHERE (jconon_application:stato_domanda = 'C' AND IN_TREE ('workspace://SpacesStore/" + nodeRefbando + "'))";
        String finalZipNodeRef = exportApplicationsService.exportApplications(adminSession, bindingSession, query, "workspace://SpacesStore/" + nodeRefbando.split(";")[0]);

        assertTrue(finalZipNodeRef != null);
    }
}
