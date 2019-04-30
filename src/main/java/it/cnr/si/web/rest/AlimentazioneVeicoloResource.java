package it.cnr.si.web.rest;

import com.codahale.metrics.annotation.Timed;
import it.cnr.si.domain.AlimentazioneVeicolo;
import it.cnr.si.web.rest.errors.BadRequestAlertException;
import it.cnr.si.web.rest.util.HeaderUtil;
import it.cnr.si.web.rest.util.PaginationUtil;
import org.springframework.security.access.annotation.Secured;
import it.cnr.si.repository.AlimentazioneVeicoloRepository;
import it.cnr.si.security.AuthoritiesConstants;
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

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing AlimentazioneVeicolo.
 */
@RestController
@RequestMapping("/api")
public class AlimentazioneVeicoloResource {

    private final Logger log = LoggerFactory.getLogger(AlimentazioneVeicoloResource.class);

    private static final String ENTITY_NAME = "alimentazioneVeicolo";

    private final AlimentazioneVeicoloRepository alimentazioneVeicoloRepository;

    public AlimentazioneVeicoloResource(AlimentazioneVeicoloRepository alimentazioneVeicoloRepository) {
        this.alimentazioneVeicoloRepository = alimentazioneVeicoloRepository;
    }

    /**
     * POST  /alimentazione-veicolos : Create a new alimentazioneVeicolo.
     *
     * @param alimentazioneVeicolo the alimentazioneVeicolo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new alimentazioneVeicolo, or with status 400 (Bad Request) if the alimentazioneVeicolo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/alimentazione-veicolos")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<AlimentazioneVeicolo> createAlimentazioneVeicolo(@Valid @RequestBody AlimentazioneVeicolo alimentazioneVeicolo) throws URISyntaxException {
        log.debug("REST request to save AlimentazioneVeicolo : {}", alimentazioneVeicolo);
        if (alimentazioneVeicolo.getId() != null) {
            throw new BadRequestAlertException("A new alimentazioneVeicolo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AlimentazioneVeicolo result = alimentazioneVeicoloRepository.save(alimentazioneVeicolo);
        return ResponseEntity.created(new URI("/api/alimentazione-veicolos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /alimentazione-veicolos : Updates an existing alimentazioneVeicolo.
     *
     * @param alimentazioneVeicolo the alimentazioneVeicolo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated alimentazioneVeicolo,
     * or with status 400 (Bad Request) if the alimentazioneVeicolo is not valid,
     * or with status 500 (Internal Server Error) if the alimentazioneVeicolo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/alimentazione-veicolos")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<AlimentazioneVeicolo> updateAlimentazioneVeicolo(@Valid @RequestBody AlimentazioneVeicolo alimentazioneVeicolo) throws URISyntaxException {
        log.debug("REST request to update AlimentazioneVeicolo : {}", alimentazioneVeicolo);
        if (alimentazioneVeicolo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        AlimentazioneVeicolo result = alimentazioneVeicoloRepository.save(alimentazioneVeicolo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, alimentazioneVeicolo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /alimentazione-veicolos : get all the alimentazioneVeicolos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of alimentazioneVeicolos in body
     */
    @GetMapping("/alimentazione-veicolos")
    @Timed
    public ResponseEntity<List<AlimentazioneVeicolo>> getAllAlimentazioneVeicolos(Pageable pageable) {
        log.debug("REST request to get a page of AlimentazioneVeicolos");
        Page<AlimentazioneVeicolo> page = alimentazioneVeicoloRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/alimentazione-veicolos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /alimentazione-veicolos/:id : get the "id" alimentazioneVeicolo.
     *
     * @param id the id of the alimentazioneVeicolo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the alimentazioneVeicolo, or with status 404 (Not Found)
     */
    @GetMapping("/alimentazione-veicolos/{id}")
    @Timed
    public ResponseEntity<AlimentazioneVeicolo> getAlimentazioneVeicolo(@PathVariable Long id) {
        log.debug("REST request to get AlimentazioneVeicolo : {}", id);
        Optional<AlimentazioneVeicolo> alimentazioneVeicolo = alimentazioneVeicoloRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(alimentazioneVeicolo);
    }

    /**
     * DELETE  /alimentazione-veicolos/:id : delete the "id" alimentazioneVeicolo.
     *
     * @param id the id of the alimentazioneVeicolo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/alimentazione-veicolos/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Void> deleteAlimentazioneVeicolo(@PathVariable Long id) {
        log.debug("REST request to delete AlimentazioneVeicolo : {}", id);

        alimentazioneVeicoloRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
