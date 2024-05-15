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

package it.cnr.si.cool.jconon.cmis.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public enum JCONONFolderType {

	JCONON_COMPETITION("F:jconon_competition:folder", "jconon_competition:folder"),
	JCONON_CALL("F:jconon_call:folder", "jconon_call:folder"),
	JCONON_CALL_TDET("F:jconon_call_tdet:folder", "jconon_call_tdet:folder"),
    JCONON_CALL_TDET_PNRR("F:jconon_call_tdet_pnrr:folder", "jconon_call_tdet_pnrr:folder"),
    JCONON_CALL_TIND("F:jconon_call_tind:folder", "jconon_call_tind:folder"),
	JCONON_CALL_BSTD("F:jconon_call_bstd:folder", "jconon_call_bstd:folder"),
	JCONON_CALL_ARIC("F:jconon_call_aric:folder", "jconon_call_aric:folder"),
	JCONON_CALL_MOBILITY("F:jconon_call_mobility:folder", "jconon_call_mobility:folder"),
	JCONON_CALL_MOBILITY_OPEN("F:jconon_call_mobility_open:folder", "jconon_call_mobility_open:folder"),
    JCONON_CALL_MAN_INTESESSE("F:jconon_call_tind:manifestazione_interesse", "jconon_call_tind:manifestazione_interesse"),
    JCONON_CALL_COMANDO_DISTACCO("F:jconon_call_comandi_distacchi:folder", "jconon_call_comandi_distacchi:folder"),
	JCONON_CALL_DIRECTOR("F:jconon_call_director:folder", "jconon_call_director:folder"),
	JCONON_CALL_EMPLOYEES("F:jconon_call_employees:folder", "jconon_call_employees:folder"),
	JCONON_APPLICATION("F:jconon_application:folder", "jconon_application:folder");
	
    private final String value;
    private final String queryName;
    private static final Logger LOGGER = LoggerFactory.getLogger(JCONONFolderType.class);

    JCONONFolderType(String v, String queryName) {
        value = v;
        this.queryName = queryName;
    }

    public String value() {
        return value;
    }

    public String queryName() {
        return queryName;
    }

    public static JCONONFolderType fromValue(String v) {
        for (JCONONFolderType c : JCONONFolderType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

    public static boolean isMobilityCall(String id){
    	try {
        	JCONONFolderType folderType = fromValue(id);
            return folderType.equals(JCONONFolderType.JCONON_CALL_MOBILITY) || folderType.equals(JCONONFolderType.JCONON_CALL_MOBILITY_OPEN);
        } catch (IllegalArgumentException _ex) {
    	    LOGGER.warn("Cannot execute isMobilityCall for {}", id);
    		return false;
    	}
    }
}
