package si.cnr.it.domain;

import java.time.LocalDate;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(VeicoloProprieta.class)
public abstract class VeicoloProprieta_ {

	public static volatile SingularAttribute<VeicoloProprieta, String> regioneImmatricolazione;
	public static volatile SingularAttribute<VeicoloProprieta, LocalDate> dataperditaProprieta;
	public static volatile SingularAttribute<VeicoloProprieta, Veicolo> veicolo;
	public static volatile SingularAttribute<VeicoloProprieta, LocalDate> dataAcquisto;
	public static volatile SingularAttribute<VeicoloProprieta, byte[]> libretto;
	public static volatile SingularAttribute<VeicoloProprieta, String> certificatoProprietaContentType;
	public static volatile SingularAttribute<VeicoloProprieta, Long> id;
	public static volatile SingularAttribute<VeicoloProprieta, LocalDate> dataImmatricolazione;
	public static volatile SingularAttribute<VeicoloProprieta, byte[]> certificatoProprieta;
	public static volatile SingularAttribute<VeicoloProprieta, String> librettoContentType;
	public static volatile SingularAttribute<VeicoloProprieta, String> altromotivazionePerditaProprieta;
	public static volatile SingularAttribute<VeicoloProprieta, MotivazioneperditaProprieta> motivazioneperditaProprieta;

}

