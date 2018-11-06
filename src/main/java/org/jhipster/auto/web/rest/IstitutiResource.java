package org.jhipster.auto.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.auto.domain.Istituti;
import org.jhipster.auto.repository.IstitutiRepository;
import org.jhipster.auto.web.rest.errors.BadRequestAlertException;
import org.jhipster.auto.web.rest.util.HeaderUtil;
import org.jhipster.auto.web.rest.util.PaginationUtil;
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
 * REST controller for managing Istituti.
 */
@RestController
@RequestMapping("/api")
public class IstitutiResource {

    private final Logger log = LoggerFactory.getLogger(IstitutiResource.class);

    private static final String ENTITY_NAME = "istituti";

    private final IstitutiRepository istitutiRepository;

    public IstitutiResource(IstitutiRepository istitutiRepository) {
        this.istitutiRepository = istitutiRepository;
    }

    /**
     * POST  /istitutis : Create a new istituti.
     *
     * @param istituti the istituti to create
     * @return the ResponseEntity with status 201 (Created) and with body the new istituti, or with status 400 (Bad Request) if the istituti has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/istitutis")
    @Timed
    public ResponseEntity<Istituti> createIstituti(@Valid @RequestBody Istituti istituti) throws URISyntaxException {
        log.debug("REST request to save Istituti : {}", istituti);
        if (istituti.getId() != null) {
            throw new BadRequestAlertException("A new istituti cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Istituti result = istitutiRepository.save(istituti);
        return ResponseEntity.created(new URI("/api/istitutis/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /istitutis : Updates an existing istituti.
     *
     * @param istituti the istituti to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated istituti,
     * or with status 400 (Bad Request) if the istituti is not valid,
     * or with status 500 (Internal Server Error) if the istituti couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/istitutis")
    @Timed
    public ResponseEntity<Istituti> updateIstituti(@Valid @RequestBody Istituti istituti) throws URISyntaxException {
        log.debug("REST request to update Istituti : {}", istituti);
        if (istituti.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Istituti result = istitutiRepository.save(istituti);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, istituti.getId().toString()))
            .body(result);
    }

    /**
     * GET  /istitutis : get all the istitutis.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of istitutis in body
     */
    @GetMapping("/istitutis")
    @Timed
    public ResponseEntity<List<Istituti>> getAllIstitutis(Pageable pageable) {
        log.debug("REST request to get a page of Istitutis");
        Page<Istituti> page = istitutiRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/istitutis");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /istitutis/:id : get the "id" istituti.
     *
     * @param id the id of the istituti to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the istituti, or with status 404 (Not Found)
     */
    @GetMapping("/istitutis/{id}")
    @Timed
    public ResponseEntity<Istituti> getIstituti(@PathVariable Long id) {
        log.debug("REST request to get Istituti : {}", id);
        Optional<Istituti> istituti = istitutiRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(istituti);
    }

    /**
     * DELETE  /istitutis/:id : delete the "id" istituti.
     *
     * @param id the id of the istituti to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/istitutis/{id}")
    @Timed
    public ResponseEntity<Void> deleteIstituti(@PathVariable Long id) {
        log.debug("REST request to delete Istituti : {}", id);

        istitutiRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
