package it.cnr.si.service.dto;

public class VeicoloDetailPrintDto {
    private String targa;
    private String istituto;
    private String responsabile;
    private String tipoProprieta;
    private String bollo;
    private String assicurazione;
    private String noleggio;

    public String getTarga() {
        return targa;
    }

    public VeicoloDetailPrintDto setTarga(String targa) {
        this.targa = targa;
        return this;
    }

    public String getIstituto() {
        return istituto;
    }

    public VeicoloDetailPrintDto setIstituto(String istituto) {
        this.istituto = istituto;
        return this;
    }

    public String getResponsabile() {
        return responsabile;
    }

    public VeicoloDetailPrintDto setResponsabile(String responsabile) {
        this.responsabile = responsabile;
        return this;
    }

    public String getTipoProprieta() {
        return tipoProprieta;
    }

    public VeicoloDetailPrintDto setTipoProprieta(String tipoProprieta) {
        this.tipoProprieta = tipoProprieta;
        return this;
    }

    public String getBollo() {
        return bollo;
    }

    public VeicoloDetailPrintDto setBollo(String bollo) {
        this.bollo = bollo;
        return this;
    }

    public String getAssicurazione() {
        return assicurazione;
    }

    public VeicoloDetailPrintDto setAssicurazione(String assicurazione) {
        this.assicurazione = assicurazione;
        return this;
    }

    public String getNoleggio() {
        return noleggio;
    }

    public VeicoloDetailPrintDto setNoleggio(String noleggio) {
        this.noleggio = noleggio;
        return this;
    }
}
