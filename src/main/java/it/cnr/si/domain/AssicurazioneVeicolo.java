package it.cnr.si.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A AssicurazioneVeicolo.
 */
@Entity
@Table(name = "assicurazione_veicolo")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class AssicurazioneVeicolo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "compagnia_assicurazione", nullable = false)
    private String compagniaAssicurazione;

    @NotNull
    @Column(name = "data_scadenza", nullable = false)
    private LocalDate dataScadenza;

    @NotNull
    @Column(name = "numero_polizza", nullable = false)
    private String numeroPolizza;

    
    @Lob
    @Column(name = "polizza", nullable = false)
    private byte[] polizza;

    @Column(name = "polizza_content_type", nullable = false)
    private String polizzaContentType;

    @NotNull
    @Column(name = "data_inserimento", nullable = false)
    private Instant dataInserimento;

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

    public String getCompagniaAssicurazione() {
        return compagniaAssicurazione;
    }

    public AssicurazioneVeicolo compagniaAssicurazione(String compagniaAssicurazione) {
        this.compagniaAssicurazione = compagniaAssicurazione;
        return this;
    }

    public void setCompagniaAssicurazione(String compagniaAssicurazione) {
        this.compagniaAssicurazione = compagniaAssicurazione;
    }

    public LocalDate getDataScadenza() {
        return dataScadenza;
    }

    public AssicurazioneVeicolo dataScadenza(LocalDate dataScadenza) {
        this.dataScadenza = dataScadenza;
        return this;
    }

    public void setDataScadenza(LocalDate dataScadenza) {
        this.dataScadenza = dataScadenza;
    }

    public String getNumeroPolizza() {
        return numeroPolizza;
    }

    public AssicurazioneVeicolo numeroPolizza(String numeroPolizza) {
        this.numeroPolizza = numeroPolizza;
        return this;
    }

    public void setNumeroPolizza(String numeroPolizza) {
        this.numeroPolizza = numeroPolizza;
    }

    public byte[] getPolizza() {
        return polizza;
    }

    public AssicurazioneVeicolo polizza(byte[] polizza) {
        this.polizza = polizza;
        return this;
    }

    public void setPolizza(byte[] polizza) {
        this.polizza = polizza;
    }

    public String getPolizzaContentType() {
        return polizzaContentType;
    }

    public AssicurazioneVeicolo polizzaContentType(String polizzaContentType) {
        this.polizzaContentType = polizzaContentType;
        return this;
    }

    public void setPolizzaContentType(String polizzaContentType) {
        this.polizzaContentType = polizzaContentType;
    }

    public Instant getDataInserimento() {
        return dataInserimento;
    }

    public AssicurazioneVeicolo dataInserimento(Instant dataInserimento) {
        this.dataInserimento = dataInserimento;
        return this;
    }

    public void setDataInserimento(Instant dataInserimento) {
        this.dataInserimento = dataInserimento;
    }

    public Veicolo getVeicolo() {
        return veicolo;
    }

    public AssicurazioneVeicolo veicolo(Veicolo veicolo) {
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
        AssicurazioneVeicolo assicurazioneVeicolo = (AssicurazioneVeicolo) o;
        if (assicurazioneVeicolo.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), assicurazioneVeicolo.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AssicurazioneVeicolo{" +
            "id=" + getId() +
            ", compagniaAssicurazione='" + getCompagniaAssicurazione() + "'" +
            ", dataScadenza='" + getDataScadenza() + "'" +
            ", numeroPolizza='" + getNumeroPolizza() + "'" +
            ", polizza='" + getPolizza() + "'" +
            ", polizzaContentType='" + getPolizzaContentType() + "'" +
            ", dataInserimento='" + getDataInserimento() + "'" +
            "}";
    }
}
