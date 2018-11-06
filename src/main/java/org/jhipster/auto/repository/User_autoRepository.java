package org.jhipster.auto.repository;

import org.jhipster.auto.domain.User_auto;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the User_auto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface User_autoRepository extends JpaRepository<User_auto, Long> {

}
