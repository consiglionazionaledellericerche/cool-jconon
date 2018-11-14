package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.MotivazioneperditaProprieta;
import si.cnr.it.repository.MotivazioneperditaProprietaRepository;
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
 * Test class for the MotivazioneperditaProprietaResource REST controller.
 *
 * @see MotivazioneperditaProprietaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class MotivazioneperditaProprietaResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private MotivazioneperditaProprietaRepository motivazioneperditaProprietaRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMotivazioneperditaProprietaMockMvc;

    private MotivazioneperditaProprieta motivazioneperditaProprieta;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MotivazioneperditaProprietaResource motivazioneperditaProprietaResource = new MotivazioneperditaProprietaResource(motivazioneperditaProprietaRepository);
        this.restMotivazioneperditaProprietaMockMvc = MockMvcBuilders.standaloneSetup(motivazioneperditaProprietaResource)
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
    public static MotivazioneperditaProprieta createEntity(EntityManager em) {
        MotivazioneperditaProprieta motivazioneperditaProprieta = new MotivazioneperditaProprieta()
            .nome(DEFAULT_NOME);
        return motivazioneperditaProprieta;
    }

    @Before
    public void initTest() {
        motivazioneperditaProprieta = createEntity(em);
    }

    @Test
    @Transactional
    public void createMotivazioneperditaProprieta() throws Exception {
        int databaseSizeBeforeCreate = motivazioneperditaProprietaRepository.findAll().size();

        // Create the MotivazioneperditaProprieta
        restMotivazioneperditaProprietaMockMvc.perform(post("/api/motivazioneperdita-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivazioneperditaProprieta)))
            .andExpect(status().isCreated());

        // Validate the MotivazioneperditaProprieta in the database
        List<MotivazioneperditaProprieta> motivazioneperditaProprietaList = motivazioneperditaProprietaRepository.findAll();
        assertThat(motivazioneperditaProprietaList).hasSize(databaseSizeBeforeCreate + 1);
        MotivazioneperditaProprieta testMotivazioneperditaProprieta = motivazioneperditaProprietaList.get(motivazioneperditaProprietaList.size() - 1);
        assertThat(testMotivazioneperditaProprieta.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    public void createMotivazioneperditaProprietaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = motivazioneperditaProprietaRepository.findAll().size();

        // Create the MotivazioneperditaProprieta with an existing ID
        motivazioneperditaProprieta.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMotivazioneperditaProprietaMockMvc.perform(post("/api/motivazioneperdita-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivazioneperditaProprieta)))
            .andExpect(status().isBadRequest());

        // Validate the MotivazioneperditaProprieta in the database
        List<MotivazioneperditaProprieta> motivazioneperditaProprietaList = motivazioneperditaProprietaRepository.findAll();
        assertThat(motivazioneperditaProprietaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = motivazioneperditaProprietaRepository.findAll().size();
        // set the field null
        motivazioneperditaProprieta.setNome(null);

        // Create the MotivazioneperditaProprieta, which fails.

        restMotivazioneperditaProprietaMockMvc.perform(post("/api/motivazioneperdita-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivazioneperditaProprieta)))
            .andExpect(status().isBadRequest());

        List<MotivazioneperditaProprieta> motivazioneperditaProprietaList = motivazioneperditaProprietaRepository.findAll();
        assertThat(motivazioneperditaProprietaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllMotivazioneperditaProprietas() throws Exception {
        // Initialize the database
        motivazioneperditaProprietaRepository.saveAndFlush(motivazioneperditaProprieta);

        // Get all the motivazioneperditaProprietaList
        restMotivazioneperditaProprietaMockMvc.perform(get("/api/motivazioneperdita-proprietas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(motivazioneperditaProprieta.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }
    
    @Test
    @Transactional
    public void getMotivazioneperditaProprieta() throws Exception {
        // Initialize the database
        motivazioneperditaProprietaRepository.saveAndFlush(motivazioneperditaProprieta);

        // Get the motivazioneperditaProprieta
        restMotivazioneperditaProprietaMockMvc.perform(get("/api/motivazioneperdita-proprietas/{id}", motivazioneperditaProprieta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(motivazioneperditaProprieta.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMotivazioneperditaProprieta() throws Exception {
        // Get the motivazioneperditaProprieta
        restMotivazioneperditaProprietaMockMvc.perform(get("/api/motivazioneperdita-proprietas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMotivazioneperditaProprieta() throws Exception {
        // Initialize the database
        motivazioneperditaProprietaRepository.saveAndFlush(motivazioneperditaProprieta);

        int databaseSizeBeforeUpdate = motivazioneperditaProprietaRepository.findAll().size();

        // Update the motivazioneperditaProprieta
        MotivazioneperditaProprieta updatedMotivazioneperditaProprieta = motivazioneperditaProprietaRepository.findById(motivazioneperditaProprieta.getId()).get();
        // Disconnect from session so that the updates on updatedMotivazioneperditaProprieta are not directly saved in db
        em.detach(updatedMotivazioneperditaProprieta);
        updatedMotivazioneperditaProprieta
            .nome(UPDATED_NOME);

        restMotivazioneperditaProprietaMockMvc.perform(put("/api/motivazioneperdita-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMotivazioneperditaProprieta)))
            .andExpect(status().isOk());

        // Validate the MotivazioneperditaProprieta in the database
        List<MotivazioneperditaProprieta> motivazioneperditaProprietaList = motivazioneperditaProprietaRepository.findAll();
        assertThat(motivazioneperditaProprietaList).hasSize(databaseSizeBeforeUpdate);
        MotivazioneperditaProprieta testMotivazioneperditaProprieta = motivazioneperditaProprietaList.get(motivazioneperditaProprietaList.size() - 1);
        assertThat(testMotivazioneperditaProprieta.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    public void updateNonExistingMotivazioneperditaProprieta() throws Exception {
        int databaseSizeBeforeUpdate = motivazioneperditaProprietaRepository.findAll().size();

        // Create the MotivazioneperditaProprieta

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMotivazioneperditaProprietaMockMvc.perform(put("/api/motivazioneperdita-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(motivazioneperditaProprieta)))
            .andExpect(status().isBadRequest());

        // Validate the MotivazioneperditaProprieta in the database
        List<MotivazioneperditaProprieta> motivazioneperditaProprietaList = motivazioneperditaProprietaRepository.findAll();
        assertThat(motivazioneperditaProprietaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMotivazioneperditaProprieta() throws Exception {
        // Initialize the database
        motivazioneperditaProprietaRepository.saveAndFlush(motivazioneperditaProprieta);

        int databaseSizeBeforeDelete = motivazioneperditaProprietaRepository.findAll().size();

        // Get the motivazioneperditaProprieta
        restMotivazioneperditaProprietaMockMvc.perform(delete("/api/motivazioneperdita-proprietas/{id}", motivazioneperditaProprieta.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<MotivazioneperditaProprieta> motivazioneperditaProprietaList = motivazioneperditaProprietaRepository.findAll();
        assertThat(motivazioneperditaProprietaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MotivazioneperditaProprieta.class);
        MotivazioneperditaProprieta motivazioneperditaProprieta1 = new MotivazioneperditaProprieta();
        motivazioneperditaProprieta1.setId(1L);
        MotivazioneperditaProprieta motivazioneperditaProprieta2 = new MotivazioneperditaProprieta();
        motivazioneperditaProprieta2.setId(motivazioneperditaProprieta1.getId());
        assertThat(motivazioneperditaProprieta1).isEqualTo(motivazioneperditaProprieta2);
        motivazioneperditaProprieta2.setId(2L);
        assertThat(motivazioneperditaProprieta1).isNotEqualTo(motivazioneperditaProprieta2);
        motivazioneperditaProprieta1.setId(null);
        assertThat(motivazioneperditaProprieta1).isNotEqualTo(motivazioneperditaProprieta2);
    }
}
