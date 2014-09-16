package it.cnr.jconon.web.scripts.application;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.jconon.cmis.model.JCONONRelationshipType;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.alfresco.cmis.client.AlfrescoDocument;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.Relationship;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.enums.IncludeRelationships;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class ApplicationMoveProdottoWebScript extends ApplicationWebScript {
	@Autowired
	private CMISService cmisService;

	@Override
	protected void executePreMethod(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model, Session cmisSession) {
	}
	
	@Override
	protected void executeAfterMethod(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model, Session cmisSession) {
	}

	@Override
	protected void executePost(WebScriptRequest req, Status status,
			Cache cache, Map<String, Object> model, Session cmisSession) {
		String prodottoId = req.getParameter("prodottoId");
		moveDocument(prodottoId);
	}
	
	private void moveDocument(String sourceId) {
		HttpSession session = ServletUtil.getSession(false);
		OperationContext oc = cmisService.getCurrentCMISSession(session).getDefaultContext();
		oc.setIncludeRelationships(IncludeRelationships.SOURCE);
		
		AlfrescoDocument sourceDoc = (AlfrescoDocument) cmisService.getCurrentCMISSession(session)
				.getObject(sourceId, oc);

		if (sourceDoc.hasAspect("P:cvpeople:noSelectedProduct")) {
			sourceDoc.removeAspect("P:cvpeople:noSelectedProduct");
			sourceDoc.addAspect("P:cvpeople:selectedProduct");
		} else if (sourceDoc.hasAspect("P:cvpeople:selectedProduct")) {
			sourceDoc.removeAspect("P:cvpeople:selectedProduct");
			sourceDoc.addAspect("P:cvpeople:noSelectedProduct");
			if (sourceDoc.getRelationships() != null && !sourceDoc.getRelationships().isEmpty()) {
				for (Relationship relationship : sourceDoc.getRelationships()) {
					if (relationship.getType().getId().equals(JCONONRelationshipType.JCONON_ATTACHMENT_IN_PRODOTTO.value())){
						relationship.getTarget().delete(true);					
					}					
				}
			}
		}
	}
}
