package it.cnr.flows.resource;

import it.cnr.bulkinfo.exception.BulkInfoException;
import it.cnr.bulkinfo.exception.BulkinfoKindException;
import it.cnr.bulkinfo.exception.BulkinfoNameException;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.BulkInfoCoolSerializer;
import it.cnr.cool.service.BulkInfoCoolService;
import org.apache.chemistry.opencmis.client.api.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by francesco on 17/02/15.
 */

@Controller
public class BulkinfoResource {


    private static final Logger LOGGER = LoggerFactory.getLogger(BulkinfoResource.class);

    @Autowired
    private BulkInfoCoolService bulkInfoCoolService;
    @Autowired
    private BulkInfoCoolSerializer bulkInfoCoolSerializer;
    @Autowired
    private CMISService cmisService;



    @RequestMapping(value = "/bulkInfo/view/{type}/{kind}/{name}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> getView(HttpServletRequest req,
                            @PathVariable("type") String type,
                            @PathVariable("kind") String kind,
                            @PathVariable("name") String name,
                            @RequestParam(value="cmis:objectId", required=false) String objectId) throws BulkinfoKindException, BulkInfoException, BulkinfoNameException {


        Session session = cmisService.getCurrentCMISSession(req);

        Map<String, Object> model = bulkInfoCoolService
                    .getView(session, type, kind, name, objectId);

        String json = bulkInfoCoolSerializer.serialize(model).toString();

        if(objectId == null || objectId.isEmpty()) {
            LOGGER.error("cache control!!");
            ///builder.cacheControl(Util.getCache(1800));
        }

        return new ResponseEntity<String>(json, HttpStatus.OK);

    }

}
