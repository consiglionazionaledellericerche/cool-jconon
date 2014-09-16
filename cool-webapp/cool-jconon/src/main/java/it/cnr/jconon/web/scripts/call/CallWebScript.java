package it.cnr.jconon.web.scripts.call;


import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.FolderService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.cool.web.scripts.exception.ValidationException;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.service.cache.CompetitionFolderService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.alfresco.cmis.client.AlfrescoFolder;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class CallWebScript extends it.cnr.cool.web.scripts.ManageFolderWebScript {
	private static String BANDO_NAME = "BANDO ";
	@Autowired
	private FolderService folderService;
	@Autowired
	private CMISService cmisService;
	@Autowired
	private ACLService aclService;
	@Autowired
	private CompetitionFolderService cacheCompetitionFolderService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CallWebScript.class);

	@Override
	protected void executeBeforePost(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model, Session cmisSession,
			String objectId, Map<String, Object> properties, Map<String, Object> aspectProperties) throws ValidationException{
		super.executeBeforePost(req, status, cache, model, cmisSession, objectId,
				properties, aspectProperties);

		if ((ServletUtil.getRequest().getParameter(PropertyIds.PARENT_ID) == null ||
			ServletUtil.getRequest().getParameter(PropertyIds.PARENT_ID).length() == 0) &&
			(!properties.containsKey(PropertyIds.PARENT_ID) || (properties.containsKey(PropertyIds.PARENT_ID) && properties.get(PropertyIds.PARENT_ID) == null)))
			properties.put(PropertyIds.PARENT_ID, cacheCompetitionFolderService.getCompetition().getId());
		if (properties.get(JCONONPropertyIds.CALL_CODICE.value()) == null ){
			throw new ClientMessageException("message.error.required.codice");
		}
		String name = BANDO_NAME.concat(properties.get(JCONONPropertyIds.CALL_CODICE.value()).toString());
		if (properties.get(JCONONPropertyIds.CALL_SEDE.value()) != null)
			name = name.concat(" - ").
				concat(properties.get(JCONONPropertyIds.CALL_SEDE.value()).toString());
		properties.put(PropertyIds.NAME, folderService.integrityChecker(name));
		if (ServletUtil.getRequest().getParameter(PropertyIds.PARENT_ID) != null &&
				ServletUtil.getRequest().getParameter(PropertyIds.PARENT_ID).length() > 0 ){
			properties.put(JCONONPropertyIds.CALL_HAS_MACRO_CALL.value(), true);
			properties.put(PropertyIds.PATH, ((Folder)cmisService.createAdminSession().getObject(
						ServletUtil.getRequest().getParameter(PropertyIds.PARENT_ID))).getPath());
		}else{
			if (objectId != null){
				GregorianCalendar dataInizioInvioDomande = (GregorianCalendar) properties.get(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value());
				properties.put(JCONONPropertyIds.CALL_HAS_MACRO_CALL.value(), false);
				if (dataInizioInvioDomande != null){
					String year = String.valueOf(dataInizioInvioDomande.get(Calendar.YEAR));
					String month = String.valueOf(dataInizioInvioDomande.get(Calendar.MONTH) + 1);
					Folder folderYear = folderService.createFolderFromPath(cmisSession, cacheCompetitionFolderService.getCompetition().getPath(), year);
					Folder folderMonth = folderService.createFolderFromPath(cmisSession, folderYear.getPath(), month);
					Folder callFolder = ((Folder)cmisSession.getObject(objectId));

					Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
					criteria.add(Restrictions.inTree(objectId));
					ItemIterable<QueryResult> applications = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
					if (applications.getTotalNumItems() == 0) {
						if (!folderMonth.getId().equals(callFolder.getParentId())){
							callFolder.move(new ObjectIdImpl(callFolder.getParentId()), folderMonth);
						} else {
							properties.remove(PropertyIds.PARENT_ID);
						}
					}
				}
			}
		}
	}

	@Override
	protected void executeAfterPost(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model, Session cmisSession,
			Boolean created, Folder folder) throws ValidationException {
		super.executeAfterPost(req, status, cache, model, cmisSession, created, folder);
		AlfrescoFolder alfrescoFolder = (AlfrescoFolder)folder;
		if (!alfrescoFolder.hasAspect(JCONONPolicyType.JCONON_MACRO_CALL.value()))
			alfrescoFolder.addAspect(JCONONPolicyType.JCONON_CALL_SUBMIT_APPLICATION.value());
		else
			alfrescoFolder.removeAspect(JCONONPolicyType.JCONON_CALL_SUBMIT_APPLICATION.value());
		HttpServletRequest request = ServletUtil.getRequest();
		aclService.setInheritedPermission(
				cmisService.getCurrentBindingSession(request),
				alfrescoFolder.getId(), false);
	}

	@Override
	protected void executeBeforeDelete(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model, Session cmisSession, Folder folder) {
		String objectId = ServletUtil.getRequest().getParameter(PropertyIds.OBJECT_ID);
		Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_APPLICATION.queryName());
		criteria.add(Restrictions.inTree(objectId));
		ItemIterable<QueryResult> applications = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
		if (applications.getTotalNumItems() > 0)
			throw new ClientMessageException("message.error.call.cannot.delete");
		if (LOGGER.isDebugEnabled())
			LOGGER.debug("Try to delete :"+objectId);
		super.executeBeforeDelete(req, status, cache, model, cmisSession, folder);
	}
}
