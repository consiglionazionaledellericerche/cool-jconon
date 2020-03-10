package it.cnr.si.repository;

import it.cnr.si.domain.AssicurazioneVeicolo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the AssicurazioneVeicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AssicurazioneVeicoloRepository extends JpaRepository<AssicurazioneVeicolo, Long> {

    @Query("SELECT av FROM AssicurazioneVeicolo av where av.veicolo.istituto like :istituto% AND av.veicolo.deleted =:deleted")
    public Page<AssicurazioneVeicolo> findByIstitutoAndDeleted(@Param("istituto") String istituto,@Param("deleted") Boolean deleted, Pageable pageable);

    @Query("SELECT av FROM AssicurazioneVeicolo av where av.veicolo.deleted =:deleted ")
    public Page<AssicurazioneVeicolo> findByDeleted(@Param("deleted") Boolean deleted, Pageable pageable);
}
