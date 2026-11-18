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

package it.cnr.si.cool.jconon.push;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.si.cool.jconon.repository.CacheRepository;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Iscrizioni alle notifiche push degli utenti, in una cartella riservata del repository (accesso solo
 * amministrativo, senza ereditare i permessi della cartella dei bandi): un documento JSON per utente con
 * gli argomenti scelti e i dispositivi iscritti, più le chiavi VAPID generate al primo utilizzo.
 */
@Repository
public class PushSubscriptionRepository {
    private static final Logger LOGGER = LoggerFactory.getLogger(PushSubscriptionRepository.class);
    private static final String FOLDER = "push-notifications";
    private static final String VAPID_KEYS = "vapid-keys.json";
    private static final String USER_PREFIX = "user-";
    private static final String JSON = "application/json";

    @Autowired
    private CMISService cmisService;
    @Autowired
    private ACLService aclService;
    @Autowired
    private CacheRepository cacheRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    /** Argomenti e dispositivi iscritti di un utente. */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PushSettings {
        public String userId;
        public List<String> topics = new ArrayList<>();
        public List<PushEndpoint> subscriptions = new ArrayList<>();
    }

    /** Iscrizione di un browser (PushSubscription della Push API). */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PushEndpoint {
        public String endpoint;
        public String p256dh;
        public String auth;
        public String userAgent;
        public long created;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VapidKeys {
        public String publicKey;
        public String privateKey;
    }

    public Optional<PushSettings> find(String userId) {
        final Session session = cmisService.createAdminSession();
        return document(session, fileName(userId)).flatMap(document -> read(document, PushSettings.class));
    }

    /** Tutte le iscrizioni (per le notifiche a tutti gli iscritti a un argomento). */
    public List<PushSettings> findAll() {
        final Session session = cmisService.createAdminSession();
        final List<PushSettings> result = new ArrayList<>();
        for (CmisObject child : folder(session).getChildren()) {
            if (child instanceof Document && child.getName().startsWith(USER_PREFIX)) {
                read((Document) child, PushSettings.class).ifPresent(result::add);
            }
        }
        return result;
    }

    /** Salva le impostazioni; senza dispositivi iscritti il documento viene eliminato. */
    public synchronized void save(PushSettings settings) {
        final Session session = cmisService.createAdminSession();
        final String name = fileName(settings.userId);
        final Optional<Document> existing = document(session, name);
        if (settings.subscriptions == null || settings.subscriptions.isEmpty()) {
            existing.ifPresent(document -> document.delete(true));
            return;
        }
        write(session, name, existing, settings);
    }

    /** Chiavi VAPID dell'applicazione: generate e salvate al primo utilizzo se non configurate. */
    public synchronized VapidKeys vapidKeys() throws java.security.GeneralSecurityException {
        final Session session = cmisService.createAdminSession();
        final Optional<Document> existing = document(session, VAPID_KEYS);
        final Optional<VapidKeys> keys = existing.flatMap(document -> read(document, VapidKeys.class));
        if (keys.isPresent() && keys.get().publicKey != null && keys.get().privateKey != null) {
            return keys.get();
        }
        final String[] generated = WebPushSender.generateVapidKeys();
        final VapidKeys vapidKeys = new VapidKeys();
        vapidKeys.publicKey = generated[0];
        vapidKeys.privateKey = generated[1];
        write(session, VAPID_KEYS, existing, vapidKeys);
        LOGGER.info("Generated VAPID keys for push notifications");
        return vapidKeys;
    }

    /* ------------------------------------------------------------------ */

    private void write(Session session, String name, Optional<Document> existing, Object value) {
        final byte[] content;
        try {
            content = mapper.writeValueAsBytes(value);
        } catch (IOException e) {
            throw new IllegalStateException("Cannot serialize " + name, e);
        }
        final ContentStreamImpl stream = new ContentStreamImpl(name, BigInteger.valueOf(content.length), JSON,
                new ByteArrayInputStream(content));
        if (existing.isPresent()) {
            existing.get().setContentStream(stream, true);
            return;
        }
        final Map<String, Object> properties = new HashMap<>();
        properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
        properties.put(PropertyIds.NAME, name);
        try {
            // senza versioni: il contenuto viene sovrascritto a ogni modifica
            session.createDocument(properties, new ObjectIdImpl(folder(session).getId()), stream, VersioningState.NONE);
        } catch (CmisContentAlreadyExistsException e) {
            // creato nel frattempo da un'altra richiesta
            document(session, name).ifPresent(document -> document.setContentStream(
                    new ContentStreamImpl(name, BigInteger.valueOf(content.length), JSON, new ByteArrayInputStream(content)), true));
        }
    }

    private <T> Optional<T> read(Document document, Class<T> type) {
        try (InputStream stream = document.getContentStream().getStream()) {
            return Optional.of(mapper.readValue(IOUtils.toString(stream, StandardCharsets.UTF_8), type));
        } catch (Exception e) {
            LOGGER.warn("Cannot read push document {}", document.getName(), e);
            return Optional.empty();
        }
    }

    private Optional<Document> document(Session session, String name) {
        try {
            final CmisObject object = session.getObjectByPath(folder(session).getPath() + "/" + name);
            if (object instanceof Document) {
                final Document document = (Document) object;
                document.refresh();
                return Optional.of(document);
            }
        } catch (CmisObjectNotFoundException e) {
            // non ancora creato
        }
        return Optional.empty();
    }

    /** Cartella riservata sotto la cartella dei bandi, creata al primo utilizzo senza ereditare i permessi. */
    private synchronized Folder folder(Session session) {
        final String competitionPath = cacheRepository.getCompetitionFolder().getPath();
        try {
            return (Folder) session.getObjectByPath(competitionPath + "/" + FOLDER);
        } catch (CmisObjectNotFoundException e) {
            final Map<String, Object> properties = new HashMap<>();
            properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_FOLDER.value());
            properties.put(PropertyIds.NAME, FOLDER);
            final Folder folder = (Folder) session.getObject(session.createFolder(properties,
                    new ObjectIdImpl(cacheRepository.getCompetitionFolder().getId())));
            aclService.setInheritedPermission(cmisService.getAdminSession(),
                    folder.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);
            LOGGER.info("Created folder {} for push notifications", folder.getPath());
            return folder;
        }
    }

    /** Nome del documento dell'utente: caratteri non ammessi nei nomi del repository sostituiti. */
    private static String fileName(String userId) {
        return USER_PREFIX + userId.replaceAll("[\\\\/:*?\"<>|]", "_") + ".json";
    }
}
