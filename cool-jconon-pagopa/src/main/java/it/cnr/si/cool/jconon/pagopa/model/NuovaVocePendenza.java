package it.cnr.si.cool.jconon.pagopa.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class NuovaVocePendenza {
    @JsonProperty("idVocePendenza")
    private String idVocePendenza;
    @JsonProperty("importo")
    private BigDecimal importo;
    @JsonProperty("descrizione")
    private String descrizione;
    @JsonProperty("Entrata")
    private Entrata entrata;

    public String getIdVocePendenza() {
        return idVocePendenza;
    }

    public void setIdVocePendenza(String idVocePendenza) {
        this.idVocePendenza = idVocePendenza;
    }

    public BigDecimal getImporto() {
        return importo;
    }

    public void setImporto(BigDecimal importo) {
        this.importo = importo;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public Entrata getEntrata() {
        return entrata;
    }

    public void setEntrata(Entrata entrata) {
        this.entrata = entrata;
    }
}
