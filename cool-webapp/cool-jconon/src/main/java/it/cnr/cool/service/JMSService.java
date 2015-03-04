package it.cnr.cool.service;

import it.cnr.cool.cmis.service.VersionService;

import java.io.Serializable;

import javax.jms.JMSException;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;
import javax.jms.Queue;
import javax.jms.QueueConnection;
import javax.jms.QueueConnectionFactory;
import javax.jms.QueueReceiver;
import javax.jms.QueueSender;
import javax.jms.QueueSession;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class JMSService implements InitializingBean {
	private static final Logger LOGGER = LoggerFactory.getLogger(JMSService.class);

	String connectionFactoryName;
	private String queueName;
	private QueueSession session;
	private Queue que;
	private QueueConnection conn;

	@Autowired
	private VersionService versionService;


	@Override
	public void afterPropertiesSet() throws Exception {
		try {
	        InitialContext iniCtx = new InitialContext();

			QueueConnectionFactory qcf = getQueueConnectionFactory(iniCtx);

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
