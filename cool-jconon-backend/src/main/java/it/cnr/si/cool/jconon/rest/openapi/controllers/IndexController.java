package it.cnr.si.cool.jconon.rest.openapi.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Controller
public class IndexController implements ErrorController {
    private final static String PATH = "/error";
    private static final Logger LOGGER = LoggerFactory.getLogger(IndexController.class);

    @RequestMapping(PATH)
    @ResponseBody
    public String handleError(HttpServletRequest request) {
        Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
        Exception exception = (Exception) request.getAttribute("javax.servlet.error.exception");
        String format = String.format("<html><body><h1>Error Page</h1><div>Status code: <b>%s</b></div>"
                        + "<div>Exception Message: <b>%s</b></div><body></html>",
                statusCode, exception == null ? "N/A" : exception.getMessage());
        LOGGER.error(
                "ERROR Page Controller Status:{} Message:{}",
                statusCode,
                Optional.ofNullable(exception)
                    .flatMap(e -> Optional.ofNullable(e.getMessage()))
                    .orElse("N/A")
        );
        return format;
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }

}