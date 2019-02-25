package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import it.cnr.si.service.AceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import si.cnr.it.domain.LibrettoPercorrenzaVeicolo;
import si.cnr.it.domain.Veicolo;
import si.cnr.it.repository.VeicoloRepository;
import si.cnr.it.repository.LibrettoPercorrenzaVeicoloRepository;
import si.cnr.it.security.AuthoritiesConstants;
import si.cnr.it.security.SecurityUtils;
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
 * REST controller for managing LibrettoPercorrenzaVeicolo.
 */
@RestController
@RequestMapping("/api")
public class LibrettoPercorrenzaVeicoloResource {

    @Autowired
    private AceService ace;

    @Autowired
    private VeicoloRepository veicoloRepository;

    @Autowired
    private LibrettoPercorrenzaVeicoloRepository librettoPercorrenzaVeicoloRepository;

    private SecurityUtils securityUtils;

    private final Logger log = LoggerFactory.getLogger(LibrettoPercorrenzaVeicoloResource.class);

    private static final String ENTITY_NAME = "librettoPercorrenzaVeicolo";

//    private final LibrettoPercorrenzaVeicoloRepository librettoPercorrenzaVeicoloRepository;
//
//    public LibrettoPercorrenzaVeicoloResource(LibrettoPercorrenzaVeicoloRepository librettoPercorrenzaVeicoloRepository) {
//        this.librettoPercorrenzaVeicoloRepository = librettoPercorrenzaVeicoloRepository;
//    }

    /**
     * POST  /libretto-percorrenza-veicolos : Create a new librettoPercorrenzaVeicolo.
     *
     * @param librettoPercorrenzaVeicolo the librettoPercorrenzaVeicolo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new librettoPercorrenzaVeicolo, or with status 400 (Bad Request) if the librettoPercorrenzaVeicolo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/libretto-percorrenza-veicolos")
    @Timed
    public ResponseEntity<LibrettoPercorrenzaVeicolo> createLibrettoPercorrenzaVeicolo(@Valid @RequestBody LibrettoPercorrenzaVeicolo librettoPercorrenzaVeicolo) throws URISyntaxException {
        log.debug("REST request to save LibrettoPercorrenzaVeicolo : {}", librettoPercorrenzaVeicolo);
        if (librettoPercorrenzaVeicolo.getId() != null) {
            throw new BadRequestAlertException("A new librettoPercorrenzaVeicolo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LibrettoPercorrenzaVeicolo result = librettoPercorrenzaVeicoloRepository.save(librettoPercorrenzaVeicolo);
        return ResponseEntity.created(new URI("/api/libretto-percorrenza-veicolos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /libretto-percorrenza-veicolos : Updates an existing librettoPercorrenzaVeicolo.
     *
     * @param librettoPercorrenzaVeicolo the librettoPercorrenzaVeicolo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated librettoPercorrenzaVeicolo,
     * or with status 400 (Bad Request) if the librettoPercorrenzaVeicolo is not valid,
     * or with status 500 (Internal Server Error) if the librettoPercorrenzaVeicolo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/libretto-percorrenza-veicolos")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<LibrettoPercorrenzaVeicolo> updateLibrettoPercorrenzaVeicolo(@Valid @RequestBody LibrettoPercorrenzaVeicolo librettoPercorrenzaVeicolo) throws URISyntaxException {
        log.debug("REST request to update LibrettoPercorrenzaVeicolo : {}", librettoPercorrenzaVeicolo);
        if (librettoPercorrenzaVeicolo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        //        String sede_user = ace.getPersonaByUsername("gaetana.irrera").getSede().getDenominazione(); //sede di username
//        String sede_cdsuoUser = ace.getPersonaByUsername("gaetana.irrera").getSede().getCdsuo(); //sede_cds di username
        String sede_user = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getDenominazione(); //sede di username
        String sede_cdsuoUser = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getCdsuo(); //sede_cds di username
        String cds = sede_cdsuoUser.substring(0,3); //passo solo i primi tre caratteri quindi cds
/**
 * Codice che permette di salvare solo se sei
 * la persona corretta
 *
 */
        boolean hasPermission = false;

