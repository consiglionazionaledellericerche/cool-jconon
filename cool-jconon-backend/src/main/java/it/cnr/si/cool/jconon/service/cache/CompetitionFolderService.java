package it.cnr.si.cool.jconon.service.cache;

import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.service.I18nService;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPolicyType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.repository.CacheRepository;
import it.cnr.si.cool.jconon.repository.CallRepository;
import it.cnr.si.cool.jconon.service.TypeService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.util.Locale;
import java.util.Properties;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectId;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompetitionFolderService implements InitializingBean{

	private static final Logger LOGGER = LoggerFactory.getLogger(CompetitionFolderService.class);

	@Autowired
	private CMISService cmisService;

	@Autowired
	private ACLService aclService;
    @Autowired
    private TypeService typeService;
	@Autowired
    private CallRepository callRepository;
    @Autowired
    private I18nService i18NService;
	@Autowired
	private UserService userService;

	@Autowired
    private CacheRepository cacheRepository;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		cacheRepository.getCompetitionFolder();
	}
	
	public JSONObject getCompetitionFolder() {
		return new JSONObject(cacheRepository.getCompetitionFolder());
	}
	
    public Folder getMacroCall(Session cmisSession, Folder call) {
        Folder currCall = call;
        while (currCall != null && !currCall.getType().getId().equals(JCONONFolderType.JCONON_COMPETITION.value())) {
            if (typeService.hasSecondaryType(currCall, JCONONPolicyType.JCONON_MACRO_CALL.value()))
            	break;
            currCall = currCall.getFolderParent();
        }
        return currCall.equals(call) ? null : currCall;
    }	

    public String getCallGroupCommissioneName(Folder call) {
        return call.getProperty(JCONONPropertyIds.CALL_COMMISSIONE.value()).getValueAsString();
    }
    
    public String findAttachmentId(Session cmisSession, String source, JCONONDocumentType documentType, boolean fullNodeRef) {
        Criteria criteria = CriteriaFactory.createCriteria(documentType.queryName());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        if (fullNodeRef)
        	criteria.addColumn(CoolPropertyIds.ALFCMIS_NODEREF.value());
        criteria.addColumn(PropertyIds.NAME);
        criteria.add(Restrictions.inFolder(source));
        ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        for (QueryResult queryResult : iterable) {
            return (String) queryResult.getPropertyById(fullNodeRef ? CoolPropertyIds.ALFCMIS_NODEREF.value() : PropertyIds.OBJECT_ID).getFirstValue();
        }
        return null;    	
    }    
    public String findAttachmentId(Session cmisSession, String source, JCONONDocumentType documentType) {
    	return findAttachmentId(cmisSession, source, documentType, false);
    }
    
    public Properties getDynamicLabels(ObjectId objectId, Session cmisSession) {
		LOGGER.debug("loading dynamic labels for " + objectId);
        Properties labels = callRepository.getLabelsForObjectId(objectId.getId(), cmisSession);
		return labels;
	}
    
    public String getCallName(Folder call) {
        String codiceBando = call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value());
        String name = i18NService.getLabel("call.name", Locale.ITALIAN).concat(" ").concat(codiceBando);
        if (call.getPropertyValue(JCONONPropertyIds.CALL_SEDE.value()) != null)
            name = name.concat(" - ").
                    concat(call.getPropertyValue(JCONONPropertyIds.CALL_SEDE.value()).toString());        
        return name;
    }    
}