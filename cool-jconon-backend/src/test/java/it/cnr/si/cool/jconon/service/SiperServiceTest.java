/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.service;

import com.google.gson.JsonObject;
import com.hazelcast.core.HazelcastInstance;
import it.cnr.si.cool.jconon.dto.SiperSede;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.Collection;
import java.util.Optional;

import static org.junit.Assert.*;


@RunWith(SpringRunner.class)
@SpringBootTest
@Profile("siper")
public class SiperServiceTest {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SiperServiceTest.class);

	@Autowired
	private SiperService siperService;

	@Autowired
    private HazelcastInstance hazelcastInstance;

	@Value("${siper.username}")
	private String userName;

	@After
    public void clear() {
	    LOGGER.info("clear map {}", SiperService.SIPER_MAP_NAME);
        hazelcastInstance.getMap(SiperService.SIPER_MAP_NAME).clear();
    }

	@Test
	public void testGetAnagraficaDipendente() {

		JsonObject anagrafica = siperService.getAnagraficaDipendente(userName);
		LOGGER.info(anagrafica.toString());

		assertEquals(userName, anagrafica.get("uid").getAsString());
		assertEquals("AccountDiServizio", anagrafica.get("sigla_sede").getAsString());
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
