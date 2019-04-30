package it.cnr.si.web.rest;

import com.codahale.metrics.annotation.Timed;
import it.cnr.si.domain.Veicolo;
import it.cnr.si.service.AceService;
import it.cnr.si.service.dto.anagrafica.base.NodeDto;
import it.cnr.si.service.dto.anagrafica.base.PageDto;
import it.cnr.si.service.dto.anagrafica.letture.IndirizzoWebDto;
import it.cnr.si.service.dto.anagrafica.letture.PersonaWebDto;
import it.cnr.si.service.dto.anagrafica.letture.EntitaOrganizzativaWebDto;
import it.cnr.si.web.rest.errors.BadRequestAlertException;
import it.cnr.si.web.rest.util.HeaderUtil;
import it.cnr.si.web.rest.util.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import it.cnr.si.repository.VeicoloRepository;
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

import java.util.*;
import java.util.stream.Collectors;


/**
 * REST controller for managing Veicolo.
 */
@RestController
@RequestMapping("/api")
public class VeicoloResource {

    @Autowired
    private AceService ace;

    private SecurityUtils securityUtils;

    private final Logger log = LoggerFactory.getLogger(VeicoloResource.class);

    private static final String ENTITY_NAME = "veicolo";

    private final VeicoloRepository veicoloRepository;

    List<EntitaOrganizzativaWebDto> ist;

    public VeicoloResource(VeicoloRepository veicoloRepository) {
        this.veicoloRepository = veicoloRepository;
    }

