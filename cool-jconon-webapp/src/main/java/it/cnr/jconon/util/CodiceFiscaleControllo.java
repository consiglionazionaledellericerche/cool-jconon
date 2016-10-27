package it.cnr.jconon.util;

import it.cnr.cool.web.scripts.exception.CMISApplicationException;
import it.cnr.cool.web.scripts.exception.ClientMessageException;

import java.util.Hashtable;
import java.util.Map;

/**
 * Classe per il controllo dell'esattezza del codice Fiscale Gestisce il
 * controllo e il calcolo del codice fiscale sulla base di dizionari statici
 * interni
 */

public final class CodiceFiscaleControllo {

	private final static String[] VOCALI = { "A", "E", "I", "U", "O" };

	private final static String[] CONSONANTI = { "B", "C", "D", "F", "G", "H",
			"J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X",
			"Y", "Z" };

	private final static String[] NUMERI = { "0", "1", "2", "3", "4", "5", "6",
			"7", "8", "9" };

	private final static String[] ALFANUM = { "A", "B", "C", "D", "E", "F",
			"G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
			"T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5",
			"6", "7", "8", "9" };

	private final static String[] CODIFICA_MESI = { "A", "B", "C", "D", "E",
			"H", "L", "M", "P", "R", "S", "T" };

	private final static String[] MAP_CC = { "A", "B", "C", "D", "E", "F", "G",
			"H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
			"U", "V", "W", "X", "Y", "Z" };

	private final static Map<String, String> MAP_VOCALI_ACCENTATE;
	private final static Map<String, Integer> MAP_CC_DISPARI, MAP_CC_PARI;

	private CodiceFiscaleControllo() {
	}

