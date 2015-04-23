package it.cnr.cool.service;

import it.cnr.cool.cmis.service.VersionService;
import org.apache.activemq.broker.BrokerFactory;
import org.apache.activemq.broker.BrokerRegistry;
import org.apache.activemq.broker.BrokerService;
import org.apache.activemq.transport.vm.VMTransportFactory;
import org.apache.activemq.util.IntrospectionSupport;
import org.apache.activemq.util.URISupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jms.*;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import java.io.Serializable;
import java.net.URI;
import java.util.Collections;
import java.util.Map;

public abstract class JMSService implements InitializingBean {
	private static final Logger LOGGER = LoggerFactory.getLogger(JMSService.class);

	String connectionFactoryName;
	private String queueName;
	private QueueSession session;
	private Queue que;
	private QueueConnection conn;

    private static final String host = "localhost";

	@Autowired
	private VersionService versionService;


	@Override
	public void afterPropertiesSet() throws Exception {
		try {
	        InitialContext iniCtx = new InitialContext();

			QueueConnectionFactory qcf = getQueueConnectionFactory(iniCtx);

            initBrokerService();

	        conn = qcf.createQueueConnection();

	        que = (Queue) getContext(iniCtx).lookup(queueName);
	        session = conn.createQueueSession(false, QueueSession.AUTO_ACKNOWLEDGE);
	        conn.start();
	        LOGGER.info("queue " + queueName + " initialized");
		} catch (Exception _ex) {

			if (versionService.isProduction()) {
				LOGGER.error("Errore nel recupero JNDI della coda.", _ex);
			} else {
				LOGGER.warn("development mode - error initializing queue " + queueName, _ex);
			}
		}
	}


    // inspired by org.apache.activemq.transport.vm.VMTransportFactory.doCompositeConnect()
    private void initBrokerService() throws Exception {

        synchronized (BrokerRegistry.getInstance().getRegistryMutext()) {

            if (BrokerRegistry.getInstance().lookup(host) == null) {

                Map brokerOptions = IntrospectionSupport.extractProperties(Collections.emptyMap(), "broker.");
                URI brokerURI = new URI("broker://()/" + host + "?"
                        + URISupport.createQueryString(brokerOptions));

                BrokerService broker = BrokerFactory.createBroker(brokerURI);
                broker.setUseJmx(false);
                broker.start();
                MDC.put("activemq.broker", broker.getBrokerName());
                VMTransportFactory.BROKERS.put(host, broker);
                BrokerRegistry.getInstance().getRegistryMutext().notifyAll();

            }
        }
    }



	abstract Context getContext(Context context) throws NamingException ;

	abstract QueueConnectionFactory getQueueConnectionFactory(Context context) throws NamingException ;


	public void setConnectionFactoryName(String connectionFactoryName) {
		this.connectionFactoryName = connectionFactoryName;
	}

	public void setQueueName(String queueName) {
		this.queueName = queueName;
	}

    public void sendRecvAsync(Serializable object, MessageListener messageListener) {
		try {
	        QueueReceiver recv = session.createReceiver(que);
	        recv.setMessageListener(messageListener);

			QueueSender send = session.createSender(que);
	        ObjectMessage objMessage = session.createObjectMessage(object);
	        send.send(objMessage);
	        send.close();
		} catch (JMSException e) {
			LOGGER.error("Errore nell'invio del messaggio sulla Coda:" + queueName, e);
		}
    }
}
