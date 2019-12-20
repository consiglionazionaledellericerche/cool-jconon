package it.cnr.si.web.rest;

import it.cnr.si.ParcoautoApp;

import it.cnr.si.domain.Multa;
import it.cnr.si.domain.Veicolo;
import it.cnr.si.repository.MultaRepository;
import it.cnr.si.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Ignore;
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
 * Test class for the MultaResource REST controller.
 *
 * @see MultaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class MultaResourceIntTest {

    private static final Instant DEFAULT_DATA_MULTA = Instant.now();
    private static final Instant UPDATED_DATA_MULTA = Instant.now();

    private static final byte[] DEFAULT_MULTA_PDF = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_MULTA_PDF = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_MULTA_PDF_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_MULTA_PDF_CONTENT_TYPE = "image/png";

    private static final ZonedDateTime DEFAULT_VISIONATO_MULTA = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_VISIONATO_MULTA = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_PAGATO_MULTA = false;
    private static final Boolean UPDATED_PAGATO_MULTA = true;

    @Autowired
    private MultaRepository multaRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMultaMockMvc;

    private Multa multa;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MultaResource multaResource = new MultaResource(multaRepository);
        this.restMultaMockMvc = MockMvcBuilders.standaloneSetup(multaResource)
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
    public static Multa createEntity(EntityManager em) {
        Multa multa = new Multa()
            .dataMulta(DEFAULT_DATA_MULTA)
            .multaPdf(DEFAULT_MULTA_PDF)
            .multaPdfContentType(DEFAULT_MULTA_PDF_CONTENT_TYPE)
            .visionatoMulta(DEFAULT_VISIONATO_MULTA)
            .pagatoMulta(DEFAULT_PAGATO_MULTA);
        // Add required entity
        Veicolo veicolo = VeicoloResourceIntTest.createEntity(em);
        em.persist(veicolo);
        em.flush();
        multa.setVeicolo(veicolo);
        return multa;
    }

    @Before
    public void initTest() {
        multa = createEntity(em);
    }

    @Test
    @Transactional
    public void createMulta() throws Exception {
        int databaseSizeBeforeCreate = multaRepository.findAll().size();

        // Create the Multa
        restMultaMockMvc.perform(post("/api/multas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(multa)))
            .andExpect(status().isCreated());

        // Validate the Multa in the database
        List<Multa> multaList = multaRepository.findAll();
        assertThat(multaList).hasSize(databaseSizeBeforeCreate + 1);
        Multa testMulta = multaList.get(multaList.size() - 1);
        assertThat(testMulta.getDataMulta()).isEqualTo(DEFAULT_DATA_MULTA);
        assertThat(testMulta.getMultaPdf()).isEqualTo(DEFAULT_MULTA_PDF);
        assertThat(testMulta.getMultaPdfContentType()).isEqualTo(DEFAULT_MULTA_PDF_CONTENT_TYPE);
        assertThat(testMulta.getVisionatoMulta()).isEqualTo(DEFAULT_VISIONATO_MULTA);
        assertThat(testMulta.isPagatoMulta()).isEqualTo(DEFAULT_PAGATO_MULTA);
    }

    @Test
    @Transactional
    public void createMultaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = multaRepository.findAll().size();

        // Create the Multa with an existing ID
        multa.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMultaMockMvc.perform(post("/api/multas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(multa)))
            .andExpect(status().isBadRequest());

        // Validate the Multa in the database
        List<Multa> multaList = multaRepository.findAll();
        assertThat(multaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDataMultaIsRequired() throws Exception {
        int databaseSizeBeforeTest = multaRepository.findAll().size();
        // set the field null
        multa.setDataMulta(null);

        // Create the Multa, which fails.

        restMultaMockMvc.perform(post("/api/multas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(multa)))
            .andExpect(status().isBadRequest());

        List<Multa> multaList = multaRepository.findAll();
        assertThat(multaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPagatoMultaIsRequired() throws Exception {
        int databaseSizeBeforeTest = multaRepository.findAll().size();
        // set the field null
        multa.setPagatoMulta(null);

        // Create the Multa, which fails.

        restMultaMockMvc.perform(post("/api/multas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(multa)))
            .andExpect(status().isBadRequest());

        List<Multa> multaList = multaRepository.findAll();
        assertThat(multaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllMultas() throws Exception {
        // Initialize the database
        multaRepository.saveAndFlush(multa);

        // Get all the multaList
        restMultaMockMvc.perform(get("/api/multas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(multa.getId().intValue())))
            .andExpect(jsonPath("$.[*].dataMulta").value(hasItem(DEFAULT_DATA_MULTA.toString())))
            .andExpect(jsonPath("$.[*].multaPdfContentType").value(hasItem(DEFAULT_MULTA_PDF_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].multaPdf").value(hasItem(Base64Utils.encodeToString(DEFAULT_MULTA_PDF))))
            .andExpect(jsonPath("$.[*].visionatoMulta").value(hasItem(sameInstant(DEFAULT_VISIONATO_MULTA))))
            .andExpect(jsonPath("$.[*].pagatoMulta").value(hasItem(DEFAULT_PAGATO_MULTA.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getMulta() throws Exception {
        // Initialize the database
        multaRepository.saveAndFlush(multa);

        // Get the multa
        restMultaMockMvc.perform(get("/api/multas/{id}", multa.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(multa.getId().intValue()))
            .andExpect(jsonPath("$.dataMulta").value(DEFAULT_DATA_MULTA.toString()))
            .andExpect(jsonPath("$.multaPdfContentType").value(DEFAULT_MULTA_PDF_CONTENT_TYPE))
            .andExpect(jsonPath("$.multaPdf").value(Base64Utils.encodeToString(DEFAULT_MULTA_PDF)))
            .andExpect(jsonPath("$.visionatoMulta").value(sameInstant(DEFAULT_VISIONATO_MULTA)))
            .andExpect(jsonPath("$.pagatoMulta").value(DEFAULT_PAGATO_MULTA.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingMulta() throws Exception {
        // Get the multa
        restMultaMockMvc.perform(get("/api/multas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Ignore
    @Transactional
    public void updateMulta() throws Exception {
        // Initialize the database
        multaRepository.saveAndFlush(multa);

        int databaseSizeBeforeUpdate = multaRepository.findAll().size();

        // Update the multa
        Multa updatedMulta = multaRepository.findById(multa.getId()).get();
        // Disconnect from session so that the updates on updatedMulta are not directly saved in db
        em.detach(updatedMulta);
        updatedMulta
            .dataMulta(UPDATED_DATA_MULTA)
            .multaPdf(UPDATED_MULTA_PDF)
            .multaPdfContentType(UPDATED_MULTA_PDF_CONTENT_TYPE)
            .visionatoMulta(UPDATED_VISIONATO_MULTA)
            .pagatoMulta(UPDATED_PAGATO_MULTA);

        restMultaMockMvc.perform(put("/api/multas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMulta)))
            .andExpect(status().isOk());

        // Validate the Multa in the database
        List<Multa> multaList = multaRepository.findAll();
        assertThat(multaList).hasSize(databaseSizeBeforeUpdate);
        Multa testMulta = multaList.get(multaList.size() - 1);
        assertThat(testMulta.getDataMulta()).isEqualTo(UPDATED_DATA_MULTA);
        assertThat(testMulta.getMultaPdf()).isEqualTo(UPDATED_MULTA_PDF);
        assertThat(testMulta.getMultaPdfContentType()).isEqualTo(UPDATED_MULTA_PDF_CONTENT_TYPE);
        assertThat(testMulta.getVisionatoMulta()).isEqualTo(UPDATED_VISIONATO_MULTA);
        assertThat(testMulta.isPagatoMulta()).isEqualTo(UPDATED_PAGATO_MULTA);
    }

    @Test
    @Transactional
    public void updateNonExistingMulta() throws Exception {
        int databaseSizeBeforeUpdate = multaRepository.findAll().size();

        // Create the Multa

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMultaMockMvc.perform(put("/api/multas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(multa)))
            .andExpect(status().isBadRequest());

        // Validate the Multa in the database
        List<Multa> multaList = multaRepository.findAll();
        assertThat(multaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMulta() throws Exception {
        // Initialize the database
        multaRepository.saveAndFlush(multa);

        int databaseSizeBeforeDelete = multaRepository.findAll().size();

        // Get the multa
        restMultaMockMvc.perform(delete("/api/multas/{id}", multa.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Multa> multaList = multaRepository.findAll();
        assertThat(multaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Multa.class);
        Multa multa1 = new Multa();
        multa1.setId(1L);
        Multa multa2 = new Multa();
        multa2.setId(multa1.getId());
        assertThat(multa1).isEqualTo(multa2);
        multa2.setId(2L);
        assertThat(multa1).isNotEqualTo(multa2);
        multa1.setId(null);
        assertThat(multa1).isNotEqualTo(multa2);
    }
}
