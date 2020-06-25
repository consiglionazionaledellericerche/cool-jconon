package it.cnr.si.cool.jconon.rest.openapi.controllers;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.frontOffice.FrontOfficeService;
import it.cnr.cool.service.util.Faq;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.apache.chemistry.opencmis.client.api.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(ApiRoutes.V1_FAQ)
public class FaqController {
    private static final Logger LOGGER = LoggerFactory.getLogger(FaqController.class);
    @Autowired
    private CMISService cmisService;

    @Autowired
    private FrontOfficeService frontOfficeService;

    @GetMapping
    public ResponseEntity<Map<String, List<Faq>>> list(HttpServletRequest req) {
        Session session = cmisService.getCurrentCMISSession(req);
        final List<Faq> faqs = Optional.ofNullable(frontOfficeService.getFaq(session, null, null, null, false, null))
                .map(stringObjectMap -> stringObjectMap.get("docs"))
                .filter(List.class::isInstance)
                .map(List.class::cast)
                .orElse(Collections.emptyList());

        return ResponseEntity.ok().body(
                faqs.stream().collect(Collectors.groupingBy(Faq::getType))
        );
    }
}
