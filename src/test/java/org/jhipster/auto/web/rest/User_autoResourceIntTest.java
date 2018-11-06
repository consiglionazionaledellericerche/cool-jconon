package org.jhipster.auto.web.rest;

import org.jhipster.auto.AutoApp;

import org.jhipster.auto.domain.User_auto;
import org.jhipster.auto.repository.User_autoRepository;
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
import java.util.List;


import static org.jhipster.auto.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the User_autoResource REST controller.
 *
 * @see User_autoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AutoApp.class)
public class User_autoResourceIntTest {

    @Autowired
    private User_autoRepository user_autoRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restUser_autoMockMvc;

    private User_auto user_auto;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final User_autoResource user_autoResource = new User_autoResource(user_autoRepository);
        this.restUser_autoMockMvc = MockMvcBuilders.standaloneSetup(user_autoResource)
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
    public static User_auto createEntity(EntityManager em) {
        User_auto user_auto = new User_auto();
        return user_auto;
    }

    @Before
    public void initTest() {
        user_auto = createEntity(em);
    }

    @Test
    @Transactional
    public void createUser_auto() throws Exception {
        int databaseSizeBeforeCreate = user_autoRepository.findAll().size();

        // Create the User_auto
        restUser_autoMockMvc.perform(post("/api/user-autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(user_auto)))
            .andExpect(status().isCreated());

        // Validate the User_auto in the database
        List<User_auto> user_autoList = user_autoRepository.findAll();
        assertThat(user_autoList).hasSize(databaseSizeBeforeCreate + 1);
        User_auto testUser_auto = user_autoList.get(user_autoList.size() - 1);
    }

    @Test
    @Transactional
    public void createUser_autoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = user_autoRepository.findAll().size();

        // Create the User_auto with an existing ID
        user_auto.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUser_autoMockMvc.perform(post("/api/user-autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(user_auto)))
            .andExpect(status().isBadRequest());

        // Validate the User_auto in the database
        List<User_auto> user_autoList = user_autoRepository.findAll();
        assertThat(user_autoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllUser_autos() throws Exception {
        // Initialize the database
        user_autoRepository.saveAndFlush(user_auto);

        // Get all the user_autoList
        restUser_autoMockMvc.perform(get("/api/user-autos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(user_auto.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getUser_auto() throws Exception {
        // Initialize the database
        user_autoRepository.saveAndFlush(user_auto);

        // Get the user_auto
        restUser_autoMockMvc.perform(get("/api/user-autos/{id}", user_auto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(user_auto.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingUser_auto() throws Exception {
        // Get the user_auto
        restUser_autoMockMvc.perform(get("/api/user-autos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUser_auto() throws Exception {
        // Initialize the database
        user_autoRepository.saveAndFlush(user_auto);

        int databaseSizeBeforeUpdate = user_autoRepository.findAll().size();

        // Update the user_auto
        User_auto updatedUser_auto = user_autoRepository.findById(user_auto.getId()).get();
        // Disconnect from session so that the updates on updatedUser_auto are not directly saved in db
        em.detach(updatedUser_auto);

        restUser_autoMockMvc.perform(put("/api/user-autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUser_auto)))
            .andExpect(status().isOk());

        // Validate the User_auto in the database
        List<User_auto> user_autoList = user_autoRepository.findAll();
        assertThat(user_autoList).hasSize(databaseSizeBeforeUpdate);
        User_auto testUser_auto = user_autoList.get(user_autoList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingUser_auto() throws Exception {
        int databaseSizeBeforeUpdate = user_autoRepository.findAll().size();

        // Create the User_auto

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUser_autoMockMvc.perform(put("/api/user-autos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(user_auto)))
            .andExpect(status().isBadRequest());

        // Validate the User_auto in the database
        List<User_auto> user_autoList = user_autoRepository.findAll();
        assertThat(user_autoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUser_auto() throws Exception {
        // Initialize the database
        user_autoRepository.saveAndFlush(user_auto);

        int databaseSizeBeforeDelete = user_autoRepository.findAll().size();

        // Get the user_auto
        restUser_autoMockMvc.perform(delete("/api/user-autos/{id}", user_auto.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<User_auto> user_autoList = user_autoRepository.findAll();
        assertThat(user_autoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(User_auto.class);
        User_auto user_auto1 = new User_auto();
        user_auto1.setId(1L);
        User_auto user_auto2 = new User_auto();
        user_auto2.setId(user_auto1.getId());
        assertThat(user_auto1).isEqualTo(user_auto2);
        user_auto2.setId(2L);
        assertThat(user_auto1).isNotEqualTo(user_auto2);
        user_auto1.setId(null);
        assertThat(user_auto1).isNotEqualTo(user_auto2);
    }
}
