package si.cnr.it.repository;

import si.cnr.it.domain.VeicoloNoleggio;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the VeicoloNoleggio entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VeicoloNoleggioRepository extends JpaRepository<VeicoloNoleggio, Long> {

}
