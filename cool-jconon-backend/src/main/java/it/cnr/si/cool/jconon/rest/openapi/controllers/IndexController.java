package it.cnr.si.cool.jconon.rest.openapi.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.web.servlet.error.AbstractErrorController;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Optional;

@Controller
public class IndexController extends AbstractErrorController {
    private final static String PATH = "/error";
    private static final Logger LOGGER = LoggerFactory.getLogger(IndexController.class);

    public IndexController(ErrorAttributes errorAttributes) {
        super(errorAttributes);
    }

    @RequestMapping(value = PATH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> handleError(HttpServletRequest request) {
        final Map<String, Object> errorAttributes = super.getErrorAttributes(request, false);
        LOGGER.error(
                "ERROR Page Controller Status:{} Message:{}",
                Optional.ofNullable(errorAttributes)
                    .map(s -> s.get("status"))
                    .orElse("N/A"),
                Optional.ofNullable(errorAttributes)
                        .flatMap(e -> Optional.ofNullable(e.get("message")))
                        .orElse("N/A")
        );
        return errorAttributes;
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }

}