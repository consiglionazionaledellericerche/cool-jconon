package it.cnr.jconon.repository;

import it.cnr.cool.cmis.service.CMISService;

import java.util.ArrayList;
import java.util.List;

import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

@Repository
public class ApplicationBulkInfoCache {
	
	@Autowired
	private CMISService cmisService;
	
	@Cacheable(value="application-bulkinfo", key="#bulkinfoId")
	public List<String> getAspects(String bulkinfoId, String parentAspect, List<String> defaultBulkInfos) {
		ObjectType objectType = cmisService.createAdminSession().getTypeDefinition(parentAspect);
		List<String> bulkInfos = new ArrayList<String>();
		bulkInfos.addAll(defaultBulkInfos);
		bulkInfos.addAll(completeWithChildren(objectType, bulkInfos));		
		return bulkInfos;
	}
	
	private List<String> completeWithChildren(ObjectType objectType, List<String> aspects) {
		for (ObjectType child : objectType.getChildren()) {
			aspects.add(child.getId());
			completeWithChildren(child, aspects);
		}
		return aspects;
	}
}