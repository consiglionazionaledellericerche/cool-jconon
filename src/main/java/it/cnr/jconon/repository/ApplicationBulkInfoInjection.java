package it.cnr.jconon.repository;

import it.cnr.bulkinfo.BulkInfo;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.service.BulkInfoInjection;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

@Repository(value="BulkInfoF:jconon_application:folder")
public class ApplicationBulkInfoInjection implements BulkInfoInjection,InitializingBean {
	
	private String parentAspect;
	private List<String> bulkInfos;	
	@Autowired
	private CMISService cmisService;
	@Autowired
	private BulkInfoCoolService bulkInfoService;	

	@Override
	public void complete(BulkInfo bulkInfo) {
		List<String> aspects = getAspects(bulkInfo.getId());
		for (String bulkInfoAspect : aspects) {
			bulkInfo.getCmisImplementsName().put(bulkInfoAspect, false);			
		}
	}

	private List<String> completeWithChildren(ObjectType objectType, List<String> aspects) {
		for (ObjectType child : objectType.getChildren()) {
			aspects.add(child.getId());
			completeWithChildren(child, aspects);
		}
		return aspects;
	}
	
	@Cacheable(value="application-bulkinfo", key="#bulkinfoId")
	public List<String> getAspects(String bulkinfoId) {
		ObjectType objectType = cmisService.createAdminSession().getTypeDefinition(parentAspect);
		List<String> bulkInfos = new ArrayList<String>();
		bulkInfos.addAll(this.bulkInfos);
		bulkInfos.addAll(completeWithChildren(objectType, bulkInfos));
		
		return bulkInfos;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		parentAspect = "P:jconon_application:aspects";
		bulkInfos = Collections.singletonList("P:jconon_application:aspect_condanne_penali_rapporto_lavoro");
	}
}
