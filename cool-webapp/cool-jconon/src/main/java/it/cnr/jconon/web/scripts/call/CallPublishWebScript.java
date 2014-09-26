package it.cnr.jconon.web.scripts.call;


import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.cool.web.scripts.exception.ValidationException;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.service.call.CallService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.alfresco.cmis.client.AlfrescoFolder;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.surf.util.URLEncoder;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Format;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class CallPublishWebScript extends CallWebScript {
	private static String GROUP_COMMISSIONI_CONCORSO = "COMMISSIONI_CONCORSO",
			GROUP_CONCORSI = "GROUP_CONCORSI",
			GROUP_EVERYONE = "GROUP_EVERYONE";
	@Autowired
	private CMISService cmisService;

	@Autowired
	private CallService callService;

	@Autowired
	private ACLService aclService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CallPublishWebScript.class);

	@Override
	protected void executeBeforePost(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model, Session cmisSession,
			String objectId, Map<String, Object> properties, Map<String, Object> aspectProperties) throws ValidationException{
		if (ServletUtil.getRequest().getParameter("skip:save") == null)
			super.executeBeforePost(req, status, cache, model, cmisSession, objectId,
				properties, aspectProperties);
	}
	@Override
	protected void executeAfterPost(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model, Session cmisSession,
			Boolean created, Folder folder) throws ValidationException {
		if (ServletUtil.getRequest().getParameter("skip:save") == null)
			super.executeAfterPost(req, status, cache, model, cmisSession, created, folder);
		AlfrescoFolder alfrescoFolder = (AlfrescoFolder)folder;
		if (!alfrescoFolder.hasAspect(JCONONPolicyType.JCONON_MACRO_CALL.value()))
			alfrescoFolder.addAspect(JCONONPolicyType.JCONON_CALL_SUBMIT_APPLICATION.value());
		else {
			alfrescoFolder.removeAspect(JCONONPolicyType.JCONON_CALL_SUBMIT_APPLICATION.value());
		}
		Map<String, ACLType> aces = new HashMap<String, ACLType>();
		aces.put(GROUP_CONCORSI, ACLType.Coordinator);
		aces.put(GROUP_EVERYONE, ACLType.Consumer);

		if(JCONONPolicyType.isIncomplete(alfrescoFolder))
			throw new ClientMessageException("message.error.call.incomplete");

		if (alfrescoFolder.getType().getId().equalsIgnoreCase(JCONONFolderType.JCONON_CALL_MOBILITY.value()) ||
				alfrescoFolder.getType().getId().equalsIgnoreCase(JCONONFolderType.JCONON_CALL_MOBILITY_OPEN.value())){
			if (!isCallAttachmentPresent(cmisSession, alfrescoFolder, JCONONDocumentType.JCONON_ATTACHMENT_CALL_MOBILITY))
				throw new ClientMessageException("message.error.call.mobility.incomplete.attachment");
		}else {
			if (!isCallAttachmentPresent(cmisSession, alfrescoFolder, JCONONDocumentType.JCONON_ATTACHMENT_CALL_IT))
				throw new ClientMessageException("message.error.call.incomplete.attachment");
		}

		Boolean publish = Boolean.valueOf(ServletUtil.getRequest().getParameter("publish"));
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(JCONONPropertyIds.CALL_PUBBLICATO.value(), publish);
		HttpServletRequest request = ServletUtil.getRequest();
		if (publish) {
			aclService.addAcl(cmisService.getCurrentBindingSession(request), alfrescoFolder.getId(), aces);
		}else {
			aclService.removeAcl(cmisService.getCurrentBindingSession(request), alfrescoFolder.getId(), aces);
		}
		model.put("published", publish);
		alfrescoFolder.updateProperties(properties, true);
		//Creazione del gruppo per la commissione di Concorso
		String groupName = callService.getCallGroupName(alfrescoFolder);
		try {
			String link = cmisService.getBaseURL().concat("service/api/groups/").
					concat(GROUP_COMMISSIONI_CONCORSO).
					concat("/children/").
					concat(URLEncoder.encodeUriComponent(groupName));
			UrlBuilder url = new UrlBuilder(link);
			CmisBindingsHelper.getHttpInvoker(cmisService.getAdminSession()).invokePOST(url, Format.JSON.mimetype(),
				new Output() {
					@Override
					public void write(OutputStream out) throws Exception {
					}
				}, cmisService.getAdminSession());
			String nodeRef = getNodeRefOfGroup(groupName);
			/**
			 * Il Gruppo della Commissione deve avere il ruolo di contributor sul bando
			 */
			addContibutorCommission(groupName, folder.getId());
			Map<String, ACLType> acesGroup = new HashMap<String, ACLType>();
			acesGroup.put(ThreadLocalRequestContext.getRequestContext().getUserId(), ACLType.FullControl);
			acesGroup.put(GROUP_CONCORSI, ACLType.FullControl);
			aclService.addAcl(cmisService.getAdminSession(), nodeRef, acesGroup);
		} catch (Exception e) {
			LOGGER.error("ACL error", e);
		}
	}

	private void addContibutorCommission(String groupName, String nodeRefCall) {
		Map<String, ACLType> acesGroup = new HashMap<String, ACLType>();
		acesGroup.put(groupName, ACLType.Contributor);
		aclService.addAcl(cmisService.getAdminSession(), nodeRefCall, acesGroup);
	}

	private String getNodeRefOfGroup(String fullGroupName) {
		String link = cmisService.getBaseURL().concat("service/cnr/groups/autocomplete-group?filter=").
				concat(URLEncoder.encodeUriComponent(fullGroupName));
		UrlBuilder url = new UrlBuilder(link);
		Response resp = CmisBindingsHelper.getHttpInvoker(cmisService.getAdminSession()).invokeGET(url, cmisService.getAdminSession());
		int status = resp.getResponseCode();
		if (status == HttpStatus.SC_NOT_FOUND
				|| status == HttpStatus.SC_BAD_REQUEST
				|| status == HttpStatus.SC_INTERNAL_SERVER_ERROR) {
			return null;
		}
		try {
			JSONObject jsonObj = new JSONObject(IOUtils.toString(resp.getStream()));
			return ((JSONObject)jsonObj.getJSONArray("groups").get(0)).getString("nodeRef");
		} catch (JSONException e) {
			LOGGER.error("Cannot convert json object", e);
		} catch (IOException e) {
			LOGGER.error("Cannot convert json object", e);
		}
		return null;
	}

	private boolean isCallAttachmentPresent(Session cmisSession, Folder source, JCONONDocumentType documentType){
		Criteria criteria = CriteriaFactory.createCriteria(documentType.queryName());
		criteria.add(Restrictions.inFolder(source.getId()));
		if (criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext()).getTotalNumItems() == 0)
			return false;
		return true;
	}
}
