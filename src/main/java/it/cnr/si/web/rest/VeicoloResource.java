package it.cnr.si.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import it.cnr.ict.service.SiglaService;
import it.cnr.ict.service.dto.Vehicle;
import it.cnr.si.domain.*;
import it.cnr.si.repository.*;
import it.cnr.si.security.AuthoritiesConstants;
import it.cnr.si.security.SecurityUtils;
import it.cnr.si.service.AceService;
import it.cnr.si.service.CacheService;
import it.cnr.si.service.dto.anagrafica.base.PageDto;
import it.cnr.si.service.dto.anagrafica.letture.EntitaOrganizzativaWebDto;
import it.cnr.si.service.dto.anagrafica.letture.PersonaWebDto;
import it.cnr.si.service.dto.anagrafica.scritture.UtenteDto;
import it.cnr.si.web.rest.errors.BadRequestAlertException;
import it.cnr.si.web.rest.util.HeaderUtil;
import it.cnr.si.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;


/**
 * REST controller for managing Veicolo.
 */
@RestController
@RequestMapping("/api")
public class VeicoloResource {

    @Autowired
    private SiglaService siglaService;

    private static final String ENTITY_NAME = "veicolo";
    private final AceService ace;
    private final CacheService cacheService;

    private final Logger log = LoggerFactory.getLogger(VeicoloResource.class);
    private final VeicoloRepository veicoloRepository;
    private VeicoloProprietaRepository veicoloProprietaRepository;
    private VeicoloNoleggioRepository veicoloNoleggioRepository;
    private BolloRepository bolloRepository;
    private AssicurazioneVeicoloRepository assicurazioneVeicoloRepository;

    public VeicoloResource(VeicoloRepository veicoloRepository, AceService ace, CacheService cacheService,
                           VeicoloProprietaRepository veicoloProprietaRepository, VeicoloNoleggioRepository veicoloNoleggioRepository,
                           BolloRepository bolloRepository, AssicurazioneVeicoloRepository assicurazioneVeicoloRepository) {
        this.veicoloRepository = veicoloRepository;
        this.ace = ace;
        this.cacheService = cacheService;
        this.veicoloProprietaRepository = veicoloProprietaRepository;
        this.veicoloNoleggioRepository = veicoloNoleggioRepository;
        this.bolloRepository = bolloRepository;
        this.assicurazioneVeicoloRepository = assicurazioneVeicoloRepository;
    }

