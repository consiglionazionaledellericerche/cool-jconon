package si.cnr.it.repository;

import com.sun.org.apache.xpath.internal.operations.Bool;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import si.cnr.it.domain.VeicoloProprieta;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the VeicoloProprieta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VeicoloProprietaRepository extends JpaRepository<VeicoloProprieta, Long> {

    // @Query("select form from Form form where form.processDefinitionKey =:processDefinitionKey and form.version = :version and form.taskId =:taskId")
//    @Query("SELECT vp FROM VeicoloProprieta vp where vp.veicolo.istituto =:istituto ")
//    public Page<VeicoloProprieta> findByIstituto(@Param("istituto") String istituto, Pageable pageable);

    @Query("SELECT vp FROM VeicoloProprieta vp where vp.veicolo.istituto =:istituto AND vp.veicolo.deleted =:deleted")
    public Page<VeicoloProprieta> findByIstitutoAndDeleted(@Param("istituto") String istituto,@Param("deleted") Boolean deleted, Pageable pageable);

    @Query("SELECT vp FROM VeicoloProprieta vp where vp.veicolo.deleted =:deleted ")
    public Page<VeicoloProprieta> findAllActive(@Param("deleted") Boolean deleted, Pageable pageable);

    @Query("SELECT vp FROM VeicoloProprieta vp where vp.veicolo.deleted =:deleted ")
    public List<VeicoloProprieta> findAllActive(@Param("deleted") Boolean deleted);
}
