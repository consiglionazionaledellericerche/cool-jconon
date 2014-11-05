package it.cnr.flows.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import java.util.HashMap;
import java.util.Map;


public class AppExceptionMapper implements ExceptionMapper<WebApplicationException> {

    private static final Logger LOGGER = LoggerFactory.getLogger(AppExceptionMapper.class);

  public Response toResponse(WebApplicationException ex) {

      LOGGER.error("web exception", ex);

      Map<String, String> hm = new HashMap();
      hm.put("error", ex.getMessage());

    return Response.status(ex.getResponse().getStatus())
        .entity(hm)
        .type(MediaType.APPLICATION_JSON).
        build();
  }

}