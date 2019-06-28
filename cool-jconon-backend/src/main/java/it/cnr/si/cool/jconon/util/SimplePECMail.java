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

package it.cnr.si.cool.jconon.util;

import org.apache.commons.mail.Email;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.MultiPartEmail;

import java.util.List;

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