package it.cnr.si.cool.jconon.service;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.service.frontOffice.FrontOfficeService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.service.application.ExportApplicationsService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assume.assumeTrue;

/**
 * Created by cirone on 29/01/2015.
 */

@RunWith(SpringRunner.class)
@SpringBootTest
public class ExportApplicationServiceTest {

    @Autowired
    ExportApplicationsService exportApplicationsService;
    @Autowired
    CMISService cmisService;
    @Autowired
    private OperationContext cmisDefaultOperationContext;
    @Autowired
    UserService userService;

    private String finalZipNodeRef;
    private Session adminSession;
    private String nodeRefbando;


    @Before
    public void init() {
        adminSession = cmisService.createAdminSession();
        Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
        criteria.add(Restrictions.eq(JCONONPropertyIds.CALL_CODICE.value(), "364.172 B"));
        criteria.add(Restrictions.le(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), FrontOfficeService.getNowUTC()));
        ItemIterable<QueryResult> queryResult = criteria.executeQuery(
                adminSession, false, cmisDefaultOperationContext);
//        se non trovo bandi "scaduti" i test vengono ignorati
        assumeTrue(queryResult.getTotalNumItems() > 0);
        nodeRefbando = (String) queryResult.iterator().next().getPropertyById(PropertyIds.OBJECT_ID).getFirstValue();
    }

    @After
    public void deleteZip() {
    	// se il test non crea lo zip (es: exportApplicationsServiceTestUnautorized) finalZipNodeRef è null
        if (finalZipNodeRef != null) {
        	// cancello il file zip creato
        	adminSession.getObject(finalZipNodeRef).delete();
        }
    }

    @Test
    public void exportApplicationsServiceTest() {
        BindingSession bindingSession = cmisService.getAdminSession();
        finalZipNodeRef = exportApplicationsService.exportApplications(adminSession, bindingSession, 
        		"workspace://SpacesStore/" + nodeRefbando.split(";")[0], userService.loadUser("admin", bindingSession), false, false, null).get("nodeRef");
        assertTrue(finalZipNodeRef != null);
    }

    @Test(expected = ClientMessageException.class)
    public void exportApplicationsServiceTestUnautorized() {
        BindingSession bindingSession = cmisService.createBindingSession("jconon", "jcononpw");
        exportApplicationsService.exportApplications(cmisService.getRepositorySession("jconon", "jcononpw"), bindingSession, 
        		"workspace://SpacesStore/" + nodeRefbando.split(";")[0], userService.loadUser("jconon", bindingSession), false, false, null);
    }
}
