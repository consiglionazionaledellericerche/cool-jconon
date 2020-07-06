package it.cnr.si.cool.jconon.rest.openapi.controllers;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(ApiRoutes.V1_USER)
public class UserController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private CMISService cmisService;

    @Autowired
    private UserService userService;

    @GetMapping("/existingemail")
    public ResponseEntity<Boolean> existingemail(HttpServletRequest req,
                                                 @RequestParam("email") String email,
                                                 @RequestParam("id") String id) {
        Optional<CMISUser> optionalCMISUser = Optional.ofNullable(email)
                .filter(s -> !s.isEmpty())
                .flatMap(s -> Optional.ofNullable(userService.findUserByEmail(email, cmisService.getCurrentBindingSession(req))));
        return ResponseEntity.ok().body(optionalCMISUser.isPresent() &&
                Optional.ofNullable(id).map(s -> !s.equals(optionalCMISUser.get().getEmail())).orElse(Boolean.TRUE));
    }

    @GetMapping("/existingcodicefiscale")
    public ResponseEntity<Boolean> existingcodicefiscale(HttpServletRequest req,
                                                         @RequestParam("codicefiscale") String codicefiscale,
                                                         @RequestParam("id") String id) {
        Optional<CMISUser> optionalCMISUser = Optional.ofNullable(codicefiscale)
                .filter(s -> !s.isEmpty())
                .flatMap(s -> Optional.ofNullable(userService.findUserByCodiceFiscale(codicefiscale, cmisService.getCurrentBindingSession(req))));
        return ResponseEntity.ok().body(optionalCMISUser.isPresent() &&
                Optional.ofNullable(id).map(s -> !s.equals(optionalCMISUser.get().getCodicefiscale())).orElse(Boolean.TRUE));
    }

}
