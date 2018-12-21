package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.MotivazionePerditaProprieta;
import si.cnr.it.repository.MotivazionePerditaProprietaRepository;
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
 * Test class for the MotivazionePerditaProprietaResource REST controller.
 *
 * @see MotivazionePerditaProprietaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class MotivazionePerditaProprietaResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private MotivazionePerditaProprietaRepository motivazionePerditaProprietaRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMotivazionePerditaProprietaMockMvc;

    private MotivazionePerditaProprieta motivazionePerditaProprieta;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MotivazionePerditaProprietaResource motivazionePerditaProprietaResource = new MotivazionePerditaProprietaResource(motivazionePerditaProprietaRepository);
        this.restMotivazionePerditaProprietaMockMvc = MockMvcBuilders.standaloneSetup(motivazionePerditaProprietaResource)
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
    public static MotivazionePerditaProprieta createEntity(EntityManager em) {
        MotivazionePerditaProprieta motivazionePerditaProprieta = new MotivazionePerditaProprieta()
            .nome(DEFAULT_NOME);
        return motivazionePerditaProprieta;
    }

    @Before
    public void initTest() {
        motivazionePerditaProprieta = createEntity(em);
    }

    @Test
    @Transactional
    public void createMotivazionePerditaProprieta() throws Exception {
        int databaseSizeBeforeCreate = motivazionePerditaProprietaRepository.findAll().size();

        // Create the MotivazionePerditaProprieta
        restMotivazionePerditaProprietaMockMvc.perform(post("/api/motivazione-perdita-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivazionePerditaProprieta)))
            .andExpect(status().isCreated());

        // Validate the MotivazionePerditaProprieta in the database
        List<MotivazionePerditaProprieta> motivazionePerditaProprietaList = motivazionePerditaProprietaRepository.findAll();
        assertThat(motivazionePerditaProprietaList).hasSize(databaseSizeBeforeCreate + 1);
        MotivazionePerditaProprieta testMotivazionePerditaProprieta = motivazionePerditaProprietaList.get(motivazionePerditaProprietaList.size() - 1);
        assertThat(testMotivazionePerditaProprieta.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    public void createMotivazionePerditaProprietaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = motivazionePerditaProprietaRepository.findAll().size();

        // Create the MotivazionePerditaProprieta with an existing ID
        motivazionePerditaProprieta.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMotivazionePerditaProprietaMockMvc.perform(post("/api/motivazione-perdita-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivazionePerditaProprieta)))
            .andExpect(status().isBadRequest());

        // Validate the MotivazionePerditaProprieta in the database
        List<MotivazionePerditaProprieta> motivazionePerditaProprietaList = motivazionePerditaProprietaRepository.findAll();
        assertThat(motivazionePerditaProprietaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = motivazionePerditaProprietaRepository.findAll().size();
        // set the field null
        motivazionePerditaProprieta.setNome(null);

        // Create the MotivazionePerditaProprieta, which fails.

        restMotivazionePerditaProprietaMockMvc.perform(post("/api/motivazione-perdita-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivazionePerditaProprieta)))
            .andExpect(status().isBadRequest());

        List<MotivazionePerditaProprieta> motivazionePerditaProprietaList = motivazionePerditaProprietaRepository.findAll();
        assertThat(motivazionePerditaProprietaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllMotivazionePerditaProprietas() throws Exception {
        // Initialize the database
        motivazionePerditaProprietaRepository.saveAndFlush(motivazionePerditaProprieta);

        // Get all the motivazionePerditaProprietaList
        restMotivazionePerditaProprietaMockMvc.perform(get("/api/motivazione-perdita-proprietas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(motivazionePerditaProprieta.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }
    
    @Test
    @Transactional
    public void getMotivazionePerditaProprieta() throws Exception {
        // Initialize the database
        motivazionePerditaProprietaRepository.saveAndFlush(motivazionePerditaProprieta);

        // Get the motivazionePerditaProprieta
        restMotivazionePerditaProprietaMockMvc.perform(get("/api/motivazione-perdita-proprietas/{id}", motivazionePerditaProprieta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(motivazionePerditaProprieta.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMotivazionePerditaProprieta() throws Exception {
        // Get the motivazionePerditaProprieta
        restMotivazionePerditaProprietaMockMvc.perform(get("/api/motivazione-perdita-proprietas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMotivazionePerditaProprieta() throws Exception {
        // Initialize the database
        motivazionePerditaProprietaRepository.saveAndFlush(motivazionePerditaProprieta);

        int databaseSizeBeforeUpdate = motivazionePerditaProprietaRepository.findAll().size();

        // Update the motivazionePerditaProprieta
        MotivazionePerditaProprieta updatedMotivazionePerditaProprieta = motivazionePerditaProprietaRepository.findById(motivazionePerditaProprieta.getId()).get();
        // Disconnect from session so that the updates on updatedMotivazionePerditaProprieta are not directly saved in db
        em.detach(updatedMotivazionePerditaProprieta);
        updatedMotivazionePerditaProprieta
            .nome(UPDATED_NOME);

        restMotivazionePerditaProprietaMockMvc.perform(put("/api/motivazione-perdita-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMotivazionePerditaProprieta)))
            .andExpect(status().isOk());

        // Validate the MotivazionePerditaProprieta in the database
        List<MotivazionePerditaProprieta> motivazionePerditaProprietaList = motivazionePerditaProprietaRepository.findAll();
        assertThat(motivazionePerditaProprietaList).hasSize(databaseSizeBeforeUpdate);
        MotivazionePerditaProprieta testMotivazionePerditaProprieta = motivazionePerditaProprietaList.get(motivazionePerditaProprietaList.size() - 1);
        assertThat(testMotivazionePerditaProprieta.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    public void updateNonExistingMotivazionePerditaProprieta() throws Exception {
        int databaseSizeBeforeUpdate = motivazionePerditaProprietaRepository.findAll().size();

        // Create the MotivazionePerditaProprieta

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMotivazionePerditaProprietaMockMvc.perform(put("/api/motivazione-perdita-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivazionePerditaProprieta)))
            .andExpect(status().isBadRequest());

        // Validate the MotivazionePerditaProprieta in the database
        List<MotivazionePerditaProprieta> motivazionePerditaProprietaList = motivazionePerditaProprietaRepository.findAll();
        assertThat(motivazionePerditaProprietaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMotivazionePerditaProprieta() throws Exception {
        // Initialize the database
        motivazionePerditaProprietaRepository.saveAndFlush(motivazionePerditaProprieta);

        int databaseSizeBeforeDelete = motivazionePerditaProprietaRepository.findAll().size();

        // Get the motivazionePerditaProprieta
        restMotivazionePerditaProprietaMockMvc.perform(delete("/api/motivazione-perdita-proprietas/{id}", motivazionePerditaProprieta.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<MotivazionePerditaProprieta> motivazionePerditaProprietaList = motivazionePerditaProprietaRepository.findAll();
        assertThat(motivazionePerditaProprietaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MotivazionePerditaProprieta.class);
        MotivazionePerditaProprieta motivazionePerditaProprieta1 = new MotivazionePerditaProprieta();
        motivazionePerditaProprieta1.setId(1L);
        MotivazionePerditaProprieta motivazionePerditaProprieta2 = new MotivazionePerditaProprieta();
        motivazionePerditaProprieta2.setId(motivazionePerditaProprieta1.getId());
        assertThat(motivazionePerditaProprieta1).isEqualTo(motivazionePerditaProprieta2);
        motivazionePerditaProprieta2.setId(2L);
        assertThat(motivazionePerditaProprieta1).isNotEqualTo(motivazionePerditaProprieta2);
        motivazionePerditaProprieta1.setId(null);
        assertThat(motivazionePerditaProprieta1).isNotEqualTo(motivazionePerditaProprieta2);
    }
}
