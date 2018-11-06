package org.jhipster.auto.repository;

import org.jhipster.auto.domain.Istituti;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Istituti entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IstitutiRepository extends JpaRepository<Istituti, Long> {


}
