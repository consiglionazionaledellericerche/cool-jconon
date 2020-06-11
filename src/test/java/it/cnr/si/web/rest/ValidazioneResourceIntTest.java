package it.cnr.si.web.rest;

import it.cnr.si.ParcoautoApp;

import it.cnr.si.domain.Validazione;
import it.cnr.si.domain.Veicolo;
import it.cnr.si.repository.ValidazioneRepository;
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
import java.time.LocalDate;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;


import static it.cnr.si.web.rest.TestUtil.sameInstant;
import static it.cnr.si.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ValidazioneResource REST controller.
 *
 * @see ValidazioneResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ParcoautoApp.class)
public class ValidazioneResourceIntTest {

    private static final String DEFAULT_TIPOLOGIA_STATO = "AAAAAAAAAA";
    private static final String UPDATED_TIPOLOGIA_STATO = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATA_MODIFICA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_MODIFICA = LocalDate.now(ZoneId.systemDefault());

    private static final ZonedDateTime DEFAULT_DATA_VALIDAZIONE_DIRETTORE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATA_VALIDAZIONE_DIRETTORE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USER_DIRETTORE = "AAAAAAAAAA";
    private static final String UPDATED_USER_DIRETTORE = "BBBBBBBBBB";

    private static final String DEFAULT_IP_VALIDAZIONE = "AAAAAAAAAA";
    private static final String UPDATED_IP_VALIDAZIONE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_DOCUMENTO_FIRMATO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DOCUMENTO_FIRMATO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_DOCUMENTO_FIRMATO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DOCUMENTO_FIRMATO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final String DEFAULT_ID_FLUSSO = "AAAAAAAAAA";
    private static final String UPDATED_ID_FLUSSO = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIZIONE = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIZIONE = "BBBBBBBBBB";

    @Autowired
    private ValidazioneRepository validazioneRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restValidazioneMockMvc;

    private Validazione validazione;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ValidazioneResource validazioneResource = new ValidazioneResource(validazioneRepository);
        this.restValidazioneMockMvc = MockMvcBuilders.standaloneSetup(validazioneResource)
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
    public static Validazione createEntity(EntityManager em) {
        Validazione validazione = new Validazione()
            .tipologiaStato(DEFAULT_TIPOLOGIA_STATO)
            .dataModifica(DEFAULT_DATA_MODIFICA)
            .dataValidazioneDirettore(DEFAULT_DATA_VALIDAZIONE_DIRETTORE)
            .userDirettore(DEFAULT_USER_DIRETTORE)
            .ipValidazione(DEFAULT_IP_VALIDAZIONE)
            .documentoFirmato(DEFAULT_DOCUMENTO_FIRMATO)
            .documentoFirmatoContentType(DEFAULT_DOCUMENTO_FIRMATO_CONTENT_TYPE)
            .note(DEFAULT_NOTE)
            .idFlusso(DEFAULT_ID_FLUSSO)
            .descrizione(DEFAULT_DESCRIZIONE);
        // Add required entity
        Veicolo veicolo = VeicoloResourceIntTest.createEntity(em);
        em.persist(veicolo);
        em.flush();
        validazione.setVeicolo(veicolo);
        return validazione;
    }

    @Before
    public void initTest() {
        validazione = createEntity(em);
    }

