package it.cnr.jconon.service.cache;

import it.cnr.bulkinfo.cool.BulkInfoCool;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.jconon.cmis.model.JCONONDocumentType;
import it.cnr.jconon.service.TypeService;

import java.util.ArrayList;
import java.util.List;

import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class ApplicationAttachmentChildService{
	@Autowired
	private CMISService cmisService;

	@Autowired
	private BulkInfoCoolService bulkInfoService;	
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationAttachmentChildService.class);

	private List<String> parentTypes;
	private List<String> defaultTypes;
	private List<String> bulkInfos;

	private String aspect;
	private Boolean includeMandatoryAspects = false;

    @Autowired
    private TypeService typeService;

	public void setParentTypes(List<String> parentTypes) {
		this.parentTypes = parentTypes;
	}

	public void setAspect(String aspect) {
		this.aspect = aspect;
	}

	public void setDefaultTypes(List<String> defaultTypes) {
		this.defaultTypes = defaultTypes;
	}

	public void setIncludeMandatoryAspects(Boolean includeMandatoryAspects) {
		this.includeMandatoryAspects = includeMandatoryAspects;
	}

	public List<String> getBulkInfos() {
		return bulkInfos;
	}

	public void setBulkInfos(List<String> bulkInfos) {
		this.bulkInfos = bulkInfos;
	}

	public List<String> getTypes() {
		List<String> result = new ArrayList<String>();
		result.addAll(parentTypes);
		if (defaultTypes != null && !defaultTypes.isEmpty()) {
			result.addAll(defaultTypes);
		}
		if (bulkInfos != null && !bulkInfos.isEmpty()) {
			for (String bulkInfo : bulkInfos) {
				result.add(bulkInfoService.find(bulkInfo).getCmisTypeName());
			}
		}
		return result;
	}
	
	private boolean hasAspect(ObjectType type, String aspect) {
		boolean hasAspect = false;
		for (String mandatoryAspect : typeService.getMandatoryAspects(type)) {
			if (mandatoryAspect.equals(aspect))
				return true;
		}
		return hasAspect;
	}

	private void populateJSONArray(JSONArray json, ItemIterable<ObjectType> objectTypes) {
		for (ObjectType objectType : objectTypes) {
			boolean addToResponse = true;
			if (aspect != null ) {
				ObjectType type = cmisService.createAdminSession().
						getTypeDefinition(objectType.getId());
				addToResponse = hasAspect(type, aspect);
			}
			if (addToResponse) {
				LOGGER.debug(objectType.getId() + " is children of " + JCONONDocumentType.JCONON_ATTACHMENT.value());
				addToJSON(json, objectType);
			}
			populateJSONArray(json, cmisService.createAdminSession().
					getTypeChildren(objectType.getId(), false));
		}
	}

	private void addToJSON(JSONArray json, ObjectType objectType) {
		try {
			JSONObject jsonObj = new JSONObject();
			jsonObj.put("key", objectType.getId());
			jsonObj.put("label", objectType.getId());
			jsonObj.put("description", objectType.getDescription());
			jsonObj.put("defaultLabel", objectType.getDisplayName());
			
			if (includeMandatoryAspects) {
				jsonObj.put("mandatoryAspects", typeService.getMandatoryAspects(objectType));
			}
			json.put(jsonObj);
		} catch (JSONException e) {
			LOGGER.error(e.getMessage(), e);
		}
	}

	private void addToJSON(JSONArray json, BulkInfoCool bulkInfo) {
		try {
			JSONObject jsonObj = new JSONObject();
			jsonObj.put("key", bulkInfo.getId());
			jsonObj.put("label", bulkInfo.getShortDescription());
			jsonObj.put("description", bulkInfo.getLongDescription());
			jsonObj.put("defaultLabel", bulkInfo.getShortDescription());
			json.put(jsonObj);
		} catch (JSONException e) {
			LOGGER.error(e.getMessage(), e);
		}		
	}


	public String get() {
		try {
			JSONArray json = new JSONArray();
			for (String typeName : parentTypes) {
				populateJSONArray(json, cmisService.createAdminSession().
						getTypeChildren(typeName, false));
			}
			if (defaultTypes != null && !defaultTypes.isEmpty()) {
				for (String defaultType : defaultTypes) {
					addToJSON(json, cmisService.createAdminSession().getTypeDefinition(defaultType));
				}
			}
			if (bulkInfos != null && !bulkInfos.isEmpty()) {
				for (String bulkInfo : bulkInfos) {
					addToJSON(json, bulkInfoService.find(bulkInfo));				
				}
			}
			return json.toString();			
		} catch(CmisObjectNotFoundException _ex) {
			LOGGER.warn("Cannot find Model in repository parentTypes: {} defaultTypes:{} bulkInfos:{}",parentTypes,defaultTypes, bulkInfos);
			return null;
		}
	}
}
