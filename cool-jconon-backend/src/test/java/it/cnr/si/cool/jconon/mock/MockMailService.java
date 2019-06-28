/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.mock;

import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.si.cool.jconon.service.HelpDeskServiceTest;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

import static org.junit.Assert.assertTrue;


@Service
@Primary
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
    public void send(String s, String s1, String s2, String s3, String s4) throws MailException {

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
