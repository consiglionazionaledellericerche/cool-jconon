=======================
Punteggi e graduatoria
=======================

Le voci di punteggio di un bando (etichetta, minimo e massimo di ogni prova) si impostano nella
*Sezione IV - Punteggi* della :doc:`configurazione del bando<configurazione_bandi>`. Una volta scaduto il bando, i
punteggi dei candidati possono essere inseriti dalla Commissione, dal Responsabile del Procedimento (RdP) e dal gruppo
CONCORSI in due modi: per tutte le domande dalla pagina **Punteggi** del bando, oppure per una singola domanda dal menu
**Operazioni** della domanda.

Pagina Punteggi del bando
=========================

La pagina si apre dal menu del bando con la voce **Punteggi** ed elenca le domande inviate e non escluse, ordinate per
posizione in graduatoria e poi per cognome e nome. Ogni riga riporta un numero progressivo, il nominativo del candidato
e, per ciascuna voce di punteggio configurata nel bando, una casella in cui inserire il voto; nell'intestazione delle
colonne sono indicati il minimo e il massimo previsti. Seguono il **Totale** (ricalcolato al salvataggio), la posizione
in graduatoria, l'esito (*V* vincitore, *I* idoneo, *S* scorrimento, *R* rinuncia), le note e i protocolli di
graduatoria e di scorrimento.

* Le righe modificate vengono evidenziate e il pulsante **Salva modifiche** riporta quante sono: vengono salvate solo
  quelle.
* Con **Cerca candidato** si filtra l'elenco per nome; le intestazioni e la colonna del candidato restano visibili
  scorrendo la tabella.
* I punteggi si inseriscono con la virgola decimale (es. ``27,5``); se un valore è inferiore al minimo o supera il
  massimo della prova, al salvataggio viene mostrato un avviso.
* I numeri di protocollo vengono completati automaticamente a 7 cifre con gli zeri iniziali (es. ``4444`` diventa
  ``0004444``).

Dal pulsante **Calcola graduatoria** si assegnano le posizioni in base al totale dei punteggi. Il menu **Altre azioni**
contiene inoltre:

* **Esporta in Excel**: scarica i punteggi in un foglio di calcolo che può essere compilato fuori dall'applicazione;
* **Esporta in Excel (link per email)**: la stessa estrazione, elaborata in background, con il link inviato per email
  (utile per bandi con molte domande);
* **Importa da Excel**: carica il foglio esportato e compilato, aggiornando i punteggi delle domande;
* **Riporta il protocollo sulle domande**: copia sulle domande numero e data di protocollo della graduatoria e dello
  scorrimento;
* **Sblocca graduatoria** (solo gruppo CONCORSI e amministratori): quando la graduatoria del bando è stata generata,
  punteggi e posizioni non sono più modificabili; lo sblocco li rende di nuovo modificabili.

Con la graduatoria generata restano comunque modificabili le note, gli esiti non ancora assegnati e i protocolli.

Punteggi di una singola domanda
===============================

Dal menu **Operazioni** della domanda (vedi :doc:`Operazioni sulle domande<operazioni_domande>`) la voce **Punteggi**
apre una finestra con le sole voci configurate nel bando, il minimo e il massimo di ciascuna, la posizione in
graduatoria, l'esito e le note. La voce non è disponibile quando la graduatoria del bando è già stata generata.

Scheda di valutazione
=====================

Per i bandi che prevedono la scheda di valutazione, la voce **Scheda di valutazione** del menu **Operazioni** è
disponibile per la Commissione, il gruppo CONCORSI e gli amministratori:

* se la scheda non è ancora presente, il pulsante **Predisponi la scheda** genera il foglio Excel vuoto del candidato;
* la scheda si scarica, si compila e si ricarica come **nuova versione**, indicando obbligatoriamente un commento;
* l'elenco delle versioni riporta per ciascuna l'autore, la data e il commento, e ogni versione può essere scaricata;
* la scheda può essere eliminata con tutte le sue versioni.

Graduatoria pubblica e graduatoria privata
==========================================

La **graduatoria pubblica** continua a essere caricata nella sezione *Allegati* del bando con la tipologia
"Graduatoria del Bando di concorso", indicando data e numero di protocollo.

La **graduatoria privata**, con i nominativi dei vincitori e degli idonei, viene inviata ai candidati dalla maschera
*Comunicazioni* selezionando la casella **Graduatoria privata** (vedi
:doc:`Gestione delle comunicazioni<gestione_comunicazioni>`): il documento viene registrato automaticamente negli
allegati del bando con la tipologia "Graduatoria privata del Bando di concorso", con data e numero di protocollo, ed è
visibile ai soli autorizzati.

Nell'estrazione Excel dei bandi sono presenti, accanto alle colonne della graduatoria, anche le colonne
"Graduatoria privata - Num. Protocollo" e "Graduatoria privata - Data Protocollo".
