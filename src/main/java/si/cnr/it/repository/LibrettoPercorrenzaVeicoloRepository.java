package si.cnr.it.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import si.cnr.it.domain.LibrettoPercorrenzaVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the LibrettoPercorrenzaVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LibrettoPercorrenzaVeicoloRepository extends JpaRepository<LibrettoPercorrenzaVeicolo, Long> {

    // @Query("select form from Form form where form.processDefinitionKey =:processDefinitionKey and form.version = :version and form.taskId =:taskId")
    @Query("SELECT lpv FROM LibrettoPercorrenzaVeicolo lpv where lpv.veicolo.istituto =:istituto ")
    public Page<LibrettoPercorrenzaVeicolo> findByIstituto(@Param("istituto") String istituto, Pageable pageable);
}
