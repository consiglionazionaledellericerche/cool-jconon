package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import si.cnr.it.domain.Istituto;
import si.cnr.it.repository.IstitutoRepository;
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
 * REST controller for managing Istituto.
 */
@RestController
@RequestMapping("/api")
public class IstitutoResource {

    private final Logger log = LoggerFactory.getLogger(IstitutoResource.class);

    private static final String ENTITY_NAME = "istituto";

    private final IstitutoRepository istitutoRepository;

    public IstitutoResource(IstitutoRepository istitutoRepository) {
        this.istitutoRepository = istitutoRepository;
    }

    /**
     * POST  /istitutos : Create a new istituto.
     *
     * @param istituto the istituto to create
     * @return the ResponseEntity with status 201 (Created) and with body the new istituto, or with status 400 (Bad Request) if the istituto has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/istitutos")
    @Timed
    public ResponseEntity<Istituto> createIstituto(@Valid @RequestBody Istituto istituto) throws URISyntaxException {
        log.debug("REST request to save Istituto : {}", istituto);
        if (istituto.getId() != null) {
            throw new BadRequestAlertException("A new istituto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Istituto result = istitutoRepository.save(istituto);
        return ResponseEntity.created(new URI("/api/istitutos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /istitutos : Updates an existing istituto.
     *
     * @param istituto the istituto to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated istituto,
     * or with status 400 (Bad Request) if the istituto is not valid,
     * or with status 500 (Internal Server Error) if the istituto couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/istitutos")
    @Timed
    public ResponseEntity<Istituto> updateIstituto(@Valid @RequestBody Istituto istituto) throws URISyntaxException {
        log.debug("REST request to update Istituto : {}", istituto);
        if (istituto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Istituto result = istitutoRepository.save(istituto);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, istituto.getId().toString()))
            .body(result);
    }

    /**
     * GET  /istitutos : get all the istitutos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of istitutos in body
     */
    @GetMapping("/istitutos")
    @Timed
    public ResponseEntity<List<Istituto>> getAllIstitutos(Pageable pageable) {
        log.debug("REST request to get a page of Istitutos");
        Page<Istituto> page = istitutoRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/istitutos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /istitutos/:id : get the "id" istituto.
     *
     * @param id the id of the istituto to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the istituto, or with status 404 (Not Found)
     */
    @GetMapping("/istitutos/{id}")
    @Timed
    public ResponseEntity<Istituto> getIstituto(@PathVariable Long id) {
        log.debug("REST request to get Istituto : {}", id);
        Optional<Istituto> istituto = istitutoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(istituto);
    }

    /**
     * DELETE  /istitutos/:id : delete the "id" istituto.
     *
     * @param id the id of the istituto to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/istitutos/{id}")
    @Timed
    public ResponseEntity<Void> deleteIstituto(@PathVariable Long id) {
        log.debug("REST request to delete Istituto : {}", id);

        istitutoRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
