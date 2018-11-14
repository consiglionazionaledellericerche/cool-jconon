package si.cnr.it.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A LibrettopercorrenzaVeicolo.
 */
@Entity
@Table(name = "librettopercorrenza_veicolo")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class LibrettopercorrenzaVeicolo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    
    @Lob
    @Column(name = "libretto_percorrenza", nullable = false)
    private byte[] librettoPercorrenza;

    @Column(name = "libretto_percorrenza_content_type", nullable = false)
    private String librettoPercorrenzaContentType;

    @NotNull
    @Column(name = "data", nullable = false)
    private Instant data;

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

    public byte[] getLibrettoPercorrenza() {
        return librettoPercorrenza;
    }

    public LibrettopercorrenzaVeicolo librettoPercorrenza(byte[] librettoPercorrenza) {
        this.librettoPercorrenza = librettoPercorrenza;
        return this;
    }

    public void setLibrettoPercorrenza(byte[] librettoPercorrenza) {
        this.librettoPercorrenza = librettoPercorrenza;
    }

    public String getLibrettoPercorrenzaContentType() {
        return librettoPercorrenzaContentType;
    }

    public LibrettopercorrenzaVeicolo librettoPercorrenzaContentType(String librettoPercorrenzaContentType) {
        this.librettoPercorrenzaContentType = librettoPercorrenzaContentType;
        return this;
    }

    public void setLibrettoPercorrenzaContentType(String librettoPercorrenzaContentType) {
        this.librettoPercorrenzaContentType = librettoPercorrenzaContentType;
    }

    public Instant getData() {
        return data;
    }

    public LibrettopercorrenzaVeicolo data(Instant data) {
        this.data = data;
        return this;
    }

    public void setData(Instant data) {
        this.data = data;
    }

    public Veicolo getTarga() {
        return targa;
    }

    public LibrettopercorrenzaVeicolo targa(Veicolo veicolo) {
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
        LibrettopercorrenzaVeicolo librettopercorrenzaVeicolo = (LibrettopercorrenzaVeicolo) o;
        if (librettopercorrenzaVeicolo.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), librettopercorrenzaVeicolo.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "LibrettopercorrenzaVeicolo{" +
            "id=" + getId() +
            ", librettoPercorrenza='" + getLibrettoPercorrenza() + "'" +
            ", librettoPercorrenzaContentType='" + getLibrettoPercorrenzaContentType() + "'" +
            ", data='" + getData() + "'" +
            "}";
    }
}
