package it.cnr.jconon.web.scripts.application;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.util.StringUtil;
import it.cnr.cool.web.scripts.CMISWebScript;
import it.cnr.cool.web.scripts.exception.ClientMessageException;

import java.io.OutputStream;
import java.util.Map;

import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Format;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class ApplicationPasteWebScript extends CMISWebScript {
	@Autowired
	private CMISService cmisService;


	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req,
			Status status, Cache cache) {
		Map<String, Object> model =  super.executeImpl(req, status, cache);
		final String applicationSourceId = ServletUtil.getRequest().getParameter("applicationSourceId"),
				callTargetId =  req.getParameter("callTargetId");

		String link = cmisService.getBaseURL().concat("service/manage-application/paste");
		UrlBuilder url = new UrlBuilder(link);
		Response resp = cmisService.getHttpInvoker(cmisService.getAdminSession()).invokePOST(url, Format.JSON.mimetype(),
				new Output() {
			@Override
			public void write(OutputStream out) throws Exception {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("applicationSourceId", applicationSourceId);
				jsonObject.put("callTargetId", callTargetId);
				out.write(jsonObject.toString().getBytes());
			}
		}, cmisService.getAdminSession());
		int stato = resp.getResponseCode();
		if (stato == HttpStatus.SC_BAD_REQUEST || stato == HttpStatus.SC_INTERNAL_SERVER_ERROR) {
			try {
				JSONObject jsonObject = new JSONObject(resp.getErrorContent());
				throw new ClientMessageException(jsonObject.getString("message"));
			} catch (JSONException e) {
				throw new ClientMessageException("message.application.for.copy.alredy.exists");
			}
		}
		if (stato == HttpStatus.SC_NOT_FOUND) {
			throw new WebScriptException("Paste Application error. Exception: " + resp.getErrorContent());
		}
		try {
			JSONObject jsonObject = new JSONObject(StringUtil.convertStreamToString(resp.getStream()));
			model.put("objectId", jsonObject.getString("cmis:objectId"));
		} catch (JSONException e) {
			throw new WebScriptException("Paste Application error. Exception: " + resp.getErrorContent());
		}
		return model;
	}
}