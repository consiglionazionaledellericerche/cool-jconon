
package it.cnr.si.cool.jconon.pagopa.model;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "versioneOggetto",
    "identificativoMessaggioRicevuta",
    "dataOraMessaggioRicevuta",
    "riferimentoMessaggioRichiesta",
    "riferimentoDataRichiesta"
})
@Generated("jsonschema2pojo")
public class Rt  implements Serializable {

    @JsonProperty("versioneOggetto")
    private String versioneOggetto;
    @JsonProperty("identificativoMessaggioRicevuta")
    private String identificativoMessaggioRicevuta;
    @JsonProperty("dataOraMessaggioRicevuta")
    private String dataOraMessaggioRicevuta;
    @JsonProperty("riferimentoMessaggioRichiesta")
    private String riferimentoMessaggioRichiesta;
    @JsonProperty("riferimentoDataRichiesta")
    private String riferimentoDataRichiesta;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("versioneOggetto")
    public String getVersioneOggetto() {
        return versioneOggetto;
    }

    @JsonProperty("versioneOggetto")
    public void setVersioneOggetto(String versioneOggetto) {
        this.versioneOggetto = versioneOggetto;
    }

    @JsonProperty("identificativoMessaggioRicevuta")
    public String getIdentificativoMessaggioRicevuta() {
        return identificativoMessaggioRicevuta;
    }

    @JsonProperty("identificativoMessaggioRicevuta")
    public void setIdentificativoMessaggioRicevuta(String identificativoMessaggioRicevuta) {
        this.identificativoMessaggioRicevuta = identificativoMessaggioRicevuta;
    }

    @JsonProperty("dataOraMessaggioRicevuta")
    public String getDataOraMessaggioRicevuta() {
        return dataOraMessaggioRicevuta;
    }

    @JsonProperty("dataOraMessaggioRicevuta")
    public void setDataOraMessaggioRicevuta(String dataOraMessaggioRicevuta) {
        this.dataOraMessaggioRicevuta = dataOraMessaggioRicevuta;
    }

    @JsonProperty("riferimentoMessaggioRichiesta")
    public String getRiferimentoMessaggioRichiesta() {
        return riferimentoMessaggioRichiesta;
    }

    @JsonProperty("riferimentoMessaggioRichiesta")
    public void setRiferimentoMessaggioRichiesta(String riferimentoMessaggioRichiesta) {
        this.riferimentoMessaggioRichiesta = riferimentoMessaggioRichiesta;
    }

    @JsonProperty("riferimentoDataRichiesta")
    public String getRiferimentoDataRichiesta() {
        return riferimentoDataRichiesta;
    }

    @JsonProperty("riferimentoDataRichiesta")
    public void setRiferimentoDataRichiesta(String riferimentoDataRichiesta) {
        this.riferimentoDataRichiesta = riferimentoDataRichiesta;
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
