package org.jhipster.auto.web.rest;

import org.jhipster.auto.AutoApp;

import org.jhipster.auto.domain.Auto;
import org.jhipster.auto.repository.AutoRepository;
import org.jhipster.auto.web.rest.errors.ExceptionTranslator;

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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static org.jhipster.auto.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the AutoResource REST controller.
 *
 * @see AutoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AutoApp.class)
public class AutoResourceIntTest {

    private static final String DEFAULT_TARGA = "AAAAAAAAAA";
    private static final String UPDATED_TARGA = "BBBBBBBBBB";

    private static final String DEFAULT_MARCA = "AAAAAAAAAA";
    private static final String UPDATED_MARCA = "BBBBBBBBBB";

    private static final String DEFAULT_MODELLO = "AAAAAAAAAA";
    private static final String UPDATED_MODELLO = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_INIZIO_NOLEGGIO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_INIZIO_NOLEGGIO = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_FINE_NOLEGGIO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FINE_NOLEGGIO = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private AutoRepository autoRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAutoMockMvc;

    private Auto auto;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AutoResource autoResource = new AutoResource(autoRepository);
        this.restAutoMockMvc = MockMvcBuilders.standaloneSetup(autoResource)
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
    public static Auto createEntity(EntityManager em) {
        Auto auto = new Auto()
            .targa(DEFAULT_TARGA)
            .marca(DEFAULT_MARCA)
            .modello(DEFAULT_MODELLO)
            .inizio_noleggio(DEFAULT_INIZIO_NOLEGGIO)
            .fine_noleggio(DEFAULT_FINE_NOLEGGIO);
        return auto;
    }

    @Before
    public void initTest() {
        auto = createEntity(em);
    }

