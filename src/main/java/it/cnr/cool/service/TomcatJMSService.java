package it.cnr.cool.service;

import javax.jms.QueueConnectionFactory;
import javax.naming.Context;
import javax.naming.NamingException;

public class TomcatJMSService extends JMSService  {
	
	private static final String JAVA_COMP_ENV = "java:comp/env";

	@Override
	Context getContext(Context context) throws NamingException {
		return (Context) context.lookup(JAVA_COMP_ENV);
	}

	@Override
	QueueConnectionFactory getQueueConnectionFactory(Context context) throws NamingException {
		Context envContext = getContext(context);
		return (QueueConnectionFactory) envContext.lookup(connectionFactoryName);
	}
	
	
}
