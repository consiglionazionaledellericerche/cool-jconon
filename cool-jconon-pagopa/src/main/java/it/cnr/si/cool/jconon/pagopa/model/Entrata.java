package it.cnr.si.cool.jconon.pagopa.model;

public class Entrata {
    private String ibanAccredito;
    private String ibanAppoggio;
    private String tipoContabilita = "SIOPE";
    private String codiceContabilita;

    public String getIbanAccredito() {
        return ibanAccredito;
    }

    public void setIbanAccredito(String ibanAccredito) {
        this.ibanAccredito = ibanAccredito;
    }

    public String getIbanAppoggio() {
        return ibanAppoggio;
    }

    public void setIbanAppoggio(String ibanAppoggio) {
        this.ibanAppoggio = ibanAppoggio;
    }

    public String getTipoContabilita() {
        return tipoContabilita;
    }

    public void setTipoContabilita(String tipoContabilita) {
        this.tipoContabilita = tipoContabilita;
    }

    public String getCodiceContabilita() {
        return codiceContabilita;
    }

    public void setCodiceContabilita(String codiceContabilita) {
        this.codiceContabilita = codiceContabilita;
    }
}
