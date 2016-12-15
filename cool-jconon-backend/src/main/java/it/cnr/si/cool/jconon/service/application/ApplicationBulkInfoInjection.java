package it.cnr.si.cool.jconon.service.application;

import it.cnr.bulkinfo.BulkInfo;
import it.cnr.cool.service.BulkInfoInjection;
import it.cnr.si.cool.jconon.repository.CacheRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service(value="BulkInfoF:jconon_application:folder")
public class ApplicationBulkInfoInjection implements BulkInfoInjection {

	@Autowired
	private CacheRepository cacheRepository;
	
	@Override
	public void complete(BulkInfo bulkInfo) {
		cacheRepository.getApplicationAspects().stream().forEach(x -> {
			bulkInfo.getCmisImplementsName().put(x.getId(), false);
		});
	}
}