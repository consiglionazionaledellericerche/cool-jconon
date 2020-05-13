package it.cnr.si.web.rest;

import it.cnr.si.ParcoautoApp;

import it.cnr.si.domain.CancellazionePra;
import it.cnr.si.domain.VeicoloProprieta;
import it.cnr.si.repository.CancellazionePraRepository;
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
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static it.cnr.si.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CancellazionePraResource REST controller.
 *
 * @see CancellazionePraResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class CancellazionePraResourceIntTest {

    private static final Instant DEFAULT_DATA_CONSEGNA = Instant.now();
    private static final Instant UPDATED_DATA_CONSEGNA = Instant.now();

    private static final byte[] DEFAULT_DOCUMENTO_PRA = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DOCUMENTO_PRA = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_DOCUMENTO_PRA_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DOCUMENTO_PRA_CONTENT_TYPE = "image/png";

    @Autowired
    private CancellazionePraRepository cancellazionePraRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCancellazionePraMockMvc;

    private CancellazionePra cancellazionePra;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CancellazionePraResource cancellazionePraResource = new CancellazionePraResource(cancellazionePraRepository);
        this.restCancellazionePraMockMvc = MockMvcBuilders.standaloneSetup(cancellazionePraResource)
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
    public static CancellazionePra createEntity(EntityManager em) {
        CancellazionePra cancellazionePra = new CancellazionePra()
            .dataConsegna(DEFAULT_DATA_CONSEGNA)
            .documentoPra(DEFAULT_DOCUMENTO_PRA)
            .documentoPraContentType(DEFAULT_DOCUMENTO_PRA_CONTENT_TYPE);
        // Add required entity
        VeicoloProprieta veicoloProprieta = VeicoloProprietaResourceIntTest.createEntity(em);
        em.persist(veicoloProprieta);
        em.flush();
        cancellazionePra.setVeicoloProprieta(veicoloProprieta);
        return cancellazionePra;
    }

    @Before
    public void initTest() {
        cancellazionePra = createEntity(em);
    }

    @Test
    @Transactional
    public void createCancellazionePra() throws Exception {
        int databaseSizeBeforeCreate = cancellazionePraRepository.findAll().size();

        // Create the CancellazionePra
        restCancellazionePraMockMvc.perform(post("/api/cancellazione-pras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cancellazionePra)))
            .andExpect(status().isCreated());

        // Validate the CancellazionePra in the database
        List<CancellazionePra> cancellazionePraList = cancellazionePraRepository.findAll();
        assertThat(cancellazionePraList).hasSize(databaseSizeBeforeCreate + 1);
        CancellazionePra testCancellazionePra = cancellazionePraList.get(cancellazionePraList.size() - 1);
        assertThat(testCancellazionePra.getDataConsegna()).isEqualTo(DEFAULT_DATA_CONSEGNA);
        assertThat(testCancellazionePra.getDocumentoPra()).isEqualTo(DEFAULT_DOCUMENTO_PRA);
        assertThat(testCancellazionePra.getDocumentoPraContentType()).isEqualTo(DEFAULT_DOCUMENTO_PRA_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createCancellazionePraWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cancellazionePraRepository.findAll().size();

        // Create the CancellazionePra with an existing ID
        cancellazionePra.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCancellazionePraMockMvc.perform(post("/api/cancellazione-pras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cancellazionePra)))
            .andExpect(status().isBadRequest());

        // Validate the CancellazionePra in the database
        List<CancellazionePra> cancellazionePraList = cancellazionePraRepository.findAll();
        assertThat(cancellazionePraList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDataConsegnaIsRequired() throws Exception {
        int databaseSizeBeforeTest = cancellazionePraRepository.findAll().size();
        // set the field null
        cancellazionePra.setDataConsegna(null);

        // Create the CancellazionePra, which fails.

        restCancellazionePraMockMvc.perform(post("/api/cancellazione-pras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cancellazionePra)))
            .andExpect(status().isBadRequest());

        List<CancellazionePra> cancellazionePraList = cancellazionePraRepository.findAll();
        assertThat(cancellazionePraList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCancellazionePras() throws Exception {
        // Initialize the database
        cancellazionePraRepository.saveAndFlush(cancellazionePra);

        // Get all the cancellazionePraList
        restCancellazionePraMockMvc.perform(get("/api/cancellazione-pras?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cancellazionePra.getId().intValue())))
            .andExpect(jsonPath("$.[*].dataConsegna").value(hasItem(DEFAULT_DATA_CONSEGNA.toString())))
            .andExpect(jsonPath("$.[*].documentoPraContentType").value(hasItem(DEFAULT_DOCUMENTO_PRA_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].documentoPra").value(hasItem(Base64Utils.encodeToString(DEFAULT_DOCUMENTO_PRA))));
    }
    
    @Test
    @Transactional
    public void getCancellazionePra() throws Exception {
        // Initialize the database
        cancellazionePraRepository.saveAndFlush(cancellazionePra);

        // Get the cancellazionePra
        restCancellazionePraMockMvc.perform(get("/api/cancellazione-pras/{id}", cancellazionePra.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(cancellazionePra.getId().intValue()))
            .andExpect(jsonPath("$.dataConsegna").value(DEFAULT_DATA_CONSEGNA.toString()))
            .andExpect(jsonPath("$.documentoPraContentType").value(DEFAULT_DOCUMENTO_PRA_CONTENT_TYPE))
            .andExpect(jsonPath("$.documentoPra").value(Base64Utils.encodeToString(DEFAULT_DOCUMENTO_PRA)));
    }

    @Test
    @Transactional
    public void getNonExistingCancellazionePra() throws Exception {
        // Get the cancellazionePra
        restCancellazionePraMockMvc.perform(get("/api/cancellazione-pras/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCancellazionePra() throws Exception {
        // Initialize the database
        cancellazionePraRepository.saveAndFlush(cancellazionePra);

        int databaseSizeBeforeUpdate = cancellazionePraRepository.findAll().size();

        // Update the cancellazionePra
        CancellazionePra updatedCancellazionePra = cancellazionePraRepository.findById(cancellazionePra.getId()).get();
        // Disconnect from session so that the updates on updatedCancellazionePra are not directly saved in db
        em.detach(updatedCancellazionePra);
        updatedCancellazionePra
            .dataConsegna(UPDATED_DATA_CONSEGNA)
            .documentoPra(UPDATED_DOCUMENTO_PRA)
            .documentoPraContentType(UPDATED_DOCUMENTO_PRA_CONTENT_TYPE);

        restCancellazionePraMockMvc.perform(put("/api/cancellazione-pras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCancellazionePra)))
            .andExpect(status().isOk());

        // Validate the CancellazionePra in the database
        List<CancellazionePra> cancellazionePraList = cancellazionePraRepository.findAll();
        assertThat(cancellazionePraList).hasSize(databaseSizeBeforeUpdate);
        CancellazionePra testCancellazionePra = cancellazionePraList.get(cancellazionePraList.size() - 1);
        assertThat(testCancellazionePra.getDataConsegna()).isEqualTo(UPDATED_DATA_CONSEGNA);
        assertThat(testCancellazionePra.getDocumentoPra()).isEqualTo(UPDATED_DOCUMENTO_PRA);
        assertThat(testCancellazionePra.getDocumentoPraContentType()).isEqualTo(UPDATED_DOCUMENTO_PRA_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingCancellazionePra() throws Exception {
        int databaseSizeBeforeUpdate = cancellazionePraRepository.findAll().size();

        // Create the CancellazionePra

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCancellazionePraMockMvc.perform(put("/api/cancellazione-pras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cancellazionePra)))
            .andExpect(status().isBadRequest());

        // Validate the CancellazionePra in the database
        List<CancellazionePra> cancellazionePraList = cancellazionePraRepository.findAll();
        assertThat(cancellazionePraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCancellazionePra() throws Exception {
        // Initialize the database
        cancellazionePraRepository.saveAndFlush(cancellazionePra);

        int databaseSizeBeforeDelete = cancellazionePraRepository.findAll().size();

        // Get the cancellazionePra
        restCancellazionePraMockMvc.perform(delete("/api/cancellazione-pras/{id}", cancellazionePra.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<CancellazionePra> cancellazionePraList = cancellazionePraRepository.findAll();
        assertThat(cancellazionePraList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CancellazionePra.class);
        CancellazionePra cancellazionePra1 = new CancellazionePra();
        cancellazionePra1.setId(1L);
        CancellazionePra cancellazionePra2 = new CancellazionePra();
        cancellazionePra2.setId(cancellazionePra1.getId());
        assertThat(cancellazionePra1).isEqualTo(cancellazionePra2);
        cancellazionePra2.setId(2L);
        assertThat(cancellazionePra1).isNotEqualTo(cancellazionePra2);
        cancellazionePra1.setId(null);
        assertThat(cancellazionePra1).isNotEqualTo(cancellazionePra2);
    }
}
