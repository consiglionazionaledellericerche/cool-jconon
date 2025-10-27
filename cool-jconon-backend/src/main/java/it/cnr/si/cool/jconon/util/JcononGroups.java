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

package it.cnr.si.cool.jconon.util;

public enum JcononGroups {
    CONCORSI("CONCORSI"),
    GESTORI_TDET_PNRR("GESTORI_TDET_PNRR"),
    GESTORI_BORSE_DI_STUDIO("GESTORI_BORSE_DI_STUDIO"),
    COMMISSIONI_CONCORSO("COMMISSIONI CONCORSO"),
    RDP_CONCORSO("RESPONSABILI BANDI"),
    GESTORI_BANDI("GESTORI BANDI"),
    CONTRIBUTOR_CALL("CONTRIBUTOR CALL"),
    ALBO_COMMISSIONI("ALBO_COMMISSIONI"),
    APPLICATION_CONSUMER("APPLICATION CONSUMER"),
    EVERYONE("EVERYONE"),
    ALFRESCO_ADMINISTRATORS("ALFRESCO ADMINISTRATORS");

    private final String label;

    JcononGroups(String v) {
        label = v;
    }

    public String label() {
        return label;
    }

    public String group() {
        return "GROUP_".concat(name());
    }
}
