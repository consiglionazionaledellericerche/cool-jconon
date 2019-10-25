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

import it.cnr.si.cool.jconon.configuration.PECConfiguration;
import it.cnr.si.cool.jconon.dto.VerificaPECTask;
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
import javax.mail.search.SearchTerm;
import javax.mail.search.SubjectTerm;
import java.util.Arrays;
import java.util.Optional;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public class PECTest {
    @Value("${pec.username}")
    private String pecUsername;

    @Value("${pec.password}")
    private String pecPassword;

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
}