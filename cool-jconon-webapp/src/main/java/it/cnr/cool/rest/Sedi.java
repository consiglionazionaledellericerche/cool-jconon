package it.cnr.cool.rest;

import it.cnr.cool.service.search.SiperService;

import java.net.URISyntaxException;
import java.util.concurrent.ExecutionException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Path("sedi")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class Sedi {
	private static final Logger LOGGER = LoggerFactory.getLogger(Sedi.class);

	@Autowired
	private SiperService siperService;

	@GET
	public Response getSedi(@Context HttpServletRequest req) throws URISyntaxException {

		ResponseBuilder rb;
		try {
			rb = Response.ok(String.valueOf(siperService.getSedi()));
		} catch (ExecutionException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}

	@GET
	@Path("gestori")
	public Response getSede(@Context HttpServletRequest req, @QueryParam("sedeId") String sedeId) throws URISyntaxException {
		ResponseBuilder rb;
		try {
			rb = Response.ok(String.valueOf(siperService.getSede(sedeId)));
		} catch (ExecutionException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}
		return rb.build();
	}

}
