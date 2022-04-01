/*
 * Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *
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

package it.cnr.si.cool.jconon.spid.config;

import it.cnr.si.cool.jconon.spid.repository.SPIDRepository;
import it.cnr.si.cool.jconon.spid.service.SPIDIntegrationService;
import org.apache.commons.io.IOUtils;
import org.joda.time.DateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.opensaml.common.SAMLException;
import org.opensaml.saml2.core.AuthnRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.IOException;
import java.util.Base64;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles(value = {"test", "prod"})
public class IdpConfigTest {
    @Autowired
    private IdpConfiguration idpConfiguration;

    @Autowired
    private SPIDIntegrationService spidIntegrationService;

    @Autowired
    private SPIDRepository spidRepository;

    @Test
    public void testListIdp() {
        assertEquals(Boolean.FALSE, idpConfiguration.getSpidProperties().getIdp().isEmpty());
    }

    @Test
    public void randomIdp() throws InterruptedException {
        final Optional<String> first = spidIntegrationService.getListIdp().keySet().stream().findFirst();
        TimeUnit.SECONDS.sleep(5);
        final Optional<String> second = spidIntegrationService.getListIdp().keySet().stream().findFirst();
        assertEquals(Boolean.FALSE, first.equals(second));
    }

    @Test
    public void validateResponse() throws IOException, AuthenticationException, SAMLException {
        final AuthnRequest authnRequest =
                spidIntegrationService.buildAuthenticationRequest(
                        "",
                        Optional.of("_4c17bfe3-a60a-4c17-aec1-138963c50f0f"),
                        Optional.of(DateTime.parse("2021-09-26T08:30:43.936Z"))
                );

        final String response = Base64.getEncoder().encodeToString(
                IOUtils.toByteArray(this.getClass().getResourceAsStream("/aggregator-response.xml"))
        );
        assertNotNull(spidIntegrationService.idpResponse(response));

    }

    @Test
    public void validateResponseAggregatorCIE() throws IOException, AuthenticationException, SAMLException {
        idpConfiguration.getSpidProperties().getAggregator().setIssuer("https://login.regione.umbria.it/gw/metadata");
        idpConfiguration.getSpidProperties().getAttribute().setName("nome");
        final AuthnRequest authnRequest =
                spidIntegrationService.buildAuthenticationRequest(
                        "",
                        Optional.of("_ddbaf4fc-65f0-4a05-9daa-815ce98b9f82"),
                        Optional.of(DateTime.parse("2021-11-08T07:41:00.490Z"))
                );

        final String response = Base64.getEncoder().encodeToString(
                IOUtils.toByteArray(this.getClass().getResourceAsStream("/aggregator-cie-response.xml"))
        );
        assertNotNull(spidIntegrationService.idpResponse(response));

    }
}
