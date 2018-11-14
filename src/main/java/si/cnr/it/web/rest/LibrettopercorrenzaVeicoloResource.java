package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import si.cnr.it.domain.LibrettopercorrenzaVeicolo;
import si.cnr.it.repository.LibrettopercorrenzaVeicoloRepository;
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
 * REST controller for managing LibrettopercorrenzaVeicolo.
 */
@RestController
@RequestMapping("/api")
public class LibrettopercorrenzaVeicoloResource {

    private final Logger log = LoggerFactory.getLogger(LibrettopercorrenzaVeicoloResource.class);

    private static final String ENTITY_NAME = "librettopercorrenzaVeicolo";

    private final LibrettopercorrenzaVeicoloRepository librettopercorrenzaVeicoloRepository;

    public LibrettopercorrenzaVeicoloResource(LibrettopercorrenzaVeicoloRepository librettopercorrenzaVeicoloRepository) {
        this.librettopercorrenzaVeicoloRepository = librettopercorrenzaVeicoloRepository;
    }

    /**
     * POST  /librettopercorrenza-veicolos : Create a new librettopercorrenzaVeicolo.
     *
     * @param librettopercorrenzaVeicolo the librettopercorrenzaVeicolo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new librettopercorrenzaVeicolo, or with status 400 (Bad Request) if the librettopercorrenzaVeicolo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/librettopercorrenza-veicolos")
    @Timed
    public ResponseEntity<LibrettopercorrenzaVeicolo> createLibrettopercorrenzaVeicolo(@Valid @RequestBody LibrettopercorrenzaVeicolo librettopercorrenzaVeicolo) throws URISyntaxException {
        log.debug("REST request to save LibrettopercorrenzaVeicolo : {}", librettopercorrenzaVeicolo);
        if (librettopercorrenzaVeicolo.getId() != null) {
            throw new BadRequestAlertException("A new librettopercorrenzaVeicolo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LibrettopercorrenzaVeicolo result = librettopercorrenzaVeicoloRepository.save(librettopercorrenzaVeicolo);
        return ResponseEntity.created(new URI("/api/librettopercorrenza-veicolos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /librettopercorrenza-veicolos : Updates an existing librettopercorrenzaVeicolo.
     *
     * @param librettopercorrenzaVeicolo the librettopercorrenzaVeicolo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated librettopercorrenzaVeicolo,
     * or with status 400 (Bad Request) if the librettopercorrenzaVeicolo is not valid,
     * or with status 500 (Internal Server Error) if the librettopercorrenzaVeicolo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/librettopercorrenza-veicolos")
    @Timed
    public ResponseEntity<LibrettopercorrenzaVeicolo> updateLibrettopercorrenzaVeicolo(@Valid @RequestBody LibrettopercorrenzaVeicolo librettopercorrenzaVeicolo) throws URISyntaxException {
        log.debug("REST request to update LibrettopercorrenzaVeicolo : {}", librettopercorrenzaVeicolo);
        if (librettopercorrenzaVeicolo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        LibrettopercorrenzaVeicolo result = librettopercorrenzaVeicoloRepository.save(librettopercorrenzaVeicolo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, librettopercorrenzaVeicolo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /librettopercorrenza-veicolos : get all the librettopercorrenzaVeicolos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of librettopercorrenzaVeicolos in body
     */
    @GetMapping("/librettopercorrenza-veicolos")
    @Timed
    public ResponseEntity<List<LibrettopercorrenzaVeicolo>> getAllLibrettopercorrenzaVeicolos(Pageable pageable) {
        log.debug("REST request to get a page of LibrettopercorrenzaVeicolos");
        Page<LibrettopercorrenzaVeicolo> page = librettopercorrenzaVeicoloRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/librettopercorrenza-veicolos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /librettopercorrenza-veicolos/:id : get the "id" librettopercorrenzaVeicolo.
     *
     * @param id the id of the librettopercorrenzaVeicolo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the librettopercorrenzaVeicolo, or with status 404 (Not Found)
     */
    @GetMapping("/librettopercorrenza-veicolos/{id}")
    @Timed
    public ResponseEntity<LibrettopercorrenzaVeicolo> getLibrettopercorrenzaVeicolo(@PathVariable Long id) {
        log.debug("REST request to get LibrettopercorrenzaVeicolo : {}", id);
        Optional<LibrettopercorrenzaVeicolo> librettopercorrenzaVeicolo = librettopercorrenzaVeicoloRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(librettopercorrenzaVeicolo);
    }

    /**
     * DELETE  /librettopercorrenza-veicolos/:id : delete the "id" librettopercorrenzaVeicolo.
     *
     * @param id the id of the librettopercorrenzaVeicolo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/librettopercorrenza-veicolos/{id}")
    @Timed
    public ResponseEntity<Void> deleteLibrettopercorrenzaVeicolo(@PathVariable Long id) {
        log.debug("REST request to delete LibrettopercorrenzaVeicolo : {}", id);

        librettopercorrenzaVeicoloRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
