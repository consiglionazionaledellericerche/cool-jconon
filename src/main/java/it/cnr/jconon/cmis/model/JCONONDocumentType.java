package it.cnr.jconon.cmis.model;

public enum JCONONDocumentType {

    CMIS_DOCUMENT("cmis:document", "cmis:document"),
    JCONON_ATTACHMENT("D:jconon_attachment:document", "jconon_attachment:document"),
	JCONON_ATTACHMENT_MONO("D:jconon_attachment:document_mono", "jconon_attachment:document_mono"),
	JCONON_ATTACHMENT_MULTI("D:jconon_attachment:document_multi", "jconon_attachment:document_multi"),
	JCONON_ATTACHMENT_PRODOTTO("D:jconon_attachment:prodotto", "jconon_attachment:prodotto"),
	JCONON_ATTACHMENT_CALL_ABSTRACT("D:jconon_attachment:call_abstract","jconon_attachment:call_abstract"),
	JCONON_ATTACHMENT_CALL_GENERIC("D:jconon_attachment:call_generic","jconon_attachment:call_generic"),
	JCONON_ATTACHMENT_CALL_IT("D:jconon_attachment:call_it","jconon_attachment:call_it"),
	JCONON_ATTACHMENT_CALL_EN("D:jconon_attachment:call_en","jconon_attachment:call_en"),
	JCONON_ATTACHMENT_CALL_MOBILITY("D:jconon_attachment:call_mobility","jconon_attachment:call_mobility"),
	JCONON_ATTACHMENT_CALL_CORRECTION("D:jconon_attachment:call_correction","jconon_attachment:call_correction"),
	JCONON_ATTACHMENT_CALL_CORRECTION_PROROGATION("D:jconon_attachment:call_correction_prorogation","jconon_attachment:call_correction_prorogation"),
	JCONON_ATTACHMENT_CALL_COMMISSION("D:jconon_attachment:call_commission","jconon_attachment:call_commission"),
	JCONON_ATTACHMENT_CALL_CLASSIFICATION("D:jconon_attachment:call_classification","jconon_attachment:call_classification"),
	JCONON_ATTACHMENT_APPLICATION("D:jconon_attachment:application","jconon_attachment:application"),
	JCONON_ATTACHMENT_SCHEDA_VALUTAZIONE("D:jconon_attachment:scheda_valutazione","jconon_attachment:scheda_valutazione"),
	JCONON_ATTACHMENT_SCHEDA_ANONIMA_SINTETICA_GENERATED("D:jconon_scheda_anonima:generated_document","jconon_scheda_anonima:generated_document"),
	JCONON_ATTACHMENT_CONVOVCAZIONE("D:jconon_convocazione:attachment","jconon_convocazione:attachment"),	
	JCONON_ATTACHMENT_TESI_LAUREA("D:jconon_tesi_laurea:attachment","jconon_tesi_laurea:attachment"),
	JCONON_ATTACHMENT_DOCUMENTO_RICONOSCIMENTO("D:jconon_documento_riconoscimento:attachment","jconon_documento_riconoscimento:attachment"),
	JCONON_ATTACHMENT_NULLAOSTA_ALTRO_ENTE("D:jconon_nulla_osta_altro_ente:attachment","jconon_nulla_osta_altro_ente:attachment"),
	JCONON_ATTACHMENT_CURRICULUM_VITAE("D:jconon_curriculum_vitae:attachment","jconon_curriculum_vitae:attachment"),
	JCONON_ATTACHMENT_CURRICULUM_VITAE_NOT_REQUIRED("D:jconon_curriculum_vitae:attachment_not_required","jconon_curriculum_vitae:attachment_not_required"),
	JCONON_ATTACHMENT_ALLEGATO_GENERICO("D:jconon_allegato_generico:attachment","jconon_allegato_generico:attachment"),
	JCONON_ATTACHMENT_VERIFICA_ATTIVITA("D:jconon_modello_verifica_attivita:attachment","jconon_modello_verifica_attivita:attachment"),
	JCONON_ATTACHMENT_RELAZIONE_ATTIVITA("D:jconon_relazione_attivita_svolta:attachment","jconon_relazione_attivita_svolta:attachment"),
	JCONON_ATTACHMENT_SCHEDA_ANONIMA("D:jconon_scheda_anonima:document","jconon_scheda_anonima:document"),
	JCONON_ATTACHMENT_CURRICULUM_PROD_SCELTI_MULTIPLO("D:jconon_curriculum_vitae:attachment_prodotti_scelti_multiplo","jconon_curriculum_vitae:attachment_prodotti_scelti_multiplo");

    private final String value;
    private final String queryName;

    JCONONDocumentType(String v, String queryName) {
        value = v;
        this.queryName = queryName;
    }

    public String value() {
        return value;
    }

    public String queryName() {
        return queryName;
    }

    public static JCONONDocumentType fromValue(String v) {
        for (JCONONDocumentType c : JCONONDocumentType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }
}
