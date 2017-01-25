package it.cnr.si.cool.jconon.util;


public enum TipoSelezione {
	COLLOQUIO(" il colloquio", "il colloquio previsto"), 
	PROVASCRITTA(" la prova scritta", "la prova scritta prevista"), 
	PRIMAPROVASCRITTA(" la prima prova scritta", "la prima prova scritta prevista"),
	SECONDAPROVASCRITTA(" la seconda prova scritta", "la seconda prova scritta prevista"), 
	ORALE(" l'orale", "l'orale previsto"),
	NESSUNA(null, null);
	
    private final String value;
    private final String label;

    TipoSelezione(String v, String label) {
        this.value = v;
        this.label = label;
    }

    public String value() {
        return value;
    }

    public String label() {
        return label;
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
