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

import com.fasterxml.jackson.databind.ObjectMapper;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.LoginException;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.MimeTypes;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPolicyType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.rest.ManageCall;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.CommissioneRuolo;
import it.cnr.si.cool.jconon.util.CommonServiceTest;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisUnauthorizedException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public class CallServiceTest {
    @Autowired
    CommonServiceTest commonServiceTest;
    @Autowired
    private ManageCall manageCall;
    @Autowired
    private CMISService cmisService;
    @Autowired
    private I18nService i18nService;
    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;
    @Autowired
    CallService callService;

    @Value("${user.guest.username}")
    private String guestUserName;
    @Value("${user.guest.password}")
    private String guestPassword;

    @Test
    public void testCreateAllCallType() throws LoginException {
        Session cmisSession = cmisService.createAdminSession();
        for (ObjectType objectType : cmisSession.getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false)) {
            final CmisObject call = commonServiceTest.createCall(cmisSession, objectType);
            final Response response = commonServiceTest.deleteCall(call.getId());
            assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        }
    }

    @Test
    public void testCreateLinkDocument() {
        Session cmisSession = cmisService.createAdminSession();
        Map<String, Object> propertiesFolder = new HashMap<String, Object>();
        propertiesFolder.put(PropertyIds.NAME, "TEST FOLDER COPY");
        propertiesFolder.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_FOLDER.value());
        final Folder testFolderCopy = cmisSession.getRootFolder().createFolder(propertiesFolder);

        Map<String, Object> propertiesDocument = new HashMap<String, Object>();
        propertiesDocument.put(PropertyIds.NAME, "TEST DOCUMENT COPY");
        propertiesDocument.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
        final Document document = cmisSession.getRootFolder().createDocument(propertiesDocument, null, VersioningState.MAJOR);

        document.addToFolder(testFolderCopy, true);

        assertEquals(document.getParents().size(), 2);

        document.delete();
        testFolderCopy.delete();

    }

    @Test
    public void testPublishCall() throws LoginException {
        Session cmisSession = cmisService.createAdminSession();
        final Optional<ObjectType> any = Stream.generate(
                cmisSession.getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false).iterator()::next
        ).findAny();
        if (any.isPresent()) {
            final Folder call = commonServiceTest.createCall(cmisSession, any.get());
            assertThrows(CmisUnauthorizedException.class, () -> {
                cmisService.getRepositorySession(guestUserName, guestPassword).getObject(call.getId());
            });
            commonServiceTest.publishCall(call, any.get());
            assertNotNull(cmisService.getRepositorySession(guestUserName, guestPassword).getObject(call.getId()));
            final Response response = commonServiceTest.deleteCall(call.getId());
            assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        }
    }

    @Test
    public void testProtocolApplication() throws LoginException, URISyntaxException, IOException {
        Session cmisSession = cmisService.createAdminSession();
        final Optional<ObjectType> any = Stream.generate(
                cmisSession.getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false).iterator()::next
        ).findAny();
        if (any.isPresent()) {
            final Folder call = commonServiceTest.createCall(cmisSession, any.get());
            commonServiceTest.publishCall(call, any.get());
            call.refresh();
            assertNotNull(call.getPropertyValue(JCONONPropertyIds.CALL_COMMISSIONE.value()));
            final String applicationId = commonServiceTest.createApplication(call.getId(), guestUserName, guestPassword);
            commonServiceTest.saveApplication(call.getId(), applicationId, guestUserName, guestPassword);
            cmisSession.createDocument(
                    Stream.of(
                            new AbstractMap.SimpleEntry<>(PropertyIds.NAME, "generico Ãƒ.txt"),
                            new AbstractMap.SimpleEntry<>(PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
                                    Arrays.asList(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value())
                            ),
                             new AbstractMap.SimpleEntry<>(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_ALLEGATO_GENERICO.value()))
                            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)),
                    new ObjectIdImpl(applicationId),
                    new ContentStreamImpl("generico Ãƒ.txt", MimeTypes.TEXT.mimetype(), "Generico"),
                    VersioningState.MAJOR
            );
            commonServiceTest.sendApplication(call.getId(), applicationId, guestUserName, guestPassword);
            assertNotEquals(callService.getTotalApplicationSend(call),
                    callService.getApplicationConfirmed(cmisSession, call).getTotalNumItems());

            commonServiceTest.reopenApplication(applicationId, guestUserName, guestPassword);
            commonServiceTest.removeApplication(applicationId, guestUserName, guestPassword);
            commonServiceTest.deleteCall(call.getId());
        }
    }

    @Test
    public void testCreateCommissario() throws LoginException, URISyntaxException, IOException {
        Session cmisSession = cmisService.createAdminSession();
        final Optional<ObjectType> any = Stream.generate(
                cmisSession.getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false).iterator()::next
        ).findAny();
        if (any.isPresent()) {
            final Folder call = commonServiceTest.createCall(cmisSession, any.get());
            commonServiceTest.publishCall(call, any.get());
            call.refresh();
            assertNotNull(call.getPropertyValue(JCONONPropertyIds.CALL_COMMISSIONE.value()));
            final String applicationId = commonServiceTest.createApplication(call.getId(), guestUserName, guestPassword);
            commonServiceTest.saveApplication(call.getId(), applicationId, guestUserName, guestPassword);
            commonServiceTest.sendApplication(call.getId(), applicationId, guestUserName, guestPassword);

            final CMISUser user = commonServiceTest.createUser("cambiala");
            commonServiceTest.confirmUser(user.getUserName(), user.getPin());

            Map<String, String> map = Stream.of(
                    new AbstractMap.SimpleEntry<>(PropertyIds.NAME, UUID.randomUUID().toString()),
                    new AbstractMap.SimpleEntry<>(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_COMMISSIONE_METADATA.value()),
                    new AbstractMap.SimpleEntry<>(JCONONPropertyIds.COMMISSIONE_APPELLATIVO.value(), "Prof."),
                    new AbstractMap.SimpleEntry<>(JCONONPropertyIds.COMMISSIONE_COGNOME.value(), user.getLastName()),
                    new AbstractMap.SimpleEntry<>(JCONONPropertyIds.COMMISSIONE_NOME.value(), user.getFirstName()),
                    new AbstractMap.SimpleEntry<>(JCONONPropertyIds.COMMISSIONE_SESSO.value(), "M"),
                    new AbstractMap.SimpleEntry<>(JCONONPropertyIds.COMMISSIONE_QUALIFICA.value(), "Prof. Ordinario"),
                    new AbstractMap.SimpleEntry<>(JCONONPropertyIds.COMMISSIONE_RUOLO.value(), CommissioneRuolo.A_PRE.name()),
                    new AbstractMap.SimpleEntry<>(JCONONPropertyIds.COMMISSIONE_EMAIL.value(), user.getEmail())
            ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            cmisSession.createDocument(map, call, null, null);

            Response response = commonServiceTest.deleteCall(call.getId());
            assertEquals("Il bando non può essere cancellato, in quanto ci sono domande presentate!",
                    i18nService.getLabel(commonServiceTest.getValueFromResponse(response, "message"), Locale.ITALIAN)
            );
            response = commonServiceTest.removeApplication(applicationId, guestUserName, guestPassword);
            assertEquals("La domanda per il bando selezionato risulta inviata.",
                    i18nService.getLabel(commonServiceTest.getValueFromResponse(response, "message"), Locale.ITALIAN)
            );
            response = commonServiceTest.reopenApplication(applicationId, guestUserName, guestPassword);
            assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
            response = commonServiceTest.removeApplication(applicationId, guestUserName, guestPassword);
            assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
            response = commonServiceTest.deleteCall(call.getId());
            assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

            commonServiceTest.deleteUser(user.getUserName());
        }
    }

}