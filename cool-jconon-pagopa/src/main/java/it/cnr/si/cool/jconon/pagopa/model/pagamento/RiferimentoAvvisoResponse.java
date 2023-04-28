package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import javax.annotation.Generated;
import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "id",
    "location",
    "redirect",
    "idSession"
})
@Generated("jsonschema2pojo")
public class RiferimentoAvvisoResponse implements Serializable {

    @JsonProperty("id")
    private String id;
    @JsonProperty("location")
    private String location;
    @JsonProperty("redirect")
    private String redirect;
    @JsonProperty("idSession")
    private String idSession;
    @JsonProperty("pspRedirectUrl")
    private String pspRedirectUrl;
    @JsonProperty("stato")
    private String stato;


    @JsonProperty("id")
    public String getId() {
        return id;
    }

    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    @JsonProperty("location")
    public String getLocation() {
        return location;
    }

    @JsonProperty("location")
    public void setLocation(String location) {
        this.location = location;
    }

    @JsonProperty("redirect")
    public String getRedirect() {
        return redirect;
    }

    @JsonProperty("redirect")
    public void setRedirect(String redirect) {
        this.redirect = redirect;
    }

    @JsonProperty("idSession")
    public String getIdSession() {
        return idSession;
    }

    @JsonProperty("idSession")
    public void setIdSession(String idSession) {
        this.idSession = idSession;
    }

    public String getPspRedirectUrl() {
        return pspRedirectUrl;
    }

    public void setPspRedirectUrl(String pspRedirectUrl) {
        this.pspRedirectUrl = pspRedirectUrl;
    }

    public String getStato() {
        return stato;
    }

    public void setStato(String stato) {
        this.stato = stato;
    }
}