    /**
     * POST  /veicolos : Create a new veicolo.
     *
     * @param veicolo the veicolo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new veicolo, or with status 400 (Bad Request) if the veicolo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/veicolos")
    @Timed
    public ResponseEntity<Veicolo> createVeicolo(@Valid @RequestBody Veicolo veicolo) throws URISyntaxException {
        log.debug("REST request to save Veicolo : {}", veicolo);
        if (veicolo.getId() != null) {
            throw new BadRequestAlertException("A new veicolo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        //    System.out.print("Valore Responsabile= "+veicolo.getResponsabile());
        if(veicolo.getResponsabile().contains(".")){

        }
        else{
            return
                ResponseEntity.unprocessableEntity().build();
        }
        /**
         * Per mettere il cdsuo
         */
        String veicolocdsuo = veicolo.getIstituto();
        veicolocdsuo = veicolocdsuo.substring(0,6);
        veicolo.setCdsuo(veicolocdsuo);
        veicolo.setIstituto(veicolo.getIstituto().substring(9));
        /**
         * Fine mettere cdsuo
         */
        Veicolo result = veicoloRepository.save(veicolo);
        return ResponseEntity.created(new URI("/api/veicolos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /veicolos : Updates an existing veicolo.
     *
     * @param veicolo the veicolo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated veicolo,
     * or with status 400 (Bad Request) if the veicolo is not valid,
     * or with status 500 (Internal Server Error) if the veicolo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/veicolos")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Veicolo> updateVeicolo(@Valid @RequestBody Veicolo veicolo) throws URISyntaxException {
        log.debug("REST request to update Veicolo : {}", veicolo);
        if (veicolo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        String sede_user = getSedeUser();
        String cds = getCdsUser();

// Per mettere CDSUO
        String veicolocdsuo = veicolo.getIstituto();
        veicolocdsuo = veicolocdsuo.substring(0,6);
        veicolo.setCdsuo(veicolocdsuo);
        veicolo.setIstituto(veicolo.getIstituto().substring(9));
//Fine
 // Codice che permette di salvare solo se sei la persona corretta
        boolean hasPermission = false;

        if (cds.equals("000"))
            hasPermission = true;
        else {
//            Telefono t = telefonoRepository.getOne(telefono.getId());
            String t = veicolo.getIstituto();
            hasPermission = sede_user.equals(t);
        }
        if (hasPermission) {
            if(veicolo.getResponsabile().contains(".")){

            }
            else{
                return (ResponseEntity<Veicolo>) ResponseEntity.unprocessableEntity();
            }
            Veicolo result = veicoloRepository.save(veicolo);
            return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, veicolo.getId().toString()))
                .body(result);
        } else
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    /**
     * GET  /veicolos : get all the veicolos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of veicolos in body
     */
    @GetMapping("/veicolos")
    @Timed
    public ResponseEntity<List<Veicolo>> getAllVeicolos(Pageable pageable) {
        log.debug("REST request to get a page of Veicolos");

        String sede_user = getSedeUser(); //sede di username
        String cds = getCdsUser();

        Page<Veicolo> veicoli;
        if(cds.equals("000")) {
            veicoli = veicoloRepository.findByDeletedFalse(pageable);
        } else {
            veicoli = veicoloRepository.findByIstitutoAndDeleted(sede_user,false, pageable);
        }

        findIstituto();
        Iterator v = veicoli.iterator();
        while(v.hasNext()) {
            Veicolo vei = (Veicolo) v.next();
            Iterator<EntitaOrganizzativaWebDto> i = ist.iterator();
            while (i.hasNext()) {
                EntitaOrganizzativaWebDto is = (EntitaOrganizzativaWebDto) i.next();
                if(vei.getIstituto().equals(is.getDenominazione()) && vei.getCdsuo().equals(is.getCdsuo())){
                    vei.setIstituto(vei.getIstituto()+" ("+is.getIndirizzoPrincipale().getComune()+")");
                }
            }
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(veicoli, "/api/veicolos");
        return new ResponseEntity<>(veicoli.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /veicolos/:id : get the "id" veicolo.
     *
     * @param id the id of the veicolo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the veicolo, or with status 404 (Not Found)
     */
    @GetMapping("/veicolos/{id}")
    @Timed
    public ResponseEntity<Veicolo> getVeicolo(@PathVariable Long id) {
        log.debug("REST request to get Veicolo : {}", id);


        Optional<Veicolo> veicolo = veicoloRepository.findById(id);
        String cds = getCdsUser();
        String denominazione = "";

        findIstituto();
        Iterator<EntitaOrganizzativaWebDto> i = ist.iterator();
        while (i.hasNext()) {
            EntitaOrganizzativaWebDto is = (EntitaOrganizzativaWebDto) i.next();
            if(veicolo.get().getIstituto().equals(is.getDenominazione())){
                denominazione = veicolo.get().getIstituto();
//                veicolo.get().setIstituto(veicolo.get().getIstituto()+" ("+is.getIndirizzoPrincipale().getComune()+")");
            }
        }


        if (cds.equals("000")){
            veicolo.get().setIstituto(veicolo.get().getCdsuo() + " - " + veicolo.get().getIstituto());
            return ResponseUtil.wrapOrNotFound(veicolo);
        }
        else{
            if(getSedeUser().equals(denominazione)) {
                veicolo.get().setIstituto(veicolo.get().getCdsuo() + " - " + veicolo.get().getIstituto());
                return ResponseUtil.wrapOrNotFound(veicolo);
            }
            else {
//                System.out.print("Sei quiiiiiiii!!!");
                java.lang.Long ids = Long.valueOf(0);
                Optional<Veicolo> veicolos = veicoloRepository.findById(ids);
                return ResponseUtil.wrapOrNotFound(veicolos);
            }
        }
    }

    /**
     * DELETE  /veicolos/:id : delete the "id" veicolo.
     *
     * @param id the id of the veicolo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/veicolos/{id}")
    @Secured(AuthoritiesConstants.ADMIN)
    @Timed
    public ResponseEntity<Void> deleteVeicolo(@PathVariable Long id) {
        log.debug("REST request to delete Veicolo : {}", id);

        //Prova di scrittura invece  di eliminazione
        String sede_user = getSedeUser();
        String cds = getCdsUser();
        Optional<Veicolo> veicolo = veicoloRepository.findById(id);

        Veicolo vei = new Veicolo();

        vei = veicolo.get();

        //Impostare calendario Gregoriano
        Calendar cal = new GregorianCalendar();
        int giorno = cal.get(Calendar.DAY_OF_MONTH);
        int mese = cal.get(Calendar.MONTH);
        int anno = cal.get(Calendar.YEAR);
        System.out.println(giorno + "-" + (mese + 1) + "-" + anno);


        vei.setDeleted(true);



        vei.setDeletedNote("USER = "+ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getUsername()+" DATA = "+giorno + "-" + (mese + 1) + "-" + anno);
        veicoloRepository.save(vei);
        System.out.println(" DATA = "+Calendar.getInstance());



//        veicoloRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    //Per richiamare utenze ACE
    @GetMapping("/veicolos/findUtenza/{term}")
    @Timed
    public ResponseEntity<List<String>> findPersona(@PathVariable String term) {

        List<String> result = new ArrayList<>();

        Map<String, String> query = new HashMap<>();
        query.put("term", term);
        PageDto<PersonaWebDto> persone = ace.getPersone(query);
        List<PersonaWebDto> listaPersone = persone.getItems();

        for (PersonaWebDto persona : listaPersone ) {
            if ( persona.getUsername() != null)
                result.add(  persona.getUsername()  );
        }
//
//        listaPersone.stream()
//            .forEach(persona -> result.add(  persona.getUsername()  )  );
//
//
//
//        result = listaPersone.stream()
//            .filter( persona -> persona.getUsername() != null )
//            .map(persona -> persona.getUsername())
//            .collect(Collectors.toList()    );



        return ResponseEntity.ok(result);
    }

    //Per richiamare istituti ACE
    @GetMapping("/veicolos/getIstituti")
    @Timed
    public ResponseEntity<List<EntitaOrganizzativaWebDto>> findIstituto() {


        String cds = getCdsUser();
        List<NodeDto> gerarchiaIstituti = ace.getGerarchiaIstituti();

        List<EntitaOrganizzativaWebDto> istitutiESedi = new ArrayList<>();
        //Inserisco Sede Centrale
        EntitaOrganizzativaWebDto ist = new EntitaOrganizzativaWebDto();
        IndirizzoWebDto indirizzo = new IndirizzoWebDto();
        indirizzo.setComune("Roma");
        ist.setCdsuo("000000");
        ist.setDenominazione("SEDE CENTRALE");
        ist.setIndirizzoPrincipale(indirizzo);
        //Fine inserimento Sede Centrale

        //Istituti
        //List<EntitaOrganizzativaWebDto> istitutiESedi = new ArrayList<>();

        //   String cdsuo = "";
        //   String cdsuos = "";
        String cdsuo = "";
        String cdsuos = "";
        String nome = "";
        int a = 0;

        //  System.out.print(cds);
        for (NodeDto istituto: gerarchiaIstituti) {
            if(a == 0 && cds.equals("000")) {
                //Prova inserimento a buffo sede centrale
                istitutiESedi.add(ist);
                //Fine Prova inserimento a buffo sede centrale
                a = a+1;
            }
            if(istituto.entitaOrganizzativa.getCdsuo().substring(0,3).equals(cds) || cds.equals("000")) {

                /** Tolgo il padre che sono i figli quelli che mi interessano
                 * istitutiESedi.add(istituto.entitaOrganizzativa);
                 cdsuo = istituto.entitaOrganizzativa.getCdsuo();
                 cdsuos = cdsuos+" - "+istituto.entitaOrganizzativa.getCdsuo();*/
                // System.out.print("quanto è cdsuo: "+cdsuo);
            }
            nome = istituto.entitaOrganizzativa.getDenominazione();
            for (NodeDto figlio: istituto.children) {
                // System.out.print("Contiene cdsuo = "+istitutiESedi.contains(figlio.entitaOrganizzativa.getCdsuo())+" - questo valore: "+figlio.entitaOrganizzativa.getCdsuo()+" ||");
                if(figlio.entitaOrganizzativa.getCdsuo().equals(cdsuo)){

                }
                else{
                    if(cdsuos.contains(figlio.entitaOrganizzativa.getCdsuo())){

                    }
                    else {
//                        System.out.println("VALORE CDS ===="+cds+" ALTRO VALORE ==="+figlio.entitaOrganizzativa.getCdsuo().substring(0,3));
                        if(figlio.entitaOrganizzativa.getCdsuo().substring(0,3).equals(cds) || cds.equals("000")) {
                            figlio.entitaOrganizzativa.setDenominazione(nome);
                            istitutiESedi.add(figlio.entitaOrganizzativa);
                        }
                    }
                }
                cdsuos = cdsuos+" - "+figlio.entitaOrganizzativa.getCdsuo();

            }
        }

        istitutiESedi = istitutiESedi.stream()
            .sorted((i1, i2) -> i1.getDenominazione().compareTo(i2.getDenominazione()))
            .map(i -> {
                //i.setDenominazione(i.getCdsuo()+" - "+i.getDenominazione().toUpperCase());
//                i.setDenominazione(i.getDenominazione().toUpperCase()+" - "+i.getIndirizzoPrincipale().getProvincia());
                i.setDenominazione(i.getDenominazione().toUpperCase());
                return i;
            })
            .collect(Collectors.toList());








//        List<EntitaOrganizzativaWebDto> istituti = ace.listaIstitutiAttivi();
//
//        istituti = istituti.stream()
//            .sorted((i1, i2) -> i1.getDenominazione().compareTo(i2.getDenominazione()))
//            .map(i -> {
//                i.setDenominazione(i.getDenominazione().toUpperCase());
//                return i;
//            })
//            .collect(Collectors.toList());




//        List<String> result = new ArrayList<>();
//
//        Map<String, String> query = new HashMap<>();
//        query.put("term", term);
//
//        List<EntitaOrganizzativaWebDto> istituti = ace.listaIstitutiAttivi();
//
//
//        for (EntitaOrganizzativaWebDto istituto : istituti ) {
//            if ( istituto.getDenominazione() != null)
//                result.add(  istituto.getDenominazione()  );
//        }
//
//        listaPersone.stream()
//            .forEach(persona -> result.add(  persona.getUsername()  )  );
//
//
//
//        result = listaPersone.stream()
//            .filter( persona -> persona.getUsername() != null )
//            .map(persona -> persona.getUsername())
//            .collect(Collectors.toList()    );

        setIst(istitutiESedi);


        return ResponseEntity.ok(istitutiESedi);
    }

    public String getSedeUser(){
//        String sede_user = ace.getPersonaByUsername("gaetana.irrera").getSede().getDenominazione(); //sede di username
        String sede_user = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getDenominazione(); //sede di username

        return sede_user;
    }

    public String getCdsUser(){
//        String sede_cdsuoUser = ace.getPersonaByUsername("gaetana.irrera").getSede().getCdsuo(); //sede_cds di username
        String sede_cdsuoUser = ace.getPersonaByUsername(securityUtils.getCurrentUserLogin().get()).getSede().getCdsuo(); //sede_cds di username
        String cds = sede_cdsuoUser.substring(0,3); //passo solo i primi tre caratteri quindi cds
        return cds;
    }

    public void setIst(List<EntitaOrganizzativaWebDto> istituti){
        ist = istituti;
    }

    public List<EntitaOrganizzativaWebDto> getIst(){
        return ist;
    }
}
