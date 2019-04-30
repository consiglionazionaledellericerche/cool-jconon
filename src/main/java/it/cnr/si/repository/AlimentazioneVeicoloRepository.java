package it.cnr.si.repository;

import it.cnr.si.domain.AlimentazioneVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the AlimentazioneVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AlimentazioneVeicoloRepository extends JpaRepository<AlimentazioneVeicolo, Long> {

}
