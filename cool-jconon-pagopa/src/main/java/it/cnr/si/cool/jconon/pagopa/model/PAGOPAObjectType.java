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

package it.cnr.si.cool.jconon.pagopa.model;


public enum PAGOPAObjectType {
    JCONON_ATTACHMENT_PAGAMENTI_DIRITTI_SEGRETERIA("D:jconon_pagamenti_diritti_segreteria:attachment","jconon_pagamenti_diritti_segreteria:attachment"),

    JCONON_APPLICATION_PAGOPA("P:jconon_application:aspect_pagopa","jconon_application:aspect_pagopa");

    private final String value;
    private final String queryName;

    PAGOPAObjectType(String v, String queryName) {
        value = v;
        this.queryName = queryName;
    }

    public String value() {
        return value;
    }

    public String queryName() {
        return queryName;
    }

}
