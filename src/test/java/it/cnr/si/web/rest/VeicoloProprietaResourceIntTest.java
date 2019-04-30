package it.cnr.si.web.rest;

import it.cnr.si.ParcoautoApp;
import it.cnr.si.domain.Veicolo;
import it.cnr.si.domain.VeicoloProprieta;
import it.cnr.si.repository.VeicoloProprietaRepository;
import it.cnr.si.web.rest.errors.ExceptionTranslator;
import org.junit.Before;
import org.junit.Ignore;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static it.cnr.si.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the VeicoloProprietaResource REST controller.
 *
 * @see VeicoloProprietaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class VeicoloProprietaResourceIntTest {

    private static final LocalDate DEFAULT_DATA_IMMATRICOLAZIONE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_IMMATRICOLAZIONE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATA_ACQUISTO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_ACQUISTO = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_REGIONE_IMMATRICOLAZIONE = "AAAAAAAAAA";
    private static final String UPDATED_REGIONE_IMMATRICOLAZIONE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LIBRETTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LIBRETTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LIBRETTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LIBRETTO_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_CERTIFICATO_PROPRIETA = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_CERTIFICATO_PROPRIETA = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_CERTIFICATO_PROPRIETA_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_CERTIFICATO_PROPRIETA_CONTENT_TYPE = "image/png";

    private static final LocalDate DEFAULT_DATA_PERDITA_PROPRIETA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_PERDITA_PROPRIETA = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_ALTRA_MOTIVAZIONE_PERDITA_PROPRIETA = "AAAAAAAAAA";
    private static final String UPDATED_ALTRA_MOTIVAZIONE_PERDITA_PROPRIETA = "BBBBBBBBBB";

    @Autowired
    private VeicoloProprietaRepository veicoloProprietaRepository;

    @Autowired
    private VeicoloProprietaResource veicoloProprietaResource;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restVeicoloProprietaMockMvc;

    private VeicoloProprieta veicoloProprieta;

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VeicoloProprieta createEntity(EntityManager em) {
        VeicoloProprieta veicoloProprieta = new VeicoloProprieta()
            .dataImmatricolazione(DEFAULT_DATA_IMMATRICOLAZIONE)
            .dataAcquisto(DEFAULT_DATA_ACQUISTO)
            .regioneImmatricolazione(DEFAULT_REGIONE_IMMATRICOLAZIONE)
            .libretto(DEFAULT_LIBRETTO)
            .librettoContentType(DEFAULT_LIBRETTO_CONTENT_TYPE)
            .certificatoProprieta(DEFAULT_CERTIFICATO_PROPRIETA)
            .certificatoProprietaContentType(DEFAULT_CERTIFICATO_PROPRIETA_CONTENT_TYPE)
            .dataPerditaProprieta(DEFAULT_DATA_PERDITA_PROPRIETA)
            .altraMotivazionePerditaProprieta(DEFAULT_ALTRA_MOTIVAZIONE_PERDITA_PROPRIETA);
        // Add required entity
        Veicolo veicolo = VeicoloResourceIntTest.createEntity(em);
        em.persist(veicolo);
        em.flush();
        veicoloProprieta.setVeicolo(veicolo);
        return veicoloProprieta;
    }

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
//        final VeicoloProprietaResource veicoloProprietaResource = new VeicoloProprietaResource(veicoloProprietaRepository);
        this.restVeicoloProprietaMockMvc = MockMvcBuilders.standaloneSetup(veicoloProprietaResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        veicoloProprieta = createEntity(em);
    }

    @Test
    @Transactional
    public void createVeicoloProprieta() throws Exception {
        int databaseSizeBeforeCreate = veicoloProprietaRepository.findAll().size();

        // Create the VeicoloProprieta
        restVeicoloProprietaMockMvc.perform(post("/api/veicolo-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloProprieta)))
            .andExpect(status().isCreated());

        // Validate the VeicoloProprieta in the database
        List<VeicoloProprieta> veicoloProprietaList = veicoloProprietaRepository.findAll();
        assertThat(veicoloProprietaList).hasSize(databaseSizeBeforeCreate + 1);
        VeicoloProprieta testVeicoloProprieta = veicoloProprietaList.get(veicoloProprietaList.size() - 1);
        assertThat(testVeicoloProprieta.getDataImmatricolazione()).isEqualTo(DEFAULT_DATA_IMMATRICOLAZIONE);
        assertThat(testVeicoloProprieta.getDataAcquisto()).isEqualTo(DEFAULT_DATA_ACQUISTO);
        assertThat(testVeicoloProprieta.getRegioneImmatricolazione()).isEqualTo(DEFAULT_REGIONE_IMMATRICOLAZIONE);
        assertThat(testVeicoloProprieta.getLibretto()).isEqualTo(DEFAULT_LIBRETTO);
        assertThat(testVeicoloProprieta.getLibrettoContentType()).isEqualTo(DEFAULT_LIBRETTO_CONTENT_TYPE);
        assertThat(testVeicoloProprieta.getCertificatoProprieta()).isEqualTo(DEFAULT_CERTIFICATO_PROPRIETA);
        assertThat(testVeicoloProprieta.getCertificatoProprietaContentType()).isEqualTo(DEFAULT_CERTIFICATO_PROPRIETA_CONTENT_TYPE);
        assertThat(testVeicoloProprieta.getDataPerditaProprieta()).isEqualTo(DEFAULT_DATA_PERDITA_PROPRIETA);
        assertThat(testVeicoloProprieta.getAltraMotivazionePerditaProprieta()).isEqualTo(DEFAULT_ALTRA_MOTIVAZIONE_PERDITA_PROPRIETA);
    }

    @Test
    @Transactional
    public void createVeicoloProprietaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = veicoloProprietaRepository.findAll().size();

        // Create the VeicoloProprieta with an existing ID
        veicoloProprieta.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restVeicoloProprietaMockMvc.perform(post("/api/veicolo-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloProprieta)))
            .andExpect(status().isBadRequest());

        // Validate the VeicoloProprieta in the database
        List<VeicoloProprieta> veicoloProprietaList = veicoloProprietaRepository.findAll();
        assertThat(veicoloProprietaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDataImmatricolazioneIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloProprietaRepository.findAll().size();
        // set the field null
        veicoloProprieta.setDataImmatricolazione(null);

        // Create the VeicoloProprieta, which fails.

        restVeicoloProprietaMockMvc.perform(post("/api/veicolo-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloProprieta)))
            .andExpect(status().isBadRequest());

        List<VeicoloProprieta> veicoloProprietaList = veicoloProprietaRepository.findAll();
        assertThat(veicoloProprietaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDataAcquistoIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloProprietaRepository.findAll().size();
        // set the field null
        veicoloProprieta.setDataAcquisto(null);

        // Create the VeicoloProprieta, which fails.

        restVeicoloProprietaMockMvc.perform(post("/api/veicolo-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloProprieta)))
            .andExpect(status().isBadRequest());

        List<VeicoloProprieta> veicoloProprietaList = veicoloProprietaRepository.findAll();
        assertThat(veicoloProprietaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkRegioneImmatricolazioneIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloProprietaRepository.findAll().size();
        // set the field null
        veicoloProprieta.setRegioneImmatricolazione(null);

        // Create the VeicoloProprieta, which fails.

        restVeicoloProprietaMockMvc.perform(post("/api/veicolo-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloProprieta)))
            .andExpect(status().isBadRequest());

        List<VeicoloProprieta> veicoloProprietaList = veicoloProprietaRepository.findAll();
        assertThat(veicoloProprietaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @Ignore
    public void getAllVeicoloProprietas() throws Exception {
        // Initialize the database
        veicoloProprietaRepository.saveAndFlush(veicoloProprieta);

        // Get all the veicoloProprietaList
        restVeicoloProprietaMockMvc.perform(get("/api/veicolo-proprietas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(veicoloProprieta.getId().intValue())))
            .andExpect(jsonPath("$.[*].dataImmatricolazione").value(hasItem(DEFAULT_DATA_IMMATRICOLAZIONE.toString())))
            .andExpect(jsonPath("$.[*].dataAcquisto").value(hasItem(DEFAULT_DATA_ACQUISTO.toString())))
            .andExpect(jsonPath("$.[*].regioneImmatricolazione").value(hasItem(DEFAULT_REGIONE_IMMATRICOLAZIONE)))
            .andExpect(jsonPath("$.[*].librettoContentType").value(hasItem(DEFAULT_LIBRETTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].libretto").value(hasItem(Base64Utils.encodeToString(DEFAULT_LIBRETTO))))
            .andExpect(jsonPath("$.[*].certificatoProprietaContentType").value(hasItem(DEFAULT_CERTIFICATO_PROPRIETA_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].certificatoProprieta").value(hasItem(Base64Utils.encodeToString(DEFAULT_CERTIFICATO_PROPRIETA))))
            .andExpect(jsonPath("$.[*].dataPerditaProprieta").value(hasItem(DEFAULT_DATA_PERDITA_PROPRIETA.toString())))
            .andExpect(jsonPath("$.[*].altraMotivazionePerditaProprieta").value(hasItem(DEFAULT_ALTRA_MOTIVAZIONE_PERDITA_PROPRIETA)));
    }

    @Test
    @Transactional
    public void getVeicoloProprieta() throws Exception {
        // Initialize the database
        veicoloProprietaRepository.saveAndFlush(veicoloProprieta);

        // Get the veicoloProprieta
        restVeicoloProprietaMockMvc.perform(get("/api/veicolo-proprietas/{id}", veicoloProprieta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(veicoloProprieta.getId().intValue()))
            .andExpect(jsonPath("$.dataImmatricolazione").value(DEFAULT_DATA_IMMATRICOLAZIONE.toString()))
            .andExpect(jsonPath("$.dataAcquisto").value(DEFAULT_DATA_ACQUISTO.toString()))
            .andExpect(jsonPath("$.regioneImmatricolazione").value(DEFAULT_REGIONE_IMMATRICOLAZIONE))
            .andExpect(jsonPath("$.librettoContentType").value(DEFAULT_LIBRETTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.libretto").value(Base64Utils.encodeToString(DEFAULT_LIBRETTO)))
            .andExpect(jsonPath("$.certificatoProprietaContentType").value(DEFAULT_CERTIFICATO_PROPRIETA_CONTENT_TYPE))
            .andExpect(jsonPath("$.certificatoProprieta").value(Base64Utils.encodeToString(DEFAULT_CERTIFICATO_PROPRIETA)))
            .andExpect(jsonPath("$.dataPerditaProprieta").value(DEFAULT_DATA_PERDITA_PROPRIETA.toString()))
            .andExpect(jsonPath("$.altraMotivazionePerditaProprieta").value(DEFAULT_ALTRA_MOTIVAZIONE_PERDITA_PROPRIETA));
    }

    @Test
    @Transactional
    public void getNonExistingVeicoloProprieta() throws Exception {
        // Get the veicoloProprieta
        restVeicoloProprietaMockMvc.perform(get("/api/veicolo-proprietas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @Ignore
    public void updateVeicoloProprieta() throws Exception {
        // Initialize the database
        veicoloProprietaRepository.saveAndFlush(veicoloProprieta);

        int databaseSizeBeforeUpdate = veicoloProprietaRepository.findAll().size();

        // Update the veicoloProprieta
        VeicoloProprieta updatedVeicoloProprieta = veicoloProprietaRepository.findById(veicoloProprieta.getId()).get();
        // Disconnect from session so that the updates on updatedVeicoloProprieta are not directly saved in db
        em.detach(updatedVeicoloProprieta);
        updatedVeicoloProprieta
            .dataImmatricolazione(UPDATED_DATA_IMMATRICOLAZIONE)
            .dataAcquisto(UPDATED_DATA_ACQUISTO)
            .regioneImmatricolazione(UPDATED_REGIONE_IMMATRICOLAZIONE)
            .libretto(UPDATED_LIBRETTO)
            .librettoContentType(UPDATED_LIBRETTO_CONTENT_TYPE)
            .certificatoProprieta(UPDATED_CERTIFICATO_PROPRIETA)
            .certificatoProprietaContentType(UPDATED_CERTIFICATO_PROPRIETA_CONTENT_TYPE)
            .dataPerditaProprieta(UPDATED_DATA_PERDITA_PROPRIETA)
            .altraMotivazionePerditaProprieta(UPDATED_ALTRA_MOTIVAZIONE_PERDITA_PROPRIETA);

        restVeicoloProprietaMockMvc.perform(put("/api/veicolo-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedVeicoloProprieta)))
            .andExpect(status().isOk());

        // Validate the VeicoloProprieta in the database
        List<VeicoloProprieta> veicoloProprietaList = veicoloProprietaRepository.findAll();
        assertThat(veicoloProprietaList).hasSize(databaseSizeBeforeUpdate);
        VeicoloProprieta testVeicoloProprieta = veicoloProprietaList.get(veicoloProprietaList.size() - 1);
        assertThat(testVeicoloProprieta.getDataImmatricolazione()).isEqualTo(UPDATED_DATA_IMMATRICOLAZIONE);
        assertThat(testVeicoloProprieta.getDataAcquisto()).isEqualTo(UPDATED_DATA_ACQUISTO);
        assertThat(testVeicoloProprieta.getRegioneImmatricolazione()).isEqualTo(UPDATED_REGIONE_IMMATRICOLAZIONE);
        assertThat(testVeicoloProprieta.getLibretto()).isEqualTo(UPDATED_LIBRETTO);
        assertThat(testVeicoloProprieta.getLibrettoContentType()).isEqualTo(UPDATED_LIBRETTO_CONTENT_TYPE);
        assertThat(testVeicoloProprieta.getCertificatoProprieta()).isEqualTo(UPDATED_CERTIFICATO_PROPRIETA);
        assertThat(testVeicoloProprieta.getCertificatoProprietaContentType()).isEqualTo(UPDATED_CERTIFICATO_PROPRIETA_CONTENT_TYPE);
        assertThat(testVeicoloProprieta.getDataPerditaProprieta()).isEqualTo(UPDATED_DATA_PERDITA_PROPRIETA);
        assertThat(testVeicoloProprieta.getAltraMotivazionePerditaProprieta()).isEqualTo(UPDATED_ALTRA_MOTIVAZIONE_PERDITA_PROPRIETA);
    }

    @Test
    @Transactional
    public void updateNonExistingVeicoloProprieta() throws Exception {
        int databaseSizeBeforeUpdate = veicoloProprietaRepository.findAll().size();

        // Create the VeicoloProprieta

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVeicoloProprietaMockMvc.perform(put("/api/veicolo-proprietas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloProprieta)))
            .andExpect(status().isBadRequest());

        // Validate the VeicoloProprieta in the database
        List<VeicoloProprieta> veicoloProprietaList = veicoloProprietaRepository.findAll();
        assertThat(veicoloProprietaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    @Ignore
    public void deleteVeicoloProprieta() throws Exception {
        // Initialize the database
        veicoloProprietaRepository.saveAndFlush(veicoloProprieta);

        int databaseSizeBeforeDelete = veicoloProprietaRepository.findAll().size();

        // Get the veicoloProprieta
        restVeicoloProprietaMockMvc.perform(delete("/api/veicolo-proprietas/{id}", veicoloProprieta.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<VeicoloProprieta> veicoloProprietaList = veicoloProprietaRepository.findAll();
        assertThat(veicoloProprietaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VeicoloProprieta.class);
        VeicoloProprieta veicoloProprieta1 = new VeicoloProprieta();
        veicoloProprieta1.setId(1L);
        VeicoloProprieta veicoloProprieta2 = new VeicoloProprieta();
        veicoloProprieta2.setId(veicoloProprieta1.getId());
        assertThat(veicoloProprieta1).isEqualTo(veicoloProprieta2);
        veicoloProprieta2.setId(2L);
        assertThat(veicoloProprieta1).isNotEqualTo(veicoloProprieta2);
        veicoloProprieta1.setId(null);
        assertThat(veicoloProprieta1).isNotEqualTo(veicoloProprieta2);
    }
}

