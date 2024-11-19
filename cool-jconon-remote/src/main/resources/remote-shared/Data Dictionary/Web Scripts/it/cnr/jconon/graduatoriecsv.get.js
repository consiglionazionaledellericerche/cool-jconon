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
    graduatorie: [],
    bandi_pubblicati_mese_corrente: [] // Bandi pubblicati
};

// Verifica se competition esiste
if (!competition) {
    logger.warn("Competition non trovato. Assicurarsi che il nodo esista.");
} else {

    // SEZIONE GRADUATORIE
    var graduatorieQuery = "select * from jconon_attachment:call_classification root JOIN jconon_protocollo:common AS p ON root.cmis:objectId = p.cmis:objectId where IN_TREE(root, '" + competition.nodeRef + "') and p.jconon_protocollo:data >= TIMESTAMP '2023-01-01T00:00:00.000Z'",
        sort1 = { column: 'cm:modified', ascending: false },
        def = { query: graduatorieQuery, store: 'workspace://SpacesStore', language: 'cmis-alfresco', sort: [sort1] };

    // Itera sui risultati delle graduatorie
    var results = search.query(def);
    if (results != null) {
        results.forEach(function(graduatoria) {
            var personeIdoneeQuery = "SELECT app.jconon_application:user, app.jconon_application:cognome, app.jconon_application:nome, app.jconon_application:esito_call FROM jconon_application:folder app JOIN jconon_application:aspect_punteggi pun ON app.cmis:objectId = pun.cmis:objectId WHERE ((app.jconon_application:stato_domanda = 'C') AND (app.jconon_application:esclusione_rinuncia IS NULL) AND IN_TREE(app, '" + graduatoria.parent.properties['{http://www.alfresco.org/model/system/1.0}node-uuid'] + "'))";
            var personeIdonee = search.query({
                query: personeIdoneeQuery,
                language: 'cmis-alfresco'
            });

            // Lista di persone idonee
            var listaPersoneIdonee = personeIdonee.map(function(persona) {
                return {
                    "user": persona.properties['jconon_application:user'],
                    "cognome": persona.properties['jconon_application:cognome'],
                    "nome": persona.properties['jconon_application:nome'],
                    "esito_call": persona.properties['jconon_application:esito_call']
                };
            });

            // Aggiungi al JSON di risposta
            response.graduatorie.push({
                "bando": graduatoria.parent && graduatoria.parent.properties['jconon_call:codice'] || "N/A",
                "data_modifica": graduatoria.properties['cm:modified'],
                "persone_idonee": listaPersoneIdonee
            });
        });
    }

    // SEZIONE BANDI PUBBLICATI
    var today = new Date();
    var meseCorrente = new Date(today.getFullYear(), today.getMonth(), 15); // 15 del mese corrente
    var mesePrecedente = new Date(today.getFullYear(), today.getMonth() - 1, 15); // 15 del mese precedente

    // Query per ottenere i bandi pubblicati tra il 15 del mese precedente e il 15 del mese corrente
    var bandiPubblicatiQuery = "SELECT * FROM jconon_call:folder root WHERE (root.jconon_call:data_inizio_invio_domande_index <= TIMESTAMP '" + 
        utils.toISO8601(meseCorrente) + "' AND (root.jconon_call:data_fine_invio_domande_index >= TIMESTAMP '" +
        utils.toISO8601(mesePrecedente) + "' OR root.jconon_call:data_fine_invio_domande_index IS NULL) AND root.jconon_call:has_macro_call = 'false' AND IN_TREE (root,'" +
        competition.nodeRef + "')) ORDER BY jconon_call:data_fine_invio_domande_index ASC";
    
    var bandiPubblicati = search.query({
        query: bandiPubblicatiQuery,
        language: 'cmis-alfresco'
    });

    // Itera sui risultati dei bandi pubblicati e aggiungili al JSON di risposta
    bandiPubblicati.forEach(function(bando) {
        var isPubblicatoSuInpa = !!bando.properties['jconon_call:data_pubblicazione_inpa']; // Controlla pubblicazione su INPA
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
            "isPubblicatoSuInpa": isPubblicatoSuInpa, // Indica se pubblicato su INPA
            "jconon_call:descrizione": bando.properties['jconon_call:descrizione'] || "N/A",
            "jconon_call:profilo": bando.properties['{http://www.cnr.it/model/jconon_call/cmis}profilo'] || "N/A",
            "jconon_call:numero_posti": bando.properties['{http://www.cnr.it/model/jconon_call/cmis}numero_posti'] || "N/A",
            "jconon_call:sede": bando.properties['{http://www.cnr.it/model/jconon_call/cmis}sede'] || "N/A"
        });
    });
}

