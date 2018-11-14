package si.cnr.it.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A VeicoloNoleggio.
 */
@Entity
@Table(name = "veicolo_noleggio")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class VeicoloNoleggio implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "societa", nullable = false)
    private String societa;

    @NotNull
    @Column(name = "datainizio_noleggio", nullable = false)
    private LocalDate datainizioNoleggio;

    @NotNull
    @Column(name = "datafine_noleggio", nullable = false)
    private LocalDate datafineNoleggio;

    @Column(name = "datacessazione_anticipata")
    private LocalDate datacessazioneAnticipata;

    @Column(name = "data_proroga")
    private LocalDate dataProroga;

    
    @Lob
    @Column(name = "libretto", nullable = false)
    private byte[] libretto;

    @Column(name = "libretto_content_type", nullable = false)
    private String librettoContentType;

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

    public String getSocieta() {
        return societa;
    }

    public VeicoloNoleggio societa(String societa) {
        this.societa = societa;
        return this;
    }

    public void setSocieta(String societa) {
        this.societa = societa;
    }

    public LocalDate getDatainizioNoleggio() {
        return datainizioNoleggio;
    }

    public VeicoloNoleggio datainizioNoleggio(LocalDate datainizioNoleggio) {
        this.datainizioNoleggio = datainizioNoleggio;
        return this;
    }

    public void setDatainizioNoleggio(LocalDate datainizioNoleggio) {
        this.datainizioNoleggio = datainizioNoleggio;
    }

    public LocalDate getDatafineNoleggio() {
        return datafineNoleggio;
    }

    public VeicoloNoleggio datafineNoleggio(LocalDate datafineNoleggio) {
        this.datafineNoleggio = datafineNoleggio;
        return this;
    }

    public void setDatafineNoleggio(LocalDate datafineNoleggio) {
        this.datafineNoleggio = datafineNoleggio;
    }

    public LocalDate getDatacessazioneAnticipata() {
        return datacessazioneAnticipata;
    }

    public VeicoloNoleggio datacessazioneAnticipata(LocalDate datacessazioneAnticipata) {
        this.datacessazioneAnticipata = datacessazioneAnticipata;
        return this;
    }

    public void setDatacessazioneAnticipata(LocalDate datacessazioneAnticipata) {
        this.datacessazioneAnticipata = datacessazioneAnticipata;
    }

    public LocalDate getDataProroga() {
        return dataProroga;
    }

    public VeicoloNoleggio dataProroga(LocalDate dataProroga) {
        this.dataProroga = dataProroga;
        return this;
    }

    public void setDataProroga(LocalDate dataProroga) {
        this.dataProroga = dataProroga;
    }

    public byte[] getLibretto() {
        return libretto;
    }

    public VeicoloNoleggio libretto(byte[] libretto) {
        this.libretto = libretto;
        return this;
    }

    public void setLibretto(byte[] libretto) {
        this.libretto = libretto;
    }

    public String getLibrettoContentType() {
        return librettoContentType;
    }

    public VeicoloNoleggio librettoContentType(String librettoContentType) {
        this.librettoContentType = librettoContentType;
        return this;
    }

    public void setLibrettoContentType(String librettoContentType) {
        this.librettoContentType = librettoContentType;
    }

    public Veicolo getTarga() {
        return targa;
    }

    public VeicoloNoleggio targa(Veicolo veicolo) {
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
        VeicoloNoleggio veicoloNoleggio = (VeicoloNoleggio) o;
        if (veicoloNoleggio.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), veicoloNoleggio.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "VeicoloNoleggio{" +
            "id=" + getId() +
            ", societa='" + getSocieta() + "'" +
            ", datainizioNoleggio='" + getDatainizioNoleggio() + "'" +
            ", datafineNoleggio='" + getDatafineNoleggio() + "'" +
            ", datacessazioneAnticipata='" + getDatacessazioneAnticipata() + "'" +
            ", dataProroga='" + getDataProroga() + "'" +
            ", libretto='" + getLibretto() + "'" +
            ", librettoContentType='" + getLibrettoContentType() + "'" +
            "}";
    }
}
