/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.pagopa.model;

public enum PAGOPAPropertyIds {
    CALL_PAGAMENTO_PAGOPA("jconon_call:pagamento_pagopa"),
    CALL_IMPORTO_PAGAMENTO_PAGOPA("jconon_call:importo_pagamento_pagopa"),
    /**
     * Property of Application
     */
    APPLICATION_NUMERO_AVVISO_PAGOPA("jconon_application:numero_avviso_pagopa"),
    APPLICATION_NUMERO_PROTOCOLLO_PAGOPA("jconon_application:numero_protocollo_pagopa"),
    APPLICATION_CCP_PAGOPA("jconon_application:ccp_pagopa"),
    APPLICATION_RIFERIMENTO_AVVISO("jconon_application:riferimento_avviso_pagopa"),
    ATTACHMENT_ESTREMI_PAGAMENTO_DIRITTI_SEGRETERIA("jconon_pagamenti_diritti_segreteria:estremi_pagamento");
    private final String value;

    PAGOPAPropertyIds(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

}
