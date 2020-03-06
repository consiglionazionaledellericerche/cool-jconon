package it.cnr.si.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import it.cnr.si.domain.Veicolo;
import it.cnr.si.domain.VeicoloNoleggio;
import it.cnr.si.domain.VeicoloProprieta;
import it.cnr.si.repository.VeicoloNoleggioRepository;
import it.cnr.si.repository.VeicoloProprietaRepository;
import it.cnr.si.repository.VeicoloRepository;
import it.cnr.si.security.AuthoritiesConstants;
import it.cnr.si.security.SecurityUtils;
import it.cnr.si.service.AceService;
import it.cnr.si.service.dto.anagrafica.letture.EntitaOrganizzativaWebDto;
import it.cnr.si.service.dto.anagrafica.letture.PersonaWebDto;
import it.cnr.si.web.rest.errors.BadRequestAlertException;
import it.cnr.si.web.rest.util.HeaderUtil;
import it.cnr.si.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing VeicoloNoleggio.
 */
@RestController
@RequestMapping("/api")
public class VeicoloNoleggioResource {

    private static final String ENTITY_NAME = "veicoloNoleggio";
    private final Logger log = LoggerFactory.getLogger(VeicoloNoleggioResource.class);
    @Autowired
    private AceService ace;
    @Autowired
    private VeicoloRepository veicoloRepository;
    @Autowired
    private VeicoloProprietaRepository veicoloProprietaRepository;
    @Autowired
    private VeicoloNoleggioRepository veicoloNoleggioRepository;
    private String TARGA;
    private SecurityUtils securityUtils;
    @Value("${cnr.cds.sac}")
    private String cdsSAC;
//    private final VeicoloNoleggioRepository veicoloNoleggioRepository;
//
//    public VeicoloNoleggioResource(VeicoloNoleggioRepository veicoloNoleggioRepository) {
//        this.veicoloNoleggioRepository = veicoloNoleggioRepository;
//    }

    /**
     * POST  /veicolo-noleggios : Create a new veicoloNoleggio.
     *
     * @param veicoloNoleggio the veicoloNoleggio to create
     * @return the ResponseEntity with status 201 (Created) and with body the new veicoloNoleggio, or with status 400 (Bad Request) if the veicoloNoleggio has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/veicolo-noleggios")
    @Timed
    public ResponseEntity<VeicoloNoleggio> createVeicoloNoleggio(@Valid @RequestBody VeicoloNoleggio veicoloNoleggio) throws URISyntaxException {
        log.debug("REST request to save VeicoloNoleggio : {}", veicoloNoleggio);
        if (veicoloNoleggio.getId() != null) {
            throw new BadRequestAlertException("A new veicoloNoleggio cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VeicoloNoleggio result = veicoloNoleggioRepository.save(veicoloNoleggio);
        return ResponseEntity.created(new URI("/api/veicolo-noleggios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /veicolo-noleggios : Updates an existing veicoloNoleggio.
     *
     * @param veicoloNoleggio the veicoloNoleggio to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated veicoloNoleggio,
     * or with status 400 (Bad Request) if the veicoloNoleggio is not valid,
     * or with status 500 (Internal Server Error) if the veicoloNoleggio couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/veicolo-noleggios")
    @Timed
    public ResponseEntity<VeicoloNoleggio> updateVeicoloNoleggio(@Valid @RequestBody VeicoloNoleggio veicoloNoleggio) throws URISyntaxException {
        log.debug("REST request to update VeicoloNoleggio : {}", veicoloNoleggio);
        if (veicoloNoleggio.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        //        String sede_user = ace.getPersonaByUsername("gaetana.irrera").getSede().getDenominazione(); //sede di username
//        String sede_cdsuoUser = ace.getPersonaByUsername("gaetana.irrera").getSede().getCdsuo(); //sede_cds di username
        String sede_user = ace.getPersonaByUsername(SecurityUtils.getCurrentUserLogin().get()).getSede().getDenominazione(); //sede di username
        String sede_cdsuoUser = ace.getPersonaByUsername(SecurityUtils.getCurrentUserLogin().get()).getSede().getCdsuo(); //sede_cds di username
        String cds = sede_cdsuoUser.substring(0, 3); //passo solo i primi tre caratteri quindi cds
/**
 * Codice che permette di salvare solo se sei
 * la persona corretta
 *
 */
        boolean hasPermission = false;

