package it.cnr.si.cool.jconon.pagopa.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatoPendenzaVerificata {
    NON_ESEGUITA("NON_ESEGUITA"),
    ANNULLATA("ANNULLATA"),
    SCADUTA("SCADUTA"),
    DUPLICATA("DUPLICATA"),
    SCONOSCIUTA("SCONOSCIUTA");

    private String value;

    StatoPendenzaVerificata(String value) {
        this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
        return String.valueOf(value);
    }

    @JsonCreator
    public static StatoPendenzaVerificata fromValue(String text) {
        for (StatoPendenzaVerificata b : StatoPendenzaVerificata.values()) {
            if (String.valueOf(b.value).equals(text)) {
                return b;
            }
        }
        return null;
    }

}
