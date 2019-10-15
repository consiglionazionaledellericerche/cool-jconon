/*
 * Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *
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

package it.cnr.si.cool.jconon.mock;

import it.cnr.si.cool.jconon.dto.SiperSede;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Path("")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class MockRest {

    public static final String PINCO_PALLINO = "pinco.pallino";

    @GET
    @Path("siper/json/sedi")
    public Response getSedi(@Context HttpServletRequest req) throws IOException {
        return Response.ok(
                Collections.singletonList(new SiperSede("BIAG00", "INDIRIZZO"))
        ).build();
    }

    @GET
    @Path("siper/json/userinfo/{username}")
    public Response getAnadip(@Context HttpServletRequest req, @PathParam("username") String username) throws IOException {
        if (!username.equals(PINCO_PALLINO))
            return Response.ok(Collections.emptyMap()).build();
        return Response.ok(
                Stream.of(new String[][]{
                        {"uid", PINCO_PALLINO},
                        {"sigla_sede", "AccountDiServizio"},
                }).collect(Collectors.toMap(data -> data[0], data -> data[1]))
        ).build();
    }

    @GET
    @Path("ucat/HDConcorsi")
    public Response getCategorie(@Context HttpServletRequest req) throws IOException {
        return Response.ok().build();
    }

    @GET
    @Path("catg/HDConcorsi")
    public Response getCategoria(@Context HttpServletRequest req) throws IOException {
        return Response.ok().build();
    }

    @PUT
    @Path("catg/HDConcorsi")
    public Response putCategoria(@Context HttpServletRequest req) throws IOException {
        return Response.ok(-1).build();
    }

    @GET
    @Path("ucat/HDConcorsi/{idCategoria}")
    public Response getEsperti(@Context HttpServletRequest req, @PathParam("idCategoria") String idCategoria) throws IOException {
        return Response.ok().build();
    }
}
