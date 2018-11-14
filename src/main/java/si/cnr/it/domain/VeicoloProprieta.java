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
 * A VeicoloProprieta.
 */
@Entity
@Table(name = "veicolo_proprieta")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class VeicoloProprieta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "data_immatricolazione", nullable = false)
    private LocalDate dataImmatricolazione;

    @NotNull
    @Column(name = "data_acquisto", nullable = false)
    private LocalDate dataAcquisto;

    @NotNull
    @Column(name = "regione_immatricolazione", nullable = false)
    private String regioneImmatricolazione;

    
    @Lob
    @Column(name = "libretto", nullable = false)
    private byte[] libretto;

    @Column(name = "libretto_content_type", nullable = false)
    private String librettoContentType;

    
    @Lob
    @Column(name = "certificato_proprieta", nullable = false)
    private byte[] certificatoProprieta;

    @Column(name = "certificato_proprieta_content_type", nullable = false)
    private String certificatoProprietaContentType;

    @NotNull
    @Column(name = "altromotivazione_perdita_proprieta", nullable = false)
    private String altromotivazionePerditaProprieta;

    @Column(name = "dataperdita_proprieta")
    private LocalDate dataperditaProprieta;

    @ManyToOne
    @JsonIgnoreProperties("")
    private MotivazioneperditaProprieta motivazioneperditaProprieta;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private Veicolo veicolo;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDataImmatricolazione() {
        return dataImmatricolazione;
    }

    public VeicoloProprieta dataImmatricolazione(LocalDate dataImmatricolazione) {
        this.dataImmatricolazione = dataImmatricolazione;
        return this;
    }

    public void setDataImmatricolazione(LocalDate dataImmatricolazione) {
        this.dataImmatricolazione = dataImmatricolazione;
    }

    public LocalDate getDataAcquisto() {
        return dataAcquisto;
    }

    public VeicoloProprieta dataAcquisto(LocalDate dataAcquisto) {
        this.dataAcquisto = dataAcquisto;
        return this;
    }

    public void setDataAcquisto(LocalDate dataAcquisto) {
        this.dataAcquisto = dataAcquisto;
    }

    public String getRegioneImmatricolazione() {
        return regioneImmatricolazione;
    }

    public VeicoloProprieta regioneImmatricolazione(String regioneImmatricolazione) {
        this.regioneImmatricolazione = regioneImmatricolazione;
        return this;
    }

    public void setRegioneImmatricolazione(String regioneImmatricolazione) {
        this.regioneImmatricolazione = regioneImmatricolazione;
    }

    public byte[] getLibretto() {
        return libretto;
    }

    public VeicoloProprieta libretto(byte[] libretto) {
        this.libretto = libretto;
        return this;
    }

    public void setLibretto(byte[] libretto) {
        this.libretto = libretto;
    }

    public String getLibrettoContentType() {
        return librettoContentType;
    }

    public VeicoloProprieta librettoContentType(String librettoContentType) {
        this.librettoContentType = librettoContentType;
        return this;
    }

    public void setLibrettoContentType(String librettoContentType) {
        this.librettoContentType = librettoContentType;
    }

    public byte[] getCertificatoProprieta() {
        return certificatoProprieta;
    }

    public VeicoloProprieta certificatoProprieta(byte[] certificatoProprieta) {
        this.certificatoProprieta = certificatoProprieta;
        return this;
    }

    public void setCertificatoProprieta(byte[] certificatoProprieta) {
        this.certificatoProprieta = certificatoProprieta;
    }

    public String getCertificatoProprietaContentType() {
        return certificatoProprietaContentType;
    }

    public VeicoloProprieta certificatoProprietaContentType(String certificatoProprietaContentType) {
        this.certificatoProprietaContentType = certificatoProprietaContentType;
        return this;
    }

    public void setCertificatoProprietaContentType(String certificatoProprietaContentType) {
        this.certificatoProprietaContentType = certificatoProprietaContentType;
    }

    public String getAltromotivazionePerditaProprieta() {
        return altromotivazionePerditaProprieta;
    }

    public VeicoloProprieta altromotivazionePerditaProprieta(String altromotivazionePerditaProprieta) {
        this.altromotivazionePerditaProprieta = altromotivazionePerditaProprieta;
        return this;
    }

    public void setAltromotivazionePerditaProprieta(String altromotivazionePerditaProprieta) {
        this.altromotivazionePerditaProprieta = altromotivazionePerditaProprieta;
    }

    public LocalDate getDataperditaProprieta() {
        return dataperditaProprieta;
    }

    public VeicoloProprieta dataperditaProprieta(LocalDate dataperditaProprieta) {
        this.dataperditaProprieta = dataperditaProprieta;
        return this;
    }

    public void setDataperditaProprieta(LocalDate dataperditaProprieta) {
        this.dataperditaProprieta = dataperditaProprieta;
    }

    public MotivazioneperditaProprieta getMotivazioneperditaProprieta() {
        return motivazioneperditaProprieta;
    }

    public VeicoloProprieta motivazioneperditaProprieta(MotivazioneperditaProprieta motivazioneperditaProprieta) {
        this.motivazioneperditaProprieta = motivazioneperditaProprieta;
        return this;
    }

    public void setMotivazioneperditaProprieta(MotivazioneperditaProprieta motivazioneperditaProprieta) {
        this.motivazioneperditaProprieta = motivazioneperditaProprieta;
    }

    public Veicolo getVeicolo() {
        return veicolo;
    }

    public VeicoloProprieta veicolo(Veicolo veicolo) {
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
        VeicoloProprieta veicoloProprieta = (VeicoloProprieta) o;
        if (veicoloProprieta.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), veicoloProprieta.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "VeicoloProprieta{" +
            "id=" + getId() +
            ", dataImmatricolazione='" + getDataImmatricolazione() + "'" +
            ", dataAcquisto='" + getDataAcquisto() + "'" +
            ", regioneImmatricolazione='" + getRegioneImmatricolazione() + "'" +
            ", libretto='" + getLibretto() + "'" +
            ", librettoContentType='" + getLibrettoContentType() + "'" +
            ", certificatoProprieta='" + getCertificatoProprieta() + "'" +
            ", certificatoProprietaContentType='" + getCertificatoProprietaContentType() + "'" +
            ", altromotivazionePerditaProprieta='" + getAltromotivazionePerditaProprieta() + "'" +
            ", dataperditaProprieta='" + getDataperditaProprieta() + "'" +
            "}";
    }
}
