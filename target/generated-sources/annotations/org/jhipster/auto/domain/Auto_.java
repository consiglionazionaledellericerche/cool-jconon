package org.jhipster.auto.domain;

import java.time.LocalDate;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Auto.class)
public abstract class Auto_ {

	public static volatile SingularAttribute<Auto, LocalDate> fine_noleggio;
	public static volatile SingularAttribute<Auto, String> marca;
	public static volatile SingularAttribute<Auto, Istituti> cds;
	public static volatile SingularAttribute<Auto, Long> id;
	public static volatile SingularAttribute<Auto, String> modello;
	public static volatile SingularAttribute<Auto, User> user;
	public static volatile SingularAttribute<Auto, String> targa;
	public static volatile SingularAttribute<Auto, LocalDate> inizio_noleggio;

}

