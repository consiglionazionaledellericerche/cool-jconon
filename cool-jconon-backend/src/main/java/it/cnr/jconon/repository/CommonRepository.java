package it.cnr.jconon.repository;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.search.SiperService;
import it.cnr.cool.util.GroupsUtils;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.PermissionService;
import it.cnr.jconon.cmis.model.JCONONFolderType;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Repository
public class CommonRepository {
    private static final String AUTH_EXT_GESTORI = "AUTH.EXT.gestori";
	private static final Logger LOGGER = LoggerFactory.getLogger(CommonRepository.class);
    private static final String DEFINITIONS_URL = "service/cnr/jconon/sedi/gestori/";
    
    @Autowired
    private CMISService cmisService;
    @Autowired
    private PermissionService permission;
	@Autowired
	private SiperService siperService;

    @Cacheable(value="managers-call", key="#user")
    public String getManagersCall(CMISUser user, BindingSession session){
		String link = cmisService.getBaseURL().concat(DEFINITIONS_URL).concat(user.getId());
		UrlBuilder urlBuilder = new UrlBuilder(link);
		urlBuilder.addParameter("zone", AUTH_EXT_GESTORI);
		Response response = CmisBindingsHelper.getHttpInvoker(session).invokeGET(urlBuilder, session);
		if (response.getResponseCode() == HttpStatus.SC_OK) {
			JsonObject jsonObject = new JsonParser().parse(
					StringUtil.convertStreamToString(response.getStream())).getAsJsonObject();
			for (Map.Entry<String, JsonElement> key : jsonObject.entrySet()) {
				JsonArray sediKeys = key.getValue().getAsJsonArray();
				JsonArray sediFull = new JsonArray();
				for (Iterator<JsonElement> iterator = sediKeys.iterator(); iterator.hasNext();) {
					try {
						sediFull.add(siperService.getSede(iterator.next().getAsString()));
					} catch (ExecutionException e) {
						LOGGER.error("Error :", e);
					}
					iterator.remove();
				}
				sediKeys.addAll(sediFull);
			}						
			return String.valueOf(jsonObject);
		} 
		return "{}";
    }
    
    @Cacheable(value="enableTypeCalls", key="#user")
    public String get(CMISUser user, BindingSession session) {
    	List<ObjectType> objectTypes = findCallTypes();
        JSONArray json = new JSONArray();

        for (ObjectType objectType : objectTypes) {

            boolean isAuthorized = permission.isAuthorized(objectType.getId(), "PUT",
                    user.getId(), GroupsUtils.getGroups(user));
            LOGGER.debug(objectType.getId() + " "
                    + (isAuthorized ? "authorized" : "unauthorized"));
            if (isAuthorized) {
                try {
                    JSONObject jsonObj = new JSONObject();
                    jsonObj.put("id", objectType.getId());
                    jsonObj.put("title", objectType.getDisplayName());
                    json.put(jsonObj);
                } catch (JSONException e) {
                    LOGGER.error("errore nel parsing del JSON", e);
                }
            }
        }
        return json.toString();
    }
    
	private List<ObjectType> findCallTypes() {
    	List<ObjectType> callTypes = new ArrayList<>();
    	populateCallTypes(callTypes, JCONONFolderType.JCONON_CALL.value());
    	return callTypes;
    }
	
    private void populateCallTypes(List<ObjectType> callTypes, String callType) {
        ItemIterable<ObjectType> objectTypes = cmisService.createAdminSession().
                getTypeChildren(callType, false);
        for (ObjectType objectType : objectTypes) {
        	callTypes.add(objectType);
        	populateCallTypes(callTypes, objectType.getId());
        }    	
    }	
    
}