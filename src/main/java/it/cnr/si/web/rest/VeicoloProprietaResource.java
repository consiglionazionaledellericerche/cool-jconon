package it.cnr.si.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import it.cnr.ict.service.SiglaService;
import it.cnr.ict.service.dto.Vehicle;
import it.cnr.si.domain.*;
import it.cnr.si.repository.*;
import it.cnr.si.security.AuthoritiesConstants;
import it.cnr.si.security.SecurityUtils;
import it.cnr.si.web.rest.errors.BadRequestAlertException;
import it.cnr.si.web.rest.util.HeaderUtil;
import it.cnr.si.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import static ch.qos.logback.core.encoder.ByteArrayUtil.hexStringToByteArray;

/**
 * REST controller for managing VeicoloProprieta.
 */
@RestController
@RequestMapping("/api")
public class VeicoloProprietaResource {

    private static final String ENTITY_NAME = "veicoloProprieta";
    private final Logger log = LoggerFactory.getLogger(VeicoloProprietaResource.class);

    @Autowired
    private SiglaService siglaService;
    @Autowired
    private VeicoloRepository veicoloRepository;
    @Autowired
    private VeicoloNoleggioRepository veicoloNoleggioRepository;
    @Autowired
    private VeicoloProprietaRepository veicoloProprietaRepository;
    private String TARGA;

