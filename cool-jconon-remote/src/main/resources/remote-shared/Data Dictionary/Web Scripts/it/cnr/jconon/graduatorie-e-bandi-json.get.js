// Configurazione iniziale e creazione dell'oggetto JSON di risposta
var pageSize = 100,
    competitionQuery = {
        page: { maxItems: 1 },
        language: 'cmis-strict',
        query: "select * from jconon_competition:folder"
    },
    competition = search.query(competitionQuery)[0];

// Oggetto JSON di risposta
var response = {
    graduatorie: {
       concorsi_pubblici: [],
       altre: []
    },
    bandi_pubblicati_mese_corrente: [],
};


// Funzione di utilità per formattare le date come gg/mm/aaaa
function formatDate(d) {
    if (!d) return "";
    var day = d.getDate();
    var month = d.getMonth() + 1; // I mesi partono da 0
    var year = d.getFullYear();
    // Aggiunge lo zero iniziale se giorno/mese è < 10
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    return day + "/" + month + "/" + year;
}

// Verifica se competition esiste
if (!competition) {
    logger.warn("Competition non trovato. Assicurarsi che il nodo esista.");
} else {

    // Calcola le date pivot (15 del mese corrente e 15 del mese precedente)
    var today = new Date();
    var meseCorrente = new Date(today.getFullYear(), today.getMonth(), 15);
    var mesePrecedente = new Date(today.getFullYear(), today.getMonth() - 1, 15);

/*******************************************************
 *                SEZIONE GRADUATORIE
 *******************************************************/
var graduatorieQuery =
    "SELECT * " +
    "FROM jconon_attachment:call_classification root " +
    "JOIN jconon_protocollo:common AS p ON root.cmis:objectId = p.cmis:objectId " +
    "WHERE IN_TREE(root, '" + competition.nodeRef + "') " +
      "AND p.jconon_protocollo:data >= TIMESTAMP '" + mesePrecedente.toISOString() + "' " +
      "AND p.jconon_protocollo:data < TIMESTAMP '" + meseCorrente.toISOString() + "'";

var sort1 = { column: 'cm:modified', ascending: false };
var def = {
    query: graduatorieQuery,
    store: 'workspace://SpacesStore',
    language: 'cmis-alfresco',
    sort: [sort1]
};

var results = search.query(def);
if (results != null) {
    results.forEach(function(graduatoria) {

        // (1) Recupera la data di protocollo e la formatta
        var dataProtocollo = graduatoria.properties['jconon_protocollo:data'];
        var dataProtocolloFormattata = formatDate(dataProtocollo);

        // (2) Query per le persone idonee
        var personeIdoneeQuery =
            "SELECT app.jconon_application:user, " +
                   "app.jconon_application:cognome, " +
                   "app.jconon_application:nome, " +
                   "app.jconon_application:esito_call " +
            "FROM jconon_application:folder app " +
            "JOIN jconon_application:aspect_punteggi pun ON app.cmis:objectId = pun.cmis:objectId " +
            "WHERE ((app.jconon_application:stato_domanda = 'C') " +
                   "AND (app.jconon_application:esclusione_rinuncia IS NULL) " +
                   "AND IN_TREE(app, '" + graduatoria.parent.properties['{http://www.alfresco.org/model/system/1.0}node-uuid'] + "'))";

        var personeIdonee = search.query({
            query: personeIdoneeQuery,
            language: 'cmis-alfresco'
        });

        // (3) Lista persone idonee
        var listaPersoneIdonee = personeIdonee.map(function(persona) {
            return {
                "user": persona.properties['jconon_application:user'],
                "cognome": persona.properties['jconon_application:cognome'],
                "nome": persona.properties['jconon_application:nome'],
                "esito_call": persona.properties['jconon_application:esito_call']
            };
        });

        // (4) Recupero l'ID del bando (parent) per controllare la categoria
        var bandoId = graduatoria.parent.id;  // Esempio: "workspace://SpacesStore/xxxx-xxxx;1.0"

        // (5) Query per verificare che il bando sia "concorsi pubblici"
        var checkBandoQuery =
            "SELECT * FROM jconon_call:folder root " +
            "WHERE root.cmis:objectTypeId = 'F:jconon_call_tind:folder_concorsi_pubblici' " +
              "AND root.cmis:objectId = '" + bandoId + "'";

        var bandoResult = search.query({
            query: checkBandoQuery,
            language: 'cmis-alfresco'
        });

        // (6) Costruisci l'oggetto graduatoria
        var objGraduatoria = {
            "bando": graduatoria.parent && graduatoria.parent.properties['jconon_call:codice'] || "N/A",
            "data_protocollo": dataProtocolloFormattata,
            "persone_idonee": listaPersoneIdonee
        };

        // (7) Se è concorso pubblico, lo metti in "concorsi_pubblici", altrimenti in "altre"
        if (bandoResult && bandoResult.length > 0) {
            response.graduatorie.concorsi_pubblici.push(objGraduatoria);
        } else {
            response.graduatorie.altre.push(objGraduatoria);
        }
    });
}

    /****************************************************
     *    SEZIONE BANDI PUBBLICATI (rimasta invariata)
     ****************************************************/
    var bandiPubblicatiQuery =
    "SELECT * FROM jconon_call:folder root " +
    "WHERE (" +
      "root.cmis:objectTypeId = 'F:jconon_call_tind:folder_concorsi_pubblici' " +   // <-- Filtro aggiuntivo
      "AND root.jconon_call:data_inizio_invio_domande_index <= TIMESTAMP '" + meseCorrente.toISOString() + "' " +
      "AND (root.jconon_call:data_fine_invio_domande_index >= TIMESTAMP '" + mesePrecedente.toISOString() + "' " +
           "OR root.jconon_call:data_fine_invio_domande_index IS NULL) " +
      "AND root.jconon_call:has_macro_call = 'false' " +
      "AND IN_TREE (root,'" + competition.nodeRef + "')"  +
    ") " +
    "ORDER BY jconon_call:data_fine_invio_domande_index ASC";
    var bandiPubblicati = search.query({
        query: bandiPubblicatiQuery,
        language: 'cmis-alfresco'
    });

    // Itera sui risultati dei bandi pubblicati e aggiungili al JSON di risposta
    bandiPubblicati.forEach(function(bando) {
        var isPubblicatoSuInpa = !!bando.properties['jconon_call:data_pubblicazione_inpa']; // true/false
        response.bandi_pubblicati_mese_corrente.push({
            "alfcmis:nodeRef": bando.nodeRef.toString(),
            "cmis:createdBy": bando.properties['cmis:createdBy'],
            "cmis:creationDate": bando.properties['cmis:creationDate'],
            "cmis:lastModificationDate": bando.properties['cmis:lastModificationDate'],
            "cmis:lastModifiedBy": bando.properties['cmis:lastModifiedBy'],
            "cmis:name": bando.properties['cmis:name'],
            "cmis:objectId": bando.id,
            "cmis:objectTypeId": bando.type,
            "jconon_call:codice": bando.properties['jconon_call:codice'] || "N/A",
            "jconon_call:data_fine_invio_domande": bando.properties['jconon_call:data_fine_invio_domande_index'],
            "jconon_call:data_inizio_invio_domande": bando.properties['jconon_call:data_inizio_invio_domande_index'],
            "jconon_call:data_pubblicazione_inpa": bando.properties['jconon_call:data_pubblicazione_inpa'] || "Non Pubblicato",
            "isPubblicatoSuInpa": isPubblicatoSuInpa,
            "jconon_call:descrizione": bando.properties['jconon_call:descrizione'] || "N/A",
            "jconon_call:profilo": bando.properties['{http://www.cnr.it/model/jconon_call/cmis}profilo'] || "N/A",
            "jconon_call:numero_posti": bando.properties['{http://www.cnr.it/model/jconon_call/cmis}numero_posti'] || "N/A",
            "jconon_call:sede": bando.properties['{http://www.cnr.it/model/jconon_call/cmis}sede'] || "N/A"
        });
    });
}

// Impostiamo l'oggetto JSON di risposta nel model
model.result = response;
