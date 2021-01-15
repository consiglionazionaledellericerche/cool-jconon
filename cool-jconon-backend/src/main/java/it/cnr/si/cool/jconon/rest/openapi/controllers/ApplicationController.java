package it.cnr.si.cool.jconon.rest.openapi.controllers;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.cool.util.Pair;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.util.FilterType;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(ApiRoutes.V1_APPLICATION)
public class ApplicationController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationController.class);
    @Autowired
    private CMISService cmisService;
    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private NodeMetadataService nodeMetadataService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(HttpServletRequest req,
                                                    @RequestParam("page") Integer page,
                                                    @RequestParam("offset") Integer offset,
                                                    @RequestParam(value = "user", required = false) String user,
                                                    @RequestParam(value = "fetchCall", required = false, defaultValue = "false") Boolean fetchCall,
                                                    @RequestParam(value = "type", required = false) String type,
                                                    @RequestParam(value = "filterType", required = false) FilterType filterType,
                                                    @RequestParam(value = "callCode", required = false) String callCode,
                                                    @RequestParam(value = "inizioScadenza", required = false) LocalDate inizioScadenza,
                                                    @RequestParam(value = "fineScadenza", required = false) LocalDate fineScadenza,
                                                    @RequestParam(value = "applicationStatus", required = false) String applicationStatus) {
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(
                applicationService.findApplications(
                        session,
                        page,
                        offset,
                        user,
                        fetchCall,
                        type,
                        filterType,
                        callCode,
                        inizioScadenza,
                        fineScadenza,
                        applicationStatus,
                        null,
                        null,
                        null,
                        null
                )
        );
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> listUser(HttpServletRequest req,
                                                    @RequestParam("page") Integer page,
                                                    @RequestParam("offset") Integer offset,
                                                    @RequestParam(value = "user", required = false) String user,
                                                    @RequestParam(value = "fetchCall", required = false, defaultValue = "false") Boolean fetchCall,
                                                    @RequestParam(value = "applicationStatus", required = false) String applicationStatus,
                                                    @RequestParam(value = "firstname", required = false) String firstname,
                                                    @RequestParam(value = "lastname", required = false) String lastname,
                                                    @RequestParam(value = "codicefiscale", required = false) String codicefiscale,
                                                    @RequestParam(value = "call", required = false) String call) {
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(
                applicationService.findApplications(
                        session,
                        page,
                        offset,
                        user,
                        fetchCall,
                        null,
                        null,
                        null,
                        null,
                        null,
                        applicationStatus,
                        firstname,
                        lastname,
                        codicefiscale,
                        call
                )
        );
    }

    @GetMapping("/state")
    public ResponseEntity<List<ApplicationService.ApplicationState>> applicationState(HttpServletRequest req,
                                                                                      @RequestParam("user") String user){
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(
                applicationService.findApplicationState(session, user));
    }

    @PostMapping("/save")
    public ResponseEntity<Map<String, ?>> saveApplication(HttpServletRequest req, @RequestBody Map<String, ?> prop) throws ParseException {
        Session session = cmisService.getCurrentCMISSession(req);

        Map<String, Object> properties = nodeMetadataService
                .populateMetadataType(session, prop, req);
        return ResponseEntity.ok(
                CMISUtil.convertToProperties(
                        applicationService.save(
                                session,
                                null,
                                req.getLocale(),
                                cmisService.getCMISUserFromSession(req).getId(),
                                properties,
                                Collections.emptyMap()//aspectProperties
                        )
                )
        );
    }
}
