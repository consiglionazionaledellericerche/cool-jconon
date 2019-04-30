package it.cnr.si.web.rest;

import it.cnr.si.domain.TipologiaVeicolo;
import it.cnr.si.ParcoautoApp;

import it.cnr.si.repository.TipologiaVeicoloRepository;
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

import javax.persistence.EntityManager;
import java.util.List;


import static it.cnr.si.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TipologiaVeicoloResource REST controller.
 *
 * @see TipologiaVeicoloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class TipologiaVeicoloResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private TipologiaVeicoloRepository tipologiaVeicoloRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTipologiaVeicoloMockMvc;

    private TipologiaVeicolo tipologiaVeicolo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TipologiaVeicoloResource tipologiaVeicoloResource = new TipologiaVeicoloResource(tipologiaVeicoloRepository);
        this.restTipologiaVeicoloMockMvc = MockMvcBuilders.standaloneSetup(tipologiaVeicoloResource)
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
    public static TipologiaVeicolo createEntity(EntityManager em) {
        TipologiaVeicolo tipologiaVeicolo = new TipologiaVeicolo()
            .nome(DEFAULT_NOME);
        return tipologiaVeicolo;
    }

    @Before
    public void initTest() {
        tipologiaVeicolo = createEntity(em);
    }

    @Test
    @Transactional
    public void createTipologiaVeicolo() throws Exception {
        int databaseSizeBeforeCreate = tipologiaVeicoloRepository.findAll().size();

        // Create the TipologiaVeicolo
        restTipologiaVeicoloMockMvc.perform(post("/api/tipologia-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tipologiaVeicolo)))
            .andExpect(status().isCreated());

        // Validate the TipologiaVeicolo in the database
        List<TipologiaVeicolo> tipologiaVeicoloList = tipologiaVeicoloRepository.findAll();
        assertThat(tipologiaVeicoloList).hasSize(databaseSizeBeforeCreate + 1);
        TipologiaVeicolo testTipologiaVeicolo = tipologiaVeicoloList.get(tipologiaVeicoloList.size() - 1);
        assertThat(testTipologiaVeicolo.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    public void createTipologiaVeicoloWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tipologiaVeicoloRepository.findAll().size();

        // Create the TipologiaVeicolo with an existing ID
        tipologiaVeicolo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTipologiaVeicoloMockMvc.perform(post("/api/tipologia-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tipologiaVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the TipologiaVeicolo in the database
        List<TipologiaVeicolo> tipologiaVeicoloList = tipologiaVeicoloRepository.findAll();
        assertThat(tipologiaVeicoloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = tipologiaVeicoloRepository.findAll().size();
        // set the field null
        tipologiaVeicolo.setNome(null);

        // Create the TipologiaVeicolo, which fails.

        restTipologiaVeicoloMockMvc.perform(post("/api/tipologia-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tipologiaVeicolo)))
            .andExpect(status().isBadRequest());

        List<TipologiaVeicolo> tipologiaVeicoloList = tipologiaVeicoloRepository.findAll();
        assertThat(tipologiaVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTipologiaVeicolos() throws Exception {
        // Initialize the database
        tipologiaVeicoloRepository.saveAndFlush(tipologiaVeicolo);

        // Get all the tipologiaVeicoloList
        restTipologiaVeicoloMockMvc.perform(get("/api/tipologia-veicolos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tipologiaVeicolo.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }
    
    @Test
    @Transactional
    public void getTipologiaVeicolo() throws Exception {
        // Initialize the database
        tipologiaVeicoloRepository.saveAndFlush(tipologiaVeicolo);

        // Get the tipologiaVeicolo
        restTipologiaVeicoloMockMvc.perform(get("/api/tipologia-veicolos/{id}", tipologiaVeicolo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(tipologiaVeicolo.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTipologiaVeicolo() throws Exception {
        // Get the tipologiaVeicolo
        restTipologiaVeicoloMockMvc.perform(get("/api/tipologia-veicolos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTipologiaVeicolo() throws Exception {
        // Initialize the database
        tipologiaVeicoloRepository.saveAndFlush(tipologiaVeicolo);

        int databaseSizeBeforeUpdate = tipologiaVeicoloRepository.findAll().size();

        // Update the tipologiaVeicolo
        TipologiaVeicolo updatedTipologiaVeicolo = tipologiaVeicoloRepository.findById(tipologiaVeicolo.getId()).get();
        // Disconnect from session so that the updates on updatedTipologiaVeicolo are not directly saved in db
        em.detach(updatedTipologiaVeicolo);
        updatedTipologiaVeicolo
            .nome(UPDATED_NOME);

        restTipologiaVeicoloMockMvc.perform(put("/api/tipologia-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTipologiaVeicolo)))
            .andExpect(status().isOk());

        // Validate the TipologiaVeicolo in the database
        List<TipologiaVeicolo> tipologiaVeicoloList = tipologiaVeicoloRepository.findAll();
        assertThat(tipologiaVeicoloList).hasSize(databaseSizeBeforeUpdate);
        TipologiaVeicolo testTipologiaVeicolo = tipologiaVeicoloList.get(tipologiaVeicoloList.size() - 1);
        assertThat(testTipologiaVeicolo.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    public void updateNonExistingTipologiaVeicolo() throws Exception {
        int databaseSizeBeforeUpdate = tipologiaVeicoloRepository.findAll().size();

        // Create the TipologiaVeicolo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipologiaVeicoloMockMvc.perform(put("/api/tipologia-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tipologiaVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the TipologiaVeicolo in the database
        List<TipologiaVeicolo> tipologiaVeicoloList = tipologiaVeicoloRepository.findAll();
        assertThat(tipologiaVeicoloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTipologiaVeicolo() throws Exception {
        // Initialize the database
        tipologiaVeicoloRepository.saveAndFlush(tipologiaVeicolo);

        int databaseSizeBeforeDelete = tipologiaVeicoloRepository.findAll().size();

        // Get the tipologiaVeicolo
        restTipologiaVeicoloMockMvc.perform(delete("/api/tipologia-veicolos/{id}", tipologiaVeicolo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TipologiaVeicolo> tipologiaVeicoloList = tipologiaVeicoloRepository.findAll();
        assertThat(tipologiaVeicoloList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TipologiaVeicolo.class);
        TipologiaVeicolo tipologiaVeicolo1 = new TipologiaVeicolo();
        tipologiaVeicolo1.setId(1L);
        TipologiaVeicolo tipologiaVeicolo2 = new TipologiaVeicolo();
        tipologiaVeicolo2.setId(tipologiaVeicolo1.getId());
        assertThat(tipologiaVeicolo1).isEqualTo(tipologiaVeicolo2);
        tipologiaVeicolo2.setId(2L);
        assertThat(tipologiaVeicolo1).isNotEqualTo(tipologiaVeicolo2);
        tipologiaVeicolo1.setId(null);
        assertThat(tipologiaVeicolo1).isNotEqualTo(tipologiaVeicolo2);
    }
}
