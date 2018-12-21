package si.cnr.it.repository;

import si.cnr.it.domain.AlimentazioneVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the AlimentazioneVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AlimentazioneVeicoloRepository extends JpaRepository<AlimentazioneVeicolo, Long> {

}
