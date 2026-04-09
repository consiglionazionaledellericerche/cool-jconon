package it.cnr.si.cool.jconon.rest.openapi.controllers;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.rest.openapi.model.ApplicationsParamsDTO;
import it.cnr.si.cool.jconon.rest.openapi.model.CallParamsDTO;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.util.FilterType;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.PositiveOrZero;
import java.io.Serializable;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(ApiRoutes.V1_APPLICATION)
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Application", description = "Gestione delle domande di concorso")
public class ApplicationController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationController.class);
    @Autowired
    private CMISService cmisService;
    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private NodeMetadataService nodeMetadataService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(HttpServletRequest req, @Valid @ModelAttribute ApplicationsParamsDTO params) {
        return ResponseEntity.ok().body(applicationService.findApplications(cmisService.getCurrentCMISSession(req),false,params));
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> listUser(HttpServletRequest req, @Valid @ModelAttribute ApplicationsParamsDTO params) {
        return ResponseEntity.ok().body(applicationService.findApplications(cmisService.getCurrentCMISSession(req), true, params));
    }

    @GetMapping("/state")
    public ResponseEntity<List<ApplicationService.ApplicationState>> applicationState(HttpServletRequest req, @RequestParam("user") String user) {
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(applicationService.findApplicationState(session, user));
    }

    @GetMapping("/all-state")
    public ResponseEntity<List<ApplicationService.ApplicationState>> allApplicationState(HttpServletRequest req) {
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(applicationService.findAllApplicationState(session));
    }

    @PostMapping("/save")
    public ResponseEntity<Map<String, ?>> saveApplication(
            HttpServletRequest req,
            @RequestHeader(value = HttpHeaders.ORIGIN) final String origin,
            @RequestBody Map<String, ?> prop
    ) throws ParseException {
        Session session = cmisService.getCurrentCMISSession(req);

        Map<String, Object> properties = nodeMetadataService
                .populateMetadataType(session, prop, req);
        final Map<String, Object> aspectFromRequest =
                nodeMetadataService.populateMetadataAspectFromRequest(session, prop, req);
        return ResponseEntity.ok(
                CMISUtil.convertToProperties(
                        applicationService.save(
                                session,
                                origin,
                                req.getLocale(),
                                cmisService.getCMISUserFromSession(req).getId(),
                                properties,
                                aspectFromRequest
                        )
                )
        );
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, ?>> sendApplication(
            HttpServletRequest req,
            @RequestHeader(value = HttpHeaders.ORIGIN) final String origin,
            @RequestBody Map<String, ?> prop
    ) throws ParseException {
        Session session = cmisService.getCurrentCMISSession(req);
        Map<String, Object> properties = nodeMetadataService
                .populateMetadataType(session, prop, req);
        final Map<String, Object> aspectFromRequest =
                nodeMetadataService.populateMetadataAspectFromRequest(session, prop, req);
        try {
            final Map<String, String> result = applicationService.sendApplication(
                    session,
                    Optional.ofNullable(properties.get(PropertyIds.OBJECT_ID))
                            .filter(String.class::isInstance)
                            .map(String.class::cast)
                            .orElseThrow(() -> new ClientMessageException("Application Id not found on request params")),
                    origin,
                    req.getLocale(),
                    cmisService.getCMISUserFromSession(req).getId(),
                    properties,
                    aspectFromRequest
            );
            return ResponseEntity.ok(result);
        } catch (ClientMessageException _ex) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", _ex.getMessage()));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, ?>> delete(
            HttpServletRequest req,
            @RequestHeader(value = HttpHeaders.ORIGIN) final String origin,
            @RequestParam String objectId
    ) {
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            applicationService.delete(session, origin, objectId);
        } catch (ClientMessageException _ex) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", _ex.getMessage()));
        }
        return ResponseEntity.ok(Collections.singletonMap("result", Boolean.TRUE));
    }

    @PostMapping("/reopen")
    public ResponseEntity<Map<String, ?>> reopen(
            HttpServletRequest req,
            @RequestHeader(value = HttpHeaders.ORIGIN) final String origin,
            @RequestParam String objectId
    ) {
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            applicationService.reopenApplication(session, objectId, origin, req.getLocale(), cmisService.getCMISUserFromSession(req).getId());
        } catch (ClientMessageException _ex) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", _ex.getMessage()));
        }
        return ResponseEntity.ok(Collections.singletonMap("result", Boolean.TRUE));
    }

    @PostMapping("/print")
    public ResponseEntity<Map<String, ?>> print(
            HttpServletRequest req,
            @RequestHeader(value = HttpHeaders.ORIGIN) final String origin,
            @RequestParam String objectId
    ) {
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            applicationService.print(session, objectId, origin, cmisService.getCMISUserFromSession(req).getId(), req.getLocale());
        } catch (ClientMessageException _ex) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", _ex.getMessage()));
        }
        return ResponseEntity.ok(Collections.singletonMap("result", Boolean.TRUE));
    }
}
