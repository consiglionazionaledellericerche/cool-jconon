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

package it.cnr.si.cool.jconon.territori;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Ultima versione scaricata dei dati territoriali, salvata nel repository (cartella "territori" sotto la cartella
 * dei bandi) così che sia disponibile a tutti i nodi e dopo un riavvio anche se le fonti non sono raggiungibili.
 */
@Repository
public class TerritoriRepository {
    private static final Logger LOGGER = LoggerFactory.getLogger(TerritoriRepository.class);
    private static final String FOLDER = "territori";
    private static final String FILE = "territori.json";

    @Autowired
    private CMISService cmisService;
    @Autowired
    private CacheRepository cacheRepository;

    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public Optional<Territori.Archivio> load() {
        try {
            final Session session = cmisService.createAdminSession();
            final CmisObject object = session.getObjectByPath(folder(session).getPath() + "/" + FILE);
            if (object instanceof Document) {
                final Document document = (Document) object;
                document.refresh();
                try (InputStream stream = document.getContentStream().getStream()) {
                    return Optional.of(mapper.readValue(stream, Territori.Archivio.class));
                }
            }
        } catch (CmisObjectNotFoundException e) {
            // non ancora scaricato
        } catch (Exception e) {
            LOGGER.warn("Cannot read {}", FILE, e);
        }
        return Optional.empty();
    }

    public synchronized void save(Territori.Archivio archivio) throws IOException {
        final byte[] content = mapper.writeValueAsBytes(archivio);
        final Session session = cmisService.createAdminSession();
        final Folder folder = folder(session);
        final ContentStreamImpl stream = new ContentStreamImpl(FILE, BigInteger.valueOf(content.length), "application/json",
                new ByteArrayInputStream(content));
        try {
            final Document document = (Document) session.getObjectByPath(folder.getPath() + "/" + FILE);
            document.setContentStream(stream, true);
        } catch (CmisObjectNotFoundException e) {
            final Map<String, Object> properties = new HashMap<>();
            properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
            properties.put(PropertyIds.NAME, FILE);
            session.createDocument(properties, new ObjectIdImpl(folder.getId()), stream, VersioningState.NONE);
        }
    }

    private synchronized Folder folder(Session session) {
        final String competitionPath = cacheRepository.getCompetitionFolder().getPath();
        try {
            return (Folder) session.getObjectByPath(competitionPath + "/" + FOLDER);
        } catch (CmisObjectNotFoundException e) {
            final Map<String, Object> properties = new HashMap<>();
            properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_FOLDER.value());
            properties.put(PropertyIds.NAME, FOLDER);
            LOGGER.info("Creating folder {}/{}", competitionPath, FOLDER);
            return (Folder) session.getObject(session.createFolder(properties,
                    new ObjectIdImpl(cacheRepository.getCompetitionFolder().getId())));
        }
    }
}
