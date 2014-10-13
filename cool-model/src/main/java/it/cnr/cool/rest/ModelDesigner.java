package it.cnr.cool.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CMISSessionManager;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.service.modelDesigner.ModelDesignerService;
import it.cnr.cool.service.util.AlfrescoDocument;
import it.cnr.cool.service.util.AlfrescoModel;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Path("models")
@Component
@Produces(MediaType.APPLICATION_JSON)
@SecurityChecked
public class ModelDesigner {

	@Autowired
	private ModelDesignerService modelDesignerService;
	@Autowired
	private CMISSessionManager cmisSessionManager;
	@Autowired
	private CMISService cmisService;

	@GET
	public Map<String, Object> getModels(@Context HttpServletRequest req) {
		Map<String, Object> model = new HashMap<String, Object>();

		List<AlfrescoModel> models = modelDesignerService
				.getModels(cmisSessionManager.getCurrentCMISSession(req
						.getSession(false)));
		model.put("models", models);
		return model;
	}

	@POST
	public Map<String, Object> createModel(@Context HttpServletRequest req,
			@FormParam("prefixModel") String prefixModel,
			@FormParam("nameFile") String nameXml) {
		Map<String, Object> model = modelDesignerService.createModel(
				cmisSessionManager.createAdminSession(), prefixModel, nameXml,
				null);
		return model;
	}

	@POST
	@Path("activate/{store_type}/{store_id}/{id}/{version}")
	public Map<String, Object> activateModel(@Context HttpServletRequest req,
			@PathParam("store_type") String store_type,
			@PathParam("store_id") String store_id, @PathParam("id") String id,
			@PathParam("version") String version,
			@QueryParam("activate") boolean activate) {
		Map<String, Object> model = modelDesignerService.activateModel(
				cmisSessionManager.createAdminSession(), store_type + "://"
						+ store_id + "/" + id + ";" + version, activate,
				cmisService.getCurrentBindingSession(req));
		return model;
	}

	@PUT
	@Path("{store_type}/{store_id}/{id}/{version}")
	public Map<String, Object> updateMoldel(@Context HttpServletRequest req,
			@FormParam("xml") String xml,
			@FormParam("nameFile") String nameXml,
			@FormParam("nameTemplate") String nameTemplate,
			@FormParam("generateTemplate") boolean generateTemplate,
			@PathParam("store_type") String store_type,
			@PathParam("store_id") String store_id, @PathParam("id") String id,
			@PathParam("version") String version) {
		Map<String, Object> model = modelDesignerService.updateModel(
				cmisSessionManager.createAdminSession(), xml, nameXml,
				store_type + "://" + store_id + "/" + id + ";" + version,
				generateTemplate, nameTemplate);
		return model;
	}

	@DELETE
	@Path("{store_type}/{store_id}/{id}")
	public Map<String, Object> deleteModel(@Context HttpServletRequest req,
			@PathParam("store_type") String store_type,
			@PathParam("store_id") String store_id, @PathParam("id") String id) {
		Map<String, Object> model = modelDesignerService.deleteModel(
				cmisSessionManager.createAdminSession(), store_type + "://"
						+ store_id + "/" + id,
				cmisService.getCurrentBindingSession(req));
		return model;
	}

	@DELETE
	@Path("property/{store_type}/{store_id}/{id}")
	public Map<String, Object> deleteProperty(@Context HttpServletRequest req,
			@PathParam("store_type") String store_type,
			@PathParam("store_id") String store_id, @PathParam("id") String id,
			@QueryParam("property") String property,
			@QueryParam("typeName") String typeName) {
		Map<String, Object> model = modelDesignerService.deleteProperty(
				cmisSessionManager.createAdminSession(), store_type + "://"
						+ store_id + "/" + id, typeName, property);
		return model;
	}

	// restituisce i documenti associati al model associato al nodeRef
	@GET
	@Path("docsByPath/{store_type}/{store_id}/{id}")
	public Map<String, Object> getDocsByPath(@Context HttpServletRequest req,
			@PathParam("store_type") String store_type,
			@PathParam("store_id") String store_id, @PathParam("id") String id) {
		Map<String, Object> model = new HashMap<String, Object>();

		List<AlfrescoDocument> alfrescoDocs = modelDesignerService
				.getDocsByPath(cmisSessionManager.getCurrentCMISSession(req
						.getSession(false)), store_type + "://" + store_id
						+ "/" + id);
		model.put("docs", alfrescoDocs);
		return model;
	}

	// restituisce i documenti del tipo specificato nel TypeName
	@GET
	@Path("docsByTypeName")
	public Map<String, Object> getDocsByTypeName(
			@Context HttpServletRequest req,
			@QueryParam("typeName") String tipeName) {
		Map<String, Object> model = new HashMap<String, Object>();

		List<AlfrescoDocument> alfrescoDocs = modelDesignerService
				.getDocsByTypeName(cmisSessionManager.getCurrentCMISSession(req
						.getSession(false)), tipeName);
		model.put("docs", alfrescoDocs);
		return model;
	}
}