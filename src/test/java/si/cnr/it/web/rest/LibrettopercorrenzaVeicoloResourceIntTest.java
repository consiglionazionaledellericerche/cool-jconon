package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.LibrettopercorrenzaVeicolo;
import si.cnr.it.domain.Veicolo;
import si.cnr.it.repository.LibrettopercorrenzaVeicoloRepository;
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
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;


import static si.cnr.it.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the LibrettopercorrenzaVeicoloResource REST controller.
 *
 * @see LibrettopercorrenzaVeicoloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class LibrettopercorrenzaVeicoloResourceIntTest {

    private static final byte[] DEFAULT_LIBRETTO_PERCORRENZA = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LIBRETTO_PERCORRENZA = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LIBRETTO_PERCORRENZA_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LIBRETTO_PERCORRENZA_CONTENT_TYPE = "image/png";

    private static final Instant DEFAULT_DATA = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private LibrettopercorrenzaVeicoloRepository librettopercorrenzaVeicoloRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLibrettopercorrenzaVeicoloMockMvc;

    private LibrettopercorrenzaVeicolo librettopercorrenzaVeicolo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LibrettopercorrenzaVeicoloResource librettopercorrenzaVeicoloResource = new LibrettopercorrenzaVeicoloResource(librettopercorrenzaVeicoloRepository);
        this.restLibrettopercorrenzaVeicoloMockMvc = MockMvcBuilders.standaloneSetup(librettopercorrenzaVeicoloResource)
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
    public static LibrettopercorrenzaVeicolo createEntity(EntityManager em) {
        LibrettopercorrenzaVeicolo librettopercorrenzaVeicolo = new LibrettopercorrenzaVeicolo()
            .librettoPercorrenza(DEFAULT_LIBRETTO_PERCORRENZA)
            .librettoPercorrenzaContentType(DEFAULT_LIBRETTO_PERCORRENZA_CONTENT_TYPE)
            .data(DEFAULT_DATA);
        // Add required entity
        Veicolo veicolo = VeicoloResourceIntTest.createEntity(em);
        em.persist(veicolo);
        em.flush();
        librettopercorrenzaVeicolo.setTarga(veicolo);
        return librettopercorrenzaVeicolo;
    }

    @Before
    public void initTest() {
        librettopercorrenzaVeicolo = createEntity(em);
    }

    @Test
    @Transactional
    public void createLibrettopercorrenzaVeicolo() throws Exception {
        int databaseSizeBeforeCreate = librettopercorrenzaVeicoloRepository.findAll().size();

        // Create the LibrettopercorrenzaVeicolo
        restLibrettopercorrenzaVeicoloMockMvc.perform(post("/api/librettopercorrenza-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(librettopercorrenzaVeicolo)))
            .andExpect(status().isCreated());

        // Validate the LibrettopercorrenzaVeicolo in the database
        List<LibrettopercorrenzaVeicolo> librettopercorrenzaVeicoloList = librettopercorrenzaVeicoloRepository.findAll();
        assertThat(librettopercorrenzaVeicoloList).hasSize(databaseSizeBeforeCreate + 1);
        LibrettopercorrenzaVeicolo testLibrettopercorrenzaVeicolo = librettopercorrenzaVeicoloList.get(librettopercorrenzaVeicoloList.size() - 1);
        assertThat(testLibrettopercorrenzaVeicolo.getLibrettoPercorrenza()).isEqualTo(DEFAULT_LIBRETTO_PERCORRENZA);
        assertThat(testLibrettopercorrenzaVeicolo.getLibrettoPercorrenzaContentType()).isEqualTo(DEFAULT_LIBRETTO_PERCORRENZA_CONTENT_TYPE);
        assertThat(testLibrettopercorrenzaVeicolo.getData()).isEqualTo(DEFAULT_DATA);
    }

    @Test
    @Transactional
    public void createLibrettopercorrenzaVeicoloWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = librettopercorrenzaVeicoloRepository.findAll().size();

        // Create the LibrettopercorrenzaVeicolo with an existing ID
        librettopercorrenzaVeicolo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLibrettopercorrenzaVeicoloMockMvc.perform(post("/api/librettopercorrenza-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(librettopercorrenzaVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the LibrettopercorrenzaVeicolo in the database
        List<LibrettopercorrenzaVeicolo> librettopercorrenzaVeicoloList = librettopercorrenzaVeicoloRepository.findAll();
        assertThat(librettopercorrenzaVeicoloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDataIsRequired() throws Exception {
        int databaseSizeBeforeTest = librettopercorrenzaVeicoloRepository.findAll().size();
        // set the field null
        librettopercorrenzaVeicolo.setData(null);

        // Create the LibrettopercorrenzaVeicolo, which fails.

        restLibrettopercorrenzaVeicoloMockMvc.perform(post("/api/librettopercorrenza-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(librettopercorrenzaVeicolo)))
            .andExpect(status().isBadRequest());

        List<LibrettopercorrenzaVeicolo> librettopercorrenzaVeicoloList = librettopercorrenzaVeicoloRepository.findAll();
        assertThat(librettopercorrenzaVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLibrettopercorrenzaVeicolos() throws Exception {
        // Initialize the database
        librettopercorrenzaVeicoloRepository.saveAndFlush(librettopercorrenzaVeicolo);

        // Get all the librettopercorrenzaVeicoloList
        restLibrettopercorrenzaVeicoloMockMvc.perform(get("/api/librettopercorrenza-veicolos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(librettopercorrenzaVeicolo.getId().intValue())))
            .andExpect(jsonPath("$.[*].librettoPercorrenzaContentType").value(hasItem(DEFAULT_LIBRETTO_PERCORRENZA_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].librettoPercorrenza").value(hasItem(Base64Utils.encodeToString(DEFAULT_LIBRETTO_PERCORRENZA))))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())));
    }
    
    @Test
    @Transactional
    public void getLibrettopercorrenzaVeicolo() throws Exception {
        // Initialize the database
        librettopercorrenzaVeicoloRepository.saveAndFlush(librettopercorrenzaVeicolo);

        // Get the librettopercorrenzaVeicolo
        restLibrettopercorrenzaVeicoloMockMvc.perform(get("/api/librettopercorrenza-veicolos/{id}", librettopercorrenzaVeicolo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(librettopercorrenzaVeicolo.getId().intValue()))
            .andExpect(jsonPath("$.librettoPercorrenzaContentType").value(DEFAULT_LIBRETTO_PERCORRENZA_CONTENT_TYPE))
            .andExpect(jsonPath("$.librettoPercorrenza").value(Base64Utils.encodeToString(DEFAULT_LIBRETTO_PERCORRENZA)))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLibrettopercorrenzaVeicolo() throws Exception {
        // Get the librettopercorrenzaVeicolo
        restLibrettopercorrenzaVeicoloMockMvc.perform(get("/api/librettopercorrenza-veicolos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLibrettopercorrenzaVeicolo() throws Exception {
        // Initialize the database
        librettopercorrenzaVeicoloRepository.saveAndFlush(librettopercorrenzaVeicolo);

        int databaseSizeBeforeUpdate = librettopercorrenzaVeicoloRepository.findAll().size();

        // Update the librettopercorrenzaVeicolo
        LibrettopercorrenzaVeicolo updatedLibrettopercorrenzaVeicolo = librettopercorrenzaVeicoloRepository.findById(librettopercorrenzaVeicolo.getId()).get();
        // Disconnect from session so that the updates on updatedLibrettopercorrenzaVeicolo are not directly saved in db
        em.detach(updatedLibrettopercorrenzaVeicolo);
        updatedLibrettopercorrenzaVeicolo
            .librettoPercorrenza(UPDATED_LIBRETTO_PERCORRENZA)
            .librettoPercorrenzaContentType(UPDATED_LIBRETTO_PERCORRENZA_CONTENT_TYPE)
            .data(UPDATED_DATA);

        restLibrettopercorrenzaVeicoloMockMvc.perform(put("/api/librettopercorrenza-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLibrettopercorrenzaVeicolo)))
            .andExpect(status().isOk());

        // Validate the LibrettopercorrenzaVeicolo in the database
        List<LibrettopercorrenzaVeicolo> librettopercorrenzaVeicoloList = librettopercorrenzaVeicoloRepository.findAll();
        assertThat(librettopercorrenzaVeicoloList).hasSize(databaseSizeBeforeUpdate);
        LibrettopercorrenzaVeicolo testLibrettopercorrenzaVeicolo = librettopercorrenzaVeicoloList.get(librettopercorrenzaVeicoloList.size() - 1);
        assertThat(testLibrettopercorrenzaVeicolo.getLibrettoPercorrenza()).isEqualTo(UPDATED_LIBRETTO_PERCORRENZA);
        assertThat(testLibrettopercorrenzaVeicolo.getLibrettoPercorrenzaContentType()).isEqualTo(UPDATED_LIBRETTO_PERCORRENZA_CONTENT_TYPE);
        assertThat(testLibrettopercorrenzaVeicolo.getData()).isEqualTo(UPDATED_DATA);
    }

    @Test
    @Transactional
    public void updateNonExistingLibrettopercorrenzaVeicolo() throws Exception {
        int databaseSizeBeforeUpdate = librettopercorrenzaVeicoloRepository.findAll().size();

        // Create the LibrettopercorrenzaVeicolo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLibrettopercorrenzaVeicoloMockMvc.perform(put("/api/librettopercorrenza-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(librettopercorrenzaVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the LibrettopercorrenzaVeicolo in the database
        List<LibrettopercorrenzaVeicolo> librettopercorrenzaVeicoloList = librettopercorrenzaVeicoloRepository.findAll();
        assertThat(librettopercorrenzaVeicoloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteLibrettopercorrenzaVeicolo() throws Exception {
        // Initialize the database
        librettopercorrenzaVeicoloRepository.saveAndFlush(librettopercorrenzaVeicolo);

        int databaseSizeBeforeDelete = librettopercorrenzaVeicoloRepository.findAll().size();

        // Get the librettopercorrenzaVeicolo
        restLibrettopercorrenzaVeicoloMockMvc.perform(delete("/api/librettopercorrenza-veicolos/{id}", librettopercorrenzaVeicolo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LibrettopercorrenzaVeicolo> librettopercorrenzaVeicoloList = librettopercorrenzaVeicoloRepository.findAll();
        assertThat(librettopercorrenzaVeicoloList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LibrettopercorrenzaVeicolo.class);
        LibrettopercorrenzaVeicolo librettopercorrenzaVeicolo1 = new LibrettopercorrenzaVeicolo();
        librettopercorrenzaVeicolo1.setId(1L);
        LibrettopercorrenzaVeicolo librettopercorrenzaVeicolo2 = new LibrettopercorrenzaVeicolo();
        librettopercorrenzaVeicolo2.setId(librettopercorrenzaVeicolo1.getId());
        assertThat(librettopercorrenzaVeicolo1).isEqualTo(librettopercorrenzaVeicolo2);
        librettopercorrenzaVeicolo2.setId(2L);
        assertThat(librettopercorrenzaVeicolo1).isNotEqualTo(librettopercorrenzaVeicolo2);
        librettopercorrenzaVeicolo1.setId(null);
        assertThat(librettopercorrenzaVeicolo1).isNotEqualTo(librettopercorrenzaVeicolo2);
    }
}
