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

import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.LoginException;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.service.application.ExportApplicationsService;
import it.cnr.si.cool.jconon.util.CommonServiceTest;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.exceptions.CmisPermissionDeniedException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisUnauthorizedException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Created by cirone on 29/01/2015.
 */

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public class ExportApplicationServiceTest {

    private static String finalZipNodeRef;
    private static Folder call;
    @Autowired
    ExportApplicationsService exportApplicationsService;
    @Autowired
    CMISService cmisService;
    @Autowired
    UserService userService;
    @Autowired
    CommonServiceTest commonServiceTest;
    @Autowired
    private OperationContext cmisDefaultOperationContext;
    @Value("${user.admin.username}")
    private String adminUserName;
    @Value("${user.admin.password}")
    private String adminPassword;
    @Value("${user.guest.username}")
    private String guestUserName;
    @Value("${user.guest.password}")
    private String guestPassword;

    @BeforeEach
    public void init() throws LoginException {
        Session adminSession = cmisService.createAdminSession();
        final Optional<ObjectType> any = Stream.generate(
                adminSession.getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false).iterator()::next
        ).findAny();
        call = commonServiceTest.createCall(adminSession, any.get());
    }

    @AfterEach
    public void deleteZip() {
        Session adminSession = cmisService.createAdminSession();
        // se il test non crea lo zip (es: exportApplicationsServiceTestUnautorized) finalZipNodeRef è null
        if (finalZipNodeRef != null) {
            // cancello il file zip creato
            adminSession.getObject(finalZipNodeRef).delete();
        }
        adminSession.delete(call);
    }

    @Test
    public void exportApplicationsServiceTest() {
        Session adminSession = cmisService.createAdminSession();
        BindingSession bindingSession = cmisService.getAdminSession();
        assertThrows(ClientMessageException.class, () -> {
            exportApplicationsService.exportApplications(adminSession, bindingSession,
                    call.getPropertyValue(PropertyIds.OBJECT_ID),
                    userService.loadUser(adminUserName, bindingSession), false, false, null).get("nodeRef");
        });
    }

    @Test
    public void exportApplicationsServiceTestUnautorized() {
        BindingSession bindingSession = cmisService.createBindingSession(guestUserName, guestPassword);
        assertThrows(CmisPermissionDeniedException.class, () -> {
            exportApplicationsService.exportApplications(cmisService.getRepositorySession(guestUserName, guestPassword), bindingSession,
                    call.getPropertyValue(PropertyIds.OBJECT_ID),
                    userService.loadUser(guestUserName, bindingSession), false, false, null);
        });
    }
}
