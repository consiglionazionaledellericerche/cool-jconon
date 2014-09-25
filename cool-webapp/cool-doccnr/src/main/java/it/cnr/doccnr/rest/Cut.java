package it.cnr.doccnr.rest;

import it.cnr.doccnr.service.cut.CutService;

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

@Path("cut")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class Cut {

	@Autowired
	private CutService cutService;

	@POST
	public Response cut(@Context HttpServletRequest req,
			@FormParam("nodeRefToCopy") String nodeRefToCopy,
			@FormParam("nodeRefDest") String nodeRefDest) {

		return Response.ok(cutService.cut(nodeRefToCopy, nodeRefDest)).build();
	}
}