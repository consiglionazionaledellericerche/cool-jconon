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

import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.frontOffice.FrontOfficeService;
import it.cnr.cool.service.frontOffice.TypeDocument;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Avvisi e FAQ (ex pagina "Front Office" del legacy): elenco pubblico degli avvisi validi (mostrati in home) e
 * gestione completa di avvisi e FAQ per gli amministratori, con il FrontOfficeService di cool-common.
 */
@RestController
@RequestMapping(ApiRoutes.VERSION_1 + "/frontoffice")
@Tag(name = "Front office", description = "Avvisi e FAQ")
public class FrontOfficeController {

    @Autowired
    private CMISService cmisService;
    @Autowired
    private FrontOfficeService frontOfficeService;

    @Operation(summary = "Avvisi in corso di validità (pubblicati e non scaduti), per la home e il menu Avvisi")
    @GetMapping("/notices")
    public ResponseEntity<Map<String, Object>> notices(HttpServletRequest req,
                                                       @RequestParam(value = "typeBando", required = false) String typeBando) {
        return ResponseEntity.ok(frontOfficeService.getNotice(cmisService.getCurrentCMISSession(req),
                cmisService.createAdminSession(), null, null, false, emptyToNull(typeBando)));
    }

    @Operation(summary = "Tutti gli avvisi, anche scaduti o non ancora pubblicati (amministratori)")
    @GetMapping("/notices/manage")
    public ResponseEntity<Map<String, Object>> manageNotices(HttpServletRequest req,
                                                             @RequestParam(value = "typeBando", required = false) String typeBando,
                                                             @RequestParam(value = "after", required = false) String after,
                                                             @RequestParam(value = "before", required = false) String before) {
        checkAdmin(req);
        return ResponseEntity.ok(frontOfficeService.getNotice(cmisService.getCurrentCMISSession(req),
                cmisService.createAdminSession(), emptyToNull(after), emptyToNull(before), true, emptyToNull(typeBando)));
    }

    @Operation(summary = "Tutte le FAQ, anche non visibili (amministratori)")
    @GetMapping("/faq/manage")
    public ResponseEntity<Map<String, Object>> manageFaq(HttpServletRequest req,
                                                         @RequestParam(value = "typeBando", required = false) String typeBando,
                                                         @RequestParam(value = "after", required = false) String after,
                                                         @RequestParam(value = "before", required = false) String before,
                                                         @RequestParam(value = "filter", required = false) String filter) {
        checkAdmin(req);
        return ResponseEntity.ok(frontOfficeService.getFaq(cmisService.getCurrentCMISSession(req),
                emptyToNull(after), emptyToNull(before), emptyToNull(typeBando), true, emptyToNull(filter)));
    }

    @Operation(summary = "Crea o modifica (con nodeRefToEdit) un avviso",
            description = "Campi: title, text, type (tipologia di bando), style (alert, success, error, warning, information), "
                    + "data e dataScadenza (yyyy-MM-dd), authority (gruppo o utente che può vederlo), number, nodeRefToEdit")
    @PostMapping("/notices")
    public ResponseEntity<Map<String, Object>> saveNotice(HttpServletRequest req, @RequestBody Map<String, Object> body) {
        checkAdmin(req);
        final JsonObject json = new JsonObject();
        put(json, CoolPropertyIds.NOTICE_TITLE.value(), body.get("title"));
        put(json, CoolPropertyIds.NOTICE_TEXT.value(), Optional.ofNullable(body.get("text")).orElse(""));
        put(json, CoolPropertyIds.NOTICE_TYPE.value(), body.get("type"));
        put(json, CoolPropertyIds.NOTICE_STYLE.value(), body.get("style"));
        put(json, CoolPropertyIds.NOTICE_DATA.value(), cmisDate(body.get("data"), true));
        put(json, CoolPropertyIds.NOTICE_SCADENZA.value(), cmisDate(body.get("dataScadenza"), true));
        put(json, CoolPropertyIds.NOTICE_AUTHORITY.value(), body.get("authority"));
        put(json, CoolPropertyIds.NOTICE_NUMBER.value(), number(body.get("number")));
        nodeRefToEdit(json, body);
        return ResponseEntity.ok(frontOfficeService.post(req.getRemoteAddr(), null, null, null, TypeDocument.Notice, json.toString()));
    }

