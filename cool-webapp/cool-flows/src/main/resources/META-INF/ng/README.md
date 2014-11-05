#Quick Notes#

```
<div modal-show="showDialog" modal-title="diagramma di flusso" class="modal fade"></div>
```

ufficio assegnatario - sottogruppi bootstrap 3


ordinamento
  default: ordinati per data di scadenza del task
  priorita'
  avviato da
  data avvio
  ID


FILTRI:
  inizialmente client side
  tipologia flusso
  ID ?
  priorita'
  scadenza (range di date)
  avviato da
  autocomplete ?!?


label in corso/avviato

RIEPILOGO con lista documenti aggiornati e metadati vari...

widget urgenti: datepicker, select, text/password

esci >> fine

startTask: verificare possibilita' di caricare documenti e allegati

ricavare dal bulkinfo start task il flag documenti principali, allegati


---

DEMO
preparare rilascio cool-flows.war
esporre haProxy al pubblico (porta 80?)



6629961578
utentefr
utentefr123

clean source:jar javadoc:jar package -Pdoccnr,flows,tomcat,produzione  -Dcool.build.number=${SVN_REVISION}  -Dsonar.branch=jenkins-no-surf