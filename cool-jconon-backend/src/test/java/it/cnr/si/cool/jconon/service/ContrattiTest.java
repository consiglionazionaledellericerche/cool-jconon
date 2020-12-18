package it.cnr.si.cool.jconon.service;

import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.GroupsEnum;
import it.cnr.cool.util.StringUtil;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.StreamSupport;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public class ContrattiTest {
    @Autowired
    private CMISService cmisService;
    @Autowired
    private ACLService aclService;
    @Autowired
    private OperationContext cmisCountOperationContext;

    @Test
    public void contratti() {
        int skipTo = 1000;
        final Session adminSession = cmisService.createAdminSession();
        adminSession.setDefaultContext(cmisCountOperationContext);
        Map<String, ACLType> aces = new HashMap<String, ACLType>();
        aces.put("GROUP_CONTRATTI", ACLType.Consumer);
        aces.put("GROUP_INCARICHI", ACLType.Consumer);

        ItemIterable<QueryResult> query = adminSession.query(
                "select alfcmis:nodeRef,cmis:creationDate from sigla_contratti_attachment:contratto WHERE cmis:creationDate > '2015-02-16T00:00:00' and IN_TREE ('925d3d1f-91f0-4a38-a082-7808a6b048dd') order by cmis:creationDate",
                false);
        long totalNumItems = query.getTotalNumItems();
        System.out.println(totalNumItems);
        for (int i = 0; i < totalNumItems; i = i + skipTo) {
            System.out.println(i);
            StreamSupport.stream(query.getPage(skipTo).skipTo(i).spliterator(), false)
                    .forEach(queryResult -> {
                        String propertyValueById = queryResult.<String>getPropertyValueById("alfcmis:nodeRef");
                        System.out.println(
                                StringUtil.DATEFORMAT.format(queryResult.<Calendar>getPropertyValueById("cmis:creationDate").getTime())
                        );
                        if (!aclService.getPermission(cmisService.getAdminSession(), propertyValueById).toString().contains("GROUP_CONTRATTI")) {
                            aclService.addAcl(cmisService.getAdminSession(), propertyValueById, aces);
                        }
                    });

        }
    }
}