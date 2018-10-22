package it.cnr.si.cool.jconon.rest;

import it.cnr.si.cool.jconon.dto.SiperSede;
import it.cnr.si.cool.jconon.exception.SiperException;
import it.cnr.si.cool.jconon.service.SiperService;
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
import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@Path("sedi")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class Sedi {
	private static final Logger LOGGER = LoggerFactory.getLogger(Sedi.class);

	@Autowired
	private SiperService siperService;

	@GET
	public Response getSedi(@Context HttpServletRequest req, @QueryParam("attive") Boolean attive) {
		Collection<SiperSede> sedi = siperService.cacheableSiperSedi()
                .stream()
                .filter(siperSede -> {
                    if (Optional.ofNullable(attive).filter(aBoolean -> aBoolean.equals(Boolean.TRUE)).isPresent() &&
                            Optional.ofNullable(siperSede.getDataDis()).filter(s -> s.length() > 0).isPresent()) {
                            return Boolean.FALSE;
                    } else {
                        return Boolean.TRUE;
                    }
                })
                .collect(Collectors.toList());
		return Response
				.ok(sedi)
				.build();
	}

	@GET
	@Path("gestori")
	public Response getSede(@Context HttpServletRequest req, @QueryParam("sedeId") String sedeId) {
		Optional<SiperSede> siperSede = siperService.cacheableSiperSede(sedeId);
		return Response
				.ok(siperSede.orElseThrow(() -> new  SiperException("sede " + sedeId + " not found")))
				.build();
	}

}
