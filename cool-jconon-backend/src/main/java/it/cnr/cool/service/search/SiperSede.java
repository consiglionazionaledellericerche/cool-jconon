package it.cnr.cool.service.search;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by francesco on 29/11/16.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class SiperSede {

    private String sedeId;

    private String direzione;

    private String indirizzo;
    private String codCitta;
    private String cap;
    private String prov;
    private String telex;
    private String fax;
    private String telefono;
    private String telefono2;
    private String telefono3;
    private String email;
    private String dataIst;
    private String rsu;
    private String titCa;
    private String tipoOp;
    private String dataOp;
    private String descrizione;
    private String citta;
    private String sigla;
    public String getSedeId() {
        return sedeId;
    }
    public void setSedeId(String sedeId) {
        this.sedeId = sedeId;
    }

    public String getDirezione() {
        return direzione;
    }

    public void setDirezione(String direzione) {
        this.direzione = direzione;
    }

    public String getIndirizzo() {
        return indirizzo;
    }

    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
    }

    public String getCodCitta() {
        return codCitta;
    }

    public void setCodCitta(String codCitta) {
        this.codCitta = codCitta;
    }

    public String getCap() {
        return cap;
    }

    public void setCap(String cap) {
        this.cap = cap;
    }

    public String getProv() {
        return prov;
    }

    public void setProv(String prov) {
        this.prov = prov;
    }

    public String getTelex() {
        return telex;
    }

    public void setTelex(String telex) {
        this.telex = telex;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getTelefono2() {
        return telefono2;
    }

    public void setTelefono2(String telefono2) {
        this.telefono2 = telefono2;
    }

    public String getTelefono3() {
        return telefono3;
    }

    public void setTelefono3(String telefono3) {
        this.telefono3 = telefono3;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDataIst() {
        return dataIst;
    }

    public void setDataIst(String dataIst) {
        this.dataIst = dataIst;
    }

    public String getRsu() {
        return rsu;
    }

    public void setRsu(String rsu) {
        this.rsu = rsu;
    }

    public String getTitCa() {
        return titCa;
    }

    public void setTitCa(String titCa) {
        this.titCa = titCa;
    }

    public String getTipoOp() {
        return tipoOp;
    }

    public void setTipoOp(String tipoOp) {
        this.tipoOp = tipoOp;
    }

    public String getDataOp() {
        return dataOp;
    }

    public void setDataOp(String dataOp) {
        this.dataOp = dataOp;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public String getCitta() {
        return citta;
    }

    public void setCitta(String citta) {
        this.citta = citta;
    }

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SiperSede siperSede = (SiperSede) o;

        if (sedeId != null ? !sedeId.equals(siperSede.sedeId) : siperSede.sedeId != null) return false;
        if (direzione != null ? !direzione.equals(siperSede.direzione) : siperSede.direzione != null) return false;
        if (indirizzo != null ? !indirizzo.equals(siperSede.indirizzo) : siperSede.indirizzo != null) return false;
        if (codCitta != null ? !codCitta.equals(siperSede.codCitta) : siperSede.codCitta != null) return false;
        if (cap != null ? !cap.equals(siperSede.cap) : siperSede.cap != null) return false;
        if (prov != null ? !prov.equals(siperSede.prov) : siperSede.prov != null) return false;
        if (telex != null ? !telex.equals(siperSede.telex) : siperSede.telex != null) return false;
        if (fax != null ? !fax.equals(siperSede.fax) : siperSede.fax != null) return false;
        if (telefono != null ? !telefono.equals(siperSede.telefono) : siperSede.telefono != null) return false;
        if (telefono2 != null ? !telefono2.equals(siperSede.telefono2) : siperSede.telefono2 != null) return false;
        if (telefono3 != null ? !telefono3.equals(siperSede.telefono3) : siperSede.telefono3 != null) return false;
        if (email != null ? !email.equals(siperSede.email) : siperSede.email != null) return false;
        if (dataIst != null ? !dataIst.equals(siperSede.dataIst) : siperSede.dataIst != null) return false;
        if (rsu != null ? !rsu.equals(siperSede.rsu) : siperSede.rsu != null) return false;
        if (titCa != null ? !titCa.equals(siperSede.titCa) : siperSede.titCa != null) return false;
        if (tipoOp != null ? !tipoOp.equals(siperSede.tipoOp) : siperSede.tipoOp != null) return false;
        if (dataOp != null ? !dataOp.equals(siperSede.dataOp) : siperSede.dataOp != null) return false;
        if (descrizione != null ? !descrizione.equals(siperSede.descrizione) : siperSede.descrizione != null)
            return false;
        if (citta != null ? !citta.equals(siperSede.citta) : siperSede.citta != null) return false;
        return sigla != null ? sigla.equals(siperSede.sigla) : siperSede.sigla == null;
    }

    @Override
    public int hashCode() {
        int result = sedeId != null ? sedeId.hashCode() : 0;
        result = 31 * result + (direzione != null ? direzione.hashCode() : 0);
        result = 31 * result + (indirizzo != null ? indirizzo.hashCode() : 0);
        result = 31 * result + (codCitta != null ? codCitta.hashCode() : 0);
        result = 31 * result + (cap != null ? cap.hashCode() : 0);
        result = 31 * result + (prov != null ? prov.hashCode() : 0);
        result = 31 * result + (telex != null ? telex.hashCode() : 0);
        result = 31 * result + (fax != null ? fax.hashCode() : 0);
        result = 31 * result + (telefono != null ? telefono.hashCode() : 0);
        result = 31 * result + (telefono2 != null ? telefono2.hashCode() : 0);
        result = 31 * result + (telefono3 != null ? telefono3.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (dataIst != null ? dataIst.hashCode() : 0);
        result = 31 * result + (rsu != null ? rsu.hashCode() : 0);
        result = 31 * result + (titCa != null ? titCa.hashCode() : 0);
        result = 31 * result + (tipoOp != null ? tipoOp.hashCode() : 0);
        result = 31 * result + (dataOp != null ? dataOp.hashCode() : 0);
        result = 31 * result + (descrizione != null ? descrizione.hashCode() : 0);
        result = 31 * result + (citta != null ? citta.hashCode() : 0);
        result = 31 * result + (sigla != null ? sigla.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "SiperSede{" +
                "sedeId='" + sedeId + '\'' +
                ", direzione='" + direzione + '\'' +
                ", indirizzo='" + indirizzo + '\'' +
                ", codCitta='" + codCitta + '\'' +
                ", cap='" + cap + '\'' +
                ", prov='" + prov + '\'' +
                ", telex='" + telex + '\'' +
                ", fax='" + fax + '\'' +
                ", telefono='" + telefono + '\'' +
                ", telefono2='" + telefono2 + '\'' +
                ", telefono3='" + telefono3 + '\'' +
                ", email='" + email + '\'' +
                ", dataIst='" + dataIst + '\'' +
                ", rsu='" + rsu + '\'' +
                ", titCa='" + titCa + '\'' +
                ", tipoOp='" + tipoOp + '\'' +
                ", dataOp='" + dataOp + '\'' +
                ", descrizione='" + descrizione + '\'' +
                ", citta='" + citta + '\'' +
                ", sigla='" + sigla + '\'' +
                '}';
    }
}