    /**
     * POST  /veicolos : Create a new veicolo.
     *
     * @param veicolo the veicolo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new veicolo, or with status 400 (Bad Request) if the veicolo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/veicolos")
    @Timed
    public ResponseEntity<Veicolo> createVeicolo(@Valid @RequestBody Veicolo veicolo) throws URISyntaxException {
        log.debug("REST request to save Veicolo : {}", veicolo);
        if (veicolo.getId() != null) {
            throw new BadRequestAlertException("A new veicolo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Veicolo result = veicoloRepository.save(veicolo);
        //funzione che crea validazione
        Validazione validazione = new Validazione();
        validazione.setTipologiaStato("Creazione");
        validazione.setDataModifica(LocalDate.now());
        validazione.setDescrizione("Inserita nuova auto");
        validazione.setVeicolo(result);
        //Fine funzione
        return ResponseEntity.created(new URI("/api/veicolos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /veicolos : Updates an existing veicolo.
     *
     * @param veicolo the veicolo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated veicolo,
     * or with status 400 (Bad Request) if the veicolo is not valid,
     * or with status 500 (Internal Server Error) if the veicolo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/veicolos")
    @Timed
    public ResponseEntity<Veicolo> updateVeicolo(@Valid @RequestBody Veicolo veicolo) throws URISyntaxException {
        log.debug("REST request to update Veicolo : {}", veicolo);
        if (veicolo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        String sede = SecurityUtils.getCdS();
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.SUPERUSER, AuthoritiesConstants.ADMIN) &&
            !veicolo.getIstituto().startsWith(sede)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Veicolo result = veicoloRepository.save(veicolo);
        //funzione che crea validazione
        Validazione validazione = new Validazione();
        validazione.setTipologiaStato("Creazione");
        validazione.setDataModifica(LocalDate.now());
        validazione.setDescrizione("Inserita nuova auto");
        validazione.setVeicolo(result);
        //Fine funzione
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, veicolo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /veicolos : get all the veicolos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of veicolos in body
     */
    @GetMapping("/veicolos")
    @Timed
    public ResponseEntity<List<Veicolo>> getAllVeicolos(Pageable pageable) {
        log.debug("REST request to get a page of Veicolos");

        String sede = SecurityUtils.getCdS();

        Page<Veicolo> veicoli;
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.SUPERUSER, AuthoritiesConstants.ADMIN)) {
            veicoli = veicoloRepository.findByDeletedFalse(pageable);
        } else {
            veicoli = veicoloRepository.findByIstitutoStartsWithAndDeleted(sede.concat("%"), false, pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(veicoli, "/api/veicolos");
        return new ResponseEntity<>(veicoli.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /veicolos/:id : get the "id" veicolo.
     *
     * @param id the id of the veicolo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the veicolo, or with status 404 (Not Found)
     */
    @GetMapping("/veicolos/{id}")
    @Timed
    public ResponseEntity<Veicolo> getVeicolo(@PathVariable Long id) {
        log.debug("REST request to get Veicolo : {}", id);

        Optional<Veicolo> veicolo = veicoloRepository.findById(id);
        if (!veicolo.isPresent())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        String sede = SecurityUtils.getCdS();
        if (!(SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.SUPERUSER, AuthoritiesConstants.ADMIN) ||
            veicolo.get().getIstituto().startsWith(sede))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseUtil.wrapOrNotFound(veicolo);
    }

    /**
     * DELETE  /veicolos/:id : delete the "id" veicolo.
     *
     * @param id the id of the veicolo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/veicolos/{id}")
    @Timed
    public ResponseEntity<Void> deleteVeicolo(@PathVariable Long id) {
        log.debug("REST request to delete Veicolo : {}", id);
        Optional<Veicolo> veicolo = veicoloRepository.findById(id);
        if (!veicolo.isPresent())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        String sede = SecurityUtils.getCdS();
        if (!(SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.SUPERUSER, AuthoritiesConstants.ADMIN) || veicolo.get().getIstituto().startsWith(sede))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Veicolo vei = veicolo.get();
        vei.setDeleted(true);
        vei.setDeleted_note("USER = " + SecurityUtils.getCurrentUserLogin() + " DATA = " + LocalDateTime.now());
        veicoloRepository.save(vei);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    //Per richiamare utenze ACE
    @GetMapping("/veicolos/findUtenza/{term}")
    @Timed
    public ResponseEntity<List<String>> findPersona(@PathVariable String term) {
        return ResponseEntity.ok(
            ace.searchUtenti(
                Stream.of(
                    new AbstractMap.SimpleEntry<>("page", "0"),
                    new AbstractMap.SimpleEntry<>("offset", "20"),
                    new AbstractMap.SimpleEntry<>("username", term)
                ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
            )
                .getItems()
                .stream()
                .filter(utenteDto -> Optional.ofNullable(utenteDto.getUsername()).isPresent())
                .map(UtenteDto::getUsername)
                .collect(Collectors.toList()));
    }

    //Per richiamare istituti ACE
    @GetMapping("/veicolos/getIstituti")
    @Timed
    public ResponseEntity<List<EntitaOrganizzativaWebDto>> findIstituto() {

        String sede = SecurityUtils.getCdS();

        return ResponseEntity.ok(cacheService.getSediDiLavoro()
            .stream()
            .filter(entitaOrganizzativa -> Optional.ofNullable(entitaOrganizzativa.getCdsuo()).isPresent())
            .filter(entitaOrganizzativaWebDto -> {
                if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.SUPERUSER, AuthoritiesConstants.ADMIN)) {
                    return true;
                } else {
                    return entitaOrganizzativaWebDto.getCdsuo().startsWith(sede);
                }
            })
            .sorted((i1, i2) -> i1.getCdsuo().compareTo(i2.getCdsuo()))
            .map(i -> {
                i.setDenominazione(i.getDenominazione().toUpperCase());
                return i;
            })
            .collect(Collectors.toList()));
    }


    //Per Proprietà veicoli to Json
    @GetMapping("/veicolos/getAllVeicoli")
    @Timed
    public List<ReportVeicolo> allVeicoli() throws JSONException {

        List<Veicolo> veicoliAll = veicoloRepository.findAll();
        List<VeicoloProprieta> veicoloProprieta = veicoloProprietaRepository.findAll();
        List<Bollo> lBollo = bolloRepository.findAll();
        List<AssicurazioneVeicolo> lAssicurazioneVeicolo = assicurazioneVeicoloRepository.findAll();
        List<VeicoloNoleggio> veicoloNoleggio = veicoloNoleggioRepository.findAll();

        //per inserimento ReportVeicolo
        List<ReportVeicolo> reportVeicolo = new Vector<>();
        ReportVeicolo rVeicolo;

        Iterator itr = veicoliAll.iterator();
        String jsonString = null;
        while(itr.hasNext()) {
            Veicolo v = (Veicolo) itr.next();
            rVeicolo = new ReportVeicolo();
            rVeicolo.setTarga(v.getTarga());
            rVeicolo.setIstituto(v.getIstituto());
            rVeicolo.setResponsabile(v.getResponsabile());

            Iterator itVP = veicoloProprieta.iterator();
            while (itVP.hasNext()){
                VeicoloProprieta vPro = (VeicoloProprieta) itVP.next();
                //Cerca Targa
                if(vPro.getVeicolo().getTarga().equals(v.getTarga())){
                    rVeicolo.setTipoProprieta("Proprietà");
                    //Bollo
                    Iterator itBollo = lBollo.iterator();
                    while (itBollo.hasNext()){
                        Bollo b = (Bollo) itBollo.next();
                        if(b.getVeicolo().getTarga().equals(v.getTarga())) {
                            if (b.getVisionatoBollo() == null){
                                rVeicolo.setBollo("No");
                            }
                            else {
                                rVeicolo.setBollo(b.getVisionatoBollo().toString());
                            }

                        }
                            ///prendere l'ultimo valore di bollo
                    }
                    //assicurazioneVeicolo
                    Iterator itAssicurazione = lAssicurazioneVeicolo.iterator();
                    while (itAssicurazione.hasNext()){
                        AssicurazioneVeicolo assVeicolo = (AssicurazioneVeicolo) itAssicurazione.next();
                        if(assVeicolo.getVeicolo().getTarga().equals(v.getTarga())) {
                            if (assVeicolo.getNumeroPolizza() == null){
                                rVeicolo.setAssicurazione("No");
                            }
                            else {
                                rVeicolo.setAssicurazione(assVeicolo.getNumeroPolizza());
                            }
                        }
                        ///prendere l'ultimo valore di assicurazione
                    }
                }
            }
            Iterator itVN = veicoloNoleggio.iterator();
            while (itVN.hasNext()){
                VeicoloNoleggio vNol = (VeicoloNoleggio) itVN.next();
                //Cerca Targa
                if(vNol.getVeicolo().getTarga().equals(v.getTarga())) {
                    rVeicolo.setTipoProprieta("Noleggio");
                }
            }
        reportVeicolo.add(rVeicolo);
        }
        return reportVeicolo;
    }
}
