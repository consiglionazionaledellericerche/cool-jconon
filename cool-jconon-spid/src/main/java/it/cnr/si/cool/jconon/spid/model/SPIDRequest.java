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

package it.cnr.si.cool.jconon.spid.model;

import org.joda.time.DateTime;

import java.io.Serializable;

public class SPIDRequest implements Serializable {
    private final String id;
    private final DateTime issueIstant;
    private final String issuer;

    public SPIDRequest(String id, DateTime issueIstant, String issuer) {
        this.id = id;
        this.issueIstant = issueIstant;
        this.issuer = issuer;
    }

    public String getId() {
        return id;
    }

    public DateTime getIssueIstant() {
        return issueIstant;
    }

    public String getIssuer() {
        return issuer;
    }
}
