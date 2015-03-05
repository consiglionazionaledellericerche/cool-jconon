package it.cnr.flows.resource;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.flows.exception.DropException;
import it.cnr.flows.service.DropService;
import it.cnr.flows.utils.Utils;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.exceptions.CmisUnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

/**
 * Created by francesco on 17/02/15.
 */
@Controller
public class DropResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(DropResource.class);

    @Autowired
    private DropService dropService;

    @Autowired
    private CMISService cmisService;

    @RequestMapping(value = "/drop", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> post(

            @RequestParam("type") String type,
            @RequestParam("id") String id,
            @RequestParam("username") String username,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request)  {

        Map<String, String> m = null;
        try {

            Session cmisSession = cmisService.getCurrentCMISSession(request);
            BindingSession bindingSession = cmisService.getCurrentBindingSession(request);

            String path = "temp_" + username + "_" + id;

            m = dropService.createDocument(type, path, file.getInputStream(), file.getContentType(), file.getOriginalFilename(), cmisSession, bindingSession);
            return new ResponseEntity<Object>(m, HttpStatus.OK);
        } catch (DropException e) {
            LOGGER.error("drop error", e);
            return new ResponseEntity<Object>(Utils.getAsMap("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IOException e) {
            LOGGER.error("exception with file " + file.getOriginalFilename(), e);
            return new ResponseEntity<Object>(Utils.getAsMap("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @RequestMapping(value = "/drop-update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> update(

            @RequestParam("document-id") String documentId,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request)  {

        Map<String, String> m = null;
        try {

            Session cmisSession = cmisService.getCurrentCMISSession(request);

            m  = dropService.updateDocument(documentId, file.getInputStream(), file.getContentType(), file.getOriginalFilename(), cmisSession);

            return new ResponseEntity<Object>(m, HttpStatus.OK);
        } catch(CmisUnauthorizedException e) {
            return new ResponseEntity<Object>(Utils.getAsMap("error", e.getMessage()), HttpStatus.UNAUTHORIZED);
        } catch (DropException e) {
            LOGGER.error("drop error", e);
            return new ResponseEntity<Object>(Utils.getAsMap("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IOException e) {
            LOGGER.error("exception with file " + file.getOriginalFilename(), e);
            return new ResponseEntity<Object>(Utils.getAsMap("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }




}
