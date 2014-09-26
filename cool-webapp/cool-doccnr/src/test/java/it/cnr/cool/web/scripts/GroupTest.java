package it.cnr.cool.web.scripts;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.rest.Proxy;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpSession;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.core.Response.Status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-doccnr-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class GroupTest {

	private static final String URL = "url";

	@Autowired
	private CMISService cmisService;

	@Autowired
	private Proxy proxy;

	private static final String APPLICATION_JSON = "application/json";
	private static final String USERNAME = "admin";
	private static final String GUEST = "guest";
	private static final String PROXY = "";
	private static final String CHILDREN = "service/cnr/groups/children";

	private static String rootId;

	private static final Logger LOGGER = LoggerFactory.getLogger(GroupTest.class);

	@Before
	public void setUp() throws Exception {
		JsonObject json = getJson(PROXY + "service/cnr/groups/root")
				.getAsJsonObject();

		rootId = json.get("id").getAsString();

		assertNotNull(rootId);

		JsonArray allowableActions = json.get("allowableActions")
				.getAsJsonArray();

		assertTrue(allowableActions.size() > 0);

	}

	@Test
	public void testRoot() throws Exception {

		JsonArray resultsGrid = getChildren(rootId);

		JsonArray resultsTree = getJson(
				CHILDREN + "?authorityType=GROUP&fullName=" + rootId)
				.getAsJsonArray();

		// resultsGrid should contains both users and group
		assertTrue(resultsGrid.size() >= resultsTree.size());

		JsonObject group1 = getGroup(resultsTree);

		String authorityId = group1.get("attr").getAsJsonObject().get("authorityId").getAsString();
		String idx = group1.get("attr").getAsJsonObject().get("id")
				.getAsString();
		int nChildren = getChildren(idx).size();

		String body = getRequestBody(authorityId, GUEST);

		JsonElement result = postJson(CHILDREN, body,
				APPLICATION_JSON);

		LOGGER.info(result.toString());

		assertTrue(result.getAsJsonObject().get("success").getAsBoolean());

		assertEquals(nChildren + 1, getChildren(idx).size());

		boolean flag = false;
		// fails if an authority is added twice
		try {
			postJson(CHILDREN, body, APPLICATION_JSON);
		} catch (Exception e) {
			flag = true;
		}

		String nodeRef = group1.get("attr").getAsJsonObject().get("id")
				.getAsString();

		deleteJson(CHILDREN + "?childFullName=" + GUEST
				+ "&parentNodeRef=" + nodeRef, "", APPLICATION_JSON);

		assertEquals(nChildren, getChildren(idx).size());

		assertTrue(flag);
	}

	private JsonObject getGroup(JsonArray resultsTree) {

		for (int i = 0; i < resultsTree.size(); i++) {
			JsonObject item = resultsTree.get(i).getAsJsonObject();
			String id = item.get("attr").getAsJsonObject().get("authorityId")
					.getAsString();
			if ("GROUP_EMAIL_CONTRIBUTORS".equals(id)) {
				return item;
			}
		}

		return null;
	}

	@Test(expected = InternalServerErrorException.class)
	public void testAddAssociationFail() throws Exception {
		String body = getRequestBody("", "");
		postJson(CHILDREN, body, APPLICATION_JSON);

	}

	@Test(expected = InternalServerErrorException.class)
	public void testDeleteAssociationFail() throws Exception {
		deleteJson(CHILDREN + "?childFullName=" + USERNAME, "",
				APPLICATION_JSON);
	}

	@Test
	// cnr/groups/root
	public void testRootGroup() throws Exception {
		JsonArray root = getChildren(null);
		LOGGER.info(root.toString());
	}

	@Test
	public void testGroupDescendants() throws Exception {
		String url = PROXY + "service/cnr/groups/my-groups-descendant/" + USERNAME;
		JsonElement descendants = getJson(url);
		LOGGER.info(descendants.toString());
		String group = "GROUP_EMAIL_CONTRIBUTORS";
		assertTrue(descendants.getAsJsonObject().get("tree").getAsJsonObject()
				.get(group).getAsBoolean());
		assertTrue(descendants.getAsJsonObject().get("detail")
				.getAsJsonObject().get(group).getAsJsonObject()
				.get("groupNodeRef").getAsString() != null);
	}

	@Test
	public void testAutocompleteGroups() throws Exception {

		String url = PROXY + "service/cnr/groups/autocomplete-group"
				+ "?filter=*admin*";
		JsonElement results = getJson(url);
		LOGGER.debug(results.toString());
		assertTrue(results.getAsJsonObject().get("groups").getAsJsonArray()
				.size() > 0);
	}

	@Test
	public void createAndDeleteGroup() throws Exception {

		String url = PROXY + "service/cnr/groups/group";
		String name = "anotherGroup";

		JsonArray root = getChildren(null);
		JsonObject group = root.getAsJsonArray().get(0).getAsJsonObject()
				.get("attr").getAsJsonObject();
		String authorityId = group.get("authorityId").getAsString();
		String id = group.get("id").getAsString();

		LOGGER.info(id);

		// create new group as root direct child

		JsonObject body = new JsonObject();
		body.addProperty("parent_node_ref", id);
		body.addProperty("group_name", name);
		body.addProperty("display_name", name);

		int nChildren = getChildren(authorityId)
				.size();

		// create new group
		JsonElement content = postJson(url, body.toString(), APPLICATION_JSON);
		assertTrue(content.getAsJsonObject().get("success").getAsBoolean());
		String nodeRef = content.getAsJsonObject().get("nodeRef").getAsString();
		LOGGER.debug(content.toString());
		assertEquals(nChildren + 1,
				getChildren(authorityId).size());

		// delete group
		deleteJson(url + "?group_node_ref=" + nodeRef, "",
				APPLICATION_JSON);
		assertEquals(nChildren,
				getChildren(authorityId).size());

	}

	/* utility methods */

	private JsonArray getChildren(String what) throws Exception {
		return getJson(
				CHILDREN + (what != null ? ("?fullName=" + what) : ""))
				.getAsJsonArray();
	}


	private String getRequestBody(String parentGroupName, String childName) {
		JsonObject o = new JsonObject();
		o.addProperty("parent_group_name", parentGroupName);
		o.addProperty("child_name", childName);
		return o.toString();
	}

	private JsonElement getJson(String url) throws IOException {

		LOGGER.info(url);

		MockHttpServletRequest req = getRequest(url);
		MockHttpServletResponse res = new MockHttpServletResponse();

		proxy.get(req, res);

		return extractJson(res);
	}

	private JsonElement postJson(String url, String content,
			String contentType) throws IOException {

		LOGGER.info(url);

		MockHttpServletRequest req = getRequest(url);
		req.setContentType(contentType);
		req.setContent(content.getBytes());

		MockHttpServletResponse res = new MockHttpServletResponse();

		proxy.post(req, res);

		if (res.getStatus() != Status.OK.getStatusCode()) {
			throw new InternalServerErrorException();
		}

		return extractJson(res);

	}

	private JsonElement deleteJson(String url, String content,
			String contentType) throws Exception {

		LOGGER.info(url);

		MockHttpServletRequest req = getRequest(url);
		req.setContentType(contentType);
		req.setContent(content.getBytes());

		MockHttpServletResponse res = new MockHttpServletResponse();

		proxy.delete(req, res);

		if (res.getStatus() != javax.ws.rs.core.Response.Status.OK
				.getStatusCode()) {
			throw new InternalServerErrorException();
		}

		return extractJson(res);
	}

	private JsonElement extractJson(MockHttpServletResponse res)
			throws UnsupportedEncodingException {

		String json = res.getContentAsString();
		LOGGER.info(json);
		return new JsonParser().parse(json);
	}

	private MockHttpServletRequest getRequest(String url) {
		MockHttpServletRequest req = new MockHttpServletRequest();
		req.setParameter(URL, url);
		HttpSession session = req.getSession();
		session.setAttribute(CMISService.BINDING_SESSION,
				cmisService.createBindingSession("admin", "admin"));
		return req;
	}

}
