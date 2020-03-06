package it.cnr.si.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A Bollo.
 */
@Entity
@Table(name = "bollo")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Bollo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "data_scadenza", columnDefinition="DATE")
    //@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="dd/MM/yyyy")
    private Instant dataScadenza;

    @Lob
    @Column(name = "bollo_pdf")
    private byte[] bolloPdf;

    @Column(name = "bollo_pdf_content_type")
    private String bolloPdfContentType;

    @Column(name = "visionato_bollo")
    private ZonedDateTime visionatoBollo;

    @NotNull
    @Column(name = "pagato", nullable = false)
    private Boolean pagato;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private Veicolo veicolo;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDataScadenza() {
        return dataScadenza;
    }

    public Bollo dataScadenza(Instant dataScadenza) {
        this.dataScadenza = dataScadenza;
        return this;
    }

    public void setDataScadenza(Instant dataScadenza) {
        this.dataScadenza = dataScadenza;
    }

    public byte[] getBolloPdf() {
        return bolloPdf;
    }

    public Bollo bolloPdf(byte[] bolloPdf) {
        this.bolloPdf = bolloPdf;
        return this;
    }

    public void setBolloPdf(byte[] bolloPdf) {
        this.bolloPdf = bolloPdf;
    }

    public String getBolloPdfContentType() {
        return bolloPdfContentType;
    }

    public Bollo bolloPdfContentType(String bolloPdfContentType) {
        this.bolloPdfContentType = bolloPdfContentType;
        return this;
    }

    public void setBolloPdfContentType(String bolloPdfContentType) {
        this.bolloPdfContentType = bolloPdfContentType;
    }

    public ZonedDateTime getVisionatoBollo() {
        return visionatoBollo;
    }

    public Bollo visionatoBollo(ZonedDateTime visionatoBollo) {
        this.visionatoBollo = visionatoBollo;
        return this;
    }

    public void setVisionatoBollo(ZonedDateTime visionatoBollo) {
        this.visionatoBollo = visionatoBollo;
    }

    public Boolean isPagato() {
        return pagato;
    }

    public Bollo pagato(Boolean pagato) {
        this.pagato = pagato;
        return this;
    }

    public void setPagato(Boolean pagato) {
        this.pagato = pagato;
    }

    public Veicolo getVeicolo() {
        return veicolo;
    }

    public Bollo veicolo(Veicolo veicolo) {
        this.veicolo = veicolo;
        return this;
    }

    public void setVeicolo(Veicolo veicolo) {
        this.veicolo = veicolo;
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
        Bollo bollo = (Bollo) o;
        if (bollo.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), bollo.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Bollo{" +
            "id=" + getId() +
            ", dataScadenza='" + getDataScadenza() + "'" +
            ", bolloPdf='" + getBolloPdf() + "'" +
            ", bolloPdfContentType='" + getBolloPdfContentType() + "'" +
            ", visionatoBollo='" + getVisionatoBollo() + "'" +
            ", pagato='" + isPagato() + "'" +
            "}";
    }
}
