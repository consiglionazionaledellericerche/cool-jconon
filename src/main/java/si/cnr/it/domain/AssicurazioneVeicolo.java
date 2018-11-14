package si.cnr.it.domain;

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
    @Column(name = "n_polizza", nullable = false)
    private String nPolizza;

    @NotNull
    @Column(name = "data_inserimento", nullable = false)
    private Instant dataInserimento;

    
    @Lob
    @Column(name = "polizza", nullable = false)
    private byte[] polizza;

    @Column(name = "polizza_content_type", nullable = false)
    private String polizzaContentType;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private Veicolo targa;

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

    public String getnPolizza() {
        return nPolizza;
    }

    public AssicurazioneVeicolo nPolizza(String nPolizza) {
        this.nPolizza = nPolizza;
        return this;
    }

    public void setnPolizza(String nPolizza) {
        this.nPolizza = nPolizza;
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

    public Veicolo getTarga() {
        return targa;
    }

    public AssicurazioneVeicolo targa(Veicolo veicolo) {
        this.targa = veicolo;
        return this;
    }

    public void setTarga(Veicolo veicolo) {
        this.targa = veicolo;
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
            ", nPolizza='" + getnPolizza() + "'" +
            ", dataInserimento='" + getDataInserimento() + "'" +
            ", polizza='" + getPolizza() + "'" +
            ", polizzaContentType='" + getPolizzaContentType() + "'" +
            "}";
    }
}
