package it.cnr.jconon.service.application;

import it.cnr.bulkinfo.BulkInfo;
import it.cnr.cool.service.BulkInfoInjection;
import it.cnr.jconon.repository.ApplicationBulkInfoCache;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

public class ApplicationBulkInfoInjection implements BulkInfoInjection {
	
	private String parentAspect;
	private List<String> bulkInfos;	
	@Autowired
	private ApplicationBulkInfoCache applicationBulkInfoCache;

	public void setParentAspect(String parentAspect) {
		this.parentAspect = parentAspect;
	}

	public void setBulkInfos(List<String> bulkInfos) {
		this.bulkInfos = bulkInfos;
	}

	@Override
	public void complete(BulkInfo bulkInfo) {
		List<String>  aspects = applicationBulkInfoCache.getAspects(bulkInfo.getId(), parentAspect, bulkInfos);
		for (String bulkInfoAspect : aspects) {
			bulkInfo.getCmisImplementsName().put(bulkInfoAspect, false);			
		}
	}
}