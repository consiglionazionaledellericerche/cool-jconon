package it.cnr.si.web.rest;

import it.cnr.si.domain.Veicolo;
import it.cnr.si.domain.VeicoloNoleggio;
import it.cnr.si.security.DomainUserDetailsServiceIntTest;
import org.junit.Ignore;
import it.cnr.si.ParcoautoApp;

import it.cnr.si.domain.VeicoloNoleggio;
import it.cnr.si.domain.Veicolo;
import it.cnr.si.repository.VeicoloNoleggioRepository;
import it.cnr.si.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static it.cnr.si.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the VeicoloNoleggioResource REST controller.
 *
 * @see VeicoloNoleggioResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class VeicoloNoleggioResourceIntTest {

    private static final String DEFAULT_SOCIETA = "AAAAAAAAAA";
    private static final String UPDATED_SOCIETA = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATA_INIZIO_NOLEGGIO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_INIZIO_NOLEGGIO = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATA_FINE_NOLEGGIO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_FINE_NOLEGGIO = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATA_CESSAZIONE_ANTICIPATA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_CESSAZIONE_ANTICIPATA = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATA_PROROGA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_PROROGA = LocalDate.now(ZoneId.systemDefault());

    private static final byte[] DEFAULT_LIBRETTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LIBRETTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LIBRETTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LIBRETTO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_CODICE_TERZO = "AAAAAAAAAA";
    private static final String UPDATED_CODICE_TERZO = "BBBBBBBBBB";

    private static final Integer DEFAULT_REP_CONTRATTI_ANNO = 1;
    private static final Integer UPDATED_REP_CONTRATTI_ANNO = 2;

    private static final Integer DEFAULT_REP_CONTRATTI_NUMERO = 1;
    private static final Integer UPDATED_REP_CONTRATTI_NUMERO = 2;

    @Autowired
    private VeicoloNoleggioRepository veicoloNoleggioRepository;

    @Autowired
    private VeicoloNoleggioResource veicoloNoleggioResource;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restVeicoloNoleggioMockMvc;

    private VeicoloNoleggio veicoloNoleggio;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
//        final VeicoloNoleggioResource veicoloNoleggioResource = new VeicoloNoleggioResource(veicoloNoleggioRepository);
        this.restVeicoloNoleggioMockMvc = MockMvcBuilders.standaloneSetup(veicoloNoleggioResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(TestUtil.createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VeicoloNoleggio createEntity(EntityManager em) {
        VeicoloNoleggio veicoloNoleggio = new VeicoloNoleggio()
            .societa(DEFAULT_SOCIETA)
            .dataInizioNoleggio(DEFAULT_DATA_INIZIO_NOLEGGIO)
            .dataFineNoleggio(DEFAULT_DATA_FINE_NOLEGGIO)
            .dataCessazioneAnticipata(DEFAULT_DATA_CESSAZIONE_ANTICIPATA)
            .dataProroga(DEFAULT_DATA_PROROGA)
            .libretto(DEFAULT_LIBRETTO)
            .librettoContentType(DEFAULT_LIBRETTO_CONTENT_TYPE)
            .codiceTerzo(DEFAULT_CODICE_TERZO)
            .repContrattiAnno(DEFAULT_REP_CONTRATTI_ANNO)
            .repContrattiNumero(DEFAULT_REP_CONTRATTI_NUMERO);
        // Add required entity
        Veicolo veicolo = VeicoloResourceIntTest.createEntity(em);
        em.persist(veicolo);
        em.flush();
        veicoloNoleggio.setVeicolo(veicolo);
        return veicoloNoleggio;
    }

    @Before
    public void initTest() {
        veicoloNoleggio = createEntity(em);
    }

    @Test
    @Transactional
    public void createVeicoloNoleggio() throws Exception {
        int databaseSizeBeforeCreate = veicoloNoleggioRepository.findAll().size();

        // Create the VeicoloNoleggio
        restVeicoloNoleggioMockMvc.perform(post("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isCreated());

        // Validate the VeicoloNoleggio in the database
        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeCreate + 1);
        VeicoloNoleggio testVeicoloNoleggio = veicoloNoleggioList.get(veicoloNoleggioList.size() - 1);
        assertThat(testVeicoloNoleggio.getSocieta()).isEqualTo(DEFAULT_SOCIETA);
        assertThat(testVeicoloNoleggio.getDataInizioNoleggio()).isEqualTo(DEFAULT_DATA_INIZIO_NOLEGGIO);
        assertThat(testVeicoloNoleggio.getDataFineNoleggio()).isEqualTo(DEFAULT_DATA_FINE_NOLEGGIO);
        assertThat(testVeicoloNoleggio.getDataCessazioneAnticipata()).isEqualTo(DEFAULT_DATA_CESSAZIONE_ANTICIPATA);
        assertThat(testVeicoloNoleggio.getDataProroga()).isEqualTo(DEFAULT_DATA_PROROGA);
        assertThat(testVeicoloNoleggio.getLibretto()).isEqualTo(DEFAULT_LIBRETTO);
        assertThat(testVeicoloNoleggio.getLibrettoContentType()).isEqualTo(DEFAULT_LIBRETTO_CONTENT_TYPE);
        assertThat(testVeicoloNoleggio.getCodiceTerzo()).isEqualTo(DEFAULT_CODICE_TERZO);
        assertThat(testVeicoloNoleggio.getRepContrattiAnno()).isEqualTo(DEFAULT_REP_CONTRATTI_ANNO);
        assertThat(testVeicoloNoleggio.getRepContrattiNumero()).isEqualTo(DEFAULT_REP_CONTRATTI_NUMERO);
    }

    @Test
    @Transactional
    public void createVeicoloNoleggioWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = veicoloNoleggioRepository.findAll().size();

        // Create the VeicoloNoleggio with an existing ID
        veicoloNoleggio.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restVeicoloNoleggioMockMvc.perform(post("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isBadRequest());

        // Validate the VeicoloNoleggio in the database
        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkSocietaIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloNoleggioRepository.findAll().size();
        // set the field null
        veicoloNoleggio.setSocieta(null);

        // Create the VeicoloNoleggio, which fails.

        restVeicoloNoleggioMockMvc.perform(post("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isBadRequest());

        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDataInizioNoleggioIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloNoleggioRepository.findAll().size();
        // set the field null
        veicoloNoleggio.setDataInizioNoleggio(null);

        // Create the VeicoloNoleggio, which fails.

        restVeicoloNoleggioMockMvc.perform(post("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isBadRequest());

        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDataFineNoleggioIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloNoleggioRepository.findAll().size();
        // set the field null
        veicoloNoleggio.setDataFineNoleggio(null);

        // Create the VeicoloNoleggio, which fails.

        restVeicoloNoleggioMockMvc.perform(post("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isBadRequest());

        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(username= DomainUserDetailsServiceIntTest.ACE_USER_ADMIN,roles={"USER","SUPERUSER"})
    public void getAllVeicoloNoleggios() throws Exception {
        // Initialize the database
        veicoloNoleggioRepository.saveAndFlush(veicoloNoleggio);

        // Get all the veicoloNoleggioList
        restVeicoloNoleggioMockMvc.perform(get("/api/veicolo-noleggios?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(veicoloNoleggio.getId().intValue())))
            .andExpect(jsonPath("$.[*].societa").value(hasItem(DEFAULT_SOCIETA.toString())))
            .andExpect(jsonPath("$.[*].dataInizioNoleggio").value(hasItem(DEFAULT_DATA_INIZIO_NOLEGGIO.toString())))
            .andExpect(jsonPath("$.[*].dataFineNoleggio").value(hasItem(DEFAULT_DATA_FINE_NOLEGGIO.toString())))
            .andExpect(jsonPath("$.[*].dataCessazioneAnticipata").value(hasItem(DEFAULT_DATA_CESSAZIONE_ANTICIPATA.toString())))
            .andExpect(jsonPath("$.[*].dataProroga").value(hasItem(DEFAULT_DATA_PROROGA.toString())))
            .andExpect(jsonPath("$.[*].librettoContentType").value(hasItem(DEFAULT_LIBRETTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].libretto").value(hasItem(Base64Utils.encodeToString(DEFAULT_LIBRETTO))))
            .andExpect(jsonPath("$.[*].codiceTerzo").value(hasItem(DEFAULT_CODICE_TERZO.toString())))
            .andExpect(jsonPath("$.[*].repContrattiAnno").value(hasItem(DEFAULT_REP_CONTRATTI_ANNO)))
            .andExpect(jsonPath("$.[*].repContrattiNumero").value(hasItem(DEFAULT_REP_CONTRATTI_NUMERO)));
    }
    
    @Test
    @Transactional
    public void getVeicoloNoleggio() throws Exception {
        // Initialize the database
        veicoloNoleggioRepository.saveAndFlush(veicoloNoleggio);

        // Get the veicoloNoleggio
        restVeicoloNoleggioMockMvc.perform(get("/api/veicolo-noleggios/{id}", veicoloNoleggio.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(veicoloNoleggio.getId().intValue()))
            .andExpect(jsonPath("$.societa").value(DEFAULT_SOCIETA.toString()))
            .andExpect(jsonPath("$.dataInizioNoleggio").value(DEFAULT_DATA_INIZIO_NOLEGGIO.toString()))
            .andExpect(jsonPath("$.dataFineNoleggio").value(DEFAULT_DATA_FINE_NOLEGGIO.toString()))
            .andExpect(jsonPath("$.dataCessazioneAnticipata").value(DEFAULT_DATA_CESSAZIONE_ANTICIPATA.toString()))
            .andExpect(jsonPath("$.dataProroga").value(DEFAULT_DATA_PROROGA.toString()))
            .andExpect(jsonPath("$.librettoContentType").value(DEFAULT_LIBRETTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.libretto").value(Base64Utils.encodeToString(DEFAULT_LIBRETTO)))
            .andExpect(jsonPath("$.codiceTerzo").value(DEFAULT_CODICE_TERZO.toString()))
            .andExpect(jsonPath("$.repContrattiAnno").value(DEFAULT_REP_CONTRATTI_ANNO))
            .andExpect(jsonPath("$.repContrattiNumero").value(DEFAULT_REP_CONTRATTI_NUMERO));
    }

    @Test
    @Transactional
    public void getNonExistingVeicoloNoleggio() throws Exception {
        // Get the veicoloNoleggio
        restVeicoloNoleggioMockMvc.perform(get("/api/veicolo-noleggios/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(username= DomainUserDetailsServiceIntTest.ACE_USER_ADMIN,roles={"USER","SUPERUSER"})
    public void updateVeicoloNoleggio() throws Exception {
        // Initialize the database
        veicoloNoleggioRepository.saveAndFlush(veicoloNoleggio);

        int databaseSizeBeforeUpdate = veicoloNoleggioRepository.findAll().size();

        // Update the veicoloNoleggio
        VeicoloNoleggio updatedVeicoloNoleggio = veicoloNoleggioRepository.findById(veicoloNoleggio.getId()).get();
        // Disconnect from session so that the updates on updatedVeicoloNoleggio are not directly saved in db
        em.detach(updatedVeicoloNoleggio);
        updatedVeicoloNoleggio
            .societa(UPDATED_SOCIETA)
            .dataInizioNoleggio(UPDATED_DATA_INIZIO_NOLEGGIO)
            .dataFineNoleggio(UPDATED_DATA_FINE_NOLEGGIO)
            .dataCessazioneAnticipata(UPDATED_DATA_CESSAZIONE_ANTICIPATA)
            .dataProroga(UPDATED_DATA_PROROGA)
            .libretto(UPDATED_LIBRETTO)
            .librettoContentType(UPDATED_LIBRETTO_CONTENT_TYPE)
            .codiceTerzo(UPDATED_CODICE_TERZO)
            .repContrattiAnno(UPDATED_REP_CONTRATTI_ANNO)
            .repContrattiNumero(UPDATED_REP_CONTRATTI_NUMERO);

        restVeicoloNoleggioMockMvc.perform(put("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedVeicoloNoleggio)))
            .andExpect(status().isOk());

        // Validate the VeicoloNoleggio in the database
        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeUpdate);
        VeicoloNoleggio testVeicoloNoleggio = veicoloNoleggioList.get(veicoloNoleggioList.size() - 1);
        assertThat(testVeicoloNoleggio.getSocieta()).isEqualTo(UPDATED_SOCIETA);
        assertThat(testVeicoloNoleggio.getDataInizioNoleggio()).isEqualTo(UPDATED_DATA_INIZIO_NOLEGGIO);
        assertThat(testVeicoloNoleggio.getDataFineNoleggio()).isEqualTo(UPDATED_DATA_FINE_NOLEGGIO);
        assertThat(testVeicoloNoleggio.getDataCessazioneAnticipata()).isEqualTo(UPDATED_DATA_CESSAZIONE_ANTICIPATA);
        assertThat(testVeicoloNoleggio.getDataProroga()).isEqualTo(UPDATED_DATA_PROROGA);
        assertThat(testVeicoloNoleggio.getLibretto()).isEqualTo(UPDATED_LIBRETTO);
        assertThat(testVeicoloNoleggio.getLibrettoContentType()).isEqualTo(UPDATED_LIBRETTO_CONTENT_TYPE);
        assertThat(testVeicoloNoleggio.getCodiceTerzo()).isEqualTo(UPDATED_CODICE_TERZO);
        assertThat(testVeicoloNoleggio.getRepContrattiAnno()).isEqualTo(UPDATED_REP_CONTRATTI_ANNO);
        assertThat(testVeicoloNoleggio.getRepContrattiNumero()).isEqualTo(UPDATED_REP_CONTRATTI_NUMERO);
    }

    @Test
    @Transactional
    public void updateNonExistingVeicoloNoleggio() throws Exception {
        int databaseSizeBeforeUpdate = veicoloNoleggioRepository.findAll().size();

        // Create the VeicoloNoleggio

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVeicoloNoleggioMockMvc.perform(put("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isBadRequest());

        // Validate the VeicoloNoleggio in the database
        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    @WithMockUser(username= DomainUserDetailsServiceIntTest.ACE_USER_ADMIN,roles={"USER","ADMIN"})
    public void deleteVeicoloNoleggio() throws Exception {
        // Initialize the database
        veicoloNoleggioRepository.saveAndFlush(veicoloNoleggio);

        int databaseSizeBeforeDelete = veicoloNoleggioRepository.findAll().size();

        // Get the veicoloNoleggio
        restVeicoloNoleggioMockMvc.perform(delete("/api/veicolo-noleggios/{id}", veicoloNoleggio.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VeicoloNoleggio.class);
        VeicoloNoleggio veicoloNoleggio1 = new VeicoloNoleggio();
        veicoloNoleggio1.setId(1L);
        VeicoloNoleggio veicoloNoleggio2 = new VeicoloNoleggio();
        veicoloNoleggio2.setId(veicoloNoleggio1.getId());
        assertThat(veicoloNoleggio1).isEqualTo(veicoloNoleggio2);
        veicoloNoleggio2.setId(2L);
        assertThat(veicoloNoleggio1).isNotEqualTo(veicoloNoleggio2);
        veicoloNoleggio1.setId(null);
        assertThat(veicoloNoleggio1).isNotEqualTo(veicoloNoleggio2);
    }
}
