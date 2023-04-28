
package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "identificativoUnivocoPagatore",
    "anagraficaPagatore",
    "indirizzoPagatore",
    "civicoPagatore",
    "capPagatore",
    "localitaPagatore",
    "provinciaPagatore",
    "nazionePagatore",
    "e-mailPagatore"
})
@Generated("jsonschema2pojo")
public class SoggettoPagatore__1  implements Serializable {

    @JsonProperty("identificativoUnivocoPagatore")
    private IdentificativoUnivocoPagatore__1 identificativoUnivocoPagatore;
    @JsonProperty("anagraficaPagatore")
    private String anagraficaPagatore;
    @JsonProperty("indirizzoPagatore")
    private String indirizzoPagatore;
    @JsonProperty("civicoPagatore")
    private Object civicoPagatore;
    @JsonProperty("capPagatore")
    private String capPagatore;
    @JsonProperty("localitaPagatore")
    private String localitaPagatore;
    @JsonProperty("provinciaPagatore")
    private String provinciaPagatore;
    @JsonProperty("nazionePagatore")
    private String nazionePagatore;
    @JsonProperty("e-mailPagatore")
    private Object eMailPagatore;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("identificativoUnivocoPagatore")
    public IdentificativoUnivocoPagatore__1 getIdentificativoUnivocoPagatore() {
        return identificativoUnivocoPagatore;
    }

    @JsonProperty("identificativoUnivocoPagatore")
    public void setIdentificativoUnivocoPagatore(IdentificativoUnivocoPagatore__1 identificativoUnivocoPagatore) {
        this.identificativoUnivocoPagatore = identificativoUnivocoPagatore;
    }

    @JsonProperty("anagraficaPagatore")
    public String getAnagraficaPagatore() {
        return anagraficaPagatore;
    }

    @JsonProperty("anagraficaPagatore")
    public void setAnagraficaPagatore(String anagraficaPagatore) {
        this.anagraficaPagatore = anagraficaPagatore;
    }

    @JsonProperty("indirizzoPagatore")
    public String getIndirizzoPagatore() {
        return indirizzoPagatore;
    }

    @JsonProperty("indirizzoPagatore")
    public void setIndirizzoPagatore(String indirizzoPagatore) {
        this.indirizzoPagatore = indirizzoPagatore;
    }

    @JsonProperty("civicoPagatore")
    public Object getCivicoPagatore() {
        return civicoPagatore;
    }

    @JsonProperty("civicoPagatore")
    public void setCivicoPagatore(Object civicoPagatore) {
        this.civicoPagatore = civicoPagatore;
    }

    @JsonProperty("capPagatore")
    public String getCapPagatore() {
        return capPagatore;
    }

    @JsonProperty("capPagatore")
    public void setCapPagatore(String capPagatore) {
        this.capPagatore = capPagatore;
    }

    @JsonProperty("localitaPagatore")
    public String getLocalitaPagatore() {
        return localitaPagatore;
    }

    @JsonProperty("localitaPagatore")
    public void setLocalitaPagatore(String localitaPagatore) {
        this.localitaPagatore = localitaPagatore;
    }

    @JsonProperty("provinciaPagatore")
    public String getProvinciaPagatore() {
        return provinciaPagatore;
    }

    @JsonProperty("provinciaPagatore")
    public void setProvinciaPagatore(String provinciaPagatore) {
        this.provinciaPagatore = provinciaPagatore;
    }

    @JsonProperty("nazionePagatore")
    public String getNazionePagatore() {
        return nazionePagatore;
    }

    @JsonProperty("nazionePagatore")
    public void setNazionePagatore(String nazionePagatore) {
        this.nazionePagatore = nazionePagatore;
    }

    @JsonProperty("e-mailPagatore")
    public Object geteMailPagatore() {
        return eMailPagatore;
    }

    @JsonProperty("e-mailPagatore")
    public void seteMailPagatore(Object eMailPagatore) {
        this.eMailPagatore = eMailPagatore;
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
