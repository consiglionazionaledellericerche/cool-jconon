package it.cnr.si.web.rest;

import com.codahale.metrics.annotation.Timed;
import it.cnr.si.domain.MotivazionePerditaProprieta;
import it.cnr.si.web.rest.errors.BadRequestAlertException;
import it.cnr.si.web.rest.util.HeaderUtil;
import it.cnr.si.web.rest.util.PaginationUtil;
import org.springframework.security.access.annotation.Secured;
import it.cnr.si.repository.MotivazionePerditaProprietaRepository;
import it.cnr.si.security.AuthoritiesConstants;
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
 * REST controller for managing MotivazionePerditaProprieta.
 */
@RestController
@RequestMapping("/api")
public class MotivazionePerditaProprietaResource {

    private final Logger log = LoggerFactory.getLogger(MotivazionePerditaProprietaResource.class);

    private static final String ENTITY_NAME = "motivazionePerditaProprieta";

    private final MotivazionePerditaProprietaRepository motivazionePerditaProprietaRepository;

    public MotivazionePerditaProprietaResource(MotivazionePerditaProprietaRepository motivazionePerditaProprietaRepository) {
        this.motivazionePerditaProprietaRepository = motivazionePerditaProprietaRepository;
    }

    /**
     * POST  /motivazione-perdita-proprietas : Create a new motivazionePerditaProprieta.
     *
     * @param motivazionePerditaProprieta the motivazionePerditaProprieta to create
     * @return the ResponseEntity with status 201 (Created) and with body the new motivazionePerditaProprieta, or with status 400 (Bad Request) if the motivazionePerditaProprieta has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/motivazione-perdita-proprietas")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<MotivazionePerditaProprieta> createMotivazionePerditaProprieta(@Valid @RequestBody MotivazionePerditaProprieta motivazionePerditaProprieta) throws URISyntaxException {
        log.debug("REST request to save MotivazionePerditaProprieta : {}", motivazionePerditaProprieta);
        if (motivazionePerditaProprieta.getId() != null) {
            throw new BadRequestAlertException("A new motivazionePerditaProprieta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MotivazionePerditaProprieta result = motivazionePerditaProprietaRepository.save(motivazionePerditaProprieta);
        return ResponseEntity.created(new URI("/api/motivazione-perdita-proprietas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /motivazione-perdita-proprietas : Updates an existing motivazionePerditaProprieta.
     *
     * @param motivazionePerditaProprieta the motivazionePerditaProprieta to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated motivazionePerditaProprieta,
     * or with status 400 (Bad Request) if the motivazionePerditaProprieta is not valid,
     * or with status 500 (Internal Server Error) if the motivazionePerditaProprieta couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/motivazione-perdita-proprietas")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<MotivazionePerditaProprieta> updateMotivazionePerditaProprieta(@Valid @RequestBody MotivazionePerditaProprieta motivazionePerditaProprieta) throws URISyntaxException {
        log.debug("REST request to update MotivazionePerditaProprieta : {}", motivazionePerditaProprieta);
        if (motivazionePerditaProprieta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MotivazionePerditaProprieta result = motivazionePerditaProprietaRepository.save(motivazionePerditaProprieta);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, motivazionePerditaProprieta.getId().toString()))
            .body(result);
    }

    /**
     * GET  /motivazione-perdita-proprietas : get all the motivazionePerditaProprietas.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of motivazionePerditaProprietas in body
     */
    @GetMapping("/motivazione-perdita-proprietas")
    @Timed
    public ResponseEntity<List<MotivazionePerditaProprieta>> getAllMotivazionePerditaProprietas(Pageable pageable) {
        log.debug("REST request to get a page of MotivazionePerditaProprietas");
        Page<MotivazionePerditaProprieta> page = motivazionePerditaProprietaRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/motivazione-perdita-proprietas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /motivazione-perdita-proprietas/:id : get the "id" motivazionePerditaProprieta.
     *
     * @param id the id of the motivazionePerditaProprieta to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the motivazionePerditaProprieta, or with status 404 (Not Found)
     */
    @GetMapping("/motivazione-perdita-proprietas/{id}")
    @Timed
    public ResponseEntity<MotivazionePerditaProprieta> getMotivazionePerditaProprieta(@PathVariable Long id) {
        log.debug("REST request to get MotivazionePerditaProprieta : {}", id);
        Optional<MotivazionePerditaProprieta> motivazionePerditaProprieta = motivazionePerditaProprietaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(motivazionePerditaProprieta);
    }

    /**
     * DELETE  /motivazione-perdita-proprietas/:id : delete the "id" motivazionePerditaProprieta.
     *
     * @param id the id of the motivazionePerditaProprieta to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/motivazione-perdita-proprietas/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Void> deleteMotivazionePerditaProprieta(@PathVariable Long id) {
        log.debug("REST request to delete MotivazionePerditaProprieta : {}", id);

        motivazionePerditaProprietaRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