    @Test
    @Transactional
    public void createAuto() throws Exception {
        int databaseSizeBeforeCreate = autoRepository.findAll().size();

        // Create the Auto
        restAutoMockMvc.perform(post("/api/autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(auto)))
            .andExpect(status().isCreated());

        // Validate the Auto in the database
        List<Auto> autoList = autoRepository.findAll();
        assertThat(autoList).hasSize(databaseSizeBeforeCreate + 1);
        Auto testAuto = autoList.get(autoList.size() - 1);
        assertThat(testAuto.getTarga()).isEqualTo(DEFAULT_TARGA);
        assertThat(testAuto.getMarca()).isEqualTo(DEFAULT_MARCA);
        assertThat(testAuto.getModello()).isEqualTo(DEFAULT_MODELLO);
        assertThat(testAuto.getInizio_noleggio()).isEqualTo(DEFAULT_INIZIO_NOLEGGIO);
        assertThat(testAuto.getFine_noleggio()).isEqualTo(DEFAULT_FINE_NOLEGGIO);
    }

    @Test
    @Transactional
    public void createAutoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = autoRepository.findAll().size();

        // Create the Auto with an existing ID
        auto.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAutoMockMvc.perform(post("/api/autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(auto)))
            .andExpect(status().isBadRequest());

        // Validate the Auto in the database
        List<Auto> autoList = autoRepository.findAll();
        assertThat(autoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTargaIsRequired() throws Exception {
        int databaseSizeBeforeTest = autoRepository.findAll().size();
        // set the field null
        auto.setTarga(null);

        // Create the Auto, which fails.

        restAutoMockMvc.perform(post("/api/autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(auto)))
            .andExpect(status().isBadRequest());

        List<Auto> autoList = autoRepository.findAll();
        assertThat(autoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkMarcaIsRequired() throws Exception {
        int databaseSizeBeforeTest = autoRepository.findAll().size();
        // set the field null
        auto.setMarca(null);

        // Create the Auto, which fails.

        restAutoMockMvc.perform(post("/api/autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(auto)))
            .andExpect(status().isBadRequest());

        List<Auto> autoList = autoRepository.findAll();
        assertThat(autoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkModelloIsRequired() throws Exception {
        int databaseSizeBeforeTest = autoRepository.findAll().size();
        // set the field null
        auto.setModello(null);

        // Create the Auto, which fails.

        restAutoMockMvc.perform(post("/api/autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(auto)))
            .andExpect(status().isBadRequest());

        List<Auto> autoList = autoRepository.findAll();
        assertThat(autoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkInizio_noleggioIsRequired() throws Exception {
        int databaseSizeBeforeTest = autoRepository.findAll().size();
        // set the field null
        auto.setInizio_noleggio(null);

        // Create the Auto, which fails.

        restAutoMockMvc.perform(post("/api/autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(auto)))
            .andExpect(status().isBadRequest());

        List<Auto> autoList = autoRepository.findAll();
        assertThat(autoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkFine_noleggioIsRequired() throws Exception {
        int databaseSizeBeforeTest = autoRepository.findAll().size();
        // set the field null
        auto.setFine_noleggio(null);

        // Create the Auto, which fails.

        restAutoMockMvc.perform(post("/api/autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(auto)))
            .andExpect(status().isBadRequest());

        List<Auto> autoList = autoRepository.findAll();
        assertThat(autoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAutos() throws Exception {
        // Initialize the database
        autoRepository.saveAndFlush(auto);

        // Get all the autoList
        restAutoMockMvc.perform(get("/api/autos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(auto.getId().intValue())))
            .andExpect(jsonPath("$.[*].targa").value(hasItem(DEFAULT_TARGA.toString())))
            .andExpect(jsonPath("$.[*].marca").value(hasItem(DEFAULT_MARCA.toString())))
            .andExpect(jsonPath("$.[*].modello").value(hasItem(DEFAULT_MODELLO.toString())))
            .andExpect(jsonPath("$.[*].inizio_noleggio").value(hasItem(DEFAULT_INIZIO_NOLEGGIO.toString())))
            .andExpect(jsonPath("$.[*].fine_noleggio").value(hasItem(DEFAULT_FINE_NOLEGGIO.toString())));
    }
    
    @Test
    @Transactional
    public void getAuto() throws Exception {
        // Initialize the database
        autoRepository.saveAndFlush(auto);

        // Get the auto
        restAutoMockMvc.perform(get("/api/autos/{id}", auto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(auto.getId().intValue()))
            .andExpect(jsonPath("$.targa").value(DEFAULT_TARGA.toString()))
            .andExpect(jsonPath("$.marca").value(DEFAULT_MARCA.toString()))
            .andExpect(jsonPath("$.modello").value(DEFAULT_MODELLO.toString()))
            .andExpect(jsonPath("$.inizio_noleggio").value(DEFAULT_INIZIO_NOLEGGIO.toString()))
            .andExpect(jsonPath("$.fine_noleggio").value(DEFAULT_FINE_NOLEGGIO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingAuto() throws Exception {
        // Get the auto
        restAutoMockMvc.perform(get("/api/autos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAuto() throws Exception {
        // Initialize the database
        autoRepository.saveAndFlush(auto);

        int databaseSizeBeforeUpdate = autoRepository.findAll().size();

        // Update the auto
        Auto updatedAuto = autoRepository.findById(auto.getId()).get();
        // Disconnect from session so that the updates on updatedAuto are not directly saved in db
        em.detach(updatedAuto);
        updatedAuto
            .targa(UPDATED_TARGA)
            .marca(UPDATED_MARCA)
            .modello(UPDATED_MODELLO)
            .inizio_noleggio(UPDATED_INIZIO_NOLEGGIO)
            .fine_noleggio(UPDATED_FINE_NOLEGGIO);

        restAutoMockMvc.perform(put("/api/autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAuto)))
            .andExpect(status().isOk());

        // Validate the Auto in the database
        List<Auto> autoList = autoRepository.findAll();
        assertThat(autoList).hasSize(databaseSizeBeforeUpdate);
        Auto testAuto = autoList.get(autoList.size() - 1);
        assertThat(testAuto.getTarga()).isEqualTo(UPDATED_TARGA);
        assertThat(testAuto.getMarca()).isEqualTo(UPDATED_MARCA);
        assertThat(testAuto.getModello()).isEqualTo(UPDATED_MODELLO);
        assertThat(testAuto.getInizio_noleggio()).isEqualTo(UPDATED_INIZIO_NOLEGGIO);
        assertThat(testAuto.getFine_noleggio()).isEqualTo(UPDATED_FINE_NOLEGGIO);
    }

    @Test
    @Transactional
    public void updateNonExistingAuto() throws Exception {
        int databaseSizeBeforeUpdate = autoRepository.findAll().size();

        // Create the Auto

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAutoMockMvc.perform(put("/api/autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(auto)))
            .andExpect(status().isBadRequest());

        // Validate the Auto in the database
        List<Auto> autoList = autoRepository.findAll();
        assertThat(autoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAuto() throws Exception {
        // Initialize the database
        autoRepository.saveAndFlush(auto);

        int databaseSizeBeforeDelete = autoRepository.findAll().size();

        // Get the auto
        restAutoMockMvc.perform(delete("/api/autos/{id}", auto.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Auto> autoList = autoRepository.findAll();
        assertThat(autoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Auto.class);
        Auto auto1 = new Auto();
        auto1.setId(1L);
        Auto auto2 = new Auto();
        auto2.setId(auto1.getId());
        assertThat(auto1).isEqualTo(auto2);
        auto2.setId(2L);
        assertThat(auto1).isNotEqualTo(auto2);
        auto1.setId(null);
        assertThat(auto1).isNotEqualTo(auto2);
    }
}