        if (cds.equals("000"))
            hasPermission = true;
        else {
            // TelefonoServizi t = telefonoServiziRepository.getOne(telefonoServizi.getId());
            String t = librettoPercorrenzaVeicolo.getVeicolo().getIstituto();
            hasPermission = sede_user.equals(t);
        }
        //   System.out.print("Che valore hai true o false? "+hasPermission);
        if (hasPermission) {
            LibrettoPercorrenzaVeicolo result = librettoPercorrenzaVeicoloRepository.save(librettoPercorrenzaVeicolo);
            return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, librettoPercorrenzaVeicolo.getId().toString()))
                .body(result);
        } else
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    /**
     * GET  /libretto-percorrenza-veicolos : get all the librettoPercorrenzaVeicolos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of librettoPercorrenzaVeicolos in body
     */
    @GetMapping("/libretto-percorrenza-veicolos")
    @Timed
    public ResponseEntity<List<LibrettoPercorrenzaVeicolo>> getAllLibrettoPercorrenzaVeicolos(Pageable pageable) {
        log.debug("REST request to get a page of LibrettoPercorrenzaVeicolos");


//        String sede_user = ace.getPersonaByUsername("gaetana.irrera").getSede().getDenominazione(); //sede di username
//        String sede_cdsuoUser = ace.getPersonaByUsername("gaetana.irrera").getSede().getCdsuo(); //sede_cds di username
        String sede_user = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getDenominazione(); //sede di username
        String sede_cdsuoUser = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getCdsuo(); //sede_cds di username
        String cds = sede_cdsuoUser.substring(0,3); //passo solo i primi tre caratteri quindi cds

        Page<LibrettoPercorrenzaVeicolo> page;
        if (cds.equals("000"))
            page = librettoPercorrenzaVeicoloRepository.findByDeleted(false,pageable);
        else
            page = librettoPercorrenzaVeicoloRepository.findByIstitutoAndDeteled(sede_user,false, pageable);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/libretto-percorrenza-veicolos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /libretto-percorrenza-veicolos/:id : get the "id" librettoPercorrenzaVeicolo.
     *
     * @param id the id of the librettoPercorrenzaVeicolo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the librettoPercorrenzaVeicolo, or with status 404 (Not Found)
     */
    @GetMapping("/libretto-percorrenza-veicolos/{id}")
    @Timed
    public ResponseEntity<LibrettoPercorrenzaVeicolo> getLibrettoPercorrenzaVeicolo(@PathVariable Long id) {
        log.debug("REST request to get LibrettoPercorrenzaVeicolo : {}", id);
        Optional<LibrettoPercorrenzaVeicolo> librettoPercorrenzaVeicolo = librettoPercorrenzaVeicoloRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(librettoPercorrenzaVeicolo);
    }

    /**
     * DELETE  /libretto-percorrenza-veicolos/:id : delete the "id" librettoPercorrenzaVeicolo.
     *
     * @param id the id of the librettoPercorrenzaVeicolo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/libretto-percorrenza-veicolos/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Void> deleteLibrettoPercorrenzaVeicolo(@PathVariable Long id) {
        log.debug("REST request to delete LibrettoPercorrenzaVeicolo : {}", id);

        librettoPercorrenzaVeicoloRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    //Per richiamare Veicoli
    @GetMapping("/libretto-percorrenza-veicolos/findVeicolo")
    @Timed
    public ResponseEntity<List<Veicolo>> findVeicolo() {

        List<Veicolo> veicoli;

//        String sede_user = ace.getPersonaByUsername("gaetana.irrera").getSede().getDenominazione(); //sede di username
//        String sede_cdsuoUser = ace.getPersonaByUsername("gaetana.irrera").getSede().getCdsuo(); //sede_cds di username
        String sede_user = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getDenominazione(); //sede di username
        String sede_cdsuoUser = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getCdsuo(); //sede_cds di username
        String cds = sede_cdsuoUser.substring(0,3); //passo solo i primi tre caratteri quindi cds

        if (cds.equals("000"))
            veicoli = veicoloRepository.findByDeletedFalse();
        else
            veicoli = veicoloRepository.findByIstitutoAndDeleted(sede_user,false);


        return ResponseEntity.ok(veicoli);
    }
}
