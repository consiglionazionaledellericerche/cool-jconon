package org.jhipster.auto.repository;

import org.jhipster.auto.domain.Auto;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.jhipster.auto.repository.User_istitutiRepository;

import java.util.List;

/**
 * Spring Data  repository for the Auto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AutoRepository extends JpaRepository<Auto, Long> {

    @Query("select auto from Auto auto where auto.user.login = ?#{principal.username}")
    List<Auto> findByUserIsCurrentUser();

    @Query("select auto from Auto auto where auto.cds.cds = :cds")
    List<Auto> findByCds(@Param("cds") String cds);

    @Query("select auto from Auto auto where auto.user.login = 'vfpoldo'")
    List<Auto> findByUser();

    @Query("select v.istituti.cds from User_istituti v where v.user.login = ?#{principal.username}")
    String findIstituto();

   /*@Query("select auto from auto auto where auto.user.login = 'admin'")
    List<Auto> findByAdmin();*/

}
