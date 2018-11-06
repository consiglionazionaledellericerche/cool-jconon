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
 * A User_istituti.
 */
@Entity
@Table(name = "user_istituti")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class User_istituti implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "data", nullable = false)
    private LocalDate data;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Istituti istituti;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getData() {
        return data;
    }

    public User_istituti data(LocalDate data) {
        this.data = data;
        return this;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public User getUser() {
        return user;
    }

    public User_istituti user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Istituti getIstituti() {
        return istituti;
    }

    public User_istituti istituti(Istituti istituti) {
        this.istituti = istituti;
        return this;
    }

    public void setIstituti(Istituti istituti) {
        this.istituti = istituti;
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
        User_istituti user_istituti = (User_istituti) o;
        if (user_istituti.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), user_istituti.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "User_istituti{" +
            "id=" + getId() +
            ", data='" + getData() + "'" +
            "}";
    }
}
