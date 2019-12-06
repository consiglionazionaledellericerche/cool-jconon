package it.cnr.si.repository;

import it.cnr.si.domain.CancellazionePra;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CancellazionePra entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CancellazionePraRepository extends JpaRepository<CancellazionePra, Long> {

}
