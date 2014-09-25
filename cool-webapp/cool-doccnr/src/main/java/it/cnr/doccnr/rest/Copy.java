package it.cnr.doccnr.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.doccnr.service.copy.CopyService;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Path("copy")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class Copy {

	@Autowired
	private CopyService copyService;
	@Autowired
	private CMISService cmisService;
	@Autowired
	@Qualifier("cmisAclOperationContext")
	private OperationContext cmisAclOperationContext;

	@POST
	public Response copy(@Context HttpServletRequest req,
			@FormParam("nodeRefToCopy") String nodeRefToCopy,
			@FormParam("nodeRefDest") String nodeRefDest,
			@FormParam("newName") String newName) {

		Map<String, Object> model = new HashMap<String, Object>();
		Session adminSession = cmisService.createAdminSession();

		Folder destFolder = (Folder) adminSession.getObject(nodeRefDest,
				cmisAclOperationContext);
		CmisObject toCopy = adminSession.getObject(nodeRefToCopy,
				cmisAclOperationContext);

		if (toCopy instanceof Folder) {
			model = copyService
					.copyFolder(destFolder, (Folder) toCopy, newName);
		} else if (toCopy instanceof Document) {
			model = copyService.copyDocument(destFolder, (Document) toCopy,
					newName);
		}
		return Response.ok(model).build();
	}
}