/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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

	@Autowired(required = false)
	private SiperService siperService;

	@GET
	public Response getSedi(@Context HttpServletRequest req, @QueryParam("attive") Boolean attive) {
		if (Optional.ofNullable(siperService).isPresent()) {
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
		return Response.ok().build();
	}

	@GET
	@Path("gestori")
	public Response getSede(@Context HttpServletRequest req, @QueryParam("sedeId") String sedeId) {
		Optional<SiperSede> siperSede = Optional.ofNullable(siperService).map(s -> s.cacheableSiperSede(sedeId)).orElse(Optional.empty());
		return Response
				.ok(siperSede.orElseThrow(() -> new  SiperException("sede " + sedeId + " not found")))
				.build();
	}

}
