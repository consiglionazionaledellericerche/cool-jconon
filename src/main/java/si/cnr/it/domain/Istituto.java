package si.cnr.it.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Istituto.
 */
@Entity
@Table(name = "istituto")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Istituto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "cds", nullable = false)
    private String cds;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

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

    public Istituto cds(String cds) {
        this.cds = cds;
        return this;
    }

    public void setCds(String cds) {
        this.cds = cds;
    }

    public String getNome() {
        return nome;
    }

    public Istituto nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
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
        Istituto istituto = (Istituto) o;
        if (istituto.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), istituto.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Istituto{" +
            "id=" + getId() +
            ", cds='" + getCds() + "'" +
            ", nome='" + getNome() + "'" +
            "}";
    }
}
