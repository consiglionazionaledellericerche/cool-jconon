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

package it.cnr.si.cool.jconon.territori;

import java.util.ArrayList;
import java.util.List;

/** Dati territoriali normalizzati (comuni italiani con periodo di validità e stati esteri). */
public final class Territori {

    private Territori() {
    }

    /**
     * Comune italiano in un periodo di validità (l'archivio ANPR ha una riga per ogni variazione:
     * istituzione, cambio di provincia o di denominazione, soppressione).
     */
    public static class Comune {
        public String codiceIstat;
        public String codiceCatastale;
        public String nomeComune;
        public String provincia;
        /** yyyy-MM-dd */
        public String dataIstituzione;
        /** yyyy-MM-dd, null se ancora in vigore */
        public String dataCessazione;

        /** Valore salvato nelle domande: come il servizio precedente, il nome del comune. */
        public String getId() {
            return nomeComune;
        }

        public boolean isAttivo() {
            return dataCessazione == null;
        }

        /** Valido alla data indicata (yyyy-MM-dd), estremi inclusi. */
        public boolean validoAl(String data) {
            return (dataIstituzione == null || dataIstituzione.compareTo(data) <= 0)
                    && (dataCessazione == null || dataCessazione.compareTo(data) >= 0);
        }
    }

    /** Stato o territorio estero (elenco ISTAT delle unità territoriali estere). */
    public static class Stato {
        public String codiceIstat;
        /** codice catastale (Zxxx), usato anche nel codice fiscale dei nati all'estero */
        public String codiceCatastale;
        public String nome;
        public String nomeEn;
        public String iso2;
        public String iso3;
        public String continente;
        /** S = stato, T = territorio */
        public String tipo;
    }

    /** Insieme dei dati salvati, con la provenienza e la data di aggiornamento. */
    public static class Archivio {
        public List<Comune> comuni = new ArrayList<>();
        public List<Stato> stati = new ArrayList<>();
        public String fonteComuni;
        public String fonteStati;
        /** millisecondi dell'ultimo aggiornamento riuscito */
        public long aggiornatoComuni;
        public long aggiornatoStati;
    }
}
