/*global cnrutils */
/*Autore: Edgardo Ambrosi
Questo script puo' essere eseguito solo come rule nel
repository. Necessita' di due oggetti che sono space e document.
Lo space e' lo spazio su cui la rule e' applicata e document e' il nodo la cui creazione
determina l'esecuzione della rule.
Lo script preleva il nome del nodo creato, che in questo contesto avra' un formato
concordato come segue:
Rendicontazione 2013 CNR - STRUTTURA AMM.VA CENTRALE Ordinativo 7263 #1.PDF .pdf.
Dal nome estrae il numero dopo il cancelletto #, elimina il carattere #, calcola il valore del numero
in modulo 1000 ottenendo un valore compreso tra 0 e 1000. Da questo ultimo valore calcola
il valore in modulo 500 e lo sottrae al numero iniziale ottenendo il range di riferimento tra 0-500  e tra 501-1000.
Quindi viene creato un nome folder DA-A.
Poi viene creata la folder se non esiste. E quindi viene spostato il nodo nella cartella di destinazione.

NOTA MOLTO BENE: Nel caso che stiamo valutando si e' presentata una anomalia che
potrebbe verificarsi in altri casi in cui e' coinvolto il server email di alfresco.
Quando si invia un file pdf come allegato di una email di alfresco,
il client che fa l'encoding e compone tutte le parti della mail dovrebbe indicare
che il Content-Type della mail e' di tipo application/pdf.
Questo tipo permette al server ricevente di manipolare correttamente il nome del file
allegato che e' incluso nel testo della email.
Alcuni client invece specificano che il Content-Type e' di tipo
application/octetstring a quel punto alfresco non sara' in grado di associare
correttamente il nome del file all'attachment e gli assegnera' come nome il testo
trovato nel subject della email.

Modificato 24/02/2013 Marco Spasiano
Cambiato space con document.parent perche' la rule quando viene ereditata la variabile
space e' quella in cui risiede la RULE stess.
IMPORTANTE assicurarsi che lo user che deve eseguire la rule abbia la visibilita'
sul NODO dello script.
Aggiunta dell'aspect per recuperare la contabile da SIGLA
find . -name "*.PDF .pdf" -exec sh -c 'mv "$0" "${0%.PDF .pdf} .pdf"' {} \;
find . -name 'Rendicontazione*' -type f -exec bash -c 'mv "$1" "${1//Rendicontazione/Rendicontazione 2012}"' _ {} \;

*/

function creazioneNomeFolder(re, esercizio, dirtyName) {
  "use strict";
  var number = dirtyName.replace(re, '$3'),
    relativeMandato = number % 1000,
    lowerBoundMandato = (number - (number % 500)),
    upperBoundMandato = lowerBoundMandato + 499,
    nameFolder = lowerBoundMandato + "-" + upperBoundMandato,
    cds = document.parent.properties.name.substring(0, 3),
    props = new Array(3),
    is = cnrutils.getClass("java.io.InputStream"),
    reData = new RegExp("Data Esecuzione ([0-9]+)/([0-9]+)/([0-9]+)", 'g'),
    doc = cnrutils.getClass("org.apache.pdfbox.pdmodel.PDDocument").getMethod("load", is).invoke(null, document.properties.content.inputStream),
    text = String(cnrutils.getClass("org.apache.pdfbox.util.PDFTextStripper").newInstance().getText(doc)),
    espressione,
    data_esecuzione;
  props["sigla_contabili_aspect:esercizio"] = esercizio;
  props["sigla_contabili_aspect:cds"] = cds;
  props["sigla_contabili_aspect:num_mandato"] = number;
  if (text !== null) {
    espressione = reData.exec(text);
    data_esecuzione = new Date(espressione[3], (espressione[2] - 1), espressione[1], 12);
    props["sigla_contabili_aspect:data_esecuzione"] = data_esecuzione;
  }
  document.addAspect("sigla_contabili_aspect:document", props);
  document.removeAspect("sigla_contabili_aspect:discarded_document");
  return nameFolder;
}

function creazioneEsercizioFolder(name) {
  "use strict";
  var esercizioFolder = document.parent.childByNamePath(name);
  if (esercizioFolder === null) {
    return document.parent.createFolder(name);
  }
  return esercizioFolder;
}

function creazioneFolder(parentFolder, name) {
  "use strict";
  var destContabiliFolder = parentFolder.childByNamePath(name);
  if (destContabiliFolder === null) {
    return parentFolder.createFolder(name);
  }
  return destContabiliFolder;
}

function spostamentoMandato(destFolder) {
  "use strict";
  var contabileDocument = destFolder.childByNamePath(document.properties.name);
  if (contabileDocument === null) {
    document.move(destFolder);
  } else {
    document.remove();
  }
}

if (document.parent.hasAspect("sigla_contabili_aspect:folder")) {
  var re = new RegExp("Rendicontazione ([0-9]+) .+ Ordinativo ([A-Z]0+)?([0-9]+) #[0-9]+ .pdf", 'g'),
    mandatoName = document.properties.name,
    esercizio = mandatoName.replace(re, '$1');
  if (esercizio === document.properties.name) {
    document.addAspect("sigla_contabili_aspect:discarded_document");
  } else {
    var cleanName = creazioneNomeFolder(re, esercizio, mandatoName),
      esercizioFolder = creazioneEsercizioFolder(esercizio),
      mandatoFolder = creazioneFolder(esercizioFolder, cleanName);
    spostamentoMandato(mandatoFolder);
  }
}