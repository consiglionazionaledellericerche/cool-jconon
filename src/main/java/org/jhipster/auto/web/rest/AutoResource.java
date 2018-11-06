package org.jhipster.auto.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.auto.domain.*;
import org.jhipster.auto.repository.AutoRepository;
//import org.jhipster.auto.repository.User_istitutiRepository;
import org.jhipster.auto.security.SecurityUtils;
import org.jhipster.auto.web.rest.errors.BadRequestAlertException;
import org.jhipster.auto.web.rest.util.HeaderUtil;
import org.jhipster.auto.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Auto.
 */
@RestController
@RequestMapping("/api")
public class AutoResource {

    private final Logger log = LoggerFactory.getLogger(AutoResource.class);

    private static final String ENTITY_NAME = "auto";

    private final AutoRepository autoRepository;

    public AutoResource(AutoRepository autoRepository) {
        this.autoRepository = autoRepository;
    }

    /**
     * POST  /autos : Create a new auto.
     *
     * @param auto the auto to create
     * @return the ResponseEntity with status 201 (Created) and with body the new auto, or with status 400 (Bad Request) if the auto has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/autos")
    @Timed
    public ResponseEntity<Auto> createAuto(@Valid @RequestBody Auto auto) throws URISyntaxException {
        log.debug("REST request to save Auto : {}", auto);
        if (auto.getId() != null) {
            throw new BadRequestAlertException("A new auto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Auto result = autoRepository.save(auto);
        return ResponseEntity.created(new URI("/api/autos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /autos : Updates an existing auto.
     *
     * @param auto the auto to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated auto,
     * or with status 400 (Bad Request) if the auto is not valid,
     * or with status 500 (Internal Server Error) if the auto couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/autos")
    @Timed
    public ResponseEntity<Auto> updateAuto(@Valid @RequestBody Auto auto) throws URISyntaxException {
        log.debug("REST request to update Auto : {}", auto);
        if (auto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Auto result = autoRepository.save(auto);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, auto.getId().toString()))
            .body(result);
    }

    /**
     * GET  /autos : get all the autos.
     *
     /** @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of autos in body
     */
    @GetMapping("/autos")
    @Timed
    public ResponseEntity<List<Auto>> getAllAutos(Pageable pageable) {
        log.debug("REST request to get a page of Autos");
        String user = "";
        String cds;
        Page<Auto> page = autoRepository.findAll(pageable);
        //System.out.print("provaaaaaa"+page.getContent()+"fine");
        List<Auto> tab;
        Optional<String> username = SecurityUtils.getCurrentUserLogin();
        if (username.isPresent()){
            user = username.get();
        }
       // tab = autoRepository.findByUserIsCurrentUser(); come era



        User usern = new User(); //istanzio User
        usern.setLogin(user);

        if(user.equals("admin")){
            tab = page.getContent();
        }
        else {
            cds = autoRepository.findIstituto();

            tab = autoRepository.findByCds(cds);
        }
/*
        Auto auto = new Auto(); //istanzio Auto
        auto.user(usern);

        Istituti istitut = new Istituti(); //istanzio Istituti
        istitut.setCds("080");
        auto.setCds(istitut);*/
      //  System.out.print("provaaaaaa"+cds+"fine001");
        //System.out.print("provaaaaaa"+auto.getCds()+"fine001");

        //tab = autoRepository.findByCds(Auto.getCds());
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/autos");
        //return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
        return new ResponseEntity<>(tab, headers, HttpStatus.OK);
    }

    /**
     * GET  /autos/:id : get the "id" auto.
     *
     * @param id the id of the auto to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the auto, or with status 404 (Not Found)
     */
    @GetMapping("/autos/{id}")
    @Timed
    public ResponseEntity<?> getAuto(@PathVariable Long id) {
        log.debug("REST request to get Auto : {}", id);
        Optional<Auto> auto = autoRepository.findById(id);
        if(auto.isPresent() && auto.get().getUser() != null &&
            !auto.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))){
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        return ResponseUtil.wrapOrNotFound(auto);
    }
    /*public ResponseEntity<Auto> getAuto(@PathVariable Long id) {
        log.debug("REST request to get Auto : {}", id);
        Optional<Auto> auto = autoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(auto);
    }*/

    /**
     * DELETE  /autos/:id : delete the "id" auto.
     *
     * @param id the id of the auto to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/autos/{id}")
    @Timed
    public ResponseEntity<Void> deleteAuto(@PathVariable Long id) {
        log.debug("REST request to delete Auto : {}", id);

        autoRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
