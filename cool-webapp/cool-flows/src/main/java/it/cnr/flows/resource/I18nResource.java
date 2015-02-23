package it.cnr.flows.resource;

import it.cnr.cool.service.I18nService;
import it.cnr.flows.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Locale;
import java.util.Properties;

/**
 * Created by francesco on 17/02/15.
 */

@Controller
public class I18nResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(I18nResource.class);

    @Autowired
    private I18nService i18nService;


    @RequestMapping(value = "/i18n", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Properties> foo(HttpServletRequest request) {


        LOGGER.error("__lang da cookie!");

        Locale locale = I18nService.getLocale(request, null);

        Properties labels = i18nService.getLabels(locale, null);
        labels.put("locale", locale.getLanguage());
        LOGGER.info("loaded " + labels.keySet().size() + " "
                + locale.getLanguage() + " labels ");

        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl(Utils.cacheHeaderPublic(24));

        return new ResponseEntity<>(labels, headers, HttpStatus.OK);


    }

}
