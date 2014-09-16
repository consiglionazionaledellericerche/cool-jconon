package it.cnr.cool.utility;

import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.server.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.server.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.server.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.server.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.server.setup.MockMvcBuilders.xmlConfigSetup;
import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.exception.JsonException;
import it.cnr.cool.exception.MockMvcException;
import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.Set;

import org.apache.chemistry.opencmis.commons.data.Ace;
import org.apache.chemistry.opencmis.commons.data.Principal;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.AccessControlEntryImpl;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.AccessControlPrincipalDataImpl;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.collections.MultiHashMap;
import org.apache.commons.collections.MultiMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.server.MockMvc;
import org.springframework.test.web.server.ResultActions;
import org.springframework.test.web.server.request.MockHttpServletRequestBuilder;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class Util {

	private static final String USERNAME = "username";
	private static final String PASSWORD = "password";

	private static Properties properties = null;
	private static final Logger LOGGER = LoggerFactory.getLogger(Util.class);

	private static MockMvc mockMvc = xmlConfigSetup(
			getProperty("application-config")).configureWebAppRootDir(
			"src/main/webapp", false).build();

	/* public methods */

	/* POST */

	public static JsonElement postJson(String url, String body,
			String contentType) throws MockMvcException, JsonException {
		HttpHeaders headers = getHeaders();
		MockHttpServletRequestBuilder requestBuilder = post(url).body(body.getBytes()).headers(headers).contentType(MediaType.parseMediaType(contentType));
		return manageRequestJson(requestBuilder);
	}

	public static JsonElement postJson(String url,
			HashMap<String, String> body,
			String contentType) throws MockMvcException, JsonException {
		return postJson(url, convertToMultiMap(body), contentType);
	}

	public static JsonElement postJson(String url, MultiMap body,
			String contentType) throws MockMvcException, JsonException {
		HttpHeaders headers = getHeaders();

		MockHttpServletRequestBuilder requestBuilder = post(url).headers(headers).contentType(MediaType.parseMediaType(contentType));

		addParams(body, requestBuilder);

		return manageRequestJson(requestBuilder);
	}

	/* DELETE */
	public static JsonElement deleteJson(String url, String body,
			String contentType) throws MockMvcException, JsonException {
		HttpHeaders headers = getHeaders();
		MockHttpServletRequestBuilder requestBuilder = delete(url).body(body.getBytes()).headers(headers).contentType(MediaType.parseMediaType(contentType));
		return manageRequestJson(requestBuilder);
	}

	public static JsonElement deleteJson(String url,
			HashMap<String, String> body, String contentType)
			throws MockMvcException, JsonException {
		return deleteJson(url, convertToMultiMap(body), contentType);
	}

	public static JsonElement deleteJson(String url, MultiMap body,
			String contentType) throws MockMvcException, JsonException {
		HttpHeaders headers = getHeaders();
		MockHttpServletRequestBuilder requestBuilder = delete(url).headers(headers).contentType(MediaType.parseMediaType(contentType));

		addParams(body, requestBuilder);

		return manageRequestJson(requestBuilder);
	}


	/* GET */
	public static JsonElement getJson(String url) throws MockMvcException,
			JsonException {
		HttpHeaders headers = getHeaders();
		MockHttpServletRequestBuilder requestBuilder = get(url).headers(headers);
		return manageRequestJson(requestBuilder);
	}


	/* requests manager */
	private static MockHttpServletResponse manageRequest(MockHttpServletRequestBuilder requestBuilder) throws MockMvcException, JsonException {

		ResultActions resultAction;
		CMISUser user = new CMISUser(getProperty(USERNAME));
		List<CMISGroup> group = new ArrayList<CMISGroup>() ;
		CMISGroup groupConcorsi = new CMISGroup();
		groupConcorsi.setItemName("GROUP_CONCORSI");
		group.add(groupConcorsi);
		user.setGroups(group);
		requestBuilder.principal(user);
		requestBuilder.session(new MockHttpSession());
		try {
			resultAction = mockMvc.perform(requestBuilder).andExpect(status().isOk());
		} catch (Exception e) {
			throw new MockMvcException("Errors performing request", e);
		}

		MockHttpServletResponse response = resultAction.andReturn().getResponse();

		try {
			LOGGER.info(response.getContentAsString());
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}

		return response;
	}

	private static JsonElement manageRequestJson(
			MockHttpServletRequestBuilder requestBuilder)
			throws MockMvcException, JsonException {

		MockHttpServletResponse response = manageRequest(requestBuilder);

		assertTrue(response.getContentType().startsWith(MediaType.APPLICATION_JSON.toString()));

		JsonElement root;
		try {
			root = new JsonParser().parse(response.getContentAsString());
		} catch (Exception e) {
			throw new JsonException("Errors while parsing json", e);
		}

		return root;
	}

	/* utility methods */

	private static void addParams(MultiMap body,
			MockHttpServletRequestBuilder requestBuilder) {

		for (Object key : body.keySet()) {
			Collection values = (Collection) body.get(key);
			for (Object value : values) {
				requestBuilder.param((String) key, (String) value);
			}
		}
	}

	private static MultiMap convertToMultiMap(HashMap<String, String> body) {

		MultiMap mm = new MultiHashMap();

		Set<String> keys = body.keySet();
		Iterator<String> it = keys.iterator();
		while (it.hasNext()) {
			String key = it.next();
			mm.put(key, body.get(key));
		}

		return mm;
	}

	public static Properties getProperties() {
		if (properties == null) {
			properties = new Properties();
			URL url = ClassLoader.getSystemResource("settings.properties");
			try {
				properties.load(new FileInputStream(new File(url.getFile())));
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return properties;
	}

	public static String getProperty(String key) {
		return getProperties().getProperty(key);
	}

	private static HttpHeaders getHeaders() {
		Properties prop = getProperties();
		String credentials = prop.getProperty(USERNAME) + ":"
				+ prop.getProperty(PASSWORD);
		String authorization = null;
		try {
			byte[] bytes = Base64.encodeBase64(credentials.getBytes());
			authorization = new String(bytes, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			LOGGER.error(e.getMessage(), e);
		}
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Basic " + authorization);
		return headers;
	}

	public static List<Ace> getAcesToTest() {
		List<Ace> addAces = new ArrayList<Ace>();
		List<String> permissionsConsumer = new ArrayList<String>();
		permissionsConsumer.add(ACLType.Consumer.name());
		Principal principal = new AccessControlPrincipalDataImpl("spaclient");
		Ace aceConsumer = new AccessControlEntryImpl(principal,
				permissionsConsumer);
	
		List<String> permissionsCollaborator = new ArrayList<String>();
		permissionsCollaborator.add(ACLType.Collaborator.name());
		Principal principalCollaborator = new AccessControlPrincipalDataImpl(
				"paolo.cirone");
		Ace aceCollaborator = new AccessControlEntryImpl(principalCollaborator,
				permissionsCollaborator);
	
		List<String> permissionsContributor = new ArrayList<String>();
		permissionsContributor.add(ACLType.Contributor.name());
		Principal principalContributor = new AccessControlPrincipalDataImpl(
				"fabrizio.pierleoni");
		Ace aceContributor = new AccessControlEntryImpl(principalContributor,
				permissionsContributor);
	
		List<String> permissionsCoordinator = new ArrayList<String>();
		permissionsCoordinator.add(ACLType.Coordinator.name());
		Principal principalCoordinator = new AccessControlPrincipalDataImpl(
				"massimo.fraticelli");
		Ace aceCoordinator = new AccessControlEntryImpl(principalCoordinator,
				permissionsCoordinator);
	
		List<String> permissionsEditor = new ArrayList<String>();
		permissionsEditor.add(ACLType.Editor.name());
		Principal principalEditor = new AccessControlPrincipalDataImpl(
				"francesco.uliana");
		Ace aceEditor = new AccessControlEntryImpl(principalEditor,
				permissionsEditor);
	
		List<String> permissionsFullControl = new ArrayList<String>();
		permissionsFullControl.add(ACLType.FullControl.name());
		Principal principalFullControl = new AccessControlPrincipalDataImpl(
				"marco.spasiano");
		Ace aceFullControl = new AccessControlEntryImpl(principalFullControl,
				permissionsFullControl);
	
		addAces.add(aceConsumer);
		addAces.add(aceCollaborator);
		addAces.add(aceContributor);
		addAces.add(aceCoordinator);
		addAces.add(aceEditor);
		addAces.add(aceFullControl);
		return addAces;
	}
}