	static {
		MAP_VOCALI_ACCENTATE = new Hashtable<String, String>();
		MAP_VOCALI_ACCENTATE.put("\u00E0".toUpperCase(), "A");
		MAP_VOCALI_ACCENTATE.put("\u00E0".toUpperCase(), "A");
		MAP_VOCALI_ACCENTATE.put("\u00E8".toUpperCase(), "E");
		MAP_VOCALI_ACCENTATE.put("\u00E8".toUpperCase(), "E");
		MAP_VOCALI_ACCENTATE.put("\u00F2".toUpperCase(), "O");
		MAP_VOCALI_ACCENTATE.put("\u00F2".toUpperCase(), "O");
		MAP_VOCALI_ACCENTATE.put("\u00F9".toUpperCase(), "U");
		MAP_VOCALI_ACCENTATE.put("\u00F9".toUpperCase(), "U");
		MAP_VOCALI_ACCENTATE.put("\u00EC".toUpperCase(), "I");
		MAP_VOCALI_ACCENTATE.put("\u00EC".toUpperCase(), "I");

		MAP_CC_DISPARI = new Hashtable<String, Integer>();
		MAP_CC_DISPARI.put("A", Integer.valueOf(1));
		MAP_CC_DISPARI.put("0", Integer.valueOf(1));
		MAP_CC_DISPARI.put("B", Integer.valueOf(0));
		MAP_CC_DISPARI.put("1", Integer.valueOf(0));
		MAP_CC_DISPARI.put("C", Integer.valueOf(5));
		MAP_CC_DISPARI.put("2", Integer.valueOf(5));
		MAP_CC_DISPARI.put("D", Integer.valueOf(7));
		MAP_CC_DISPARI.put("3", Integer.valueOf(7));
		MAP_CC_DISPARI.put("E", Integer.valueOf(9));
		MAP_CC_DISPARI.put("4", Integer.valueOf(9));
		MAP_CC_DISPARI.put("F", Integer.valueOf(13));
		MAP_CC_DISPARI.put("5", Integer.valueOf(13));
		MAP_CC_DISPARI.put("G", Integer.valueOf(15));
		MAP_CC_DISPARI.put("6", Integer.valueOf(15));
		MAP_CC_DISPARI.put("H", Integer.valueOf(17));
		MAP_CC_DISPARI.put("7", Integer.valueOf(17));
		MAP_CC_DISPARI.put("I", Integer.valueOf(19));
		MAP_CC_DISPARI.put("8", Integer.valueOf(19));
		MAP_CC_DISPARI.put("J", Integer.valueOf(21));
		MAP_CC_DISPARI.put("9", Integer.valueOf(21));
		MAP_CC_DISPARI.put("K", Integer.valueOf(2));
		MAP_CC_DISPARI.put("L", Integer.valueOf(4));
		MAP_CC_DISPARI.put("M", Integer.valueOf(18));
		MAP_CC_DISPARI.put("N", Integer.valueOf(20));
		MAP_CC_DISPARI.put("O", Integer.valueOf(11));
		MAP_CC_DISPARI.put("P", Integer.valueOf(3));
		MAP_CC_DISPARI.put("Q", Integer.valueOf(6));
		MAP_CC_DISPARI.put("R", Integer.valueOf(8));
		MAP_CC_DISPARI.put("S", Integer.valueOf(12));
		MAP_CC_DISPARI.put("T", Integer.valueOf(14));
		MAP_CC_DISPARI.put("U", Integer.valueOf(16));
		MAP_CC_DISPARI.put("V", Integer.valueOf(10));
		MAP_CC_DISPARI.put("W", Integer.valueOf(22));
		MAP_CC_DISPARI.put("X", Integer.valueOf(25));
		MAP_CC_DISPARI.put("Y", Integer.valueOf(24));
		MAP_CC_DISPARI.put("Z", Integer.valueOf(23));

		MAP_CC_PARI = new Hashtable<String, Integer>();
		MAP_CC_PARI.put("A", Integer.valueOf(0));
		MAP_CC_PARI.put("0", Integer.valueOf(0));
		MAP_CC_PARI.put("B", Integer.valueOf(1));
		MAP_CC_PARI.put("1", Integer.valueOf(1));
		MAP_CC_PARI.put("C", Integer.valueOf(2));
		MAP_CC_PARI.put("2", Integer.valueOf(2));
		MAP_CC_PARI.put("D", Integer.valueOf(3));
		MAP_CC_PARI.put("3", Integer.valueOf(3));
		MAP_CC_PARI.put("E", Integer.valueOf(4));
		MAP_CC_PARI.put("4", Integer.valueOf(4));
		MAP_CC_PARI.put("F", Integer.valueOf(5));
		MAP_CC_PARI.put("5", Integer.valueOf(5));
		MAP_CC_PARI.put("G", Integer.valueOf(6));
		MAP_CC_PARI.put("6", Integer.valueOf(6));
		MAP_CC_PARI.put("H", Integer.valueOf(7));
		MAP_CC_PARI.put("7", Integer.valueOf(7));
		MAP_CC_PARI.put("I", Integer.valueOf(8));
		MAP_CC_PARI.put("8", Integer.valueOf(8));
		MAP_CC_PARI.put("J", Integer.valueOf(9));
		MAP_CC_PARI.put("9", Integer.valueOf(9));
		MAP_CC_PARI.put("K", Integer.valueOf(10));
		MAP_CC_PARI.put("L", Integer.valueOf(11));
		MAP_CC_PARI.put("M", Integer.valueOf(12));
		MAP_CC_PARI.put("N", Integer.valueOf(13));
		MAP_CC_PARI.put("O", Integer.valueOf(14));
		MAP_CC_PARI.put("P", Integer.valueOf(15));
		MAP_CC_PARI.put("Q", Integer.valueOf(16));
		MAP_CC_PARI.put("R", Integer.valueOf(17));
		MAP_CC_PARI.put("S", Integer.valueOf(18));
		MAP_CC_PARI.put("T", Integer.valueOf(19));
		MAP_CC_PARI.put("U", Integer.valueOf(20));
		MAP_CC_PARI.put("V", Integer.valueOf(21));
		MAP_CC_PARI.put("W", Integer.valueOf(22));
		MAP_CC_PARI.put("X", Integer.valueOf(23));
		MAP_CC_PARI.put("Y", Integer.valueOf(24));
		MAP_CC_PARI.put("Z", Integer.valueOf(25));
	};

	/**
	 * Calcola la parte di CF corrispondente al cognome
	 * 
	 * @param aS
	 *            cognome
	 */

	private static String calcolaCodCognome(String aS) {

		String aCodCognomeCalcolato = "";

		String aSVocali = vocali(aS);
		String aSConsonanti = consonanti(aS);

		if (aSConsonanti.length() >= 3)
			aCodCognomeCalcolato = aSConsonanti.substring(0, 3);
		else if (aS.length() >= 3)
			aCodCognomeCalcolato = aSConsonanti
					+ aSVocali.substring(0, (3 - aSConsonanti.length()));

		if (aS.length() == 2) {
			aCodCognomeCalcolato = aSConsonanti + aSVocali + "X";
		}
		if (aS.length() == 1) {
			aCodCognomeCalcolato = aSConsonanti + aSVocali + "XX";
		}

		return aCodCognomeCalcolato;
	}

	/**
	 * Calcola la parte di CF corrispondente al nome
	 * 
	 * @param aS
	 *            nome
	 */

