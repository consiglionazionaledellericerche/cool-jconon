package si.cnr.it.domain;

import java.time.LocalDate;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(VeicoloNoleggio.class)
public abstract class VeicoloNoleggio_ {

	public static volatile SingularAttribute<VeicoloNoleggio, LocalDate> dataProroga;
	public static volatile SingularAttribute<VeicoloNoleggio, LocalDate> datafineNoleggio;
	public static volatile SingularAttribute<VeicoloNoleggio, byte[]> libretto;
	public static volatile SingularAttribute<VeicoloNoleggio, String> societa;
	public static volatile SingularAttribute<VeicoloNoleggio, Long> id;
	public static volatile SingularAttribute<VeicoloNoleggio, String> librettoContentType;
	public static volatile SingularAttribute<VeicoloNoleggio, LocalDate> datacessazioneAnticipata;
	public static volatile SingularAttribute<VeicoloNoleggio, LocalDate> datainizioNoleggio;
	public static volatile SingularAttribute<VeicoloNoleggio, Veicolo> targa;

}

