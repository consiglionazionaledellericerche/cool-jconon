/*global execution, companyhome, logger, utils, cnrutils, use, search, task, actions, bpm_workflowDescription, bpm_reassignable, wfcnr_wfCounterId, bpm_package, bpm_comment, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority, initiator, people, wfCommon,wfvarNomeFlusso, bpm_assignee */
var wfFlussoRichiesteMaterialeIT = (function () {
  "use strict";
  //Variabili Globali
  //var nomeFlusso = "RICHIESTE MATERIALE IT";
  var DEBUG = true;

  function logHandler(testo) {
    if (DEBUG) {
      logger.error("wfFlussoRichiesteMaterialeIT.js -- " + testo);
    }
  }

  function setNomeFlusso() {
    execution.setVariable('wfvarNomeFlusso', 'FLUSSO RICHIESTE MATERIALE IT');
    execution.setVariable('wfvarTitoloFlusso', 'FLUSSO_RICHIESTE_MATERIALE_IT');
    logHandler("wfvarNomeFlusso: " + execution.getVariable('wfvarNomeFlusso'));
  }

  function setProcessVarIntoTask() {
    logHandler("setProcessVarIntoTask");
    if (bpm_workflowDueDate !== undefined && bpm_workflowDueDate !== null) {
      task.dueDate = bpm_workflowDueDate;
    }
    if (bpm_workflowPriority !== undefined && bpm_workflowPriority !== null) {
      task.priority = bpm_workflowPriority;
    }
    if (bpm_comment !== undefined && bpm_comment !== null) {
      task.setVariable('bpm_comment', bpm_comment);
    }
    logHandler("set bpm_workflowDueDate " +  bpm_workflowDueDate + " bpm_workflowPriority: " + bpm_workflowPriority + " bpm_comment: " + bpm_comment);
  }




  function settaGruppi() {
    logHandler("settaGruppi");
    execution.setVariable('wfvarGruppoDirettoreGenerale', 'DIRETTORE_GENERALE');
    execution.setVariable('wfvarGruppoDirettoreMaterialeIT', 'DIRETTORE_MATERIALE_IT');
    execution.setVariable('wfvarGruppoResponsabiliMaterialeIT', 'RESPONSABILI_MATERIALE_IT');
    execution.setVariable('wfvarGruppoOperativiMaterialeIT', 'OPERATIVI_MATERIALE_IT');
    execution.setVariable('wfvarGruppoCentroServizi', 'RESPONSABILI_CENTRO_SERVIZI');
    logHandler("GRUPPI GESTITI: " + execution.getVariable('wfvarGruppoDirettoreGenerale') + ' - ' + execution.getVariable('wfvarGruppoDirettoreMaterialeIT') + ' - ' +  execution.getVariable('wfvarGruppoResponsabiliMaterialeIT') + ' - ' +  execution.getVariable('wfvarGruppoOperativiMaterialeIT') + ' - ' +  execution.getVariable('wfvarGruppoCentroServizi'));
  }

  function settaStartVariables() {
    var tipologiaRichestaVadidazioneDG;
    // APPLICATION SETTING
    execution.setVariable('wfvarUtenteRichiedente', initiator);
    tipologiaRichestaVadidazioneDG = 'Telefonia_all';
    if (execution.getVariable('cnrRichiesteMaterialiIT_tipologiaRichiesta').equals(tipologiaRichestaVadidazioneDG)) {
      execution.setVariable('wfvarValidazioneDgFlag', true);
    } else {
      execution.setVariable('wfvarValidazioneDgFlag', false);
    }
    logHandler("settaStartVariables: wfvarValidazioneDgFlag: " + execution.getVariable('wfvarValidazioneDgFlag'));
  }

  function settaDueDate() {
    var remoteDate, IsoRemoteDate, ggDueDate,  workflowPriority, utilsDate;
    workflowPriority = execution.getVariable('bpm_workflowPriority');
    logHandler("workflowPriority: " + workflowPriority);
    ggDueDate = 15;
    if ((workflowPriority < 5)  && (workflowPriority > 1)) {
      ggDueDate = 5;
    }
    if (workflowPriority >= 5) {
      ggDueDate = 3;
    }
    remoteDate = new Date();
    logHandler("i gg da aggiungere alla data sono: " + ggDueDate);
    remoteDate.setDate(remoteDate.getDate() + ggDueDate);
    //SET TIMER per termine Due Date riconosciuta da Alfresco
    //alfrescoSetDate = IsoRemoteDate.substring(0, 23) + "Z";
    IsoRemoteDate = utils.toISO8601(remoteDate);
    utilsDate = utils.fromISO8601(IsoRemoteDate);
    logHandler("IsoRemoteDate " + IsoRemoteDate.toString());
    logHandler("utilsDate " + utilsDate.toString());
    logHandler("set bpm_workflowDueDate from: " + bpm_workflowDueDate + "to: " + utilsDate);
    execution.setVariable('bpm_workflowDueDate', utilsDate);
    if ((execution.getVariable('bpm_dueDate') !== null) && (execution.getVariable('bpm_dueDate') !== undefined)) {
      execution.setVariable('bpm_dueDate', execution.getVariable('bpm_workflowDueDate'));
    }
    logHandler("get bpm_dueDate: " + execution.getVariable('bpm_dueDate'));
    execution.setVariable('wfvarDueDateTimer', IsoRemoteDate.toString());
    logHandler("set wfvarDueDateTimer to: " + IsoRemoteDate.toString());
  }

  function settaStartProperties() {
    var workflowPriority;
    logHandler("settaStartProperties");
    settaDueDate();
    // bpm_workflowPriority
    workflowPriority = execution.getVariable('bpm_workflowPriority');
    if (bpm_workflowPriority === 'undefined') {
      execution.setVariable('bpm_workflowPriority', 3);
    }
    // bpm_dueDate
    if ((execution.getVariable('bpm_dueDate') !== null) && (execution.getVariable('bpm_dueDate') !== undefined)) {
      execution.setVariable('bpm_dueDate', execution.getVariable('bpm_workflowDueDate'));
    }
    logHandler("get bpm_dueDate: " + execution.getVariable('bpm_dueDate'));
  }


  function controlliFlusso() {
    logHandler("controlliFlusso");
    // ?????
  }

  function flussoRichiesteSartSettings() {
    logHandler("flussoRichiesteSartSettings");
    //SET GRUPPI
    settaGruppi();
    settaStartVariables();
    settaStartProperties();
  }


// FUNZIONI NOTIFICHE MAIL
  function notificaMailGruppo(gruppoDestinatariMail, tipologiaNotifica) {
    var members, testo, isWorkflowPooled, destinatario, i;
    logHandler("notificaMailGruppo");
    members = people.getMembers(gruppoDestinatariMail);
    testo = "Notifica di scadenza di un flusso documentale";
    isWorkflowPooled = true;
    logHandler("invia notifica ai membri del gruppo: " + gruppoDestinatariMail.properties.authorityName);
    for (i = 0; i < members.length; i++) {
      destinatario = members[i];
      logHandler("invia notifica a : " + destinatario + " del gruppo: " + gruppoDestinatariMail.properties.authorityName);
      // wfCommon.inviaNotifica(destinatario, testo, isWorkflowPooled, gruppoDestinatariMail, execution.getVariable('wfvarNomeFlusso'), tipologiaNotifica);
    }
  }

  function notificaMailSingolo(destinatario, tipologiaNotifica) {
    var testo, isWorkflowPooled, gruppoDestinatariMail;
    logHandler("notificaMailSingolo");
    isWorkflowPooled = false;
    gruppoDestinatariMail = "GENERICO";
    testo = "Notifica di scadenza di un flusso documentale";
    logHandler("invia notifica a : " + destinatario);
    // wfCommon.inviaNotifica(destinatario, testo, isWorkflowPooled, gruppoDestinatariMail, execution.getVariable('wfvarNomeFlusso'), tipologiaNotifica);
  }


// FUNZIONI STATO

// ---------------------------- VALIDAZIONE ----------------------------
  function validazione() {
    var tipologiaNotifica;
    // --------------
    logHandler("validazione");
    logHandler("get bpm_workflowDueDate: " + execution.getVariable('bpm_workflowDueDate'));
    logHandler("bpm_dueDate: " + task.getVariable('bpm_dueDate'));
    logHandler("bpm_priority: " + task.getVariable('bpm_priority'));
    logHandler("bpm_comment: " + task.getVariable('bpm_comment'));
    logHandler("bpm_assignee: " + task.getVariable('bpm_assignee'));
    execution.setVariable('wfvarUtenteValidatore', bpm_assignee.properties.userName);
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 10);
    if (execution.getVariable('wfvarValidazioneDgFlag')) {
      task.setVariable('bpm_percentComplete', 10);
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(execution.getVariable('wfvarUtenteValidatore'))) {
      notificaMailSingolo(people.getPerson(execution.getVariable('wfvarUtenteValidatore')).properties.userName, tipologiaNotifica);
    }
  }

  function validazioneEnd() {
    logHandler("validazioneEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("validazioneEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
  }

  // ---------------------------- AUTORIZZAZIONE ----------------------------
  function autorizzazione() {
    var tipologiaNotifica;
    // --------------
    logHandler("autorizzazione");
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 25);
    if (execution.getVariable('wfvarValidazioneDgFlag')) {
      task.setVariable('bpm_percentComplete', 40);
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    logHandler("wfvarGruppoDirettoreMaterialeIT: " + execution.getVariable('wfvarGruppoDirettoreMaterialeIT'));
    if (people.getGroup(execution.getVariable('wfvarGruppoDirettoreMaterialeIT'))) {
      logHandler("wfvarGruppoDirettoreMaterialeIT: " + people.getGroup(execution.getVariable('wfvarGruppoDirettoreMaterialeIT')).properties.authorityName);
      notificaMailGruppo((people.getGroup(execution.getVariable('wfvarGruppoDirettoreMaterialeIT'))), tipologiaNotifica);
    }
  }

  function autorizzazioneEnd() {
    logHandler("autorizzazioneEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("autorizzazioneEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    if (bpm_assignee) {
      execution.setVariable('wfvarUtenteAutorizzatore', bpm_assignee.properties.userName);
      logHandler("autorizzazioneEnd- wfvarUtenteAutorizzatore: " + execution.getVariable('wfvarUtenteAutorizzatore'));
    }
    logHandler("autorizzazioneEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
  }


  // ---------------------------- VALIDA DG ----------------------------
  function validazioneDg() {
    var tipologiaNotifica;
    // --------------
    logHandler("validazioneDg");
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 20);
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getGroup(execution.getVariable('wfvarGruppoDirettoreGenerale'))) {
      logHandler("wfvarGruppoDirettoreGenerale: " + people.getGroup(execution.getVariable('wfvarGruppoDirettoreGenerale')).properties.authorityName);
      notificaMailGruppo((people.getGroup(execution.getVariable('wfvarGruppoDirettoreGenerale'))), tipologiaNotifica);
    }
  }

  function validazioneDgEnd() {
    logHandler("validazioneDgEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("validazioneDgEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    if (bpm_assignee) {
      execution.setVariable('wfvarUtenteDirettoreGenerale', bpm_assignee.properties.userName);
      logHandler("autorizzazioneEnd- wfvarUtenteDirettoreGenerale: " + execution.getVariable('wfvarUtenteDirettoreGenerale'));
    }
  }

 // ---------------------------- GESTIONE RESPONSABILI  ----------------------------
  function gestioneResponsabili() {
    var tipologiaNotifica;
    // --------------
    logHandler("gestioneResponsabili");
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 50);
    if (execution.getVariable('wfvarValidazioneDgFlag')) {
      task.setVariable('bpm_percentComplete', 60);
    }
    // INVIO NOTIFICA
    if (people.getGroup(execution.getVariable('wfvarGruppoResponsabiliMaterialeIT'))) {
      logHandler("wfvarGruppoResponsabiliMaterialeIT: " + people.getGroup(execution.getVariable('wfvarGruppoResponsabiliMaterialeIT')).properties.authorityName);
      notificaMailGruppo((people.getGroup(execution.getVariable('wfvarGruppoResponsabiliMaterialeIT'))), tipologiaNotifica);
    }
  }

  function gestioneResponsabiliEnd() {
    logHandler("gestioneResponsabiliEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("gestioneResponsabiliEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    if (bpm_assignee) {
      execution.setVariable('wfvarUtenteResponsabile', bpm_assignee.properties.userName);
      logHandler("autorizzazioneEnd- wfvarUtenteResponsabile: " + execution.getVariable('wfvarUtenteResponsabile'));
    }
  }

 // ---------------------------- GESTIONE OPERATIVI  ----------------------------
  function gestioneOperativi() {
    var tipologiaNotifica;
    // --------------
    logHandler("gestioneOperativi");
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 70);
    if (execution.getVariable('wfvarValidazioneDgFlag')) {
      task.setVariable('bpm_percentComplete', 80);
    }
    // INVIO NOTIFICA
    if (people.getGroup(execution.getVariable('wfvarGruppoOperativiMaterialeIT'))) {
      logHandler("wfvarGruppoOperativiMaterialeIT: " + people.getGroup(execution.getVariable('wfvarGruppoOperativiMaterialeIT')).properties.authorityName);
      notificaMailGruppo((people.getGroup(execution.getVariable('wfvarGruppoOperativiMaterialeIT'))), tipologiaNotifica);
    }
  }

  function gestioneOperativiEnd() {
    logHandler("gestioneOperativiEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("gestioneOperativiEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    if (bpm_assignee) {
      execution.setVariable('wfvarUtenteOperativo', bpm_assignee.properties.userName);
      logHandler("autorizzazioneEnd- wfvarUtenteOperativo: " + execution.getVariable('wfvarUtenteOperativo'));
    }
  }

 // ---------------------------- TERMINATO  ----------------------------
  function flussoRichiesteEndSettings() {
    var tipologiaNotifica, statoFinale;
    logHandler("flussoRichiesteEndSettings ");
    statoFinale = "TERMINATO";
    // INVIO NOTIFICA
    tipologiaNotifica = 'flussoCompletato';
    if (people.getPerson(initiator.properties.userName)) {
      notificaMailSingolo(initiator.properties.userName, tipologiaNotifica);
    }
  }

  return {
    setNomeFlusso : setNomeFlusso,
    controlliFlusso : controlliFlusso,
    flussoRichiesteSartSettings : flussoRichiesteSartSettings,
    flussoRichiesteEndSettings : flussoRichiesteEndSettings,
    validazione : validazione,
    validazioneEnd : validazioneEnd,
    autorizzazione : autorizzazione,
    autorizzazioneEnd : autorizzazioneEnd,
    validazioneDg : validazioneDg,
    validazioneDgEnd : validazioneDgEnd,
    gestioneResponsabili : gestioneResponsabili,
    gestioneResponsabiliEnd : gestioneResponsabiliEnd,
    gestioneOperativi : gestioneOperativi,
    gestioneOperativiEnd : gestioneOperativiEnd
  };
}

  ());

