package it.cnr.jconon.service.cache;

import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.cmis.service.GlobalCache;
import it.cnr.cool.security.GroupsEnum;
import it.cnr.cool.util.MimeTypes;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.cmis.model.JCONONPolicyType;
import it.cnr.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.jconon.repository.CallRepository;
import it.cnr.jconon.service.TypeService;
import it.cnr.jconon.service.call.CallService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectId;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

public class CompetitionFolderService implements GlobalCache , InitializingBean{
	@Autowired
	private CMISService cmisService;
	@Autowired
	private CacheService cacheService;
	@Autowired
	private ACLService aclService;
    @Autowired
    private TypeService typeService;
	@Autowired
    private CallRepository callRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(CompetitionFolderService.class);

	private final String COMPETITION = "competition";
	private Folder cache;
	@Override
	public void afterPropertiesSet() throws Exception {
		cacheService.register(this);
	}

	@Override
	public String name() {
		return COMPETITION;
	}

	@Override
	public void clear() {
		cache = null;
	}

	public Folder getCompetition() {
		get();
		return cache;
	}
	private void createGroup(final String parent_group_name, final String group_name, final String display_name) {
		createGroup(parent_group_name, group_name, display_name, null);
	}
	private void createGroup(final String parent_group_name, final String group_name, final String display_name, final String zones) {
		createGroup(parent_group_name, group_name, display_name, zones, null);
	}
	
	private void createGroup(final String parent_group_name, final String group_name, final String display_name, final String zones, final String extraProperty) {
        String link = cmisService.getBaseURL().concat("service/cnr/groups/group");
        UrlBuilder url = new UrlBuilder(link);
        Response response = CmisBindingsHelper.getHttpInvoker(
        		cmisService.getAdminSession()).invokePOST(url, MimeTypes.JSON.mimetype(),
                new Output() {
                    @Override
                    public void write(OutputStream out) throws Exception {
                    	String groupJson = "{";
                    	if (parent_group_name != null) {
                    		groupJson = groupJson.concat("\"parent_group_name\":\"" + parent_group_name + "\",");
                    	}
                    	groupJson = groupJson.concat("\"group_name\":\"" + group_name + "\",");
                    	groupJson = groupJson.concat("\"display_name\":\"" + display_name + "\",");
                    	if (extraProperty != null)
                        	groupJson = groupJson.concat("\"extraProperty\":" + extraProperty + ",");
                    		
                    	if (zones == null)
                    		groupJson = groupJson.concat("\"zones\":[\"AUTH.ALF\",\"APP.DEFAULT\"]");
                    	else
                    		groupJson = groupJson.concat("\"zones\":" + zones);
                    	groupJson = groupJson.concat("}");
                    	out.write(groupJson.getBytes());
                    }
                }, cmisService.getAdminSession());
        if (response.getErrorContent() != null)
        	LOGGER.error(response.getErrorContent());
	}
	@Override
	public String get() {
		if (cache == null) {
			Session session = cmisService.createAdminSession();
			Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_COMPETITION.queryName());
			ItemIterable<QueryResult> results = criteria.executeQuery(session, false, session.getDefaultContext());
			if (results.getTotalNumItems() == 0) {
				Map<String, String> properties = new HashMap<String, String>();
				properties.put(PropertyIds.OBJECT_TYPE_ID, JCONONFolderType.JCONON_COMPETITION.value());
				properties.put(PropertyIds.NAME, "Selezioni on-line");
				cache = (Folder) session.getObject(session.createFolder(properties, session.getRootFolder()));
				/**
				 * Creo anche i gruppi necessari al funzionamento
				 */
				createGroup(null, "CONCORSI", "CONCORSI");
				createGroup(null, "COMMISSIONI_CONCORSO", "COMMISSIONI CONCORSO");
				createGroup(null, "RDP_CONCORSO", "RESPONSABILI BANDI");
				createGroup(null, "GESTORI_BANDI", "GESTORI BANDI", "[\"APP.DEFAULT\", \"AUTH.EXT.gestori\"]");
				createGroup("GROUP_GESTORI_BANDI", "GESTORI_DIPENDENTI", "GESTORI SELEZIONI PER DIPENDENTI", "[\"APP.DEFAULT\", \"AUTH.EXT.gestori\"]", "{\"jconon_group_gestori:call_type\": \"F:jconon_call_employees:folder\"}");
				createGroup("GROUP_GESTORI_BANDI", "GESTORI_DIRETTORI", "GESTORI DIRETTORI", "[\"APP.DEFAULT\", \"AUTH.EXT.gestori\"]", "{\"jconon_group_gestori:call_type\": \"F:jconon_call_director:folder\"}");
				createGroup("GROUP_GESTORI_BANDI", "GESTORI_MOBILITA", "GESTORI MOBILITA", "[\"APP.DEFAULT\", \"AUTH.EXT.gestori\"]", "{\"jconon_group_gestori:call_type\": \"F:jconon_call_mobility:folder\"}");
				createGroup("GROUP_GESTORI_BANDI", "GESTORI_TIND", "GESTORI TEMPO INDETERMINATO", "[\"APP.DEFAULT\", \"AUTH.EXT.gestori\"]", "{\"jconon_group_gestori:call_type\": \"F:jconon_call_tind:folder\"}");
				
		        Map<String, ACLType> aces = new HashMap<String, ACLType>();
		        aces.put(GroupsEnum.CONCORSI.value(), ACLType.Contributor);
		        aces.put("GROUP_GESTORI_BANDI", ACLType.Contributor);
		        aclService.addAcl(cmisService.getAdminSession(), cache.getId(), aces);				
			} else {
				for (QueryResult queryResult : results) {
					ObjectId objectId = session.createObjectId((String) queryResult.getPropertyById(PropertyIds.OBJECT_ID).getFirstValue());
					cache = (Folder) session.getObject(objectId);
				}
			}			
		}
		JSONObject jsonObj = new JSONObject();
		try {
			jsonObj.put("id", cache.getId());
			jsonObj.put("path", cache.getPath());
		} catch (JSONException e) {
			LOGGER.error(e.getMessage(), e);
		}
		return jsonObj.toString();
	}
	
    public Folder getMacroCall(Session cmisSession, Folder call) {
        Folder currCall = call;
        while (currCall != null && typeService.hasSecondaryType(currCall, JCONONPolicyType.JCONON_MACRO_CALL.value())) {
            if (currCall.getType().getId().equals(JCONONFolderType.JCONON_COMPETITION.value()))
                return null;
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
        String codiceBando = (String)call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value());
        String name = CallService.BANDO_NAME.concat(" ").concat(codiceBando);
        if (call.getPropertyValue(JCONONPropertyIds.CALL_SEDE.value()) != null)
            name = name.concat(" - ").
                    concat(call.getPropertyValue(JCONONPropertyIds.CALL_SEDE.value()).toString());        
        return name;
    }    
}