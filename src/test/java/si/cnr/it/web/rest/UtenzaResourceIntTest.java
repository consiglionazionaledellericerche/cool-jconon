package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.Utenza;
import si.cnr.it.repository.UtenzaRepository;
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
import java.util.List;


import static si.cnr.it.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the UtenzaResource REST controller.
 *
 * @see UtenzaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class UtenzaResourceIntTest {

    private static final Integer DEFAULT_MATRICOLA = 1;
    private static final Integer UPDATED_MATRICOLA = 2;

    private static final String DEFAULT_UID = "AAAAAAAAAA";
    private static final String UPDATED_UID = "BBBBBBBBBB";

    @Autowired
    private UtenzaRepository utenzaRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restUtenzaMockMvc;

    private Utenza utenza;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UtenzaResource utenzaResource = new UtenzaResource(utenzaRepository);
        this.restUtenzaMockMvc = MockMvcBuilders.standaloneSetup(utenzaResource)
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
    public static Utenza createEntity(EntityManager em) {
        Utenza utenza = new Utenza()
            .matricola(DEFAULT_MATRICOLA)
            .uid(DEFAULT_UID);
        return utenza;
    }

    @Before
    public void initTest() {
        utenza = createEntity(em);
    }

    @Test
    @Transactional
    public void createUtenza() throws Exception {
        int databaseSizeBeforeCreate = utenzaRepository.findAll().size();

        // Create the Utenza
        restUtenzaMockMvc.perform(post("/api/utenzas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utenza)))
            .andExpect(status().isCreated());

        // Validate the Utenza in the database
        List<Utenza> utenzaList = utenzaRepository.findAll();
        assertThat(utenzaList).hasSize(databaseSizeBeforeCreate + 1);
        Utenza testUtenza = utenzaList.get(utenzaList.size() - 1);
        assertThat(testUtenza.getMatricola()).isEqualTo(DEFAULT_MATRICOLA);
        assertThat(testUtenza.getUid()).isEqualTo(DEFAULT_UID);
    }

    @Test
    @Transactional
    public void createUtenzaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = utenzaRepository.findAll().size();

        // Create the Utenza with an existing ID
        utenza.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUtenzaMockMvc.perform(post("/api/utenzas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utenza)))
            .andExpect(status().isBadRequest());

        // Validate the Utenza in the database
        List<Utenza> utenzaList = utenzaRepository.findAll();
        assertThat(utenzaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkMatricolaIsRequired() throws Exception {
        int databaseSizeBeforeTest = utenzaRepository.findAll().size();
        // set the field null
        utenza.setMatricola(null);

        // Create the Utenza, which fails.

        restUtenzaMockMvc.perform(post("/api/utenzas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utenza)))
            .andExpect(status().isBadRequest());

        List<Utenza> utenzaList = utenzaRepository.findAll();
        assertThat(utenzaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkUidIsRequired() throws Exception {
        int databaseSizeBeforeTest = utenzaRepository.findAll().size();
        // set the field null
        utenza.setUid(null);

        // Create the Utenza, which fails.

        restUtenzaMockMvc.perform(post("/api/utenzas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utenza)))
            .andExpect(status().isBadRequest());

        List<Utenza> utenzaList = utenzaRepository.findAll();
        assertThat(utenzaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUtenzas() throws Exception {
        // Initialize the database
        utenzaRepository.saveAndFlush(utenza);

        // Get all the utenzaList
        restUtenzaMockMvc.perform(get("/api/utenzas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(utenza.getId().intValue())))
            .andExpect(jsonPath("$.[*].matricola").value(hasItem(DEFAULT_MATRICOLA)))
            .andExpect(jsonPath("$.[*].uid").value(hasItem(DEFAULT_UID.toString())));
    }
    
    @Test
    @Transactional
    public void getUtenza() throws Exception {
        // Initialize the database
        utenzaRepository.saveAndFlush(utenza);

        // Get the utenza
        restUtenzaMockMvc.perform(get("/api/utenzas/{id}", utenza.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(utenza.getId().intValue()))
            .andExpect(jsonPath("$.matricola").value(DEFAULT_MATRICOLA))
            .andExpect(jsonPath("$.uid").value(DEFAULT_UID.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingUtenza() throws Exception {
        // Get the utenza
        restUtenzaMockMvc.perform(get("/api/utenzas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUtenza() throws Exception {
        // Initialize the database
        utenzaRepository.saveAndFlush(utenza);

        int databaseSizeBeforeUpdate = utenzaRepository.findAll().size();

        // Update the utenza
        Utenza updatedUtenza = utenzaRepository.findById(utenza.getId()).get();
        // Disconnect from session so that the updates on updatedUtenza are not directly saved in db
        em.detach(updatedUtenza);
        updatedUtenza
            .matricola(UPDATED_MATRICOLA)
            .uid(UPDATED_UID);

        restUtenzaMockMvc.perform(put("/api/utenzas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUtenza)))
            .andExpect(status().isOk());

        // Validate the Utenza in the database
        List<Utenza> utenzaList = utenzaRepository.findAll();
        assertThat(utenzaList).hasSize(databaseSizeBeforeUpdate);
        Utenza testUtenza = utenzaList.get(utenzaList.size() - 1);
        assertThat(testUtenza.getMatricola()).isEqualTo(UPDATED_MATRICOLA);
        assertThat(testUtenza.getUid()).isEqualTo(UPDATED_UID);
    }

    @Test
    @Transactional
    public void updateNonExistingUtenza() throws Exception {
        int databaseSizeBeforeUpdate = utenzaRepository.findAll().size();

        // Create the Utenza

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUtenzaMockMvc.perform(put("/api/utenzas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utenza)))
            .andExpect(status().isBadRequest());

        // Validate the Utenza in the database
        List<Utenza> utenzaList = utenzaRepository.findAll();
        assertThat(utenzaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUtenza() throws Exception {
        // Initialize the database
        utenzaRepository.saveAndFlush(utenza);

        int databaseSizeBeforeDelete = utenzaRepository.findAll().size();

        // Get the utenza
        restUtenzaMockMvc.perform(delete("/api/utenzas/{id}", utenza.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Utenza> utenzaList = utenzaRepository.findAll();
        assertThat(utenzaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Utenza.class);
        Utenza utenza1 = new Utenza();
        utenza1.setId(1L);
        Utenza utenza2 = new Utenza();
        utenza2.setId(utenza1.getId());
        assertThat(utenza1).isEqualTo(utenza2);
        utenza2.setId(2L);
        assertThat(utenza1).isNotEqualTo(utenza2);
        utenza1.setId(null);
        assertThat(utenza1).isNotEqualTo(utenza2);
    }
}
