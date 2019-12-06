package it.cnr.si.web.rest;

import com.codahale.metrics.annotation.Timed;
import it.cnr.si.domain.CancellazionePra;
import it.cnr.si.repository.CancellazionePraRepository;
import it.cnr.si.web.rest.errors.BadRequestAlertException;
import it.cnr.si.web.rest.util.HeaderUtil;
import it.cnr.si.web.rest.util.PaginationUtil;
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
 * REST controller for managing CancellazionePra.
 */
@RestController
@RequestMapping("/api")
public class CancellazionePraResource {

    private final Logger log = LoggerFactory.getLogger(CancellazionePraResource.class);

    private static final String ENTITY_NAME = "cancellazionePra";

    private final CancellazionePraRepository cancellazionePraRepository;

    public CancellazionePraResource(CancellazionePraRepository cancellazionePraRepository) {
        this.cancellazionePraRepository = cancellazionePraRepository;
    }

    /**
     * POST  /cancellazione-pras : Create a new cancellazionePra.
     *
     * @param cancellazionePra the cancellazionePra to create
     * @return the ResponseEntity with status 201 (Created) and with body the new cancellazionePra, or with status 400 (Bad Request) if the cancellazionePra has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/cancellazione-pras")
    @Timed
    public ResponseEntity<CancellazionePra> createCancellazionePra(@Valid @RequestBody CancellazionePra cancellazionePra) throws URISyntaxException {
        log.debug("REST request to save CancellazionePra : {}", cancellazionePra);
        if (cancellazionePra.getId() != null) {
            throw new BadRequestAlertException("A new cancellazionePra cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CancellazionePra result = cancellazionePraRepository.save(cancellazionePra);
        return ResponseEntity.created(new URI("/api/cancellazione-pras/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /cancellazione-pras : Updates an existing cancellazionePra.
     *
     * @param cancellazionePra the cancellazionePra to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated cancellazionePra,
     * or with status 400 (Bad Request) if the cancellazionePra is not valid,
     * or with status 500 (Internal Server Error) if the cancellazionePra couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/cancellazione-pras")
    @Timed
    public ResponseEntity<CancellazionePra> updateCancellazionePra(@Valid @RequestBody CancellazionePra cancellazionePra) throws URISyntaxException {
        log.debug("REST request to update CancellazionePra : {}", cancellazionePra);
        if (cancellazionePra.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CancellazionePra result = cancellazionePraRepository.save(cancellazionePra);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, cancellazionePra.getId().toString()))
            .body(result);
    }

    /**
     * GET  /cancellazione-pras : get all the cancellazionePras.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of cancellazionePras in body
     */
    @GetMapping("/cancellazione-pras")
    @Timed
    public ResponseEntity<List<CancellazionePra>> getAllCancellazionePras(Pageable pageable) {
        log.debug("REST request to get a page of CancellazionePras");
        Page<CancellazionePra> page = cancellazionePraRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/cancellazione-pras");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /cancellazione-pras/:id : get the "id" cancellazionePra.
     *
     * @param id the id of the cancellazionePra to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the cancellazionePra, or with status 404 (Not Found)
     */
    @GetMapping("/cancellazione-pras/{id}")
    @Timed
    public ResponseEntity<CancellazionePra> getCancellazionePra(@PathVariable Long id) {
        log.debug("REST request to get CancellazionePra : {}", id);
        Optional<CancellazionePra> cancellazionePra = cancellazionePraRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cancellazionePra);
    }

    /**
     * DELETE  /cancellazione-pras/:id : delete the "id" cancellazionePra.
     *
     * @param id the id of the cancellazionePra to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/cancellazione-pras/{id}")
    @Timed
    public ResponseEntity<Void> deleteCancellazionePra(@PathVariable Long id) {
        log.debug("REST request to delete CancellazionePra : {}", id);

        cancellazionePraRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
