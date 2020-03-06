package it.cnr.si.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A Veicolo.
 */
@Entity
@Table(name = "veicolo")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Veicolo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
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
    @Column(name = "cilindrata", nullable = false)
    private String cilindrata;

    @NotNull
    @Column(name = "cv_kw", nullable = false)
    private String cvKw;

    @NotNull
    @Column(name = "km_percorsi", nullable = false)
    private Integer kmPercorsi;

    @NotNull
    @Column(name = "data_validazione", nullable = false, columnDefinition="DATE")
    private Instant dataValidazione;

    @NotNull
    @Column(name = "istituto", nullable = false)
    private String istituto;

    @NotNull
    @Column(name = "responsabile", nullable = false)
    private String responsabile;

    @NotNull
    @Column(name = "cdsuo", nullable = false)
    private String cdsuo;

    @Column(name = "deleted")
    private Boolean deleted;

    @Column(name = "deleted_note")
    private String deleted_note;

    @NotNull
    @Column(name = "etichetta", nullable = false)
    private String etichetta;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private TipologiaVeicolo tipologiaVeicolo;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private AlimentazioneVeicolo alimentazioneVeicolo;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private ClasseEmissioniVeicolo classeEmissioniVeicolo;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private UtilizzoBeneVeicolo utilizzoBeneVeicolo;

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

    public Veicolo targa(String targa) {
        this.targa = targa;
        return this;
    }

    public void setTarga(String targa) {
        this.targa = targa;
    }

    public String getMarca() {
        return marca;
    }

    public Veicolo marca(String marca) {
        this.marca = marca;
        return this;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModello() {
        return modello;
    }

    public Veicolo modello(String modello) {
        this.modello = modello;
        return this;
    }

    public void setModello(String modello) {
        this.modello = modello;
    }

    public String getCilindrata() {
        return cilindrata;
    }

    public Veicolo cilindrata(String cilindrata) {
        this.cilindrata = cilindrata;
        return this;
    }

    public void setCilindrata(String cilindrata) {
        this.cilindrata = cilindrata;
    }

    public String getCvKw() {
        return cvKw;
    }

    public Veicolo cvKw(String cvKw) {
        this.cvKw = cvKw;
        return this;
    }

    public void setCvKw(String cvKw) {
        this.cvKw = cvKw;
    }

    public Integer getKmPercorsi() {
        return kmPercorsi;
    }

    public Veicolo kmPercorsi(Integer kmPercorsi) {
        this.kmPercorsi = kmPercorsi;
        return this;
    }

    public void setKmPercorsi(Integer kmPercorsi) {
        this.kmPercorsi = kmPercorsi;
    }

    public Instant getDataValidazione() {
        return dataValidazione;
    }

    public Veicolo dataValidazione(Instant dataValidazione) {
        this.dataValidazione = dataValidazione;
        return this;
    }

    public void setDataValidazione(Instant dataValidazione) {
        this.dataValidazione = dataValidazione;
    }

    public String getIstituto() {
        return istituto;
    }

    public Veicolo istituto(String istituto) {
        this.istituto = istituto;
        return this;
    }

    public void setIstituto(String istituto) {
        this.istituto = istituto;
    }

    public String getResponsabile() {
        return responsabile;
    }

    public Veicolo responsabile(String responsabile) {
        this.responsabile = responsabile;
        return this;
    }

    public void setResponsabile(String responsabile) {
        this.responsabile = responsabile;
    }

    public String getCdsuo() {
        return cdsuo;
    }

    public Veicolo cdsuo(String cdsuo) {
        this.cdsuo = cdsuo;
        return this;
    }

    public void setCdsuo(String cdsuo) {
        this.cdsuo = cdsuo;
    }

    public Boolean isDeleted() {
        return deleted;
    }

    public Veicolo deleted(Boolean deleted) {
        this.deleted = deleted;
        return this;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public String getDeleted_note() {
        return deleted_note;
    }

    public Veicolo deleted_note(String deleted_note) {
        this.deleted_note = deleted_note;
        return this;
    }

    public void setDeleted_note(String deleted_note) {
        this.deleted_note = deleted_note;
    }

    public String getEtichetta() {
        return etichetta;
    }

    public Veicolo etichetta(String etichetta) {
        this.etichetta = etichetta;
        return this;
    }

    public void setEtichetta(String etichetta) {
        this.etichetta = etichetta;
    }

    public TipologiaVeicolo getTipologiaVeicolo() {
        return tipologiaVeicolo;
    }

    public Veicolo tipologiaVeicolo(TipologiaVeicolo tipologiaVeicolo) {
        this.tipologiaVeicolo = tipologiaVeicolo;
        return this;
    }

    public void setTipologiaVeicolo(TipologiaVeicolo tipologiaVeicolo) {
        this.tipologiaVeicolo = tipologiaVeicolo;
    }

    public AlimentazioneVeicolo getAlimentazioneVeicolo() {
        return alimentazioneVeicolo;
    }

    public Veicolo alimentazioneVeicolo(AlimentazioneVeicolo alimentazioneVeicolo) {
        this.alimentazioneVeicolo = alimentazioneVeicolo;
        return this;
    }

    public void setAlimentazioneVeicolo(AlimentazioneVeicolo alimentazioneVeicolo) {
        this.alimentazioneVeicolo = alimentazioneVeicolo;
    }

    public ClasseEmissioniVeicolo getClasseEmissioniVeicolo() {
        return classeEmissioniVeicolo;
    }

    public Veicolo classeEmissioniVeicolo(ClasseEmissioniVeicolo classeEmissioniVeicolo) {
        this.classeEmissioniVeicolo = classeEmissioniVeicolo;
        return this;
    }

    public void setClasseEmissioniVeicolo(ClasseEmissioniVeicolo classeEmissioniVeicolo) {
        this.classeEmissioniVeicolo = classeEmissioniVeicolo;
    }

    public UtilizzoBeneVeicolo getUtilizzoBeneVeicolo() {
        return utilizzoBeneVeicolo;
    }

    public Veicolo utilizzoBeneVeicolo(UtilizzoBeneVeicolo utilizzoBeneVeicolo) {
        this.utilizzoBeneVeicolo = utilizzoBeneVeicolo;
        return this;
    }

    public void setUtilizzoBeneVeicolo(UtilizzoBeneVeicolo utilizzoBeneVeicolo) {
        this.utilizzoBeneVeicolo = utilizzoBeneVeicolo;
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
        Veicolo veicolo = (Veicolo) o;
        if (veicolo.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), veicolo.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Veicolo{" +
            "id=" + getId() +
            ", targa='" + getTarga() + "'" +
            ", marca='" + getMarca() + "'" +
            ", modello='" + getModello() + "'" +
            ", cilindrata='" + getCilindrata() + "'" +
            ", cvKw='" + getCvKw() + "'" +
            ", kmPercorsi=" + getKmPercorsi() +
            ", dataValidazione='" + getDataValidazione() + "'" +
            ", istituto='" + getIstituto() + "'" +
            ", responsabile='" + getResponsabile() + "'" +
            ", cdsuo='" + getCdsuo() + "'" +
            ", deleted='" + isDeleted() + "'" +
            ", deleted_note='" + getDeleted_note() + "'" +
            ", etichetta='" + getEtichetta() + "'" +
            "}";
    }
}
