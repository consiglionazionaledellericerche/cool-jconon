package it.cnr.jconon.web.scripts.call;


import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.cool.web.scripts.exception.ValidationException;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.alfresco.cmis.client.AlfrescoDocument;
import org.alfresco.cmis.client.AlfrescoFolder;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.Property;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.Cardinality;
import org.apache.chemistry.opencmis.commons.enums.Updatability;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class CallCreateChildWebScript extends CallWebScript {

	private static final Logger LOGGER = LoggerFactory.getLogger(CallCreateChildWebScript.class);

	protected void executeBeforePost(WebScriptRequest req, Status status, Cache cache,
			java.util.Map<String,Object> model, Session cmisSession, String objectId,
			java.util.Map<String,Object> properties, java.util.Map<String,Object> aspectProperties) throws ValidationException {
		super.executeBeforePost(req, status, cache, model, cmisSession, objectId, properties, aspectProperties);
		AlfrescoFolder parent = (AlfrescoFolder) cmisSession.getObject(String.valueOf(properties.get(PropertyIds.PARENT_ID)));
		ObjectType parentType = parent.getType();
		for (Property<?> property : parent.getProperties()) {
			if (!properties.containsKey(property.getId()) &&
					!property.getDefinition().getUpdatability().equals(Updatability.READONLY)) {
				LOGGER.debug("Add property " + property.getId() + " for create child.");

				if (parentType.getPropertyDefinitions().containsKey(property.getId())) {
					properties.put(property.getId(), property.getValue());
				}
			}
		}
	};

	@Override
	protected void executeAfterPost(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model, Session cmisSession,
			Boolean created, Folder folder) throws ValidationException {
		super.executeAfterPost(req, status, cache, model, cmisSession, created, folder);
		try{
			AlfrescoFolder parent = (AlfrescoFolder) cmisSession.getObject(folder.getParentId());
			Map<String, Object> aspectProperties = new HashMap<String, Object>();
			for (ObjectType aspect : parent.getAspects()) {
				if (!aspect.getId().equals(JCONONPolicyType.JCONON_MACRO_CALL.value())){
					((AlfrescoFolder)folder).addAspect(aspect);
					for (String key : aspect.getPropertyDefinitions().keySet()) {
						if (!aspect.getPropertyDefinitions().get(key).getUpdatability().equals(Updatability.READONLY) &&
							((aspect.getPropertyDefinitions().get(key).getCardinality().equals(Cardinality.SINGLE) &&
									folder.getPropertyValue(key) == null)||
							(aspect.getPropertyDefinitions().get(key).getCardinality().equals(Cardinality.MULTI) &&
									((List<?>)folder.getPropertyValue(key)).isEmpty()))){
							aspectProperties.put(key, parent.getPropertyValue(key));
						}
					}
				}
			}
			folder.updateProperties(aspectProperties);
			Criteria criteria = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_CALL_ABSTRACT.queryName());
			criteria.addColumn(PropertyIds.OBJECT_ID);
			criteria.add(Restrictions.inFolder(folder.getParentId()));
			ItemIterable<QueryResult> attachments = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
			for (QueryResult attachment : attachments) {
				AlfrescoDocument attachmentFile = (AlfrescoDocument) cmisSession.getObject(
						String.valueOf(attachment.getPropertyValueById(PropertyIds.OBJECT_ID)));
				Map<String, Object> properties = new HashMap<String, Object>();
				for (Property<?> property : attachmentFile.getProperties()) {
					if (!property.getDefinition().getUpdatability().equals(Updatability.READONLY))
						properties.put(property.getId(), property.getValue());
				}
				Map<String, Object> initialProperties = new HashMap<String, Object>();
				initialProperties.put(PropertyIds.NAME, properties.get(PropertyIds.NAME));
				initialProperties.put(PropertyIds.OBJECT_TYPE_ID, properties.get(PropertyIds.OBJECT_TYPE_ID));
				AlfrescoDocument newDocument = (AlfrescoDocument)
						folder.createDocument(initialProperties, attachmentFile.getContentStream(), VersioningState.MAJOR);
				newDocument.addAspect(attachmentFile.getAspects().toArray(new ObjectType[attachmentFile.getAspects().size()]));
				newDocument.updateProperties(properties);
			}
		} catch (CmisContentAlreadyExistsException ex){
			throw ClientMessageException.FILE_ALREDY_EXISTS;
		}
	}
}
