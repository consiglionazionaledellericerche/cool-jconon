package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import si.cnr.it.domain.UtilizzobeneVeicolo;
import si.cnr.it.repository.UtilizzobeneVeicoloRepository;
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

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing UtilizzobeneVeicolo.
 */
@RestController
@RequestMapping("/api")
public class UtilizzobeneVeicoloResource {

    private final Logger log = LoggerFactory.getLogger(UtilizzobeneVeicoloResource.class);

    private static final String ENTITY_NAME = "utilizzobeneVeicolo";

    private final UtilizzobeneVeicoloRepository utilizzobeneVeicoloRepository;

    public UtilizzobeneVeicoloResource(UtilizzobeneVeicoloRepository utilizzobeneVeicoloRepository) {
        this.utilizzobeneVeicoloRepository = utilizzobeneVeicoloRepository;
    }

    /**
     * POST  /utilizzobene-veicolos : Create a new utilizzobeneVeicolo.
     *
     * @param utilizzobeneVeicolo the utilizzobeneVeicolo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new utilizzobeneVeicolo, or with status 400 (Bad Request) if the utilizzobeneVeicolo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/utilizzobene-veicolos")
    @Timed
    public ResponseEntity<UtilizzobeneVeicolo> createUtilizzobeneVeicolo(@Valid @RequestBody UtilizzobeneVeicolo utilizzobeneVeicolo) throws URISyntaxException {
        log.debug("REST request to save UtilizzobeneVeicolo : {}", utilizzobeneVeicolo);
        if (utilizzobeneVeicolo.getId() != null) {
            throw new BadRequestAlertException("A new utilizzobeneVeicolo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UtilizzobeneVeicolo result = utilizzobeneVeicoloRepository.save(utilizzobeneVeicolo);
        return ResponseEntity.created(new URI("/api/utilizzobene-veicolos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /utilizzobene-veicolos : Updates an existing utilizzobeneVeicolo.
     *
     * @param utilizzobeneVeicolo the utilizzobeneVeicolo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated utilizzobeneVeicolo,
     * or with status 400 (Bad Request) if the utilizzobeneVeicolo is not valid,
     * or with status 500 (Internal Server Error) if the utilizzobeneVeicolo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/utilizzobene-veicolos")
    @Timed
    public ResponseEntity<UtilizzobeneVeicolo> updateUtilizzobeneVeicolo(@Valid @RequestBody UtilizzobeneVeicolo utilizzobeneVeicolo) throws URISyntaxException {
        log.debug("REST request to update UtilizzobeneVeicolo : {}", utilizzobeneVeicolo);
        if (utilizzobeneVeicolo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UtilizzobeneVeicolo result = utilizzobeneVeicoloRepository.save(utilizzobeneVeicolo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, utilizzobeneVeicolo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /utilizzobene-veicolos : get all the utilizzobeneVeicolos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of utilizzobeneVeicolos in body
     */
    @GetMapping("/utilizzobene-veicolos")
    @Timed
    public ResponseEntity<List<UtilizzobeneVeicolo>> getAllUtilizzobeneVeicolos(Pageable pageable) {
        log.debug("REST request to get a page of UtilizzobeneVeicolos");
        Page<UtilizzobeneVeicolo> page = utilizzobeneVeicoloRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/utilizzobene-veicolos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /utilizzobene-veicolos/:id : get the "id" utilizzobeneVeicolo.
     *
     * @param id the id of the utilizzobeneVeicolo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the utilizzobeneVeicolo, or with status 404 (Not Found)
     */
    @GetMapping("/utilizzobene-veicolos/{id}")
    @Timed
    public ResponseEntity<UtilizzobeneVeicolo> getUtilizzobeneVeicolo(@PathVariable Long id) {
        log.debug("REST request to get UtilizzobeneVeicolo : {}", id);
        Optional<UtilizzobeneVeicolo> utilizzobeneVeicolo = utilizzobeneVeicoloRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(utilizzobeneVeicolo);
    }

    /**
     * DELETE  /utilizzobene-veicolos/:id : delete the "id" utilizzobeneVeicolo.
     *
     * @param id the id of the utilizzobeneVeicolo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/utilizzobene-veicolos/{id}")
    @Timed
    public ResponseEntity<Void> deleteUtilizzobeneVeicolo(@PathVariable Long id) {
        log.debug("REST request to delete UtilizzobeneVeicolo : {}", id);

        utilizzobeneVeicoloRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
