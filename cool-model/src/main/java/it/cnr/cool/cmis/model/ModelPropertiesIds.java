package it.cnr.cool.cmis.model;

public enum ModelPropertiesIds {

	/**
	 * Property of Models
	 */
	MODEL_TYPE_NAME("D:cm:dictionaryModel"),
	MODEL_QUERY_NAME("cm:dictionaryModel"),
    MODEL_ACTIVE("cm:modelActive"),
    MODEL_DESCRIPTION("cm:modelDescription"),
    MODEL_AUTHOR("cm:modelAuthor"),
	MODEL_VERSION("cm:modelVersion");

	 private final String value;

	 ModelPropertiesIds(String v) {
	        value = v;
	    }

	    public String value() {
	        return value;
	    }

	    public static ModelPropertiesIds fromValue(String v) {
	        for (ModelPropertiesIds c : ModelPropertiesIds.values()) {
	            if (c.value.equals(v)) {
	                return c;
	            }
	        }
	        throw new IllegalArgumentException(v);
	    }
}
