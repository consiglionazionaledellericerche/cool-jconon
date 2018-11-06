package org.jhipster.auto.web.rest;

import org.jhipster.auto.AutoApp;

import org.jhipster.auto.domain.Istituti;
import org.jhipster.auto.repository.IstitutiRepository;
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
import java.util.List;


import static org.jhipster.auto.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the IstitutiResource REST controller.
 *
 * @see IstitutiResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AutoApp.class)
public class IstitutiResourceIntTest {

    private static final String DEFAULT_CDS = "AAAAAAAAAA";
    private static final String UPDATED_CDS = "BBBBBBBBBB";

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_CITTA = "AAAAAAAAAA";
    private static final String UPDATED_CITTA = "BBBBBBBBBB";

    private static final String DEFAULT_INDIRIZZO = "AAAAAAAAAA";
    private static final String UPDATED_INDIRIZZO = "BBBBBBBBBB";

    @Autowired
    private IstitutiRepository istitutiRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restIstitutiMockMvc;

    private Istituti istituti;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final IstitutiResource istitutiResource = new IstitutiResource(istitutiRepository);
        this.restIstitutiMockMvc = MockMvcBuilders.standaloneSetup(istitutiResource)
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
    public static Istituti createEntity(EntityManager em) {
        Istituti istituti = new Istituti()
            .cds(DEFAULT_CDS)
            .nome(DEFAULT_NOME)
            .citta(DEFAULT_CITTA)
            .indirizzo(DEFAULT_INDIRIZZO);
        return istituti;
    }

    @Before
    public void initTest() {
        istituti = createEntity(em);
    }

