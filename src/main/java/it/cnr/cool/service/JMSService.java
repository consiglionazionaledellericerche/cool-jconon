package it.cnr.cool.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.jms.MessageListener;
import java.io.Serializable;

@Service
public class JMSService  {
	private static final Logger LOGGER = LoggerFactory.getLogger(JMSService.class);

    public void sendRecvAsync(Serializable object, MessageListener messageListener) {
        throw new UnsupportedOperationException("TODO: da migrare!!!");
    }
}
