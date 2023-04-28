
package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "identificativoUnivocoBeneficiario",
    "denominazioneBeneficiario",
    "codiceUnitOperBeneficiario",
    "denomUnitOperBeneficiario",
    "indirizzoBeneficiario",
    "civicoBeneficiario",
    "capBeneficiario",
    "localitaBeneficiario",
    "provinciaBeneficiario",
    "nazioneBeneficiario"
})
@Generated("jsonschema2pojo")
public class EnteBeneficiario__1  implements Serializable {

    @JsonProperty("identificativoUnivocoBeneficiario")
    private IdentificativoUnivocoBeneficiario__1 identificativoUnivocoBeneficiario;
    @JsonProperty("denominazioneBeneficiario")
    private String denominazioneBeneficiario;
    @JsonProperty("codiceUnitOperBeneficiario")
    private String codiceUnitOperBeneficiario;
    @JsonProperty("denomUnitOperBeneficiario")
    private String denomUnitOperBeneficiario;
    @JsonProperty("indirizzoBeneficiario")
    private Object indirizzoBeneficiario;
    @JsonProperty("civicoBeneficiario")
    private Object civicoBeneficiario;
    @JsonProperty("capBeneficiario")
    private Object capBeneficiario;
    @JsonProperty("localitaBeneficiario")
    private Object localitaBeneficiario;
    @JsonProperty("provinciaBeneficiario")
    private Object provinciaBeneficiario;
    @JsonProperty("nazioneBeneficiario")
    private Object nazioneBeneficiario;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("identificativoUnivocoBeneficiario")
    public IdentificativoUnivocoBeneficiario__1 getIdentificativoUnivocoBeneficiario() {
        return identificativoUnivocoBeneficiario;
    }

    @JsonProperty("identificativoUnivocoBeneficiario")
    public void setIdentificativoUnivocoBeneficiario(IdentificativoUnivocoBeneficiario__1 identificativoUnivocoBeneficiario) {
        this.identificativoUnivocoBeneficiario = identificativoUnivocoBeneficiario;
    }

    @JsonProperty("denominazioneBeneficiario")
    public String getDenominazioneBeneficiario() {
        return denominazioneBeneficiario;
    }

    @JsonProperty("denominazioneBeneficiario")
    public void setDenominazioneBeneficiario(String denominazioneBeneficiario) {
        this.denominazioneBeneficiario = denominazioneBeneficiario;
    }

    @JsonProperty("codiceUnitOperBeneficiario")
    public String getCodiceUnitOperBeneficiario() {
        return codiceUnitOperBeneficiario;
    }

    @JsonProperty("codiceUnitOperBeneficiario")
    public void setCodiceUnitOperBeneficiario(String codiceUnitOperBeneficiario) {
        this.codiceUnitOperBeneficiario = codiceUnitOperBeneficiario;
    }

    @JsonProperty("denomUnitOperBeneficiario")
    public String getDenomUnitOperBeneficiario() {
        return denomUnitOperBeneficiario;
    }

    @JsonProperty("denomUnitOperBeneficiario")
    public void setDenomUnitOperBeneficiario(String denomUnitOperBeneficiario) {
        this.denomUnitOperBeneficiario = denomUnitOperBeneficiario;
    }

    @JsonProperty("indirizzoBeneficiario")
    public Object getIndirizzoBeneficiario() {
        return indirizzoBeneficiario;
    }

    @JsonProperty("indirizzoBeneficiario")
    public void setIndirizzoBeneficiario(Object indirizzoBeneficiario) {
        this.indirizzoBeneficiario = indirizzoBeneficiario;
    }

    @JsonProperty("civicoBeneficiario")
    public Object getCivicoBeneficiario() {
        return civicoBeneficiario;
    }

    @JsonProperty("civicoBeneficiario")
    public void setCivicoBeneficiario(Object civicoBeneficiario) {
        this.civicoBeneficiario = civicoBeneficiario;
    }

    @JsonProperty("capBeneficiario")
    public Object getCapBeneficiario() {
        return capBeneficiario;
    }

    @JsonProperty("capBeneficiario")
    public void setCapBeneficiario(Object capBeneficiario) {
        this.capBeneficiario = capBeneficiario;
    }

    @JsonProperty("localitaBeneficiario")
    public Object getLocalitaBeneficiario() {
        return localitaBeneficiario;
    }

    @JsonProperty("localitaBeneficiario")
    public void setLocalitaBeneficiario(Object localitaBeneficiario) {
        this.localitaBeneficiario = localitaBeneficiario;
    }

    @JsonProperty("provinciaBeneficiario")
    public Object getProvinciaBeneficiario() {
        return provinciaBeneficiario;
    }

    @JsonProperty("provinciaBeneficiario")
    public void setProvinciaBeneficiario(Object provinciaBeneficiario) {
        this.provinciaBeneficiario = provinciaBeneficiario;
    }

    @JsonProperty("nazioneBeneficiario")
    public Object getNazioneBeneficiario() {
        return nazioneBeneficiario;
    }

    @JsonProperty("nazioneBeneficiario")
    public void setNazioneBeneficiario(Object nazioneBeneficiario) {
        this.nazioneBeneficiario = nazioneBeneficiario;
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
