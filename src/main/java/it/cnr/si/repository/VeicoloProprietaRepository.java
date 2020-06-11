package it.cnr.si.repository;

import it.cnr.si.domain.Veicolo;
import it.cnr.si.domain.VeicoloProprieta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


/**
 * Spring Data  repository for the VeicoloProprieta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VeicoloProprietaRepository extends JpaRepository<VeicoloProprieta, Long> {

    @Query("SELECT vp FROM VeicoloProprieta vp where vp.veicolo.istituto like :istituto AND vp.veicolo.deleted =:deleted")
    Page<VeicoloProprieta> findByIstitutoStartsWithAndDeleted(@Param("istituto") String istituto, @Param("deleted") Boolean deleted, Pageable pageable);

    @Query("SELECT vp FROM VeicoloProprieta vp where vp.veicolo.deleted =:deleted ")
    Page<VeicoloProprieta> findAllActive(@Param("deleted") Boolean deleted, Pageable pageable);

    @Query("SELECT vp FROM VeicoloProprieta vp where vp.veicolo.deleted =:deleted ")
    List<VeicoloProprieta> findAllActive(@Param("deleted") Boolean deleted);

    Optional<VeicoloProprieta> findByVeicolo(@Param("veicolo") Veicolo veicolo);

}
