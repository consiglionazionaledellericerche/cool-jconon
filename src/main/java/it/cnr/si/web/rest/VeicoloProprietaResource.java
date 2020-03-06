package it.cnr.si.web.rest;

import com.codahale.metrics.annotation.Timed;
import it.cnr.si.domain.Veicolo;
import it.cnr.si.domain.VeicoloNoleggio;
import it.cnr.si.domain.VeicoloProprieta;
import it.cnr.si.service.AceService;
import it.cnr.si.service.dto.anagrafica.letture.EntitaOrganizzativaWebDto;
import it.cnr.si.service.dto.anagrafica.letture.PersonaWebDto;
import it.cnr.si.web.rest.errors.BadRequestAlertException;
import it.cnr.si.web.rest.util.HeaderUtil;
import it.cnr.si.web.rest.util.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import it.cnr.si.repository.VeicoloRepository;
import it.cnr.si.repository.VeicoloProprietaRepository;
import it.cnr.si.repository.VeicoloNoleggioRepository;
import it.cnr.si.security.AuthoritiesConstants;
import it.cnr.si.security.SecurityUtils;
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

import java.time.LocalDate;
import java.util.*;

/**
 * REST controller for managing VeicoloProprieta.
 */
@RestController
@RequestMapping("/api")
public class VeicoloProprietaResource {

    @Autowired
    private AceService ace;

    @Autowired
    private VeicoloRepository veicoloRepository;

    @Autowired
    private VeicoloNoleggioRepository veicoloNoleggioRepository;

    @Autowired
    private VeicoloProprietaRepository veicoloProprietaRepository;

    private String TARGA;

    private SecurityUtils securityUtils;

    private final Logger log = LoggerFactory.getLogger(VeicoloProprietaResource.class);

    private static final String ENTITY_NAME = "veicoloProprieta";

//    private final VeicoloProprietaRepository veicoloProprietaRepository;
//
//    public VeicoloProprietaResource(VeicoloProprietaRepository veicoloProprietaRepository) {
//        this.veicoloProprietaRepository = veicoloProprietaRepository;
//    }

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
        final Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();

        String sede_user = currentUserLogin.map(s -> ace.getPersonaByUsername(s)).map(PersonaWebDto::getSede).map(EntitaOrganizzativaWebDto::getDenominazione).orElse(null); //sede di username
        String sede_cdsuoUser = currentUserLogin.map(s -> ace.getPersonaByUsername(s)).map(PersonaWebDto::getSede).map(EntitaOrganizzativaWebDto::getCdsuo).orElse(null); //sede_cds di username
        String cds = Optional.ofNullable(sede_cdsuoUser).map(s -> s.substring(0, 3)).orElse(null); //passo solo i primi tre caratteri quindi cds
        /**
         * Codice che permette di salvare solo se sei
         * la persona corretta
         *
         */
        boolean hasPermission = false;

