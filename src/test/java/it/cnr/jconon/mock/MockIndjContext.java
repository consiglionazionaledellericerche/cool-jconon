package it.cnr.jconon.mock;

import javax.naming.Context;
import javax.naming.InitialContext;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.jndi.SimpleNamingContextBuilder;

public class MockIndjContext implements InitializingBean{

	@Autowired
	private ActiveMQConnectionFactory jmsConnectionFactory;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		SimpleNamingContextBuilder.emptyActivatedContextBuilder();
	    Context context = new InitialContext();
	    context.bind("java:comp/env/jms/CoolConnectionFactory", jmsConnectionFactory);		
	}

}
