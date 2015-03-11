package it.cnr.cool.service.modelDesigner;

import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import org.springframework.mail.MailException;

/**
 * Created by francesco on 11/03/15.
 */
public class MockMailService implements MailService {
    @Override
    public void send(String to, String subject, String text) throws MailException {

    }

    @Override
    public void send(String subject, String text) throws MailException {

    }

    @Override
    public void send(EmailMessage emailMessage) throws MailException {

    }

    @Override
    public void sendErrorMessage(String currentUser, String url, String serverPath, Exception we) throws MailException {

    }

    @Override
    public void sendErrorMessage(String currentUser, String subject, String body) throws MailException {

    }

    @Override
    public String getMailToProtocollo() {
        return null;
    }

    @Override
    public String getMailToHelpDesk() {
        return null;
    }
}
