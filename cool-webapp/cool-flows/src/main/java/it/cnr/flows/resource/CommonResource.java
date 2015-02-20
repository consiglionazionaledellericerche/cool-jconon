package it.cnr.flows.resource;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.VersionService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.workflow.WorkflowService;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by francesco on 17/02/15.
 */

@Controller
public class CommonResource {

    @Autowired
    private CMISService cmisService;

    @Autowired
    private WorkflowService workflowService;

    private static final Logger LOGGER = LoggerFactory
            .getLogger(CommonResource.class);


    @RequestMapping(value = "/common", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> get(HttpServletRequest req) {

        Map<String, Serializable> model = new HashMap<>();

        CMISUser user = cmisService.getCMISUserFromSession(req);
        BindingSession bindingSession = cmisService
                .getCurrentBindingSession(req);
        String workflowDefinitions = workflowService.get(user, bindingSession);

        try {
            Serializable v = new ObjectMapper().readValue(workflowDefinitions, ArrayList.class);
            model.put("workflowDefinitions", v);
        } catch (Exception e) {
            LOGGER.error("error processing workflow definiton for user: " + user.getId(), e);
        }

        model.put("User", user);

        return new ResponseEntity<Object>(model, HttpStatus.OK);

    }


}
