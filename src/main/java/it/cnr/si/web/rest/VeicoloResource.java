package it.cnr.si.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Response;
import io.github.jhipster.web.util.ResponseUtil;
import it.cnr.ict.service.SiglaService;
import it.cnr.si.domain.*;
import it.cnr.si.repository.*;
import it.cnr.si.security.AuthoritiesConstants;
import it.cnr.si.security.SecurityUtils;
import it.cnr.si.service.AceService;
import it.cnr.si.service.CacheService;
import it.cnr.si.service.dto.PrintRequestBody;
import it.cnr.si.service.dto.VeicoloDetailPrintDto;
import it.cnr.si.service.dto.VeicoloPrintDto;
import it.cnr.si.service.dto.anagrafica.letture.EntitaOrganizzativaWebDto;
import it.cnr.si.service.dto.anagrafica.scritture.UtenteDto;
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
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;


/**
 * REST controller for managing Veicolo.
 */
@RestController
@RequestMapping("/api")
public class VeicoloResource {

    private static final String ENTITY_NAME = "veicolo";
    private final AceService ace;
    private final CacheService cacheService;
    private final Logger log = LoggerFactory.getLogger(VeicoloResource.class);
    private final VeicoloRepository veicoloRepository;
    @Autowired
    private SiglaService siglaService;
    private final VeicoloProprietaRepository veicoloProprietaRepository;
    private final VeicoloNoleggioRepository veicoloNoleggioRepository;
    private final BolloRepository bolloRepository;
    private final AssicurazioneVeicoloRepository assicurazioneVeicoloRepository;
    private final Print print;

    public VeicoloResource(VeicoloRepository veicoloRepository, AceService ace, CacheService cacheService,
                           VeicoloProprietaRepository veicoloProprietaRepository, VeicoloNoleggioRepository veicoloNoleggioRepository,
                           BolloRepository bolloRepository, AssicurazioneVeicoloRepository assicurazioneVeicoloRepository, Print print) {
        this.veicoloRepository = veicoloRepository;
        this.ace = ace;
        this.cacheService = cacheService;
        this.veicoloProprietaRepository = veicoloProprietaRepository;
        this.veicoloNoleggioRepository = veicoloNoleggioRepository;
        this.bolloRepository = bolloRepository;
        this.assicurazioneVeicoloRepository = assicurazioneVeicoloRepository;
        this.print = print;
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
        //allVeicoli();throws JSONException
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

    @GetMapping("/veicolos/getAllVeicoli")
    @Timed
    public ResponseEntity<Map<String, Object>> allVeicoli() throws IOException {
        List<Veicolo> veicoliAll = veicoloRepository.findAll();
        DateTimeFormatter formatter =
            DateTimeFormatter
                .ofPattern("dd/MM/yyyy")
                .withLocale( Locale.ITALIAN )
                .withZone( ZoneId.systemDefault());
        VeicoloPrintDto veicoloPrintDto = new VeicoloPrintDto();
        veicoloPrintDto.setAnno(String.valueOf(LocalDate.now().getYear()));
        veicoloPrintDto.setVeicolos(
            veicoliAll.stream()
                .map(veicolo -> {
                    final Optional<VeicoloProprieta> veicoloProprietaOptional = veicoloProprietaRepository.findByVeicolo(veicolo);
                    final Optional<Bollo> bolloOptional = bolloRepository.findByVeicolo(veicolo);
                    final Optional<AssicurazioneVeicolo> assicurazioneVeicoloOptional = assicurazioneVeicoloRepository.findByVeicolo(veicolo);

                    final Optional<VeicoloNoleggio> veicoloNoleggioOptional = veicoloNoleggioRepository.findByVeicolo(veicolo);

                    return new VeicoloDetailPrintDto()
                        .setTarga(veicolo.getTarga())
                        .setIstituto(veicolo.getIstituto().concat(" - ").concat(veicolo.getCdsuo()))
                        .setResponsabile(veicolo.getResponsabile())
                        .setTipoProprieta(veicoloProprietaOptional.map(
                            veicoloProprieta -> {
                                return veicoloProprieta.getEtichetta() + " - " + veicoloProprieta.getRegioneImmatricolazione();
                            }
                        ).orElse(""))
                        .setBollo(bolloOptional.map(bollo -> {
                            return formatter.format(bollo.getDataScadenza());
                        }).orElse(""))
                        .setAssicurazione(assicurazioneVeicoloOptional.map(
                            assicurazioneVeicolo -> {
                                return "Compagnia:" + assicurazioneVeicolo.getCompagniaAssicurazione() + " Numero Polizza: " + assicurazioneVeicolo.getNumeroPolizza() + " Scadenza:" + formatter.format(assicurazioneVeicolo.getDataScadenza());
                            }
                        ).orElse(""))
                        .setNoleggio(veicoloNoleggioOptional.map(
                            veicoloNoleggio -> {
                                return "Società:" + veicoloNoleggio.getSocieta() + " Data Inizio:" + formatter.format(veicoloNoleggio.getDataInizioNoleggio()) + " Data Fine: " + formatter.format(veicoloNoleggio.getDataFineNoleggio());
                            }
                        ).orElse(""));
                }).collect(Collectors.toList())
        );
        ObjectMapper mapper = new ObjectMapper();
        final String jsonString = mapper.writeValueAsString(veicoloPrintDto);
        log.info(jsonString);
        final Response execute = print.execute(PrintRequestBody.create("/parcoauto/report_veicoli.jrxml", "Veicoli.pdf", jsonString));
        String encoded = Base64.getEncoder().encodeToString(StreamUtils.copyToByteArray(execute.body().asInputStream()));
        return new ResponseEntity<>(Collections.singletonMap("b64", encoded), HttpStatus.OK);
    }
}
