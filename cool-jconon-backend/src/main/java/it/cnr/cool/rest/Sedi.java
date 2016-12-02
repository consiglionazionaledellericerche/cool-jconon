package it.cnr.cool.rest;

import it.cnr.cool.service.search.SiperSede;
import it.cnr.cool.service.search.SiperService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Optional;

@Path("sedi")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class Sedi {
	private static final Logger LOGGER = LoggerFactory.getLogger(Sedi.class);

	@Autowired
	private SiperService siperService;

	@GET
	public Response getSedi(@Context HttpServletRequest req) throws URISyntaxException {
		Collection<SiperSede> sedi = siperService.cacheableSiperSedi();
		return Response
				.ok(sedi)
				.build();
	}

	@GET
	@Path("gestori")
	public Response getSede(@Context HttpServletRequest req, @QueryParam("sedeId") String sedeId) throws URISyntaxException {
		Optional<SiperSede> entity = siperService.cacheableSiperSede(sedeId);
		return Response
				.ok(entity.orElseThrow(() -> new RuntimeException("sede " + sedeId + " not found")))
				.build();
	}

}
