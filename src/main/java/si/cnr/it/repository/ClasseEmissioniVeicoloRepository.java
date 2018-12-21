package si.cnr.it.repository;

import si.cnr.it.domain.ClasseEmissioniVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ClasseEmissioniVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClasseEmissioniVeicoloRepository extends JpaRepository<ClasseEmissioniVeicolo, Long> {

}
