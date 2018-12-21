package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.LibrettoPercorrenzaVeicolo;
import si.cnr.it.domain.Veicolo;
import si.cnr.it.repository.LibrettoPercorrenzaVeicoloRepository;
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
 * Test class for the LibrettoPercorrenzaVeicoloResource REST controller.
 *
 * @see LibrettoPercorrenzaVeicoloResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class LibrettoPercorrenzaVeicoloResourceIntTest {

    private static final byte[] DEFAULT_LIBRETTO_PERCORRENZA = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LIBRETTO_PERCORRENZA = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LIBRETTO_PERCORRENZA_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LIBRETTO_PERCORRENZA_CONTENT_TYPE = "image/png";

    private static final Instant DEFAULT_DATA = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATA = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private LibrettoPercorrenzaVeicoloRepository librettoPercorrenzaVeicoloRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLibrettoPercorrenzaVeicoloMockMvc;

    private LibrettoPercorrenzaVeicolo librettoPercorrenzaVeicolo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LibrettoPercorrenzaVeicoloResource librettoPercorrenzaVeicoloResource = new LibrettoPercorrenzaVeicoloResource(librettoPercorrenzaVeicoloRepository);
        this.restLibrettoPercorrenzaVeicoloMockMvc = MockMvcBuilders.standaloneSetup(librettoPercorrenzaVeicoloResource)
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
    public static LibrettoPercorrenzaVeicolo createEntity(EntityManager em) {
        LibrettoPercorrenzaVeicolo librettoPercorrenzaVeicolo = new LibrettoPercorrenzaVeicolo()
            .librettoPercorrenza(DEFAULT_LIBRETTO_PERCORRENZA)
            .librettoPercorrenzaContentType(DEFAULT_LIBRETTO_PERCORRENZA_CONTENT_TYPE)
            .data(DEFAULT_DATA);
        // Add required entity
        Veicolo veicolo = VeicoloResourceIntTest.createEntity(em);
        em.persist(veicolo);
        em.flush();
        librettoPercorrenzaVeicolo.setVeicolo(veicolo);
        return librettoPercorrenzaVeicolo;
    }

    @Before
    public void initTest() {
        librettoPercorrenzaVeicolo = createEntity(em);
    }

    @Test
    @Transactional
    public void createLibrettoPercorrenzaVeicolo() throws Exception {
        int databaseSizeBeforeCreate = librettoPercorrenzaVeicoloRepository.findAll().size();

        // Create the LibrettoPercorrenzaVeicolo
        restLibrettoPercorrenzaVeicoloMockMvc.perform(post("/api/libretto-percorrenza-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(librettoPercorrenzaVeicolo)))
            .andExpect(status().isCreated());

        // Validate the LibrettoPercorrenzaVeicolo in the database
        List<LibrettoPercorrenzaVeicolo> librettoPercorrenzaVeicoloList = librettoPercorrenzaVeicoloRepository.findAll();
        assertThat(librettoPercorrenzaVeicoloList).hasSize(databaseSizeBeforeCreate + 1);
        LibrettoPercorrenzaVeicolo testLibrettoPercorrenzaVeicolo = librettoPercorrenzaVeicoloList.get(librettoPercorrenzaVeicoloList.size() - 1);
        assertThat(testLibrettoPercorrenzaVeicolo.getLibrettoPercorrenza()).isEqualTo(DEFAULT_LIBRETTO_PERCORRENZA);
        assertThat(testLibrettoPercorrenzaVeicolo.getLibrettoPercorrenzaContentType()).isEqualTo(DEFAULT_LIBRETTO_PERCORRENZA_CONTENT_TYPE);
        assertThat(testLibrettoPercorrenzaVeicolo.getData()).isEqualTo(DEFAULT_DATA);
    }

    @Test
    @Transactional
    public void createLibrettoPercorrenzaVeicoloWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = librettoPercorrenzaVeicoloRepository.findAll().size();

        // Create the LibrettoPercorrenzaVeicolo with an existing ID
        librettoPercorrenzaVeicolo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLibrettoPercorrenzaVeicoloMockMvc.perform(post("/api/libretto-percorrenza-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(librettoPercorrenzaVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the LibrettoPercorrenzaVeicolo in the database
        List<LibrettoPercorrenzaVeicolo> librettoPercorrenzaVeicoloList = librettoPercorrenzaVeicoloRepository.findAll();
        assertThat(librettoPercorrenzaVeicoloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDataIsRequired() throws Exception {
        int databaseSizeBeforeTest = librettoPercorrenzaVeicoloRepository.findAll().size();
        // set the field null
        librettoPercorrenzaVeicolo.setData(null);

        // Create the LibrettoPercorrenzaVeicolo, which fails.

        restLibrettoPercorrenzaVeicoloMockMvc.perform(post("/api/libretto-percorrenza-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(librettoPercorrenzaVeicolo)))
            .andExpect(status().isBadRequest());

        List<LibrettoPercorrenzaVeicolo> librettoPercorrenzaVeicoloList = librettoPercorrenzaVeicoloRepository.findAll();
        assertThat(librettoPercorrenzaVeicoloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLibrettoPercorrenzaVeicolos() throws Exception {
        // Initialize the database
        librettoPercorrenzaVeicoloRepository.saveAndFlush(librettoPercorrenzaVeicolo);

        // Get all the librettoPercorrenzaVeicoloList
        restLibrettoPercorrenzaVeicoloMockMvc.perform(get("/api/libretto-percorrenza-veicolos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(librettoPercorrenzaVeicolo.getId().intValue())))
            .andExpect(jsonPath("$.[*].librettoPercorrenzaContentType").value(hasItem(DEFAULT_LIBRETTO_PERCORRENZA_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].librettoPercorrenza").value(hasItem(Base64Utils.encodeToString(DEFAULT_LIBRETTO_PERCORRENZA))))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())));
    }
    
    @Test
    @Transactional
    public void getLibrettoPercorrenzaVeicolo() throws Exception {
        // Initialize the database
        librettoPercorrenzaVeicoloRepository.saveAndFlush(librettoPercorrenzaVeicolo);

        // Get the librettoPercorrenzaVeicolo
        restLibrettoPercorrenzaVeicoloMockMvc.perform(get("/api/libretto-percorrenza-veicolos/{id}", librettoPercorrenzaVeicolo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(librettoPercorrenzaVeicolo.getId().intValue()))
            .andExpect(jsonPath("$.librettoPercorrenzaContentType").value(DEFAULT_LIBRETTO_PERCORRENZA_CONTENT_TYPE))
            .andExpect(jsonPath("$.librettoPercorrenza").value(Base64Utils.encodeToString(DEFAULT_LIBRETTO_PERCORRENZA)))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLibrettoPercorrenzaVeicolo() throws Exception {
        // Get the librettoPercorrenzaVeicolo
        restLibrettoPercorrenzaVeicoloMockMvc.perform(get("/api/libretto-percorrenza-veicolos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLibrettoPercorrenzaVeicolo() throws Exception {
        // Initialize the database
        librettoPercorrenzaVeicoloRepository.saveAndFlush(librettoPercorrenzaVeicolo);

        int databaseSizeBeforeUpdate = librettoPercorrenzaVeicoloRepository.findAll().size();

        // Update the librettoPercorrenzaVeicolo
        LibrettoPercorrenzaVeicolo updatedLibrettoPercorrenzaVeicolo = librettoPercorrenzaVeicoloRepository.findById(librettoPercorrenzaVeicolo.getId()).get();
        // Disconnect from session so that the updates on updatedLibrettoPercorrenzaVeicolo are not directly saved in db
        em.detach(updatedLibrettoPercorrenzaVeicolo);
        updatedLibrettoPercorrenzaVeicolo
            .librettoPercorrenza(UPDATED_LIBRETTO_PERCORRENZA)
            .librettoPercorrenzaContentType(UPDATED_LIBRETTO_PERCORRENZA_CONTENT_TYPE)
            .data(UPDATED_DATA);

        restLibrettoPercorrenzaVeicoloMockMvc.perform(put("/api/libretto-percorrenza-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLibrettoPercorrenzaVeicolo)))
            .andExpect(status().isOk());

        // Validate the LibrettoPercorrenzaVeicolo in the database
        List<LibrettoPercorrenzaVeicolo> librettoPercorrenzaVeicoloList = librettoPercorrenzaVeicoloRepository.findAll();
        assertThat(librettoPercorrenzaVeicoloList).hasSize(databaseSizeBeforeUpdate);
        LibrettoPercorrenzaVeicolo testLibrettoPercorrenzaVeicolo = librettoPercorrenzaVeicoloList.get(librettoPercorrenzaVeicoloList.size() - 1);
        assertThat(testLibrettoPercorrenzaVeicolo.getLibrettoPercorrenza()).isEqualTo(UPDATED_LIBRETTO_PERCORRENZA);
        assertThat(testLibrettoPercorrenzaVeicolo.getLibrettoPercorrenzaContentType()).isEqualTo(UPDATED_LIBRETTO_PERCORRENZA_CONTENT_TYPE);
        assertThat(testLibrettoPercorrenzaVeicolo.getData()).isEqualTo(UPDATED_DATA);
    }

    @Test
    @Transactional
    public void updateNonExistingLibrettoPercorrenzaVeicolo() throws Exception {
        int databaseSizeBeforeUpdate = librettoPercorrenzaVeicoloRepository.findAll().size();

        // Create the LibrettoPercorrenzaVeicolo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLibrettoPercorrenzaVeicoloMockMvc.perform(put("/api/libretto-percorrenza-veicolos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(librettoPercorrenzaVeicolo)))
            .andExpect(status().isBadRequest());

        // Validate the LibrettoPercorrenzaVeicolo in the database
        List<LibrettoPercorrenzaVeicolo> librettoPercorrenzaVeicoloList = librettoPercorrenzaVeicoloRepository.findAll();
        assertThat(librettoPercorrenzaVeicoloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteLibrettoPercorrenzaVeicolo() throws Exception {
        // Initialize the database
        librettoPercorrenzaVeicoloRepository.saveAndFlush(librettoPercorrenzaVeicolo);

        int databaseSizeBeforeDelete = librettoPercorrenzaVeicoloRepository.findAll().size();

        // Get the librettoPercorrenzaVeicolo
        restLibrettoPercorrenzaVeicoloMockMvc.perform(delete("/api/libretto-percorrenza-veicolos/{id}", librettoPercorrenzaVeicolo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LibrettoPercorrenzaVeicolo> librettoPercorrenzaVeicoloList = librettoPercorrenzaVeicoloRepository.findAll();
        assertThat(librettoPercorrenzaVeicoloList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LibrettoPercorrenzaVeicolo.class);
        LibrettoPercorrenzaVeicolo librettoPercorrenzaVeicolo1 = new LibrettoPercorrenzaVeicolo();
        librettoPercorrenzaVeicolo1.setId(1L);
        LibrettoPercorrenzaVeicolo librettoPercorrenzaVeicolo2 = new LibrettoPercorrenzaVeicolo();
        librettoPercorrenzaVeicolo2.setId(librettoPercorrenzaVeicolo1.getId());
        assertThat(librettoPercorrenzaVeicolo1).isEqualTo(librettoPercorrenzaVeicolo2);
        librettoPercorrenzaVeicolo2.setId(2L);
        assertThat(librettoPercorrenzaVeicolo1).isNotEqualTo(librettoPercorrenzaVeicolo2);
        librettoPercorrenzaVeicolo1.setId(null);
        assertThat(librettoPercorrenzaVeicolo1).isNotEqualTo(librettoPercorrenzaVeicolo2);
    }
}
