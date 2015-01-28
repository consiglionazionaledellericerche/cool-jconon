package it.cnr.cool.service.search;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import it.cnr.cool.cmis.service.CMISService;

import org.apache.chemistry.opencmis.client.bindings.impl.SessionImpl;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.google.gson.JsonObject;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-common-core-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class SiperServiceTest {

	private static final String USERNAME = "test.selezioni";
	private static final String PASSWORD = "sp@si@n0";

	private static final String MATRICOLA = "99999";

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SiperServiceTest.class);

	@Autowired
	private SiperService siperService;

	@Autowired
	private CMISService cmisService;

	@Test
	@Ignore
	public void testGetAnagraficaDipendente() {

		SessionImpl bindingSession = cmisService.createBindingSession(USERNAME, PASSWORD);

		JsonObject anagrafica = siperService.getAnagraficaDipendente(MATRICOLA,
				bindingSession);
		LOGGER.info(anagrafica.toString());

		assertEquals("TEST", anagrafica.get("nome").getAsString());
		assertEquals("SELEZIONI", anagrafica.get("cognome").getAsString());
	}

	@Test
	public void testGetAnagraficaDipendenteFail() {
		SessionImpl bindingSession = cmisService.createBindingSession(USERNAME,
				PASSWORD);

		JsonObject anagrafica = siperService.getAnagraficaDipendente("1",
				bindingSession);

		assertNull(anagrafica);

	}

}
