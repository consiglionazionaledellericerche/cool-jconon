package it.cnr.jconon.service.application;

import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.springframework.beans.factory.annotation.Autowired;

import it.cnr.bulkinfo.BulkInfo;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.BulkInfoInjection;

public class ApplicationBulkInfoInjection implements BulkInfoInjection {
	
	private String parentAspect;
	@Autowired
	private CMISService cmisService;

	public void setParentAspect(String parentAspect) {
		this.parentAspect = parentAspect;
	}

	@Override
	public void complete(BulkInfo bulkInfo) {
		ObjectType objectType = cmisService.createAdminSession().getTypeDefinition(parentAspect);
		completeWithChildren(objectType, bulkInfo);
	}

	private void completeWithChildren(ObjectType objectType, BulkInfo bulkInfo) {
		for (ObjectType child : objectType.getChildren()) {
			bulkInfo.getCmisImplementsName().put(child.getId(), false);
			completeWithChildren(child, bulkInfo);
		}		
	}
}
