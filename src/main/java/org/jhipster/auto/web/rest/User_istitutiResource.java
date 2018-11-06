package org.jhipster.auto.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.auto.domain.User_istituti;
import org.jhipster.auto.repository.User_istitutiRepository;
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
 * REST controller for managing User_istituti.
 */
@RestController
@RequestMapping("/api")
public class User_istitutiResource {

    private final Logger log = LoggerFactory.getLogger(User_istitutiResource.class);

    private static final String ENTITY_NAME = "user_istituti";

    private final User_istitutiRepository user_istitutiRepository;

    public User_istitutiResource(User_istitutiRepository user_istitutiRepository) {
        this.user_istitutiRepository = user_istitutiRepository;
    }

    /**
     * POST  /user-istitutis : Create a new user_istituti.
     *
     * @param user_istituti the user_istituti to create
     * @return the ResponseEntity with status 201 (Created) and with body the new user_istituti, or with status 400 (Bad Request) if the user_istituti has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/user-istitutis")
    @Timed
    public ResponseEntity<User_istituti> createUser_istituti(@Valid @RequestBody User_istituti user_istituti) throws URISyntaxException {
        log.debug("REST request to save User_istituti : {}", user_istituti);
        if (user_istituti.getId() != null) {
            throw new BadRequestAlertException("A new user_istituti cannot already have an ID", ENTITY_NAME, "idexists");
        }
        User_istituti result = user_istitutiRepository.save(user_istituti);
        return ResponseEntity.created(new URI("/api/user-istitutis/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /user-istitutis : Updates an existing user_istituti.
     *
     * @param user_istituti the user_istituti to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated user_istituti,
     * or with status 400 (Bad Request) if the user_istituti is not valid,
     * or with status 500 (Internal Server Error) if the user_istituti couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/user-istitutis")
    @Timed
    public ResponseEntity<User_istituti> updateUser_istituti(@Valid @RequestBody User_istituti user_istituti) throws URISyntaxException {
        log.debug("REST request to update User_istituti : {}", user_istituti);
        if (user_istituti.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        User_istituti result = user_istitutiRepository.save(user_istituti);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, user_istituti.getId().toString()))
            .body(result);
    }

    /**
     * GET  /user-istitutis : get all the user_istitutis.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of user_istitutis in body
     */
    @GetMapping("/user-istitutis")
    @Timed
    public ResponseEntity<List<User_istituti>> getAllUser_istitutis(Pageable pageable) {
        log.debug("REST request to get a page of User_istitutis");
        Page<User_istituti> page = user_istitutiRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/user-istitutis");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /user-istitutis/:id : get the "id" user_istituti.
     *
     * @param id the id of the user_istituti to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the user_istituti, or with status 404 (Not Found)
     */
    @GetMapping("/user-istitutis/{id}")
    @Timed
    public ResponseEntity<User_istituti> getUser_istituti(@PathVariable Long id) {
        log.debug("REST request to get User_istituti : {}", id);
        Optional<User_istituti> user_istituti = user_istitutiRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(user_istituti);
    }

    /**
     * DELETE  /user-istitutis/:id : delete the "id" user_istituti.
     *
     * @param id the id of the user_istituti to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/user-istitutis/{id}")
    @Timed
    public ResponseEntity<Void> deleteUser_istituti(@PathVariable Long id) {
        log.debug("REST request to delete User_istituti : {}", id);

        user_istitutiRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
