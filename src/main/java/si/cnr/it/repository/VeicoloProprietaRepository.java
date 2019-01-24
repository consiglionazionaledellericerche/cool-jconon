package si.cnr.it.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import si.cnr.it.domain.VeicoloProprieta;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the VeicoloProprieta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VeicoloProprietaRepository extends JpaRepository<VeicoloProprieta, Long> {

    // @Query("select form from Form form where form.processDefinitionKey =:processDefinitionKey and form.version = :version and form.taskId =:taskId")
    @Query("SELECT vp FROM VeicoloProprieta vp where vp.veicolo.istituto =:istituto ")
    public Page<VeicoloProprieta> findByIstituto(@Param("istituto") String istituto, Pageable pageable);

}
