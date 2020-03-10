package it.cnr.si.repository;

import it.cnr.si.domain.Veicolo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Veicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VeicoloRepository extends JpaRepository<Veicolo, Long> {
    @Query("SELECT v FROM Veicolo v where v.istituto like :istituto AND v.deleted =:deleted")
    Page<Veicolo> findByIstitutoStartsWithAndDeleted(@Param("istituto") String istituto, @Param("deleted") Boolean deleted, Pageable pageable);
    @Query("SELECT v FROM Veicolo v where v.istituto like :istituto AND v.deleted =:deleted")
    List<Veicolo> findByIstitutoStartsWithAndDeleted(@Param("istituto") String istituto, @Param("deleted") Boolean deleted);

    List<Veicolo> findByTargaAndDeleted(String targa, Boolean deleted);

    Page<Veicolo> findByDeletedFalse(Pageable pageable);

    List<Veicolo> findByDeletedFalse();
}
