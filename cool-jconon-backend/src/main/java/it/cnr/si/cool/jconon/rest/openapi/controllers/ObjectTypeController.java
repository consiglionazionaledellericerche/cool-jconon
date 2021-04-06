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
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.definitions.Choice;
import org.apache.chemistry.opencmis.commons.definitions.PropertyDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(ApiRoutes.V1_OBJECT_TYPE)
public class ObjectTypeController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ObjectTypeController.class);
    @Autowired
    private CMISService cmisService;

    @GetMapping("/{typeId}/queryName")
    public ResponseEntity<String> type(HttpServletRequest req, @PathVariable String typeId) {
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(
                Optional.ofNullable(session.getTypeDefinition(typeId))
                    .map(ObjectType::getQueryName)
                    .orElse(null)
        );
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