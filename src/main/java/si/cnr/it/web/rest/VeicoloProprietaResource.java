package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import si.cnr.it.domain.VeicoloProprieta;
import si.cnr.it.repository.VeicoloProprietaRepository;
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
 * REST controller for managing VeicoloProprieta.
 */
@RestController
@RequestMapping("/api")
public class VeicoloProprietaResource {

    private final Logger log = LoggerFactory.getLogger(VeicoloProprietaResource.class);

    private static final String ENTITY_NAME = "veicoloProprieta";

    private final VeicoloProprietaRepository veicoloProprietaRepository;

    public VeicoloProprietaResource(VeicoloProprietaRepository veicoloProprietaRepository) {
        this.veicoloProprietaRepository = veicoloProprietaRepository;
    }

    /**
     * POST  /veicolo-proprietas : Create a new veicoloProprieta.
     *
     * @param veicoloProprieta the veicoloProprieta to create
     * @return the ResponseEntity with status 201 (Created) and with body the new veicoloProprieta, or with status 400 (Bad Request) if the veicoloProprieta has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/veicolo-proprietas")
    @Timed
    public ResponseEntity<VeicoloProprieta> createVeicoloProprieta(@Valid @RequestBody VeicoloProprieta veicoloProprieta) throws URISyntaxException {
        log.debug("REST request to save VeicoloProprieta : {}", veicoloProprieta);
        if (veicoloProprieta.getId() != null) {
            throw new BadRequestAlertException("A new veicoloProprieta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VeicoloProprieta result = veicoloProprietaRepository.save(veicoloProprieta);
        return ResponseEntity.created(new URI("/api/veicolo-proprietas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /veicolo-proprietas : Updates an existing veicoloProprieta.
     *
     * @param veicoloProprieta the veicoloProprieta to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated veicoloProprieta,
     * or with status 400 (Bad Request) if the veicoloProprieta is not valid,
     * or with status 500 (Internal Server Error) if the veicoloProprieta couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/veicolo-proprietas")
    @Timed
    public ResponseEntity<VeicoloProprieta> updateVeicoloProprieta(@Valid @RequestBody VeicoloProprieta veicoloProprieta) throws URISyntaxException {
        log.debug("REST request to update VeicoloProprieta : {}", veicoloProprieta);
        if (veicoloProprieta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        VeicoloProprieta result = veicoloProprietaRepository.save(veicoloProprieta);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, veicoloProprieta.getId().toString()))
            .body(result);
    }

    /**
     * GET  /veicolo-proprietas : get all the veicoloProprietas.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of veicoloProprietas in body
     */
    @GetMapping("/veicolo-proprietas")
    @Timed
    public ResponseEntity<List<VeicoloProprieta>> getAllVeicoloProprietas(Pageable pageable) {
        log.debug("REST request to get a page of VeicoloProprietas");
        Page<VeicoloProprieta> page = veicoloProprietaRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/veicolo-proprietas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /veicolo-proprietas/:id : get the "id" veicoloProprieta.
     *
     * @param id the id of the veicoloProprieta to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the veicoloProprieta, or with status 404 (Not Found)
     */
    @GetMapping("/veicolo-proprietas/{id}")
    @Timed
    public ResponseEntity<VeicoloProprieta> getVeicoloProprieta(@PathVariable Long id) {
        log.debug("REST request to get VeicoloProprieta : {}", id);
        Optional<VeicoloProprieta> veicoloProprieta = veicoloProprietaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(veicoloProprieta);
    }

    /**
     * DELETE  /veicolo-proprietas/:id : delete the "id" veicoloProprieta.
     *
     * @param id the id of the veicoloProprieta to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/veicolo-proprietas/{id}")
    @Timed
    public ResponseEntity<Void> deleteVeicoloProprieta(@PathVariable Long id) {
        log.debug("REST request to delete VeicoloProprieta : {}", id);

        veicoloProprietaRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
