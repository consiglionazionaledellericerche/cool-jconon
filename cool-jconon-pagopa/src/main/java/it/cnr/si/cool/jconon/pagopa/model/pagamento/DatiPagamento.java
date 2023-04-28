
package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "codiceEsitoPagamento",
    "importoTotalePagato",
    "identificativoUnivocoVersamento",
    "CodiceContestoPagamento",
    "datiSingoloPagamento"
})
@Generated("jsonschema2pojo")
public class DatiPagamento implements Serializable {

    @JsonProperty("codiceEsitoPagamento")
    private String codiceEsitoPagamento;
    @JsonProperty("importoTotalePagato")
    private String importoTotalePagato;
    @JsonProperty("identificativoUnivocoVersamento")
    private String identificativoUnivocoVersamento;
    @JsonProperty("CodiceContestoPagamento")
    private String codiceContestoPagamento;
    @JsonProperty("datiSingoloPagamento")
    private List<DatiSingoloPagamento> datiSingoloPagamento = null;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("codiceEsitoPagamento")
    public String getCodiceEsitoPagamento() {
        return codiceEsitoPagamento;
    }

    @JsonProperty("codiceEsitoPagamento")
    public void setCodiceEsitoPagamento(String codiceEsitoPagamento) {
        this.codiceEsitoPagamento = codiceEsitoPagamento;
    }

    @JsonProperty("importoTotalePagato")
    public String getImportoTotalePagato() {
        return importoTotalePagato;
    }

    @JsonProperty("importoTotalePagato")
    public void setImportoTotalePagato(String importoTotalePagato) {
        this.importoTotalePagato = importoTotalePagato;
    }

    @JsonProperty("identificativoUnivocoVersamento")
    public String getIdentificativoUnivocoVersamento() {
        return identificativoUnivocoVersamento;
    }

    @JsonProperty("identificativoUnivocoVersamento")
    public void setIdentificativoUnivocoVersamento(String identificativoUnivocoVersamento) {
        this.identificativoUnivocoVersamento = identificativoUnivocoVersamento;
    }

    @JsonProperty("CodiceContestoPagamento")
    public String getCodiceContestoPagamento() {
        return codiceContestoPagamento;
    }

    @JsonProperty("CodiceContestoPagamento")
    public void setCodiceContestoPagamento(String codiceContestoPagamento) {
        this.codiceContestoPagamento = codiceContestoPagamento;
    }

    @JsonProperty("datiSingoloPagamento")
    public List<DatiSingoloPagamento> getDatiSingoloPagamento() {
        return datiSingoloPagamento;
    }

    @JsonProperty("datiSingoloPagamento")
    public void setDatiSingoloPagamento(List<DatiSingoloPagamento> datiSingoloPagamento) {
        this.datiSingoloPagamento = datiSingoloPagamento;
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
