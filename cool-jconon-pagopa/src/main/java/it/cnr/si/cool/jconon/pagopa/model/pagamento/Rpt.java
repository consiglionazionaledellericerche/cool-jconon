
package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "creditorReferenceId",
        "paymentAmount",
        "dueDate",
        "retentionDate",
        "lastPayment",
        "description",
        "companyName",
        "officeName",
        "debtor",
        "transferList",
        "metadata"
})
@Generated("jsonschema2pojo")
public class Rpt  implements Serializable {

    @JsonProperty("creditorReferenceId")
    private String creditorReferenceId;
    @JsonProperty("paymentAmount")
    private String paymentAmount;
    @JsonProperty("dueDate")
    private String dueDate;
    @JsonProperty("retentionDate")
    private String retentionDate;
    @JsonProperty("lastPayment")
    private Boolean lastPayment;
    @JsonProperty("description")
    private String description;
    @JsonProperty("companyName")
    private String companyName;
    @JsonProperty("officeName")
    private String officeName;
    @JsonProperty("debtor")
    private Debtor debtor;
    @JsonProperty("transferList")
    private TransferList transferList;
    @JsonProperty("metadata")
    private String metadata;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("creditorReferenceId")
    public String getCreditorReferenceId() {
        return creditorReferenceId;
    }

    @JsonProperty("creditorReferenceId")
    public void setCreditorReferenceId(String creditorReferenceId) {
        this.creditorReferenceId = creditorReferenceId;
    }

    @JsonProperty("paymentAmount")
    public String getPaymentAmount() {
        return paymentAmount;
    }

    @JsonProperty("paymentAmount")
    public void setPaymentAmount(String paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    @JsonProperty("dueDate")
    public String getDueDate() {
        return dueDate;
    }

    @JsonProperty("dueDate")
    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    @JsonProperty("retentionDate")
    public String getRetentionDate() {
        return retentionDate;
    }

    @JsonProperty("retentionDate")
    public void setRetentionDate(String retentionDate) {
        this.retentionDate = retentionDate;
    }

    @JsonProperty("lastPayment")
    public Boolean getLastPayment() {
        return lastPayment;
    }

    @JsonProperty("lastPayment")
    public void setLastPayment(Boolean lastPayment) {
        this.lastPayment = lastPayment;
    }

    @JsonProperty("description")
    public String getDescription() {
        return description;
    }

    @JsonProperty("description")
    public void setDescription(String description) {
        this.description = description;
    }

    @JsonProperty("companyName")
    public String getCompanyName() {
        return companyName;
    }

    @JsonProperty("companyName")
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    @JsonProperty("officeName")
    public String getOfficeName() {
        return officeName;
    }

    @JsonProperty("officeName")
    public void setOfficeName(String officeName) {
        this.officeName = officeName;
    }

    @JsonProperty("debtor")
    public Debtor getDebtor() {
        return debtor;
    }

    @JsonProperty("debtor")
    public void setDebtor(Debtor debtor) {
        this.debtor = debtor;
    }

    @JsonProperty("transferList")
    public TransferList getTransferList() {
        return transferList;
    }

    @JsonProperty("transferList")
    public void setTransferList(TransferList transferList) {
        this.transferList = transferList;
    }

    @JsonProperty("metadata")
    public String getMetadata() {
        return metadata;
    }

    @JsonProperty("metadata")
    public void setMetadata(String metadata) {
        this.metadata = metadata;
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
