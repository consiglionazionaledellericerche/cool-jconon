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

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.si.cool.jconon.repository.ProtocolRepository;
import it.cnr.si.cool.jconon.service.call.CallService;
import org.apache.chemistry.opencmis.commons.exceptions.CmisVersioningException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Calendar;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public class ProtocolloServiceTest {
    @Autowired
    private ProtocolRepository protocolRepository;

    @Autowired
    private CallService callService;

    @Autowired
    private CMISService cmisService;

    @Test
    public void testProtocollo() {
        String anno = String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
        String registro = ProtocolRepository.ProtocolRegistry.CON.name();
        Long numProtocollo = null;
        try {
            numProtocollo = protocolRepository.getNumProtocollo(registro, anno);
        } catch (Exception e) {
            assertNull(e);
        }
        assertNotNull(numProtocollo);
        assertThrows(CmisVersioningException.class, () -> {
            protocolRepository.getNumProtocollo(registro, anno);
        });
        try {
            protocolRepository.putNumProtocollo(registro, anno, (long) 2);
        } catch (Exception e) {
            assertNull(e);
        }
    }
}