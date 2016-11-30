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
        List<SiperSede> sedi = siperService.cacheableSediSiper();
        sedi
                .stream()
                .map(SiperSede::toString)
                .forEach(LOGGER::info);
        assertEquals(464, sedi.size());
	}

    @Test
	public void sedeSiper() throws IOException {
        String key = "BIAG00";
        SiperSede sede = siperService.cacheableSiperSede(key);
        LOGGER.info("sede  {}", sede);
        assertEquals(key, sede.getSedeId());

    }

    @Test(expected = RuntimeException.class)
    public void sedeSiperNotExisting() throws IOException {
        siperService.cacheableSiperSede("BIAGIO");
    }


    @Test
    public void cacheableSiperSede () {

        String sedeId = "BIAG00";

        // TODO: populate cache
        siperService.cacheableSediSiper()
                .stream()
                .map(SiperSede::getSedeId)
                .anyMatch(s -> s.equals(sedeId));

        SiperSede siperSede = siperService.cacheableSiperSede(sedeId);
        LOGGER.info("sede siper {}", siperSede);
        assertEquals(sedeId, siperSede.getSedeId());
    }

    @Test(expected = RuntimeException.class)
    public void cacheableSiperSedeFail() throws InterruptedException {

        String sedeId = "BIAG00";

        // TODO: initialize cache
        siperService.cacheableSediSiper()
                .stream()
                .map(SiperSede::getSedeId)
                .anyMatch(s -> s.equals(sedeId));

        Thread.sleep(5000);

        siperService.cacheableSiperSede(sedeId);
    }


    @Test
    public void cacheableSediSiper() throws InterruptedException {
        LOGGER.info("{} entries", siperService.cacheableSediSiper().size());
        LOGGER.info("{} entries", siperService.cacheableSediSiper().size());
        Thread.sleep(15000);
        LOGGER.info("{} entries", siperService.cacheableSediSiper().size());
        assertTrue(false);
    }


}
