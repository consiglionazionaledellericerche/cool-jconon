package it.cnr.jconon.util;


public enum Profile {
	DEVELOPMENT("dev"), PRODACTION("prod");
	
    private final String value;

    Profile(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static Profile fromValue(String v) {
        for (Profile c : Profile.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }	
}
