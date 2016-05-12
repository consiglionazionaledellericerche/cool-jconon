package it.cnr.jconon.service;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.LoginException;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.cool.util.StringUtil;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.rest.ManageCall;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.ws.rs.core.MultivaluedHashMap;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/META-INF/cool-jconon-test-context.xml"})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class CallServiceTest {
	@Autowired
	private ManageCall manageCall;

	@Autowired
	private CMISService cmisService;

    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;
	
	@Test
	public void test1CreateCallTempoIndeterminato() throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
		Session cmisSession = cmisService.createAdminSession();

        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket("spaclient", "sp@si@n0"));


		MultivaluedMap<String, String> formParams = new MultivaluedHashMap<String, String>();
		formParams.add(PropertyIds.OBJECT_TYPE_ID, JCONONFolderType.JCONON_CALL_TIND.value());
		formParams.addAll("aspect", Arrays.asList(
				JCONONPolicyType.JCONON_CALL_ASPECT_INQUADRAMENTO.value(),
				JCONONPolicyType.JCONON_CALL_ASPECT_TIPO_SELEZIONE.value(),
				JCONONPolicyType.JCONON_CALL_ASPECT_GU.value()));
		formParams.add("add-remove-aspect","remove-P:jconon_call:aspect_macro_call");

		formParams
				.forEach((name, values) -> request.addParameter(name, values.toArray(new String[0])));

		Response response = manageCall.saveCall(request, "it", formParams);
		assertEquals(Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus());
		String content = response.getEntity().toString();
		JsonElement json = new JsonParser().parse(content);
		assertEquals(json.getAsJsonObject().get("message").getAsString() , "message.error.required.codice");
		formParams.add(JCONONPropertyIds.CALL_CODICE.value(), "TEST TIND " + UUID.randomUUID().toString());
		
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