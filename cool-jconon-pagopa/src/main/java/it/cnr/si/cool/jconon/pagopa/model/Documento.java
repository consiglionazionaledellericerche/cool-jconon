
package it.cnr.si.cool.jconon.pagopa.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "identificativo",
    "descrizione"
})
public class Documento implements Serializable {

    @JsonProperty("identificativo")
    private String identificativo;
    @JsonProperty("descrizione")
    private String descrizione;
    @JsonProperty("identificativo")
    public String getIdentificativo() {
        return identificativo;
    }

    @JsonProperty("identificativo")
    public void setIdentificativo(String identificativo) {
        this.identificativo = identificativo;
    }

    @JsonProperty("descrizione")
    public String getDescrizione() {
        return descrizione;
    }

    @JsonProperty("descrizione")
    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

}
