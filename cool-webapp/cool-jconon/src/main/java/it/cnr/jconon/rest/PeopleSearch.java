package it.cnr.jconon.rest;

import freemarker.template.TemplateException;
import it.cnr.cool.rest.Search;
import it.cnr.jconon.service.PeopleQueryService;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.webscripts.Status;
import org.springframework.stereotype.Component;

@Path("search/people")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class PeopleSearch {

	@Autowired
	private PeopleQueryService queryService;

	private static final Logger LOGGER = LoggerFactory.getLogger(PeopleSearch.class);

	@GET
	public Response query(@Context HttpServletRequest request) {

		ResponseBuilder rb;

		Map<String, Object> model = queryService.query(request);
		try {
			String json = Search.getJson(model);
			rb = Response.ok(json);
		} catch (TemplateException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.STATUS_INTERNAL_SERVER_ERROR);
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.STATUS_INTERNAL_SERVER_ERROR);
		}

		return rb.build();

	}


}
