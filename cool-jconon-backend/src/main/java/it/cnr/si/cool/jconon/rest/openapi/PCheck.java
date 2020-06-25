package it.cnr.si.cool.jconon.rest.openapi;

import com.google.common.collect.Lists;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.GroupsUtils;
import it.cnr.cool.web.PermissionService;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
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
    public ResponseEntity<Boolean> pcheck(HttpServletRequest req, @RequestParam(value = "path", required = false) String path) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        return ResponseEntity.ok().body(
                permissionService.isAuthorized(path, PermissionService.methods.GET.name(), user.getId(), GroupsUtils.getGroups(user))
        );
    }

    @PostMapping
    public ResponseEntity<List<String>> pcheckPath(HttpServletRequest req, @RequestBody PCheckPaths paths) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        return ResponseEntity.ok().body(
                paths.paths
                        .stream()
                        .filter(path -> permissionService.isAuthorized(path, PermissionService.methods.GET.name(), user.getId(), GroupsUtils.getGroups(user)))
                        .collect(Collectors.toList())
        );
    }

    public static class PCheckPaths {
        public List<String> paths = Lists.newArrayList();
    }
}
