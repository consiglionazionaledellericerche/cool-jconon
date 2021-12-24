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

import com.fasterxml.jackson.databind.ObjectMapper;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.si.cool.jconon.dto.SiperSede;
import it.cnr.si.cool.jconon.exception.SiperException;
import it.cnr.si.cool.jconon.service.SiperService;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Path("sedi")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class Sedi {
	private static final Logger LOGGER = LoggerFactory.getLogger(Sedi.class);

	@Autowired(required = false)
	private SiperService siperService;

	@Autowired
	private CMISService cmisService;

	@Value("${siper.static.sedi}")
	private Boolean isStaticSedi;
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
		if (isStaticSedi) {
			try {
				return Response
						.ok(getStaticSedi())
						.build();
			} catch (CmisObjectNotFoundException _ex) {
				LOGGER.warn("sedi.json not found");
			}
		}
		return Response.ok().build();
	}

	@GET
	@Path("gestori")
	public Response getSede(@Context HttpServletRequest req, @QueryParam("sedeId") String sedeId) {
		Optional<SiperSede> siperSede = Optional.empty();
		if (isStaticSedi) {
			siperSede = getStaticSedi()
					.stream()
					.filter(siperSede1 -> siperSede1.getSedeId().equals(sedeId))
					.findAny();
		} else {
			siperSede = Optional.ofNullable(siperService)
					.map(s -> s.cacheableSiperSede(sedeId))
					.orElse(Optional.empty());

		}
		return Response
				.ok(siperSede.orElseThrow(() -> new  SiperException("sede " + sedeId + " not found")))
				.build();
	}

	private List<SiperSede> getStaticSedi() {
		List<SiperSede> siperSedes = new ArrayList<SiperSede>();
		ObjectMapper objectMapper = new ObjectMapper();
		Optional.ofNullable(cmisService
						.createAdminSession()
						.getObjectByPath(SiperService.SEDI_JSON))
				.filter(Document.class::isInstance)
				.map(Document.class::cast)
				.map(Document::getContentStream)
				.map(ContentStream::getStream)
				.ifPresent(inputStream1 -> {
					try {
						siperSedes.addAll(Arrays.asList(objectMapper.readValue(inputStream1, SiperSede[].class)));
					} catch (IOException e) {
						LOGGER.error("Cannot read document of sedi.json",e);
					}
				});
		return siperSedes;
	}
}
