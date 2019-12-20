package it.cnr.si.web.rest;

import it.cnr.si.ParcoautoApp;

import it.cnr.si.domain.Bollo;
import it.cnr.si.domain.Veicolo;
import it.cnr.si.repository.BolloRepository;
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
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;


import static it.cnr.si.web.rest.TestUtil.sameInstant;
import static it.cnr.si.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BolloResource REST controller.
 *
 * @see BolloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class BolloResourceIntTest {

    private static final Instant DEFAULT_DATA_SCADENZA = Instant.now();
    private static final Instant UPDATED_DATA_SCADENZA = Instant.now();

    private static final byte[] DEFAULT_BOLLO_PDF = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_BOLLO_PDF = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_BOLLO_PDF_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_BOLLO_PDF_CONTENT_TYPE = "image/png";

    private static final ZonedDateTime DEFAULT_VISIONATO_BOLLO = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_VISIONATO_BOLLO = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_PAGATO = false;
    private static final Boolean UPDATED_PAGATO = true;

    @Autowired
    private BolloRepository bolloRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restBolloMockMvc;

    private Bollo bollo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BolloResource bolloResource = new BolloResource(bolloRepository);
        this.restBolloMockMvc = MockMvcBuilders.standaloneSetup(bolloResource)
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
    public static Bollo createEntity(EntityManager em) {
        Bollo bollo = new Bollo()
            .dataScadenza(DEFAULT_DATA_SCADENZA)
            .bolloPdf(DEFAULT_BOLLO_PDF)
            .bolloPdfContentType(DEFAULT_BOLLO_PDF_CONTENT_TYPE)
            .visionatoBollo(DEFAULT_VISIONATO_BOLLO)
            .pagato(DEFAULT_PAGATO);
        // Add required entity
        Veicolo veicolo = VeicoloResourceIntTest.createEntity(em);
        em.persist(veicolo);
        em.flush();
        bollo.setVeicolo(veicolo);
        return bollo;
    }

    @Before
    public void initTest() {
        bollo = createEntity(em);
    }

    @Test
    @Transactional
    public void createBollo() throws Exception {
        int databaseSizeBeforeCreate = bolloRepository.findAll().size();

        // Create the Bollo
        restBolloMockMvc.perform(post("/api/bollos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bollo)))
            .andExpect(status().isCreated());

        // Validate the Bollo in the database
        List<Bollo> bolloList = bolloRepository.findAll();
        assertThat(bolloList).hasSize(databaseSizeBeforeCreate + 1);
        Bollo testBollo = bolloList.get(bolloList.size() - 1);
        assertThat(testBollo.getDataScadenza()).isEqualTo(DEFAULT_DATA_SCADENZA);
        assertThat(testBollo.getBolloPdf()).isEqualTo(DEFAULT_BOLLO_PDF);
        assertThat(testBollo.getBolloPdfContentType()).isEqualTo(DEFAULT_BOLLO_PDF_CONTENT_TYPE);
        assertThat(testBollo.getVisionatoBollo()).isEqualTo(DEFAULT_VISIONATO_BOLLO);
        assertThat(testBollo.isPagato()).isEqualTo(DEFAULT_PAGATO);
    }

    @Test
    @Transactional
    public void createBolloWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bolloRepository.findAll().size();

        // Create the Bollo with an existing ID
        bollo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBolloMockMvc.perform(post("/api/bollos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bollo)))
            .andExpect(status().isBadRequest());

        // Validate the Bollo in the database
        List<Bollo> bolloList = bolloRepository.findAll();
        assertThat(bolloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkPagatoIsRequired() throws Exception {
        int databaseSizeBeforeTest = bolloRepository.findAll().size();
        // set the field null
        bollo.setPagato(null);

        // Create the Bollo, which fails.

        restBolloMockMvc.perform(post("/api/bollos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bollo)))
            .andExpect(status().isBadRequest());

        List<Bollo> bolloList = bolloRepository.findAll();
        assertThat(bolloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBollos() throws Exception {
        // Initialize the database
        bolloRepository.saveAndFlush(bollo);

        // Get all the bolloList
        restBolloMockMvc.perform(get("/api/bollos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bollo.getId().intValue())))
            .andExpect(jsonPath("$.[*].dataScadenza").value(hasItem(DEFAULT_DATA_SCADENZA.toString())))
            .andExpect(jsonPath("$.[*].bolloPdfContentType").value(hasItem(DEFAULT_BOLLO_PDF_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].bolloPdf").value(hasItem(Base64Utils.encodeToString(DEFAULT_BOLLO_PDF))))
            .andExpect(jsonPath("$.[*].visionatoBollo").value(hasItem(sameInstant(DEFAULT_VISIONATO_BOLLO))))
            .andExpect(jsonPath("$.[*].pagato").value(hasItem(DEFAULT_PAGATO.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getBollo() throws Exception {
        // Initialize the database
        bolloRepository.saveAndFlush(bollo);

        // Get the bollo
        restBolloMockMvc.perform(get("/api/bollos/{id}", bollo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(bollo.getId().intValue()))
            .andExpect(jsonPath("$.dataScadenza").value(DEFAULT_DATA_SCADENZA.toString()))
            .andExpect(jsonPath("$.bolloPdfContentType").value(DEFAULT_BOLLO_PDF_CONTENT_TYPE))
            .andExpect(jsonPath("$.bolloPdf").value(Base64Utils.encodeToString(DEFAULT_BOLLO_PDF)))
            .andExpect(jsonPath("$.visionatoBollo").value(sameInstant(DEFAULT_VISIONATO_BOLLO)))
            .andExpect(jsonPath("$.pagato").value(DEFAULT_PAGATO.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingBollo() throws Exception {
        // Get the bollo
        restBolloMockMvc.perform(get("/api/bollos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBollo() throws Exception {
        // Initialize the database
        bolloRepository.saveAndFlush(bollo);

        int databaseSizeBeforeUpdate = bolloRepository.findAll().size();

        // Update the bollo
        Bollo updatedBollo = bolloRepository.findById(bollo.getId()).get();
        // Disconnect from session so that the updates on updatedBollo are not directly saved in db
        em.detach(updatedBollo);
        updatedBollo
            .dataScadenza(UPDATED_DATA_SCADENZA)
            .bolloPdf(UPDATED_BOLLO_PDF)
            .bolloPdfContentType(UPDATED_BOLLO_PDF_CONTENT_TYPE)
            .visionatoBollo(UPDATED_VISIONATO_BOLLO)
            .pagato(UPDATED_PAGATO);

        restBolloMockMvc.perform(put("/api/bollos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBollo)))
            .andExpect(status().isOk());

        // Validate the Bollo in the database
        List<Bollo> bolloList = bolloRepository.findAll();
        assertThat(bolloList).hasSize(databaseSizeBeforeUpdate);
        Bollo testBollo = bolloList.get(bolloList.size() - 1);
        assertThat(testBollo.getDataScadenza()).isEqualTo(UPDATED_DATA_SCADENZA);
        assertThat(testBollo.getBolloPdf()).isEqualTo(UPDATED_BOLLO_PDF);
        assertThat(testBollo.getBolloPdfContentType()).isEqualTo(UPDATED_BOLLO_PDF_CONTENT_TYPE);
        assertThat(testBollo.getVisionatoBollo()).isEqualTo(UPDATED_VISIONATO_BOLLO);
        assertThat(testBollo.isPagato()).isEqualTo(UPDATED_PAGATO);
    }

    @Test
    @Transactional
    public void updateNonExistingBollo() throws Exception {
        int databaseSizeBeforeUpdate = bolloRepository.findAll().size();

        // Create the Bollo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBolloMockMvc.perform(put("/api/bollos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bollo)))
            .andExpect(status().isBadRequest());

        // Validate the Bollo in the database
        List<Bollo> bolloList = bolloRepository.findAll();
        assertThat(bolloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBollo() throws Exception {
        // Initialize the database
        bolloRepository.saveAndFlush(bollo);

        int databaseSizeBeforeDelete = bolloRepository.findAll().size();

        // Get the bollo
        restBolloMockMvc.perform(delete("/api/bollos/{id}", bollo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Bollo> bolloList = bolloRepository.findAll();
        assertThat(bolloList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bollo.class);
        Bollo bollo1 = new Bollo();
        bollo1.setId(1L);
        Bollo bollo2 = new Bollo();
        bollo2.setId(bollo1.getId());
        assertThat(bollo1).isEqualTo(bollo2);
        bollo2.setId(2L);
        assertThat(bollo1).isNotEqualTo(bollo2);
        bollo1.setId(null);
        assertThat(bollo1).isNotEqualTo(bollo2);
    }
}
