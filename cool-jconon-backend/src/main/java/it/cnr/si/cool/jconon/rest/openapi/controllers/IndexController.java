package it.cnr.si.cool.jconon.rest.openapi.controllers;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
@Controller
public class IndexController implements ErrorController{
    private final static String PATH = "/error";
    @Override
    @RequestMapping(PATH)
    @ResponseBody
    public String getErrorPath() {
        return "No Mapping Found";
    }

}