package si.cnr.it.domain;

import java.time.Instant;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Veicolo.class)
public abstract class Veicolo_ {

	public static volatile SingularAttribute<Veicolo, Integer> km;
	public static volatile SingularAttribute<Veicolo, TipologiaVeicolo> tipologiaVeicolo;
	public static volatile SingularAttribute<Veicolo, Istituto> istituto;
	public static volatile SingularAttribute<Veicolo, Integer> cilindrata;
	public static volatile SingularAttribute<Veicolo, UtilizzobeneVeicolo> utilizzobeneVeicolo;
	public static volatile SingularAttribute<Veicolo, Instant> dataValidazione;
	public static volatile SingularAttribute<Veicolo, ClasseemissioniVeicolo> classeemissioniVeicolo;
	public static volatile SingularAttribute<Veicolo, Utenza> responsabile;
	public static volatile SingularAttribute<Veicolo, String> modello;
	public static volatile SingularAttribute<Veicolo, String> targa;
	public static volatile SingularAttribute<Veicolo, String> marca;
	public static volatile SingularAttribute<Veicolo, String> cvKw;
	public static volatile SingularAttribute<Veicolo, Long> id;
	public static volatile SingularAttribute<Veicolo, AlimentazioneVeicolo> alimentazioneVeicolo;

}

