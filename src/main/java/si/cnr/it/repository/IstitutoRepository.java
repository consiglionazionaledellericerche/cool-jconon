package si.cnr.it.repository;

import si.cnr.it.domain.Istituto;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Istituto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IstitutoRepository extends JpaRepository<Istituto, Long> {

}
