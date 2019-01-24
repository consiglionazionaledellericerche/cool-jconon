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

    public Page<Veicolo> findByIstituto(String istituto, Pageable pageable);

    public List<Veicolo> findByIstituto(String istituto);

    public List<Veicolo> findByTarga(String targa);

//    public List<Veicolo> findById(int id);

}
