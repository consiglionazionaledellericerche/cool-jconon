package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import si.cnr.it.domain.MotivazioneperditaProprieta;
import si.cnr.it.repository.MotivazioneperditaProprietaRepository;
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
 * REST controller for managing MotivazioneperditaProprieta.
 */
@RestController
@RequestMapping("/api")
public class MotivazioneperditaProprietaResource {

    private final Logger log = LoggerFactory.getLogger(MotivazioneperditaProprietaResource.class);

    private static final String ENTITY_NAME = "motivazioneperditaProprieta";

    private final MotivazioneperditaProprietaRepository motivazioneperditaProprietaRepository;

    public MotivazioneperditaProprietaResource(MotivazioneperditaProprietaRepository motivazioneperditaProprietaRepository) {
        this.motivazioneperditaProprietaRepository = motivazioneperditaProprietaRepository;
    }

    /**
     * POST  /motivazioneperdita-proprietas : Create a new motivazioneperditaProprieta.
     *
     * @param motivazioneperditaProprieta the motivazioneperditaProprieta to create
     * @return the ResponseEntity with status 201 (Created) and with body the new motivazioneperditaProprieta, or with status 400 (Bad Request) if the motivazioneperditaProprieta has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/motivazioneperdita-proprietas")
    @Timed
    public ResponseEntity<MotivazioneperditaProprieta> createMotivazioneperditaProprieta(@Valid @RequestBody MotivazioneperditaProprieta motivazioneperditaProprieta) throws URISyntaxException {
        log.debug("REST request to save MotivazioneperditaProprieta : {}", motivazioneperditaProprieta);
        if (motivazioneperditaProprieta.getId() != null) {
            throw new BadRequestAlertException("A new motivazioneperditaProprieta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MotivazioneperditaProprieta result = motivazioneperditaProprietaRepository.save(motivazioneperditaProprieta);
        return ResponseEntity.created(new URI("/api/motivazioneperdita-proprietas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /motivazioneperdita-proprietas : Updates an existing motivazioneperditaProprieta.
     *
     * @param motivazioneperditaProprieta the motivazioneperditaProprieta to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated motivazioneperditaProprieta,
     * or with status 400 (Bad Request) if the motivazioneperditaProprieta is not valid,
     * or with status 500 (Internal Server Error) if the motivazioneperditaProprieta couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/motivazioneperdita-proprietas")
    @Timed
    public ResponseEntity<MotivazioneperditaProprieta> updateMotivazioneperditaProprieta(@Valid @RequestBody MotivazioneperditaProprieta motivazioneperditaProprieta) throws URISyntaxException {
        log.debug("REST request to update MotivazioneperditaProprieta : {}", motivazioneperditaProprieta);
        if (motivazioneperditaProprieta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MotivazioneperditaProprieta result = motivazioneperditaProprietaRepository.save(motivazioneperditaProprieta);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, motivazioneperditaProprieta.getId().toString()))
            .body(result);
    }

    /**
     * GET  /motivazioneperdita-proprietas : get all the motivazioneperditaProprietas.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of motivazioneperditaProprietas in body
     */
    @GetMapping("/motivazioneperdita-proprietas")
    @Timed
    public ResponseEntity<List<MotivazioneperditaProprieta>> getAllMotivazioneperditaProprietas(Pageable pageable) {
        log.debug("REST request to get a page of MotivazioneperditaProprietas");
        Page<MotivazioneperditaProprieta> page = motivazioneperditaProprietaRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/motivazioneperdita-proprietas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /motivazioneperdita-proprietas/:id : get the "id" motivazioneperditaProprieta.
     *
     * @param id the id of the motivazioneperditaProprieta to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the motivazioneperditaProprieta, or with status 404 (Not Found)
     */
    @GetMapping("/motivazioneperdita-proprietas/{id}")
    @Timed
    public ResponseEntity<MotivazioneperditaProprieta> getMotivazioneperditaProprieta(@PathVariable Long id) {
        log.debug("REST request to get MotivazioneperditaProprieta : {}", id);
        Optional<MotivazioneperditaProprieta> motivazioneperditaProprieta = motivazioneperditaProprietaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(motivazioneperditaProprieta);
    }

    /**
     * DELETE  /motivazioneperdita-proprietas/:id : delete the "id" motivazioneperditaProprieta.
     *
     * @param id the id of the motivazioneperditaProprieta to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/motivazioneperdita-proprietas/{id}")
    @Timed
    public ResponseEntity<Void> deleteMotivazioneperditaProprieta(@PathVariable Long id) {
        log.debug("REST request to delete MotivazioneperditaProprieta : {}", id);

        motivazioneperditaProprietaRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