	private static String calcolaCodNome(String aS) {

		String aCodNomeCalcolato = "";

		String aSVocali = vocali(aS);
		String aSConsonanti = consonanti(aS);

		if (aSConsonanti.length() >= 4)
			aSConsonanti = aSConsonanti.substring(0, 1)
					+ aSConsonanti.substring(2, 4);

		if (aSConsonanti.length() >= 3)
			aCodNomeCalcolato = aSConsonanti.substring(0, 3);
		else if (aS.length() >= 3)
			aCodNomeCalcolato = aSConsonanti
					+ aSVocali.substring(0, (3 - aSConsonanti.length()));

		if (aS.length() == 2) {
			aCodNomeCalcolato = aSConsonanti + aSVocali + "X";
		}
		if (aS.length() == 1) {
			aCodNomeCalcolato = aSConsonanti + aSVocali + "XX";
		}
		return aCodNomeCalcolato;
	}

	/**
	 * Controllo correttezza del carattere di controllo terminale del CF
	 * 
	 * @param codice
	 *            CF completo da verificare
	 */

	private static boolean checkCC(String codice) {
		// Il codice passato per il controllo ha lunghezza n-1 dove n � la
		// lunghezza del codice fiscale
		return getCC(codice.substring(0, codice.length() - 1)).equals(
				codice.substring(15, 16));
	}

	/**
	 * Ritorna una stringa composta dalle consonanti di aS
	 * 
	 * @param aS
	 *            Stringa da cui estrarre le consonanti
	 */

	private static String consonanti(String aS) {

		String aOut = "";
		for (int iC = 0; iC < aS.length(); iC++) {
			String aC = aS.substring(iC, iC + 1);
			if (isConsonante(aC))
				aOut += aC;
		}
		return aOut;
	}

	/**
	 * Ritorna una stringa composta della sola parte di caratteri alfanumerici
	 * uppercase di aS
	 * 
	 * @param aS
	 *            Stringa su cui si opera
	 */

	private static String getAlfanumUppercase(String aS) {

		if (aS == null)
			return aS;
		String aLocS = aS.toUpperCase();
		String aOutS = "";
		for (int i = 0; i < aLocS.length(); i++) {
			String aC = aLocS.substring(i, i + 1);
			if (isAlfanum(aC))
				aOutS += aLocS.substring(i, i + 1);
			if (isVocaleAccentata(aC))
				aOutS += MAP_VOCALI_ACCENTATE.get(aC);
		}

		return aOutS;

	}

	/**
	 * Ritorna il carattere di controllo del (CC) CF
	 * 
	 * @param codice
	 *            Il CF tranne l'ultimo carattere su cui viene calcolato il CC
	 */

	private static String getCC(String codice) {

		int aTotDispari = 0;
		int aTotPari = 0;

		// ATTENZIONE!!! La posizione 0 rappresenta la prima posizione dispari!
		for (int i = 0; i < codice.length(); i += 2)
			// parse dispari
			aTotDispari += MAP_CC_DISPARI.get(codice.substring(i,
					i + 1)).intValue();

		for (int i = 1; i < codice.length(); i += 2)
			// parse pari
			aTotPari += MAP_CC_PARI.get(codice.substring(i, i + 1))
					.intValue();

		int aTotResto = (aTotPari + aTotDispari) % 26;

		return MAP_CC[aTotResto];
	}

	private static String getNumber(String aS) {

		String aLocS = aS.toUpperCase();
		String aOutS = "";
		for (int i = 0; i < aLocS.length(); i++) {
			String aC = aLocS.substring(i, i + 1);
			if (isNumero(aC))
				aOutS += aC;
		}
		if (aOutS.length() == 1)
			aOutS = "0" + aOutS;
		return aOutS;

	}

	private static boolean isAlfanum(String aC) {

		for (int i = 0; i < ALFANUM.length; i++)
			if (ALFANUM[i].equals(aC))
				return true;

		return false;

	}

	private static boolean isConsonante(String aC) {

		for (int i = 0; i < CONSONANTI.length; i++)
			if (CONSONANTI[i].equals(aC))
				return true;

		return false;

	}

	private static boolean isNumero(String aC) {

		for (int i = 0; i < NUMERI.length; i++)
			if (NUMERI[i].equals(aC))
				return true;

		return false;

	}

	private static boolean isVocale(String aC) {

		for (int i = 0; i < VOCALI.length; i++)
			if (VOCALI[i].equals(aC))
				return true;

		return false;

	}

	private static boolean isVocaleAccentata(String aC) {
		return MAP_VOCALI_ACCENTATE.containsKey(aC);
	}

