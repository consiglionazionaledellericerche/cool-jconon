package si.cnr.it.domain;

import java.time.Instant;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(LibrettopercorrenzaVeicolo.class)
public abstract class LibrettopercorrenzaVeicolo_ {

	public static volatile SingularAttribute<LibrettopercorrenzaVeicolo, Instant> data;
	public static volatile SingularAttribute<LibrettopercorrenzaVeicolo, byte[]> librettoPercorrenza;
	public static volatile SingularAttribute<LibrettopercorrenzaVeicolo, String> librettoPercorrenzaContentType;
	public static volatile SingularAttribute<LibrettopercorrenzaVeicolo, Long> id;
	public static volatile SingularAttribute<LibrettopercorrenzaVeicolo, Veicolo> targa;

}

