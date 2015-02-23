package it.cnr.flows.resource;

import freemarker.core.Environment;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.QueryService;
import it.cnr.cool.util.CalendarUtil;
import it.cnr.mock.ISO8601DateFormatMethod;
import it.cnr.mock.JSONUtils;
import org.apache.chemistry.opencmis.client.api.Session;
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
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Locale;
import java.util.Map;

/**
 * Created by francesco on 17/02/15.
 */

@Controller
public class SearchResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(SearchResource.class);

    @Autowired
    private QueryService queryService;

    @Autowired
    private CMISService cmisService;

    private static final String FTL_JSON_PATH = "/surf/webscripts/search/query.lib.ftl";

    @RequestMapping(value = "/search", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> search(HttpServletRequest request, HttpServletResponse res) throws IOException, TemplateException {

        Map<String, Object> model = null;

        try {
            Session session = cmisService.getCurrentCMISSession(request);
            model = queryService.query(request, session);
        } catch(CmisUnauthorizedException e) {
            return new ResponseEntity<String>("unauthorized search", HttpStatus.FORBIDDEN);
        }

        model.put("xmldate", new ISO8601DateFormatMethod());
        model.put("jsonUtils", new JSONUtils());
        model.put("calendarUtil", new CalendarUtil());

        Template t = getFtlTemplate();
        String json =  processTemplate(model, t);

        return new ResponseEntity<String>(json, HttpStatus.OK);

    }


    private static String processTemplate(Map<String, Object> model, Template t)
            throws TemplateException, IOException {
        StringWriter sw = new StringWriter();
        Environment env = t.createProcessingEnvironment(model, sw);

        // set the locale to ensure dates etc. are appropriate localised
        env.setLocale(Locale.ITALY);
        env.process();
        return sw.toString();
    }


    private static Template getFtlTemplate()
            throws IOException {

        InputStream is = SearchResource.class.getResourceAsStream(FTL_JSON_PATH);
        Configuration config = getConfig();
        Reader reader = new InputStreamReader( is );
        return new Template(FTL_JSON_PATH, reader, config);
    }



    private static Configuration getConfig() {
        // construct template config
        Configuration config = new Configuration();
        //config.setCacheStorage(new MruCacheStorage(cacheSize, cacheSize << 1));
        config.setTemplateUpdateDelay(0);
        config.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        config.setLocalizedLookup(true);
        config.setOutputEncoding("UTF-8");

        return config;
    }





}
