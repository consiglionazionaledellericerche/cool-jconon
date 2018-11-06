package org.jhipster.auto.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.auto.domain.User_auto;
import org.jhipster.auto.repository.User_autoRepository;
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

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing User_auto.
 */
@RestController
@RequestMapping("/api")
public class User_autoResource {

    private final Logger log = LoggerFactory.getLogger(User_autoResource.class);

    private static final String ENTITY_NAME = "user_auto";

    private final User_autoRepository user_autoRepository;

    public User_autoResource(User_autoRepository user_autoRepository) {
        this.user_autoRepository = user_autoRepository;
    }

    /**
     * POST  /user-autos : Create a new user_auto.
     *
     * @param user_auto the user_auto to create
     * @return the ResponseEntity with status 201 (Created) and with body the new user_auto, or with status 400 (Bad Request) if the user_auto has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/user-autos")
    @Timed
    public ResponseEntity<User_auto> createUser_auto(@RequestBody User_auto user_auto) throws URISyntaxException {
        log.debug("REST request to save User_auto : {}", user_auto);
        if (user_auto.getId() != null) {
            throw new BadRequestAlertException("A new user_auto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        User_auto result = user_autoRepository.save(user_auto);
        return ResponseEntity.created(new URI("/api/user-autos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /user-autos : Updates an existing user_auto.
     *
     * @param user_auto the user_auto to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated user_auto,
     * or with status 400 (Bad Request) if the user_auto is not valid,
     * or with status 500 (Internal Server Error) if the user_auto couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/user-autos")
    @Timed
    public ResponseEntity<User_auto> updateUser_auto(@RequestBody User_auto user_auto) throws URISyntaxException {
        log.debug("REST request to update User_auto : {}", user_auto);
        if (user_auto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        User_auto result = user_autoRepository.save(user_auto);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, user_auto.getId().toString()))
            .body(result);
    }

    /**
     * GET  /user-autos : get all the user_autos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of user_autos in body
     */
    @GetMapping("/user-autos")
    @Timed
    public ResponseEntity<List<User_auto>> getAllUser_autos(Pageable pageable) {
        log.debug("REST request to get a page of User_autos");
        Page<User_auto> page = user_autoRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/user-autos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /user-autos/:id : get the "id" user_auto.
     *
     * @param id the id of the user_auto to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the user_auto, or with status 404 (Not Found)
     */
    @GetMapping("/user-autos/{id}")
    @Timed
    public ResponseEntity<User_auto> getUser_auto(@PathVariable Long id) {
        log.debug("REST request to get User_auto : {}", id);
        Optional<User_auto> user_auto = user_autoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(user_auto);
    }

    /**
     * DELETE  /user-autos/:id : delete the "id" user_auto.
     *
     * @param id the id of the user_auto to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/user-autos/{id}")
    @Timed
    public ResponseEntity<Void> deleteUser_auto(@PathVariable Long id) {
        log.debug("REST request to delete User_auto : {}", id);

        user_autoRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
