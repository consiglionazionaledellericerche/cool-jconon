package si.cnr.it.repository;

import si.cnr.it.domain.UtilizzoBeneVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the UtilizzoBeneVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UtilizzoBeneVeicoloRepository extends JpaRepository<UtilizzoBeneVeicolo, Long> {

}
