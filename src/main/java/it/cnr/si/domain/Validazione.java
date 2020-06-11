package it.cnr.si.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A Validazione.
 */
@Entity
@Table(name = "validazione")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Validazione implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "tipologia_stato", nullable = false)
    private String tipologiaStato;

    @NotNull
    @Column(name = "data_modifica", nullable = false)
    private LocalDate dataModifica;

    @Column(name = "data_validazione_direttore")
    private ZonedDateTime dataValidazioneDirettore;

    @Column(name = "user_direttore")
    private String userDirettore;

    @Column(name = "ip_validazione")
    private String ipValidazione;

    @Lob
    @Column(name = "documento_firmato")
    private byte[] documentoFirmato;

    @Column(name = "documento_firmato_content_type")
    private String documentoFirmatoContentType;

    @Column(name = "note")
    private String note;

    @Column(name = "id_flusso")
    private String idFlusso;

    @Column(name = "descrizione")
    private String descrizione;

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

    public String getTipologiaStato() {
        return tipologiaStato;
    }

    public Validazione tipologiaStato(String tipologiaStato) {
        this.tipologiaStato = tipologiaStato;
        return this;
    }

    public void setTipologiaStato(String tipologiaStato) {
        this.tipologiaStato = tipologiaStato;
    }

    public LocalDate getDataModifica() {
        return dataModifica;
    }

    public Validazione dataModifica(LocalDate dataModifica) {
        this.dataModifica = dataModifica;
        return this;
    }

    public void setDataModifica(LocalDate dataModifica) {
        this.dataModifica = dataModifica;
    }

    public ZonedDateTime getDataValidazioneDirettore() {
        return dataValidazioneDirettore;
    }

    public Validazione dataValidazioneDirettore(ZonedDateTime dataValidazioneDirettore) {
        this.dataValidazioneDirettore = dataValidazioneDirettore;
        return this;
    }

    public void setDataValidazioneDirettore(ZonedDateTime dataValidazioneDirettore) {
        this.dataValidazioneDirettore = dataValidazioneDirettore;
    }

    public String getUserDirettore() {
        return userDirettore;
    }

    public Validazione userDirettore(String userDirettore) {
        this.userDirettore = userDirettore;
        return this;
    }

    public void setUserDirettore(String userDirettore) {
        this.userDirettore = userDirettore;
    }

    public String getIpValidazione() {
        return ipValidazione;
    }

    public Validazione ipValidazione(String ipValidazione) {
        this.ipValidazione = ipValidazione;
        return this;
    }

    public void setIpValidazione(String ipValidazione) {
        this.ipValidazione = ipValidazione;
    }

    public byte[] getDocumentoFirmato() {
        return documentoFirmato;
    }

    public Validazione documentoFirmato(byte[] documentoFirmato) {
        this.documentoFirmato = documentoFirmato;
        return this;
    }

    public void setDocumentoFirmato(byte[] documentoFirmato) {
        this.documentoFirmato = documentoFirmato;
    }

    public String getDocumentoFirmatoContentType() {
        return documentoFirmatoContentType;
    }

    public Validazione documentoFirmatoContentType(String documentoFirmatoContentType) {
        this.documentoFirmatoContentType = documentoFirmatoContentType;
        return this;
    }

    public void setDocumentoFirmatoContentType(String documentoFirmatoContentType) {
        this.documentoFirmatoContentType = documentoFirmatoContentType;
    }

    public String getNote() {
        return note;
    }

    public Validazione note(String note) {
        this.note = note;
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getIdFlusso() {
        return idFlusso;
    }

    public Validazione idFlusso(String idFlusso) {
        this.idFlusso = idFlusso;
        return this;
    }

    public void setIdFlusso(String idFlusso) {
        this.idFlusso = idFlusso;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public Validazione descrizione(String descrizione) {
        this.descrizione = descrizione;
        return this;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public Veicolo getVeicolo() {
        return veicolo;
    }

    public Validazione veicolo(Veicolo veicolo) {
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
        Validazione validazione = (Validazione) o;
        if (validazione.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), validazione.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Validazione{" +
            "id=" + getId() +
            ", tipologiaStato='" + getTipologiaStato() + "'" +
            ", dataModifica='" + getDataModifica() + "'" +
            ", dataValidazioneDirettore='" + getDataValidazioneDirettore() + "'" +
            ", userDirettore='" + getUserDirettore() + "'" +
            ", ipValidazione='" + getIpValidazione() + "'" +
            ", documentoFirmato='" + getDocumentoFirmato() + "'" +
            ", documentoFirmatoContentType='" + getDocumentoFirmatoContentType() + "'" +
            ", note='" + getNote() + "'" +
            ", idFlusso='" + getIdFlusso() + "'" +
            ", descrizione='" + getDescrizione() + "'" +
            "}";
    }
}
