package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.UtilizzobeneVeicolo;
import si.cnr.it.repository.UtilizzobeneVeicoloRepository;
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
 * Test class for the UtilizzobeneVeicoloResource REST controller.
 *
 * @see UtilizzobeneVeicoloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class UtilizzobeneVeicoloResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private UtilizzobeneVeicoloRepository utilizzobeneVeicoloRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restUtilizzobeneVeicoloMockMvc;

    private UtilizzobeneVeicolo utilizzobeneVeicolo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UtilizzobeneVeicoloResource utilizzobeneVeicoloResource = new UtilizzobeneVeicoloResource(utilizzobeneVeicoloRepository);
        this.restUtilizzobeneVeicoloMockMvc = MockMvcBuilders.standaloneSetup(utilizzobeneVeicoloResource)
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
    public static UtilizzobeneVeicolo createEntity(EntityManager em) {
        UtilizzobeneVeicolo utilizzobeneVeicolo = new UtilizzobeneVeicolo()
            .nome(DEFAULT_NOME);
        return utilizzobeneVeicolo;
    }

    @Before
    public void initTest() {
        utilizzobeneVeicolo = createEntity(em);
    }

    @Test
    @Transactional
    public void createUtilizzobeneVeicolo() throws Exception {
        int databaseSizeBeforeCreate = utilizzobeneVeicoloRepository.findAll().size();

        // Create the UtilizzobeneVeicolo
        restUtilizzobeneVeicoloMockMvc.perform(post("/api/utilizzobene-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utilizzobeneVeicolo)))
            .andExpect(status().isCreated());

        // Validate the UtilizzobeneVeicolo in the database
        List<UtilizzobeneVeicolo> utilizzobeneVeicoloList = utilizzobeneVeicoloRepository.findAll();
        assertThat(utilizzobeneVeicoloList).hasSize(databaseSizeBeforeCreate + 1);
        UtilizzobeneVeicolo testUtilizzobeneVeicolo = utilizzobeneVeicoloList.get(utilizzobeneVeicoloList.size() - 1);
        assertThat(testUtilizzobeneVeicolo.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    public void createUtilizzobeneVeicoloWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = utilizzobeneVeicoloRepository.findAll().size();

        // Create the UtilizzobeneVeicolo with an existing ID
        utilizzobeneVeicolo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUtilizzobeneVeicoloMockMvc.perform(post("/api/utilizzobene-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utilizzobeneVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the UtilizzobeneVeicolo in the database
        List<UtilizzobeneVeicolo> utilizzobeneVeicoloList = utilizzobeneVeicoloRepository.findAll();
        assertThat(utilizzobeneVeicoloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = utilizzobeneVeicoloRepository.findAll().size();
        // set the field null
        utilizzobeneVeicolo.setNome(null);

        // Create the UtilizzobeneVeicolo, which fails.

        restUtilizzobeneVeicoloMockMvc.perform(post("/api/utilizzobene-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utilizzobeneVeicolo)))
            .andExpect(status().isBadRequest());

        List<UtilizzobeneVeicolo> utilizzobeneVeicoloList = utilizzobeneVeicoloRepository.findAll();
        assertThat(utilizzobeneVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUtilizzobeneVeicolos() throws Exception {
        // Initialize the database
        utilizzobeneVeicoloRepository.saveAndFlush(utilizzobeneVeicolo);

        // Get all the utilizzobeneVeicoloList
        restUtilizzobeneVeicoloMockMvc.perform(get("/api/utilizzobene-veicolos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(utilizzobeneVeicolo.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }
    
    @Test
    @Transactional
    public void getUtilizzobeneVeicolo() throws Exception {
        // Initialize the database
        utilizzobeneVeicoloRepository.saveAndFlush(utilizzobeneVeicolo);

        // Get the utilizzobeneVeicolo
        restUtilizzobeneVeicoloMockMvc.perform(get("/api/utilizzobene-veicolos/{id}", utilizzobeneVeicolo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(utilizzobeneVeicolo.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingUtilizzobeneVeicolo() throws Exception {
        // Get the utilizzobeneVeicolo
        restUtilizzobeneVeicoloMockMvc.perform(get("/api/utilizzobene-veicolos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUtilizzobeneVeicolo() throws Exception {
        // Initialize the database
        utilizzobeneVeicoloRepository.saveAndFlush(utilizzobeneVeicolo);

        int databaseSizeBeforeUpdate = utilizzobeneVeicoloRepository.findAll().size();

        // Update the utilizzobeneVeicolo
        UtilizzobeneVeicolo updatedUtilizzobeneVeicolo = utilizzobeneVeicoloRepository.findById(utilizzobeneVeicolo.getId()).get();
        // Disconnect from session so that the updates on updatedUtilizzobeneVeicolo are not directly saved in db
        em.detach(updatedUtilizzobeneVeicolo);
        updatedUtilizzobeneVeicolo
            .nome(UPDATED_NOME);

        restUtilizzobeneVeicoloMockMvc.perform(put("/api/utilizzobene-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUtilizzobeneVeicolo)))
            .andExpect(status().isOk());

        // Validate the UtilizzobeneVeicolo in the database
        List<UtilizzobeneVeicolo> utilizzobeneVeicoloList = utilizzobeneVeicoloRepository.findAll();
        assertThat(utilizzobeneVeicoloList).hasSize(databaseSizeBeforeUpdate);
        UtilizzobeneVeicolo testUtilizzobeneVeicolo = utilizzobeneVeicoloList.get(utilizzobeneVeicoloList.size() - 1);
        assertThat(testUtilizzobeneVeicolo.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    public void updateNonExistingUtilizzobeneVeicolo() throws Exception {
        int databaseSizeBeforeUpdate = utilizzobeneVeicoloRepository.findAll().size();

        // Create the UtilizzobeneVeicolo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUtilizzobeneVeicoloMockMvc.perform(put("/api/utilizzobene-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(utilizzobeneVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the UtilizzobeneVeicolo in the database
        List<UtilizzobeneVeicolo> utilizzobeneVeicoloList = utilizzobeneVeicoloRepository.findAll();
        assertThat(utilizzobeneVeicoloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUtilizzobeneVeicolo() throws Exception {
        // Initialize the database
        utilizzobeneVeicoloRepository.saveAndFlush(utilizzobeneVeicolo);

        int databaseSizeBeforeDelete = utilizzobeneVeicoloRepository.findAll().size();

        // Get the utilizzobeneVeicolo
        restUtilizzobeneVeicoloMockMvc.perform(delete("/api/utilizzobene-veicolos/{id}", utilizzobeneVeicolo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<UtilizzobeneVeicolo> utilizzobeneVeicoloList = utilizzobeneVeicoloRepository.findAll();
        assertThat(utilizzobeneVeicoloList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UtilizzobeneVeicolo.class);
        UtilizzobeneVeicolo utilizzobeneVeicolo1 = new UtilizzobeneVeicolo();
        utilizzobeneVeicolo1.setId(1L);
        UtilizzobeneVeicolo utilizzobeneVeicolo2 = new UtilizzobeneVeicolo();
        utilizzobeneVeicolo2.setId(utilizzobeneVeicolo1.getId());
        assertThat(utilizzobeneVeicolo1).isEqualTo(utilizzobeneVeicolo2);
        utilizzobeneVeicolo2.setId(2L);
        assertThat(utilizzobeneVeicolo1).isNotEqualTo(utilizzobeneVeicolo2);
        utilizzobeneVeicolo1.setId(null);
        assertThat(utilizzobeneVeicolo1).isNotEqualTo(utilizzobeneVeicolo2);
    }
}