    @Operation(summary = "Crea o modifica (con nodeRefToEdit) una FAQ",
            description = "Campi: question, answer, type (tipologia di bando), data (yyyy-MM-dd), show (visibile), number, nodeRefToEdit")
    @PostMapping("/faq")
    public ResponseEntity<Map<String, Object>> saveFaq(HttpServletRequest req, @RequestBody Map<String, Object> body) {
        checkAdmin(req);
        final JsonObject json = new JsonObject();
        put(json, CoolPropertyIds.FAQ_QUESTION.value(), body.get("question"));
        put(json, CoolPropertyIds.FAQ_ANSWER.value(), body.get("answer"));
        put(json, CoolPropertyIds.FAQ_TYPE.value(), body.get("type"));
        put(json, CoolPropertyIds.FAQ_DATA.value(), cmisDate(body.get("data"), true));
        put(json, CoolPropertyIds.FAQ_NUMBER.value(), number(body.get("number")));
        json.addProperty(CoolPropertyIds.FAQ_SHOW.value(), Boolean.parseBoolean(String.valueOf(body.get("show"))));
        nodeRefToEdit(json, body);
        return ResponseEntity.ok(frontOfficeService.post(req.getRemoteAddr(), null, null, null, TypeDocument.Faq, json.toString()));
    }

    @Operation(summary = "Elimina un avviso o una FAQ")
    @DeleteMapping
    public ResponseEntity<Void> delete(HttpServletRequest req, @RequestParam("nodeRef") String nodeRef) {
        checkAdmin(req);
        if (!nodeRef.matches("[A-Za-z0-9:/;._\\-]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid nodeRef");
        }
        frontOfficeService.deleteSingleNode(cmisService.getCurrentCMISSession(req), nodeRef);
        return ResponseEntity.ok().build();
    }

    /* ------------------------------------------------------------------ */

    private void checkAdmin(HttpServletRequest req) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        if (!user.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    private static String emptyToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    /** Il FrontOfficeService legge tutte le chiavi: quelle senza valore vanno comunque presenti come null. */
    private static void put(JsonObject json, String key, Object value) {
        if (value == null || (value instanceof String && ((String) value).trim().isEmpty())) {
            json.add(key, JsonNull.INSTANCE);
        } else if (value instanceof Number) {
            json.addProperty(key, (Number) value);
        } else {
            json.addProperty(key, String.valueOf(value));
        }
    }

    private static Integer number(Object value) {
        if (value == null || String.valueOf(value).trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.valueOf(String.valueOf(value).trim().replaceAll("\\.0+$", ""));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static void nodeRefToEdit(JsonObject json, Map<String, Object> body) {
        Optional.ofNullable(body.get("nodeRefToEdit")).map(String::valueOf).filter(s -> !s.trim().isEmpty())
                .ifPresent(nodeRef -> json.addProperty("nodeRefToEdit", nodeRef));
    }

    /**
     * Data nel formato letto da cool-common (yyyy-MM-dd'T'HH:mm:ss.SSSXXX, offset con i due punti, es. +00:00 come
     * il "Z" di moment nel legacy), a mezzogiorno UTC come il datepicker legacy. Con l'offset senza i due punti
     * (+0000) il parser di cool-common fallisce con "Unparseable date".
     * Accetta yyyy-MM-dd o una data già completa.
     */
    static String cmisDate(Object value, boolean required) {
        if (value == null || String.valueOf(value).trim().isEmpty()) {
            if (required) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "date required");
            }
            return null;
        }
        final String text = String.valueOf(value).trim();
        final SimpleDateFormat output = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'+00:00'");
        output.setTimeZone(TimeZone.getTimeZone("UTC"));
        try {
            final SimpleDateFormat day = new SimpleDateFormat("yyyy-MM-dd");
            day.setTimeZone(TimeZone.getTimeZone("UTC"));
            day.setLenient(false);
            final Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
            calendar.setTime(day.parse(text.substring(0, Math.min(10, text.length()))));
            calendar.set(Calendar.HOUR_OF_DAY, 12);
            return output.format(calendar.getTime());
        } catch (ParseException | StringIndexOutOfBoundsException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid date " + text);
        }
    }
}
