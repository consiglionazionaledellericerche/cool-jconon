
package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "singoloImportoPagato",
    "esitoSingoloPagamento",
    "dataEsitoSingoloPagamento",
    "identificativoUnivocoRiscossione",
    "causaleVersamento",
    "datiSpecificiRiscossione",
    "commissioniApplicatePSP",
    "allegatoRicevuta"
})
@Generated("jsonschema2pojo")
public class DatiSingoloPagamento  implements Serializable {

    @JsonProperty("singoloImportoPagato")
    private String singoloImportoPagato;
    @JsonProperty("esitoSingoloPagamento")
    private String esitoSingoloPagamento;
    @JsonProperty("dataEsitoSingoloPagamento")
    private String dataEsitoSingoloPagamento;
    @JsonProperty("identificativoUnivocoRiscossione")
    private String identificativoUnivocoRiscossione;
    @JsonProperty("causaleVersamento")
    private String causaleVersamento;
    @JsonProperty("datiSpecificiRiscossione")
    private String datiSpecificiRiscossione;
    @JsonProperty("commissioniApplicatePSP")
    private Object commissioniApplicatePSP;
    @JsonProperty("allegatoRicevuta")
    private Object allegatoRicevuta;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("singoloImportoPagato")
    public String getSingoloImportoPagato() {
        return singoloImportoPagato;
    }

    @JsonProperty("singoloImportoPagato")
    public void setSingoloImportoPagato(String singoloImportoPagato) {
        this.singoloImportoPagato = singoloImportoPagato;
    }

    @JsonProperty("esitoSingoloPagamento")
    public String getEsitoSingoloPagamento() {
        return esitoSingoloPagamento;
    }

    @JsonProperty("esitoSingoloPagamento")
    public void setEsitoSingoloPagamento(String esitoSingoloPagamento) {
        this.esitoSingoloPagamento = esitoSingoloPagamento;
    }

    @JsonProperty("dataEsitoSingoloPagamento")
    public String getDataEsitoSingoloPagamento() {
        return dataEsitoSingoloPagamento;
    }

    @JsonProperty("dataEsitoSingoloPagamento")
    public void setDataEsitoSingoloPagamento(String dataEsitoSingoloPagamento) {
        this.dataEsitoSingoloPagamento = dataEsitoSingoloPagamento;
    }

    @JsonProperty("identificativoUnivocoRiscossione")
    public String getIdentificativoUnivocoRiscossione() {
        return identificativoUnivocoRiscossione;
    }

    @JsonProperty("identificativoUnivocoRiscossione")
    public void setIdentificativoUnivocoRiscossione(String identificativoUnivocoRiscossione) {
        this.identificativoUnivocoRiscossione = identificativoUnivocoRiscossione;
    }

    @JsonProperty("causaleVersamento")
    public String getCausaleVersamento() {
        return causaleVersamento;
    }

    @JsonProperty("causaleVersamento")
    public void setCausaleVersamento(String causaleVersamento) {
        this.causaleVersamento = causaleVersamento;
    }

    @JsonProperty("datiSpecificiRiscossione")
    public String getDatiSpecificiRiscossione() {
        return datiSpecificiRiscossione;
    }

    @JsonProperty("datiSpecificiRiscossione")
    public void setDatiSpecificiRiscossione(String datiSpecificiRiscossione) {
        this.datiSpecificiRiscossione = datiSpecificiRiscossione;
    }

    @JsonProperty("commissioniApplicatePSP")
    public Object getCommissioniApplicatePSP() {
        return commissioniApplicatePSP;
    }

    @JsonProperty("commissioniApplicatePSP")
    public void setCommissioniApplicatePSP(Object commissioniApplicatePSP) {
        this.commissioniApplicatePSP = commissioniApplicatePSP;
    }

    @JsonProperty("allegatoRicevuta")
    public Object getAllegatoRicevuta() {
        return allegatoRicevuta;
    }

    @JsonProperty("allegatoRicevuta")
    public void setAllegatoRicevuta(Object allegatoRicevuta) {
        this.allegatoRicevuta = allegatoRicevuta;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

}
