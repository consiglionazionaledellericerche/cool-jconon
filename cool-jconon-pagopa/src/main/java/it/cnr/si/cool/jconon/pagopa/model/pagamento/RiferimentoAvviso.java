package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import it.cnr.si.cool.jconon.pagopa.model.Pendenza;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "pendenze",
    "urlRitorno"
})
@Generated("jsonschema2pojo")
public class RiferimentoAvviso implements Serializable {

    @JsonProperty("pendenze")
    private List<Pendenza> pendenze;
    @JsonProperty("urlRitorno")
    private String urlRitorno;

    @JsonProperty("pendenze")
    public List<Pendenza> getPendenze() {
        return pendenze;
    }

    @JsonProperty("pendenze")
    public void setPendenze(List<Pendenza> pendenze) {
        this.pendenze = pendenze;
    }

    @JsonProperty("urlRitorno")
    public String getUrlRitorno() {
        return urlRitorno;
    }

    @JsonProperty("urlRitorno")
    public void setUrlRitorno(String urlRitorno) {
        this.urlRitorno = urlRitorno;
    }

}
