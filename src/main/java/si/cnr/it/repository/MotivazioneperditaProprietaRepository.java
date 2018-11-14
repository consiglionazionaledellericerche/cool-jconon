package si.cnr.it.repository;

import si.cnr.it.domain.MotivazioneperditaProprieta;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the MotivazioneperditaProprieta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MotivazioneperditaProprietaRepository extends JpaRepository<MotivazioneperditaProprieta, Long> {

}
