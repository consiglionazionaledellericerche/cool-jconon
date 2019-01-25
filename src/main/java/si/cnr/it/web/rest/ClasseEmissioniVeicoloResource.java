package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.springframework.security.access.annotation.Secured;
import si.cnr.it.domain.ClasseEmissioniVeicolo;
import si.cnr.it.repository.ClasseEmissioniVeicoloRepository;
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
 * REST controller for managing ClasseEmissioniVeicolo.
 */
@RestController
@RequestMapping("/api")
public class ClasseEmissioniVeicoloResource {

    private final Logger log = LoggerFactory.getLogger(ClasseEmissioniVeicoloResource.class);

    private static final String ENTITY_NAME = "classeEmissioniVeicolo";

    private final ClasseEmissioniVeicoloRepository classeEmissioniVeicoloRepository;

    public ClasseEmissioniVeicoloResource(ClasseEmissioniVeicoloRepository classeEmissioniVeicoloRepository) {
        this.classeEmissioniVeicoloRepository = classeEmissioniVeicoloRepository;
    }

    /**
     * POST  /classe-emissioni-veicolos : Create a new classeEmissioniVeicolo.
     *
     * @param classeEmissioniVeicolo the classeEmissioniVeicolo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new classeEmissioniVeicolo, or with status 400 (Bad Request) if the classeEmissioniVeicolo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/classe-emissioni-veicolos")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<ClasseEmissioniVeicolo> createClasseEmissioniVeicolo(@Valid @RequestBody ClasseEmissioniVeicolo classeEmissioniVeicolo) throws URISyntaxException {
        log.debug("REST request to save ClasseEmissioniVeicolo : {}", classeEmissioniVeicolo);
        if (classeEmissioniVeicolo.getId() != null) {
            throw new BadRequestAlertException("A new classeEmissioniVeicolo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClasseEmissioniVeicolo result = classeEmissioniVeicoloRepository.save(classeEmissioniVeicolo);
        return ResponseEntity.created(new URI("/api/classe-emissioni-veicolos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /classe-emissioni-veicolos : Updates an existing classeEmissioniVeicolo.
     *
     * @param classeEmissioniVeicolo the classeEmissioniVeicolo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated classeEmissioniVeicolo,
     * or with status 400 (Bad Request) if the classeEmissioniVeicolo is not valid,
     * or with status 500 (Internal Server Error) if the classeEmissioniVeicolo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/classe-emissioni-veicolos")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<ClasseEmissioniVeicolo> updateClasseEmissioniVeicolo(@Valid @RequestBody ClasseEmissioniVeicolo classeEmissioniVeicolo) throws URISyntaxException {
        log.debug("REST request to update ClasseEmissioniVeicolo : {}", classeEmissioniVeicolo);
        if (classeEmissioniVeicolo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ClasseEmissioniVeicolo result = classeEmissioniVeicoloRepository.save(classeEmissioniVeicolo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, classeEmissioniVeicolo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /classe-emissioni-veicolos : get all the classeEmissioniVeicolos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of classeEmissioniVeicolos in body
     */
    @GetMapping("/classe-emissioni-veicolos")
    @Timed
    public ResponseEntity<List<ClasseEmissioniVeicolo>> getAllClasseEmissioniVeicolos(Pageable pageable) {
        log.debug("REST request to get a page of ClasseEmissioniVeicolos");
        Page<ClasseEmissioniVeicolo> page = classeEmissioniVeicoloRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/classe-emissioni-veicolos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /classe-emissioni-veicolos/:id : get the "id" classeEmissioniVeicolo.
     *
     * @param id the id of the classeEmissioniVeicolo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the classeEmissioniVeicolo, or with status 404 (Not Found)
     */
    @GetMapping("/classe-emissioni-veicolos/{id}")
    @Timed
    public ResponseEntity<ClasseEmissioniVeicolo> getClasseEmissioniVeicolo(@PathVariable Long id) {
        log.debug("REST request to get ClasseEmissioniVeicolo : {}", id);
        Optional<ClasseEmissioniVeicolo> classeEmissioniVeicolo = classeEmissioniVeicoloRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(classeEmissioniVeicolo);
    }

    /**
     * DELETE  /classe-emissioni-veicolos/:id : delete the "id" classeEmissioniVeicolo.
     *
     * @param id the id of the classeEmissioniVeicolo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/classe-emissioni-veicolos/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Void> deleteClasseEmissioniVeicolo(@PathVariable Long id) {
        log.debug("REST request to delete ClasseEmissioniVeicolo : {}", id);

        classeEmissioniVeicoloRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
