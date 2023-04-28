package it.cnr.si.cool.jconon.pagopa.model;


import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public class Dominio implements Serializable {

    @JsonProperty("idDominio")
    private String idDominio = null;

    @JsonProperty("ragioneSociale")
    private String ragioneSociale = null;

    public String getIdDominio() {
        return idDominio;
    }

    public void setIdDominio(String idDominio) {
        this.idDominio = idDominio;
    }

    public String getRagioneSociale() {
        return ragioneSociale;
    }

    public void setRagioneSociale(String ragioneSociale) {
        this.ragioneSociale = ragioneSociale;
    }
}
