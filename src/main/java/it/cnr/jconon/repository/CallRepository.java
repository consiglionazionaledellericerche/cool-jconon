package it.cnr.jconon.repository;

import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.InputStreamReader;
import java.util.Map;
import java.util.Properties;

import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Repository
public class CallRepository {
	public static final String NEW_LABEL = "newLabel", LABELS_JSON = "labels.json";
	private static final Logger LOGGER = LoggerFactory.getLogger(CallRepository.class);
	
    @Cacheable(value="dynamic-labels", key="#objectId")
    public Properties getLabelsForObjectId(String objectId, Session cmisSession) {
        Properties result = new Properties();
        try {
			String labelId = findAttachmentLabels(cmisSession, objectId);
			if (labelId != null) {
				JsonObject label = new JsonParser().parse(new InputStreamReader(cmisSession.getContentStream(new ObjectIdImpl(labelId)).getStream())).getAsJsonObject();
				for (Map.Entry<String, JsonElement> iterable_element : label.entrySet()) {					
					result.put(iterable_element.getKey(), iterable_element.getValue().getAsJsonObject().get(NEW_LABEL).getAsString());
				}
			}
        } catch (Exception e) {
            LOGGER.error("unable to load lang file for object" + objectId, e);
        }
        return result;
    }

    public String findAttachmentLabels(Session cmisSession, String source) {
        Criteria criteria = CriteriaFactory.createCriteria(BaseTypeId.CMIS_DOCUMENT.value());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.addColumn(PropertyIds.NAME);
        criteria.add(Restrictions.inFolder(source));
        criteria.add(Restrictions.eq(PropertyIds.NAME, LABELS_JSON));
        ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
        for (QueryResult queryResult : iterable) {
            return queryResult.<String>getPropertyById(PropertyIds.OBJECT_ID).getFirstValue();
        }
        return null;
    }
    
    @CacheEvict(value="dynamic-labels", key = "#objectId")
    public void removeDynamicLabels(String objectId) {
        LOGGER.info("cleared dynamic labels for objectId " + objectId);
    }
}
