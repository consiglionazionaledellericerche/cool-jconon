package si.cnr.it.repository;

import si.cnr.it.domain.UtilizzobeneVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the UtilizzobeneVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UtilizzobeneVeicoloRepository extends JpaRepository<UtilizzobeneVeicolo, Long> {

}
