
package it.cnr.si.cool.jconon.pagopa.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.io.Serializable;
import java.math.BigDecimal;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "codEntrata",
    "ibanAccredito",
    "ibanAppoggio",
    "tipoContabilita",
    "codiceContabilita",
    "tipoBollo",
    "hashDocumento",
    "provinciaResidenza"
})
public class Voci implements Serializable {

    @JsonProperty("codEntrata")
    private String codEntrata;

    @JsonProperty("idVocePendenza")
    private String idVocePendenza;
    @JsonProperty("importo")
    private BigDecimal importo;
    @JsonProperty("descrizione")
    private String descrizione;
    @JsonProperty("tipoBollo")
    private String tipoBollo;
    @JsonProperty("hashDocumento")
    private String hashDocumento;

    public String getCodiceContabilita() {
        return codiceContabilita;
    }

    public void setCodiceContabilita(String codiceContabilita) {
        this.codiceContabilita = codiceContabilita;
    }

    @JsonProperty("provinciaResidenza")
    private String provinciaResidenza;
    @JsonProperty("codiceContabilita")
    private String codiceContabilita;

    public String getIbanAccredito() {
        return ibanAccredito;
    }

    public void setIbanAccredito(String ibanAccredito) {
        this.ibanAccredito = ibanAccredito;
    }

    public String getIbanAppoggio() {
        return ibanAppoggio;
    }

    public void setIbanAppoggio(String ibanAppoggio) {
        this.ibanAppoggio = ibanAppoggio;
    }

    public String getTipoContabilita() {
        return tipoContabilita;
    }

    public void setTipoContabilita(String tipoContabilita) {
        this.tipoContabilita = tipoContabilita;
    }

    @JsonProperty("codEntrata")
    public String getCodEntrata() {
        return codEntrata;
    }
    private String ibanAccredito;
    private String ibanAppoggio;
    private String tipoContabilita = "SIOPE";

    @JsonProperty("codEntrata")
    public void setCodEntrata(String codEntrata) {
        this.codEntrata = codEntrata;
    }

    @JsonProperty("tipoBollo")
    public String getTipoBollo() {
        return tipoBollo;
    }

    @JsonProperty("tipoBollo")
    public void setTipoBollo(String tipoBollo) {
        this.tipoBollo = tipoBollo;
    }

    @JsonProperty("hashDocumento")
    public String getHashDocumento() {
        return hashDocumento;
    }

    @JsonProperty("hashDocumento")
    public void setHashDocumento(String hashDocumento) {
        this.hashDocumento = hashDocumento;
    }

    @JsonProperty("provinciaResidenza")
    public String getProvinciaResidenza() {
        return provinciaResidenza;
    }

    @JsonProperty("provinciaResidenza")
    public void setProvinciaResidenza(String provinciaResidenza) {
        this.provinciaResidenza = provinciaResidenza;
    }

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
}
