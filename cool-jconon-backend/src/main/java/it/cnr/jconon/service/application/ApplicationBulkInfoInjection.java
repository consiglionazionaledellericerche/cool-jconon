package it.cnr.jconon.service.application;

import it.cnr.bulkinfo.BulkInfo;
import it.cnr.cool.service.BulkInfoInjection;
import it.cnr.jconon.repository.CacheRepository;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service(value="BulkInfoF:jconon_application:folder")
public class ApplicationBulkInfoInjection implements BulkInfoInjection {

	@Autowired
	private CacheRepository cacheRepository;
	
	@Override
	public void complete(BulkInfo bulkInfo) {
		JSONArray json = new JSONArray(cacheRepository.getApplicationAspects());
		for (int i = 0; i < json.length(); i++) {
			bulkInfo.getCmisImplementsName().put(((JSONObject)json.get(i)).getString("key"), false);
		}
	}
}