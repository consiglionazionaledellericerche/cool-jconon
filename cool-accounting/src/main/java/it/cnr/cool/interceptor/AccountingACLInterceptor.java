package it.cnr.cool.interceptor;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.alfresco.cmis.client.AlfrescoDocument;
import org.alfresco.cmis.client.AlfrescoFolder;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class AccountingACLInterceptor extends ProxyInterceptor {
    private static final Logger LOGGER = LoggerFactory.getLogger(AccountingACLInterceptor.class);

	private String groupName;

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public void invokeAfterPost(String url, HttpServletRequest req, InputStream content, Response resp) {
		try {
			Set<String> addUsers = new HashSet<String>();
			Set<String> removeUsers = new HashSet<String>();
			JsonElement json = new JsonParser().parse(IOUtils.toString(content));
			JsonArray jsonArray = json.getAsJsonObject().get("permissions").getAsJsonArray();
			for (Iterator<JsonElement> iterator = jsonArray.iterator(); iterator.hasNext();) {
				JsonObject obj = iterator.next().getAsJsonObject();
				if (obj.get("remove") != null)
					removeUsers.add(obj.get("authority").getAsString());
				else
					addUsers.add(obj.get("authority").getAsString());
			}
			String objectId = url.replace(getPath(), "").replace("workspace", "workspace:/");
			CmisObject cmisObject = cmisService.createAdminSession().getObject(objectId);
			invoke(cmisObject, addUsers, HttpMethod.POST);
			invoke(cmisObject, removeUsers, HttpMethod.DELETE);
		} catch (Exception e) {
			LOGGER.error("Cannot add user to group", e);
		}
	};

	private void invoke(CmisObject cmisObject, Set<String> users, HttpMethod method) {
		if (!hasContabiliAspect(cmisObject))
			return;
		if (users != null){
			for (String user : users) {
				String link = cmisService.getBaseURL().concat("service/api/groups/").
						concat(groupName).concat("/children/").concat(user);
				UrlBuilder url = new UrlBuilder(link);
				if (method.equals(HttpMethod.POST))
					invokePost(url);
				else if (method.equals(HttpMethod.DELETE))
					invokeDelete(url);
				if (LOGGER.isDebugEnabled())
					LOGGER.debug("Add user "+user+" to group "+groupName);

			}
		}
	}


	private void invokePost(UrlBuilder url){
		CmisBindingsHelper.getHttpInvoker(cmisService.getAdminSession()).invokePOST(url, "application/json",
				new Output() {
					public void write(OutputStream out) throws Exception {
					}
				}, cmisService.getAdminSession());
	}

	private void invokeDelete(UrlBuilder url){
		CmisBindingsHelper.getHttpInvoker(cmisService.getAdminSession()).invokeDELETE(url, cmisService.getAdminSession());
	}

	public boolean hasContabiliAspect(CmisObject cmisObject){
		if (cmisObject.getBaseTypeId().equals(BaseTypeId.CMIS_FOLDER)){
			return ((AlfrescoFolder)cmisObject).hasAspect("P:sigla_contabili_aspect:folder");
		}else if (cmisObject.getBaseTypeId().equals(BaseTypeId.CMIS_DOCUMENT)) {
			return ((AlfrescoDocument)cmisObject).hasAspect("P:sigla_contabili_aspect:folder");
		}
		return false;
	}

}
