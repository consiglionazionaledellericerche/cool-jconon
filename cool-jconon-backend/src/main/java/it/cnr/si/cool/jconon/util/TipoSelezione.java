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


public enum TipoSelezione {
	COLLOQUIO(" il colloquio", "il colloquio previsto"), 
	PROVASCRITTA(" la prova scritta", "la prova scritta prevista"), 
	PRIMAPROVASCRITTA(" la prima prova scritta", "la prima prova scritta prevista"),
	SECONDAPROVASCRITTA(" la seconda prova scritta", "la seconda prova scritta prevista"), 
	ORALE(" l'orale", "l'orale previsto"),
	NESSUNA(null, null);
	
    private final String value;
    private final String label;

    TipoSelezione(String v, String label) {
        this.value = v;
        this.label = label;
    }

    public String value() {
        return value;
    }

    public String label() {
        return label;
    }

    public static TipoSelezione fromValue(String v) {
        for (TipoSelezione c : TipoSelezione.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }	
}
