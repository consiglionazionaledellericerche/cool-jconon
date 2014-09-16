package it.cnr.doccnr.service.copy;

import it.cnr.cool.security.PermissionEnum;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.alfresco.cmis.client.AlfrescoDocument;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.Policy;
import org.apache.chemistry.opencmis.client.api.Property;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.Ace;
import org.apache.chemistry.opencmis.commons.data.Acl;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.AccessControlEntryImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class CopyService {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(CopyService.class);

	@Autowired
	@Qualifier("cmisAclOperationContext")
	private OperationContext cmisAclOperationContext;

	public void copyChildren(Folder folderDest, Folder folderToCopy) {

		ItemIterable<CmisObject> immediateChildren = folderToCopy
				.getChildren(cmisAclOperationContext);

		for (CmisObject child : immediateChildren) {
			if (child instanceof Document)
				copyDocument(folderDest, (Document) child, child.getName());
			else if (child instanceof Folder)
				copyFolder(folderDest, (Folder) child, child.getName());
		}
	}

	public Map<String, Object> copyFolder(Folder folderDest,
			Folder folderToCopy, String newName) {

		LOGGER.info(" folderToCopy: " + folderToCopy.getId()
				+ " - folderDest: " + folderDest.getId());

		Map<String, Object> model = new HashMap<String, Object>();

		Map<String, Object> folderProperties = new HashMap<String, Object>(2);
		folderProperties.put(PropertyIds.NAME, newName);
		folderProperties.put(PropertyIds.OBJECT_TYPE_ID, folderToCopy
				.getBaseTypeId().value());

		Acl acl = folderToCopy.getAcl();
		List<Ace> addACEs = new ArrayList<Ace>();
		if (acl != null) {
			for (Ace ace : acl.getAces()) {
				if (ace.isDirect()) {
					List<String> permisionList = ace.getPermissions();
					permisionList.remove(PermissionEnum.CMIS_READ.value());
					permisionList.remove(PermissionEnum.CMIS_WRITE.value());
					permisionList.remove(PermissionEnum.CMIS_ALL.value());
					addACEs.add(new AccessControlEntryImpl(ace.getPrincipal(),
							permisionList));
				}
			}
		}
		Folder newFolder = folderDest.createFolder(folderProperties,
				folderToCopy.getPolicies(), addACEs, null,
				cmisAclOperationContext);

		copyChildren(newFolder, folderToCopy);
		model.put("folder", newFolder);
		return model;
	}

	public Map<String, String> copyDocument(Folder documentDest,
			Document documentToCopy, String newName) {

		LOGGER.info(" documentToCopy: " + documentToCopy.getId()
				+ " - documentDest: " + documentDest.getId());

		Map<String, String> model = new HashMap<String, String>();

		Map<String, Object> documentProperties = new HashMap<String, Object>(2);

		documentProperties.put(PropertyIds.NAME, newName);

		Iterator<ObjectType> aspects = ((AlfrescoDocument) documentToCopy)
				.getAspects().iterator();
		String aspectIds = "";
		while (aspects.hasNext()) {
			aspectIds += ',';
			aspectIds += aspects.next().getId();
		}
		// old version
		// documentProperties.put(PropertyIds.OBJECT_TYPE_ID, toCopyDocument
		// .getBaseTypeId().value() + aspectIds);
		documentProperties.put(PropertyIds.OBJECT_TYPE_ID, documentToCopy
				.getType().getId() + aspectIds);

		List<Policy> policies = documentToCopy.getPolicies();
		List<Ace> addACEs = new ArrayList<Ace>();

		Acl acl = documentToCopy.getAcl();
		if (acl != null) {
			for (Ace ace : acl.getAces()) {
				if (ace.isDirect())
					addACEs.add(ace);
			}
		}

		VersioningState version;
		if (documentToCopy.isMajorVersion()) {
			version = VersioningState.MAJOR;
		} else {
			version = VersioningState.MINOR;
		}
		List<Property<?>> propertyList = documentToCopy.getProperties();
		for (Iterator<Property<?>> iterator = propertyList.iterator(); iterator
				.hasNext();) {
			Property<?> property = iterator.next();
			if (!property.getId().equals(PropertyIds.OBJECT_TYPE_ID))
				documentProperties.put(property.getId(), property);
		}

		documentToCopy.copy(documentDest, documentProperties, version,
				policies, addACEs, null, null);
		return model;
	}
}