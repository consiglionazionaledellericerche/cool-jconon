package it.cnr.si.cool.jconon.rest.openapi;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.GroupsUtils;
import it.cnr.cool.web.PermissionService;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(ApiRoutes.V1_PCHECK)
public class PCheck {
    private static final Logger LOGGER = LoggerFactory.getLogger(PCheck.class);
    @Autowired
    private CMISService cmisService;
    @Autowired
    private PermissionService permissionService;

    @GetMapping
    public ResponseEntity<Boolean> pcheck(HttpServletRequest req, @RequestParam(value = "path", required = false) String path,
                                          @RequestParam(value = "method", required = false) PermissionService.methods method) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        return ResponseEntity.ok().body(
                permissionService.isAuthorized(path, Optional.ofNullable(method).orElse(PermissionService.methods.GET).name(), user.getId(), GroupsUtils.getGroups(user))
        );
    }

    @PostMapping
    public ResponseEntity<List<String>> pcheckPath(HttpServletRequest req, @RequestBody List<PCheckPaths> paths) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        return ResponseEntity.ok().body(
                paths
                        .stream()
                        .filter(pCheckPath -> permissionService.isAuthorized(
                                pCheckPath.path,
                                Optional.ofNullable(pCheckPath.method).orElse(PermissionService.methods.GET).name(),
                                user.getId(),
                                GroupsUtils.getGroups(user)
                        ))
                        .map(PCheckPaths::getPath)
                        .collect(Collectors.toList())
        );
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PCheckPaths {
        private String path;
        private PermissionService.methods method;
    }
}
