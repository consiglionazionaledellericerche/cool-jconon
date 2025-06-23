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

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.repository.CacheRepository;
import it.cnr.si.cool.jconon.repository.dto.ObjectTypeCache;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.definitions.Choice;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping(ApiRoutes.V1_OBJECT_TYPE)
public class ObjectTypeController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ObjectTypeController.class);
    @Autowired
    private CMISService cmisService;
    @Autowired
    private CacheRepository cacheRepository;


    @GetMapping("/{typeId}")
    public ResponseEntity<?> type(HttpServletRequest req, @PathVariable String typeId) {
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            return ResponseEntity.ok().body(
                    Optional.ofNullable(session.getTypeDefinition(typeId))
                            .map(objectType -> new ObjectTypeCache().
                                    key(objectType.getId()).
                                    title(objectType.getDisplayName()).
                                    queryName(objectType.getQueryName()).
                                    label(objectType.getId()).
                                    description(objectType.getDescription()).
                                    defaultLabel(objectType.getDisplayName()))
                            .orElse(null)
            );
        } catch (CmisObjectNotFoundException _ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(String.format("Il tipo indicato %s non è presente!", typeId));
        }
    }

    @GetMapping("/{typeId}/children")
    public ResponseEntity<?> children(HttpServletRequest req, @PathVariable String typeId) {
        try {
            Session session = cmisService.getCurrentCMISSession(req);
            List<ObjectTypeCache> list = new ArrayList<ObjectTypeCache>();
            cacheRepository.populateCallType(
                    list,
                    session.getTypeDefinition(typeId),
                    false);
            return ResponseEntity.ok().body(list);
        } catch (CmisObjectNotFoundException _ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(String.format("Il tipo indicato %s non è presente!", typeId));
        }
    }

    @GetMapping("/call-children")
    public ResponseEntity<?> callChildren(HttpServletRequest req) {
        return children(req, JCONONFolderType.JCONON_CALL.value());
    }

    @GetMapping("/{typeId}/{propertyId}/constraint")
    public ResponseEntity<List<?>> listChoice(HttpServletRequest req, @PathVariable String typeId, @PathVariable String propertyId) {
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(session.getTypeDefinition(typeId)
                .getPropertyDefinitions()
                .entrySet()
                .stream()
                .filter(stringPropertyDefinitionEntry -> stringPropertyDefinitionEntry.getKey().equalsIgnoreCase(propertyId))
                .findAny()
                .map(Map.Entry::getValue)
                .map(PropertyDefinition::getChoices)
                .orElse(Collections.emptyList())
                .stream()
                .map(Choice::getValue)
                .flatMap(List::stream)
                .collect(Collectors.toList()));
    }
}