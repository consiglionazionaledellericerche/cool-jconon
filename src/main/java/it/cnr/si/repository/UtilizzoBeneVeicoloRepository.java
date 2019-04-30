package it.cnr.si.repository;

import it.cnr.si.domain.UtilizzoBeneVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the UtilizzoBeneVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UtilizzoBeneVeicoloRepository extends JpaRepository<UtilizzoBeneVeicolo, Long> {

}
