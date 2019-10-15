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

package it.cnr.si.cool.jconon.util;

import it.cnr.cool.web.scripts.exception.ClientMessageException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CodiceFiscaleControlloTest {

    private static final String CF = "RSSMRA50A31F839T";
    private static final String CITTA = "F839";
    private static final String SESSO = "M";
    private static final String GIORNO = "31";
    private static final String MESE = "0";
    private static final String ANNO = "50";
    private static final String NOME = "Mario";
    private static final String COGNOME = "Rossi";

    @Test
    public void testParseCodiceFiscale() {
        CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, ANNO, MESE,
                GIORNO, SESSO, CITTA, CF);
        assertTrue(true);
    }

    @Test
    public void testParseCodiceFiscaleVocali() {
        CodiceFiscaleControllo.parseCodiceFiscale("RANA", "GIOVANNI", "90",
                "11", "31", "M", "H501", "RNAGNN90T31H501P");
        assertTrue(true);
    }

    @Test
    public void testParseCodiceFiscaleF() {
        CodiceFiscaleControllo.parseCodiceFiscale("BIANCHI", "PAOLA", "90",
                "11", "31", "F", "F205", "BNCPLA90T71F205Y");
    }

    @Test
    public void testParseCodiceFiscaleFail() {
        assertThrows(ClientMessageException.class, () -> {
            CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, ANNO, MESE,
                    GIORNO, SESSO, CITTA, CF + "X");
        });
    }

    @Test
    public void testParseCodiceFiscaleFailCognome() {
        assertThrows(ClientMessageException.class, () -> {
            CodiceFiscaleControllo.parseCodiceFiscale("BIANCHI", NOME, ANNO,
                    MESE, GIORNO, SESSO, CITTA, CF);
        });
    }

    @Test
    public void testParseCodiceFiscaleFailCognome2() {
        assertThrows(ClientMessageException.class, () -> {
            CodiceFiscaleControllo.parseCodiceFiscale("", NOME, ANNO, MESE, GIORNO,
                    SESSO, CITTA, CF);
        });
    }

    @Test
    public void testParseCodiceFiscaleFailNome() {
        assertThrows(ClientMessageException.class, () -> {
            CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, "PAOLO", ANNO,
                    MESE,
                    GIORNO, SESSO, CITTA, CF);
        });
    }

    @Test
    public void testParseCodiceFiscaleFailNome2() {
        assertThrows(ClientMessageException.class, () -> {
            CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, "", ANNO, MESE,
                    GIORNO, SESSO, CITTA, CF);
        });
    }

    @Test
    public void testParseCodiceFiscaleFailAnno() {
        assertThrows(ClientMessageException.class, () -> {
            CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, "", MESE,
                    GIORNO, SESSO, CITTA, CF);
        });
    }

    @Test
    public void testParseCodiceFiscaleFailMese() {
        assertThrows(Exception.class, () -> {
            CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, ANNO, "",
                    GIORNO, SESSO, CITTA, CF);
        });
    }

    @Test
    public void testParseCodiceFiscaleFailGiorno() {
        assertThrows(ClientMessageException.class, () -> {
            CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, ANNO, MESE,
                    "", SESSO, CITTA, CF);
        });
    }

    @Test
    public void testParseCodiceFiscaleFailSesso() {
        assertThrows(ClientMessageException.class, () -> {
            CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, ANNO, MESE,
                    GIORNO, "F", CITTA, CF);
        });
    }

    @Test
    public void testParseCodiceFiscaleFailCitta() {
        assertThrows(ClientMessageException.class, () -> {
            CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, ANNO, MESE,
                    GIORNO, "M", "", CF);
        });
    }
}