        if (cds.equals(cdsSAC))
            hasPermission = true;
        else {
            // TelefonoServizi t = telefonoServiziRepository.getOne(telefonoServizi.getId());
            String t = veicoloNoleggio.getVeicolo().getIstituto();
            hasPermission = sede_user.equals(t);
        }
        //   System.out.print("Che valore hai true o false? "+hasPermission);
        if (hasPermission) {
            VeicoloNoleggio result = veicoloNoleggioRepository.save(veicoloNoleggio);
            return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, veicoloNoleggio.getId().toString()))
                .body(result);
        } else
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    /**
     * GET  /veicolo-noleggios : get all the veicoloNoleggios.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of veicoloNoleggios in body
     */
    @GetMapping("/veicolo-noleggios")
    @Timed
    public ResponseEntity<List<VeicoloNoleggio>> getAllVeicoloNoleggios(Pageable pageable) {
        log.debug("REST request to get a page of VeicoloNoleggios");
        final Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();

        String sede_user = currentUserLogin.map(s -> ace.getPersonaByUsername(s)).map(PersonaWebDto::getSede).map(EntitaOrganizzativaWebDto::getDenominazione).orElse(null); //sede di username
        String sede_cdsuoUser = currentUserLogin.map(s -> ace.getPersonaByUsername(s)).map(PersonaWebDto::getSede).map(EntitaOrganizzativaWebDto::getCdsuo).orElse(null); //sede_cds di username
        String cds = Optional.ofNullable(sede_cdsuoUser).map(s -> s.substring(0, 3)).orElse(null); //passo solo i primi tre caratteri quindi cds

        Page<VeicoloNoleggio> page;
        if (Optional.ofNullable(cds).filter(s -> s.equals(cdsSAC)).isPresent() || !currentUserLogin.isPresent())
            page = veicoloNoleggioRepository.findAllActive(false, pageable);
        else
            page = veicoloNoleggioRepository.findByIstitutoAndDeleted(sede_user, false, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/veicolo-noleggios");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /veicolo-noleggios/:id : get the "id" veicoloNoleggio.
     *
     * @param id the id of the veicoloNoleggio to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the veicoloNoleggio, or with status 404 (Not Found)
     */
    @GetMapping("/veicolo-noleggios/{id}")
    @Timed
    public ResponseEntity<VeicoloNoleggio> getVeicoloNoleggio(@PathVariable Long id) {
        log.debug("REST request to get VeicoloNoleggio : {}", id);
        Optional<VeicoloNoleggio> veicoloNoleggio = veicoloNoleggioRepository.findById(id);
        TARGA = veicoloNoleggioRepository.findById(id).get().getVeicolo().getTarga();
        return ResponseUtil.wrapOrNotFound(veicoloNoleggio);
    }

    /**
     * DELETE  /veicolo-noleggios/:id : delete the "id" veicoloNoleggio.
     *
     * @param id the id of the veicoloNoleggio to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/veicolo-noleggios/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Void> deleteVeicoloNoleggio(@PathVariable Long id) {
        log.debug("REST request to delete VeicoloNoleggio : {}", id);

        veicoloNoleggioRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    //Per richiamare Veicoli
    @GetMapping("/veicolo-noleggios/findVeicolo")
    @Timed
    public ResponseEntity<List<Veicolo>> findVeicolo() {

        List<Veicolo> veicoliRimasti;

        List<Veicolo> veicoli;

        List<VeicoloProprieta> allVeicoliProprieta;

        List<VeicoloNoleggio> allVeicoliNoleggio;

        System.out.print("targa=== " + TARGA);

//        String sede_user = ace.getPersonaByUsername("gaetana.irrera").getSede().getDenominazione(); //sede di username
//        String sede_cdsuoUser = ace.getPersonaByUsername("gaetana.irrera").getSede().getCdsuo(); //sede_cds di username
        String sede_user = ace.getPersonaByUsername(SecurityUtils.getCurrentUserLogin().get()).getSede().getDenominazione(); //sede di username
        String sede_cdsuoUser = ace.getPersonaByUsername(SecurityUtils.getCurrentUserLogin().get()).getSede().getCdsuo(); //sede_cds di username
        String cds = sede_cdsuoUser.substring(0, 3); //passo solo i primi tre caratteri quindi cds


        if (cds.equals(cdsSAC)) {
            veicoliRimasti = veicoloRepository.findByDeletedFalse();
            veicoli = veicoloRepository.findByDeletedFalse();
        } else {
            veicoliRimasti = veicoloRepository.findByIstitutoAndDeleted(sede_user, false);
            veicoli = veicoloRepository.findByIstitutoAndDeleted(sede_user, false);
        }
        if (TARGA != null) {
            System.out.print("targa=== " + TARGA + " SOONO ENTRATO IN MODIFICA");
            Iterator i = veicoli.iterator();
            while (i.hasNext()) {
                Object v = i.next();
                if (((Veicolo) v).getTarga().equals(TARGA)) {
                } else {
                    veicoliRimasti.remove(v);
                }
            }
        } else {
            allVeicoliProprieta = veicoloProprietaRepository.findAllActive(false);
            allVeicoliNoleggio = veicoloNoleggioRepository.findAllActive(false);
            System.out.print("targa=== " + TARGA + " SOONO ENTRATO IN INSERIMENTO");
            Iterator i = veicoli.iterator();
            while (i.hasNext()) {
                Object v = i.next();
                Iterator iavp = allVeicoliProprieta.iterator();
                Iterator iavn = allVeicoliNoleggio.iterator();
                while (iavp.hasNext()) {
                    Object vp = iavp.next();
                    if (((VeicoloProprieta) vp).getVeicolo().getTarga().equals(((Veicolo) v).getTarga())) {
                        veicoliRimasti.remove(v);
                    }
                }
                while (iavn.hasNext()) {
                    Object vn = iavn.next();
                    if (((VeicoloNoleggio) vn).getVeicolo().getTarga().equals(((Veicolo) v).getTarga())) {
                        veicoliRimasti.remove(v);
                    }
                }

            }
        }


        return ResponseEntity.ok(veicoliRimasti);
    }

}
