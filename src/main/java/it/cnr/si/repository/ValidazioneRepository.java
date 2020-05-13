package it.cnr.si.repository;

import it.cnr.si.domain.Validazione;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Validazione entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ValidazioneRepository extends JpaRepository<Validazione, Long> {

}
