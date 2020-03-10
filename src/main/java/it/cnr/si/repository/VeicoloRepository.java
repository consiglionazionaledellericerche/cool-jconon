package it.cnr.si.repository;

import it.cnr.si.domain.Veicolo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Veicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VeicoloRepository extends JpaRepository<Veicolo, Long> {

    Page<Veicolo> findByIstitutoStartsWithAndDeleted(String istituto, Boolean deleted, Pageable pageable);

    List<Veicolo> findByIstitutoStartsWithAndDeleted(String istituto, Boolean deleted);

    List<Veicolo> findByTargaAndDeleted(String targa, Boolean deleted);

    Page<Veicolo> findByDeletedFalse(Pageable pageable);

    List<Veicolo> findByDeletedFalse();
}
