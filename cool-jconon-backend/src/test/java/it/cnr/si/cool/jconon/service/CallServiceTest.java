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

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.LoginException;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.cool.util.StringUtil;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPolicyType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.rest.ManageCall;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.ws.rs.core.MultivaluedHashMap;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.util.*;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CallServiceTest {
	@Autowired
	private ManageCall manageCall;

	@Autowired
	private CMISService cmisService;

    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;

	@Value("${user.admin.username}")
	private String adminUserName;
	@Value("${user.admin.password}")
	private String adminPassword;

	@Test
	public void test1CreateCall() throws LoginException {
		Session cmisSession = cmisService.createAdminSession();
		for (ObjectType objectType : cmisSession.getTypeChildren(JCONONFolderType.JCONON_CALL.value(), false)) {
	        MockHttpServletRequest request = new MockHttpServletRequest();
	        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(adminUserName, adminPassword));
			MultivaluedMap<String, String> formParams = new MultivaluedHashMap<String, String>();
			formParams.add(PropertyIds.OBJECT_TYPE_ID, objectType.getId());
			formParams.addAll("aspect", Arrays.asList(
					JCONONPolicyType.JCONON_CALL_ASPECT_INQUADRAMENTO.value(),
					JCONONPolicyType.JCONON_CALL_ASPECT_TIPO_SELEZIONE.value(),
					JCONONPolicyType.JCONON_CALL_ASPECT_GU.value(),
					JCONONPolicyType.JCONON_CALL_ASPECT_SETTORE_TECNOLOGICO.value(),
					JCONONPolicyType.JCONON_CALL_ASPECT_MACROAREA_DIPARTIMENTALE.value(),					
					JCONONPolicyType.JCONON_CALL_ASPECT_LINGUE_DA_CONOSCERE.value()));
			formParams.add("add-remove-aspect","remove-P:jconon_call:aspect_macro_call");

			formParams
					.forEach((name, values) -> request.addParameter(name, values.toArray(new String[0])));

			Response response = manageCall.saveCall(request, "it", formParams);
			assertEquals(Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus());
			String content = response.getEntity().toString();
			JsonElement json = new JsonParser().parse(content);
			assertEquals(json.getAsJsonObject().get("message").getAsString() , "message.error.required.codice");
			formParams.add(JCONONPropertyIds.CALL_CODICE.value(), "TEST " + objectType.getId().replaceAll("(:|_)", "-").toUpperCase() + " - " + UUID.randomUUID().toString());
			
			response = manageCall.saveCall(request, "it", formParams);
			assertEquals(Status.OK.getStatusCode(), response.getStatus());
			content = response.getEntity().toString();
			json = new JsonParser().parse(content);
			CmisObject cmisObject = cmisSession.getObject(json.getAsJsonObject().get(PropertyIds.OBJECT_ID).getAsString());
			assertNotNull(cmisObject);
			formParams.add(PropertyIds.OBJECT_ID, cmisObject.getId());
			formParams.add(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value(), StringUtil.CMIS_DATEFORMAT.format(new Date()));
			formParams.add(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), "2100-12-31T23:59:59.999+02:00");

			formParams
					.forEach((name, values) -> request.addParameter(name, values.toArray(new String[0])));

			response = manageCall.saveCall(request, "it", formParams);
			assertEquals(Status.OK.getStatusCode(), response.getStatus());
			formParams.add("publish","true");
			response = manageCall.publishCall(request, "it", formParams);
			assertEquals(Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus());		
		
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
}