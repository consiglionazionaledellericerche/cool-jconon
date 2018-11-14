package si.cnr.it.web.rest;

import si.cnr.it.ParcoautoApp;

import si.cnr.it.domain.VeicoloNoleggio;
import si.cnr.it.domain.Veicolo;
import si.cnr.it.repository.VeicoloNoleggioRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static si.cnr.it.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the VeicoloNoleggioResource REST controller.
 *
 * @see VeicoloNoleggioResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class VeicoloNoleggioResourceIntTest {

    private static final String DEFAULT_SOCIETA = "AAAAAAAAAA";
    private static final String UPDATED_SOCIETA = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATAINIZIO_NOLEGGIO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATAINIZIO_NOLEGGIO = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATAFINE_NOLEGGIO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATAFINE_NOLEGGIO = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATACESSAZIONE_ANTICIPATA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATACESSAZIONE_ANTICIPATA = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATA_PROROGA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_PROROGA = LocalDate.now(ZoneId.systemDefault());

    private static final byte[] DEFAULT_LIBRETTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LIBRETTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LIBRETTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LIBRETTO_CONTENT_TYPE = "image/png";

    @Autowired
    private VeicoloNoleggioRepository veicoloNoleggioRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restVeicoloNoleggioMockMvc;

    private VeicoloNoleggio veicoloNoleggio;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final VeicoloNoleggioResource veicoloNoleggioResource = new VeicoloNoleggioResource(veicoloNoleggioRepository);
        this.restVeicoloNoleggioMockMvc = MockMvcBuilders.standaloneSetup(veicoloNoleggioResource)
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
    public static VeicoloNoleggio createEntity(EntityManager em) {
        VeicoloNoleggio veicoloNoleggio = new VeicoloNoleggio()
            .societa(DEFAULT_SOCIETA)
            .datainizioNoleggio(DEFAULT_DATAINIZIO_NOLEGGIO)
            .datafineNoleggio(DEFAULT_DATAFINE_NOLEGGIO)
            .datacessazioneAnticipata(DEFAULT_DATACESSAZIONE_ANTICIPATA)
            .dataProroga(DEFAULT_DATA_PROROGA)
            .libretto(DEFAULT_LIBRETTO)
            .librettoContentType(DEFAULT_LIBRETTO_CONTENT_TYPE);
        // Add required entity
        Veicolo veicolo = VeicoloResourceIntTest.createEntity(em);
        em.persist(veicolo);
        em.flush();
        veicoloNoleggio.setTarga(veicolo);
        return veicoloNoleggio;
    }

    @Before
    public void initTest() {
        veicoloNoleggio = createEntity(em);
    }

    @Test
    @Transactional
    public void createVeicoloNoleggio() throws Exception {
        int databaseSizeBeforeCreate = veicoloNoleggioRepository.findAll().size();

        // Create the VeicoloNoleggio
        restVeicoloNoleggioMockMvc.perform(post("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isCreated());

        // Validate the VeicoloNoleggio in the database
        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeCreate + 1);
        VeicoloNoleggio testVeicoloNoleggio = veicoloNoleggioList.get(veicoloNoleggioList.size() - 1);
        assertThat(testVeicoloNoleggio.getSocieta()).isEqualTo(DEFAULT_SOCIETA);
        assertThat(testVeicoloNoleggio.getDatainizioNoleggio()).isEqualTo(DEFAULT_DATAINIZIO_NOLEGGIO);
        assertThat(testVeicoloNoleggio.getDatafineNoleggio()).isEqualTo(DEFAULT_DATAFINE_NOLEGGIO);
        assertThat(testVeicoloNoleggio.getDatacessazioneAnticipata()).isEqualTo(DEFAULT_DATACESSAZIONE_ANTICIPATA);
        assertThat(testVeicoloNoleggio.getDataProroga()).isEqualTo(DEFAULT_DATA_PROROGA);
        assertThat(testVeicoloNoleggio.getLibretto()).isEqualTo(DEFAULT_LIBRETTO);
        assertThat(testVeicoloNoleggio.getLibrettoContentType()).isEqualTo(DEFAULT_LIBRETTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createVeicoloNoleggioWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = veicoloNoleggioRepository.findAll().size();

        // Create the VeicoloNoleggio with an existing ID
        veicoloNoleggio.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restVeicoloNoleggioMockMvc.perform(post("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isBadRequest());

        // Validate the VeicoloNoleggio in the database
        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkSocietaIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloNoleggioRepository.findAll().size();
        // set the field null
        veicoloNoleggio.setSocieta(null);

        // Create the VeicoloNoleggio, which fails.

        restVeicoloNoleggioMockMvc.perform(post("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isBadRequest());

        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDatainizioNoleggioIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloNoleggioRepository.findAll().size();
        // set the field null
        veicoloNoleggio.setDatainizioNoleggio(null);

        // Create the VeicoloNoleggio, which fails.

        restVeicoloNoleggioMockMvc.perform(post("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isBadRequest());

        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDatafineNoleggioIsRequired() throws Exception {
        int databaseSizeBeforeTest = veicoloNoleggioRepository.findAll().size();
        // set the field null
        veicoloNoleggio.setDatafineNoleggio(null);

        // Create the VeicoloNoleggio, which fails.

        restVeicoloNoleggioMockMvc.perform(post("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isBadRequest());

        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllVeicoloNoleggios() throws Exception {
        // Initialize the database
        veicoloNoleggioRepository.saveAndFlush(veicoloNoleggio);

        // Get all the veicoloNoleggioList
        restVeicoloNoleggioMockMvc.perform(get("/api/veicolo-noleggios?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(veicoloNoleggio.getId().intValue())))
            .andExpect(jsonPath("$.[*].societa").value(hasItem(DEFAULT_SOCIETA.toString())))
            .andExpect(jsonPath("$.[*].datainizioNoleggio").value(hasItem(DEFAULT_DATAINIZIO_NOLEGGIO.toString())))
            .andExpect(jsonPath("$.[*].datafineNoleggio").value(hasItem(DEFAULT_DATAFINE_NOLEGGIO.toString())))
            .andExpect(jsonPath("$.[*].datacessazioneAnticipata").value(hasItem(DEFAULT_DATACESSAZIONE_ANTICIPATA.toString())))
            .andExpect(jsonPath("$.[*].dataProroga").value(hasItem(DEFAULT_DATA_PROROGA.toString())))
            .andExpect(jsonPath("$.[*].librettoContentType").value(hasItem(DEFAULT_LIBRETTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].libretto").value(hasItem(Base64Utils.encodeToString(DEFAULT_LIBRETTO))));
    }
    
    @Test
    @Transactional
    public void getVeicoloNoleggio() throws Exception {
        // Initialize the database
        veicoloNoleggioRepository.saveAndFlush(veicoloNoleggio);

        // Get the veicoloNoleggio
        restVeicoloNoleggioMockMvc.perform(get("/api/veicolo-noleggios/{id}", veicoloNoleggio.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(veicoloNoleggio.getId().intValue()))
            .andExpect(jsonPath("$.societa").value(DEFAULT_SOCIETA.toString()))
            .andExpect(jsonPath("$.datainizioNoleggio").value(DEFAULT_DATAINIZIO_NOLEGGIO.toString()))
            .andExpect(jsonPath("$.datafineNoleggio").value(DEFAULT_DATAFINE_NOLEGGIO.toString()))
            .andExpect(jsonPath("$.datacessazioneAnticipata").value(DEFAULT_DATACESSAZIONE_ANTICIPATA.toString()))
            .andExpect(jsonPath("$.dataProroga").value(DEFAULT_DATA_PROROGA.toString()))
            .andExpect(jsonPath("$.librettoContentType").value(DEFAULT_LIBRETTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.libretto").value(Base64Utils.encodeToString(DEFAULT_LIBRETTO)));
    }

    @Test
    @Transactional
    public void getNonExistingVeicoloNoleggio() throws Exception {
        // Get the veicoloNoleggio
        restVeicoloNoleggioMockMvc.perform(get("/api/veicolo-noleggios/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateVeicoloNoleggio() throws Exception {
        // Initialize the database
        veicoloNoleggioRepository.saveAndFlush(veicoloNoleggio);

        int databaseSizeBeforeUpdate = veicoloNoleggioRepository.findAll().size();

        // Update the veicoloNoleggio
        VeicoloNoleggio updatedVeicoloNoleggio = veicoloNoleggioRepository.findById(veicoloNoleggio.getId()).get();
        // Disconnect from session so that the updates on updatedVeicoloNoleggio are not directly saved in db
        em.detach(updatedVeicoloNoleggio);
        updatedVeicoloNoleggio
            .societa(UPDATED_SOCIETA)
            .datainizioNoleggio(UPDATED_DATAINIZIO_NOLEGGIO)
            .datafineNoleggio(UPDATED_DATAFINE_NOLEGGIO)
            .datacessazioneAnticipata(UPDATED_DATACESSAZIONE_ANTICIPATA)
            .dataProroga(UPDATED_DATA_PROROGA)
            .libretto(UPDATED_LIBRETTO)
            .librettoContentType(UPDATED_LIBRETTO_CONTENT_TYPE);

        restVeicoloNoleggioMockMvc.perform(put("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedVeicoloNoleggio)))
            .andExpect(status().isOk());

        // Validate the VeicoloNoleggio in the database
        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeUpdate);
        VeicoloNoleggio testVeicoloNoleggio = veicoloNoleggioList.get(veicoloNoleggioList.size() - 1);
        assertThat(testVeicoloNoleggio.getSocieta()).isEqualTo(UPDATED_SOCIETA);
        assertThat(testVeicoloNoleggio.getDatainizioNoleggio()).isEqualTo(UPDATED_DATAINIZIO_NOLEGGIO);
        assertThat(testVeicoloNoleggio.getDatafineNoleggio()).isEqualTo(UPDATED_DATAFINE_NOLEGGIO);
        assertThat(testVeicoloNoleggio.getDatacessazioneAnticipata()).isEqualTo(UPDATED_DATACESSAZIONE_ANTICIPATA);
        assertThat(testVeicoloNoleggio.getDataProroga()).isEqualTo(UPDATED_DATA_PROROGA);
        assertThat(testVeicoloNoleggio.getLibretto()).isEqualTo(UPDATED_LIBRETTO);
        assertThat(testVeicoloNoleggio.getLibrettoContentType()).isEqualTo(UPDATED_LIBRETTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingVeicoloNoleggio() throws Exception {
        int databaseSizeBeforeUpdate = veicoloNoleggioRepository.findAll().size();

        // Create the VeicoloNoleggio

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVeicoloNoleggioMockMvc.perform(put("/api/veicolo-noleggios")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(veicoloNoleggio)))
            .andExpect(status().isBadRequest());

        // Validate the VeicoloNoleggio in the database
        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteVeicoloNoleggio() throws Exception {
        // Initialize the database
        veicoloNoleggioRepository.saveAndFlush(veicoloNoleggio);

        int databaseSizeBeforeDelete = veicoloNoleggioRepository.findAll().size();

        // Get the veicoloNoleggio
        restVeicoloNoleggioMockMvc.perform(delete("/api/veicolo-noleggios/{id}", veicoloNoleggio.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<VeicoloNoleggio> veicoloNoleggioList = veicoloNoleggioRepository.findAll();
        assertThat(veicoloNoleggioList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VeicoloNoleggio.class);
        VeicoloNoleggio veicoloNoleggio1 = new VeicoloNoleggio();
        veicoloNoleggio1.setId(1L);
        VeicoloNoleggio veicoloNoleggio2 = new VeicoloNoleggio();
        veicoloNoleggio2.setId(veicoloNoleggio1.getId());
        assertThat(veicoloNoleggio1).isEqualTo(veicoloNoleggio2);
        veicoloNoleggio2.setId(2L);
        assertThat(veicoloNoleggio1).isNotEqualTo(veicoloNoleggio2);
        veicoloNoleggio1.setId(null);
        assertThat(veicoloNoleggio1).isNotEqualTo(veicoloNoleggio2);
    }
}
