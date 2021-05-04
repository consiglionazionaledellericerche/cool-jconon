/*
 * Copyright (C) 2021 Consiglio Nazionale delle Ricerche
 *       This program is free software: you can redistribute it and/or modify
 *        it under the terms of the GNU Affero General Public License as
 *        published by the Free Software Foundation, either version 3 of the
 *        License, or (at your option) any later version.
 *
 *        This program is distributed in the hope that it will be useful,
 *        but WITHOUT ANY WARRANTY; without even the implied warranty of
 *        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *       GNU Affero General Public License for more details.
 *
 *       You should have received a copy of the GNU Affero General Public License
 *       along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

package it.cnr.si.cool.jconon.rest.openapi.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.rest.openapi.utils.SpringI18NError;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.Serializable;
import java.text.ParseException;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(ApiRoutes.V1_DOCUMENT)
public class DocumentController {
    private static final Logger LOGGER = LoggerFactory.getLogger(DocumentController.class);
    private final CMISService cmisService;
    private final NodeMetadataService nodeMetadataService;

    public DocumentController(CMISService cmisService, NodeMetadataService nodeMetadataService) {
        this.cmisService = cmisService;
        this.nodeMetadataService = nodeMetadataService;
    }

    @PostMapping(value = "/create/{parentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, ?>> post(HttpServletRequest req,
                                               @PathVariable String parentId,
                                               @RequestPart(name = "properties") byte[] properties,
                                               @RequestPart(required = false) MultipartFile file) throws ParseException, IOException {
        Map<String, ?> result = null;
        try {
            Session session = cmisService.getCurrentCMISSession(req);
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Serializable> values = objectMapper.readValue(properties, Map.class);

            Map<String, Object> prop = nodeMetadataService.populateMetadataType(session, values, req);
            prop.putAll(nodeMetadataService.populateMetadataAspectFromRequest(session, values, req));

            final ObjectIdImpl parentFolder = new ObjectIdImpl(parentId);
            prop.put(PropertyIds.NAME, file.getOriginalFilename());
            ContentStreamImpl contentStream = new ContentStreamImpl();
            contentStream.setStream(file.getInputStream());
            contentStream.setFileName(file.getOriginalFilename());
            contentStream.setMimeType(file.getContentType());
            result = CMISUtil.convertToProperties(session.getObject(
                    session.createDocument(
                            prop,
                            parentFolder,
                            contentStream,
                            VersioningState.MAJOR
                    )));
        } catch (CmisContentAlreadyExistsException _ex) {
            return ResponseEntity.badRequest().body(
                    Collections.singletonMap(SpringI18NError.I18N,
                    new SpringI18NError(
                            "message.error.contentalredyexist",
                            Collections.singletonMap("filename", file.getOriginalFilename()))
                    )
            );
        } catch (Exception _ex) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error",_ex.getMessage()));
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, ?>> put(HttpServletRequest req,
                                              @RequestPart(name = "properties") byte[] properties,
                                              @RequestPart(required = false) MultipartFile file) throws ParseException, IOException {
        Map<String, ?> result = null;
        try {
            Session session = cmisService.getCurrentCMISSession(req);
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Serializable> values = objectMapper.readValue(properties, Map.class);

            Map<String, Object> prop = nodeMetadataService.populateMetadataType(session, values, req);
            prop.putAll(nodeMetadataService.populateMetadataAspectFromRequest(session, values, req));

            Optional<Document> document = Optional.ofNullable(session.getObject(String.valueOf(prop.get(PropertyIds.OBJECT_ID))))
                    .filter(Document.class::isInstance)
                    .map(Document.class::cast);
            if (document.isPresent()) {
                if (Optional.ofNullable(file).isPresent()) {
                    ContentStreamImpl contentStream = new ContentStreamImpl();
                    contentStream.setStream(file.getInputStream());
                    contentStream.setFileName(file.getOriginalFilename());
                    contentStream.setMimeType(file.getContentType());
                    final String objectId = session.getObject(document.get().setContentStream(contentStream, true, true))
                            .getPropertyValue(PropertyIds.VERSION_SERIES_ID);

                    document = Optional.ofNullable(session.getObject(objectId))
                            .filter(Document.class::isInstance)
                            .map(Document.class::cast);
                    document.get().rename(file.getOriginalFilename());
                }
                document = Optional.ofNullable(document.get().updateProperties(prop))
                        .filter(Document.class::isInstance)
                        .map(Document.class::cast);
                result = CMISUtil.convertToProperties(document.get());
            }
        } catch (Exception _ex) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error",_ex.getMessage()));
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping(value = "/delete")
    public ResponseEntity<Boolean> delete(HttpServletRequest req, @RequestParam("objectId") String objectId) {
        Session session = cmisService.getCurrentCMISSession(req);
        session.delete(new ObjectIdImpl(objectId));
        return ResponseEntity.ok(Boolean.TRUE);
    }
}
