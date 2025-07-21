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

public enum JCONONPropertyIds {
    CM_OWNER("cm:owner"),

	/**
	 * Property of Documents
	 */
    ORIGINAL_FILE_NAME("jconon_attachment:originalFileName"),
    ATTACHMENT_USER("jconon_attachment:user"),
    ATTACHMENT_SCHEDA_VALUTAZIONE_COMMENTO("jconon_attachment:scheda_valutazione_commento"),
    SCHEDA_ANONIMA_VALUTAZIONE_ESITO("jconon_scheda_anonima:valutazione_esito"),
    /**
     * Property of Domanda
     */
    DOMANDA_NUMERO_MAX_DOMANDE("jconon_bando:numero_max_domande"),
    DOMANDA_STATO("jconon_domanda_facsimile:stato_domanda"),
    DOMANDA_USER("jconon_domanda_facsimile:user"),
    
    /**
     * Property of Call
     */
    CALL_CODICE("jconon_call:codice"),
    CALL_DESCRIZIONE("jconon_call:descrizione"),
    CALL_DESCRIZIONE_EN("jconon_call:descrizione_en"),
    CALL_DESCRIZIONE_RIDOTTA("jconon_call:descrizione_ridotta"),
    CALL_SEDE("jconon_call:sede"),
    CALL_SEDE_EN("jconon_call:sede_en"),
    CALL_STRUTTURA_DESTINATARIA("jconon_call:struttura_destinataria"),
    CALL_STRUTTURA_DESTINATARIA_EN("jconon_call:struttura_destinataria_en"),
    CALL_PROGETTO("jconon_call:progetto"),
    CALL_PROGETTO_EN("jconon_call:progetto_en"),
    CALL_NUMERO_POSTI("jconon_call:numero_posti"),
    CALL_AREA_SCIENTIFICA("jconon_call:area_scientifica"),
    CALL_AREA_SCIENTIFICA_EN("jconon_call:area_scientifica_en"),
    CALL_DATA_INIZIO_INVIO_DOMANDE_INITIAL("jconon_call:data_inizio_invio_domande"),
    CALL_DATA_FINE_INVIO_DOMANDE_INITIAL("jconon_call:data_fine_invio_domande"),
    CALL_DATA_INIZIO_INVIO_DOMANDE("jconon_call:data_inizio_invio_domande_index"),
    CALL_DATA_FINE_INVIO_DOMANDE("jconon_call:data_fine_invio_domande_index"),
    CALL_NUM_GIORNI_MAIL_SOLLECITO("jconon_call:num_giorni_mail_sollecito"),
    CALL_REQUISITI_LINK("jconon_call:requisiti_link"),
    CALL_REQUISITI_LINK_EN("jconon_call:requisiti_link_en"),
    CALL_REQUISITI("jconon_call:requisiti"),
    CALL_REQUISITI_EN("jconon_call:requisiti_en"),
    CALL_PROGRAMMA_RICERCA("jconon_call:programma_ricerca"),
    CALL_PROGRAMMA_RICERCA_EN("jconon_call:programma_ricerca_en"),
    CALL_RESP_PROGRAMMA_RICERCA("jconon_call:resp_programma_ricerca"),
    CALL_NUMERO_GU("jconon_call:numero_gu"),
    CALL_DATA_GU("jconon_call:data_gu_index"),
    CALL_DATA_INPA("jconon_call:data_pubblicazione_inpa"),
    CALL_NEW_NUMERO_GU("jconon_call:new_numero_gu"),
    CALL_NEW_DATA_GU("jconon_call:new_data_gu"),
    CALL_PROFILO("jconon_call:profilo"),
    CALL_PROFILO_EN("jconon_call:profilo_en"),
    CALL_NR_LIVELLO_PROFESSIONALE("jconon_call:nr_livello_professionale"),
    CALL_ELENCO_ASPECTS("jconon_call:elenco_aspects"),
    CALL_ELENCO_ASPECTS_SEZIONE_CNR("jconon_call:elenco_aspects_sezione_cnr"),
    CALL_ELENCO_ASPECTS_ULTERIORI_DATI("jconon_call:elenco_aspects_ulteriori_dati"),
    CALL_ELENCO_ASPECTS_SEZIONE_4("jconon_call:elenco_aspects_sezione_4"),
    CALL_ELENCO_ASPECTS_SEZIONE_5("jconon_call:elenco_aspects_sezione_5"),
    CALL_ELENCO_SEZIONI_DOMANDA("jconon_call:elenco_sezioni_domanda"),
    CALL_ELENCO_ASSOCIATIONS("jconon_call:elenco_association"),
    CALL_ELENCO_FIELD_NOT_REQUIRED("jconon_call:elenco_field_not_required"),
    CALL_ELENCO_TIPO_SELEZIONE("jconon_call:elenco_tipo_selezione"),
    CALL_ELENCO_TIPO_SELEZIONE_EN("jconon_call:elenco_tipo_selezione_en"),
    CALL_ELENCO_SEZIONE_CURRICULUM("jconon_call:elenco_sezioni_curriculum"),
    CALL_ELENCO_SEZIONE_CURRICULUM_ULTERIORE("jconon_call:elenco_sezioni_curriculum_ulteriore"),
    CALL_ELENCO_SEZIONE_SCHEDE_ANONIME("jconon_call:elenco_schede_anonime"),
    CALL_ELENCO_SEZIONE_PRODOTTI("jconon_call:elenco_prodotti"),
    CALL_NUMERO_MAX_DOMANDE("jconon_call:numero_max_domande"),
    CALL_GROUP_MULTIPLE_APPLICATION("jconon_call:group_multiple_application"),
    CALL_HAS_MACRO_CALL("jconon_call:has_macro_call"),
    CALL_PUBBLICATO("jconon_call:pubblicato"),
    CALL_COMMISSIONE("jconon_call:commissione"),
    CALL_RDP("jconon_call:rdp"),
    CALL_NUMERO_MAX_PRODOTTI("jconon_call:numero_max_prodotti"),
    CALL_ELENCO_SETTORI_TECNOLOGICI("jconon_call:elenco_settori_tecnologici"),
    CALL_ELENCO_MACROAREE("jconon_call:elenco_macroaree"),
    CALL_BLOCCO_INVIO_DOMANDE("jconon_call:blocco_invio_domande"),
    CALL_STATO("jconon_call:stato"),    
    CALL_BLOCCO_INVIO_DOMANDE_MESSAGE("jconon_call:blocco_invio_domande_message"),
    CALL_ID_CATEGORIA_TECNICO_HELPDESK("jconon_call:id_categoria_tecnico_helpdesk"),
    CALL_ID_CATEGORIA_NORMATIVA_HELPDESK("jconon_call:id_categoria_normativa_helpdesk"),
    CALL_FLAG_SCHEDA_ANONIMA_SINTETICA("jconon_call:scheda_anonima_sintetica"),
    CALL_GRADUATORIA("jconon_call:graduatoria"),
    CALL_GRADUATORIA_DATA("jconon_call:data_pubbl_graduatoria"),
    CALL_GROUP_CAN_SUBMIT_APPLICATION("jconon_call:group_can_submit_application"),
    CALL_ONLY_USER_SPID_CAN_SUBMIT_APPLICATION("jconon_call:only_user_spid_can_submit_application"),
    CALL_SELECTED_PRODUCT_START_DATE("jconon_call:selected_products_start_date"),
    CALL_SELECTED_PRODUCT_END_DATE("jconon_call:selected_products_end_date"),
    CALL_SELECTED_PRODUCT_USERS("jconon_call:selected_products_users"),
    CALL_SELECTED_PRODUCT_ONLY_LIST("jconon_call:selected_products_only_list"),
    CALL_ASPECT_RECALL_NODEREF("jconon_call_aspect_recall:noderef"),
    CALL_ASPECT_PTA_NODEREF("jconon_attachment_pta:noderef"),
    /**
     * Property of Application
     */
    APPLICATION_COGNOME("jconon_application:cognome"),
    APPLICATION_NOME("jconon_application:nome"),
    APPLICATION_DATA_NASCITA("jconon_application:data_nascita"),
    APPLICATION_SESSO("jconon_application:sesso"),
    APPLICATION_NAZIONE_NASCITA("jconon_application:nazione_nascita"),
    APPLICATION_COMUNE_NASCITA("jconon_application:comune_nascita"),
    APPLICATION_PROVINCIA_NASCITA("jconon_application:provincia_nascita"),
    APPLICATION_CODICE_FISCALE("jconon_application:codice_fiscale"),
    APPLICATION_NAZIONE_RESIDENZA("jconon_application:nazione_residenza"),
    APPLICATION_COMUNE_RESIDENZA("jconon_application:comune_residenza"),
    APPLICATION_PROVINCIA_RESIDENZA("jconon_application:provincia_residenza"),
    APPLICATION_INDIRIZZO_RESIDENZA("jconon_application:indirizzo_residenza"),
    APPLICATION_NUM_CIVICO_RESIDENZA("jconon_application:num_civico_residenza"),
    APPLICATION_CAP_RESIDENZA("jconon_application:cap_residenza"),
    APPLICATION_FL_CITTADINO_ITALIANO("jconon_application:fl_cittadino_italiano"),
    APPLICATION_NAZIONE_CITTADINANZA("jconon_application:nazione_cittadinanza"),
    APPLICATION_NAZIONE_COMUNICAZIONI("jconon_application:nazione_comunicazioni"),
    APPLICATION_COMUNE_COMUNICAZIONI("jconon_application:comune_comunicazioni"),
    APPLICATION_PROVINCIA_COMUNICAZIONI("jconon_application:provincia_comunicazioni"),
    APPLICATION_INDIRIZZO_COMUNICAZIONI("jconon_application:indirizzo_comunicazioni"),
    APPLICATION_NUM_CIVICO_COMUNICAZIONI("jconon_application:num_civico_comunicazioni"),
    APPLICATION_CAP_COMUNICAZIONI("jconon_application:cap_comunicazioni"),
    APPLICATION_EMAIL_COMUNICAZIONI("jconon_application:email_comunicazioni"),
    APPLICATION_EMAIL_PEC_COMUNICAZIONI("jconon_application:email_pec_comunicazioni"),
    APPLICATION_TELEFONO_COMUNICAZIONI("jconon_application:telefono_comunicazioni"),
    APPLICATION_DATA_DOMANDA("jconon_application:data_domanda"),
    APPLICATION_STATO_DOMANDA("jconon_application:stato_domanda"),
    APPLICATION_ESCLUSIONE_RINUNCIA("jconon_application:esclusione_rinuncia"),
    APPLICATION_RITIRO("jconon_application:fl_ritiro"),
    APPLICATION_ESITO_CALL("jconon_application:esito_call"),
    APPLICATION_USER("jconon_application:user"),
    APPLICATION_FL_POSSESSO_REQUISITI("jconon_application:fl_possesso_requisiti"),
    APPLICATION_FL_ISCRITTO_LISTE_ELETTORALI("jconon_application:fl_iscritto_liste_elettorali"),
    APPLICATION_COMUNE_LISTE_ELETTORALI("jconon_application:comune_liste_elettorali"),
    APPLICATION_PROVINCIA_LISTE_ELETTORALI("jconon_application:provincia_liste_elettorali"),
    APPLICATION_MOTIVAZIONE_NO_LISTE_ELETTORALI("jconon_application:motivazione_no_iscrizione_liste_elettorali"),
    APPLICATION_FL_GODIMENTO_DIRITTI("jconon_application:fl_godimento_diritti"),
    APPLICATION_MOTIVAZIONE_NO_GODIMENTO_DIRITTI("jconon_application:motivazione_no_godimento_diritti"),
    APPLICATION_FL_CONDANNE_PENALI("jconon_application:fl_condanne_penali"),
    APPLICATION_ESTREMI_SENTENZE_PENALI("jconon_application:estremi_sentenze_penali"),
    APPLICATION_FL_DESTITUITO_ALTRO_IMPIEGO("jconon_application:fl_destituito_altro_impiego"),
    APPLICATION_MOTIVAZIONE_DESTITUITO_ALTRO_IMPIEGO("jconon_application:motivazione_destituito_altro_impiego"),
    APPLICATION_FL_SERVIZIOCNR("jconon_application:fl_servizioCNR"),
    APPLICATION_STRUTTURA_CNR("jconon_application:struttura_cnr"),
    APPLICATION_TITOLO_SERVIZIO_CNR("jconon_application:titolo_servizio_cnr"),
    APPLICATION_FL_DIRETTORE_CNR("jconon_application:fl_direttore"),
    APPLICATION_FL_SERVIZIO_ALTRE_AMMINISTRAZIONI("jconon_application:fl_servizio_altre_amministrazioni"),
    APPLICATION_STRUTTURA_ALTRE_AMMINISTRAZIONI("jconon_application:struttura_altre_amministrazioni"),
    APPLICATION_TITOLO_SERVIZIO_ALTRE_AMMINISTRAZIONI("jconon_application:titolo_servizio_altre_amministrazioni"),
    APPLICATION_FL_IDONEITA_FISICA("jconon_application:fl_idoneita_fisica"),
    APPLICATION_FL_TITOLO_RISERVA_POSTI("jconon_application:fl_titolo_riserva_posti"),
    APPLICATION_MOTIVAZIONE_RISERVA_POSTI("jconon_application:motivazione_riserva_posti"),
    APPLICATION_FL_DIPLOMA("jconon_application:fl_diploma"),
    APPLICATION_TIPO_DIPLOMA("jconon_application:tipo_diploma"),
    APPLICATION_DATA_DIPLOMA("jconon_application:data_diploma"),
    APPLICATION_PUNTEGGIO_DIPLOMA("jconon_application:punteggio_diploma"),
    APPLICATION_ISTITUTO_DIPLOMA("jconon_application:istituto_diploma"),
    APPLICATION_FL_LAUREA("jconon_application:fl_laurea"),
    APPLICATION_FL_NULLA_OSTA("jconon_application:fl_nulla_osta"),
    APPLICATION_TIPO_LAUREA("jconon_application:tipo_laurea"),
    APPLICATION_DATA_LAUREA("jconon_application:data_laurea"),
    APPLICATION_PUNTEGGIO_LAUREA("jconon_application:punteggio_laurea"),
    APPLICATION_ISTITUTO_LAUREA("jconon_application:istituto_laurea"),
    APPLICATION_FL_LAUREA_EQUIPOLLENTE("jconon_application:fl_laurea_equipollente"),
    APPLICATION_FL_DOTTORATO("jconon_application:fl_dottorato"),
    APPLICATION_TIPO_DOTTORATO("jconon_application:tipo_dottorato"),
    APPLICATION_DATA_DOTTORATO("jconon_application:data_dottorato"),
    APPLICATION_ISTITUTO_DOTTORATO("jconon_application:istituto_dottorato"),
    APPLICATION_FL_DIVERSAMENTE_ABILE("jconon_application:fl_diversamente_abile"),
    APPLICATION_TEMPI_AGGIUNTIVI_DIVERSAMENTE_ABILE("jconon_application:tempi_aggiuntivi_diversamente_abile"),
    APPLICATION_AUSILI_DIVERSAMENTE_ABILE("jconon_application:ausili_diversamente_abile"),
    APPLICATION_FL_CONOSCENZA_LINGUA_ITALIANA("jconon_application:fl_conoscenza_lingua_italiana"),
    APPLICATION_FL_CONOSCENZA_INGLESE_INFORMATICA("jconon_application:fl_conoscenza_inglese_informatica"),
    APPLICATION_FL_ESPERIENZA("jconon_application:fl_esperienza"),
    APPLICATION_FL_ALTRE_BORSE_STUDIO("jconon_application:fl_altre_borse_studio"),
    APPLICATION_DESCRIZIONE_ALTRE_BORSE_STUDIO("jconon_application:descrizione_altre_borse_studio"),
    APPLICATION_FL_CONDIZIONE_ESCLUSIONE("jconon_application:fl_condizione_esclusione"),
    APPLICATION_FL_DICHIARAZIONE_DATI_PERSONALI("jconon_application:fl_dichiarazione_dati_personali"),
    APPLICATION_FL_DICHIARAZIONE_SANZIONI_PENALI("jconon_application:fl_dichiarazione_sanzioni_penali"),
    APPLICATION_FL_CONOSCENZA_INFORMATICA_AVANZATA("jconon_application:fl_conoscenza_informatica_avanzata"),
    APPLICATION_FL_POSSESSO_CITTADINANZA_ITALIANA("jconon_application:fl_possesso_cittadinanza_italiana"),
    APPLICATION_DUMMY("jconon_application:dummy"),
    APPLICATION_GRADUATORIA("jconon_application:graduatoria"),
    APPLICATION_TOTALE_PUNTEGGIO("jconon_application:totale_punteggio"),
    APPLICATION_FL_SELECTED_PRODUCT_FINISHED("jconon_application:fl_selected_product_finished"),
    APPLICATION_PUNTEGGIO_NOTE("jconon_application:punteggio_note"),

