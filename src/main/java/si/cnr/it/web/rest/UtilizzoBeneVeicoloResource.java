package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.springframework.security.access.annotation.Secured;
import si.cnr.it.domain.UtilizzoBeneVeicolo;
import si.cnr.it.repository.UtilizzoBeneVeicoloRepository;
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
 * REST controller for managing UtilizzoBeneVeicolo.
 */
@RestController
@RequestMapping("/api")
public class UtilizzoBeneVeicoloResource {

    private final Logger log = LoggerFactory.getLogger(UtilizzoBeneVeicoloResource.class);

    private static final String ENTITY_NAME = "utilizzoBeneVeicolo";

    private final UtilizzoBeneVeicoloRepository utilizzoBeneVeicoloRepository;

    public UtilizzoBeneVeicoloResource(UtilizzoBeneVeicoloRepository utilizzoBeneVeicoloRepository) {
        this.utilizzoBeneVeicoloRepository = utilizzoBeneVeicoloRepository;
    }

    /**
     * POST  /utilizzo-bene-veicolos : Create a new utilizzoBeneVeicolo.
     *
     * @param utilizzoBeneVeicolo the utilizzoBeneVeicolo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new utilizzoBeneVeicolo, or with status 400 (Bad Request) if the utilizzoBeneVeicolo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/utilizzo-bene-veicolos")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<UtilizzoBeneVeicolo> createUtilizzoBeneVeicolo(@Valid @RequestBody UtilizzoBeneVeicolo utilizzoBeneVeicolo) throws URISyntaxException {
        log.debug("REST request to save UtilizzoBeneVeicolo : {}", utilizzoBeneVeicolo);
        if (utilizzoBeneVeicolo.getId() != null) {
            throw new BadRequestAlertException("A new utilizzoBeneVeicolo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UtilizzoBeneVeicolo result = utilizzoBeneVeicoloRepository.save(utilizzoBeneVeicolo);
        return ResponseEntity.created(new URI("/api/utilizzo-bene-veicolos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /utilizzo-bene-veicolos : Updates an existing utilizzoBeneVeicolo.
     *
     * @param utilizzoBeneVeicolo the utilizzoBeneVeicolo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated utilizzoBeneVeicolo,
     * or with status 400 (Bad Request) if the utilizzoBeneVeicolo is not valid,
     * or with status 500 (Internal Server Error) if the utilizzoBeneVeicolo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/utilizzo-bene-veicolos")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<UtilizzoBeneVeicolo> updateUtilizzoBeneVeicolo(@Valid @RequestBody UtilizzoBeneVeicolo utilizzoBeneVeicolo) throws URISyntaxException {
        log.debug("REST request to update UtilizzoBeneVeicolo : {}", utilizzoBeneVeicolo);
        if (utilizzoBeneVeicolo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UtilizzoBeneVeicolo result = utilizzoBeneVeicoloRepository.save(utilizzoBeneVeicolo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, utilizzoBeneVeicolo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /utilizzo-bene-veicolos : get all the utilizzoBeneVeicolos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of utilizzoBeneVeicolos in body
     */
    @GetMapping("/utilizzo-bene-veicolos")
    @Timed
    public ResponseEntity<List<UtilizzoBeneVeicolo>> getAllUtilizzoBeneVeicolos(Pageable pageable) {
        log.debug("REST request to get a page of UtilizzoBeneVeicolos");
        Page<UtilizzoBeneVeicolo> page = utilizzoBeneVeicoloRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/utilizzo-bene-veicolos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /utilizzo-bene-veicolos/:id : get the "id" utilizzoBeneVeicolo.
     *
     * @param id the id of the utilizzoBeneVeicolo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the utilizzoBeneVeicolo, or with status 404 (Not Found)
     */
    @GetMapping("/utilizzo-bene-veicolos/{id}")
    @Timed
    public ResponseEntity<UtilizzoBeneVeicolo> getUtilizzoBeneVeicolo(@PathVariable Long id) {
        log.debug("REST request to get UtilizzoBeneVeicolo : {}", id);
        Optional<UtilizzoBeneVeicolo> utilizzoBeneVeicolo = utilizzoBeneVeicoloRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(utilizzoBeneVeicolo);
    }

    /**
     * DELETE  /utilizzo-bene-veicolos/:id : delete the "id" utilizzoBeneVeicolo.
     *
     * @param id the id of the utilizzoBeneVeicolo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/utilizzo-bene-veicolos/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Void> deleteUtilizzoBeneVeicolo(@PathVariable Long id) {
        log.debug("REST request to delete UtilizzoBeneVeicolo : {}", id);

        utilizzoBeneVeicoloRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
