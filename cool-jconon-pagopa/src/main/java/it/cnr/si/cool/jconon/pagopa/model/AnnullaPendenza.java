
package it.cnr.si.cool.jconon.pagopa.model;

import java.io.Serializable;

public class AnnullaPendenza extends AggiornaPendenza implements Serializable {
    public AnnullaPendenza() {
        super("REPLACE", "/stato","ANNULLATA");
    }
}
