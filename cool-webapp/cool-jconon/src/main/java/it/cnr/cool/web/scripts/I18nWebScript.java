package it.cnr.cool.web.scripts;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;

public class I18nWebScript extends CMISWebScript {

	// Logger
	private static final Logger LOGGER = LoggerFactory.getLogger(I18nWebScript.class);


	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req,
			Status status, Cache cache) {

		Map<String, Object> model = new HashMap<String, Object>();

		// HTTP Method
		String method = req.getParameter("method");

		// Browser URI
		String uri = req.getParameter("uri");

		model.put("i18n", getMessages(method, uri));
		LOGGER.debug("method: " +method + " uri:" + uri);
		return model;
	}
}
