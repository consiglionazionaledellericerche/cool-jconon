package it.cnr.si.repository;

import it.cnr.si.domain.VeicoloNoleggio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the VeicoloNoleggio entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VeicoloNoleggioRepository extends JpaRepository<VeicoloNoleggio, Long> {

    // @Query("select form from Form form where form.processDefinitionKey =:processDefinitionKey and form.version = :version and form.taskId =:taskId")
//    @Query("SELECT vn FROM VeicoloNoleggio vn where vn.veicolo.istituto =:istituto ")
//    public Page<VeicoloNoleggio> findByIstituto(@Param("istituto") String istituto, Pageable pageable);


    @Query("SELECT vn FROM VeicoloNoleggio vn where vn.veicolo.istituto =:istituto AND vn.veicolo.deleted =:deleted")
    public Page<VeicoloNoleggio> findByIstitutoAndDeleted(@Param("istituto") String istituto,@Param("deleted") Boolean deleted, Pageable pageable);

    @Query("SELECT vn FROM VeicoloNoleggio vn where vn.veicolo.deleted =:deleted ")
    public Page<VeicoloNoleggio> findAllActive(@Param("deleted") Boolean deleted, Pageable pageable);

    @Query("SELECT vn FROM VeicoloNoleggio vn where vn.veicolo.deleted =:deleted ")
    public List<VeicoloNoleggio> findAllActive(@Param("deleted") Boolean deleted);
}
