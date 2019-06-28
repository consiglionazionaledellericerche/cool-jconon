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
import org.junit.Test;

import static org.junit.Assert.assertTrue;

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

	@Test(expected = ClientMessageException.class)
	public void testParseCodiceFiscaleFail() {
		CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, ANNO, MESE,
				GIORNO, SESSO, CITTA, CF + "X");
	}

	@Test(expected = ClientMessageException.class)
	public void testParseCodiceFiscaleFailCognome() {
		CodiceFiscaleControllo.parseCodiceFiscale("BIANCHI", NOME, ANNO,
				MESE, GIORNO, SESSO, CITTA, CF);
	}

	@Test(expected = ClientMessageException.class)
	public void testParseCodiceFiscaleFailCognome2() {
		CodiceFiscaleControllo.parseCodiceFiscale("", NOME, ANNO, MESE, GIORNO,
				SESSO, CITTA, CF);
	}

	@Test(expected = ClientMessageException.class)
	public void testParseCodiceFiscaleFailNome() {
		CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, "PAOLO", ANNO,
				MESE,
				GIORNO, SESSO, CITTA, CF);
	}

	@Test(expected = ClientMessageException.class)
	public void testParseCodiceFiscaleFailNome2() {
		CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, "", ANNO, MESE,
				GIORNO, SESSO, CITTA, CF);
	}

	@Test(expected = ClientMessageException.class)
	public void testParseCodiceFiscaleFailAnno() {
		CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, "", MESE,
				GIORNO, SESSO, CITTA, CF);
	}

	@Test(expected = Exception.class)
	public void testParseCodiceFiscaleFailMese() {
		CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, ANNO, "",
				GIORNO, SESSO, CITTA, CF);
	}

	@Test(expected = ClientMessageException.class)
	public void testParseCodiceFiscaleFailGiorno() {
		CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, ANNO, MESE,
				"", SESSO, CITTA, CF);
	}

	@Test(expected = ClientMessageException.class)
	public void testParseCodiceFiscaleFailSesso() {
		CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, ANNO, MESE,
				GIORNO, "F", CITTA, CF);
	}

	@Test(expected = ClientMessageException.class)
	public void testParseCodiceFiscaleFailCitta() {
		CodiceFiscaleControllo.parseCodiceFiscale(COGNOME, NOME, ANNO, MESE,
				GIORNO, "M", "", CF);
	}


}
