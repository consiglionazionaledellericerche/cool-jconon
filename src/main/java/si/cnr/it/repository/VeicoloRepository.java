package si.cnr.it.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import si.cnr.it.domain.Veicolo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Veicolo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VeicoloRepository extends JpaRepository<Veicolo, Long> {

    public Page<Veicolo> findByIstitutoAndDeleted(String istituto, Boolean deleted, Pageable pageable);

    public List<Veicolo> findByIstitutoAndDeleted(String istituto, Boolean deleted);

    public List<Veicolo> findByTargaAndDeleted(String targa, Boolean deleted);

    public Page<Veicolo> findByDeletedFalse(Pageable pageable);

    public List<Veicolo> findByDeletedFalse();

//    public List<Veicolo> findById(int id);

}
