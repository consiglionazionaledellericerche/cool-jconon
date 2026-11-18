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
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.territori.Territori;
import it.cnr.si.cool.jconon.territori.TerritoriService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Comuni italiani (anche soppressi, con il periodo di validità) e stati esteri dalle fonti ufficiali ANPR e ISTAT:
 * sostituiscono il servizio ANPR esterno (/v1/call/comuni) e il file statico /rest/static/json/paesi.json.
 */
@RestController
@RequestMapping(ApiRoutes.VERSION_1 + "/territori")
@Tag(name = "Territori", description = "Comuni italiani e stati esteri")
public class TerritoriController {

    @Autowired
    private TerritoriService territoriService;
    @Autowired
    private CMISService cmisService;

    @Operation(summary = "Comuni per nome o codice catastale",
            description = "Prima i nomi uguali, poi quelli che iniziano con il filtro, a parità i comuni in vigore. " +
                    "data (yyyy-MM-dd) limita ai comuni validi in quella data, attivi ai soli comuni in vigore.")
    @GetMapping("/comuni")
    public ResponseEntity<Map<String, List<Territori.Comune>>> comuni(
            @Parameter(description = "Nome (anche parziale) o codice catastale") @RequestParam("filter") String filter,
            @Parameter(description = "Data di riferimento yyyy-MM-dd") @RequestParam(value = "data", required = false) String data,
            @RequestParam(value = "attivi", defaultValue = "false") boolean attivi,
            @RequestParam(value = "limit", defaultValue = "50") int limit) {
        if (data != null && !data.isEmpty() && !data.matches("\\d{4}-\\d{2}-\\d{2}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "data: yyyy-MM-dd");
        }
        return ResponseEntity.ok(Collections.singletonMap("comuni",
                territoriService.comuni(filter, data, attivi, Math.max(1, Math.min(limit, 500)))));
    }

    @Operation(summary = "Stati e territori esteri (elenco ISTAT), filtrabili per nome, codice ISO o catastale")
    @GetMapping("/stati")
    public ResponseEntity<Map<String, List<Territori.Stato>>> stati(@RequestParam(value = "filter", required = false) String filter) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .body(Collections.singletonMap("stati", territoriService.stati(filter)));
    }

    @Operation(summary = "Nomi degli stati, Italia compresa (stesso formato del vecchio paesi.json)")
    @GetMapping("/paesi.json")
    public ResponseEntity<List<String>> paesi() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .body(territoriService.paesi());
    }

    @Operation(summary = "Provenienza, numero di elementi e data dell'ultimo aggiornamento")
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        return ResponseEntity.ok(territoriService.info());
    }

    @Operation(summary = "Riscarica subito comuni e stati dalle fonti (solo amministratori)")
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refresh(HttpServletRequest req) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || !user.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.ok(territoriService.refresh());
    }
}
