
package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "idTransfer",
        "transferAmount",
        "fiscalCodePA",
        "IBAN",
        "remittanceInformation",
        "transferCategory"
})
@Generated("jsonschema2pojo")
public class Transfer implements Serializable {

    @JsonProperty("idTransfer")
    private Integer idTransfer;
    @JsonProperty("transferAmount")
    private BigDecimal transferAmount;
    @JsonProperty("fiscalCodePA")
    private String fiscalCodePA;
    @JsonProperty("IBAN")
    private String iban;
    @JsonProperty("remittanceInformation")
    private String remittanceInformation;
    @JsonProperty("transferCategory")
    private String transferCategory;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("idTransfer")
    public Integer getIdTransfer() {
        return idTransfer;
    }

    @JsonProperty("idTransfer")
    public void setIdTransfer(Integer idTransfer) {
        this.idTransfer = idTransfer;
    }

    @JsonProperty("transferAmount")
    public BigDecimal getTransferAmount() {
        return transferAmount;
    }

    @JsonProperty("transferAmount")
    public void setTransferAmount(BigDecimal transferAmount) {
        this.transferAmount = transferAmount;
    }

    @JsonProperty("fiscalCodePA")
    public String getFiscalCodePA() {
        return fiscalCodePA;
    }

    @JsonProperty("fiscalCodePA")
    public void setFiscalCodePA(String fiscalCodePA) {
        this.fiscalCodePA = fiscalCodePA;
    }

    @JsonProperty("IBAN")
    public String getIban() {
        return iban;
    }

    @JsonProperty("IBAN")
    public void setIban(String iban) {
        this.iban = iban;
    }

    @JsonProperty("remittanceInformation")
    public String getRemittanceInformation() {
        return remittanceInformation;
    }

    @JsonProperty("remittanceInformation")
    public void setRemittanceInformation(String remittanceInformation) {
        this.remittanceInformation = remittanceInformation;
    }

    @JsonProperty("transferCategory")
    public String getTransferCategory() {
        return transferCategory;
    }

    @JsonProperty("transferCategory")
    public void setTransferCategory(String transferCategory) {
        this.transferCategory = transferCategory;
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
