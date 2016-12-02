package it.cnr.cool.service.search;

import com.google.gson.JsonObject;
import com.hazelcast.core.HazelcastInstance;
import it.cnr.cool.dto.SiperSede;
import org.junit.After;
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
import java.util.Optional;

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
	public void cacheableSiperSedi() throws IOException {
        Collection<SiperSede> sedi = siperService.cacheableSiperSedi();
        sedi
                .stream()
                .map(SiperSede::toString)
                .forEach(LOGGER::info);
        assertTrue(sedi.size() > 400);
	}


    @Test
    public void cacheableSiperSederNotExisting() throws IOException {
        Optional<SiperSede> siperSede = siperService.cacheableSiperSede("BIAGIO");
        assertFalse(siperSede.isPresent());
    }


    @Test
    public void cacheableSiperSede () {

        String sedeId = "BIAG00";
        SiperSede siperSede = siperService.cacheableSiperSede(sedeId).get();
        LOGGER.info("sede siper {}", siperSede);
        assertEquals(sedeId, siperSede.getSedeId());
    }


}
