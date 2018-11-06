package org.jhipster.auto.web.rest;

import org.jhipster.auto.AutoApp;

import org.jhipster.auto.domain.User_istituti;
import org.jhipster.auto.repository.User_istitutiRepository;
import org.jhipster.auto.web.rest.errors.ExceptionTranslator;

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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static org.jhipster.auto.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the User_istitutiResource REST controller.
 *
 * @see User_istitutiResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AutoApp.class)
public class User_istitutiResourceIntTest {

    private static final LocalDate DEFAULT_DATA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private User_istitutiRepository user_istitutiRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restUser_istitutiMockMvc;

    private User_istituti user_istituti;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final User_istitutiResource user_istitutiResource = new User_istitutiResource(user_istitutiRepository);
        this.restUser_istitutiMockMvc = MockMvcBuilders.standaloneSetup(user_istitutiResource)
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
    public static User_istituti createEntity(EntityManager em) {
        User_istituti user_istituti = new User_istituti()
            .data(DEFAULT_DATA);
        return user_istituti;
    }

    @Before
    public void initTest() {
        user_istituti = createEntity(em);
    }

    @Test
    @Transactional
    public void createUser_istituti() throws Exception {
        int databaseSizeBeforeCreate = user_istitutiRepository.findAll().size();

        // Create the User_istituti
        restUser_istitutiMockMvc.perform(post("/api/user-istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(user_istituti)))
            .andExpect(status().isCreated());

        // Validate the User_istituti in the database
        List<User_istituti> user_istitutiList = user_istitutiRepository.findAll();
        assertThat(user_istitutiList).hasSize(databaseSizeBeforeCreate + 1);
        User_istituti testUser_istituti = user_istitutiList.get(user_istitutiList.size() - 1);
        assertThat(testUser_istituti.getData()).isEqualTo(DEFAULT_DATA);
    }

    @Test
    @Transactional
    public void createUser_istitutiWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = user_istitutiRepository.findAll().size();

        // Create the User_istituti with an existing ID
        user_istituti.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUser_istitutiMockMvc.perform(post("/api/user-istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(user_istituti)))
            .andExpect(status().isBadRequest());

        // Validate the User_istituti in the database
        List<User_istituti> user_istitutiList = user_istitutiRepository.findAll();
        assertThat(user_istitutiList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDataIsRequired() throws Exception {
        int databaseSizeBeforeTest = user_istitutiRepository.findAll().size();
        // set the field null
        user_istituti.setData(null);

        // Create the User_istituti, which fails.

        restUser_istitutiMockMvc.perform(post("/api/user-istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(user_istituti)))
            .andExpect(status().isBadRequest());

        List<User_istituti> user_istitutiList = user_istitutiRepository.findAll();
        assertThat(user_istitutiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUser_istitutis() throws Exception {
        // Initialize the database
        user_istitutiRepository.saveAndFlush(user_istituti);

        // Get all the user_istitutiList
        restUser_istitutiMockMvc.perform(get("/api/user-istitutis?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(user_istituti.getId().intValue())))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())));
    }
    
    @Test
    @Transactional
    public void getUser_istituti() throws Exception {
        // Initialize the database
        user_istitutiRepository.saveAndFlush(user_istituti);

        // Get the user_istituti
        restUser_istitutiMockMvc.perform(get("/api/user-istitutis/{id}", user_istituti.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(user_istituti.getId().intValue()))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingUser_istituti() throws Exception {
        // Get the user_istituti
        restUser_istitutiMockMvc.perform(get("/api/user-istitutis/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUser_istituti() throws Exception {
        // Initialize the database
        user_istitutiRepository.saveAndFlush(user_istituti);

        int databaseSizeBeforeUpdate = user_istitutiRepository.findAll().size();

        // Update the user_istituti
        User_istituti updatedUser_istituti = user_istitutiRepository.findById(user_istituti.getId()).get();
        // Disconnect from session so that the updates on updatedUser_istituti are not directly saved in db
        em.detach(updatedUser_istituti);
        updatedUser_istituti
            .data(UPDATED_DATA);

        restUser_istitutiMockMvc.perform(put("/api/user-istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUser_istituti)))
            .andExpect(status().isOk());

        // Validate the User_istituti in the database
        List<User_istituti> user_istitutiList = user_istitutiRepository.findAll();
        assertThat(user_istitutiList).hasSize(databaseSizeBeforeUpdate);
        User_istituti testUser_istituti = user_istitutiList.get(user_istitutiList.size() - 1);
        assertThat(testUser_istituti.getData()).isEqualTo(UPDATED_DATA);
    }

    @Test
    @Transactional
    public void updateNonExistingUser_istituti() throws Exception {
        int databaseSizeBeforeUpdate = user_istitutiRepository.findAll().size();

        // Create the User_istituti

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUser_istitutiMockMvc.perform(put("/api/user-istitutis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(user_istituti)))
            .andExpect(status().isBadRequest());

        // Validate the User_istituti in the database
        List<User_istituti> user_istitutiList = user_istitutiRepository.findAll();
        assertThat(user_istitutiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUser_istituti() throws Exception {
        // Initialize the database
        user_istitutiRepository.saveAndFlush(user_istituti);

        int databaseSizeBeforeDelete = user_istitutiRepository.findAll().size();

        // Get the user_istituti
        restUser_istitutiMockMvc.perform(delete("/api/user-istitutis/{id}", user_istituti.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<User_istituti> user_istitutiList = user_istitutiRepository.findAll();
        assertThat(user_istitutiList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(User_istituti.class);
        User_istituti user_istituti1 = new User_istituti();
        user_istituti1.setId(1L);
        User_istituti user_istituti2 = new User_istituti();
        user_istituti2.setId(user_istituti1.getId());
        assertThat(user_istituti1).isEqualTo(user_istituti2);
        user_istituti2.setId(2L);
        assertThat(user_istituti1).isNotEqualTo(user_istituti2);
        user_istituti1.setId(null);
        assertThat(user_istituti1).isNotEqualTo(user_istituti2);
    }
}
