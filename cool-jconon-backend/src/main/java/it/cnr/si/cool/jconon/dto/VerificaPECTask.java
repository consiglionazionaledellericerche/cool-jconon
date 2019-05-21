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