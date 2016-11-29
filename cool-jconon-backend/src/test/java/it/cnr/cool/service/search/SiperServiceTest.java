package it.cnr.cool.service.search;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import static org.junit.Assert.*;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:/META-INF/cool-jconon-test-context.xml" })
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class SiperServiceTest {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SiperServiceTest.class);

	@Autowired
	private SiperService siperService;

	@Test
	public void testGetAnagraficaDipendente() {

		JsonObject anagrafica = siperService.getAnagraficaDipendente("francesco.uliana");
		LOGGER.info(anagrafica.toString());

		assertEquals("FRANCESCO", anagrafica.get("nome").getAsString());
		assertEquals("ULIANA", anagrafica.get("cognome").getAsString());
	}

	@Test
	public void testGetAnagraficaDipendenteFail() {

		JsonObject anagrafica = siperService.getAnagraficaDipendente("1");

		assertNull(anagrafica);

	}

    @Test
    public void testGetSedi() throws ExecutionException {
        JsonElement json = siperService.getSedi();
        LOGGER.info(json.toString());
        int sedi = json.getAsJsonObject().get("results").getAsJsonArray().size();
        assertTrue(sedi > 100);
    }


    @Test
	public void sediSiper() throws IOException {
        List<SiperSede> sedi = siperService.sediSiper();
        sedi
                .stream()
                .map(SiperSede::toString)
                .forEach(LOGGER::info);
        assertEquals(464, sedi.size());
	}

    @Test
	public void sedeSiper() throws IOException {
        Optional<SiperSede> sede = siperService.sedeSiper("BIAG00");


        sede
                .map(SiperSede::toString)
                .ifPresent(LOGGER::info);

        assertTrue(sede.isPresent());
    }

    @Test
    public void sedeSiperNotExisting() throws IOException {
        Optional<SiperSede> sede = siperService.sedeSiper("BIAGIO");
        assertFalse(sede.isPresent());
    }


}
