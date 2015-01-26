package it.cnr.flows.rest;


import org.apache.chemistry.opencmis.commons.exceptions.CmisUnauthorizedException;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class UnauthorizedMapper implements
        ExceptionMapper<CmisUnauthorizedException> {
     public Response toResponse(CmisUnauthorizedException ex) {
         return Response.status(javax.ws.rs.core.Response.Status.UNAUTHORIZED).
             entity(ex.getMessage()).
             type("text/plain").
             build();
     }
 }