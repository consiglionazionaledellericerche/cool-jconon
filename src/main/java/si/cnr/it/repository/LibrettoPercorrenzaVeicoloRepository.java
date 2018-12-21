package si.cnr.it.repository;

import si.cnr.it.domain.LibrettoPercorrenzaVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the LibrettoPercorrenzaVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LibrettoPercorrenzaVeicoloRepository extends JpaRepository<LibrettoPercorrenzaVeicolo, Long> {

}
