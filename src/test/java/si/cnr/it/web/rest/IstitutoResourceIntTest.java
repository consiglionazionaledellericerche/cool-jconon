package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.Istituto;
import si.cnr.it.repository.IstitutoRepository;
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
 * Test class for the IstitutoResource REST controller.
 *
 * @see IstitutoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class IstitutoResourceIntTest {

    private static final String DEFAULT_CDS = "AAAAAAAAAA";
    private static final String UPDATED_CDS = "BBBBBBBBBB";

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private IstitutoRepository istitutoRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restIstitutoMockMvc;

    private Istituto istituto;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final IstitutoResource istitutoResource = new IstitutoResource(istitutoRepository);
        this.restIstitutoMockMvc = MockMvcBuilders.standaloneSetup(istitutoResource)
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
    public static Istituto createEntity(EntityManager em) {
        Istituto istituto = new Istituto()
            .cds(DEFAULT_CDS)
            .nome(DEFAULT_NOME);
        return istituto;
    }

    @Before
    public void initTest() {
        istituto = createEntity(em);
    }

    @Test
    @Transactional
    public void createIstituto() throws Exception {
        int databaseSizeBeforeCreate = istitutoRepository.findAll().size();

        // Create the Istituto
        restIstitutoMockMvc.perform(post("/api/istitutos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituto)))
            .andExpect(status().isCreated());

        // Validate the Istituto in the database
        List<Istituto> istitutoList = istitutoRepository.findAll();
        assertThat(istitutoList).hasSize(databaseSizeBeforeCreate + 1);
        Istituto testIstituto = istitutoList.get(istitutoList.size() - 1);
        assertThat(testIstituto.getCds()).isEqualTo(DEFAULT_CDS);
        assertThat(testIstituto.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    public void createIstitutoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = istitutoRepository.findAll().size();

        // Create the Istituto with an existing ID
        istituto.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restIstitutoMockMvc.perform(post("/api/istitutos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituto)))
            .andExpect(status().isBadRequest());

        // Validate the Istituto in the database
        List<Istituto> istitutoList = istitutoRepository.findAll();
        assertThat(istitutoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkCdsIsRequired() throws Exception {
        int databaseSizeBeforeTest = istitutoRepository.findAll().size();
        // set the field null
        istituto.setCds(null);

        // Create the Istituto, which fails.

        restIstitutoMockMvc.perform(post("/api/istitutos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituto)))
            .andExpect(status().isBadRequest());

        List<Istituto> istitutoList = istitutoRepository.findAll();
        assertThat(istitutoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = istitutoRepository.findAll().size();
        // set the field null
        istituto.setNome(null);

        // Create the Istituto, which fails.

        restIstitutoMockMvc.perform(post("/api/istitutos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituto)))
            .andExpect(status().isBadRequest());

        List<Istituto> istitutoList = istitutoRepository.findAll();
        assertThat(istitutoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllIstitutos() throws Exception {
        // Initialize the database
        istitutoRepository.saveAndFlush(istituto);

        // Get all the istitutoList
        restIstitutoMockMvc.perform(get("/api/istitutos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(istituto.getId().intValue())))
            .andExpect(jsonPath("$.[*].cds").value(hasItem(DEFAULT_CDS.toString())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }
    
    @Test
    @Transactional
    public void getIstituto() throws Exception {
        // Initialize the database
        istitutoRepository.saveAndFlush(istituto);

        // Get the istituto
        restIstitutoMockMvc.perform(get("/api/istitutos/{id}", istituto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(istituto.getId().intValue()))
            .andExpect(jsonPath("$.cds").value(DEFAULT_CDS.toString()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingIstituto() throws Exception {
        // Get the istituto
        restIstitutoMockMvc.perform(get("/api/istitutos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateIstituto() throws Exception {
        // Initialize the database
        istitutoRepository.saveAndFlush(istituto);

        int databaseSizeBeforeUpdate = istitutoRepository.findAll().size();

        // Update the istituto
        Istituto updatedIstituto = istitutoRepository.findById(istituto.getId()).get();
        // Disconnect from session so that the updates on updatedIstituto are not directly saved in db
        em.detach(updatedIstituto);
        updatedIstituto
            .cds(UPDATED_CDS)
            .nome(UPDATED_NOME);

        restIstitutoMockMvc.perform(put("/api/istitutos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedIstituto)))
            .andExpect(status().isOk());

        // Validate the Istituto in the database
        List<Istituto> istitutoList = istitutoRepository.findAll();
        assertThat(istitutoList).hasSize(databaseSizeBeforeUpdate);
        Istituto testIstituto = istitutoList.get(istitutoList.size() - 1);
        assertThat(testIstituto.getCds()).isEqualTo(UPDATED_CDS);
        assertThat(testIstituto.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    public void updateNonExistingIstituto() throws Exception {
        int databaseSizeBeforeUpdate = istitutoRepository.findAll().size();

        // Create the Istituto

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIstitutoMockMvc.perform(put("/api/istitutos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(istituto)))
            .andExpect(status().isBadRequest());

        // Validate the Istituto in the database
        List<Istituto> istitutoList = istitutoRepository.findAll();
        assertThat(istitutoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteIstituto() throws Exception {
        // Initialize the database
        istitutoRepository.saveAndFlush(istituto);

        int databaseSizeBeforeDelete = istitutoRepository.findAll().size();

        // Get the istituto
        restIstitutoMockMvc.perform(delete("/api/istitutos/{id}", istituto.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Istituto> istitutoList = istitutoRepository.findAll();
        assertThat(istitutoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Istituto.class);
        Istituto istituto1 = new Istituto();
        istituto1.setId(1L);
        Istituto istituto2 = new Istituto();
        istituto2.setId(istituto1.getId());
        assertThat(istituto1).isEqualTo(istituto2);
        istituto2.setId(2L);
        assertThat(istituto1).isNotEqualTo(istituto2);
        istituto1.setId(null);
        assertThat(istituto1).isNotEqualTo(istituto2);
    }
}