    APPLICATION_PROT_NUMERO_GRADUATORIA("jconon_application:protocollo_numero_graduatoria"),
    APPLICATION_PROT_DATA_GRADUATORIA("jconon_application:protocollo_data_graduatoria"),
    APPLICATION_PROT_NUMERO_IDONEO("jconon_application:protocollo_numero_assunzione_idoneo"),
    APPLICATION_PROT_DATA_IDONEO("jconon_application:protocollo_data_assunzione_idoneo"),

    ATTACHMENT_DATA_INIZIO("jconon_attachment:data_inizio"),
    ATTACHMENT_DATA_FINE("jconon_attachment:data_fine"),

    ATTACHMENT_PTA_CODICE("jconon_attachment_pta:codice"),
    ATTACHMENT_PTA_DESCRIZIONE("jconon_attachment_pta:descrizione"),
    ATTACHMENT_PTA_INIZIO("jconon_attachment_pta:inizio"),
    ATTACHMENT_PTA_FINE("jconon_attachment_pta:fine"),

    CONVOCAZIONE_NUMERO("jconon_convocazione:numero"),
    CONVOCAZIONE_STATO("jconon_convocazione:stato"),
    CONVOCAZIONE_DATA("jconon_convocazione:data"),
    CONVOCAZIONE_LUOGO("jconon_convocazione:luogo"),
    CONVOCAZIONE_TIPO_SELEZIONE("jconon_convocazione:tipoSelezione"),
    CONVOCAZIONE_EMAIL("jconon_convocazione:email"),
    CONVOCAZIONE_EMAIL_PEC("jconon_convocazione:email_pec"),

