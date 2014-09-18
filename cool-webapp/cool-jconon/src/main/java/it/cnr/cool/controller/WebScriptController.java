package it.cnr.cool.controller;

import java.util.HashSet;
import java.util.Set;

import org.springframework.web.servlet.mvc.UrlFilenameViewController;

public class WebScriptController extends UrlFilenameViewController {
	/** HTTP method "DELETE" */
	public static final String METHOD_DELETE = "DELETE";
	/** HTTP method "PUT" */
	public static final String METHOD_PUT = "PUT";
	
	
	public WebScriptController() {
		super();
		init();
	}

	public void init(){
		Set<String> supportedMethods = new HashSet<String>(6);
		supportedMethods.add(METHOD_GET);
		supportedMethods.add(METHOD_HEAD);
		supportedMethods.add(METHOD_POST);
		supportedMethods.add(METHOD_DELETE);
		supportedMethods.add(METHOD_PUT);
		setSupportedMethods(supportedMethods.toArray(new String[supportedMethods.size()]));
	}
}
