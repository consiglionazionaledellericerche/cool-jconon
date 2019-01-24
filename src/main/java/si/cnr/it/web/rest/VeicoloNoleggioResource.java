package si.cnr.it.web.rest;

import com.codahale.metrics.annotation.Timed;
import it.cnr.si.service.AceService;
import org.springframework.beans.factory.annotation.Autowired;
import si.cnr.it.domain.Veicolo;
import si.cnr.it.domain.VeicoloNoleggio;
import si.cnr.it.domain.VeicoloProprieta;
import si.cnr.it.repository.VeicoloNoleggioRepository;
import si.cnr.it.repository.VeicoloProprietaRepository;
import si.cnr.it.repository.VeicoloRepository;
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

import java.util.Iterator;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing VeicoloNoleggio.
 */
@RestController
@RequestMapping("/api")
public class VeicoloNoleggioResource {

    @Autowired
    private AceService ace;

    @Autowired
    private VeicoloRepository veicoloRepository;

    @Autowired
    private VeicoloProprietaRepository veicoloProprietaRepository;

    private String TARGA;

    private SecurityUtils securityUtils;

    private final Logger log = LoggerFactory.getLogger(VeicoloNoleggioResource.class);

    private static final String ENTITY_NAME = "veicoloNoleggio";

    private final VeicoloNoleggioRepository veicoloNoleggioRepository;

    public VeicoloNoleggioResource(VeicoloNoleggioRepository veicoloNoleggioRepository) {
        this.veicoloNoleggioRepository = veicoloNoleggioRepository;
    }

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

//        String sede_user = ace.getPersonaByUsername("gaetana.irrera").getSede().getDenominazione(); //sede di username
//        String sede_cdsuoUser = ace.getPersonaByUsername("gaetana.irrera").getSede().getCdsuo(); //sede_cds di username
        String sede_user = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getDenominazione(); //sede di username
        String sede_cdsuoUser = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getCdsuo(); //sede_cds di username
        String cds = sede_cdsuoUser.substring(0,3); //passo solo i primi tre caratteri quindi cds

        Page<VeicoloNoleggio> page;
        if (cds.equals("000"))
            page = veicoloNoleggioRepository.findAll(pageable);
        else
            page = veicoloNoleggioRepository.findByIstituto(sede_user, pageable);
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

        System.out.print("targa=== "+TARGA);

//        String sede_user = ace.getPersonaByUsername("gaetana.irrera").getSede().getDenominazione(); //sede di username
//        String sede_cdsuoUser = ace.getPersonaByUsername("gaetana.irrera").getSede().getCdsuo(); //sede_cds di username
        String sede_user = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getDenominazione(); //sede di username
        String sede_cdsuoUser = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getCdsuo(); //sede_cds di username
        String cds = sede_cdsuoUser.substring(0,3); //passo solo i primi tre caratteri quindi cds


        veicoliRimasti = veicoloRepository.findAll();

        if (cds.equals("000"))
            veicoli = veicoloRepository.findAll();
        else
            veicoli = veicoloRepository.findByIstituto(sede_user);

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
            allVeicoliProprieta = veicoloProprietaRepository.findAll();
            allVeicoliNoleggio = veicoloNoleggioRepository.findAll();
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
