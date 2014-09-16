package it.cnr.cool.web.scripts;

import it.cnr.cool.cmis.model.PolicyType;
import it.cnr.cool.cmis.service.FolderService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.cool.web.scripts.exception.ValidationException;

import java.text.ParseException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.alfresco.cmis.client.AlfrescoFolder;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.UnfileObject;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class ManageFolderWebScript extends CMISWebScript {
    private static final Logger LOGGER = LoggerFactory.getLogger(ManageFolderWebScript.class);

	@Autowired
	protected FolderService cmisFolderService;

	@Autowired
	protected NodeMetadataService nodeMetadataService;

	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req,
			Status status, Cache cache) {
		Map<String, Object> model = super.executeImpl(req, status, cache);
		Session cmisSession = getCMISSession();
		model.put("objectTypeId", req.getParameter("objectTypeId"));
		executePreMethod(req, status, cache, model, cmisSession);
		if (isPOST()){
			executePost(req, status, cache, model, cmisSession);
		}else if (isDELETE()) {
			executeDelete(req, status, cache, model, cmisSession);
		}else if (isGET()) {
			executeGet(req, status, cache, model, cmisSession);
		}
		executeAfterMethod(req, status, cache, model, cmisSession);
		return model;
	}

	protected Folder getParentFolder(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> properties, Session cmisSession){
		String path = (String) properties.get(PropertyIds.PATH);

		String parentId = (String) properties.get(PropertyIds.PARENT_ID);

		Folder folder = null;

		if (path != null && path.length() != 0) {
			folder = (Folder) cmisSession.getObjectByPath(path);
		} else if (parentId != null && parentId.length() != 0) {
			folder = (Folder) cmisSession.getObject(parentId);
		}

		return folder;
	}

	protected void executeBeforePost(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession, String objectId, Map<String, Object> properties, Map<String, Object> aspectProperties) throws ValidationException{
		completeProperties(req, status, cache, model, cmisSession, objectId, properties, aspectProperties);
		validateProperties(req, status, cache, model, cmisSession, objectId, properties, aspectProperties);
	}

	protected void completeProperties(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession, String objectId, Map<String, Object> properties, Map<String, Object> aspectProperties) {
		String name = (String) properties.get(PropertyIds.NAME);
		if (name != null){
			properties.put(PropertyIds.NAME, folderService.integrityChecker(name));
		}
	}

	protected void validateProperties(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession, String objectId, Map<String, Object> properties, Map<String, Object> aspectProperties) throws ValidationException{
	}

	protected void executePost(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession){
		try {
			Boolean created = Boolean.FALSE;
			HttpServletRequest request = ServletUtil.getRequest();
			Map<String, Object> properties = nodeMetadataService
					.populateMetadataTypeFromRequest(cmisSession, request);
			Map<String, Object> aspectProperties = nodeMetadataService
					.populateMetadataAspectFromRequest(cmisSession, request);
			String objectId = (String) properties.get(PropertyIds.OBJECT_ID);
			executeBeforePost(req, status, cache, model, cmisSession, objectId, properties, aspectProperties);
			Folder folder = null;
			OperationContext oc = new OperationContextImpl(cmisSession.getDefaultContext());
			Set<String> propertyFilter = new HashSet<String>();
			propertyFilter.add(PropertyIds.OBJECT_ID);
			propertyFilter.add(PropertyIds.NAME);
			oc.setFilter(propertyFilter);
			if (objectId != null){
				folder = (Folder) cmisSession.getObject(
						cmisSession.createObjectId(objectId), oc);
				folder.updateProperties(properties);
			} else {
				created = Boolean.TRUE;
				try{
					folder = (Folder) cmisSession.getObject(cmisSession.createFolder(properties,
							getParentFolder(req, status, cache, properties, cmisSession), null, null, null));
				} catch (CmisContentAlreadyExistsException _ex){
					throw ClientMessageException.FILE_ALREDY_EXISTS;
				}
			}
			if (ServletUtil.getRequest().getParameterValues(PolicyType.ADD_REMOVE_ASPECT_REQ_PARAMETER_NAME)!=null){
				String [] aspects = ServletUtil.getRequest().getParameterValues(PolicyType.ADD_REMOVE_ASPECT_REQ_PARAMETER_NAME);
				List<String> aspectNames = PolicyType.getAspectToBeAdd(aspects);
				if (aspectNames != null && !aspectNames.isEmpty()){
					((AlfrescoFolder)folder).addAspect(aspectNames.toArray(new String[aspectNames.size()]));
				}
				aspectNames = PolicyType.getAspectToBeRemoved(aspects);
				if (aspectNames != null && !aspectNames.isEmpty())
					((AlfrescoFolder)folder).removeAspect(aspectNames.toArray(new String[aspectNames.size()]));

			}
			if (ServletUtil.getRequest().getParameterValues(PolicyType.ASPECT_REQ_PARAMETER_NAME)!=null){
				List<String> aspectNames = Arrays.asList(ServletUtil.getRequest().getParameterValues(PolicyType.ASPECT_REQ_PARAMETER_NAME));
				if (aspectNames != null && !aspectNames.isEmpty())
					((AlfrescoFolder)folder).addAspect(aspectNames.toArray(new String[aspectNames.size()]));
				aspectProperties.put(PropertyIds.NAME, folder.getName());
			}
			folder.updateProperties(aspectProperties);
			model.put("folder", folder);
			if(LOGGER.isDebugEnabled())
				LOGGER.debug("Folder created:"+properties.get(PropertyIds.NAME));
			executeAfterPost(req, status, cache, model, cmisSession, created, folder);
		} catch (ValidationException e) {
			model.put("message_error", e.getStatus().getMessage());
		} catch (ParseException e) {
			throw new WebScriptException("Error parsing request",e);
		}
	}

	protected void executeAfterPost(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession, Boolean created, Folder folder) throws ValidationException{
	}

	protected void executeBeforeDelete(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession, Folder folder){
	}

	protected void executeDelete(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession){
		String objectId = ServletUtil.getRequest().getParameter(PropertyIds.OBJECT_ID);
		Folder folder = (Folder) cmisSession.getObject(cmisSession.createObjectId(objectId));
		executeBeforeDelete(req, status, cache, model, cmisSession, folder);
		if(LOGGER.isDebugEnabled())
			LOGGER.debug("Delete Folder "+objectId);
		folder.deleteTree(true, UnfileObject.DELETE, false);
		executeAfterDelete(req, status, cache, model, cmisSession, folder);
	}

	protected void executeAfterDelete(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession, Folder folder){
	}

	protected void executeBeforeGet(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession){
	}

	protected void executeGet(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession){
		executeBeforeGet(req, status, cache, model, cmisSession);
		model.put("folder", null);
		String objectId = ServletUtil.getRequest().getParameter(PropertyIds.OBJECT_ID);
		if (objectId != null && objectId.length() != 0){
			CmisObject folder = cmisSession.getObject(cmisSession.createObjectId(objectId));
			model.put("folder", folder);
		}
		executeAfterGet(req, status, cache, model, cmisSession);
	}

	protected void executeAfterGet(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession){
	}

	protected void executePreMethod(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession){
	}

	protected void executeAfterMethod(WebScriptRequest req,
			Status status, Cache cache, Map<String, Object> model, Session cmisSession){
	}
}
