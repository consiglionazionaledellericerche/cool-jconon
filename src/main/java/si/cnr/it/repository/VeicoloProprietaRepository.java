package si.cnr.it.repository;

import si.cnr.it.domain.VeicoloProprieta;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the VeicoloProprieta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VeicoloProprietaRepository extends JpaRepository<VeicoloProprieta, Long> {

}
