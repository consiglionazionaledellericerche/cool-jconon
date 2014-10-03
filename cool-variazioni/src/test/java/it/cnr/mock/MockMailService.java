package it.cnr.mock;

import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;

import org.springframework.mail.MailException;

public class MockMailService implements MailService {

	@Override
	public String getMailToHelpDesk() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getMailToProtocollo() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void send(EmailMessage arg0) throws MailException {
		// TODO Auto-generated method stub

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
