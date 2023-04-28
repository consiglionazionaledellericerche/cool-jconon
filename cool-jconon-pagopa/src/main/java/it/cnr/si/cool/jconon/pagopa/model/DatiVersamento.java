package it.cnr.si.cool.jconon.pagopa.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.*;

public class DatiVersamento  implements Serializable {
    protected Date dataEsecuzionePagamento;
    protected BigDecimal importoTotaleDaVersare;
    protected String identificativoUnivocoVersamento;
    protected String codiceContestoPagamento;

    public void setDatiSingoloVersamento(List<DatiSingoloVersamento> datiSingoloVersamento) {
        this.datiSingoloVersamento = datiSingoloVersamento;
    }

    protected String tipoVersamento;
    protected String ibanAddebito;
    protected String bicAddebito;

    public String getTipoVersamento() {
        return tipoVersamento;
    }

    public void setTipoVersamento(String tipoVersamento) {
        this.tipoVersamento = tipoVersamento;
    }

    protected String firmaRicevuta;
    protected List<DatiSingoloVersamento> datiSingoloVersamento;

    public Map<String, Object> getAdditionalProperties() {
        return additionalProperties;
    }

    public void setAdditionalProperties(Map<String, Object> additionalProperties) {
        this.additionalProperties = additionalProperties;
    }

    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * Recupera il valore della proprietà dataEsecuzionePagamento.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public Date getDataEsecuzionePagamento() {
        return dataEsecuzionePagamento;
    }

    /**
     * Imposta il valore della proprietà dataEsecuzionePagamento.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setDataEsecuzionePagamento(Date value) {
        this.dataEsecuzionePagamento = value;
    }

    /**
     * Recupera il valore della proprietà importoTotaleDaVersare.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public BigDecimal getImportoTotaleDaVersare() {
        return importoTotaleDaVersare;
    }

    /**
     * Imposta il valore della proprietà importoTotaleDaVersare.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setImportoTotaleDaVersare(BigDecimal value) {
        this.importoTotaleDaVersare = value;
    }


    /**
     * Recupera il valore della proprietà identificativoUnivocoVersamento.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public String getIdentificativoUnivocoVersamento() {
        return identificativoUnivocoVersamento;
    }

    /**
     * Imposta il valore della proprietà identificativoUnivocoVersamento.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setIdentificativoUnivocoVersamento(String value) {
        this.identificativoUnivocoVersamento = value;
    }

    /**
     * Recupera il valore della proprietà codiceContestoPagamento.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public String getCodiceContestoPagamento() {
        return codiceContestoPagamento;
    }

    /**
     * Imposta il valore della proprietà codiceContestoPagamento.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setCodiceContestoPagamento(String value) {
        this.codiceContestoPagamento = value;
    }

    /**
     * Recupera il valore della proprietà ibanAddebito.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public String getIbanAddebito() {
        return ibanAddebito;
    }

    /**
     * Imposta il valore della proprietà ibanAddebito.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setIbanAddebito(String value) {
        this.ibanAddebito = value;
    }

    /**
     * Recupera il valore della proprietà bicAddebito.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public String getBicAddebito() {
        return bicAddebito;
    }

    /**
     * Imposta il valore della proprietà bicAddebito.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setBicAddebito(String value) {
        this.bicAddebito = value;
    }

    /**
     * Recupera il valore della proprietà firmaRicevuta.
     *
     * @return
     *     possible object is
     *     {@link String }
     *
     */
    public String getFirmaRicevuta() {
        return firmaRicevuta;
    }

    /**
     * Imposta il valore della proprietà firmaRicevuta.
     *
     * @param value
     *     allowed object is
     *     {@link String }
     *
     */
    public void setFirmaRicevuta(String value) {
        this.firmaRicevuta = value;
    }

    /**
     * Gets the value of the datiSingoloVersamento property.
     *
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the datiSingoloVersamento property.
     *
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getDatiSingoloVersamento().add(newItem);
     * </pre>
     *
     *
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link DatiSingoloVersamento }
     *
     *
     */
    public List<DatiSingoloVersamento> getDatiSingoloVersamento() {
        if (datiSingoloVersamento == null) {
            datiSingoloVersamento = new ArrayList<DatiSingoloVersamento>();
        }
        return this.datiSingoloVersamento;
    }

}
