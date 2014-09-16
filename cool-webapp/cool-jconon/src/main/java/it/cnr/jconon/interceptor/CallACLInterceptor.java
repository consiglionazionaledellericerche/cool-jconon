package it.cnr.jconon.interceptor;

import it.cnr.cool.interceptor.ProxyInterceptor;
import it.cnr.jconon.service.cache.CallTypeService;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.webscripts.WebScriptException;

public class CallACLInterceptor extends ProxyInterceptor {

	private List<String> groupNames;
	@Autowired
	private CallTypeService callTypeService;
	private static final Logger LOGGER = LoggerFactory.getLogger(CallACLInterceptor.class);

	public void setGroupNames(List<String> groupNames) {
		this.groupNames = groupNames;
	}

	@Override
	public void invokeBeforePost(String url, HttpServletRequest req,
			InputStream content) {
		super.invokeBeforePost(url, req, content);
		String objectId = url.replace(getPath(), "").replace("workspace", "workspace:/");
		try{
			CmisObject cmisObject = cmisService.createAdminSession().getObject(objectId);
			if (isCall(cmisObject.getType().getId())) {
				try {
					JSONObject jsonObj = new JSONObject(IOUtils.toString(content));
					JSONArray jsonArray = jsonObj.getJSONArray("permissions");
					for (int i = 0; i < jsonArray.length(); i++) {
						JSONObject jsonPermission = (JSONObject) jsonArray.get(i);
						if (groupNames.contains(jsonPermission.getString("authority")) ||
								jsonPermission.getString("authority").contains(cmisObject.getName())) {
							throw new WebScriptException(HttpStatus.SC_PRECONDITION_FAILED, "");
						}
					}
					LOGGER.debug(jsonObj.toString());
				} catch (JSONException e) {
					LOGGER.error("Call cache is not a valid json");
				} catch (IOException e) {
					LOGGER.error("Call cache is not a valid json");
				}
			}
		} catch (CmisObjectNotFoundException ex){
			LOGGER.debug("Object " + objectId + " is not a cmis object");
		}
	}

	public boolean isCall(String typeId) {
		try {
			JSONArray json = new JSONArray(callTypeService.get());
			for (int i = 0; i < json.length(); i++) {
				JSONObject jsonObj = (JSONObject) json.get(i);
				if (jsonObj.getString("id").equals(typeId)) {
					return true;
				}
			}
		} catch (JSONException e) {
			LOGGER.error("Call cache is not a valid json");
		}
		return false;
	}
}
