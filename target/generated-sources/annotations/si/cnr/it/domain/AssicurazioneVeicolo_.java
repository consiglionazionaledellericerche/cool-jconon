package si.cnr.it.domain;

import java.time.Instant;
import java.time.LocalDate;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(AssicurazioneVeicolo.class)
public abstract class AssicurazioneVeicolo_ {

	public static volatile SingularAttribute<AssicurazioneVeicolo, byte[]> polizza;
	public static volatile SingularAttribute<AssicurazioneVeicolo, Instant> dataInserimento;
	public static volatile SingularAttribute<AssicurazioneVeicolo, String> polizzaContentType;
	public static volatile SingularAttribute<AssicurazioneVeicolo, String> nPolizza;
	public static volatile SingularAttribute<AssicurazioneVeicolo, String> compagniaAssicurazione;
	public static volatile SingularAttribute<AssicurazioneVeicolo, Long> id;
	public static volatile SingularAttribute<AssicurazioneVeicolo, LocalDate> dataScadenza;
	public static volatile SingularAttribute<AssicurazioneVeicolo, Veicolo> targa;

}

