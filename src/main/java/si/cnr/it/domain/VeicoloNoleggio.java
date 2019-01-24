package si.cnr.it.domain;

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
    @Column(name = "data_inizio_noleggio", nullable = false)
    private LocalDate dataInizioNoleggio;

    @NotNull
    @Column(name = "data_fine_noleggio", nullable = false)
    private LocalDate dataFineNoleggio;

    @Column(name = "data_cessazione_anticipata")
    private LocalDate dataCessazioneAnticipata;

    @Column(name = "data_proroga")
    private LocalDate dataProroga;

    
    @Lob
    @Column(name = "libretto", nullable = false)
    private byte[] libretto;

    @Column(name = "libretto_content_type", nullable = false)
    private String librettoContentType;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Veicolo veicolo;

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

    public LocalDate getDataInizioNoleggio() {
        return dataInizioNoleggio;
    }

    public VeicoloNoleggio dataInizioNoleggio(LocalDate dataInizioNoleggio) {
        this.dataInizioNoleggio = dataInizioNoleggio;
        return this;
    }

    public void setDataInizioNoleggio(LocalDate dataInizioNoleggio) {
        this.dataInizioNoleggio = dataInizioNoleggio;
    }

    public LocalDate getDataFineNoleggio() {
        return dataFineNoleggio;
    }

    public VeicoloNoleggio dataFineNoleggio(LocalDate dataFineNoleggio) {
        this.dataFineNoleggio = dataFineNoleggio;
        return this;
    }

    public void setDataFineNoleggio(LocalDate dataFineNoleggio) {
        this.dataFineNoleggio = dataFineNoleggio;
    }

    public LocalDate getDataCessazioneAnticipata() {
        return dataCessazioneAnticipata;
    }

    public VeicoloNoleggio dataCessazioneAnticipata(LocalDate dataCessazioneAnticipata) {
        this.dataCessazioneAnticipata = dataCessazioneAnticipata;
        return this;
    }

    public void setDataCessazioneAnticipata(LocalDate dataCessazioneAnticipata) {
        this.dataCessazioneAnticipata = dataCessazioneAnticipata;
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

    public Veicolo getVeicolo() {
        return veicolo;
    }

    public VeicoloNoleggio veicolo(Veicolo veicolo) {
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
            ", dataInizioNoleggio='" + getDataInizioNoleggio() + "'" +
            ", dataFineNoleggio='" + getDataFineNoleggio() + "'" +
            ", dataCessazioneAnticipata='" + getDataCessazioneAnticipata() + "'" +
            ", dataProroga='" + getDataProroga() + "'" +
            ", libretto='" + getLibretto() + "'" +
            ", librettoContentType='" + getLibrettoContentType() + "'" +
            "}";
    }
}
