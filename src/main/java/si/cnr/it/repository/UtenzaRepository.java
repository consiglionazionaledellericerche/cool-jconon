package si.cnr.it.repository;

import si.cnr.it.domain.Utenza;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Utenza entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UtenzaRepository extends JpaRepository<Utenza, Long> {

}
