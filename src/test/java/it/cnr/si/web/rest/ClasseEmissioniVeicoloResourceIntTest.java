package it.cnr.si.web.rest;

import it.cnr.si.domain.ClasseEmissioniVeicolo;
import it.cnr.si.ParcoautoApp;

import it.cnr.si.repository.ClasseEmissioniVeicoloRepository;
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
 * Test class for the ClasseEmissioniVeicoloResource REST controller.
 *
 * @see ClasseEmissioniVeicoloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class ClasseEmissioniVeicoloResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private ClasseEmissioniVeicoloRepository classeEmissioniVeicoloRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restClasseEmissioniVeicoloMockMvc;

    private ClasseEmissioniVeicolo classeEmissioniVeicolo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ClasseEmissioniVeicoloResource classeEmissioniVeicoloResource = new ClasseEmissioniVeicoloResource(classeEmissioniVeicoloRepository);
        this.restClasseEmissioniVeicoloMockMvc = MockMvcBuilders.standaloneSetup(classeEmissioniVeicoloResource)
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
    public static ClasseEmissioniVeicolo createEntity(EntityManager em) {
        ClasseEmissioniVeicolo classeEmissioniVeicolo = new ClasseEmissioniVeicolo()
            .nome(DEFAULT_NOME);
        return classeEmissioniVeicolo;
    }

    @Before
    public void initTest() {
        classeEmissioniVeicolo = createEntity(em);
    }

    @Test
    @Transactional
    public void createClasseEmissioniVeicolo() throws Exception {
        int databaseSizeBeforeCreate = classeEmissioniVeicoloRepository.findAll().size();

        // Create the ClasseEmissioniVeicolo
        restClasseEmissioniVeicoloMockMvc.perform(post("/api/classe-emissioni-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(classeEmissioniVeicolo)))
            .andExpect(status().isCreated());

        // Validate the ClasseEmissioniVeicolo in the database
        List<ClasseEmissioniVeicolo> classeEmissioniVeicoloList = classeEmissioniVeicoloRepository.findAll();
        assertThat(classeEmissioniVeicoloList).hasSize(databaseSizeBeforeCreate + 1);
        ClasseEmissioniVeicolo testClasseEmissioniVeicolo = classeEmissioniVeicoloList.get(classeEmissioniVeicoloList.size() - 1);
        assertThat(testClasseEmissioniVeicolo.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    public void createClasseEmissioniVeicoloWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = classeEmissioniVeicoloRepository.findAll().size();

        // Create the ClasseEmissioniVeicolo with an existing ID
        classeEmissioniVeicolo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restClasseEmissioniVeicoloMockMvc.perform(post("/api/classe-emissioni-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(classeEmissioniVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the ClasseEmissioniVeicolo in the database
        List<ClasseEmissioniVeicolo> classeEmissioniVeicoloList = classeEmissioniVeicoloRepository.findAll();
        assertThat(classeEmissioniVeicoloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = classeEmissioniVeicoloRepository.findAll().size();
        // set the field null
        classeEmissioniVeicolo.setNome(null);

        // Create the ClasseEmissioniVeicolo, which fails.

        restClasseEmissioniVeicoloMockMvc.perform(post("/api/classe-emissioni-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(classeEmissioniVeicolo)))
            .andExpect(status().isBadRequest());

        List<ClasseEmissioniVeicolo> classeEmissioniVeicoloList = classeEmissioniVeicoloRepository.findAll();
        assertThat(classeEmissioniVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllClasseEmissioniVeicolos() throws Exception {
        // Initialize the database
        classeEmissioniVeicoloRepository.saveAndFlush(classeEmissioniVeicolo);

        // Get all the classeEmissioniVeicoloList
        restClasseEmissioniVeicoloMockMvc.perform(get("/api/classe-emissioni-veicolos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(classeEmissioniVeicolo.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }
    
    @Test
    @Transactional
    public void getClasseEmissioniVeicolo() throws Exception {
        // Initialize the database
        classeEmissioniVeicoloRepository.saveAndFlush(classeEmissioniVeicolo);

        // Get the classeEmissioniVeicolo
        restClasseEmissioniVeicoloMockMvc.perform(get("/api/classe-emissioni-veicolos/{id}", classeEmissioniVeicolo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(classeEmissioniVeicolo.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingClasseEmissioniVeicolo() throws Exception {
        // Get the classeEmissioniVeicolo
        restClasseEmissioniVeicoloMockMvc.perform(get("/api/classe-emissioni-veicolos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateClasseEmissioniVeicolo() throws Exception {
        // Initialize the database
        classeEmissioniVeicoloRepository.saveAndFlush(classeEmissioniVeicolo);

        int databaseSizeBeforeUpdate = classeEmissioniVeicoloRepository.findAll().size();

        // Update the classeEmissioniVeicolo
        ClasseEmissioniVeicolo updatedClasseEmissioniVeicolo = classeEmissioniVeicoloRepository.findById(classeEmissioniVeicolo.getId()).get();
        // Disconnect from session so that the updates on updatedClasseEmissioniVeicolo are not directly saved in db
        em.detach(updatedClasseEmissioniVeicolo);
        updatedClasseEmissioniVeicolo
            .nome(UPDATED_NOME);

        restClasseEmissioniVeicoloMockMvc.perform(put("/api/classe-emissioni-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedClasseEmissioniVeicolo)))
            .andExpect(status().isOk());

        // Validate the ClasseEmissioniVeicolo in the database
        List<ClasseEmissioniVeicolo> classeEmissioniVeicoloList = classeEmissioniVeicoloRepository.findAll();
        assertThat(classeEmissioniVeicoloList).hasSize(databaseSizeBeforeUpdate);
        ClasseEmissioniVeicolo testClasseEmissioniVeicolo = classeEmissioniVeicoloList.get(classeEmissioniVeicoloList.size() - 1);
        assertThat(testClasseEmissioniVeicolo.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    public void updateNonExistingClasseEmissioniVeicolo() throws Exception {
        int databaseSizeBeforeUpdate = classeEmissioniVeicoloRepository.findAll().size();

        // Create the ClasseEmissioniVeicolo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClasseEmissioniVeicoloMockMvc.perform(put("/api/classe-emissioni-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(classeEmissioniVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the ClasseEmissioniVeicolo in the database
        List<ClasseEmissioniVeicolo> classeEmissioniVeicoloList = classeEmissioniVeicoloRepository.findAll();
        assertThat(classeEmissioniVeicoloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteClasseEmissioniVeicolo() throws Exception {
        // Initialize the database
        classeEmissioniVeicoloRepository.saveAndFlush(classeEmissioniVeicolo);

        int databaseSizeBeforeDelete = classeEmissioniVeicoloRepository.findAll().size();

        // Get the classeEmissioniVeicolo
        restClasseEmissioniVeicoloMockMvc.perform(delete("/api/classe-emissioni-veicolos/{id}", classeEmissioniVeicolo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ClasseEmissioniVeicolo> classeEmissioniVeicoloList = classeEmissioniVeicoloRepository.findAll();
        assertThat(classeEmissioniVeicoloList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClasseEmissioniVeicolo.class);
        ClasseEmissioniVeicolo classeEmissioniVeicolo1 = new ClasseEmissioniVeicolo();
        classeEmissioniVeicolo1.setId(1L);
        ClasseEmissioniVeicolo classeEmissioniVeicolo2 = new ClasseEmissioniVeicolo();
        classeEmissioniVeicolo2.setId(classeEmissioniVeicolo1.getId());
        assertThat(classeEmissioniVeicolo1).isEqualTo(classeEmissioniVeicolo2);
        classeEmissioniVeicolo2.setId(2L);
        assertThat(classeEmissioniVeicolo1).isNotEqualTo(classeEmissioniVeicolo2);
        classeEmissioniVeicolo1.setId(null);
        assertThat(classeEmissioniVeicolo1).isNotEqualTo(classeEmissioniVeicolo2);
    }
}
