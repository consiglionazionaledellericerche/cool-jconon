package it.cnr.si.repository;

import it.cnr.si.domain.MotivazionePerditaProprieta;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the MotivazionePerditaProprieta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MotivazionePerditaProprietaRepository extends JpaRepository<MotivazionePerditaProprieta, Long> {

}
