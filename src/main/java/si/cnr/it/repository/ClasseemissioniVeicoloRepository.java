package si.cnr.it.repository;

import si.cnr.it.domain.ClasseemissioniVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ClasseemissioniVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClasseemissioniVeicoloRepository extends JpaRepository<ClasseemissioniVeicolo, Long> {

}
