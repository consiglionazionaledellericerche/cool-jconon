package it.cnr.jconon.cmis.model;

public enum JCONONFolderType {
	JCONON_COMPETITION("F:jconon_competition:folder", "jconon_competition:folder"),
	JCONON_CALL("F:jconon_call:folder", "jconon_call:folder"),
	JCONON_CALL_TDET("F:jconon_call_tdet:folder", "jconon_call_tdet:folder"),
	JCONON_CALL_TIND("F:jconon_call_tind:folder", "jconon_call_tind:folder"),
	JCONON_CALL_BSTD("F:jconon_call_bstd:folder", "jconon_call_bstd:folder"),
	JCONON_CALL_ARIC("F:jconon_call_aric:folder", "jconon_call_aric:folder"),
	JCONON_CALL_MOBILITY("F:jconon_call_mobility:folder", "jconon_call_mobility:folder"),
	JCONON_CALL_MOBILITY_OPEN("F:jconon_call_mobility_open:folder", "jconon_call_mobility_open:folder"),
	JCONON_CALL_DIRECTOR("F:jconon_call_director:folder", "jconon_call_director:folder"),
	JCONON_CALL_EMPLOYEES("F:jconon_call_employees:folder", "jconon_call_employees:folder"),
	JCONON_APPLICATION("F:jconon_application:folder", "jconon_application:folder");
	
    private final String value;
    private final String queryName;

    JCONONFolderType(String v, String queryName) {
        value = v;
        this.queryName = queryName;
    }

    public String value() {
        return value;
    }

    public String queryName() {
        return queryName;
    }

    public static JCONONFolderType fromValue(String v) {
        for (JCONONFolderType c : JCONONFolderType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

    public static boolean isMobilityCall(String id){
    	try {
        	JCONONFolderType folderType = fromValue(id);
        	if (folderType.equals(JCONONFolderType.JCONON_CALL_MOBILITY) || folderType.equals(JCONONFolderType.JCONON_CALL_MOBILITY_OPEN))
        		return true;
        	return false;    		
    	} catch (IllegalArgumentException _ex) {
    		return false;
    	}
    }
}
