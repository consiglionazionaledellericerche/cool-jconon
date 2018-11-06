package org.jhipster.auto.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Istituti.
 */
@Entity
@Table(name = "istituti")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Istituti implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "cds", nullable = false)
    private String cds;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @NotNull
    @Column(name = "citta", nullable = false)
    private String citta;

    @NotNull
    @Column(name = "indirizzo", nullable = false)
    private String indirizzo;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCds() {
        return cds;
    }

    public Istituti cds(String cds) {
        this.cds = cds;
        return this;
    }

    public void setCds(String cds) {
        this.cds = cds;
    }

    public String getNome() {
        return nome;
    }

    public Istituti nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCitta() {
        return citta;
    }

    public Istituti citta(String citta) {
        this.citta = citta;
        return this;
    }

    public void setCitta(String citta) {
        this.citta = citta;
    }

    public String getIndirizzo() {
        return indirizzo;
    }

    public Istituti indirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
        return this;
    }

    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
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
        Istituti istituti = (Istituti) o;
        if (istituti.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), istituti.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Istituti{" +
            "id=" + getId() +
            ", cds='" + getCds() + "'" +
            ", nome='" + getNome() + "'" +
            ", citta='" + getCitta() + "'" +
            ", indirizzo='" + getIndirizzo() + "'" +
            "}";
    }
}
