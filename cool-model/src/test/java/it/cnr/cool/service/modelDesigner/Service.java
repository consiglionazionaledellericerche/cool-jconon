package it.cnr.cool.service.modelDesigner;

import it.cnr.cool.cmis.service.CMISService;

import org.apache.chemistry.opencmis.client.api.Session;
import org.springframework.beans.factory.annotation.Autowired;

public class Service {

	@Autowired
	private CMISService cmisService;
	private Session cmisSession;

	public Session getAdminSession() {
		if (cmisSession == null) {
			cmisSession = cmisService.createAdminSession();
		}
		return cmisSession;
	}
}
