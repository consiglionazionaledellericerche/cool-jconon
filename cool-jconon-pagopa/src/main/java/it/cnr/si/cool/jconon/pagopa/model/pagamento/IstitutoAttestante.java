
package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "identificativoUnivocoAttestante",
    "denominazioneAttestante",
    "codiceUnitOperAttestante",
    "denomUnitOperAttestante",
    "indirizzoAttestante",
    "civicoAttestante",
    "capAttestante",
    "localitaAttestante",
    "provinciaAttestante",
    "nazioneAttestante"
})
@Generated("jsonschema2pojo")
public class IstitutoAttestante  implements Serializable {

    @JsonProperty("identificativoUnivocoAttestante")
    private IdentificativoUnivocoAttestante identificativoUnivocoAttestante;
    @JsonProperty("denominazioneAttestante")
    private String denominazioneAttestante;
    @JsonProperty("codiceUnitOperAttestante")
    private Object codiceUnitOperAttestante;
    @JsonProperty("denomUnitOperAttestante")
    private Object denomUnitOperAttestante;
    @JsonProperty("indirizzoAttestante")
    private Object indirizzoAttestante;
    @JsonProperty("civicoAttestante")
    private Object civicoAttestante;
    @JsonProperty("capAttestante")
    private Object capAttestante;
    @JsonProperty("localitaAttestante")
    private Object localitaAttestante;
    @JsonProperty("provinciaAttestante")
    private Object provinciaAttestante;
    @JsonProperty("nazioneAttestante")
    private Object nazioneAttestante;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("identificativoUnivocoAttestante")
    public IdentificativoUnivocoAttestante getIdentificativoUnivocoAttestante() {
        return identificativoUnivocoAttestante;
    }

    @JsonProperty("identificativoUnivocoAttestante")
    public void setIdentificativoUnivocoAttestante(IdentificativoUnivocoAttestante identificativoUnivocoAttestante) {
        this.identificativoUnivocoAttestante = identificativoUnivocoAttestante;
    }

    @JsonProperty("denominazioneAttestante")
    public String getDenominazioneAttestante() {
        return denominazioneAttestante;
    }

    @JsonProperty("denominazioneAttestante")
    public void setDenominazioneAttestante(String denominazioneAttestante) {
        this.denominazioneAttestante = denominazioneAttestante;
    }

    @JsonProperty("codiceUnitOperAttestante")
    public Object getCodiceUnitOperAttestante() {
        return codiceUnitOperAttestante;
    }

    @JsonProperty("codiceUnitOperAttestante")
    public void setCodiceUnitOperAttestante(Object codiceUnitOperAttestante) {
        this.codiceUnitOperAttestante = codiceUnitOperAttestante;
    }

    @JsonProperty("denomUnitOperAttestante")
    public Object getDenomUnitOperAttestante() {
        return denomUnitOperAttestante;
    }

    @JsonProperty("denomUnitOperAttestante")
    public void setDenomUnitOperAttestante(Object denomUnitOperAttestante) {
        this.denomUnitOperAttestante = denomUnitOperAttestante;
    }

    @JsonProperty("indirizzoAttestante")
    public Object getIndirizzoAttestante() {
        return indirizzoAttestante;
    }

    @JsonProperty("indirizzoAttestante")
    public void setIndirizzoAttestante(Object indirizzoAttestante) {
        this.indirizzoAttestante = indirizzoAttestante;
    }

    @JsonProperty("civicoAttestante")
    public Object getCivicoAttestante() {
        return civicoAttestante;
    }

    @JsonProperty("civicoAttestante")
    public void setCivicoAttestante(Object civicoAttestante) {
        this.civicoAttestante = civicoAttestante;
    }

    @JsonProperty("capAttestante")
    public Object getCapAttestante() {
        return capAttestante;
    }

    @JsonProperty("capAttestante")
    public void setCapAttestante(Object capAttestante) {
        this.capAttestante = capAttestante;
    }

    @JsonProperty("localitaAttestante")
    public Object getLocalitaAttestante() {
        return localitaAttestante;
    }

    @JsonProperty("localitaAttestante")
    public void setLocalitaAttestante(Object localitaAttestante) {
        this.localitaAttestante = localitaAttestante;
    }

    @JsonProperty("provinciaAttestante")
    public Object getProvinciaAttestante() {
        return provinciaAttestante;
    }

    @JsonProperty("provinciaAttestante")
    public void setProvinciaAttestante(Object provinciaAttestante) {
        this.provinciaAttestante = provinciaAttestante;
    }

    @JsonProperty("nazioneAttestante")
    public Object getNazioneAttestante() {
        return nazioneAttestante;
    }

    @JsonProperty("nazioneAttestante")
    public void setNazioneAttestante(Object nazioneAttestante) {
        this.nazioneAttestante = nazioneAttestante;
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
