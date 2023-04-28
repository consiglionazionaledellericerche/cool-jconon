
package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "idA2A",
    "idPendenza",
    "rpt",
    "rt",
    "riscossioni"
})
@Generated("jsonschema2pojo")
public class NotificaPagamento  implements Serializable {

    @JsonProperty("idA2A")
    private String idA2A;
    @JsonProperty("idPendenza")
    private String idPendenza;
    @JsonProperty("rpt")
    private Rpt rpt;
    @JsonProperty("rt")
    private Rt rt;
    @JsonProperty("riscossioni")
    private List<Riscossioni> riscossioni = null;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("idA2A")
    public String getIdA2A() {
        return idA2A;
    }

    @JsonProperty("idA2A")
    public void setIdA2A(String idA2A) {
        this.idA2A = idA2A;
    }

    @JsonProperty("idPendenza")
    public String getIdPendenza() {
        return idPendenza;
    }

    @JsonProperty("idPendenza")
    public void setIdPendenza(String idPendenza) {
        this.idPendenza = idPendenza;
    }

    @JsonProperty("rpt")
    public Rpt getRpt() {
        return rpt;
    }

    @JsonProperty("rpt")
    public void setRpt(Rpt rpt) {
        this.rpt = rpt;
    }

    @JsonProperty("rt")
    public Rt getRt() {
        return rt;
    }

    @JsonProperty("rt")
    public void setRt(Rt rt) {
        this.rt = rt;
    }

    @JsonProperty("riscossioni")
    public List<Riscossioni> getRiscossioni() {
        return riscossioni;
    }

    @JsonProperty("riscossioni")
    public void setRiscossioni(List<Riscossioni> riscossioni) {
        this.riscossioni = riscossioni;
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
