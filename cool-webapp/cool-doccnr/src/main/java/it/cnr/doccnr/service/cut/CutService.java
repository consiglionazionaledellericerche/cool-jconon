package it.cnr.doccnr.service.cut;

import it.cnr.cool.cmis.service.CMISService;

import java.util.HashMap;
import java.util.Map;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class CutService {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(CutService.class);

	@Autowired
	private CMISService cmisService;

	public Map<String, String> cut(String nodeRefToCopy, String nodeRefDest) {
		Map<String, String> model = new HashMap<String, String>();

		Session adminSession = cmisService.createAdminSession();
		CmisObject toCopy = adminSession.getObject(nodeRefToCopy);
		try {
			if (toCopy instanceof Folder) {
				LOGGER.info(" Folder To Cut: " + nodeRefToCopy
						+ " - folderDest: " + nodeRefDest);

				((Folder) toCopy).move(((Folder) toCopy).getFolderParent(),
						new ObjectIdImpl(nodeRefDest));

			} else if (toCopy instanceof Document) {
				LOGGER.info(" Document To Cut: " + nodeRefToCopy
						+ " - Folder Dest: " + nodeRefDest);

				((Document) toCopy).move(((Document) toCopy).getParents()
						.get(0), new ObjectIdImpl(nodeRefDest));

			}
			model.put("status", "ok");
		} catch (Exception e) {
			model.put("status", "ko");
			model.put("message", e.getLocalizedMessage());
		}
		return model;
	}
}