/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.service;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.service.frontOffice.FrontOfficeService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.service.application.ExportApplicationsService;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
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
