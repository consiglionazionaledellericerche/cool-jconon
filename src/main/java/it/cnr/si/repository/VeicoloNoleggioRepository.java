package it.cnr.si.repository;

import it.cnr.si.domain.Veicolo;
import it.cnr.si.domain.VeicoloNoleggio;
import it.cnr.si.domain.VeicoloProprieta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


/**
 * Spring Data  repository for the VeicoloNoleggio entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VeicoloNoleggioRepository extends JpaRepository<VeicoloNoleggio, Long> {

    @Query("SELECT vn FROM VeicoloNoleggio vn where vn.veicolo.istituto like :istituto AND vn.veicolo.deleted =:deleted")
    public Page<VeicoloNoleggio> findByIstitutoStartsWithAndDeleted(@Param("istituto") String istituto, @Param("deleted") Boolean deleted, Pageable pageable);

    @Query("SELECT vn FROM VeicoloNoleggio vn where vn.veicolo.deleted =:deleted ")
    public Page<VeicoloNoleggio> findAllActive(@Param("deleted") Boolean deleted, Pageable pageable);

    @Query("SELECT vn FROM VeicoloNoleggio vn where vn.veicolo.deleted =:deleted ")
    public List<VeicoloNoleggio> findAllActive(@Param("deleted") Boolean deleted);

    Optional<VeicoloNoleggio> findByVeicolo(@Param("veicolo") Veicolo veicolo);

}
