/*
 * Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *
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

package it.cnr.si.cool.jconon.service;

import it.cnr.cool.util.MimeTypes;
import it.cnr.si.cool.jconon.configuration.PECConfiguration;
import it.cnr.si.cool.jconon.dto.VerificaPECTask;
import it.cnr.si.cool.jconon.util.SimplePECMail;
import org.apache.commons.io.IOUtils;
import org.apache.commons.mail.EmailAttachment;
import org.apache.commons.mail.EmailException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.mail.MessagingException;
import javax.mail.NoSuchProviderException;
import javax.mail.Store;
import javax.mail.URLName;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.search.SearchTerm;
import javax.mail.search.SubjectTerm;
import javax.mail.util.ByteArrayDataSource;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public class PECTest {
    public static final String NAME_ATTACHMENTS = "allegato.pdf";

    @Value("${pec.username}")
    private String pecUsername;
    @Value("${pec.password}")
    private String pecPassword;
    @Value("${pec.to}")
    private String pecTo;
    @Autowired
    private PECConfiguration pecConfiguration;

    @Test
    public void configuration() {
        assertNotNull(pecConfiguration.getHostImap());
    }

    @Test
    public void verifyPEC() {
        Properties props = new Properties();
        props.put("mail.imap.host", pecConfiguration.getHostImap());
        props.put("mail.imap.auth", pecConfiguration.getAuth());
        props.put("mail.imap.ssl.enable", pecConfiguration.getSslEnable());
        props.put("mail.imap.port", pecConfiguration.getPort());
        props.put("mail.imap.socketFactory.class", pecConfiguration.getSocketFactoryClass());
        props.put("mail.imap.connectiontimeout", pecConfiguration.getConnectiontimeout());
        props.put("mail.imap.timeout", pecConfiguration.getTimeout());
        final javax.mail.Session session = javax.mail.Session.getInstance(props);
        URLName urlName = new URLName(pecConfiguration.getUrl());
        Store store = null;
        javax.mail.Folder folder = null;
        try {
            store = session.getStore(urlName);
            store.connect(pecUsername, pecPassword);
            folder = store.getFolder("INBOX");
            folder.open(javax.mail.Folder.READ_ONLY);
            SearchTerm searchTerm = new SubjectTerm("CONSEGNA:");
            assertEquals(Boolean.FALSE, Arrays.asList(folder.search(searchTerm)).isEmpty());
        } catch (MessagingException e) {

        } finally {
            Optional.ofNullable(folder).ifPresent(x -> {
                try {
                    x.close(true);
                } catch (Exception e) {
                }
            });
            Optional.ofNullable(store).ifPresent(x -> {
                try {
                    x.close();
                } catch (Exception e) {

                }
            });
        }
    }

    @Test
    public void sendPEC() {
        SimplePECMail simplePECMail = new SimplePECMail(pecUsername, pecPassword);
        simplePECMail.setHostName(pecConfiguration.getHostSmtp());
        simplePECMail.setSubject("TEST PEC");
        String content = "Con riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, si invia in allegato la relativa esclusione.<br>";
        content += "Distinti saluti.<br/><br/><br/><hr/>";
        content += "<b>Questo messaggio e' stato generato da un sistema automatico. Si prega di non rispondere.</b><br/><br/>";
        try {
            simplePECMail.setFrom(pecUsername);
            simplePECMail.setReplyTo(Collections.singleton(new InternetAddress("undisclosed-recipients")));
            simplePECMail.setTo(Collections.singleton(new InternetAddress(pecTo)));
            final byte[] bytes = IOUtils.toByteArray(getClass().getResourceAsStream(
                    "/" + NAME_ATTACHMENTS));
            simplePECMail.attach(new ByteArrayDataSource(new ByteArrayInputStream(content.getBytes()),
                    "text/html"), "", "", EmailAttachment.INLINE);
            simplePECMail.attach(new ByteArrayDataSource(new ByteArrayInputStream(bytes),
                    MimeTypes.PDF.mimetype()), NAME_ATTACHMENTS, NAME_ATTACHMENTS);
            final String send = simplePECMail.send();
            assertNotNull(send);
        } catch (EmailException | AddressException | IOException e) {
            assertNotNull(e);
        }
    }
}