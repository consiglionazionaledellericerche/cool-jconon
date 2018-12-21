package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.UtilizzoBeneVeicolo;
import si.cnr.it.repository.UtilizzoBeneVeicoloRepository;
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
 * Test class for the UtilizzoBeneVeicoloResource REST controller.
 *
 * @see UtilizzoBeneVeicoloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class UtilizzoBeneVeicoloResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private UtilizzoBeneVeicoloRepository utilizzoBeneVeicoloRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restUtilizzoBeneVeicoloMockMvc;

    private UtilizzoBeneVeicolo utilizzoBeneVeicolo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UtilizzoBeneVeicoloResource utilizzoBeneVeicoloResource = new UtilizzoBeneVeicoloResource(utilizzoBeneVeicoloRepository);
        this.restUtilizzoBeneVeicoloMockMvc = MockMvcBuilders.standaloneSetup(utilizzoBeneVeicoloResource)
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
    public static UtilizzoBeneVeicolo createEntity(EntityManager em) {
        UtilizzoBeneVeicolo utilizzoBeneVeicolo = new UtilizzoBeneVeicolo()
            .nome(DEFAULT_NOME);
        return utilizzoBeneVeicolo;
    }

    @Before
    public void initTest() {
        utilizzoBeneVeicolo = createEntity(em);
    }

    @Test
    @Transactional
    public void createUtilizzoBeneVeicolo() throws Exception {
        int databaseSizeBeforeCreate = utilizzoBeneVeicoloRepository.findAll().size();

        // Create the UtilizzoBeneVeicolo
        restUtilizzoBeneVeicoloMockMvc.perform(post("/api/utilizzo-bene-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utilizzoBeneVeicolo)))
            .andExpect(status().isCreated());

        // Validate the UtilizzoBeneVeicolo in the database
        List<UtilizzoBeneVeicolo> utilizzoBeneVeicoloList = utilizzoBeneVeicoloRepository.findAll();
        assertThat(utilizzoBeneVeicoloList).hasSize(databaseSizeBeforeCreate + 1);
        UtilizzoBeneVeicolo testUtilizzoBeneVeicolo = utilizzoBeneVeicoloList.get(utilizzoBeneVeicoloList.size() - 1);
        assertThat(testUtilizzoBeneVeicolo.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    public void createUtilizzoBeneVeicoloWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = utilizzoBeneVeicoloRepository.findAll().size();

        // Create the UtilizzoBeneVeicolo with an existing ID
        utilizzoBeneVeicolo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUtilizzoBeneVeicoloMockMvc.perform(post("/api/utilizzo-bene-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utilizzoBeneVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the UtilizzoBeneVeicolo in the database
        List<UtilizzoBeneVeicolo> utilizzoBeneVeicoloList = utilizzoBeneVeicoloRepository.findAll();
        assertThat(utilizzoBeneVeicoloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = utilizzoBeneVeicoloRepository.findAll().size();
        // set the field null
        utilizzoBeneVeicolo.setNome(null);

        // Create the UtilizzoBeneVeicolo, which fails.

        restUtilizzoBeneVeicoloMockMvc.perform(post("/api/utilizzo-bene-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utilizzoBeneVeicolo)))
            .andExpect(status().isBadRequest());

        List<UtilizzoBeneVeicolo> utilizzoBeneVeicoloList = utilizzoBeneVeicoloRepository.findAll();
        assertThat(utilizzoBeneVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUtilizzoBeneVeicolos() throws Exception {
        // Initialize the database
        utilizzoBeneVeicoloRepository.saveAndFlush(utilizzoBeneVeicolo);

        // Get all the utilizzoBeneVeicoloList
        restUtilizzoBeneVeicoloMockMvc.perform(get("/api/utilizzo-bene-veicolos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(utilizzoBeneVeicolo.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }
    
    @Test
    @Transactional
    public void getUtilizzoBeneVeicolo() throws Exception {
        // Initialize the database
        utilizzoBeneVeicoloRepository.saveAndFlush(utilizzoBeneVeicolo);

        // Get the utilizzoBeneVeicolo
        restUtilizzoBeneVeicoloMockMvc.perform(get("/api/utilizzo-bene-veicolos/{id}", utilizzoBeneVeicolo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(utilizzoBeneVeicolo.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingUtilizzoBeneVeicolo() throws Exception {
        // Get the utilizzoBeneVeicolo
        restUtilizzoBeneVeicoloMockMvc.perform(get("/api/utilizzo-bene-veicolos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUtilizzoBeneVeicolo() throws Exception {
        // Initialize the database
        utilizzoBeneVeicoloRepository.saveAndFlush(utilizzoBeneVeicolo);

        int databaseSizeBeforeUpdate = utilizzoBeneVeicoloRepository.findAll().size();

        // Update the utilizzoBeneVeicolo
        UtilizzoBeneVeicolo updatedUtilizzoBeneVeicolo = utilizzoBeneVeicoloRepository.findById(utilizzoBeneVeicolo.getId()).get();
        // Disconnect from session so that the updates on updatedUtilizzoBeneVeicolo are not directly saved in db
        em.detach(updatedUtilizzoBeneVeicolo);
        updatedUtilizzoBeneVeicolo
            .nome(UPDATED_NOME);

        restUtilizzoBeneVeicoloMockMvc.perform(put("/api/utilizzo-bene-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUtilizzoBeneVeicolo)))
            .andExpect(status().isOk());

        // Validate the UtilizzoBeneVeicolo in the database
        List<UtilizzoBeneVeicolo> utilizzoBeneVeicoloList = utilizzoBeneVeicoloRepository.findAll();
        assertThat(utilizzoBeneVeicoloList).hasSize(databaseSizeBeforeUpdate);
        UtilizzoBeneVeicolo testUtilizzoBeneVeicolo = utilizzoBeneVeicoloList.get(utilizzoBeneVeicoloList.size() - 1);
        assertThat(testUtilizzoBeneVeicolo.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    public void updateNonExistingUtilizzoBeneVeicolo() throws Exception {
        int databaseSizeBeforeUpdate = utilizzoBeneVeicoloRepository.findAll().size();

        // Create the UtilizzoBeneVeicolo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUtilizzoBeneVeicoloMockMvc.perform(put("/api/utilizzo-bene-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utilizzoBeneVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the UtilizzoBeneVeicolo in the database
        List<UtilizzoBeneVeicolo> utilizzoBeneVeicoloList = utilizzoBeneVeicoloRepository.findAll();
        assertThat(utilizzoBeneVeicoloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUtilizzoBeneVeicolo() throws Exception {
        // Initialize the database
        utilizzoBeneVeicoloRepository.saveAndFlush(utilizzoBeneVeicolo);

        int databaseSizeBeforeDelete = utilizzoBeneVeicoloRepository.findAll().size();

        // Get the utilizzoBeneVeicolo
        restUtilizzoBeneVeicoloMockMvc.perform(delete("/api/utilizzo-bene-veicolos/{id}", utilizzoBeneVeicolo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<UtilizzoBeneVeicolo> utilizzoBeneVeicoloList = utilizzoBeneVeicoloRepository.findAll();
        assertThat(utilizzoBeneVeicoloList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UtilizzoBeneVeicolo.class);
        UtilizzoBeneVeicolo utilizzoBeneVeicolo1 = new UtilizzoBeneVeicolo();
        utilizzoBeneVeicolo1.setId(1L);
        UtilizzoBeneVeicolo utilizzoBeneVeicolo2 = new UtilizzoBeneVeicolo();
        utilizzoBeneVeicolo2.setId(utilizzoBeneVeicolo1.getId());
        assertThat(utilizzoBeneVeicolo1).isEqualTo(utilizzoBeneVeicolo2);
        utilizzoBeneVeicolo2.setId(2L);
        assertThat(utilizzoBeneVeicolo1).isNotEqualTo(utilizzoBeneVeicolo2);
        utilizzoBeneVeicolo1.setId(null);
        assertThat(utilizzoBeneVeicolo1).isNotEqualTo(utilizzoBeneVeicolo2);
    }
}
