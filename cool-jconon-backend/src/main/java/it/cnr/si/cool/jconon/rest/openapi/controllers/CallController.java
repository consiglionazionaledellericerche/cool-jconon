package it.cnr.si.cool.jconon.rest.openapi.controllers;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.repository.ANPR;
import it.cnr.si.cool.jconon.repository.dto.Comuni;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.FilterType;
import org.apache.chemistry.opencmis.client.api.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(ApiRoutes.V1_CALL)
public class CallController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CallController.class);
    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;
    @Autowired
    private ANPR anpr;
    @Autowired
    private NodeMetadataService nodeMetadataService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(HttpServletRequest req,
                                                    @RequestParam("page") Integer page,
                                                    @RequestParam("offset") Integer offset,
                                                    @RequestParam(value = "type", required = false) String type,
                                                    @RequestParam("filterType") FilterType filterType,
                                                    @RequestParam(value = "callCode", required = false) String callCode,
                                                    @RequestParam(value = "inizioScadenza", required = false) LocalDate inizioScadenza,
                                                    @RequestParam(value = "fineScadenza", required = false) LocalDate fineScadenza,
                                                    @RequestParam(value = "profile", required = false) String profile,
                                                    @RequestParam(value = "gazzetteNumber", required = false) String gazzetteNumber,
                                                    @RequestParam(value = "gazzetteDate", required = false) LocalDate gazzetteDate,
                                                    @RequestParam(value = "requirements", required = false) String requirements,
                                                    @RequestParam(value = "struttura", required = false) String struttura,
                                                    @RequestParam(value = "sede", required = false) String sede) {
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(
                callService.findCalls(
                        session,
                        page,
                        offset,
                        Optional.ofNullable(type).orElse(JCONONFolderType.JCONON_CALL.queryName()),
                        filterType,
                        callCode,
                        inizioScadenza,
                        fineScadenza,
                        profile,
                        gazzetteNumber,
                        gazzetteDate,
                        requirements,
                        struttura,
                        sede
                )
        );
    }

    @GetMapping(ApiRoutes.SELECT2)
    public ResponseEntity<Map<String, Object>> select2(HttpServletRequest req,
                                                       @RequestParam(value = "filter", required = false) String filter) {
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(
                callService.findCalls(
                        session,
                        0,
                        null,
                        JCONONFolderType.JCONON_CALL.queryName(),
                        null,
                        filter,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                )
        );
    }

    @GetMapping(ApiRoutes.COMUNI)
    public ResponseEntity<Comuni> comuni(HttpServletRequest req,
                                         @RequestParam("filter") String filter) {
        return ResponseEntity.ok(anpr.get(filter));
    }

    @GetMapping(ApiRoutes.SHOW)
    public ResponseEntity<Map<String, Object>> show(HttpServletRequest req, @PathVariable("id") String callId) {
        return ResponseEntity.ok().body(
                CMISUtil.convertToProperties(cmisService.getCurrentCMISSession(req).getObject(callId))
        );
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, ?>> saveCall(
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
                        callService.save(
                                session,
                                cmisService.getCurrentBindingSession(req),
                                origin,
                                req.getLocale(),
                                cmisService.getCMISUserFromSession(req).getId(),
                                properties,
                                aspectFromRequest
                        )
                )
        );
    }

}
