package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.AssicurazioneVeicolo;
import si.cnr.it.domain.Veicolo;
import si.cnr.it.repository.AssicurazioneVeicoloRepository;
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
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;


import static si.cnr.it.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the AssicurazioneVeicoloResource REST controller.
 *
 * @see AssicurazioneVeicoloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class AssicurazioneVeicoloResourceIntTest {

    private static final String DEFAULT_COMPAGNIA_ASSICURAZIONE = "AAAAAAAAAA";
    private static final String UPDATED_COMPAGNIA_ASSICURAZIONE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATA_SCADENZA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_SCADENZA = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_NUMERO_POLIZZA = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_POLIZZA = "BBBBBBBBBB";

    private static final byte[] DEFAULT_POLIZZA = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_POLIZZA = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_POLIZZA_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_POLIZZA_CONTENT_TYPE = "image/png";

    private static final Instant DEFAULT_DATA_INSERIMENTO = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA_INSERIMENTO = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private AssicurazioneVeicoloRepository assicurazioneVeicoloRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAssicurazioneVeicoloMockMvc;

    private AssicurazioneVeicolo assicurazioneVeicolo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AssicurazioneVeicoloResource assicurazioneVeicoloResource = new AssicurazioneVeicoloResource(assicurazioneVeicoloRepository);
        this.restAssicurazioneVeicoloMockMvc = MockMvcBuilders.standaloneSetup(assicurazioneVeicoloResource)
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
    public static AssicurazioneVeicolo createEntity(EntityManager em) {
        AssicurazioneVeicolo assicurazioneVeicolo = new AssicurazioneVeicolo()
            .compagniaAssicurazione(DEFAULT_COMPAGNIA_ASSICURAZIONE)
            .dataScadenza(DEFAULT_DATA_SCADENZA)
            .numeroPolizza(DEFAULT_NUMERO_POLIZZA)
            .polizza(DEFAULT_POLIZZA)
            .polizzaContentType(DEFAULT_POLIZZA_CONTENT_TYPE)
            .dataInserimento(DEFAULT_DATA_INSERIMENTO);
        // Add required entity
        Veicolo veicolo = VeicoloResourceIntTest.createEntity(em);
        em.persist(veicolo);
        em.flush();
        assicurazioneVeicolo.setVeicolo(veicolo);
        return assicurazioneVeicolo;
    }

    @Before
    public void initTest() {
        assicurazioneVeicolo = createEntity(em);
    }

    @Test
    @Transactional
    public void createAssicurazioneVeicolo() throws Exception {
        int databaseSizeBeforeCreate = assicurazioneVeicoloRepository.findAll().size();

        // Create the AssicurazioneVeicolo
        restAssicurazioneVeicoloMockMvc.perform(post("/api/assicurazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assicurazioneVeicolo)))
            .andExpect(status().isCreated());

        // Validate the AssicurazioneVeicolo in the database
        List<AssicurazioneVeicolo> assicurazioneVeicoloList = assicurazioneVeicoloRepository.findAll();
        assertThat(assicurazioneVeicoloList).hasSize(databaseSizeBeforeCreate + 1);
        AssicurazioneVeicolo testAssicurazioneVeicolo = assicurazioneVeicoloList.get(assicurazioneVeicoloList.size() - 1);
        assertThat(testAssicurazioneVeicolo.getCompagniaAssicurazione()).isEqualTo(DEFAULT_COMPAGNIA_ASSICURAZIONE);
        assertThat(testAssicurazioneVeicolo.getDataScadenza()).isEqualTo(DEFAULT_DATA_SCADENZA);
        assertThat(testAssicurazioneVeicolo.getNumeroPolizza()).isEqualTo(DEFAULT_NUMERO_POLIZZA);
        assertThat(testAssicurazioneVeicolo.getPolizza()).isEqualTo(DEFAULT_POLIZZA);
        assertThat(testAssicurazioneVeicolo.getPolizzaContentType()).isEqualTo(DEFAULT_POLIZZA_CONTENT_TYPE);
        assertThat(testAssicurazioneVeicolo.getDataInserimento()).isEqualTo(DEFAULT_DATA_INSERIMENTO);
    }

    @Test
    @Transactional
    public void createAssicurazioneVeicoloWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = assicurazioneVeicoloRepository.findAll().size();

        // Create the AssicurazioneVeicolo with an existing ID
        assicurazioneVeicolo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAssicurazioneVeicoloMockMvc.perform(post("/api/assicurazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assicurazioneVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the AssicurazioneVeicolo in the database
        List<AssicurazioneVeicolo> assicurazioneVeicoloList = assicurazioneVeicoloRepository.findAll();
        assertThat(assicurazioneVeicoloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkCompagniaAssicurazioneIsRequired() throws Exception {
        int databaseSizeBeforeTest = assicurazioneVeicoloRepository.findAll().size();
        // set the field null
        assicurazioneVeicolo.setCompagniaAssicurazione(null);

        // Create the AssicurazioneVeicolo, which fails.

        restAssicurazioneVeicoloMockMvc.perform(post("/api/assicurazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assicurazioneVeicolo)))
            .andExpect(status().isBadRequest());

        List<AssicurazioneVeicolo> assicurazioneVeicoloList = assicurazioneVeicoloRepository.findAll();
        assertThat(assicurazioneVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDataScadenzaIsRequired() throws Exception {
        int databaseSizeBeforeTest = assicurazioneVeicoloRepository.findAll().size();
        // set the field null
        assicurazioneVeicolo.setDataScadenza(null);

        // Create the AssicurazioneVeicolo, which fails.

        restAssicurazioneVeicoloMockMvc.perform(post("/api/assicurazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assicurazioneVeicolo)))
            .andExpect(status().isBadRequest());

        List<AssicurazioneVeicolo> assicurazioneVeicoloList = assicurazioneVeicoloRepository.findAll();
        assertThat(assicurazioneVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNumeroPolizzaIsRequired() throws Exception {
        int databaseSizeBeforeTest = assicurazioneVeicoloRepository.findAll().size();
        // set the field null
        assicurazioneVeicolo.setNumeroPolizza(null);

        // Create the AssicurazioneVeicolo, which fails.

        restAssicurazioneVeicoloMockMvc.perform(post("/api/assicurazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assicurazioneVeicolo)))
            .andExpect(status().isBadRequest());

        List<AssicurazioneVeicolo> assicurazioneVeicoloList = assicurazioneVeicoloRepository.findAll();
        assertThat(assicurazioneVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDataInserimentoIsRequired() throws Exception {
        int databaseSizeBeforeTest = assicurazioneVeicoloRepository.findAll().size();
        // set the field null
        assicurazioneVeicolo.setDataInserimento(null);

        // Create the AssicurazioneVeicolo, which fails.

        restAssicurazioneVeicoloMockMvc.perform(post("/api/assicurazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assicurazioneVeicolo)))
            .andExpect(status().isBadRequest());

        List<AssicurazioneVeicolo> assicurazioneVeicoloList = assicurazioneVeicoloRepository.findAll();
        assertThat(assicurazioneVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAssicurazioneVeicolos() throws Exception {
        // Initialize the database
        assicurazioneVeicoloRepository.saveAndFlush(assicurazioneVeicolo);

        // Get all the assicurazioneVeicoloList
        restAssicurazioneVeicoloMockMvc.perform(get("/api/assicurazione-veicolos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(assicurazioneVeicolo.getId().intValue())))
            .andExpect(jsonPath("$.[*].compagniaAssicurazione").value(hasItem(DEFAULT_COMPAGNIA_ASSICURAZIONE.toString())))
            .andExpect(jsonPath("$.[*].dataScadenza").value(hasItem(DEFAULT_DATA_SCADENZA.toString())))
            .andExpect(jsonPath("$.[*].numeroPolizza").value(hasItem(DEFAULT_NUMERO_POLIZZA.toString())))
            .andExpect(jsonPath("$.[*].polizzaContentType").value(hasItem(DEFAULT_POLIZZA_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].polizza").value(hasItem(Base64Utils.encodeToString(DEFAULT_POLIZZA))))
            .andExpect(jsonPath("$.[*].dataInserimento").value(hasItem(DEFAULT_DATA_INSERIMENTO.toString())));
    }
    
    @Test
    @Transactional
    public void getAssicurazioneVeicolo() throws Exception {
        // Initialize the database
        assicurazioneVeicoloRepository.saveAndFlush(assicurazioneVeicolo);

        // Get the assicurazioneVeicolo
        restAssicurazioneVeicoloMockMvc.perform(get("/api/assicurazione-veicolos/{id}", assicurazioneVeicolo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(assicurazioneVeicolo.getId().intValue()))
            .andExpect(jsonPath("$.compagniaAssicurazione").value(DEFAULT_COMPAGNIA_ASSICURAZIONE.toString()))
            .andExpect(jsonPath("$.dataScadenza").value(DEFAULT_DATA_SCADENZA.toString()))
            .andExpect(jsonPath("$.numeroPolizza").value(DEFAULT_NUMERO_POLIZZA.toString()))
            .andExpect(jsonPath("$.polizzaContentType").value(DEFAULT_POLIZZA_CONTENT_TYPE))
            .andExpect(jsonPath("$.polizza").value(Base64Utils.encodeToString(DEFAULT_POLIZZA)))
            .andExpect(jsonPath("$.dataInserimento").value(DEFAULT_DATA_INSERIMENTO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingAssicurazioneVeicolo() throws Exception {
        // Get the assicurazioneVeicolo
        restAssicurazioneVeicoloMockMvc.perform(get("/api/assicurazione-veicolos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAssicurazioneVeicolo() throws Exception {
        // Initialize the database
        assicurazioneVeicoloRepository.saveAndFlush(assicurazioneVeicolo);

        int databaseSizeBeforeUpdate = assicurazioneVeicoloRepository.findAll().size();

        // Update the assicurazioneVeicolo
        AssicurazioneVeicolo updatedAssicurazioneVeicolo = assicurazioneVeicoloRepository.findById(assicurazioneVeicolo.getId()).get();
        // Disconnect from session so that the updates on updatedAssicurazioneVeicolo are not directly saved in db
        em.detach(updatedAssicurazioneVeicolo);
        updatedAssicurazioneVeicolo
            .compagniaAssicurazione(UPDATED_COMPAGNIA_ASSICURAZIONE)
            .dataScadenza(UPDATED_DATA_SCADENZA)
            .numeroPolizza(UPDATED_NUMERO_POLIZZA)
            .polizza(UPDATED_POLIZZA)
            .polizzaContentType(UPDATED_POLIZZA_CONTENT_TYPE)
            .dataInserimento(UPDATED_DATA_INSERIMENTO);

        restAssicurazioneVeicoloMockMvc.perform(put("/api/assicurazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAssicurazioneVeicolo)))
            .andExpect(status().isOk());

        // Validate the AssicurazioneVeicolo in the database
        List<AssicurazioneVeicolo> assicurazioneVeicoloList = assicurazioneVeicoloRepository.findAll();
        assertThat(assicurazioneVeicoloList).hasSize(databaseSizeBeforeUpdate);
        AssicurazioneVeicolo testAssicurazioneVeicolo = assicurazioneVeicoloList.get(assicurazioneVeicoloList.size() - 1);
        assertThat(testAssicurazioneVeicolo.getCompagniaAssicurazione()).isEqualTo(UPDATED_COMPAGNIA_ASSICURAZIONE);
        assertThat(testAssicurazioneVeicolo.getDataScadenza()).isEqualTo(UPDATED_DATA_SCADENZA);
        assertThat(testAssicurazioneVeicolo.getNumeroPolizza()).isEqualTo(UPDATED_NUMERO_POLIZZA);
        assertThat(testAssicurazioneVeicolo.getPolizza()).isEqualTo(UPDATED_POLIZZA);
        assertThat(testAssicurazioneVeicolo.getPolizzaContentType()).isEqualTo(UPDATED_POLIZZA_CONTENT_TYPE);
        assertThat(testAssicurazioneVeicolo.getDataInserimento()).isEqualTo(UPDATED_DATA_INSERIMENTO);
    }

    @Test
    @Transactional
    public void updateNonExistingAssicurazioneVeicolo() throws Exception {
        int databaseSizeBeforeUpdate = assicurazioneVeicoloRepository.findAll().size();

        // Create the AssicurazioneVeicolo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssicurazioneVeicoloMockMvc.perform(put("/api/assicurazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(assicurazioneVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the AssicurazioneVeicolo in the database
        List<AssicurazioneVeicolo> assicurazioneVeicoloList = assicurazioneVeicoloRepository.findAll();
        assertThat(assicurazioneVeicoloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAssicurazioneVeicolo() throws Exception {
        // Initialize the database
        assicurazioneVeicoloRepository.saveAndFlush(assicurazioneVeicolo);

        int databaseSizeBeforeDelete = assicurazioneVeicoloRepository.findAll().size();

        // Get the assicurazioneVeicolo
        restAssicurazioneVeicoloMockMvc.perform(delete("/api/assicurazione-veicolos/{id}", assicurazioneVeicolo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<AssicurazioneVeicolo> assicurazioneVeicoloList = assicurazioneVeicoloRepository.findAll();
        assertThat(assicurazioneVeicoloList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AssicurazioneVeicolo.class);
        AssicurazioneVeicolo assicurazioneVeicolo1 = new AssicurazioneVeicolo();
        assicurazioneVeicolo1.setId(1L);
        AssicurazioneVeicolo assicurazioneVeicolo2 = new AssicurazioneVeicolo();
        assicurazioneVeicolo2.setId(assicurazioneVeicolo1.getId());
        assertThat(assicurazioneVeicolo1).isEqualTo(assicurazioneVeicolo2);
        assicurazioneVeicolo2.setId(2L);
        assertThat(assicurazioneVeicolo1).isNotEqualTo(assicurazioneVeicolo2);
        assicurazioneVeicolo1.setId(null);
        assertThat(assicurazioneVeicolo1).isNotEqualTo(assicurazioneVeicolo2);
    }
}
