package it.cnr.cool.web.scripts;


import static org.junit.Assert.assertTrue;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.rest.Proxy;

import java.io.IOException;



import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
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

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-doccnr-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class WorkflowTest {

	private static final Logger LOGGER = LoggerFactory.getLogger(WorkflowTest.class);

	private static final String URL = "url";

	@Autowired
	private Proxy proxy;

	@Autowired
	private CMISService cmisService;

	@Test
	public void testTasks() throws IOException, JSONException {
		JSONArray array = getJson("service/api/task-instances");
		assertTrue(array.length() == 0);
	}

	@Test
	public void testProcessDefinitions() throws IOException, JSONException {
		JSONArray array = getJson("service/api/workflow-definitions");
		assertTrue(array.length() > 0);
	}

	private JSONArray getJson(String url) throws IOException, JSONException {

		MockHttpServletRequest req = new MockHttpServletRequest();
		req.setParameter(URL, url);

		MockHttpServletResponse res = new MockHttpServletResponse();

		proxy.get(req, null, res);

		String content = res.getContentAsString();
		JSONObject json = new JSONObject(content);

		LOGGER.info(json.toString());

		return json.getJSONArray("data");

	}

}