package it.cnr.jconon.cmis.model;

import java.util.ArrayList;
import java.util.List;

import org.alfresco.cmis.client.AlfrescoAspects;
import org.springframework.extensions.surf.ServletUtil;

public enum JCONONPolicyType {
	INCOMPLETE_ASPECT("P:sys:incomplete", "sys:incomplete"),
	JCONON_MACRO_CALL("P:jconon_call:aspect_macro_call", "jconon_call:aspect_macro_call"),
	JCONON_APPLICATION_ASPECT("P:jconon_application:aspects", "jconon_application:aspects"),
	JCONON_CALL_SUBMIT_APPLICATION("P:jconon_call:can_submit_application","jconon_call:can_submit_application"),
	JCONON_ATTACHMENT_GENERIC_DOCUMENT("P:jconon_attachment:generic_document","jconon_attachment:generic_document"),
	PEOPLE_SELECTED_PRODUCT("P:cvpeople:selectedProduct","cvpeople:selectedProduct"),
	PEOPLE_NO_SELECTED_PRODUCT("P:cvpeople:noSelectedProduct","cvpeople:noSelectedProduct"),
	TITLED_ASPECT("P:cm:titled", "cm:titled"),
	CV_COMMON_METADATA_ASPECT2("P:cvelement:commonMetadata2", "cvelement:commonMetadata2"),
	CV_COMMON_PREMIO("P:cvelement:commonPremio", "cvelement:commonPremio");

	
    private final String value;
    private final String queryName;
	public static String ASPECT_REQ_PARAMETER_NAME = "aspect";
	public static String ADD_REMOVE_ASPECT_REQ_PARAMETER_NAME = "add-remove-aspect";

    JCONONPolicyType(String v, String queryName) {
        value = v;
        this.queryName = queryName;
    }

    public String value() {
        return value;
    }

    public String queryName() {
        return queryName;
    }

    public static JCONONPolicyType fromValue(String v) {
        for (JCONONPolicyType c : JCONONPolicyType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

    public static JCONONPolicyType fromQueryName(String v) {
        for (JCONONPolicyType c : JCONONPolicyType.values()) {
            if (c.queryName.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }
    
    public static List<String> getAspectToBeAdd(){
    	List<String> results = new ArrayList<String>();
    	String[] aspects = ServletUtil.getRequest().getParameterValues(ADD_REMOVE_ASPECT_REQ_PARAMETER_NAME);
    	if (aspects != null)
	    	for (int i = 0; i < aspects.length; i++) {
				String name = aspects[i];
				if (name.startsWith("add-"))
					results.add(name.substring(4));
			}
    	return results;
    }
    
    public static List<String> getAspectToBeRemoved(){
    	List<String> results = new ArrayList<String>();
    	String[] aspects = ServletUtil.getRequest().getParameterValues(ADD_REMOVE_ASPECT_REQ_PARAMETER_NAME);
    	for (int i = 0; i < aspects.length; i++) {
			String name = aspects[i];
			if (name.startsWith("remove-"))
				results.add(name.substring(7));
		}
    	return results;
    }

    public static boolean isIncomplete(AlfrescoAspects alfrescoAspects){
    	return alfrescoAspects.hasAspect(INCOMPLETE_ASPECT.value);
    }
}
