package it.cnr.flows.resource;

import it.cnr.flows.exception.DropException;
import it.cnr.flows.service.DropService;
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
import java.io.InputStream;
import java.util.Map;

/**
 * Created by francesco on 17/02/15.
 */
@Controller
public class DropResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(DropResource.class);

    @Autowired
    private DropService dropService;

    @RequestMapping(value = "/drop", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> post(

            @RequestParam("type") String type,
            @RequestParam("id") String id,
            @RequestParam("username") String username,
            @RequestParam(value = "document-id", required = false) String documentId,
            @RequestParam("file") MultipartFile file,
                         HttpServletRequest request) throws IOException, DropException {

        InputStream uploadedInputStream = file.getInputStream();

        String mimetype = file.getContentType();
        String fileName = file.getOriginalFilename();

        LOGGER.debug("drop file {} with mimetype", fileName, mimetype);

        Map<String, String> m = dropService.dropFile(type, id, username, documentId, uploadedInputStream, mimetype, fileName, request);

        return new ResponseEntity<Object>(m, HttpStatus.OK);

    }


}
