package it.cnr.si.web.rest;

import it.cnr.si.domain.AlimentazioneVeicolo;
import it.cnr.si.ParcoautoApp;

import it.cnr.si.repository.AlimentazioneVeicoloRepository;
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
 * Test class for the AlimentazioneVeicoloResource REST controller.
 *
 * @see AlimentazioneVeicoloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class AlimentazioneVeicoloResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private AlimentazioneVeicoloRepository alimentazioneVeicoloRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAlimentazioneVeicoloMockMvc;

    private AlimentazioneVeicolo alimentazioneVeicolo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AlimentazioneVeicoloResource alimentazioneVeicoloResource = new AlimentazioneVeicoloResource(alimentazioneVeicoloRepository);
        this.restAlimentazioneVeicoloMockMvc = MockMvcBuilders.standaloneSetup(alimentazioneVeicoloResource)
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
    public static AlimentazioneVeicolo createEntity(EntityManager em) {
        AlimentazioneVeicolo alimentazioneVeicolo = new AlimentazioneVeicolo()
            .nome(DEFAULT_NOME);
        return alimentazioneVeicolo;
    }

    @Before
    public void initTest() {
        alimentazioneVeicolo = createEntity(em);
    }

    @Test
    @Transactional
    public void createAlimentazioneVeicolo() throws Exception {
        int databaseSizeBeforeCreate = alimentazioneVeicoloRepository.findAll().size();

        // Create the AlimentazioneVeicolo
        restAlimentazioneVeicoloMockMvc.perform(post("/api/alimentazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(alimentazioneVeicolo)))
            .andExpect(status().isCreated());

        // Validate the AlimentazioneVeicolo in the database
        List<AlimentazioneVeicolo> alimentazioneVeicoloList = alimentazioneVeicoloRepository.findAll();
        assertThat(alimentazioneVeicoloList).hasSize(databaseSizeBeforeCreate + 1);
        AlimentazioneVeicolo testAlimentazioneVeicolo = alimentazioneVeicoloList.get(alimentazioneVeicoloList.size() - 1);
        assertThat(testAlimentazioneVeicolo.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    public void createAlimentazioneVeicoloWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = alimentazioneVeicoloRepository.findAll().size();

        // Create the AlimentazioneVeicolo with an existing ID
        alimentazioneVeicolo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAlimentazioneVeicoloMockMvc.perform(post("/api/alimentazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(alimentazioneVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the AlimentazioneVeicolo in the database
        List<AlimentazioneVeicolo> alimentazioneVeicoloList = alimentazioneVeicoloRepository.findAll();
        assertThat(alimentazioneVeicoloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = alimentazioneVeicoloRepository.findAll().size();
        // set the field null
        alimentazioneVeicolo.setNome(null);

        // Create the AlimentazioneVeicolo, which fails.

        restAlimentazioneVeicoloMockMvc.perform(post("/api/alimentazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(alimentazioneVeicolo)))
            .andExpect(status().isBadRequest());

        List<AlimentazioneVeicolo> alimentazioneVeicoloList = alimentazioneVeicoloRepository.findAll();
        assertThat(alimentazioneVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAlimentazioneVeicolos() throws Exception {
        // Initialize the database
        alimentazioneVeicoloRepository.saveAndFlush(alimentazioneVeicolo);

        // Get all the alimentazioneVeicoloList
        restAlimentazioneVeicoloMockMvc.perform(get("/api/alimentazione-veicolos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(alimentazioneVeicolo.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }
    
    @Test
    @Transactional
    public void getAlimentazioneVeicolo() throws Exception {
        // Initialize the database
        alimentazioneVeicoloRepository.saveAndFlush(alimentazioneVeicolo);

        // Get the alimentazioneVeicolo
        restAlimentazioneVeicoloMockMvc.perform(get("/api/alimentazione-veicolos/{id}", alimentazioneVeicolo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(alimentazioneVeicolo.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingAlimentazioneVeicolo() throws Exception {
        // Get the alimentazioneVeicolo
        restAlimentazioneVeicoloMockMvc.perform(get("/api/alimentazione-veicolos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAlimentazioneVeicolo() throws Exception {
        // Initialize the database
        alimentazioneVeicoloRepository.saveAndFlush(alimentazioneVeicolo);

        int databaseSizeBeforeUpdate = alimentazioneVeicoloRepository.findAll().size();

        // Update the alimentazioneVeicolo
        AlimentazioneVeicolo updatedAlimentazioneVeicolo = alimentazioneVeicoloRepository.findById(alimentazioneVeicolo.getId()).get();
        // Disconnect from session so that the updates on updatedAlimentazioneVeicolo are not directly saved in db
        em.detach(updatedAlimentazioneVeicolo);
        updatedAlimentazioneVeicolo
            .nome(UPDATED_NOME);

        restAlimentazioneVeicoloMockMvc.perform(put("/api/alimentazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAlimentazioneVeicolo)))
            .andExpect(status().isOk());

        // Validate the AlimentazioneVeicolo in the database
        List<AlimentazioneVeicolo> alimentazioneVeicoloList = alimentazioneVeicoloRepository.findAll();
        assertThat(alimentazioneVeicoloList).hasSize(databaseSizeBeforeUpdate);
        AlimentazioneVeicolo testAlimentazioneVeicolo = alimentazioneVeicoloList.get(alimentazioneVeicoloList.size() - 1);
        assertThat(testAlimentazioneVeicolo.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    public void updateNonExistingAlimentazioneVeicolo() throws Exception {
        int databaseSizeBeforeUpdate = alimentazioneVeicoloRepository.findAll().size();

        // Create the AlimentazioneVeicolo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlimentazioneVeicoloMockMvc.perform(put("/api/alimentazione-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(alimentazioneVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the AlimentazioneVeicolo in the database
        List<AlimentazioneVeicolo> alimentazioneVeicoloList = alimentazioneVeicoloRepository.findAll();
        assertThat(alimentazioneVeicoloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAlimentazioneVeicolo() throws Exception {
        // Initialize the database
        alimentazioneVeicoloRepository.saveAndFlush(alimentazioneVeicolo);

        int databaseSizeBeforeDelete = alimentazioneVeicoloRepository.findAll().size();

        // Get the alimentazioneVeicolo
        restAlimentazioneVeicoloMockMvc.perform(delete("/api/alimentazione-veicolos/{id}", alimentazioneVeicolo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<AlimentazioneVeicolo> alimentazioneVeicoloList = alimentazioneVeicoloRepository.findAll();
        assertThat(alimentazioneVeicoloList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AlimentazioneVeicolo.class);
        AlimentazioneVeicolo alimentazioneVeicolo1 = new AlimentazioneVeicolo();
        alimentazioneVeicolo1.setId(1L);
        AlimentazioneVeicolo alimentazioneVeicolo2 = new AlimentazioneVeicolo();
        alimentazioneVeicolo2.setId(alimentazioneVeicolo1.getId());
        assertThat(alimentazioneVeicolo1).isEqualTo(alimentazioneVeicolo2);
        alimentazioneVeicolo2.setId(2L);
        assertThat(alimentazioneVeicolo1).isNotEqualTo(alimentazioneVeicolo2);
        alimentazioneVeicolo1.setId(null);
        assertThat(alimentazioneVeicolo1).isNotEqualTo(alimentazioneVeicolo2);
    }
}
