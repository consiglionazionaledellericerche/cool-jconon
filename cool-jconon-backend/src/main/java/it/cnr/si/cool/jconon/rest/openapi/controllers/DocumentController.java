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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.rest.openapi.utils.SpringI18NError;
import it.cnr.si.cool.jconon.service.cache.CompetitionFolderService;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisPermissionDeniedException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisUnauthorizedException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.Serializable;
import java.text.ParseException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(ApiRoutes.V1_DOCUMENT)
@Tag(name = "Documents", description = "API per la gestione dei documenti")
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
public class DocumentController {
    private static final Logger LOGGER = LoggerFactory.getLogger(DocumentController.class);
    private final CMISService cmisService;
    private final NodeMetadataService nodeMetadataService;
    @org.springframework.beans.factory.annotation.Autowired
    private it.cnr.cool.service.NodeService nodeService;
    @org.springframework.beans.factory.annotation.Autowired
    private it.cnr.cool.cmis.service.ACLService aclService;

    /** Visibilità del documento (campo legacy "inheritedPermission": true = Pubblico, false = Privato). */
    private static final String INHERITED_PERMISSION = "inheritedPermission";

    private final CompetitionFolderService competitionService;

    public DocumentController(CMISService cmisService, NodeMetadataService nodeMetadataService, CompetitionFolderService competitionService) {
        this.cmisService = cmisService;
        this.nodeMetadataService = nodeMetadataService;
        this.competitionService = competitionService;
    }

