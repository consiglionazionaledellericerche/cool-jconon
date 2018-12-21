package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.Veicolo;
import si.cnr.it.domain.TipologiaVeicolo;
import si.cnr.it.domain.AlimentazioneVeicolo;
import si.cnr.it.domain.ClasseEmissioniVeicolo;
import si.cnr.it.domain.UtilizzoBeneVeicolo;
import si.cnr.it.repository.VeicoloRepository;
import si.cnr.it.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;


import static si.cnr.it.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the VeicoloResource REST controller.
 *
 * @see VeicoloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class VeicoloResourceIntTest {

    private static final String DEFAULT_TARGA = "AAAAAAAAAA";
    private static final String UPDATED_TARGA = "BBBBBBBBBB";

    private static final String DEFAULT_MARCA = "AAAAAAAAAA";
    private static final String UPDATED_MARCA = "BBBBBBBBBB";

    private static final String DEFAULT_MODELLO = "AAAAAAAAAA";
    private static final String UPDATED_MODELLO = "BBBBBBBBBB";

    private static final String DEFAULT_CILINDRATA = "AAAAAAAAAA";
    private static final String UPDATED_CILINDRATA = "BBBBBBBBBB";

    private static final String DEFAULT_CV_KW = "AAAAAAAAAA";
    private static final String UPDATED_CV_KW = "BBBBBBBBBB";

    private static final Integer DEFAULT_KM_PERCORSI = 1;
    private static final Integer UPDATED_KM_PERCORSI = 2;

    private static final Instant DEFAULT_DATA_VALIDAZIONE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA_VALIDAZIONE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_ISTITUTO = "AAAAAAAAAA";
    private static final String UPDATED_ISTITUTO = "BBBBBBBBBB";

    private static final String DEFAULT_RESPONSABILE = "AAAAAAAAAA";
    private static final String UPDATED_RESPONSABILE = "BBBBBBBBBB";

    @Autowired
    private VeicoloRepository veicoloRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restVeicoloMockMvc;

    private Veicolo veicolo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final VeicoloResource veicoloResource = new VeicoloResource(veicoloRepository);
        this.restVeicoloMockMvc = MockMvcBuilders.standaloneSetup(veicoloResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Veicolo createEntity(EntityManager em) {
        Veicolo veicolo = new Veicolo()
            .targa(DEFAULT_TARGA)
            .marca(DEFAULT_MARCA)
            .modello(DEFAULT_MODELLO)
            .cilindrata(DEFAULT_CILINDRATA)
            .cvKw(DEFAULT_CV_KW)
            .kmPercorsi(DEFAULT_KM_PERCORSI)
            .dataValidazione(DEFAULT_DATA_VALIDAZIONE)
            .istituto(DEFAULT_ISTITUTO)
            .responsabile(DEFAULT_RESPONSABILE);
        // Add required entity
        TipologiaVeicolo tipologiaVeicolo = TipologiaVeicoloResourceIntTest.createEntity(em);
        em.persist(tipologiaVeicolo);
        em.flush();
        veicolo.setTipologiaVeicolo(tipologiaVeicolo);
        // Add required entity
        AlimentazioneVeicolo alimentazioneVeicolo = AlimentazioneVeicoloResourceIntTest.createEntity(em);
        em.persist(alimentazioneVeicolo);
        em.flush();
        veicolo.setAlimentazioneVeicolo(alimentazioneVeicolo);
        // Add required entity
        ClasseEmissioniVeicolo classeEmissioniVeicolo = ClasseEmissioniVeicoloResourceIntTest.createEntity(em);
        em.persist(classeEmissioniVeicolo);
        em.flush();
        veicolo.setClasseEmissioniVeicolo(classeEmissioniVeicolo);
        // Add required entity
        UtilizzoBeneVeicolo utilizzoBeneVeicolo = UtilizzoBeneVeicoloResourceIntTest.createEntity(em);
        em.persist(utilizzoBeneVeicolo);
        em.flush();
        veicolo.setUtilizzoBeneVeicolo(utilizzoBeneVeicolo);
        return veicolo;
    }

    @Before
    public void initTest() {
        veicolo = createEntity(em);
    }

    @Test
    @Transactional
    public void createVeicolo() throws Exception {
        int databaseSizeBeforeCreate = veicoloRepository.findAll().size();

        // Create the Veicolo
        restVeicoloMockMvc.perform(post("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isCreated());

        // Validate the Veicolo in the database
        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeCreate + 1);
        Veicolo testVeicolo = veicoloList.get(veicoloList.size() - 1);
        assertThat(testVeicolo.getTarga()).isEqualTo(DEFAULT_TARGA);
        assertThat(testVeicolo.getMarca()).isEqualTo(DEFAULT_MARCA);
        assertThat(testVeicolo.getModello()).isEqualTo(DEFAULT_MODELLO);
        assertThat(testVeicolo.getCilindrata()).isEqualTo(DEFAULT_CILINDRATA);
        assertThat(testVeicolo.getCvKw()).isEqualTo(DEFAULT_CV_KW);
        assertThat(testVeicolo.getKmPercorsi()).isEqualTo(DEFAULT_KM_PERCORSI);
        assertThat(testVeicolo.getDataValidazione()).isEqualTo(DEFAULT_DATA_VALIDAZIONE);
        assertThat(testVeicolo.getIstituto()).isEqualTo(DEFAULT_ISTITUTO);
        assertThat(testVeicolo.getResponsabile()).isEqualTo(DEFAULT_RESPONSABILE);
    }

    @Test
    @Transactional
    public void createVeicoloWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = veicoloRepository.findAll().size();

        // Create the Veicolo with an existing ID
        veicolo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restVeicoloMockMvc.perform(post("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isBadRequest());

        // Validate the Veicolo in the database
        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTargaIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloRepository.findAll().size();
        // set the field null
        veicolo.setTarga(null);

        // Create the Veicolo, which fails.

        restVeicoloMockMvc.perform(post("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isBadRequest());

        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkMarcaIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloRepository.findAll().size();
        // set the field null
        veicolo.setMarca(null);

        // Create the Veicolo, which fails.

        restVeicoloMockMvc.perform(post("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isBadRequest());

        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkModelloIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloRepository.findAll().size();
        // set the field null
        veicolo.setModello(null);

        // Create the Veicolo, which fails.

        restVeicoloMockMvc.perform(post("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isBadRequest());

        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCilindrataIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloRepository.findAll().size();
        // set the field null
        veicolo.setCilindrata(null);

        // Create the Veicolo, which fails.

        restVeicoloMockMvc.perform(post("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isBadRequest());

        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCvKwIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloRepository.findAll().size();
        // set the field null
        veicolo.setCvKw(null);

        // Create the Veicolo, which fails.

        restVeicoloMockMvc.perform(post("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isBadRequest());

        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkKmPercorsiIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloRepository.findAll().size();
        // set the field null
        veicolo.setKmPercorsi(null);

        // Create the Veicolo, which fails.

        restVeicoloMockMvc.perform(post("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isBadRequest());

        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDataValidazioneIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloRepository.findAll().size();
        // set the field null
        veicolo.setDataValidazione(null);

        // Create the Veicolo, which fails.

        restVeicoloMockMvc.perform(post("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isBadRequest());

        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkIstitutoIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloRepository.findAll().size();
        // set the field null
        veicolo.setIstituto(null);

        // Create the Veicolo, which fails.

        restVeicoloMockMvc.perform(post("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isBadRequest());

        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkResponsabileIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloRepository.findAll().size();
        // set the field null
        veicolo.setResponsabile(null);

        // Create the Veicolo, which fails.

        restVeicoloMockMvc.perform(post("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isBadRequest());

        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllVeicolos() throws Exception {
        // Initialize the database
        veicoloRepository.saveAndFlush(veicolo);

        // Get all the veicoloList
        restVeicoloMockMvc.perform(get("/api/veicolos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(veicolo.getId().intValue())))
            .andExpect(jsonPath("$.[*].targa").value(hasItem(DEFAULT_TARGA.toString())))
            .andExpect(jsonPath("$.[*].marca").value(hasItem(DEFAULT_MARCA.toString())))
            .andExpect(jsonPath("$.[*].modello").value(hasItem(DEFAULT_MODELLO.toString())))
            .andExpect(jsonPath("$.[*].cilindrata").value(hasItem(DEFAULT_CILINDRATA.toString())))
            .andExpect(jsonPath("$.[*].cvKw").value(hasItem(DEFAULT_CV_KW.toString())))
            .andExpect(jsonPath("$.[*].kmPercorsi").value(hasItem(DEFAULT_KM_PERCORSI)))
            .andExpect(jsonPath("$.[*].dataValidazione").value(hasItem(DEFAULT_DATA_VALIDAZIONE.toString())))
            .andExpect(jsonPath("$.[*].istituto").value(hasItem(DEFAULT_ISTITUTO.toString())))
            .andExpect(jsonPath("$.[*].responsabile").value(hasItem(DEFAULT_RESPONSABILE.toString())));
    }
    
    @Test
    @Transactional
    public void getVeicolo() throws Exception {
        // Initialize the database
        veicoloRepository.saveAndFlush(veicolo);

        // Get the veicolo
        restVeicoloMockMvc.perform(get("/api/veicolos/{id}", veicolo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(veicolo.getId().intValue()))
            .andExpect(jsonPath("$.targa").value(DEFAULT_TARGA.toString()))
            .andExpect(jsonPath("$.marca").value(DEFAULT_MARCA.toString()))
            .andExpect(jsonPath("$.modello").value(DEFAULT_MODELLO.toString()))
            .andExpect(jsonPath("$.cilindrata").value(DEFAULT_CILINDRATA.toString()))
            .andExpect(jsonPath("$.cvKw").value(DEFAULT_CV_KW.toString()))
            .andExpect(jsonPath("$.kmPercorsi").value(DEFAULT_KM_PERCORSI))
            .andExpect(jsonPath("$.dataValidazione").value(DEFAULT_DATA_VALIDAZIONE.toString()))
            .andExpect(jsonPath("$.istituto").value(DEFAULT_ISTITUTO.toString()))
            .andExpect(jsonPath("$.responsabile").value(DEFAULT_RESPONSABILE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingVeicolo() throws Exception {
        // Get the veicolo
        restVeicoloMockMvc.perform(get("/api/veicolos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateVeicolo() throws Exception {
        // Initialize the database
        veicoloRepository.saveAndFlush(veicolo);

        int databaseSizeBeforeUpdate = veicoloRepository.findAll().size();

        // Update the veicolo
        Veicolo updatedVeicolo = veicoloRepository.findById(veicolo.getId()).get();
        // Disconnect from session so that the updates on updatedVeicolo are not directly saved in db
        em.detach(updatedVeicolo);
        updatedVeicolo
            .targa(UPDATED_TARGA)
            .marca(UPDATED_MARCA)
            .modello(UPDATED_MODELLO)
            .cilindrata(UPDATED_CILINDRATA)
            .cvKw(UPDATED_CV_KW)
            .kmPercorsi(UPDATED_KM_PERCORSI)
            .dataValidazione(UPDATED_DATA_VALIDAZIONE)
            .istituto(UPDATED_ISTITUTO)
            .responsabile(UPDATED_RESPONSABILE);

        restVeicoloMockMvc.perform(put("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedVeicolo)))
            .andExpect(status().isOk());

        // Validate the Veicolo in the database
        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeUpdate);
        Veicolo testVeicolo = veicoloList.get(veicoloList.size() - 1);
        assertThat(testVeicolo.getTarga()).isEqualTo(UPDATED_TARGA);
        assertThat(testVeicolo.getMarca()).isEqualTo(UPDATED_MARCA);
        assertThat(testVeicolo.getModello()).isEqualTo(UPDATED_MODELLO);
        assertThat(testVeicolo.getCilindrata()).isEqualTo(UPDATED_CILINDRATA);
        assertThat(testVeicolo.getCvKw()).isEqualTo(UPDATED_CV_KW);
        assertThat(testVeicolo.getKmPercorsi()).isEqualTo(UPDATED_KM_PERCORSI);
        assertThat(testVeicolo.getDataValidazione()).isEqualTo(UPDATED_DATA_VALIDAZIONE);
        assertThat(testVeicolo.getIstituto()).isEqualTo(UPDATED_ISTITUTO);
        assertThat(testVeicolo.getResponsabile()).isEqualTo(UPDATED_RESPONSABILE);
    }

    @Test
    @Transactional
    public void updateNonExistingVeicolo() throws Exception {
        int databaseSizeBeforeUpdate = veicoloRepository.findAll().size();

        // Create the Veicolo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVeicoloMockMvc.perform(put("/api/veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicolo)))
            .andExpect(status().isBadRequest());

        // Validate the Veicolo in the database
        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteVeicolo() throws Exception {
        // Initialize the database
        veicoloRepository.saveAndFlush(veicolo);

        int databaseSizeBeforeDelete = veicoloRepository.findAll().size();

        // Get the veicolo
        restVeicoloMockMvc.perform(delete("/api/veicolos/{id}", veicolo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Veicolo> veicoloList = veicoloRepository.findAll();
        assertThat(veicoloList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Veicolo.class);
        Veicolo veicolo1 = new Veicolo();
        veicolo1.setId(1L);
        Veicolo veicolo2 = new Veicolo();
        veicolo2.setId(veicolo1.getId());
        assertThat(veicolo1).isEqualTo(veicolo2);
        veicolo2.setId(2L);
        assertThat(veicolo1).isNotEqualTo(veicolo2);
        veicolo1.setId(null);
        assertThat(veicolo1).isNotEqualTo(veicolo2);
    }
}
