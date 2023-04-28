
package it.cnr.si.cool.jconon.pagopa.model;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "versioneOggetto",
    "identificativoMessaggioRichiesta",
    "dataOraMessaggioRichiesta",
    "autenticazioneSoggetto"
})
@Generated("jsonschema2pojo")
public class Rpt  implements Serializable {

    @JsonProperty("versioneOggetto")
    private String versioneOggetto;
    @JsonProperty("identificativoMessaggioRichiesta")
    private String identificativoMessaggioRichiesta;
    @JsonProperty("dataOraMessaggioRichiesta")
    private String dataOraMessaggioRichiesta;
    @JsonProperty("autenticazioneSoggetto")
    private String autenticazioneSoggetto;

    public DatiVersamento getDatiVersamento() {
        return datiVersamento;
    }

    public void setDatiVersamento(DatiVersamento datiVersamento) {
        this.datiVersamento = datiVersamento;
    }

    @JsonProperty("ccp")
    private String ccp;
    @JsonProperty("datiVersamento")
    private DatiVersamento datiVersamento;
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

    @JsonProperty("identificativoMessaggioRichiesta")
    public String getIdentificativoMessaggioRichiesta() {
        return identificativoMessaggioRichiesta;
    }

    @JsonProperty("identificativoMessaggioRichiesta")
    public void setIdentificativoMessaggioRichiesta(String identificativoMessaggioRichiesta) {
        this.identificativoMessaggioRichiesta = identificativoMessaggioRichiesta;
    }

    @JsonProperty("dataOraMessaggioRichiesta")
    public String getDataOraMessaggioRichiesta() {
        return dataOraMessaggioRichiesta;
    }

    @JsonProperty("dataOraMessaggioRichiesta")
    public void setDataOraMessaggioRichiesta(String dataOraMessaggioRichiesta) {
        this.dataOraMessaggioRichiesta = dataOraMessaggioRichiesta;
    }

    @JsonProperty("autenticazioneSoggetto")
    public String getAutenticazioneSoggetto() {
        return autenticazioneSoggetto;
    }

    @JsonProperty("autenticazioneSoggetto")
    public void setAutenticazioneSoggetto(String autenticazioneSoggetto) {
        this.autenticazioneSoggetto = autenticazioneSoggetto;
    }

    @JsonProperty("ccp")
    public String getCcp() {
        return ccp;
    }

    @JsonProperty("ccp")
    public void setCcp(String ccp) {
        this.ccp = ccp;
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
