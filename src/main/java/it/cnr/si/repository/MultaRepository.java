package it.cnr.si.repository;

import it.cnr.si.domain.Multa;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Multa entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MultaRepository extends JpaRepository<Multa, Long> {

}
