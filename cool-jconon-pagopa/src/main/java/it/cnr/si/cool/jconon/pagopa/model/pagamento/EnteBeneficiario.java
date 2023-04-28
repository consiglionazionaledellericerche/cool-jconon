
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
public class EnteBeneficiario  implements Serializable {

    @JsonProperty("identificativoUnivocoBeneficiario")
    private IdentificativoUnivocoBeneficiario identificativoUnivocoBeneficiario;
    @JsonProperty("denominazioneBeneficiario")
    private String denominazioneBeneficiario;
    @JsonProperty("codiceUnitOperBeneficiario")
    private String codiceUnitOperBeneficiario;
    @JsonProperty("denomUnitOperBeneficiario")
    private String denomUnitOperBeneficiario;
    @JsonProperty("indirizzoBeneficiario")
    private String indirizzoBeneficiario;
    @JsonProperty("civicoBeneficiario")
    private String civicoBeneficiario;
    @JsonProperty("capBeneficiario")
    private String capBeneficiario;
    @JsonProperty("localitaBeneficiario")
    private String localitaBeneficiario;
    @JsonProperty("provinciaBeneficiario")
    private String provinciaBeneficiario;
    @JsonProperty("nazioneBeneficiario")
    private String nazioneBeneficiario;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("identificativoUnivocoBeneficiario")
    public IdentificativoUnivocoBeneficiario getIdentificativoUnivocoBeneficiario() {
        return identificativoUnivocoBeneficiario;
    }

    @JsonProperty("identificativoUnivocoBeneficiario")
    public void setIdentificativoUnivocoBeneficiario(IdentificativoUnivocoBeneficiario identificativoUnivocoBeneficiario) {
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
    public String getIndirizzoBeneficiario() {
        return indirizzoBeneficiario;
    }

    @JsonProperty("indirizzoBeneficiario")
    public void setIndirizzoBeneficiario(String indirizzoBeneficiario) {
        this.indirizzoBeneficiario = indirizzoBeneficiario;
    }

    @JsonProperty("civicoBeneficiario")
    public String getCivicoBeneficiario() {
        return civicoBeneficiario;
    }

    @JsonProperty("civicoBeneficiario")
    public void setCivicoBeneficiario(String civicoBeneficiario) {
        this.civicoBeneficiario = civicoBeneficiario;
    }

    @JsonProperty("capBeneficiario")
    public String getCapBeneficiario() {
        return capBeneficiario;
    }

    @JsonProperty("capBeneficiario")
    public void setCapBeneficiario(String capBeneficiario) {
        this.capBeneficiario = capBeneficiario;
    }

    @JsonProperty("localitaBeneficiario")
    public String getLocalitaBeneficiario() {
        return localitaBeneficiario;
    }

    @JsonProperty("localitaBeneficiario")
    public void setLocalitaBeneficiario(String localitaBeneficiario) {
        this.localitaBeneficiario = localitaBeneficiario;
    }

    @JsonProperty("provinciaBeneficiario")
    public String getProvinciaBeneficiario() {
        return provinciaBeneficiario;
    }

    @JsonProperty("provinciaBeneficiario")
    public void setProvinciaBeneficiario(String provinciaBeneficiario) {
        this.provinciaBeneficiario = provinciaBeneficiario;
    }

    @JsonProperty("nazioneBeneficiario")
    public String getNazioneBeneficiario() {
        return nazioneBeneficiario;
    }

    @JsonProperty("nazioneBeneficiario")
    public void setNazioneBeneficiario(String nazioneBeneficiario) {
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
