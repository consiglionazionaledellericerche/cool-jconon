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
    private Integer cilindrata;

    @NotNull
    @Column(name = "cv_kw", nullable = false)
    private String cvKw;

    @NotNull
    @Column(name = "km", nullable = false)
    private Integer km;

    @NotNull
    @Column(name = "data_validazione", nullable = false)
    private Instant dataValidazione;

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
    private ClasseemissioniVeicolo classeemissioniVeicolo;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private UtilizzobeneVeicolo utilizzobeneVeicolo;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private Istituto istituto;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private Utenza responsabile;

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

    public Integer getCilindrata() {
        return cilindrata;
    }

    public Veicolo cilindrata(Integer cilindrata) {
        this.cilindrata = cilindrata;
        return this;
    }

    public void setCilindrata(Integer cilindrata) {
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

    public Integer getKm() {
        return km;
    }

    public Veicolo km(Integer km) {
        this.km = km;
        return this;
    }

    public void setKm(Integer km) {
        this.km = km;
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

    public ClasseemissioniVeicolo getClasseemissioniVeicolo() {
        return classeemissioniVeicolo;
    }

    public Veicolo classeemissioniVeicolo(ClasseemissioniVeicolo classeemissioniVeicolo) {
        this.classeemissioniVeicolo = classeemissioniVeicolo;
        return this;
    }

    public void setClasseemissioniVeicolo(ClasseemissioniVeicolo classeemissioniVeicolo) {
        this.classeemissioniVeicolo = classeemissioniVeicolo;
    }

    public UtilizzobeneVeicolo getUtilizzobeneVeicolo() {
        return utilizzobeneVeicolo;
    }

    public Veicolo utilizzobeneVeicolo(UtilizzobeneVeicolo utilizzobeneVeicolo) {
        this.utilizzobeneVeicolo = utilizzobeneVeicolo;
        return this;
    }

    public void setUtilizzobeneVeicolo(UtilizzobeneVeicolo utilizzobeneVeicolo) {
        this.utilizzobeneVeicolo = utilizzobeneVeicolo;
    }

    public Istituto getIstituto() {
        return istituto;
    }

    public Veicolo istituto(Istituto istituto) {
        this.istituto = istituto;
        return this;
    }

    public void setIstituto(Istituto istituto) {
        this.istituto = istituto;
    }

    public Utenza getResponsabile() {
        return responsabile;
    }

    public Veicolo responsabile(Utenza utenza) {
        this.responsabile = utenza;
        return this;
    }

    public void setResponsabile(Utenza utenza) {
        this.responsabile = utenza;
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
            ", cilindrata=" + getCilindrata() +
            ", cvKw='" + getCvKw() + "'" +
            ", km=" + getKm() +
            ", dataValidazione='" + getDataValidazione() + "'" +
            "}";
    }
}
