package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.ClasseemissioniVeicolo;
import si.cnr.it.repository.ClasseemissioniVeicoloRepository;
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
 * Test class for the ClasseemissioniVeicoloResource REST controller.
 *
 * @see ClasseemissioniVeicoloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class ClasseemissioniVeicoloResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private ClasseemissioniVeicoloRepository classeemissioniVeicoloRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restClasseemissioniVeicoloMockMvc;

    private ClasseemissioniVeicolo classeemissioniVeicolo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ClasseemissioniVeicoloResource classeemissioniVeicoloResource = new ClasseemissioniVeicoloResource(classeemissioniVeicoloRepository);
        this.restClasseemissioniVeicoloMockMvc = MockMvcBuilders.standaloneSetup(classeemissioniVeicoloResource)
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
    public static ClasseemissioniVeicolo createEntity(EntityManager em) {
        ClasseemissioniVeicolo classeemissioniVeicolo = new ClasseemissioniVeicolo()
            .nome(DEFAULT_NOME);
        return classeemissioniVeicolo;
    }

    @Before
    public void initTest() {
        classeemissioniVeicolo = createEntity(em);
    }

    @Test
    @Transactional
    public void createClasseemissioniVeicolo() throws Exception {
        int databaseSizeBeforeCreate = classeemissioniVeicoloRepository.findAll().size();

        // Create the ClasseemissioniVeicolo
        restClasseemissioniVeicoloMockMvc.perform(post("/api/classeemissioni-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(classeemissioniVeicolo)))
            .andExpect(status().isCreated());

        // Validate the ClasseemissioniVeicolo in the database
        List<ClasseemissioniVeicolo> classeemissioniVeicoloList = classeemissioniVeicoloRepository.findAll();
        assertThat(classeemissioniVeicoloList).hasSize(databaseSizeBeforeCreate + 1);
        ClasseemissioniVeicolo testClasseemissioniVeicolo = classeemissioniVeicoloList.get(classeemissioniVeicoloList.size() - 1);
        assertThat(testClasseemissioniVeicolo.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    public void createClasseemissioniVeicoloWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = classeemissioniVeicoloRepository.findAll().size();

        // Create the ClasseemissioniVeicolo with an existing ID
        classeemissioniVeicolo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restClasseemissioniVeicoloMockMvc.perform(post("/api/classeemissioni-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(classeemissioniVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the ClasseemissioniVeicolo in the database
        List<ClasseemissioniVeicolo> classeemissioniVeicoloList = classeemissioniVeicoloRepository.findAll();
        assertThat(classeemissioniVeicoloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = classeemissioniVeicoloRepository.findAll().size();
        // set the field null
        classeemissioniVeicolo.setNome(null);

        // Create the ClasseemissioniVeicolo, which fails.

        restClasseemissioniVeicoloMockMvc.perform(post("/api/classeemissioni-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(classeemissioniVeicolo)))
            .andExpect(status().isBadRequest());

        List<ClasseemissioniVeicolo> classeemissioniVeicoloList = classeemissioniVeicoloRepository.findAll();
        assertThat(classeemissioniVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllClasseemissioniVeicolos() throws Exception {
        // Initialize the database
        classeemissioniVeicoloRepository.saveAndFlush(classeemissioniVeicolo);

        // Get all the classeemissioniVeicoloList
        restClasseemissioniVeicoloMockMvc.perform(get("/api/classeemissioni-veicolos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(classeemissioniVeicolo.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }
    
    @Test
    @Transactional
    public void getClasseemissioniVeicolo() throws Exception {
        // Initialize the database
        classeemissioniVeicoloRepository.saveAndFlush(classeemissioniVeicolo);

        // Get the classeemissioniVeicolo
        restClasseemissioniVeicoloMockMvc.perform(get("/api/classeemissioni-veicolos/{id}", classeemissioniVeicolo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(classeemissioniVeicolo.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingClasseemissioniVeicolo() throws Exception {
        // Get the classeemissioniVeicolo
        restClasseemissioniVeicoloMockMvc.perform(get("/api/classeemissioni-veicolos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateClasseemissioniVeicolo() throws Exception {
        // Initialize the database
        classeemissioniVeicoloRepository.saveAndFlush(classeemissioniVeicolo);

        int databaseSizeBeforeUpdate = classeemissioniVeicoloRepository.findAll().size();

        // Update the classeemissioniVeicolo
        ClasseemissioniVeicolo updatedClasseemissioniVeicolo = classeemissioniVeicoloRepository.findById(classeemissioniVeicolo.getId()).get();
        // Disconnect from session so that the updates on updatedClasseemissioniVeicolo are not directly saved in db
        em.detach(updatedClasseemissioniVeicolo);
        updatedClasseemissioniVeicolo
            .nome(UPDATED_NOME);

        restClasseemissioniVeicoloMockMvc.perform(put("/api/classeemissioni-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedClasseemissioniVeicolo)))
            .andExpect(status().isOk());

        // Validate the ClasseemissioniVeicolo in the database
        List<ClasseemissioniVeicolo> classeemissioniVeicoloList = classeemissioniVeicoloRepository.findAll();
        assertThat(classeemissioniVeicoloList).hasSize(databaseSizeBeforeUpdate);
        ClasseemissioniVeicolo testClasseemissioniVeicolo = classeemissioniVeicoloList.get(classeemissioniVeicoloList.size() - 1);
        assertThat(testClasseemissioniVeicolo.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    public void updateNonExistingClasseemissioniVeicolo() throws Exception {
        int databaseSizeBeforeUpdate = classeemissioniVeicoloRepository.findAll().size();

        // Create the ClasseemissioniVeicolo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClasseemissioniVeicoloMockMvc.perform(put("/api/classeemissioni-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(classeemissioniVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the ClasseemissioniVeicolo in the database
        List<ClasseemissioniVeicolo> classeemissioniVeicoloList = classeemissioniVeicoloRepository.findAll();
        assertThat(classeemissioniVeicoloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteClasseemissioniVeicolo() throws Exception {
        // Initialize the database
        classeemissioniVeicoloRepository.saveAndFlush(classeemissioniVeicolo);

        int databaseSizeBeforeDelete = classeemissioniVeicoloRepository.findAll().size();

        // Get the classeemissioniVeicolo
        restClasseemissioniVeicoloMockMvc.perform(delete("/api/classeemissioni-veicolos/{id}", classeemissioniVeicolo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ClasseemissioniVeicolo> classeemissioniVeicoloList = classeemissioniVeicoloRepository.findAll();
        assertThat(classeemissioniVeicoloList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClasseemissioniVeicolo.class);
        ClasseemissioniVeicolo classeemissioniVeicolo1 = new ClasseemissioniVeicolo();
        classeemissioniVeicolo1.setId(1L);
        ClasseemissioniVeicolo classeemissioniVeicolo2 = new ClasseemissioniVeicolo();
        classeemissioniVeicolo2.setId(classeemissioniVeicolo1.getId());
        assertThat(classeemissioniVeicolo1).isEqualTo(classeemissioniVeicolo2);
        classeemissioniVeicolo2.setId(2L);
        assertThat(classeemissioniVeicolo1).isNotEqualTo(classeemissioniVeicolo2);
        classeemissioniVeicolo1.setId(null);
        assertThat(classeemissioniVeicolo1).isNotEqualTo(classeemissioniVeicolo2);
    }
}
