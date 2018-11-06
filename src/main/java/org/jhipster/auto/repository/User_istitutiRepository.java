package org.jhipster.auto.repository;

import org.jhipster.auto.domain.Auto;
import org.jhipster.auto.domain.User_istituti;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the User_istituti entity.
 */
@SuppressWarnings("unused")
@Repository
public interface User_istitutiRepository extends JpaRepository<User_istituti, Long> {

  /*  @Query("select user_istituti from User_istituti user_istituti where user_istituti.user.login = :user")
    String findIstituto(@Param("user") String user);*/

}
