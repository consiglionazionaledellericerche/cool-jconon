package it.cnr.si.cool.jconon.pagopa.model;

import java.io.Serializable;
import java.math.BigDecimal;

public class DatiSingoloVersamento  implements Serializable {
        protected BigDecimal importoSingoloVersamento;
        protected BigDecimal commissioneCaricoPA;
        protected String ibanAccredito;
        protected String bicAccredito;
        protected String ibanAppoggio;
        protected String bicAppoggio;
        protected String credenzialiPagatore;
        protected String causaleVersamento;
        protected String datiSpecificiRiscossione;
        protected String datiMarcaBolloDigitale;

    public String getDatiMarcaBolloDigitale() {
        return datiMarcaBolloDigitale;
    }

    public void setDatiMarcaBolloDigitale(String datiMarcaBolloDigitale) {
        this.datiMarcaBolloDigitale = datiMarcaBolloDigitale;
    }

    /**
         * Recupera il valore della proprietà importoSingoloVersamento.
         *
         * @return
         *     possible object is
         *     {@link String }
         *
         */
        public BigDecimal getImportoSingoloVersamento() {
            return importoSingoloVersamento;
        }

        /**
         * Imposta il valore della proprietà importoSingoloVersamento.
         *
         * @param value
         *     allowed object is
         *     {@link String }
         *
         */
        public void setImportoSingoloVersamento(BigDecimal value) {
            this.importoSingoloVersamento = value;
        }

        /**
         * Recupera il valore della proprietà commissioneCaricoPA.
         *
         * @return
         *     possible object is
         *     {@link String }
         *
         */
        public BigDecimal getCommissioneCaricoPA() {
            return commissioneCaricoPA;
        }

        /**
         * Imposta il valore della proprietà commissioneCaricoPA.
         *
         * @param value
         *     allowed object is
         *     {@link String }
         *
         */
        public void setCommissioneCaricoPA(BigDecimal value) {
            this.commissioneCaricoPA = value;
        }

        /**
         * Recupera il valore della proprietà ibanAccredito.
         *
         * @return
         *     possible object is
         *     {@link String }
         *
         */
        public String getIbanAccredito() {
            return ibanAccredito;
        }

        /**
         * Imposta il valore della proprietà ibanAccredito.
         *
         * @param value
         *     allowed object is
         *     {@link String }
         *
         */
        public void setIbanAccredito(String value) {
            this.ibanAccredito = value;
        }

        /**
         * Recupera il valore della proprietà bicAccredito.
         *
         * @return
         *     possible object is
         *     {@link String }
         *
         */
        public String getBicAccredito() {
            return bicAccredito;
        }

        /**
         * Imposta il valore della proprietà bicAccredito.
         *
         * @param value
         *     allowed object is
         *     {@link String }
         *
         */
        public void setBicAccredito(String value) {
            this.bicAccredito = value;
        }

        /**
         * Recupera il valore della proprietà ibanAppoggio.
         *
         * @return
         *     possible object is
         *     {@link String }
         *
         */
        public String getIbanAppoggio() {
            return ibanAppoggio;
        }

        /**
         * Imposta il valore della proprietà ibanAppoggio.
         *
         * @param value
         *     allowed object is
         *     {@link String }
         *
         */
        public void setIbanAppoggio(String value) {
            this.ibanAppoggio = value;
        }

        /**
         * Recupera il valore della proprietà bicAppoggio.
         *
         * @return
         *     possible object is
         *     {@link String }
         *
         */
        public String getBicAppoggio() {
            return bicAppoggio;
        }

        /**
         * Imposta il valore della proprietà bicAppoggio.
         *
         * @param value
         *     allowed object is
         *     {@link String }
         *
         */
        public void setBicAppoggio(String value) {
            this.bicAppoggio = value;
        }

        /**
         * Recupera il valore della proprietà credenzialiPagatore.
         *
         * @return
         *     possible object is
         *     {@link String }
         *
         */
        public String getCredenzialiPagatore() {
            return credenzialiPagatore;
        }

        /**
         * Imposta il valore della proprietà credenzialiPagatore.
         *
         * @param value
         *     allowed object is
         *     {@link String }
         *
         */
        public void setCredenzialiPagatore(String value) {
            this.credenzialiPagatore = value;
        }

        /**
         * Recupera il valore della proprietà causaleVersamento.
         *
         * @return
         *     possible object is
         *     {@link String }
         *
         */
        public String getCausaleVersamento() {
            return causaleVersamento;
        }

        /**
         * Imposta il valore della proprietà causaleVersamento.
         *
         * @param value
         *     allowed object is
         *     {@link String }
         *
         */
        public void setCausaleVersamento(String value) {
            this.causaleVersamento = value;
        }

        /**
         * Recupera il valore della proprietà datiSpecificiRiscossione.
         *
         * @return
         *     possible object is
         *     {@link String }
         *
         */
        public String getDatiSpecificiRiscossione() {
            return datiSpecificiRiscossione;
        }

        /**
         * Imposta il valore della proprietà datiSpecificiRiscossione.
         *
         * @param value
         *     allowed object is
         *     {@link String }
         *
         */
        public void setDatiSpecificiRiscossione(String value) {
            this.datiSpecificiRiscossione = value;
        }

}
