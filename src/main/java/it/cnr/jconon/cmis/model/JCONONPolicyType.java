package it.cnr.jconon.cmis.model;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.commons.PropertyIds;


public enum JCONONPolicyType {
	INCOMPLETE_ASPECT("P:sys:incomplete", "sys:incomplete"),
	JCONON_MACRO_CALL("P:jconon_call:aspect_macro_call", "jconon_call:aspect_macro_call"),
	JCONON_APPLICATION_ASPECT("P:jconon_application:aspects", "jconon_application:aspects"),
	JCONON_CALL_SUBMIT_APPLICATION("P:jconon_call:can_submit_application","jconon_call:can_submit_application"),
	JCONON_ATTACHMENT_GENERIC_DOCUMENT("P:jconon_attachment:generic_document","jconon_attachment:generic_document"),
	JCONON_CALL_ASPECT_INQUADRAMENTO("P:jconon_call:aspect_inquadramento", "jconon_call:aspect_inquadramento"),
	JCONON_CALL_ASPECT_TIPO_SELEZIONE("P:jconon_call:aspect_tipo_selezione", "jconon_call:aspect_tipo_selezione"),
	JCONON_CALL_ASPECT_GU("P:jconon_call:aspect_gu", "jconon_call:jconon_call:aspect_gu"),
	JCONON_SCHEDA_ANONIMA_VALUTAZIONE("P:jconon_scheda_anonima:valutazione","jconon_scheda_anonima:valutazione"),
	JCONON_ATTACHMENT_FROM_RDP("P:jconon_attachment:document_from_rdp","jconon_attachment:document_from_rdp"),
	
	
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

    public static boolean isIncomplete(CmisObject cmisObject){
    	return cmisObject.getProperty(PropertyIds.SECONDARY_OBJECT_TYPE_IDS).getValues().contains(INCOMPLETE_ASPECT.value);
    }
    
}