    DOCUMENTO_RICONOSCIMENTO_TIPOLOGIA("jconon_documento_riconoscimento:tipologia"),
    DOCUMENTO_RICONOSCIMENTO_NUMERO("jconon_documento_riconoscimento:numero"),
    DOCUMENTO_RICONOSCIMENTO_DATA_SCADENZA("jconon_documento_riconoscimento:data_scadenza"),
    DOCUMENTO_RICONOSCIMENTO_EMITTENTE("jconon_documento_riconoscimento:emittente"),

    COMMISSIONE_USERNAME("jconon_commissione:username"),
    COMMISSIONE_APPELLATIVO("jconon_commissione:appellativo"),
    COMMISSIONE_COGNOME("jconon_commissione:cognome"),
    COMMISSIONE_NOME("jconon_commissione:nome"),
    COMMISSIONE_SESSO("jconon_commissione:sesso"),
    COMMISSIONE_QUALIFICA("jconon_commissione:qualifica"),
    COMMISSIONE_RUOLO("jconon_commissione:ruolo"),
    COMMISSIONE_EMAIL("jconon_commissione:email"),

    ATTACHMENT_RELATED("jconon_attachment:attached_related"),

    PROTOCOLLO_NUMERO("jconon_protocollo:numero"),
    PROTOCOLLO_DATA("jconon_protocollo:data");
    
    
    private final String value;

    JCONONPropertyIds(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static JCONONPropertyIds fromValue(String v) {
        for (JCONONPropertyIds c : JCONONPropertyIds.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }
}