    @GetMapping("/count")
    @Operation(summary = "Conta i documenti", description = "Restituisce il numero di documenti presenti in una cartella specificata.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conteggio documenti restituito con successo"),
            @ApiResponse(responseCode = "400", description = "Richiesta non valida", content = @Content),
            @ApiResponse(responseCode = "500", description = "Errore interno del server", content = @Content)
    })
    public ResponseEntity<Map<String, Long>> count(
            HttpServletRequest req,
           @Parameter(description = "ID della cartella CMIS", required = false) @RequestParam(value = "folderId", required = false) String folderId,
           @Parameter(description = "Tipi di oggetti separati da virgola (es. cmis:document,...)") @RequestParam("objectQueryTypes") String objectQueryTypes) {
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(
                competitionService.countDocuments(
                        session,
                        Optional.ofNullable(folderId),
                        Arrays.asList(objectQueryTypes.split(",")),
                        Optional.of(Restrictions.eq(JCONONPropertyIds.ATTACHMENT_USER.value(), cmisService.getCMISUserFromSession(req).getId()))
                )
        );
    }

    @Operation(summary = "Crea un nuovo documento", description = "Crea un documento in una cartella CMIS con metadati e file allegato.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documento creato con successo"),
            @ApiResponse(responseCode = "400", description = "Errore di validazione o file già esistente", content = @Content(schema = @Schema(example = "{\"error\": \"File esistente\"}")))
    })
    @PostMapping(value = "/create/{parentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, ?>> post(
            HttpServletRequest req,
           @Parameter(description = "ID della cartella padre CMIS")
           @PathVariable String parentId,
           @Parameter(description = "Metadati del documento in formato JSON", required = true) @RequestPart(name = "properties") byte[] properties,
           @Parameter(description = "File da caricare", required = false) @RequestPart(required = false) MultipartFile file) throws ParseException, IOException {
        Map<String, ?> result = null;
        try {
            Session session = cmisService.getCurrentCMISSession(req);
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Serializable> values = objectMapper.readValue(properties, Map.class);
            // non è una proprietà CMIS: decide se il documento eredita i permessi della cartella (pubblico) o no
            final Serializable inheritedPermission = values.remove(INHERITED_PERMISSION);

            Map<String, Object> prop = nodeMetadataService.populateMetadataType(session, values, req);
            prop.putAll(nodeMetadataService.populateMetadataAspectFromRequest(session, values, req));

            final ObjectIdImpl parentFolder = new ObjectIdImpl(parentId);
            ContentStreamImpl contentStream = null;
            if (Optional.ofNullable(file).isPresent()) {
                contentStream = new ContentStreamImpl();
                prop.put(PropertyIds.NAME, file.getOriginalFilename());
                contentStream.setStream(file.getInputStream());
                contentStream.setFileName(file.getOriginalFilename());
                contentStream.setMimeType(file.getContentType());
            }
            final CmisObject created = session.getObject(
                    session.createDocument(
                            prop,
                            parentFolder,
                            contentStream,
                            VersioningState.MAJOR
                    ));
            applyInheritedPermission(created, inheritedPermission);
            afterSave(created);
            result = CMISUtil.convertToProperties(created);
        } catch (CmisContentAlreadyExistsException _ex) {
            return ResponseEntity.badRequest().body(
                    Collections.singletonMap(SpringI18NError.I18N,
                            new SpringI18NError(
                                    "message.error.contentalredyexist",
                                    Collections.singletonMap("filename", file.getOriginalFilename()))
                    )
            );
        } catch (Exception _ex) {
            LOGGER.error("Cannot create document", _ex);
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", _ex.getMessage()));
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Aggiorna un documento", description = "Aggiorna metadati e contenuto di un documento esistente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documento aggiornato con successo"),
            @ApiResponse(responseCode = "400", description = "Errore di validazione", content = @Content)
    })
    @PostMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, ?>> put(
            HttpServletRequest req,
            @Parameter(description = "Metadati aggiornati in formato JSON", required = true)
            @RequestPart(name = "properties") byte[] properties,
            @Parameter(description = "Nuovo file da associare (opzionale)", required = false)
            @RequestPart(required = false) MultipartFile file) throws ParseException, IOException {
        Map<String, ?> result = null;
        try {
            Session session = cmisService.getCurrentCMISSession(req);
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Serializable> values = objectMapper.readValue(properties, Map.class);
            final Serializable inheritedPermission = values.remove(INHERITED_PERMISSION);

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
                applyInheritedPermission(document.get(), inheritedPermission);
                afterSave(document.get());
                result = CMISUtil.convertToProperties(document.get());
            }
        } catch (Exception _ex) {
            LOGGER.error("Cannot update document", _ex);
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", _ex.getMessage()));
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Visibilità scelta nel form (come JCONONNodeMetadataService.updateObjectProperties nel legacy):
     * Pubblico eredita i permessi del bando, Privato no e il documento resta gestito dal gruppo CONCORSI.
     * Senza valore i permessi non cambiano.
     */
    private void applyInheritedPermission(CmisObject cmisObject, Serializable inheritedPermission) {
        if (inheritedPermission == null || String.valueOf(inheritedPermission).trim().isEmpty()) {
            return;
        }
        final boolean inherited = Boolean.parseBoolean(String.valueOf(inheritedPermission).trim());
        final String nodeRef = cmisObject.getPropertyValue(it.cnr.cool.cmis.model.CoolPropertyIds.ALFCMIS_NODEREF.value());
        aclService.setInheritedPermission(cmisService.getAdminSession(), nodeRef, inherited);
        if (!inherited) {
            aclService.addAcl(cmisService.getAdminSession(), nodeRef,
                    Collections.singletonMap(it.cnr.si.cool.jconon.util.JcononGroups.CONCORSI.group(),
                            it.cnr.cool.cmis.model.ACLType.Coordinator));
        }
    }

    /**
     * Operazioni dopo il salvataggio, come nel percorso legacy (NodeMetadataService.updateObjectProperties):
     * per i documenti di proroga/riapertura (aspect jconon_attachment:prorogation) aggiorna nel bando le date
     * effettive di presentazione e, se presenti, nuovo numero/data G.U. e data inPA.
     */
    private void afterSave(CmisObject cmisObject) {
        if (nodeMetadataService instanceof it.cnr.si.cool.jconon.service.JCONONNodeMetadataService) {
            ((it.cnr.si.cool.jconon.service.JCONONNodeMetadataService) nodeMetadataService).prorogation(cmisObject);
        }
        // graduatoria / scorrimento: come JCONONNodeService.upgradeDocument nel percorso legacy
        if (cmisObject instanceof Document && nodeService instanceof it.cnr.si.cool.jconon.service.JCONONNodeService) {
            ((it.cnr.si.cool.jconon.service.JCONONNodeService) nodeService).afterUpload((Document) cmisObject);
        }
    }

    @Operation(summary = "Elimina un documento", description = "Elimina un documento specificato dal repository.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Documento eliminato con successo"),
            @ApiResponse(responseCode = "400", description = "Richiesta non valida")
    })
    @DeleteMapping(value = "/delete")
    public ResponseEntity<Boolean> delete(
            HttpServletRequest req,
            @Parameter(description = "ID dell'oggetto/documento da eliminare")
            @RequestParam("objectId") String objectId) {
        Session session = cmisService.getCurrentCMISSession(req);
        // come NodeService (DELETE) del legacy: relazioni collegate, cancellazione e operazioni successive
        // (es. ricalcolo delle date del bando se si cancella una proroga, graduatoria)
        final org.apache.chemistry.opencmis.client.api.OperationContext operationContext = session.createOperationContext();
        operationContext.setIncludeRelationships(org.apache.chemistry.opencmis.commons.enums.IncludeRelationships.SOURCE);
        final CmisObject cmisObject = session.getObject(objectId, operationContext);
        Optional.ofNullable(cmisObject.getRelationships())
                .ifPresent(relationships -> relationships.stream()
                        .filter(relationship -> !relationship.getType().getId().equals("R:cm:original"))
                        .forEach(relationship -> relationship.getTarget().delete(true)));
        if (cmisObject instanceof Document) {
            final Document document = (Document) cmisObject;
            final Optional<Folder> parent = document.getParents().stream().findAny();
            final org.apache.chemistry.opencmis.client.api.DocumentType documentType = document.getDocumentType();
            document.delete(true);
            if (nodeService instanceof it.cnr.si.cool.jconon.service.JCONONNodeService) {
                ((it.cnr.si.cool.jconon.service.JCONONNodeService) nodeService).afterDelete(document, parent, documentType);
            }
        } else if (cmisObject instanceof Folder) {
            ((Folder) cmisObject).deleteTree(true, org.apache.chemistry.opencmis.commons.enums.UnfileObject.DELETE, false);
        } else {
            session.delete(new ObjectIdImpl(objectId));
        }
        return ResponseEntity.ok(Boolean.TRUE);
    }

    /**
     * Metadati con l'id come parametro: gli id CMIS dei documenti contengono la versione dopo ";" (es. ...;1.0),
     * che nel percorso viene rifiutata dal firewall di Spring Security.
     */
    @GetMapping("/metadata")
    @Operation(summary = "Metadati di un documento (id come parametro)", description = "Come /{id}, per gli id che contengono la versione (;1.0).")
    public ResponseEntity<Map<String, Object>> metadataById(HttpServletRequest req, @RequestParam("id") String id) {
        return metadata(req, id);
    }

    @GetMapping("/{id:.+}")
    @Operation(summary = "Metadati di un documento", description = "Proprietà del documento (nome, tipo, nome del file, metadati e azioni consentite).")
    public ResponseEntity<Map<String, Object>> metadata(HttpServletRequest req, @PathVariable("id") String id) {
        final Session session = cmisService.getCurrentCMISSession(req);
        try {
            return ResponseEntity.ok(CMISUtil.convertToProperties(session.getObject(id)));
        } catch (org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (org.apache.chemistry.opencmis.commons.exceptions.CmisPermissionDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping
    @Operation(summary = "Scarica un documento", description = "Scarica un file/documento specifico dal repository.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Download completato con successo", content = @Content(mediaType = "application/octet-stream")),
            @ApiResponse(responseCode = "400", description = "Errore nella richiesta"),
            @ApiResponse(responseCode = "401", description = "Accesso non autorizzato")
    })
    public ResponseEntity<InputStreamResource> download(
            HttpServletRequest req,
            @Parameter(description = "ID del nodo CMIS", required = true) @RequestParam("nodeRef") String nodeRef,
            @Parameter(description = "Nome del file per il download") @RequestParam(value = "fileName", required = false) String fileName) {
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            final Optional<Document> document = Optional.ofNullable(session.getObject(nodeRef))
                    .filter(Document.class::isInstance)
                    .map(Document.class::cast);
            if (document.isPresent()) {
                final ContentStream contentStream = document.get().getContentStream();
                HttpHeaders respHeaders = new HttpHeaders();
                respHeaders.setContentType(MediaType.parseMediaType(contentStream.getMimeType()));
                respHeaders.setContentLength(contentStream.getLength());
                respHeaders.setContentDispositionFormData(
                        "attachment",
                        Optional.ofNullable(fileName)
                                .orElseGet(contentStream::getFileName)
                );
                return new ResponseEntity<InputStreamResource>(
                        new InputStreamResource(contentStream.getStream()),
                        respHeaders,
                        HttpStatus.OK
                );
            }
            return ResponseEntity.badRequest().build();
        } catch (CmisPermissionDeniedException | CmisUnauthorizedException _ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
