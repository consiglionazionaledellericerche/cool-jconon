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

package it.cnr.si.cool.jconon.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

public class VerificaPECTask implements Serializable{
    private final String userName, password, oggetto, propertyName;
    private final Date sendDate;

    public VerificaPECTask(String userName, String password,
                           String oggetto, String propertyName, Date sendDate) {
        super();
        this.userName = userName;
        this.password = password;
        this.oggetto = oggetto;
        this.propertyName = propertyName;
        this.sendDate = sendDate;
    }

    public String getUserName() {
        return userName;
    }

    public String getPassword() {
        return password;
    }

    public String getOggetto() {
        return oggetto;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public Date getSendDate() {
        return sendDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VerificaPECTask that = (VerificaPECTask) o;
        return Objects.equals(userName, that.userName) &&
                Objects.equals(password, that.password) &&
                Objects.equals(oggetto, that.oggetto) &&
                Objects.equals(propertyName, that.propertyName) &&
                Objects.equals(sendDate, that.sendDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userName, password, oggetto, propertyName, sendDate);
    }
}