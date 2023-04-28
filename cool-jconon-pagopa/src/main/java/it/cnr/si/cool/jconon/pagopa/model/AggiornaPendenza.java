
package it.cnr.si.cool.jconon.pagopa.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "op",
    "path",
    "value"
})
public class AggiornaPendenza implements Serializable {
    @JsonProperty("idA2A")
    private String op = null;

    @JsonProperty("idPendenza")
    private String path = null;

    @JsonProperty("idTipoPendenza")
    private String value;

    public AggiornaPendenza(String op, String path, String value) {
        this.op = op;
        this.path = path;
        this.value = value;
    }

    public AggiornaPendenza() {
    }

    public String getOp() {
        return op;
    }

    public void setOp(String op) {
        this.op = op;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
