package it.cnr.si.repository;

import it.cnr.si.domain.Bollo;
import it.cnr.si.domain.Veicolo;
import it.cnr.si.domain.VeicoloProprieta;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


/**
 * Spring Data  repository for the Bollo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BolloRepository extends JpaRepository<Bollo, Long> {

    Optional<Bollo> findByVeicolo(@Param("veicolo") Veicolo veicolo);

}
