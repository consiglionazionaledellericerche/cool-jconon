package it.cnr.si.cool.jconon.pagopa.model;

import java.io.Serializable;

public class PendenzaResponse implements Serializable {

    private String qrCode;
    private String barCode;
    private String pdf;

    public String getQrCode() {
        return this.qrCode;
    }
    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }
    public String getBarCode() {
        return this.barCode;
    }
    public void setBarCode(String barCode) {
        this.barCode = barCode;
    }
    public String getPdf() {
        return this.pdf;
    }
    public void setPdf(String pdf) {
        this.pdf = pdf;
    }
}