    @Test
    @Transactional
    public void createValidazione() throws Exception {
        int databaseSizeBeforeCreate = validazioneRepository.findAll().size();

        // Create the Validazione
        restValidazioneMockMvc.perform(post("/api/validaziones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(validazione)))
            .andExpect(status().isCreated());

        // Validate the Validazione in the database
        List<Validazione> validazioneList = validazioneRepository.findAll();
        assertThat(validazioneList).hasSize(databaseSizeBeforeCreate + 1);
        Validazione testValidazione = validazioneList.get(validazioneList.size() - 1);
        assertThat(testValidazione.getTipologiaStato()).isEqualTo(DEFAULT_TIPOLOGIA_STATO);
        assertThat(testValidazione.getDataModifica()).isEqualTo(DEFAULT_DATA_MODIFICA);
        assertThat(testValidazione.getDataValidazioneDirettore()).isEqualTo(DEFAULT_DATA_VALIDAZIONE_DIRETTORE);
        assertThat(testValidazione.getUserDirettore()).isEqualTo(DEFAULT_USER_DIRETTORE);
        assertThat(testValidazione.getIpValidazione()).isEqualTo(DEFAULT_IP_VALIDAZIONE);
        assertThat(testValidazione.getDocumentoFirmato()).isEqualTo(DEFAULT_DOCUMENTO_FIRMATO);
        assertThat(testValidazione.getDocumentoFirmatoContentType()).isEqualTo(DEFAULT_DOCUMENTO_FIRMATO_CONTENT_TYPE);
        assertThat(testValidazione.getNote()).isEqualTo(DEFAULT_NOTE);
        assertThat(testValidazione.getIdFlusso()).isEqualTo(DEFAULT_ID_FLUSSO);
        assertThat(testValidazione.getDescrizione()).isEqualTo(DEFAULT_DESCRIZIONE);
    }

    @Test
    @Transactional
    public void createValidazioneWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = validazioneRepository.findAll().size();

        // Create the Validazione with an existing ID
        validazione.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restValidazioneMockMvc.perform(post("/api/validaziones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(validazione)))
            .andExpect(status().isBadRequest());

        // Validate the Validazione in the database
        List<Validazione> validazioneList = validazioneRepository.findAll();
        assertThat(validazioneList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTipologiaStatoIsRequired() throws Exception {
        int databaseSizeBeforeTest = validazioneRepository.findAll().size();
        // set the field null
        validazione.setTipologiaStato(null);

        // Create the Validazione, which fails.

        restValidazioneMockMvc.perform(post("/api/validaziones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(validazione)))
            .andExpect(status().isBadRequest());

        List<Validazione> validazioneList = validazioneRepository.findAll();
        assertThat(validazioneList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDataModificaIsRequired() throws Exception {
        int databaseSizeBeforeTest = validazioneRepository.findAll().size();
        // set the field null
        validazione.setDataModifica(null);

        // Create the Validazione, which fails.

        restValidazioneMockMvc.perform(post("/api/validaziones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(validazione)))
            .andExpect(status().isBadRequest());

        List<Validazione> validazioneList = validazioneRepository.findAll();
        assertThat(validazioneList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Ignore
    @Transactional
    public void getAllValidaziones() throws Exception {
        // Initialize the database
        validazioneRepository.saveAndFlush(validazione);

        // Get all the validazioneList
        restValidazioneMockMvc.perform(get("/api/validaziones?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(validazione.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipologiaStato").value(hasItem(DEFAULT_TIPOLOGIA_STATO.toString())))
            .andExpect(jsonPath("$.[*].dataModifica").value(hasItem(DEFAULT_DATA_MODIFICA.toString())))
            .andExpect(jsonPath("$.[*].dataValidazioneDirettore").value(hasItem(sameInstant(DEFAULT_DATA_VALIDAZIONE_DIRETTORE))))
            .andExpect(jsonPath("$.[*].userDirettore").value(hasItem(DEFAULT_USER_DIRETTORE.toString())))
            .andExpect(jsonPath("$.[*].ipValidazione").value(hasItem(DEFAULT_IP_VALIDAZIONE.toString())))
            .andExpect(jsonPath("$.[*].documentoFirmatoContentType").value(hasItem(DEFAULT_DOCUMENTO_FIRMATO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].documentoFirmato").value(hasItem(Base64Utils.encodeToString(DEFAULT_DOCUMENTO_FIRMATO))))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE.toString())))
            .andExpect(jsonPath("$.[*].idFlusso").value(hasItem(DEFAULT_ID_FLUSSO.toString())))
            .andExpect(jsonPath("$.[*].descrizione").value(hasItem(DEFAULT_DESCRIZIONE.toString())));
    }
    
    @Test
    @Ignore
    @Transactional
    public void getValidazione() throws Exception {
        // Initialize the database
        validazioneRepository.saveAndFlush(validazione);

        // Get the validazione
        restValidazioneMockMvc.perform(get("/api/validaziones/{id}", validazione.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(validazione.getId().intValue()))
            .andExpect(jsonPath("$.tipologiaStato").value(DEFAULT_TIPOLOGIA_STATO.toString()))
            .andExpect(jsonPath("$.dataModifica").value(DEFAULT_DATA_MODIFICA.toString()))
            .andExpect(jsonPath("$.dataValidazioneDirettore").value(sameInstant(DEFAULT_DATA_VALIDAZIONE_DIRETTORE)))
            .andExpect(jsonPath("$.userDirettore").value(DEFAULT_USER_DIRETTORE.toString()))
            .andExpect(jsonPath("$.ipValidazione").value(DEFAULT_IP_VALIDAZIONE.toString()))
            .andExpect(jsonPath("$.documentoFirmatoContentType").value(DEFAULT_DOCUMENTO_FIRMATO_CONTENT_TYPE))
            .andExpect(jsonPath("$.documentoFirmato").value(Base64Utils.encodeToString(DEFAULT_DOCUMENTO_FIRMATO)))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE.toString()))
            .andExpect(jsonPath("$.idFlusso").value(DEFAULT_ID_FLUSSO.toString()))
            .andExpect(jsonPath("$.descrizione").value(DEFAULT_DESCRIZIONE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingValidazione() throws Exception {
        // Get the validazione
        restValidazioneMockMvc.perform(get("/api/validaziones/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Ignore
    @Transactional
    public void updateValidazione() throws Exception {
        // Initialize the database
        validazioneRepository.saveAndFlush(validazione);

        int databaseSizeBeforeUpdate = validazioneRepository.findAll().size();

        // Update the validazione
        Validazione updatedValidazione = validazioneRepository.findById(validazione.getId()).get();
        // Disconnect from session so that the updates on updatedValidazione are not directly saved in db
        em.detach(updatedValidazione);
        updatedValidazione
            .tipologiaStato(UPDATED_TIPOLOGIA_STATO)
            .dataModifica(UPDATED_DATA_MODIFICA)
            .dataValidazioneDirettore(UPDATED_DATA_VALIDAZIONE_DIRETTORE)
            .userDirettore(UPDATED_USER_DIRETTORE)
            .ipValidazione(UPDATED_IP_VALIDAZIONE)
            .documentoFirmato(UPDATED_DOCUMENTO_FIRMATO)
            .documentoFirmatoContentType(UPDATED_DOCUMENTO_FIRMATO_CONTENT_TYPE)
            .note(UPDATED_NOTE)
            .idFlusso(UPDATED_ID_FLUSSO)
            .descrizione(UPDATED_DESCRIZIONE);

        restValidazioneMockMvc.perform(put("/api/validaziones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedValidazione)))
            .andExpect(status().isOk());

        // Validate the Validazione in the database
        List<Validazione> validazioneList = validazioneRepository.findAll();
        assertThat(validazioneList).hasSize(databaseSizeBeforeUpdate);
        Validazione testValidazione = validazioneList.get(validazioneList.size() - 1);
        assertThat(testValidazione.getTipologiaStato()).isEqualTo(UPDATED_TIPOLOGIA_STATO);
        assertThat(testValidazione.getDataModifica()).isEqualTo(UPDATED_DATA_MODIFICA);
        assertThat(testValidazione.getDataValidazioneDirettore()).isEqualTo(UPDATED_DATA_VALIDAZIONE_DIRETTORE);
        assertThat(testValidazione.getUserDirettore()).isEqualTo(UPDATED_USER_DIRETTORE);
        assertThat(testValidazione.getIpValidazione()).isEqualTo(UPDATED_IP_VALIDAZIONE);
        assertThat(testValidazione.getDocumentoFirmato()).isEqualTo(UPDATED_DOCUMENTO_FIRMATO);
        assertThat(testValidazione.getDocumentoFirmatoContentType()).isEqualTo(UPDATED_DOCUMENTO_FIRMATO_CONTENT_TYPE);
        assertThat(testValidazione.getNote()).isEqualTo(UPDATED_NOTE);
        assertThat(testValidazione.getIdFlusso()).isEqualTo(UPDATED_ID_FLUSSO);
        assertThat(testValidazione.getDescrizione()).isEqualTo(UPDATED_DESCRIZIONE);
    }

    @Test
    @Transactional
    public void updateNonExistingValidazione() throws Exception {
        int databaseSizeBeforeUpdate = validazioneRepository.findAll().size();

        // Create the Validazione

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restValidazioneMockMvc.perform(put("/api/validaziones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(validazione)))
            .andExpect(status().isBadRequest());

        // Validate the Validazione in the database
        List<Validazione> validazioneList = validazioneRepository.findAll();
        assertThat(validazioneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteValidazione() throws Exception {
        // Initialize the database
        validazioneRepository.saveAndFlush(validazione);

        int databaseSizeBeforeDelete = validazioneRepository.findAll().size();

        // Get the validazione
        restValidazioneMockMvc.perform(delete("/api/validaziones/{id}", validazione.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Validazione> validazioneList = validazioneRepository.findAll();
        assertThat(validazioneList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Validazione.class);
        Validazione validazione1 = new Validazione();
        validazione1.setId(1L);
        Validazione validazione2 = new Validazione();
        validazione2.setId(validazione1.getId());
        assertThat(validazione1).isEqualTo(validazione2);
        validazione2.setId(2L);
        assertThat(validazione1).isNotEqualTo(validazione2);
        validazione1.setId(null);
        assertThat(validazione1).isNotEqualTo(validazione2);
    }
}
