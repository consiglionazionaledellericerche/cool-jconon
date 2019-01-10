package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import it.cnr.si.service.AceService;
import it.cnr.si.service.dto.anagrafica.base.PageDto;
import it.cnr.si.service.dto.anagrafica.letture.EntitaLocaleWebDto;
import it.cnr.si.service.dto.anagrafica.letture.PersonaWebDto;
import it.cnr.si.service.dto.anagrafica.letture.EntitaOrganizzativaWebDto;
import org.springframework.beans.factory.annotation.Autowired;
import si.cnr.it.domain.Veicolo;
import si.cnr.it.repository.VeicoloRepository;
import si.cnr.it.web.rest.errors.BadRequestAlertException;
import si.cnr.it.web.rest.util.HeaderUtil;
import si.cnr.it.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.*;


/**
 * REST controller for managing Veicolo.
 */
@RestController
@RequestMapping("/api")
public class VeicoloResource {

    @Autowired
    private AceService ace;

    private final Logger log = LoggerFactory.getLogger(VeicoloResource.class);

    private static final String ENTITY_NAME = "veicolo";

    private final VeicoloRepository veicoloRepository;

    public VeicoloResource(VeicoloRepository veicoloRepository) {
        this.veicoloRepository = veicoloRepository;
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
        Veicolo result = veicoloRepository.save(veicolo);
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
        Page<Veicolo> page = veicoloRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/veicolos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
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

        veicoloRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    //Per richiamare utenze ACE
    @GetMapping("/veicolos/findUtenza/{term}")
    @Timed
    public ResponseEntity<List<String>> findPersona(@PathVariable String term) {

        List<String> result = new ArrayList<>();

        Map<String, String> query = new HashMap<>();
        query.put("term", term);
        PageDto<PersonaWebDto> persone = ace.getPersone(query);
        List<PersonaWebDto> listaPersone = persone.getItems();

        for (PersonaWebDto persona : listaPersone ) {
            if ( persona.getUsername() != null)
                result.add(  persona.getUsername()  );
        }
//
//        listaPersone.stream()
//            .forEach(persona -> result.add(  persona.getUsername()  )  );
//
//
//
//        result = listaPersone.stream()
//            .filter( persona -> persona.getUsername() != null )
//            .map(persona -> persona.getUsername())
//            .collect(Collectors.toList()    );



        return ResponseEntity.ok(result);
    }

 /**   //Per richiamare istituti ACE
    @GetMapping("/veicolos/findIstituto/{term}")
    @Timed
    public ResponseEntity<List<String>> findIstituto(@PathVariable String term) {

        List<String> result = new ArrayList<>();

        EntitaOrganizzativaWebDto EntOrgWebDTO = new EntitaOrganizzativaWebDto();

        Map<String, String> query = new HashMap<>();
        query.put("term", term);
        PageDto<List> istituti = EntOrgWebDTO.getDenominazione(query);
        List listaIstituti = istituti.getItems();

        for (istituto : listaIstituti) {
            //if ( istituto.getCdsuo() != null)
                result.add(  istituto.getCdsuo()  );
        }
//
//        listaPersone.stream()
//            .forEach(persona -> result.add(  persona.getUsername()  )  );
//
//
//
//        result = listaPersone.stream()
//            .filter( persona -> persona.getUsername() != null )
//            .map(persona -> persona.getUsername())
//            .collect(Collectors.toList()    );



        return ResponseEntity.ok(result);
    }*/
}
