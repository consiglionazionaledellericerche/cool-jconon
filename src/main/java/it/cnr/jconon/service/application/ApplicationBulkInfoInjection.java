package it.cnr.jconon.service.application;

import java.util.List;

import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.springframework.beans.factory.annotation.Autowired;

import it.cnr.bulkinfo.BulkInfo;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.service.BulkInfoInjection;

public class ApplicationBulkInfoInjection implements BulkInfoInjection {
	
	private String parentAspect;
	private List<String> bulkInfos;	
	@Autowired
	private CMISService cmisService;
	@Autowired
	private BulkInfoCoolService bulkInfoService;	

	public void setParentAspect(String parentAspect) {
		this.parentAspect = parentAspect;
	}

	public void setBulkInfos(List<String> bulkInfos) {
		this.bulkInfos = bulkInfos;
	}

	@Override
	public void complete(BulkInfo bulkInfo) {
		ObjectType objectType = cmisService.createAdminSession().getTypeDefinition(parentAspect);
		completeWithChildren(objectType, bulkInfo);
		for (String bulkInfoAspect : bulkInfos) {
			bulkInfo.getCmisImplementsName().put(bulkInfoAspect, false);			
		}
	}

	private void completeWithChildren(ObjectType objectType, BulkInfo bulkInfo) {
		for (ObjectType child : objectType.getChildren()) {
			bulkInfo.getCmisImplementsName().put(child.getId(), false);
			completeWithChildren(child, bulkInfo);
		}
	}
}
