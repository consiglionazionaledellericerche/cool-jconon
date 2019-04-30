package it.cnr.si.repository;

import it.cnr.si.domain.ClasseEmissioniVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ClasseEmissioniVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClasseEmissioniVeicoloRepository extends JpaRepository<ClasseEmissioniVeicolo, Long> {

}
