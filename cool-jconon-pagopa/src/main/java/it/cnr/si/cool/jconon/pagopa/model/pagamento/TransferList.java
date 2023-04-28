
package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "transfer"
})
@Generated("jsonschema2pojo")
public class TransferList implements Serializable {

    @JsonProperty("transfer")
    private List<Transfer> transfer = null;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("transfer")
    public List<Transfer> getTransfer() {
        return transfer;
    }

    @JsonProperty("transfer")
    public void setTransfer(List<Transfer> transfer) {
        this.transfer = transfer;
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