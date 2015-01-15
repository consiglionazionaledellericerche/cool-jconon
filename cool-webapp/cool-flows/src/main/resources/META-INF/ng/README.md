#Quick Notes#




## Demo

* consentire l'aggiornamento del contenuto di un documento

## Later

riepilogo task/workflow con lista documenti aggiornati e metadati vari (join sui secondaryTypes?)

### Ordinamento task
  * data di scadenza del task (default)
  * priorita'
  * avviato da
  * data avvio
  * ID

### Filtri Tasks:
  * inizialmente client side
  * tipologia flusso
  * ID ?
  * priorita'
  * scadenza (range di date)
  * avviato da
  * autocomplete ?!?

### Pannello attivita' svolte
label in corso/avviato

### Ricerca documenti/fascicoli...


## Best Practices
[$log](https://docs.angularjs.org/api/ng/service/$log)

## Memo
### credenziali firma digitale
* __id__: utentefr
* __pw__: utentefr123
* __pin__: 6629961578

```
<div modal-show="showDialog" modal-title="diagramma di flusso" class="modal fade"></div>
```

## Other








---


## FATTO

avvio flusso, allega files ...

lista task (da rifare...con i filtri)

(task) dettagli, update file, allega file ? , setta metadati endTask

--

## DA FARE

I MIEI COMPITI - PUBLIC API di ALFRESCO (+ filtri)

http://as1dock.si.cnr.it:8080/alfresco/service/api/workflow-definitions


Ricerca flussi


---

FLOWS

grafica e' brutta

filtro sorting, tipologie, My Tasks

filtro client side ???
  TIPOLOGIA
  initiator
  descrizione
  ID
  scaduti
  priorita


sorting
  date
  id
  priorita




mettere avvia nuovo flusso e gestione miei task in pagine diverse


--

# MARCO

+ ricerca documenti
    Semplice: in OR il titolo (che un giorno verra' aggiunto)
    Fixare mimetype extension
    Ricerca Avanzata: bulkinfo sull aspect parametriflusso per campi [find]

+ ricerca flussi
    con API nuove ???
    bulkinfo

+ monitoraggio flussi [BI?]
    al DG
    tempo medio di esecuzione di un task...
    filtrato per utente/ufficio??
    NO elasticsearch ???

    cambiare nome alla classe css workflow etc.


---

http://keen.github.io/dashboards/examples/

$rootScope.page da togliere

selezionare solo properties effettivamente usate ?
filtri lato client:
  +priorita'
  +completato (oggi, questa settimana, questo mese)
  + assegnato il (oggi, questa settimana, questo mese)
  +bpm_description fulltext
  +bpm_comment fulltext
  +id wfcnr_wfCounterId
anchor tipo flusso

flows-temp ordinate per anno mese giorno
