package it.cnr.jconon.cmis.model;

public enum JCONONRelationshipType {
	JCONON_ATTACHMENT_IN_PRODOTTO("R:jconon_attachment:in_prodotto", "jconon_attachment:in_prodotto");
	
    private final String value;
    private final String queryName;

    JCONONRelationshipType(String v, String queryName) {
        value = v;
        this.queryName = queryName;
    }

    public String value() {
        return value;
    }

    public String queryName() {
        return queryName;
    }

    public static JCONONRelationshipType fromValue(String v) {
        for (JCONONRelationshipType c : JCONONRelationshipType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
