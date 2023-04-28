package it.cnr.si.cool.jconon.pagopa.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

public class MovimentoCassaPagopa implements Serializable {
    BigDecimal importo;
    String dataValuta;
    String dataContabile;
    String contoAccredito;
    String sct;
    String causale;
    String iuv;
    String idFlusso;
    private String idRiconciliazione;
    private List<RiscossioneMovimentoCassaPagopa> riscossioni;

    public String getIdRiconciliazione() {
        return idRiconciliazione;
    }

    public void setIdRiconciliazione(String idRiconciliazione) {
        this.idRiconciliazione = idRiconciliazione;
    }

    public List<RiscossioneMovimentoCassaPagopa> getRiscossioni() {
        return riscossioni;
    }

    public void setRiscossioni(List<RiscossioneMovimentoCassaPagopa> riscossioni) {
        this.riscossioni = riscossioni;
    }

    public BigDecimal getImporto() {
        return importo;
    }

    public void setImporto(BigDecimal importo) {
        this.importo = importo;
    }

    public String getDataValuta() {
        return dataValuta;
    }

    public void setDataValuta(String dataValuta) {
        this.dataValuta = dataValuta;
    }

    public String getDataContabile() {
        return dataContabile;
    }

    public void setDataContabile(String dataContabile) {
        this.dataContabile = dataContabile;
    }

    public String getContoAccredito() {
        return contoAccredito;
    }

    public void setContoAccredito(String contoAccredito) {
        this.contoAccredito = contoAccredito;
    }

    public String getSct() {
        return sct;
    }

    public void setSct(String sct) {
        this.sct = sct;
    }

    public String getCausale() {
        return causale;
    }

    public void setCausale(String causale) {
        this.causale = causale;
    }

    public String getIuv() {
        return iuv;
    }

    public void setIuv(String iuv) {
        this.iuv = iuv;
    }

    public String getIdFlusso() {
        return idFlusso;
    }

    public void setIdFlusso(String idFlusso) {
        this.idFlusso = idFlusso;
    }

    @Override
    public String toString() {
        return "MovimentoCassaPagopa{" +
                "importo=" + importo +
                ", dataValuta='" + dataValuta + '\'' +
                ", dataContabile='" + dataContabile + '\'' +
                ", contoAccredito='" + contoAccredito + '\'' +
                ", sct='" + sct + '\'' +
                ", causale='" + causale + '\'' +
                ", iuv='" + iuv + '\'' +
                ", idFlusso='" + idFlusso + '\'' +
                ", idRiconciliazione='" + idRiconciliazione + '\'' +
                ", riscossioni=" + riscossioni +
                '}';
    }
}
