package org.jhipster.auto.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Auto.
 */
@Entity
@Table(name = "auto")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Auto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "targa", nullable = false)
    private String targa;

    @NotNull
    @Column(name = "marca", nullable = false)
    private String marca;

    @NotNull
    @Column(name = "modello", nullable = false)
    private String modello;

    @NotNull
    @Column(name = "inizio_noleggio", nullable = false)
    private LocalDate inizio_noleggio;

    @NotNull
    @Column(name = "fine_noleggio", nullable = false)
    private LocalDate fine_noleggio;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Istituti cds;

    @ManyToOne
    @JsonIgnoreProperties("")
    private User user;

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

    public Auto targa(String targa) {
        this.targa = targa;
        return this;
    }

    public void setTarga(String targa) {
        this.targa = targa;
    }

    public String getMarca() {
        return marca;
    }

    public Auto marca(String marca) {
        this.marca = marca;
        return this;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModello() {
        return modello;
    }

    public Auto modello(String modello) {
        this.modello = modello;
        return this;
    }

    public void setModello(String modello) {
        this.modello = modello;
    }

    public LocalDate getInizio_noleggio() {
        return inizio_noleggio;
    }

    public Auto inizio_noleggio(LocalDate inizio_noleggio) {
        this.inizio_noleggio = inizio_noleggio;
        return this;
    }

    public void setInizio_noleggio(LocalDate inizio_noleggio) {
        this.inizio_noleggio = inizio_noleggio;
    }

    public LocalDate getFine_noleggio() {
        return fine_noleggio;
    }

    public Auto fine_noleggio(LocalDate fine_noleggio) {
        this.fine_noleggio = fine_noleggio;
        return this;
    }

    public void setFine_noleggio(LocalDate fine_noleggio) {
        this.fine_noleggio = fine_noleggio;
    }

    public Istituti getCds() {
        return cds;
    }


    public Auto cds(Istituti istituti) {
        this.cds = istituti;
        return this;
    }

    public void setCds(Istituti istituti) {
        this.cds = istituti;
    }

    public User getUser() {
        return user;
    }

    public Auto user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        Auto auto = (Auto) o;
        if (auto.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), auto.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Auto{" +
            "id=" + getId() +
            ", targa='" + getTarga() + "'" +
            ", marca='" + getMarca() + "'" +
            ", modello='" + getModello() + "'" +
            ", inizio_noleggio='" + getInizio_noleggio() + "'" +
            ", fine_noleggio='" + getFine_noleggio() + "'" +
            "}";
    }
}
