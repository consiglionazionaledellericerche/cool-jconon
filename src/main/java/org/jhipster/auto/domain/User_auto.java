package org.jhipster.auto.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A User_auto.
 */
@Entity
@Table(name = "user_auto")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class User_auto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        User_auto user_auto = (User_auto) o;
        if (user_auto.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), user_auto.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "User_auto{" +
            "id=" + getId() +
            "}";
    }
}
