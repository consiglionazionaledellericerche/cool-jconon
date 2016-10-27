package it.cnr.jconon.mock;

import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.jconon.service.HelpDeskServiceTest;
import org.springframework.mail.MailException;

import static org.junit.Assert.assertTrue;

public class MockMailService implements MailService {

    @Override
    public String getMailToHelpDesk() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void send(EmailMessage email) throws MailException {
        // TODO Auto-generated method stub (modificato)
        if (email.getSubject().contains(HelpDeskServiceTest.AZIONE)) {
            assertTrue(email.getBody().toString().contains(HelpDeskServiceTest.MESSAGE_REOPEN));
            assertTrue(email.getSubject().contains(HelpDeskServiceTest.AZIONE));
            assertTrue(email.getSubject().contains(HelpDeskServiceTest.ID));
        } else {
            assertTrue(email.getBody().toString().contains(HelpDeskServiceTest.MESSAGE));
            assertTrue(email.getAttachments().get(0).getFileName().equals(HelpDeskServiceTest.NAME_ATTACHMENTS));

            assertTrue(email.getBody().toString().contains(HelpDeskServiceTest.MESSAGE));
            assertTrue(email.getBody().toString().contains(HelpDeskServiceTest.MATRICOLA));

//            [concorsi]~~614~~BANDO 367.4 DISBA IPSP RIC - Problema Normativo~~BANDO 367.4 DISBA IPSP RIC - oggetto di prova~~Paolo~~Cirone~~cironepa@gmail.com
            assertTrue(email.getSubject().equals("[concorsi]~~" +
                                                         HelpDeskServiceTest.ID_CATEGORY + "~~" +
                                                         HelpDeskServiceTest.CALL + " - " + HelpDeskServiceTest.PROBLEM_TYPE + "~~" +
                                                         HelpDeskServiceTest.CALL + " - " + HelpDeskServiceTest.SUBJECT + "~~" +
                                                         HelpDeskServiceTest.getCmisUser().getFirstName() + "~~" +
                                                         HelpDeskServiceTest.getCmisUser().getLastName() + "~~" +
                                                         HelpDeskServiceTest.getCmisUser().getEmail()));
        }
        assertTrue(email.getBody().toString().contains(HelpDeskServiceTest.SOURCE_IP));
    }

    @Override
    public void send(String arg0, String arg1) throws MailException {
        // TODO Auto-generated method stub

    }

    @Override
    public void send(String arg0, String arg1, String arg2)
            throws MailException {
        // TODO Auto-generated method stub

    }

    @Override
    public void sendErrorMessage(String arg0, String arg1, String arg2)
            throws MailException {
        // TODO Auto-generated method stub

    }

    @Override
    public void sendErrorMessage(String arg0, String arg1, String arg2,
                                 Exception arg3) throws MailException {
        // TODO Auto-generated method stub

    }

}
