package it.cnr.jconon.util;


public enum TipoSelezione {
	COLLOQUIO(" il colloquio"), PROVASCRITTA(" la prova scritta"), PRIMAPROVASCRITTA(" la prima prova scritta"),
	SECONDAPROVASCRITTA(" la seconda prova scritta"), ORALE(" l'orale");
	
    private final String value;

    TipoSelezione(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static TipoSelezione fromValue(String v) {
        for (TipoSelezione c : TipoSelezione.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }	
}