    private BolloResource bolloResource;
    private AssicurazioneVeicoloResource assicurazioneVeicoloResource;
    private ValidazioneResource validazioneResource;
    public VeicoloProprietaResource(BolloResource bolloResource, AssicurazioneVeicoloResource assicurazioneVeicoloResource,
                                    ValidazioneResource validazioneResource){
        this.bolloResource = bolloResource;
        this.assicurazioneVeicoloResource = assicurazioneVeicoloResource;
        this.validazioneResource = validazioneResource;
    }
    /**
     * POST  /veicolo-proprietas : Create a new veicoloProprieta.
     *
     * @param veicoloProprieta the veicoloProprieta to create
     * @return the ResponseEntity with status 201 (Created) and with body the new veicoloProprieta, or with status 400 (Bad Request) if the veicoloProprieta has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/veicolo-proprietas")
    @Timed
    public ResponseEntity<VeicoloProprieta> createVeicoloProprieta(@Valid @RequestBody VeicoloProprieta veicoloProprieta) throws URISyntaxException {
        log.debug("REST request to save VeicoloProprieta : {}", veicoloProprieta);
        if (veicoloProprieta.getId() != null) {
            throw new BadRequestAlertException("A new veicoloProprieta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String etichetta = siglaService.getVehicleInfoByPlate(veicoloProprieta.getVeicolo().getTarga()).map(
            Vehicle::getEtichetta
        ).orElse("");
        veicoloProprieta.setEtichetta(etichetta);
        VeicoloProprieta result = veicoloProprietaRepository.save(veicoloProprieta);
        byte[] Polizza = hexStringToByteArray("e04fd020ea3a6910a2d808002b30309d");;
        //Fare automatico inserimento di bollo e assicurazione
        //Bollo
        log.debug("inizio creazione bollo");
        Bollo bollo = new Bollo();
            bollo.setVeicolo(result.getVeicolo());
            bollo.setDataScadenza(Instant.now());
            bollo.setPagato(false);
            bolloResource.createBollo(bollo);
            log.debug("bollo {}",bollo);
        //Assicurazione
        log.debug("inizio creazione assicurazione");
        AssicurazioneVeicolo assicurazioneVeicolo = new AssicurazioneVeicolo();
            assicurazioneVeicolo.setVeicolo(result.getVeicolo());
            assicurazioneVeicolo.setDataScadenza(Instant.now());
            assicurazioneVeicolo.setDataInserimento(Instant.now());
            assicurazioneVeicolo.setCompagniaAssicurazione(" ");
            assicurazioneVeicolo.setNumeroPolizza(" ");
            assicurazioneVeicolo.setPolizza(Polizza);
            assicurazioneVeicolo.setPolizzaContentType("image/jpg");
            assicurazioneVeicoloResource.createAssicurazioneVeicolo(assicurazioneVeicolo);
            log.debug("assicurazioneVeicolo {}",assicurazioneVeicolo);
        //Inserisce validazione Direttore
        log.debug("Inserisce validazione Direttore");
        String datiVeicoloCompleto;
        datiVeicoloCompleto = datiVeicoloCompletoProprieta(result);
        Validazione validazione = new Validazione();
            validazione.setVeicolo(result.getVeicolo());
            validazione.setDescrizione("Inserito nuovo veicolo di Proprietà targa:"+datiVeicoloCompleto);
            validazione.setTipologiaStato("Inserito");
            validazione.setDataModifica(Instant.now());
            validazioneResource.createValidazione(validazione);
        log.debug("validazione {}",validazione);
        return ResponseEntity.created(new URI("/api/veicolo-proprietas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /veicolo-proprietas : Updates an existing veicoloProprieta.
     *
     * @param veicoloProprieta the veicoloProprieta to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated veicoloProprieta,
     * or with status 400 (Bad Request) if the veicoloProprieta is not valid,
     * or with status 500 (Internal Server Error) if the veicoloProprieta couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/veicolo-proprietas")
    @Timed
    public ResponseEntity<VeicoloProprieta> updateVeicoloProprieta(@Valid @RequestBody VeicoloProprieta veicoloProprieta) throws URISyntaxException {
        log.debug("REST request to update VeicoloProprieta : {}", veicoloProprieta);
        if (veicoloProprieta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        String sede = SecurityUtils.getCdS();

        if (!(SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.SUPERUSER, AuthoritiesConstants.ADMIN) ||
            veicoloProprieta.getVeicolo().getIstituto().startsWith(sede))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (veicoloProprieta.getEtichetta().equals("")) {
            String etichetta = siglaService.getVehicleInfoByPlate(veicoloProprieta.getVeicolo().getTarga()).map(
                Vehicle::getEtichetta
            ).orElse("");
            veicoloProprieta.setEtichetta(etichetta);
        }
        VeicoloProprieta result = veicoloProprietaRepository.save(veicoloProprieta);

        //Inserisce validazione Direttore
        log.debug("Inserisce validazione Direttore");
        String datiVeicoloCompleto;
        datiVeicoloCompleto = datiVeicoloCompletoProprieta(result);
        Validazione validazione = new Validazione();
        validazione.setVeicolo(result.getVeicolo());
        validazione.setDescrizione("Modifica effettuata in veicolo di Proprietà:"+datiVeicoloCompleto);
        validazione.setTipologiaStato("Modifica");
        validazione.setDataModifica(Instant.now());
        validazioneResource.createValidazione(validazione);
        log.debug("validazione {}",validazione);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, veicoloProprieta.getId().toString()))
            .body(result);
    }

    /**
     * GET  /veicolo-proprietas : get all the veicoloProprietas.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of veicoloProprietas in body
     */
    @GetMapping("/veicolo-proprietas")
    @Timed
    public ResponseEntity<List<VeicoloProprieta>> getAllVeicoloProprietas(Pageable pageable) {
        log.debug("REST request to get a page of VeicoloProprietas");
        String sede = SecurityUtils.getCdS();

        Page<VeicoloProprieta> page;
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.SUPERUSER, AuthoritiesConstants.ADMIN))
            page = veicoloProprietaRepository.findAllActive(false, pageable);
        else
            page = veicoloProprietaRepository.findByIstitutoStartsWithAndDeleted(sede.concat("%"), false, pageable);

        TARGA = "";
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/veicolo-proprietas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /veicolo-proprietas/:id : get the "id" veicoloProprieta.
     *
     * @param id the id of the veicoloProprieta to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the veicoloProprieta, or with status 404 (Not Found)
     */
    @GetMapping("/veicolo-proprietas/{id}")
    @Timed
    public ResponseEntity<VeicoloProprieta> getVeicoloProprieta(@PathVariable Long id) {
        log.debug("REST request to get VeicoloProprieta : {}", id);
        Optional<VeicoloProprieta> veicoloProprieta = veicoloProprietaRepository.findById(id);
        TARGA = veicoloProprietaRepository.findById(id).get().getVeicolo().getTarga();
        //findVeicolo(targa);
        return ResponseUtil.wrapOrNotFound(veicoloProprieta);
    }

    /**
     * DELETE  /veicolo-proprietas/:id : delete the "id" veicoloProprieta.
     *
     * @param id the id of the veicoloProprieta to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/veicolo-proprietas/{id}")
    @Timed
    public ResponseEntity<Void> deleteVeicoloProprieta(@PathVariable Long id) {
        log.debug("REST request to delete VeicoloProprieta : {}", id);
        final Optional<VeicoloProprieta> veicoloProprieta = veicoloProprietaRepository.findById(id);
        if (!veicoloProprieta.isPresent())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        String sede = SecurityUtils.getCdS();

        if (!(SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.SUPERUSER, AuthoritiesConstants.ADMIN) ||
            veicoloProprieta.get().getVeicolo().getIstituto().startsWith(sede))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        veicoloProprietaRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    //Per richiamare Veicoli
    @GetMapping("/veicolo-proprietas/findVeicolo")
    @Timed
    public ResponseEntity<List<Veicolo>> findVeicolo() {

        List<Veicolo> veicoliRimasti;

        List<Veicolo> veicoli;

        List<VeicoloProprieta> allVeicoliProprieta;

        List<VeicoloNoleggio> allVeicoliNoleggio;

        String sede = SecurityUtils.getCdS();

        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.SUPERUSER, AuthoritiesConstants.ADMIN)) {
            veicoliRimasti = veicoloRepository.findByDeletedFalse();
            veicoli = veicoloRepository.findByDeletedFalse();
        } else {
            veicoliRimasti = veicoloRepository.findByIstitutoStartsWithAndDeleted(sede.concat("%"), false);
            veicoli = veicoloRepository.findByIstitutoStartsWithAndDeleted(sede.concat("%"), false);
        }
        log.debug("Da tutti i veicoli: {}",veicoli);
        if (TARGA.equals("")){
            TARGA = null;
        }
        if (TARGA != null) {
            Iterator i = veicoli.iterator();
            while (i.hasNext()) {
                Object v = i.next();
                if (((Veicolo) v).getTarga().equals(TARGA)) {
                } else {
                    veicoliRimasti.remove(v);
                }
            }
        }else {
        allVeicoliProprieta = veicoloProprietaRepository.findAllActive(false);
            allVeicoliNoleggio = veicoloNoleggioRepository.findAllActive(false);
            Iterator i = veicoli.iterator();
            while (i.hasNext()) {
                Object v = i.next();
                Iterator iavp = allVeicoliProprieta.iterator();
                Iterator iavn = allVeicoliNoleggio.iterator();
                while (iavp.hasNext()) {
                    Object vp = iavp.next();
                    if (((VeicoloProprieta) vp).getVeicolo().getTarga().equals(((Veicolo) v).getTarga())) {
                        veicoliRimasti.remove(v);
                    }
                }
                while (iavn.hasNext()) {
                    Object vn = iavn.next();
                    if (((VeicoloNoleggio) vn).getVeicolo().getTarga().equals(((Veicolo) v).getTarga())) {
                        veicoliRimasti.remove(v);
                    }
                }

            }
        }

        return ResponseEntity.ok(veicoliRimasti);
    }

    public String datiVeicoloCompletoProprieta(VeicoloProprieta veicoloProprieta){
        String dati;
        //Veicolo
        dati = "Targa: "+veicoloProprieta.getVeicolo().getTarga()
            +"Marca: "+veicoloProprieta.getVeicolo().getMarca()
            +"Modello: "+veicoloProprieta.getVeicolo().getModello()
            +"Cilindrata: "+veicoloProprieta.getVeicolo().getCilindrata()
            +"CV KW: "+veicoloProprieta.getVeicolo().getCvKw()
            +"Km Percorsi: "+veicoloProprieta.getVeicolo().getKmPercorsi().toString()
            +"Istituto: "+veicoloProprieta.getVeicolo().getIstituto()
            +"CDSUO: "+veicoloProprieta.getVeicolo().getCdsuo()
            +"Responsabile: "+veicoloProprieta.getVeicolo().getResponsabile()
            +"Tipologia Veicolo: "+veicoloProprieta.getVeicolo().getTipologiaVeicolo().getNome()
            +"Alimentazione Veicolo: "+veicoloProprieta.getVeicolo().getAlimentazioneVeicolo().getNome()
            +"Classe Emissione Veicolo: "+veicoloProprieta.getVeicolo().getClasseEmissioniVeicolo().getNome()
            +"Utilizzo Bene Veicolo: "+veicoloProprieta.getVeicolo().getUtilizzoBeneVeicolo().getNome();
        //VeicoloNoleggio
        dati = dati+"Data Immatricolazione: "+veicoloProprieta.getDataImmatricolazione().toString()
            +"Data Acquisto: "+veicoloProprieta.getDataAcquisto().toString()
            +"Regione Immatricolazione: "+veicoloProprieta.getRegioneImmatricolazione();

            String dataPerditaProprieta;
            String motivazionePerdita;
            String altraMotivazionePerdita;
            String etichetta;

            if (veicoloProprieta.getEtichetta() == null){
                etichetta = "";
            }
            else{
                etichetta = veicoloProprieta.getEtichetta();
            }
            if (veicoloProprieta.getDataPerditaProprieta() == null){
                dataPerditaProprieta = "";
            }
            else{
                dataPerditaProprieta = veicoloProprieta.getDataPerditaProprieta().toString();
            }

            if (veicoloProprieta.getMotivazionePerditaProprieta() == null){
                motivazionePerdita = "";
            }
            else{
                motivazionePerdita = veicoloProprieta.getMotivazionePerditaProprieta().toString();
            }
            if (veicoloProprieta.getAltraMotivazionePerditaProprieta() == null){
                altraMotivazionePerdita = "";
            }
            else{
                altraMotivazionePerdita = veicoloProprieta.getAltraMotivazionePerditaProprieta();
            }

            dati = dati+"Etichetta: "+etichetta
            +"Data Perdita Proprietà: "+dataPerditaProprieta
            +"Motivazione Perdita Proprietà: "+motivazionePerdita
            +"Altra Motivazione Perdita Proprietà: "+altraMotivazionePerdita;
        return dati;
    }
}
