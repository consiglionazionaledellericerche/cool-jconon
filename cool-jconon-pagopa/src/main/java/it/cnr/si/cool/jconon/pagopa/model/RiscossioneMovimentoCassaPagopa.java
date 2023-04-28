package it.cnr.si.cool.jconon.pagopa.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

public class RiscossioneMovimentoCassaPagopa implements Serializable {
        @JsonProperty("dominio")
        private Dominio dominio;

        @JsonProperty("iuv")
        private String iuv;

        @JsonProperty("iur")
        private String iur;

        @JsonProperty("indice")
        private BigDecimal indice;

        @JsonProperty("stato")
        private StatoRiscossione stato;

        @JsonProperty("tipo")
        private TipoRiscossione tipo;

        @JsonProperty("importo")
        private BigDecimal importo;

        @JsonProperty("data")
        private Date data;

        @JsonProperty("vocePendenza")
        private VocePendenza vocePendenza;

        @JsonProperty("riconciliazione")
        private String riconciliazione;

    public Dominio getDominio() {
        return dominio;
    }

    public void setDominio(Dominio dominio) {
        this.dominio = dominio;
    }

    public String getIuv() {
        return iuv;
    }

    public void setIuv(String iuv) {
        this.iuv = iuv;
    }

    public String getIur() {
        return iur;
    }

    public void setIur(String iur) {
        this.iur = iur;
    }

    public BigDecimal getIndice() {
        return indice;
    }

    public void setIndice(BigDecimal indice) {
        this.indice = indice;
    }

    public StatoRiscossione getStato() {
        return stato;
    }

    public void setStato(StatoRiscossione stato) {
        this.stato = stato;
    }

    public TipoRiscossione getTipo() {
        return tipo;
    }

    public void setTipo(TipoRiscossione tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getImporto() {
        return importo;
    }

    public void setImporto(BigDecimal importo) {
        this.importo = importo;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public VocePendenza getVocePendenza() {
        return vocePendenza;
    }

    public void setVocePendenza(VocePendenza vocePendenza) {
        this.vocePendenza = vocePendenza;
    }

    public String getRiconciliazione() {
        return riconciliazione;
    }

    public void setRiconciliazione(String riconciliazione) {
        this.riconciliazione = riconciliazione;
    }

    @Override
    public String toString() {
        return "RiscossioneMovimentoCassaPagopa{" +
                "dominio=" + dominio +
                ", iuv='" + iuv + '\'' +
                ", iur='" + iur + '\'' +
                ", indice=" + indice +
                ", stato=" + stato +
                ", tipo=" + tipo +
                ", importo=" + importo +
                ", data=" + data +
                ", vocePendenza=" + vocePendenza +
                ", riconciliazione='" + riconciliazione + '\'' +
                '}';
    }
}
