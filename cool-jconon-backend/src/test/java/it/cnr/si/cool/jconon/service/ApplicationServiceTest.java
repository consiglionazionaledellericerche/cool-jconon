/*
 * Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *
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
import it.cnr.cool.cmis.service.LoginException;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.cool.service.I18nService;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.rest.ManageApplication;
import it.cnr.si.cool.jconon.util.CommonServiceTest;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.Session;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.ws.rs.core.Response;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ApplicationServiceTest {
    private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationServiceTest.class);
    private static String CALL_ID;
    private static String APPLICATION_ID;
    @Autowired
    CommonServiceTest commonServiceTest;
    @Autowired
    private CMISService cmisService;
    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;
    @Autowired
    private ManageApplication manageApplication;
    @Autowired
    private I18nService i18nService;
    @Value("${user.guest.username}")
    private String guestUserName;
    @Value("${user.guest.password}")
    private String guestPassword;

    @Test
    @Order(1)
    public void createApplication() throws LoginException {
        Session cmisSession = cmisService.createAdminSession();
        final Optional<ObjectType> any = Stream.generate(
                cmisSession.getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false).iterator()::next
        ).findAny();
        if (any.isPresent()) {
            Folder call = commonServiceTest.createCall(cmisSession, any.get());
            CALL_ID = call.getId();
            LOGGER.info("Call created with id: {}", CALL_ID);
            commonServiceTest.createApplicationNotAuthorized(CALL_ID, guestUserName, guestPassword);
            commonServiceTest.publishCall(call, any.get());
            call.refresh();
            APPLICATION_ID = commonServiceTest.createApplication(CALL_ID, guestUserName, guestPassword);
            LOGGER.info("Application created with id: {}", APPLICATION_ID);
        }
    }

    @Test
    @Order(2)
    public void saveApplication() throws LoginException {
        commonServiceTest.saveApplication(CALL_ID, APPLICATION_ID, guestUserName, guestPassword);
    }

    @Test
    @Order(3)
    public void sendApplication() throws LoginException {
        commonServiceTest.sendApplication(CALL_ID, APPLICATION_ID, guestUserName, guestPassword);
    }

    @Test
    @Order(100)
    public void deleteCallAndApplication() throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(guestUserName, guestPassword));
        Response response = commonServiceTest.removeApplication(APPLICATION_ID, guestUserName, guestPassword);
        assertEquals("La domanda per il bando selezionato risulta inviata.",
                i18nService.getLabel(commonServiceTest.getValueFromResponse(response, "message"), Locale.ITALIAN)
        );
        response = commonServiceTest.reopenApplication(APPLICATION_ID, guestUserName, guestPassword);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        response = commonServiceTest.removeApplication(APPLICATION_ID, guestUserName, guestPassword);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        response = commonServiceTest.deleteCall(CALL_ID);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
    }
}