// Funzione per convertire JSON in CSV
function convertResponseToCSV(response) {
    var csvRows = [];
    
    // Titolo per la sezione 'graduatorie'
    csvRows.push('"Graduatorie delle competizioni"\n');
    
    // Header per la sezione 'graduatorie'
    var graduatorieHeaders = ['Data Modifica', 'Bando', 'Nome Utente', 'Nome', 'Cognome', 'Esito Call'];
    csvRows.push(graduatorieHeaders.join(','));
    
    // Itera su ogni elemento delle graduatorie
    response.graduatorie.forEach(function(graduatoria) {
        var dataModifica = graduatoria.data_modifica || '';
        var bando = '"' + (graduatoria.bando || '').replace(/"/g, '""') + '"';

        // Se non ci sono persone idonee, aggiungi solo bando e data modifica
        if (graduatoria.persone_idonee.length === 0) {
            csvRows.push([dataModifica, bando, '', '', '', ''].join(','));
        } else {
            // Itera su ogni persona idonea e aggiungi informazioni
            graduatoria.persone_idonee.forEach(function(persona) {
                var user = persona.user || '';
                var nome = persona.nome || '';
                var cognome = persona.cognome || '';
                var esitoCall = persona.esito_call || '';
                csvRows.push([dataModifica, bando, user, nome, cognome, esitoCall].join(','));
            });
        }
    });

    // Titolo per la sezione 'bandi pubblicati'
    csvRows.push('\n"Lista dei bandi pubblicati nel mese corrente"\n');

    // Header per la sezione 'bandi_pubblicati_mese_corrente'
    var bandiHeaders = ['Numero Posti', 'Data Fine Invio Domande', 'Codice', 'Descrizione', 'Sede', 'Profilo', 'Data Pubblicazione INPA', 'Pubblicato Su INPA'];
    csvRows.push(bandiHeaders.join(','));
    
    // Itera su ogni bando pubblicato
    response.bandi_pubblicati_mese_corrente.forEach(function(bando) {
        var numeroPosti = bando['jconon_call:numero_posti'] || '';
        var dataFineInvio = bando['jconon_call:data_fine_invio_domande'] || '';
        var codice = bando['jconon_call:codice'] || '';
        var descrizione = '"' + (bando['jconon_call:descrizione'] ? bando['jconon_call:descrizione'].replace(/\n|\r|\t|,/g, ' ') : '').replace(/"/g, '""') + '"';
        var sede = '"' + (bando['jconon_call:sede'] || '').replace(/"/g, '""') + '"';
        var profilo = '"' + (bando['jconon_call:profilo'] || '').replace(/"/g, '""') + '"';
        var dataPubblicazioneInpa = bando['jconon_call:data_pubblicazione_inpa'] || '';
        var isPubblicatoSuInpa = bando.isPubblicatoSuInpa ? 'Sì' : 'No';

        csvRows.push([numeroPosti, dataFineInvio, codice, descrizione, sede, profilo, dataPubblicazioneInpa, isPubblicatoSuInpa].join(','));
    });

    // Unisce tutte le righe del CSV con il separatore di linea
    return csvRows.join('\n');
}


var responseCSV = convertResponseToCSV(response);

// Imposta il CSV come risultato del model
model.result = responseCSV;
