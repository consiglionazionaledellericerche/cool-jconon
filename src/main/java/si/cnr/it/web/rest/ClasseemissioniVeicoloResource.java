package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import si.cnr.it.domain.ClasseemissioniVeicolo;
import si.cnr.it.repository.ClasseemissioniVeicoloRepository;
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
 * REST controller for managing ClasseemissioniVeicolo.
 */
@RestController
@RequestMapping("/api")
public class ClasseemissioniVeicoloResource {

    private final Logger log = LoggerFactory.getLogger(ClasseemissioniVeicoloResource.class);

    private static final String ENTITY_NAME = "classeemissioniVeicolo";

    private final ClasseemissioniVeicoloRepository classeemissioniVeicoloRepository;

    public ClasseemissioniVeicoloResource(ClasseemissioniVeicoloRepository classeemissioniVeicoloRepository) {
        this.classeemissioniVeicoloRepository = classeemissioniVeicoloRepository;
    }

    /**
     * POST  /classeemissioni-veicolos : Create a new classeemissioniVeicolo.
     *
     * @param classeemissioniVeicolo the classeemissioniVeicolo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new classeemissioniVeicolo, or with status 400 (Bad Request) if the classeemissioniVeicolo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/classeemissioni-veicolos")
    @Timed
    public ResponseEntity<ClasseemissioniVeicolo> createClasseemissioniVeicolo(@Valid @RequestBody ClasseemissioniVeicolo classeemissioniVeicolo) throws URISyntaxException {
        log.debug("REST request to save ClasseemissioniVeicolo : {}", classeemissioniVeicolo);
        if (classeemissioniVeicolo.getId() != null) {
            throw new BadRequestAlertException("A new classeemissioniVeicolo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClasseemissioniVeicolo result = classeemissioniVeicoloRepository.save(classeemissioniVeicolo);
        return ResponseEntity.created(new URI("/api/classeemissioni-veicolos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /classeemissioni-veicolos : Updates an existing classeemissioniVeicolo.
     *
     * @param classeemissioniVeicolo the classeemissioniVeicolo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated classeemissioniVeicolo,
     * or with status 400 (Bad Request) if the classeemissioniVeicolo is not valid,
     * or with status 500 (Internal Server Error) if the classeemissioniVeicolo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/classeemissioni-veicolos")
    @Timed
    public ResponseEntity<ClasseemissioniVeicolo> updateClasseemissioniVeicolo(@Valid @RequestBody ClasseemissioniVeicolo classeemissioniVeicolo) throws URISyntaxException {
        log.debug("REST request to update ClasseemissioniVeicolo : {}", classeemissioniVeicolo);
        if (classeemissioniVeicolo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ClasseemissioniVeicolo result = classeemissioniVeicoloRepository.save(classeemissioniVeicolo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, classeemissioniVeicolo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /classeemissioni-veicolos : get all the classeemissioniVeicolos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of classeemissioniVeicolos in body
     */
    @GetMapping("/classeemissioni-veicolos")
    @Timed
    public ResponseEntity<List<ClasseemissioniVeicolo>> getAllClasseemissioniVeicolos(Pageable pageable) {
        log.debug("REST request to get a page of ClasseemissioniVeicolos");
        Page<ClasseemissioniVeicolo> page = classeemissioniVeicoloRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/classeemissioni-veicolos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /classeemissioni-veicolos/:id : get the "id" classeemissioniVeicolo.
     *
     * @param id the id of the classeemissioniVeicolo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the classeemissioniVeicolo, or with status 404 (Not Found)
     */
    @GetMapping("/classeemissioni-veicolos/{id}")
    @Timed
    public ResponseEntity<ClasseemissioniVeicolo> getClasseemissioniVeicolo(@PathVariable Long id) {
        log.debug("REST request to get ClasseemissioniVeicolo : {}", id);
        Optional<ClasseemissioniVeicolo> classeemissioniVeicolo = classeemissioniVeicoloRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(classeemissioniVeicolo);
    }

    /**
     * DELETE  /classeemissioni-veicolos/:id : delete the "id" classeemissioniVeicolo.
     *
     * @param id the id of the classeemissioniVeicolo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/classeemissioni-veicolos/{id}")
    @Timed
    public ResponseEntity<Void> deleteClasseemissioniVeicolo(@PathVariable Long id) {
        log.debug("REST request to delete ClasseemissioniVeicolo : {}", id);

        classeemissioniVeicoloRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
