package si.cnr.it.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import si.cnr.it.domain.AssicurazioneVeicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import si.cnr.it.domain.LibrettoPercorrenzaVeicolo;


/**
 * Spring Data  repository for the AssicurazioneVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AssicurazioneVeicoloRepository extends JpaRepository<AssicurazioneVeicolo, Long> {

    // @Query("select form from Form form where form.processDefinitionKey =:processDefinitionKey and form.version = :version and form.taskId =:taskId")
    @Query("SELECT av FROM AssicurazioneVeicolo av where av.veicolo.istituto =:istituto AND av.veicolo.deleted =:deleted")
    public Page<AssicurazioneVeicolo> findByIstitutoAndDeleted(@Param("istituto") String istituto,@Param("deleted") Boolean deleted, Pageable pageable);

    @Query("SELECT av FROM AssicurazioneVeicolo av where av.veicolo.deleted =:deleted ")
    public Page<AssicurazioneVeicolo> findByDeleted(@Param("deleted") Boolean deleted, Pageable pageable);
}
