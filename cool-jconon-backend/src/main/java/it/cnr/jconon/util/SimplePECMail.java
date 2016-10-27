package it.cnr.jconon.util;

import java.util.List;

import org.apache.commons.mail.Email;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.MultiPartEmail;

public class SimplePECMail extends MultiPartEmail {
	private String userName;

	@Override
	public Email addBcc(String email, String name) throws EmailException {
		throw new EmailException("PEC non consente invii in Bcc");
	}

	@Override
	public List getBccAddresses() {
		return null;
	}

	@Override
	public Email setFrom(String email, String name, String charset)
			throws EmailException {
		if (!email.equals(userName))
			throw new EmailException(
					"Il mittente differisce dall'utente autenticato in SMTP");
		else
			return super.setFrom(email, name, charset);
	}

	@Override
	public Email setFrom(String email, String name) throws EmailException {
		if (!email.equals(userName))
			throw new EmailException(
					"Il mittente differisce dall'utente autenticato in SMTP");
		else
			return super.setFrom(email, name);
	}

	@Override
	public Email setFrom(String email) throws EmailException {
		if (!email.equals(userName))
			throw new EmailException(
					"Il mittente differisce dall'utente autenticato in SMTP");
		else
			return super.setFrom(email);
	}

	@Override
	public void setAuthentication(String userName, String password) {
		super.setAuthentication(userName, password);
	}

	public SimplePECMail(String userName, String password) {
		super();
		this.userName = userName;
		setSSLOnConnect(true);
		setSslSmtpPort("465");
		setAuthentication(userName, password);
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
}