    @Test
    @Transactional
    public void createIstituti() throws Exception {
        int databaseSizeBeforeCreate = istitutiRepository.findAll().size();

        // Create the Istituti
        restIstitutiMockMvc.perform(post("/api/istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituti)))
            .andExpect(status().isCreated());

        // Validate the Istituti in the database
        List<Istituti> istitutiList = istitutiRepository.findAll();
        assertThat(istitutiList).hasSize(databaseSizeBeforeCreate + 1);
        Istituti testIstituti = istitutiList.get(istitutiList.size() - 1);
        assertThat(testIstituti.getCds()).isEqualTo(DEFAULT_CDS);
        assertThat(testIstituti.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testIstituti.getCitta()).isEqualTo(DEFAULT_CITTA);
        assertThat(testIstituti.getIndirizzo()).isEqualTo(DEFAULT_INDIRIZZO);
    }

    @Test
    @Transactional
    public void createIstitutiWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = istitutiRepository.findAll().size();

        // Create the Istituti with an existing ID
        istituti.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restIstitutiMockMvc.perform(post("/api/istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituti)))
            .andExpect(status().isBadRequest());

        // Validate the Istituti in the database
        List<Istituti> istitutiList = istitutiRepository.findAll();
        assertThat(istitutiList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkCdsIsRequired() throws Exception {
        int databaseSizeBeforeTest = istitutiRepository.findAll().size();
        // set the field null
        istituti.setCds(null);

        // Create the Istituti, which fails.

        restIstitutiMockMvc.perform(post("/api/istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituti)))
            .andExpect(status().isBadRequest());

        List<Istituti> istitutiList = istitutiRepository.findAll();
        assertThat(istitutiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = istitutiRepository.findAll().size();
        // set the field null
        istituti.setNome(null);

        // Create the Istituti, which fails.

        restIstitutiMockMvc.perform(post("/api/istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituti)))
            .andExpect(status().isBadRequest());

        List<Istituti> istitutiList = istitutiRepository.findAll();
        assertThat(istitutiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCittaIsRequired() throws Exception {
        int databaseSizeBeforeTest = istitutiRepository.findAll().size();
        // set the field null
        istituti.setCitta(null);

        // Create the Istituti, which fails.

        restIstitutiMockMvc.perform(post("/api/istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituti)))
            .andExpect(status().isBadRequest());

        List<Istituti> istitutiList = istitutiRepository.findAll();
        assertThat(istitutiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkIndirizzoIsRequired() throws Exception {
        int databaseSizeBeforeTest = istitutiRepository.findAll().size();
        // set the field null
        istituti.setIndirizzo(null);

        // Create the Istituti, which fails.

        restIstitutiMockMvc.perform(post("/api/istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituti)))
            .andExpect(status().isBadRequest());

        List<Istituti> istitutiList = istitutiRepository.findAll();
        assertThat(istitutiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllIstitutis() throws Exception {
        // Initialize the database
        istitutiRepository.saveAndFlush(istituti);

        // Get all the istitutiList
        restIstitutiMockMvc.perform(get("/api/istitutis?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(istituti.getId().intValue())))
            .andExpect(jsonPath("$.[*].cds").value(hasItem(DEFAULT_CDS.toString())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].citta").value(hasItem(DEFAULT_CITTA.toString())))
            .andExpect(jsonPath("$.[*].indirizzo").value(hasItem(DEFAULT_INDIRIZZO.toString())));
    }
    
    @Test
    @Transactional
    public void getIstituti() throws Exception {
        // Initialize the database
        istitutiRepository.saveAndFlush(istituti);

        // Get the istituti
        restIstitutiMockMvc.perform(get("/api/istitutis/{id}", istituti.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(istituti.getId().intValue()))
            .andExpect(jsonPath("$.cds").value(DEFAULT_CDS.toString()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()))
            .andExpect(jsonPath("$.citta").value(DEFAULT_CITTA.toString()))
            .andExpect(jsonPath("$.indirizzo").value(DEFAULT_INDIRIZZO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingIstituti() throws Exception {
        // Get the istituti
        restIstitutiMockMvc.perform(get("/api/istitutis/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateIstituti() throws Exception {
        // Initialize the database
        istitutiRepository.saveAndFlush(istituti);

        int databaseSizeBeforeUpdate = istitutiRepository.findAll().size();

        // Update the istituti
        Istituti updatedIstituti = istitutiRepository.findById(istituti.getId()).get();
        // Disconnect from session so that the updates on updatedIstituti are not directly saved in db
        em.detach(updatedIstituti);
        updatedIstituti
            .cds(UPDATED_CDS)
            .nome(UPDATED_NOME)
            .citta(UPDATED_CITTA)
            .indirizzo(UPDATED_INDIRIZZO);

        restIstitutiMockMvc.perform(put("/api/istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedIstituti)))
            .andExpect(status().isOk());

        // Validate the Istituti in the database
        List<Istituti> istitutiList = istitutiRepository.findAll();
        assertThat(istitutiList).hasSize(databaseSizeBeforeUpdate);
        Istituti testIstituti = istitutiList.get(istitutiList.size() - 1);
        assertThat(testIstituti.getCds()).isEqualTo(UPDATED_CDS);
        assertThat(testIstituti.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testIstituti.getCitta()).isEqualTo(UPDATED_CITTA);
        assertThat(testIstituti.getIndirizzo()).isEqualTo(UPDATED_INDIRIZZO);
    }

    @Test
    @Transactional
    public void updateNonExistingIstituti() throws Exception {
        int databaseSizeBeforeUpdate = istitutiRepository.findAll().size();

        // Create the Istituti

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIstitutiMockMvc.perform(put("/api/istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituti)))
            .andExpect(status().isBadRequest());

        // Validate the Istituti in the database
        List<Istituti> istitutiList = istitutiRepository.findAll();
        assertThat(istitutiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteIstituti() throws Exception {
        // Initialize the database
        istitutiRepository.saveAndFlush(istituti);

        int databaseSizeBeforeDelete = istitutiRepository.findAll().size();

        // Get the istituti
        restIstitutiMockMvc.perform(delete("/api/istitutis/{id}", istituti.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Istituti> istitutiList = istitutiRepository.findAll();
        assertThat(istitutiList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Istituti.class);
        Istituti istituti1 = new Istituti();
        istituti1.setId(1L);
        Istituti istituti2 = new Istituti();
        istituti2.setId(istituti1.getId());
        assertThat(istituti1).isEqualTo(istituti2);
        istituti2.setId(2L);
        assertThat(istituti1).isNotEqualTo(istituti2);
        istituti1.setId(null);
        assertThat(istituti1).isNotEqualTo(istituti2);
    }
}
