package it.cnr.cool.service.search;

import com.google.gson.JsonObject;
import com.hazelcast.core.HazelcastInstance;
import org.junit.After;
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

import java.io.IOException;
import java.util.Collection;
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

	@Autowired
    private HazelcastInstance hazelcastInstance;

	@After
    public void clear() {
	    LOGGER.info("clear map {}", SiperService.SIPER_MAP_NAME);
        hazelcastInstance.getMap(SiperService.SIPER_MAP_NAME).clear();
    }

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
    @Ignore
    public void testGetSedi() throws ExecutionException {
//        JsonElement json = siperService.getSedi();
//        LOGGER.info(json.toString());
//        int sedi = json.getAsJsonObject().get("results").getAsJsonArray().size();
//        assertTrue(sedi > 100);
    }


    @Test
	public void sediSiper() throws IOException {
        Collection<SiperSede> sedi = siperService.cacheableSediSiper();
        sedi
                .stream()
                .map(SiperSede::toString)
                .forEach(LOGGER::info);
        assertEquals(464, sedi.size());
	}

    @Test
	public void sedeSiper() throws IOException {
        String key = "BIAG00";
        SiperSede sede = siperService.cacheableSiperSede(key).get();
        LOGGER.info("sede  {}", sede);
        assertEquals(key, sede.getSedeId());

    }


    @Test
    public void sedeSiperNotExisting() throws IOException {
        assertFalse(siperService.cacheableSiperSede("BIAGIO").isPresent());
    }


    @Test
    public void cacheableSiperSede () {

        String sedeId = "BIAG00";
        SiperSede siperSede = siperService.cacheableSiperSede(sedeId).get();
        LOGGER.info("sede siper {}", siperSede);
        assertEquals(sedeId, siperSede.getSedeId());
    }


    @Test
    public void cacheableSediSiper() throws InterruptedException {
        int size = siperService.cacheableSediSiper().size();
        LOGGER.info("{} entries", size);
        LOGGER.info("{} entries", siperService.cacheableSediSiper().size());
        Thread.sleep(10_000);
//        hazelcastInstance.getMap(SiperService.SIPER_MAP_NAME).clear();
        LOGGER.info("{} entries", siperService.cacheableSediSiper().size());
        assertEquals(size, siperService.cacheableSediSiper().size());
    }


}
