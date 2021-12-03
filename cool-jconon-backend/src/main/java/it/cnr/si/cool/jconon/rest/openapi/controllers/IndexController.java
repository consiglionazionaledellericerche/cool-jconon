package it.cnr.si.cool.jconon.rest.openapi.controllers;

import it.cnr.si.cool.jconon.rest.openapi.utils.SpringI18NError;
import it.cnr.si.cool.jconon.util.Utility;
import org.apache.commons.fileupload.FileUploadBase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.web.servlet.error.AbstractErrorController;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import javax.servlet.http.HttpServletRequest;
import java.util.AbstractMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Controller
public class IndexController extends AbstractErrorController {
    public static final String JAVAX_SERVLET_ERROR_EXCEPTION = "javax.servlet.error.exception";
    private final static String PATH = "/error";
    private static final Logger LOGGER = LoggerFactory.getLogger(IndexController.class);

    public IndexController(ErrorAttributes errorAttributes) {
        super(errorAttributes);
    }

    @RequestMapping(value = PATH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> handleError(HttpServletRequest request) {
        final Map<String, Object> errorAttributes = super.getErrorAttributes(
                request,
                ErrorAttributeOptions
                        .defaults()
                        .including(ErrorAttributeOptions.Include.MESSAGE, ErrorAttributeOptions.Include.EXCEPTION)
        );
        extendsErrorAttributes(
                errorAttributes,
                Optional.ofNullable(request.getAttribute(JAVAX_SERVLET_ERROR_EXCEPTION))
                        .filter(Exception.class::isInstance)
                        .map(Exception.class::cast)
                        .map(e -> e.getCause())
        );
        final Object message = Optional.ofNullable(errorAttributes)
                .flatMap(e -> Optional.ofNullable(e.get("message")))
                .orElse("N/A");
        final Integer status = Optional.ofNullable(errorAttributes)
                .map(s -> s.get("status"))
                .filter(Integer.class::isInstance)
                .map(Integer.class::cast)
                .orElse(HttpStatus.INTERNAL_SERVER_ERROR.ordinal());
        if (status.equals(HttpStatus.INTERNAL_SERVER_ERROR.ordinal())){
            LOGGER.error("ERROR Page Controller Status:{} Message:{}", status, message);
        } else {
            LOGGER.warn("ERROR Page Controller Status:{} Message:{}", status, message);
        }
        return errorAttributes;
    }

    private void extendsErrorAttributes(Map<String, Object> errorAttributes, Optional<Throwable> _ex) {
        final Optional<MaxUploadSizeExceededException> maxUploadSizeExceededException = _ex
                .filter(MaxUploadSizeExceededException.class::isInstance)
                .map(MaxUploadSizeExceededException.class::cast);
        if (maxUploadSizeExceededException.isPresent()) {
            final Optional<FileUploadBase.SizeLimitExceededException> sizeLimitExceededException = maxUploadSizeExceededException
                    .map(ex -> ex.getCause())
                    .filter(FileUploadBase.SizeLimitExceededException.class::isInstance)
                    .map(FileUploadBase.SizeLimitExceededException.class::cast);
            errorAttributes.put(
                    SpringI18NError.I18N,
                    new SpringI18NError(
                            "message.error.maxuploadfilesize",
                            Stream.of(
                                    new AbstractMap.SimpleEntry<>(
                                            "readableFileSize",
                                            Utility.readableFileSize(sizeLimitExceededException.get().getActualSize())
                                    ),
                                    new AbstractMap.SimpleEntry<>(
                                            "maxFileSize",
                                            Utility.readableFileSize(sizeLimitExceededException.get().getPermittedSize()))
                            ).collect(Collectors.toMap((e) -> e.getKey(), (e) -> e.getValue()))
                    )
            );
        }
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }

}