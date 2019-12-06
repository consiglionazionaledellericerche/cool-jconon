package it.cnr.si.repository;

import it.cnr.si.domain.Bollo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Bollo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BolloRepository extends JpaRepository<Bollo, Long> {

}
