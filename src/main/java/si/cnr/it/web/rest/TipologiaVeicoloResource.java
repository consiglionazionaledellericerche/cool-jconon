package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.springframework.security.access.annotation.Secured;
import si.cnr.it.domain.TipologiaVeicolo;
import si.cnr.it.repository.TipologiaVeicoloRepository;
import si.cnr.it.security.AuthoritiesConstants;
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
 * REST controller for managing TipologiaVeicolo.
 */
@RestController
@RequestMapping("/api")
public class TipologiaVeicoloResource {

    private final Logger log = LoggerFactory.getLogger(TipologiaVeicoloResource.class);

    private static final String ENTITY_NAME = "tipologiaVeicolo";

    private final TipologiaVeicoloRepository tipologiaVeicoloRepository;

    public TipologiaVeicoloResource(TipologiaVeicoloRepository tipologiaVeicoloRepository) {
        this.tipologiaVeicoloRepository = tipologiaVeicoloRepository;
    }

    /**
     * POST  /tipologia-veicolos : Create a new tipologiaVeicolo.
     *
     * @param tipologiaVeicolo the tipologiaVeicolo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new tipologiaVeicolo, or with status 400 (Bad Request) if the tipologiaVeicolo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tipologia-veicolos")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<TipologiaVeicolo> createTipologiaVeicolo(@Valid @RequestBody TipologiaVeicolo tipologiaVeicolo) throws URISyntaxException {
        log.debug("REST request to save TipologiaVeicolo : {}", tipologiaVeicolo);
        if (tipologiaVeicolo.getId() != null) {
            throw new BadRequestAlertException("A new tipologiaVeicolo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TipologiaVeicolo result = tipologiaVeicoloRepository.save(tipologiaVeicolo);
        return ResponseEntity.created(new URI("/api/tipologia-veicolos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tipologia-veicolos : Updates an existing tipologiaVeicolo.
     *
     * @param tipologiaVeicolo the tipologiaVeicolo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated tipologiaVeicolo,
     * or with status 400 (Bad Request) if the tipologiaVeicolo is not valid,
     * or with status 500 (Internal Server Error) if the tipologiaVeicolo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tipologia-veicolos")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<TipologiaVeicolo> updateTipologiaVeicolo(@Valid @RequestBody TipologiaVeicolo tipologiaVeicolo) throws URISyntaxException {
        log.debug("REST request to update TipologiaVeicolo : {}", tipologiaVeicolo);
        if (tipologiaVeicolo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TipologiaVeicolo result = tipologiaVeicoloRepository.save(tipologiaVeicolo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tipologiaVeicolo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tipologia-veicolos : get all the tipologiaVeicolos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of tipologiaVeicolos in body
     */
    @GetMapping("/tipologia-veicolos")
    @Timed
    public ResponseEntity<List<TipologiaVeicolo>> getAllTipologiaVeicolos(Pageable pageable) {
        log.debug("REST request to get a page of TipologiaVeicolos");
        Page<TipologiaVeicolo> page = tipologiaVeicoloRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tipologia-veicolos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /tipologia-veicolos/:id : get the "id" tipologiaVeicolo.
     *
     * @param id the id of the tipologiaVeicolo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the tipologiaVeicolo, or with status 404 (Not Found)
     */
    @GetMapping("/tipologia-veicolos/{id}")
    @Timed
    public ResponseEntity<TipologiaVeicolo> getTipologiaVeicolo(@PathVariable Long id) {
        log.debug("REST request to get TipologiaVeicolo : {}", id);
        Optional<TipologiaVeicolo> tipologiaVeicolo = tipologiaVeicoloRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tipologiaVeicolo);
    }

    /**
     * DELETE  /tipologia-veicolos/:id : delete the "id" tipologiaVeicolo.
     *
     * @param id the id of the tipologiaVeicolo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tipologia-veicolos/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Void> deleteTipologiaVeicolo(@PathVariable Long id) {
        log.debug("REST request to delete TipologiaVeicolo : {}", id);

        tipologiaVeicoloRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
