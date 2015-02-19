package it.cnr.flows.resource;

import it.cnr.cool.service.StaticService;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.HandlerMapping;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by francesco on 19/02/15.
 */

@Controller
public class StaticResource {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(StaticResource.class);

    private static final String STATIC = "/static/";

    @RequestMapping(value = STATIC + "**", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<String> serveStatic(HttpServletRequest request, HttpServletResponse res) {

        String suffix = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);

        String path = suffix.substring(STATIC.length());

        InputStream input = StaticResource.class.getResourceAsStream("/META-INF/"
                + path);

        if (input != null) {

            LOGGER.debug("resource found: " + path);

            res.setStatus(HttpStatus.OK.value());
            res.setContentType(StaticService.getMimeType(path));
            res.setHeader(StaticService.HTTP_HEADER_CACHE_CONTROL, StaticService.getCacheControl());
            try {
                ServletOutputStream output = res.getOutputStream();
                IOUtils.copy(input, output);
                output.close();
            } catch (IOException e) {
                LOGGER.error("error serving resource: " + path, e);
                return new ResponseEntity<>( "error processing resourde " + path, HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } else {
            LOGGER.warn("resouce not found: " + path);
            return new ResponseEntity<>("not found", HttpStatus.NOT_FOUND);
        }


        return null;
    }

}
