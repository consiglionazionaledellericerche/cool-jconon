/*
 * Copyright (C) 2020 Consiglio Nazionale delle Ricerche
 *       This program is free software: you can redistribute it and/or modify
 *        it under the terms of the GNU Affero General Public License as
 *        published by the Free Software Foundation, either version 3 of the
 *        License, or (at your option) any later version.
 *
 *        This program is distributed in the hope that it will be useful,
 *        but WITHOUT ANY WARRANTY; without even the implied warranty of
 *        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *       GNU Affero General Public License for more details.
 *
 *       You should have received a copy of the GNU Affero General Public License
 *       along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

package it.cnr.si.cool.jconon.pagopa;

import it.cnr.si.cool.jconon.pagopa.config.PAGOPAConfigurationProperties;
import it.cnr.si.cool.jconon.pagopa.model.*;
import it.cnr.si.cool.jconon.pagopa.repository.Pagopa;
import it.cnr.si.cool.jconon.repository.ProtocolRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PAGOPATest {

    @Autowired
    private ProtocolRepository protocolRepository;

    @Autowired
    private PAGOPAConfigurationProperties properties;
    @Autowired
    private Pagopa pagopa;
    @Autowired
    private Pagopa pagopaDownload;

    private Pendenza pendenza;
    private Long numProtocollo;

    @Test
    @Order(1)
    public void newPendenza() throws IOException {
        final LocalDateTime now = LocalDateTime.now();
        pendenza = new Pendenza();
        pendenza.setIdTipoPendenza(properties.getTipopendenza());
        pendenza.setIdDominio(properties.getCodicefiscale());
        pendenza.setCausale("Pagamento diritti di segreteria, bando di concorso 400.3 IPCB PNRR");

        SoggettoPagatore soggettoPagatore = new SoggettoPagatore();
        soggettoPagatore.setIdentificativo("SPSMRC73H02C495G");
        soggettoPagatore.setTipo("G");
        soggettoPagatore.setAnagrafica("MARCO SPASIANO");
        soggettoPagatore.setIndirizzo("Via Ferrovia 31");
        soggettoPagatore.setCap(80040);
        soggettoPagatore.setLocalita("CERCOLA");
        soggettoPagatore.setProvincia("NA");
        soggettoPagatore.setEmail("marco.spasiano@cnr.it");
        pendenza.setSoggettoPagatore(soggettoPagatore);

        pendenza.setImporto(BigDecimal.TEN);

        String anno = String.valueOf(now.get(ChronoField.YEAR));
        String registro = ProtocolRepository.ProtocolRegistry.PAGOPA.name();
        try {
            numProtocollo = Optional.ofNullable(protocolRepository.getNumProtocollo(registro, anno))
                    .map(aLong -> {
                        if (aLong < 1000) {
                            return new Long(1001);
                        }
                        return aLong + 1;
                    }).orElse(new Long(1001));
            protocolRepository.putNumProtocollo(registro, anno, numProtocollo);
        } catch (Exception e) {
            assertNull(e);
        }

        final String iuv = properties.getGovpay().getCodicestazione() + now.get(ChronoField.YEAR)
                + String.format("%1$11s", numProtocollo).replace(' ', '0');

        pendenza.setNumeroAvviso(iuv);

        pendenza.setAnnoRiferimento(now.get(ChronoField.YEAR));
        pendenza.setDataScadenza(DateTimeFormatter.ofPattern("yyyy-MM-dd").format(now.plusDays(10)));
        pendenza.setDataNotificaAvviso(DateTimeFormatter.ofPattern("yyyy-MM-dd").format(now));
        pendenza.setDataPromemoriaScadenza(DateTimeFormatter.ofPattern("yyyy-MM-dd").format(now.plusDays(5)));

        Voci voci = new Voci();
        voci.setIbanAccredito(properties.getIban());
        voci.setDescrizione(pendenza.getCausale());
        voci.setIdVocePendenza(pendenza.getNumeroAvviso());
        voci.setCodiceContabilita(properties.getCodicecontabilita());
        voci.setTipoContabilita(properties.getTipocontabilita());
        voci.setImporto(pendenza.getImporto());
        pendenza.setVoci(Collections.singletonList(voci));

        final PendenzaResponse pendenzaResponse = pagopa.creaPendenza(
                properties.getGovpay().getDominio(),
                numProtocollo,
                Boolean.TRUE,
                pendenza
        );
        assertNotNull(pendenzaResponse);
        assertNotNull(pendenzaResponse.getPdf());
    }

    @Test
    @Order(2)
    public void stampaAvviso() throws IOException {
        final byte[] bytes = pagopaDownload.stampaAvviso(pendenza.getIdDominio(), pendenza.getNumeroAvviso());
        assertNotNull(bytes);
        Files.write(Paths.get("", "avviso.pdf"), bytes);
    }
    @Test
    @Order(3)
    public void annullaPendenza() {
        pagopa.aggiornaPendenza(properties.getGovpay().getDominio(), numProtocollo, Collections.singletonList(new AnnullaPendenza()));
    }
}
