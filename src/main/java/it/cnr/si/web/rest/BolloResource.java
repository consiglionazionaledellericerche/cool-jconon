package it.cnr.si.web.rest;

import com.codahale.metrics.annotation.Timed;
import it.cnr.si.domain.Bollo;
import it.cnr.si.repository.BolloRepository;
import it.cnr.si.service.MailService;
import it.cnr.si.web.rest.errors.BadRequestAlertException;
import it.cnr.si.web.rest.util.HeaderUtil;
import it.cnr.si.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
 * REST controller for managing Bollo.
 */
@RestController
@RequestMapping("/api")
public class BolloResource {

    private final Logger log = LoggerFactory.getLogger(BolloResource.class);

    private static final String ENTITY_NAME = "bollo";

    private final BolloRepository bolloRepository;

    @Autowired
    private MailService mailService;

    public BolloResource(BolloRepository bolloRepository) {
        this.bolloRepository = bolloRepository;
    }

    /**
     * POST  /bollos : Create a new bollo.
     *
     * @param bollo the bollo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new bollo, or with status 400 (Bad Request) if the bollo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/bollos")
    @Timed
    public ResponseEntity<Bollo> createBollo(@Valid @RequestBody Bollo bollo) throws URISyntaxException {
        log.debug("REST request to save Bollo : {}", bollo);
        if (bollo.getId() != null) {
            throw new BadRequestAlertException("A new bollo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String data = bollo.getDataScadenza().toString().substring(0,10);
        String testo = "Controllare procedura Parco Auto CNR che è stato inserito un bollo da pagare per la vettura ("+bollo.getVeicolo().getTarga()+") in data:"+data+". \n \n Procedura Parco Auto CNR";
        String mail = bollo.getVeicolo().getResponsabile().toString()+"@cnr.it";
        log.debug("Bollo mail a chi va: {}", mail);
        //da cancellare poi
        //mail = "valerio.diego@cnr.it";

        //TODO: inserire email parcoauto
        mailService.sendEmail(mail,"inserito bollo da pagare in procedura",testo,false,false);
        //Fine mandare email
        Bollo result = bolloRepository.save(bollo);
        return ResponseEntity.created(new URI("/api/bollos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /bollos : Updates an existing bollo.
     *
     * @param bollo the bollo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated bollo,
     * or with status 400 (Bad Request) if the bollo is not valid,
     * or with status 500 (Internal Server Error) if the bollo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/bollos")
    @Timed
    public ResponseEntity<Bollo> updateBollo(@Valid @RequestBody Bollo bollo) throws URISyntaxException {
        log.debug("REST request to update Bollo : {}", bollo);
        if (bollo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Bollo result = bolloRepository.save(bollo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, bollo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /bollos : get all the bollos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of bollos in body
     */
    @GetMapping("/bollos")
    @Timed
    public ResponseEntity<List<Bollo>> getAllBollos(Pageable pageable) {
        log.debug("REST request to get a page of Bollos");
        Page<Bollo> page = bolloRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/bollos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /bollos/:id : get the "id" bollo.
     *
     * @param id the id of the bollo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the bollo, or with status 404 (Not Found)
     */
    @GetMapping("/bollos/{id}")
    @Timed
    public ResponseEntity<Bollo> getBollo(@PathVariable Long id) {
        log.debug("REST request to get Bollo : {}", id);
        Optional<Bollo> bollo = bolloRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bollo);
    }

    /**
     * DELETE  /bollos/:id : delete the "id" bollo.
     *
     * @param id the id of the bollo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/bollos/{id}")
    @Timed
    public ResponseEntity<Void> deleteBollo(@PathVariable Long id) {
        log.debug("REST request to delete Bollo : {}", id);

        bolloRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
