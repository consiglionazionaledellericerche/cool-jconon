package it.cnr.jconon.web.scripts.call;

import it.cnr.cool.web.scripts.CMISWebScript;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.service.call.CallService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class CallFinalWebScript extends CMISWebScript {
	@Autowired
	private CallService callService;

	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req,
			Status status, Cache cache) {
		Map<String, Object> model =  super.executeImpl(req, status, cache);
		Session cmisSession = getCMISSession();
		String nodeRef = req.getParameter("nodeRef");
		if (nodeRef != null){
			HttpServletRequest request = ServletUtil.getRequest();
			callService.finalCall(cmisSession, cmisService.getCurrentBindingSession(request), nodeRef);
			Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
			criteria.add(Restrictions.inTree(nodeRef));
			ItemIterable<QueryResult> calls = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
			for (QueryResult call : calls) {
				callService.finalCall(cmisSession, cmisService.getCurrentBindingSession(request), (String)call.getPropertyValueById(PropertyIds.OBJECT_ID));
			}
		}
		return model;
	}
}