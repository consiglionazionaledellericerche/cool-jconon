
package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "tipoIdentificativoUnivoco",
    "codiceIdentificativoUnivoco"
})
@Generated("jsonschema2pojo")
public class IdentificativoUnivocoPagatore__1  implements Serializable {

    @JsonProperty("tipoIdentificativoUnivoco")
    private String tipoIdentificativoUnivoco;
    @JsonProperty("codiceIdentificativoUnivoco")
    private String codiceIdentificativoUnivoco;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("tipoIdentificativoUnivoco")
    public String getTipoIdentificativoUnivoco() {
        return tipoIdentificativoUnivoco;
    }

    @JsonProperty("tipoIdentificativoUnivoco")
    public void setTipoIdentificativoUnivoco(String tipoIdentificativoUnivoco) {
        this.tipoIdentificativoUnivoco = tipoIdentificativoUnivoco;
    }

    @JsonProperty("codiceIdentificativoUnivoco")
    public String getCodiceIdentificativoUnivoco() {
        return codiceIdentificativoUnivoco;
    }

    @JsonProperty("codiceIdentificativoUnivoco")
    public void setCodiceIdentificativoUnivoco(String codiceIdentificativoUnivoco) {
        this.codiceIdentificativoUnivoco = codiceIdentificativoUnivoco;
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
