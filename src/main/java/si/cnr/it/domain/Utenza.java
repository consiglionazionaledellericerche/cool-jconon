package si.cnr.it.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Utenza.
 */
@Entity
@Table(name = "utenza")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Utenza implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "matricola", nullable = false)
    private Integer matricola;

    @NotNull
    @Column(name = "jhi_uid", nullable = false)
    private String uid;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMatricola() {
        return matricola;
    }

    public Utenza matricola(Integer matricola) {
        this.matricola = matricola;
        return this;
    }

    public void setMatricola(Integer matricola) {
        this.matricola = matricola;
    }

    public String getUid() {
        return uid;
    }

    public Utenza uid(String uid) {
        this.uid = uid;
        return this;
    }

    public void setUid(String uid) {
        this.uid = uid;
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
        Utenza utenza = (Utenza) o;
        if (utenza.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), utenza.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Utenza{" +
            "id=" + getId() +
            ", matricola=" + getMatricola() +
            ", uid='" + getUid() + "'" +
            "}";
    }
}
