package it.cnr.jconon.service.model.upgrade;

import it.cnr.cool.cmis.service.CMISService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class UpgradeModel {
	private static final String MODEL_VERSION = "cm:modelVersion";
    private static final Logger LOGGER = LoggerFactory.getLogger(CMISService.class);

	@Autowired
	private CMISService cmisService;

	private String cmisPathResource,
		pathModelBefore,
		pathModelAfter,
		modelVersionBefore,
		modelVersionAfter,
		typeName,
		propertyName;

	public void setCmisPathResource(String cmisPathResource) {
		this.cmisPathResource = cmisPathResource;
	}

	public void setPathModelBefore(String pathModelBefore) {
		this.pathModelBefore = pathModelBefore;
	}

	public void setPathModelAfter(String pathModelAfter) {
		this.pathModelAfter = pathModelAfter;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public void setPropertyName(String propertyName) {
		this.propertyName = propertyName;
	}

	public void setModelVersionBefore(String modelVersionBefore) {
		this.modelVersionBefore = modelVersionBefore;
	}

	public void setModelVersionAfter(String modelVersionAfter) {
		this.modelVersionAfter = modelVersionAfter;
	}

	public void upgradeModel() {
		Session cmisSession = cmisService.createAdminSession();
		Map<String, Object> oldValues = new HashMap<String, Object>();
		try {
			Document model = (Document) cmisSession.getObjectByPath(cmisPathResource);
			if (model.getPropertyValue(MODEL_VERSION).equals(modelVersionBefore)) {
				ContentStream contentStreamBefore = getContentStreamBefore(),
						contentStreamAfter = getContentStreamAfter();

				Criteria criteria = CriteriaFactory.createCriteria(typeName);
				criteria.add(Restrictions.isNotNull(propertyName));
				ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisService.createAdminSession(), false,
						cmisService.createAdminSession().getDefaultContext());
				for (QueryResult queryResult : iterable) {
					CmisObject cmisObject =
							cmisSession.getObject((String)queryResult.getPropertyValueById(PropertyIds.OBJECT_ID));
					oldValues.put(cmisObject.getId(),
							cmisObject.getPropertyValue(propertyName));
				}
				Map<String, Object> nullValues = new HashMap<String, Object>();
				nullValues.put(propertyName, null);
				for (String nodeRef : oldValues.keySet()) {
					cmisSession.getObject(nodeRef).updateProperties(nullValues);
				}

				model.setContentStream(contentStreamBefore, true, true);
				model.setContentStream(contentStreamAfter, true, true);
				for (String nodeRef : oldValues.keySet()) {
					Map<String, Object> newValues = new HashMap<String, Object>();
					newValues.put(propertyName, oldValues.get(nodeRef));
					cmisSession.getObject(nodeRef).updateProperties(newValues);
				}

				Map<String, Object> modelProperties = new HashMap<String, Object>();
				modelProperties.put(MODEL_VERSION, modelVersionAfter);
				model.updateProperties(modelProperties, true);
			}

		} catch (Exception e) {
			LOGGER.error("Error in upgrade Model", e);
			for (String nodeRef : oldValues.keySet()) {
				Map<String, Object> newValues = new HashMap<String, Object>();
				newValues.put(propertyName, oldValues.get(nodeRef));
				cmisSession.getObject(nodeRef).updateProperties(newValues);
			}
		}
	}

	private ContentStream getContentStreamBefore() throws IOException {
		InputStream is = this.getClass().getResourceAsStream(pathModelBefore);
		return new ContentStreamImpl("", new BigInteger(String.valueOf(is.available())), "text/xml ", is);
	}

	private ContentStream getContentStreamAfter() throws IOException {
		InputStream is = this.getClass().getResourceAsStream(pathModelAfter);
		return new ContentStreamImpl("", new BigInteger(String.valueOf(is.available())), "text/xml ", is);
	}

}
