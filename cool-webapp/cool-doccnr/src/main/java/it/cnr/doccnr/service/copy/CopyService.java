package it.cnr.doccnr.service.copy;

import it.cnr.cool.security.PermissionEnum;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.alfresco.cmis.client.AlfrescoDocument;
import org.alfresco.cmis.client.AlfrescoFolder;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.FileableCmisObject;
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

		LOGGER.info(" Folder To Copy: " + folderToCopy.getId()
				+ " - Folder Dest: " + folderDest.getId());

		Map<String, Object> model = new HashMap<String, Object>();
		Map<String, Object> folderProperties = populateProperties(folderToCopy,
				newName);

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
		try {
			Folder newFolder = folderDest.createFolder(folderProperties,
					folderToCopy.getPolicies(), addACEs, null,
					cmisAclOperationContext);
			copyChildren(newFolder, folderToCopy);
			model.put("status", "ok");
		} catch (Exception e) {
			model.put("status", "ko");
			model.put("message", e.getLocalizedMessage());
		}
		return model;
	}

	public Map<String, Object> copyDocument(Folder documentDest,
			Document documentToCopy, String newName) {

		LOGGER.info(" Document To Copy: " + documentToCopy.getId()
				+ " - Folder Dest: " + documentDest.getId());

		Map<String, Object> model = new HashMap<String, Object>();

		Map<String, Object> documentProperties = populateProperties(
				documentToCopy, newName);

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
		try {
			documentToCopy.copy(documentDest, documentProperties, version,
					policies, addACEs, null, null);
			model.put("status", "ok");
		} catch (Exception e) {
			model.put("status", "ko");
			model.put("message", e.getLocalizedMessage());
		}

		return model;
	}

	private Map<String, Object> populateProperties(FileableCmisObject toCopy,
			String newName) {
		Map<String, Object> properties = new HashMap<String, Object>();

		properties.put(PropertyIds.NAME, newName);
		Iterator<ObjectType> aspects = null;

		if (toCopy instanceof Folder) {
			aspects = ((AlfrescoFolder) toCopy).getAspects().iterator();
		} else if (toCopy instanceof Document) {
			aspects = ((AlfrescoDocument) toCopy).getAspects().iterator();
		}

		String aspectIds = "";
		while (aspects.hasNext()) {
			aspectIds += ',';
			aspectIds += aspects.next().getId();
		}
		// old version
		// folderProperties.put(PropertyIds.OBJECT_TYPE_ID, folderToCopy
		// .getBaseTypeId().value() + aspectIds);
		properties.put(PropertyIds.OBJECT_TYPE_ID, toCopy.getType().getId()
				+ aspectIds);
		for (Property<?> property : toCopy.getProperties()) {
			if (property.getId().equals(PropertyIds.OBJECT_TYPE_ID)
					|| property.getId().equals(PropertyIds.NAME)) {
				continue;
			} else {
				if (property.isMultiValued())
					properties.put(property.getId(), property.getValues());
				else
					properties.put(property.getId(), property.getValue());
			}
		}
		return properties;
	}
}