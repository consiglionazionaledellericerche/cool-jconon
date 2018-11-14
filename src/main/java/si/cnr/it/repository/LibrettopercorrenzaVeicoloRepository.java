package si.cnr.it.repository;

import si.cnr.it.domain.LibrettopercorrenzaVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the LibrettopercorrenzaVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LibrettopercorrenzaVeicoloRepository extends JpaRepository<LibrettopercorrenzaVeicolo, Long> {

}
