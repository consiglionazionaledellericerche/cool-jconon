/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.repository;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import it.cnr.si.cool.jconon.dto.VerificaPECTask;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.Properties;

@Repository
public class CallRepository {
	public static final String NEW_LABEL = "newLabel", LABELS_JSON = "labels.json";
    private static final Logger LOGGER = LoggerFactory.getLogger(CallRepository.class);
    public static final String SCAN_PEC = "scan-pec";

    @Cacheable(value="dynamic-labels", key="#objectId")
    public Properties getLabelsForObjectId(String objectId, Session cmisSession) {
        Properties result = new Properties();
        try {
			String labelId = findAttachmentLabels(cmisSession, objectId);
			if (labelId != null) {
				JsonObject label = new JsonParser().parse(
				        new InputStreamReader(cmisSession.getContentStream(new ObjectIdImpl(labelId)).getStream(), "UTF-8")
                ).getAsJsonObject();
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

    @CachePut(value = SCAN_PEC, key = "#oggetto")
    public VerificaPECTask verificaPECTask(String userName, String password, String oggetto, String propertyName) {
        return new VerificaPECTask(userName, password, oggetto, propertyName,
                Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()));
    }

    @CacheEvict(value = SCAN_PEC, key = "#oggetto")
    public void removeVerificaPECTask(String oggetto) {
        LOGGER.info("cleared scan-pec for oggetto {}", oggetto);
    }

    @CacheEvict(value = SCAN_PEC, allEntries = true)
    public void removeVerificaPECTask() {
        LOGGER.info("cleared scan-pec");
    }
}