	/**
	 * Controlla il codice fiscale sulla base degli altri parametri passati
	 * 
	 * Le stringhe in ingresso sono filtrate sulla base dei dizionari statici
	 * impostati nella classe.
	 * 
	 * In particolare vengono soppressi caratteri non alfanumerici base e si
	 * lavora su Uppercase Solo le vocali accentate vengono gestite in
	 * automatico come vocali: in particolare nel calcolo del CF vengono
	 * sostitutite con le rispettive lettere maiuscole non accentate.
	 * 
	 * @param aCognome
	 *            cognome
	 * @param aNome
	 *            nome
	 * @param aAnnoNascita
	 *            anno di nascita (ultimi due caratteri dell'anno)
	 * @param aMeseNascita
	 *            mese di nascita (range: 1-12)
	 * @param aGiornoNascita
	 *            giorno di nascita (caratteri range: 1-31)
	 * @param aSesso
	 *            sesso ("M"=Maschile "F"=Femminile)
	 * @param aCdComuneNascita
	 *            codice qualificatore del Comune di Nascita o Stato Estero
	 * @param aCdFiscale
	 *            CF da controllare
	 */
	public static void parseCodiceFiscale(String aCognome, String aNome,
			String aAnnoNascita, String aMeseNascita, String aGiornoNascita,
			String aSesso, String aCdComuneNascita, String aCdFiscale)
			throws CMISApplicationException {

		String cognome = getAlfanumUppercase(aCognome);
		String nome = getAlfanumUppercase(aNome);
		String annoNascita = getNumber(aAnnoNascita);
		String meseNascita = getNumber(aMeseNascita);
		String giornoNascita = getNumber(aGiornoNascita);
		String sesso = getAlfanumUppercase(aSesso);
		String cdComuneNascita = getAlfanumUppercase(aCdComuneNascita);

		String codice = getAlfanumUppercase(aCdFiscale);

		if (codice == null)
			throw new ClientMessageException("message.error.codice.fiscale.nullo");

		if (codice.length() != 16)
			throw new ClientMessageException("message.error.codice.fiscale.lung.errata");

		String aCodCognome = codice.substring(0, 3);
		String aCodNome = codice.substring(3, 6);
		String aCodAnnoNascita = codice.substring(6, 8);
		String aCodMeseNascita = codice.substring(8, 9);
		String aCodGiornoNascita = codice.substring(9, 11);
		String aCodComuneNascita = codice.substring(11, 15);
		// String aCodControllo = codice.substring(15,16);

		// Controllo Cognome

		String aCodCognomeCalcolato = calcolaCodCognome(cognome);
		if (!aCodCognome.equals(aCodCognomeCalcolato))
			throw new ClientMessageException("message.error.codice.fiscale.cognome");

		// Controllo nome

		String aCodNomeCalcolato = calcolaCodNome(nome);
		if (!aCodNome.equals(aCodNomeCalcolato))
			throw new ClientMessageException("message.error.codice.fiscale.nome");

		// Controllo anno di nascita

		if (!annoNascita.equals(aCodAnnoNascita))
			throw new ClientMessageException("message.error.codice.fiscale.anno");

		// Controllo mese di nascita

		if (!CODIFICA_MESI[Integer.valueOf(meseNascita).intValue()]
				.equals(aCodMeseNascita.substring(0, 1)))
			throw new ClientMessageException("message.error.codice.fiscale.mese");

		// Controllo giorno di nascita-sesso
		// Err. 783 - BORRIELLO: gestita l'eccezione NumberFormatException, che
		// viene generata nel caso in cui nel giorno sia presente una lettera al
		// posto di un numero.
		try {
			if (sesso.equals("M")) { // x i maschi
				if (!Integer.valueOf(giornoNascita).equals(Integer.valueOf(
						aCodGiornoNascita)))
					throw new ClientMessageException("message.error.codice.fiscale.giorno.sesso");
			} else { // x le femmine
				if (!Integer.valueOf(Integer.valueOf(giornoNascita).intValue() + 40)
						.equals(Integer.valueOf(aCodGiornoNascita)))
					throw new ClientMessageException("message.error.codice.fiscale.giorno.sesso");
			}
		} catch (NumberFormatException nfe) {
			throw new ClientMessageException("message.error.codice.fiscale.giorno.sesso");
		}

		// Controllo comune di nascita: attualmente non effettuato
		if (aCdComuneNascita != null
				&& !cdComuneNascita.equals(aCodComuneNascita))
			throw new ClientMessageException("message.error.codice.fiscale.comune");

		if (!checkCC(codice))
			throw new ClientMessageException("message.error.codice.fiscale.carattere");
	}

	/**
	 * Ritorna una stringa composta dalle vocali di aS
	 * 
	 * @param aS
	 *            Stringa da cui estrarre le vocali
	 */

	private static String vocali(String aS) {

		String aOut = "";
		for (int iC = 0; iC < aS.length(); iC++) {
			String aC = aS.substring(iC, iC + 1);
			if (isVocale(aC))
				aOut += aC;
		}
		return aOut;
	}
}
