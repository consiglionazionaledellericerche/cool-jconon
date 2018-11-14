package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import si.cnr.it.domain.Utenza;
import si.cnr.it.repository.UtenzaRepository;
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
 * REST controller for managing Utenza.
 */
@RestController
@RequestMapping("/api")
public class UtenzaResource {

    private final Logger log = LoggerFactory.getLogger(UtenzaResource.class);

    private static final String ENTITY_NAME = "utenza";

    private final UtenzaRepository utenzaRepository;

    public UtenzaResource(UtenzaRepository utenzaRepository) {
        this.utenzaRepository = utenzaRepository;
    }

    /**
     * POST  /utenzas : Create a new utenza.
     *
     * @param utenza the utenza to create
     * @return the ResponseEntity with status 201 (Created) and with body the new utenza, or with status 400 (Bad Request) if the utenza has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/utenzas")
    @Timed
    public ResponseEntity<Utenza> createUtenza(@Valid @RequestBody Utenza utenza) throws URISyntaxException {
        log.debug("REST request to save Utenza : {}", utenza);
        if (utenza.getId() != null) {
            throw new BadRequestAlertException("A new utenza cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Utenza result = utenzaRepository.save(utenza);
        return ResponseEntity.created(new URI("/api/utenzas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /utenzas : Updates an existing utenza.
     *
     * @param utenza the utenza to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated utenza,
     * or with status 400 (Bad Request) if the utenza is not valid,
     * or with status 500 (Internal Server Error) if the utenza couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/utenzas")
    @Timed
    public ResponseEntity<Utenza> updateUtenza(@Valid @RequestBody Utenza utenza) throws URISyntaxException {
        log.debug("REST request to update Utenza : {}", utenza);
        if (utenza.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Utenza result = utenzaRepository.save(utenza);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, utenza.getId().toString()))
            .body(result);
    }

    /**
     * GET  /utenzas : get all the utenzas.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of utenzas in body
     */
    @GetMapping("/utenzas")
    @Timed
    public ResponseEntity<List<Utenza>> getAllUtenzas(Pageable pageable) {
        log.debug("REST request to get a page of Utenzas");
        Page<Utenza> page = utenzaRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/utenzas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /utenzas/:id : get the "id" utenza.
     *
     * @param id the id of the utenza to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the utenza, or with status 404 (Not Found)
     */
    @GetMapping("/utenzas/{id}")
    @Timed
    public ResponseEntity<Utenza> getUtenza(@PathVariable Long id) {
        log.debug("REST request to get Utenza : {}", id);
        Optional<Utenza> utenza = utenzaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(utenza);
    }

    /**
     * DELETE  /utenzas/:id : delete the "id" utenza.
     *
     * @param id the id of the utenza to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/utenzas/{id}")
    @Timed
    public ResponseEntity<Void> deleteUtenza(@PathVariable Long id) {
        log.debug("REST request to delete Utenza : {}", id);

        utenzaRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
