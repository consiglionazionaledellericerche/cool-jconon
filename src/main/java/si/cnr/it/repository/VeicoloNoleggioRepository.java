package si.cnr.it.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import si.cnr.it.domain.VeicoloNoleggio;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import si.cnr.it.domain.VeicoloProprieta;


/**
 * Spring Data  repository for the VeicoloNoleggio entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VeicoloNoleggioRepository extends JpaRepository<VeicoloNoleggio, Long> {

    // @Query("select form from Form form where form.processDefinitionKey =:processDefinitionKey and form.version = :version and form.taskId =:taskId")
    @Query("SELECT vn FROM VeicoloNoleggio vn where vn.veicolo.istituto =:istituto ")
    public Page<VeicoloNoleggio> findByIstituto(@Param("istituto") String istituto, Pageable pageable);
}
