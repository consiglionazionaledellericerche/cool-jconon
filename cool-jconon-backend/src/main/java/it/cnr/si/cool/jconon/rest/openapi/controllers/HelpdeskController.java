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

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.GroupsUtils;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.model.HelpdeskBean;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.helpdesk.HelpdeskService;
import it.cnr.si.cool.jconon.util.JcononGroups;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Stream;

/**
 * Versione OpenAPI di /rest/helpdesk.
 * Rispetto alla versione legacy la categoria della segnalazione viene calcolata lato server
 * a partire dal bando e dal tipo di problema, invece di essere passata dal client.
 */
@RestController
@RequestMapping(ApiRoutes.V1_HELPDESK)
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Helpdesk", description = "Segnalazioni all'HelpDesk e gestione degli esperti")
public class HelpdeskController {
    private static final Logger LOGGER = LoggerFactory.getLogger(HelpdeskController.class);
    private static final String CATEGORIA_DEFAULT = "1";
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public enum ProblemType {
        tecnico, normativo
    }

    @Autowired
    private HelpdeskService helpdeskService;
    @Autowired
    private CMISService cmisService;

    @Operation(summary = "Invia una nuova segnalazione, oppure riapre una segnalazione esistente se sono presenti id e azione")
    @PostMapping(value = "/send", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, ?>> send(
            HttpServletRequest req,
            @ModelAttribute HelpdeskBean hdBean,
            @RequestParam(value = "callId", required = false) String callId,
            @RequestParam(value = "problemType", required = false) ProblemType problemType,
            @RequestParam(value = "allegato", required = false) MultipartFile allegato
    ) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        hdBean.setIp(req.getRemoteAddr());
        try {
            blockXSS(hdBean);
            if (hdBean.getId() != null && hdBean.getAzione() != null) {
                helpdeskService.sendReopenMessage(hdBean, user);
                return ResponseEntity.ok(Collections.singletonMap("result", Boolean.TRUE));
            }
            if (callId == null || problemType == null) {
                throw new ClientMessageException("message.helpdesk.send.missing.call");
            }
            final Session session = cmisService.getCurrentCMISSession(req);
            final CmisObject call = session.getObject(callId);
            final String category = Optional.ofNullable(
                            call.getPropertyValue(
                                    problemType == ProblemType.tecnico ?
                                            JCONONPropertyIds.CALL_ID_CATEGORIA_TECNICO_HELPDESK.value() :
                                            JCONONPropertyIds.CALL_ID_CATEGORIA_NORMATIVA_HELPDESK.value()
                            ))
                    .map(Object::toString)
                    .orElse(CATEGORIA_DEFAULT);
            if (isEsperto(category, user)) {
                throw new ClientMessageException("message.helpdesk.send.category.expert");
            }
            hdBean.setCategory(category);
            hdBean.setCall(call.getName());
            hdBean.setProblemType(problemType == ProblemType.tecnico ? "Problema Tecnico" : "Problema Normativo");
            helpdeskService.post(hdBean, allegato, user);
            return ResponseEntity.ok(Collections.singletonMap("result", Boolean.TRUE));
        } catch (ClientMessageException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            LOGGER.error("helpdesk send error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "message.helpdesk.send.failed"));
        }
    }

    @Operation(summary = "Esperti associati a una categoria")
    @GetMapping("/esperti")
    public ResponseEntity<List<?>> esperti(@RequestParam("idCategoria") Integer idCategoria) {
        return ResponseEntity.ok(helpdeskService.getEsperti(idCategoria));
    }

    @Operation(summary = "Associa un esperto a una categoria")
    @PutMapping("/esperti")
    public ResponseEntity<Void> addEsperto(HttpServletRequest req,
                                           @RequestParam("idCategoria") Integer idCategoria,
                                           @RequestParam("idEsperto") String idEsperto) {
        if (!canManageEsperti(req)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        helpdeskService.manageEsperto(idCategoria, idEsperto, false);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Rimuove un esperto da una categoria")
    @DeleteMapping("/esperti")
    public ResponseEntity<Void> deleteEsperto(HttpServletRequest req,
                                              @RequestParam("idCategoria") Integer idCategoria,
                                              @RequestParam("idEsperto") String idEsperto) {
        if (!canManageEsperti(req)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        helpdeskService.manageEsperto(idCategoria, idEsperto, true);
        return ResponseEntity.ok().build();
    }

    private boolean canManageEsperti(HttpServletRequest req) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        return user != null && !user.isGuest() &&
                (user.isAdmin() || GroupsUtils.getGroups(user).contains(JcononGroups.CONCORSI.group()));
    }

    /**
     * Chi apre la segnalazione non deve essere tra gli esperti della categoria.
     * Se l'helpdesk non e' configurato il controllo viene saltato, come nella versione legacy.
     */
    private boolean isEsperto(String category, CMISUser user) {
        if (user == null || user.isGuest()) {
            return false;
        }
        try {
            return helpdeskService.getEsperti(Integer.valueOf(category))
                    .stream()
                    .map(esperto -> MAPPER.convertValue(esperto, Map.class))
                    .anyMatch(map -> user.getId().equals(map.get("login")));
        } catch (RuntimeException _ex) {
            LOGGER.warn("Unable to check helpdesk experts for category {}", category, _ex);
            return false;
        }
    }

    private void blockXSS(HelpdeskBean hdBean) {
        Stream.of(hdBean.getFirstName(), hdBean.getLastName(), hdBean.getEmail(), hdBean.getConfirmEmail(),
                        hdBean.getSubject(), hdBean.getMessage(), hdBean.getPhoneNumber())
                .filter(Objects::nonNull)
                .forEach(value -> {
                    for (Pattern scriptPattern : StringUtil.patternsXSS) {
                        if (scriptPattern.matcher(value).find()) {
                            throw new ClientMessageException("message.error.caller");
                        }
                    }
                });
    }
}
