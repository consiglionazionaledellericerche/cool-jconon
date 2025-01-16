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

package it.cnr.si.cool.jconon.cmis.model;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.commons.PropertyIds;


public enum JCONONPolicyType {
	INCOMPLETE_ASPECT("P:sys:incomplete", "sys:incomplete"),
    OWNABLE("P:cm:ownable", "cm:ownable"),
	JCONON_MACRO_CALL("P:jconon_call:aspect_macro_call", "jconon_call:aspect_macro_call"),
	JCONON_APPLICATION_ASPECT("P:jconon_application:aspects", "jconon_application:aspects"),
	JCONON_CALL_SUBMIT_APPLICATION("P:jconon_call:can_submit_application","jconon_call:can_submit_application"),
	JCONON_ATTACHMENT_GENERIC_DOCUMENT("P:jconon_attachment:generic_document","jconon_attachment:generic_document"),
    JCONON_ATTACHMENT_ATTACHED("P:jconon_attachment:attached","jconon_attachment:attached"),

    JCONON_CALL_ASPECT_INQUADRAMENTO("P:jconon_call:aspect_inquadramento", "jconon_call:aspect_inquadramento"),
	JCONON_CALL_ASPECT_TIPO_SELEZIONE("P:jconon_call:aspect_tipo_selezione", "jconon_call:aspect_tipo_selezione"),
	JCONON_CALL_ASPECT_LINGUE_DA_CONOSCERE("P:jconon_call:aspect_lingue_da_conoscere", "jconon_call:aspect_lingue_da_conoscere"),
	JCONON_CALL_ASPECT_SETTORE_TECNOLOGICO("P:jconon_call:aspect_settore_tecnologico", "jconon_call:aspect_settore_tecnologico"),
	JCONON_CALL_ASPECT_MACROAREA_DIPARTIMENTALE("P:jconon_call:aspect_macroarea_dipartimentale", "jconon_call:aspect_macroarea_dipartimentale"),
	JCONON_CALL_ASPECT_GU("P:jconon_call:aspect_gu", "jconon_call:aspect_gu"),
    JCONON_CALL_ASPECT_INPA("P:jconon_call:aspect_inpa", "jconon_call:aspect_inpa"),
    JCONON_CALL_ASPECT_PRODUCTS_AFTER_COMMISSION("P:jconon_call:selected_products_after_commission", "jconon_call:selected_products_after_commission"),

	JCONON_SCHEDA_ANONIMA_VALUTAZIONE("P:jconon_scheda_anonima:valutazione","jconon_scheda_anonima:valutazione"),
    JCONON_PROTOCOLLO("P:jconon_protocollo:common","jconon_protocollo:common"),
	JCONON_ATTACHMENT_FROM_RDP("P:jconon_attachment:document_from_rdp","jconon_attachment:document_from_rdp"),
    JCONON_APPLICATION_ASPECT_POSSESSO_REQUISITI("P:jconon_application:aspect_possesso_requisiti","jconon_application:aspect_possesso_requisiti"),
    JCONON_APPLICATION_ASPECT_GODIMENTO_DIRITTI("P:jconon_application:aspect_godimento_diritti","jconon_application:aspect_godimento_diritti"),
	JCONON_APPLICATION_ASPECT_ISCRIZIONE_LISTE_ELETTORALI("P:jconon_application:aspect_iscrizione_liste_elettorali","jconon_application:aspect_iscrizione_liste_elettorali"),
	JCONON_APPLICATION_ASPECT_CONDANNE_PENALI_REQUIRED("P:jconon_application:aspect_condanne_penali_required","jconon_application:aspect_condanne_penali_required"),
	JCONON_APPLICATION_ASPECT_CONDANNE_PENALI_RAPPORTO_LAVORO("P:jconon_application:aspect_condanne_penali_rapporto_lavoro","jconon_application:aspect_condanne_penali_rapporto_lavoro"),
    JCONON_APPLICATION_PUNTEGGI("P:jconon_application:aspect_punteggi","jconon_application:aspect_punteggi"),

    JCONON_ATTACHMENT_PROROGATION("P:jconon_attachment:prorogation", "jconon_attachment:prorogation"),
    JCONON_ATTACHMENT_NOT_REQUIRED("P:jconon_attachment:document_not_required", "jconon_attachment:document_not_required"),
    JCONON_ATTACHMENT_REQUIRED("P:jconon_attachment:document_required", "jconon_attachment:document_required"),

	PEOPLE_SELECTED_PRODUCT("P:cvpeople:selectedProduct","cvpeople:selectedProduct"),
	PEOPLE_NO_SELECTED_PRODUCT("P:cvpeople:noSelectedProduct","cvpeople:noSelectedProduct"),
	TITLED_ASPECT("P:cm:titled", "cm:titled"),
	CV_COMMON_METADATA_ASPECT2("P:cvelement:commonMetadata2", "cvelement:commonMetadata2"),
	CV_COMMON_PREMIO("P:cvelement:commonPremio", "cvelement:commonPremio");

	
    private final String value;
    private final String queryName;
	public static final String ASPECT_REQ_PARAMETER_NAME = "aspect";
	public static final String ADD_REMOVE_ASPECT_REQ_PARAMETER_NAME = "add-remove-aspect";

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