        if (Optional.ofNullable(cds).filter(s -> s.equals("000")).isPresent() || !currentUserLogin.isPresent())
            hasPermission = true;
        else {
            // TelefonoServizi t = telefonoServiziRepository.getOne(telefonoServizi.getId());
            String t = veicoloProprieta.getVeicolo().getIstituto();
            hasPermission = sede_user.equals(t);
        }
        //   System.out.print("Che valore hai true o false? "+hasPermission);
        if (hasPermission) {
            VeicoloProprieta result = veicoloProprietaRepository.save(veicoloProprieta);
            return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, veicoloProprieta.getId().toString()))
                .body(result);
        } else
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
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
        final Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();

        String sede_user = currentUserLogin.map(s -> ace.getPersonaByUsername(s)).map(PersonaWebDto::getSede).map(EntitaOrganizzativaWebDto::getDenominazione).orElse(null); //sede di username
        String sede_cdsuoUser = currentUserLogin.map(s -> ace.getPersonaByUsername(s)).map(PersonaWebDto::getSede).map(EntitaOrganizzativaWebDto::getCdsuo).orElse(null); //sede_cds di username
        String cds = Optional.ofNullable(sede_cdsuoUser).map(s -> s.substring(0, 3)).orElse(null); //passo solo i primi tre caratteri quindi cds

        Page<VeicoloProprieta> page;
        if (Optional.ofNullable(cds).filter(s -> s.equals("000")).isPresent() || !currentUserLogin.isPresent())
            page = veicoloProprietaRepository.findAllActive(false,pageable);
        else
            page = veicoloProprietaRepository.findByIstitutoAndDeleted(sede_user,false, pageable);

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
        TARGA = veicoloProprietaRepository.findById(id).get().getVeicolo().getTarga();
        //findVeicolo(targa);
        return ResponseUtil.wrapOrNotFound(veicoloProprieta);
    }

    /**
     * DELETE  /veicolo-proprietas/:id : delete the "id" veicoloProprieta.
     *
     * @param id the id of the veicoloProprieta to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/veicolo-proprietas/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Void> deleteVeicoloProprieta(@PathVariable Long id) {
        log.debug("REST request to delete VeicoloProprieta : {}", id);

        veicoloProprietaRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    //Per richiamare Veicoli
    @GetMapping("/veicolo-proprietas/findVeicolo")
    @Timed
    public ResponseEntity<List<Veicolo>> findVeicolo() {

        List<Veicolo> veicoliRimasti;

        List<Veicolo> veicoli;

        List<VeicoloProprieta> allVeicoliProprieta;

        List<VeicoloNoleggio> allVeicoliNoleggio;

        System.out.print("targa=== "+TARGA);

//        String sede_user = ace.getPersonaByUsername("gaetana.irrera").getSede().getDenominazione(); //sede di username
//        String sede_cdsuoUser = ace.getPersonaByUsername("gaetana.irrera").getSede().getCdsuo(); //sede_cds di username
        String sede_user = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getDenominazione(); //sede di username
        String sede_cdsuoUser = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getCdsuo(); //sede_cds di username
        String cds = sede_cdsuoUser.substring(0,3); //passo solo i primi tre caratteri quindi cds




        if (cds.equals("000")) {
            veicoliRimasti = veicoloRepository.findByDeletedFalse();
            veicoli = veicoloRepository.findByDeletedFalse();
        }
        else {
            veicoliRimasti = veicoloRepository.findByIstitutoAndDeleted(sede_user, false);
            veicoli = veicoloRepository.findByIstitutoAndDeleted(sede_user, false);
        }
        if(TARGA != null){
            System.out.print("targa=== "+TARGA+" SOONO ENTRATO IN MODIFICA");
            Iterator i =  veicoli.iterator();
            while(i.hasNext()){
                Object v = (Veicolo) i.next();
                if(((Veicolo) v).getTarga().equals(TARGA)){
                }
                else{
                    veicoliRimasti.remove(v);
                }
            }
        }
        else{
            allVeicoliProprieta = veicoloProprietaRepository.findAllActive(false);
            allVeicoliNoleggio = veicoloNoleggioRepository.findAllActive(false);
            System.out.print("targa=== "+TARGA+" SOONO ENTRATO IN INSERIMENTO");
            Iterator i =  veicoli.iterator();
            while(i.hasNext()){
                Object v = (Veicolo) i.next();
                Iterator iavp =  allVeicoliProprieta.iterator();
                Iterator iavn =  allVeicoliNoleggio.iterator();
                while(iavp.hasNext()){
                    Object vp = (VeicoloProprieta) iavp.next();
                    if(((VeicoloProprieta) vp).getVeicolo().getTarga().equals(((Veicolo) v).getTarga())){
                        veicoliRimasti.remove(v);
                    }
                }
                while(iavn.hasNext()){
                    Object vn = (VeicoloNoleggio) iavn.next();
                    if(((VeicoloNoleggio) vn).getVeicolo().getTarga().equals(((Veicolo) v).getTarga())){
                        veicoliRimasti.remove(v);
                    }
                }

            }
        }

        return ResponseEntity.ok(veicoliRimasti);
    }

}
