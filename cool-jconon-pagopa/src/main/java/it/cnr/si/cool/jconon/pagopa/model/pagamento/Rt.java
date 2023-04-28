
package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "receiptId",
        "noticeNumber",
        "fiscalCode",
        "outcome",
        "creditorReferenceId",
        "paymentAmount",
        "description",
        "companyName",
        "officeName",
        "debtor",
        "transferList",
        "idPSP",
        "pspFiscalCode",
        "pspPartitaIVA",
        "PSPCompanyName",
        "idChannel",
        "channelDescription",
        "payer",
        "paymentMethod",
        "fee",
        "paymentDateTime",
        "applicationDate",
        "transferDate",
        "metadata"
})
@Generated("jsonschema2pojo")
public class Rt implements Serializable {

    @JsonProperty("receiptId")
    private String receiptId;
    @JsonProperty("noticeNumber")
    private String noticeNumber;
    @JsonProperty("fiscalCode")
    private String fiscalCode;
    @JsonProperty("outcome")
    private String outcome;
    @JsonProperty("creditorReferenceId")
    private String creditorReferenceId;
    @JsonProperty("paymentAmount")
    private String paymentAmount;
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
    @JsonProperty("idPSP")
    private String idPSP;
    @JsonProperty("pspFiscalCode")
    private Object pspFiscalCode;
    @JsonProperty("pspPartitaIVA")
    private Object pspPartitaIVA;
    @JsonProperty("PSPCompanyName")
    private String pSPCompanyName;
    @JsonProperty("idChannel")
    private String idChannel;
    @JsonProperty("channelDescription")
    private String channelDescription;
    @JsonProperty("payer")
    private Object payer;
    @JsonProperty("paymentMethod")
    private Object paymentMethod;
    @JsonProperty("fee")
    private Object fee;
    @JsonProperty("paymentDateTime")
    private String paymentDateTime;
    @JsonProperty("applicationDate")
    private String applicationDate;
    @JsonProperty("transferDate")
    private Object transferDate;
    @JsonProperty("metadata")
    private Object metadata;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("receiptId")
    public String getReceiptId() {
        return receiptId;
    }

    @JsonProperty("receiptId")
    public void setReceiptId(String receiptId) {
        this.receiptId = receiptId;
    }

    @JsonProperty("noticeNumber")
    public String getNoticeNumber() {
        return noticeNumber;
    }

    @JsonProperty("noticeNumber")
    public void setNoticeNumber(String noticeNumber) {
        this.noticeNumber = noticeNumber;
    }

    @JsonProperty("fiscalCode")
    public String getFiscalCode() {
        return fiscalCode;
    }

    @JsonProperty("fiscalCode")
    public void setFiscalCode(String fiscalCode) {
        this.fiscalCode = fiscalCode;
    }

    @JsonProperty("outcome")
    public String getOutcome() {
        return outcome;
    }

    @JsonProperty("outcome")
    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

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

    @JsonProperty("idPSP")
    public String getIdPSP() {
        return idPSP;
    }

    @JsonProperty("idPSP")
    public void setIdPSP(String idPSP) {
        this.idPSP = idPSP;
    }

    @JsonProperty("pspFiscalCode")
    public Object getPspFiscalCode() {
        return pspFiscalCode;
    }

    @JsonProperty("pspFiscalCode")
    public void setPspFiscalCode(Object pspFiscalCode) {
        this.pspFiscalCode = pspFiscalCode;
    }

    @JsonProperty("pspPartitaIVA")
    public Object getPspPartitaIVA() {
        return pspPartitaIVA;
    }

    @JsonProperty("pspPartitaIVA")
    public void setPspPartitaIVA(Object pspPartitaIVA) {
        this.pspPartitaIVA = pspPartitaIVA;
    }

    @JsonProperty("PSPCompanyName")
    public String getPSPCompanyName() {
        return pSPCompanyName;
    }

    @JsonProperty("PSPCompanyName")
    public void setPSPCompanyName(String pSPCompanyName) {
        this.pSPCompanyName = pSPCompanyName;
    }

    @JsonProperty("idChannel")
    public String getIdChannel() {
        return idChannel;
    }

    @JsonProperty("idChannel")
    public void setIdChannel(String idChannel) {
        this.idChannel = idChannel;
    }

    @JsonProperty("channelDescription")
    public String getChannelDescription() {
        return channelDescription;
    }

    @JsonProperty("channelDescription")
    public void setChannelDescription(String channelDescription) {
        this.channelDescription = channelDescription;
    }

    @JsonProperty("payer")
    public Object getPayer() {
        return payer;
    }

    @JsonProperty("payer")
    public void setPayer(Object payer) {
        this.payer = payer;
    }

    @JsonProperty("paymentMethod")
    public Object getPaymentMethod() {
        return paymentMethod;
    }

    @JsonProperty("paymentMethod")
    public void setPaymentMethod(Object paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    @JsonProperty("fee")
    public Object getFee() {
        return fee;
    }

    @JsonProperty("fee")
    public void setFee(Object fee) {
        this.fee = fee;
    }

    @JsonProperty("paymentDateTime")
    public String getPaymentDateTime() {
        return paymentDateTime;
    }

    @JsonProperty("paymentDateTime")
    public void setPaymentDateTime(String paymentDateTime) {
        this.paymentDateTime = paymentDateTime;
    }

    @JsonProperty("applicationDate")
    public String getApplicationDate() {
        return applicationDate;
    }

    @JsonProperty("applicationDate")
    public void setApplicationDate(String applicationDate) {
        this.applicationDate = applicationDate;
    }

    @JsonProperty("transferDate")
    public Object getTransferDate() {
        return transferDate;
    }

    @JsonProperty("transferDate")
    public void setTransferDate(Object transferDate) {
        this.transferDate = transferDate;
    }

    @JsonProperty("metadata")
    public Object getMetadata() {
        return metadata;
    }

    @JsonProperty("metadata")
    public void setMetadata(Object metadata) {
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