package it.cnr.doccnr.rest;

import it.cnr.doccnr.service.move.MoveService;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Path("move")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class Move {

	@Autowired
	private MoveService moveService;

	@POST
	public Response move(@Context HttpServletRequest req,
			@FormParam("nodeRefToCopy") String nodeRefToCopy,
			@FormParam("nodeRefDest") String nodeRefDest) {

		return Response.ok(moveService.move(nodeRefToCopy, nodeRefDest))
				.build();
	}
}