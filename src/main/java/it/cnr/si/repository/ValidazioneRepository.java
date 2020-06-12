package it.cnr.si.repository;

import it.cnr.si.domain.Validazione;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Validazione entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ValidazioneRepository extends JpaRepository<Validazione, Long> {

    @Query("SELECT va FROM Validazione va where va.veicolo.istituto like :istituto")
    public Page<Validazione> findByIstituto(@Param("istituto") String istituto, Pageable pageable);
}
