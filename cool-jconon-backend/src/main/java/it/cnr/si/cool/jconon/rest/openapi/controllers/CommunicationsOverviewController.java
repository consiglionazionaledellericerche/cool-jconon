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

package it.cnr.si.cool.jconon.rest.openapi.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.CMISUtil;
import it.cnr.si.cool.jconon.repository.CacheRepository;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.Order;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.client.api.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * - Proroghe e riaperture di un bando (ex query su jconon_attachment:prorogation del frontend legacy).
 * - Convocazioni, esclusioni e comunicazioni di tutti i bandi: la query viene eseguita con la sessione
 *   dell'utente, quindi un candidato vede solo i documenti delle proprie domande e chi gestisce i bandi
 *   quelli che i permessi Alfresco gli consentono di leggere.
 */
@RestController
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Comunicazioni e proroghe", description = "Proroghe dei bandi e comunicazioni ai candidati indipendenti dal bando")
public class CommunicationsOverviewController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CommunicationsOverviewController.class);

    @Autowired
    private CMISService cmisService;
    @Autowired
    private CacheRepository cacheRepository;

    /**
     * Ricerca dei documenti del tipo indicato, sempre limitata all'albero della cartella dei concorsi.
     */
    private Criteria criteria(CallCommunicationsController.Kind kind) {
        final Criteria criteria = CriteriaFactory.createCriteria(kind.queryName);
        criteria.add(Restrictions.inTree(cacheRepository.getCompetitionFolder().getId()));
        return criteria;
    }

    @Operation(summary = "Proroghe e riaperture del bando (anche giudiziali), ordinate per nuova scadenza")
    @GetMapping(ApiRoutes.V1_CALL + "/{id}/prorogations")
    public ResponseEntity<List<Map<String, Object>>> prorogations(HttpServletRequest req, @PathVariable String id) {
        final Session session = cmisService.getCurrentCMISSession(req);
        final String query = "SELECT * FROM jconon_attachment:prorogation WHERE IN_FOLDER('" + safeId(id) +
                "') ORDER BY jconon_attachment:data_fine ASC";
        final OperationContext context = session.createOperationContext();
        context.setMaxItemsPerPage(100);
        final List<Map<String, Object>> result = StreamSupport.stream(session.query(query, false, context).getPage(100).spliterator(), false)
                .map(CMISUtil::convertToProperties)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Numero di convocazioni, esclusioni e comunicazioni visibili all'utente")
    @GetMapping(ApiRoutes.V1_APPLICATION + "/communications/count")
    public ResponseEntity<Map<String, Long>> count(HttpServletRequest req) {
        currentUser(req);
        final Session session = cmisService.getCurrentCMISSession(req);
        final Map<String, Long> result = new LinkedHashMap<>();
        for (CallCommunicationsController.Kind kind : CallCommunicationsController.Kind.values()) {
            try {
                final Criteria criteria = criteria(kind);
                criteria.addColumn(PropertyIds.OBJECT_ID);
                result.put(kind.name(), criteria.executeQuery(session, false, session.getDefaultContext()).getTotalNumItems());
            } catch (RuntimeException e) {
                LOGGER.warn("count {} failed", kind, e);
                result.put(kind.name(), 0L);
            }
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Convocazioni, esclusioni o comunicazioni visibili all'utente, di tutti i bandi")
    @GetMapping(ApiRoutes.V1_APPLICATION + "/communications/{kind}")
    public ResponseEntity<Map<String, Object>> list(HttpServletRequest req,
                                                    @PathVariable CallCommunicationsController.Kind kind,
                                                    @RequestParam(value = "page", defaultValue = "0") int page,
                                                    @RequestParam(value = "offset", defaultValue = "20") int offset) {
        currentUser(req);
        final int size = Math.max(1, Math.min(offset, 100));
        final Session session = cmisService.getCurrentCMISSession(req);
        final OperationContext context = session.createOperationContext();
        context.setMaxItemsPerPage(size);
        final Criteria criteria = criteria(kind);
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.addColumn(PropertyIds.OBJECT_TYPE_ID);
        criteria.addColumn(PropertyIds.NAME);
        criteria.addColumn(PropertyIds.LAST_MODIFICATION_DATE);
        criteria.addColumn(kind.stateProperty);
        criteria.addOrder(Order.descending(PropertyIds.LAST_MODIFICATION_DATE));
        final ItemIterable<QueryResult> results = criteria.executeQuery(session, false, context)
                .skipTo((long) page * size).getPage(size);
        final List<Map<String, Object>> items = new ArrayList<>();
        for (QueryResult result : results) {
            final Map<String, Object> item = CMISUtil.convertToProperties(result);
            enrich(session, String.valueOf(item.get("cmis:objectId")), item);
            items.add(item);
        }
        final Map<String, Object> body = new HashMap<>();
        body.put("items", items);
        body.put("count", results.getTotalNumItems());
        return ResponseEntity.ok(body);
    }

    /** Aggiunge il candidato (domanda) e il bando di appartenenza del documento. */
    private void enrich(Session session, String documentId, Map<String, Object> item) {
        try {
            final CmisObject object = session.getObject(documentId);
            if (!(object instanceof Document)) {
                return;
            }
            final List<Folder> parents = ((Document) object).getParents();
            if (parents.isEmpty()) {
                return;
            }
            final Folder application = parents.get(0);
            item.put("application:objectId", application.getId());
            item.put("application:nome", application.getPropertyValue("jconon_application:nome"));
            item.put("application:cognome", application.getPropertyValue("jconon_application:cognome"));
            final Folder call = application.getFolderParent();
            if (call != null) {
                item.put("call:objectId", call.getId());
                item.put("call:codice", call.getPropertyValue("jconon_call:codice"));
            }
        } catch (RuntimeException e) {
            LOGGER.debug("Unable to resolve parents of {}", documentId, e);
        }
    }

    private CMISUser currentUser(HttpServletRequest req) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    private String safeId(String id) {
        if (id == null || !id.matches("[A-Za-z0-9:/;._\\-]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid id");
        }
        return id;
    }
}
