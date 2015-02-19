package it.cnr.flows.service;

import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Component;

/**
 * Created by francesco on 19/02/15.
 */

@Component
public class MailServiceImpl implements MailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MailServiceImpl.class);


    @Override
    public void send(String to, String subject, String text) throws MailException {
        LOGGER.error("unimplemented");
    }

    @Override
    public void send(String subject, String text) throws MailException {
        LOGGER.error("unimplemented");
    }

    @Override
    public void send(EmailMessage emailMessage) throws MailException {
        LOGGER.error("unimplemented");
    }

    @Override
    public void sendErrorMessage(String currentUser, String url, String serverPath, Exception we) throws MailException {
        LOGGER.error("unimplemented");
    }

    @Override
    public void sendErrorMessage(String currentUser, String subject, String body) throws MailException {
        LOGGER.error("unimplemented");
    }

    @Override
    public String getMailToProtocollo() {
        LOGGER.error("unimplemented");
        return null;
    }

    @Override
    public String getMailToHelpDesk() {
        LOGGER.error("unimplemented");
        return null;
    }
}
