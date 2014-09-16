package it.cnr.jconon.service;

import static org.junit.Assert.assertTrue;

import java.util.List;

import org.apache.chemistry.opencmis.client.runtime.QueryResultImpl;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-jconon-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class PeopleQueryServiceTest {

	private static final Logger LOGGER = LoggerFactory.getLogger(PeopleQueryService.class);

	@Autowired
	private PeopleQueryService peopleQueryService;

	private final static String query = "SELECT cmis:name,cmis:baseTypeId,cmis:objectId,cmis:objectTypeId,cmis:lastModificationDate,cmis:lastModifiedBy,prodotti:titolo,prodotti:autori,prodotti:affiliazioni,prodotti:id_tipo_txt,prodotti:anno FROM prodotti:prodotto join prodotti:common_metadata AS common_metadata on common_metadata.cmis:objectId = cmis:objectId WHERE (prodotti:autoricnr_login like '%lancia%')  ORDER BY prodotti:anno ASC";


	@Test
	@Ignore
	public void testQuery() {
		// TODO: Cannot access
		// https://servizipdr.cedrc.cnr.it/alfresco/cmisatom: handshake alert:
		// unrecognized_name

		MockHttpServletRequest req = new MockHttpServletRequest();
		req.addParameter("q", query);

		@SuppressWarnings("unchecked")
		List<QueryResultImpl> rows = (List<QueryResultImpl>) peopleQueryService
				.query(req).get("models");

		for (QueryResultImpl row : rows) {
			LOGGER.info(row.getProperties().toString());
		}

		assertTrue(rows.size() > 0);
	}

}
