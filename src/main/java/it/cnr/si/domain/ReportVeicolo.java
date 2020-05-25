package it.cnr.si.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A Veicolo.
 */
public class ReportVeicolo implements Serializable {

    private static final long serialVersionUID = 1L;


    private Long id;

    @NotNull
    @Column(name = "targa", nullable = false)
    private String targa;

    @Column(name = "istituto", nullable = false)
    private String istituto;

    @Column(name = "responsabile", nullable = false)
    private String responsabile;

    @Column(name = "tipoProprieta", nullable = false)
    private String tipoProprieta;

    @Column(name = "bollo")
    private String bollo;

    @Column(name = "assicurazione")
    private String assicurazione;

    @Column(name = "noleggio")
    private String noleggio;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTarga() {
        return targa;
    }

    public ReportVeicolo targa(String targa) {
        this.targa = targa;
        return this;
    }

    public void setTarga(String targa) {
        this.targa = targa;
    }

    public String getIstituto() {
        return istituto;
    }

    public ReportVeicolo istituto(String istituto) {
        this.istituto = istituto;
        return this;
    }

    public void setIstituto(String istituto) {
        this.istituto = istituto;
    }

    public String getResponsabile() {
        return responsabile;
    }

    public ReportVeicolo responsabile(String responsabile) {
        this.responsabile = responsabile;
        return this;
    }

    public void setResponsabile(String responsabile) {
        this.responsabile = responsabile;
    }

    public String getTipoProprieta() {
        return tipoProprieta;
    }

    public ReportVeicolo tipoProprieta(String tipoProprieta) {
        this.tipoProprieta = tipoProprieta;
        return this;
    }

    public void setTipoProprieta(String tipoProprieta) {
        this.tipoProprieta = tipoProprieta;
    }

    public String getBollo() {
        return bollo;
    }

    public ReportVeicolo cdsuo(String bollo) {
        this.bollo = bollo;
        return this;
    }

    public void setBollo(String bollo) {
        this.bollo = bollo;
    }

    public String getAssicurazione() {
        return assicurazione;
    }

    public ReportVeicolo deleted(String assicurazione) {
        this.assicurazione = assicurazione;
        return this;
    }

    public void setAssicurazione(String assicurazione) {
        this.assicurazione = assicurazione;
    }

    public String getNoleggio() {
        return noleggio;
    }

    public ReportVeicolo noleggio(String noleggio) {
        this.noleggio = noleggio;
        return this;
    }

    public void setNoleggio(String noleggio) {
        this.noleggio = noleggio;
    }


    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ReportVeicolo veicolo = (ReportVeicolo) o;
        if (veicolo.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), veicolo.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ReportVeicolo{" +
            "id=" + getId() +
            ", targa='" + getTarga() + "'" +
            ", istituto='" + getIstituto() + "'" +
            ", responsabile='" + getResponsabile() + "'" +
            ", bollo='" + getBollo() + "'" +
            ", assicurazione='" + getAssicurazione() + "'" +
            ", noleggio=" + getNoleggio() +
            "}";
    }
}
