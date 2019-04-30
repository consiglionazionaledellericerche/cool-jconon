package it.cnr.si.repository;

import it.cnr.si.domain.TipologiaVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TipologiaVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TipologiaVeicoloRepository extends JpaRepository<TipologiaVeicolo, Long> {

}
