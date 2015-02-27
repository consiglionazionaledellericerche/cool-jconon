/*global execution, companyhome, logger, utils, cnrutils, use, search, task, actions, bpm_workflowDescription, bpm_reassignable, wfcnr_wfCounterId, bpm_package, bpm_comment, bpm_priority, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority, initiator, people, wfCommon,wfvarNomeFlusso, bpm_assignee, person, Packages */
var wfFlussoApprovvigionamentiIT = (function () {
  "use strict";
  //Variabili Globali
  //var nomeFlusso = "APPROVVIGIONAMENTI IT";
  var DEBUG, jsonCNR;
  DEBUG = true;
  jsonCNR = new Packages.org.springframework.extensions.webscripts.json.JSONUtils();

  function logHandler(testo) {
    if (DEBUG) {
      logger.error("wfFlussoApprovvigionamentiIT.js -- " + testo);
    }
  }

  function setNomeFlusso() {
    execution.setVariable('wfvarNomeFlusso', 'FLUSSO APPROVVIGIONAMENTI IT');
    execution.setVariable('wfvarTitoloFlusso', 'FLUSSO_APPROVVIGIONAMENTI_IT');
    logHandler("wfvarNomeFlusso: " + execution.getVariable('wfvarNomeFlusso'));
  }

  function setProcessVarIntoTask() {
    logHandler("setProcessVarIntoTask");
    if (bpm_workflowDueDate !== undefined && bpm_workflowDueDate !== null) {
      task.dueDate = bpm_workflowDueDate;
    }
    //PRIORITY
    // La priorità rimane sempre quella del workflow
    task.priority = bpm_workflowPriority;
    execution.setVariable('bpm_priority', task.priority);
    logHandler("set task.priority " +  task.priority + " and bpm_priority " +  bpm_priority + " as bpm_workflowPriority: " + bpm_workflowPriority);
    if (bpm_comment !== undefined && bpm_comment !== null) {
      task.setVariable('bpm_comment', bpm_comment);
    }
    //COMMENT
    if (execution.getVariable('bpm_comment') !== undefined && execution.getVariable('bpm_comment') !== null) {
      task.setVariable('bpm_comment', execution.getVariable('bpm_comment'));
      logHandler("set task bpm_comment: " +  execution.getVariable('bpm_comment'));
    }
    logHandler("set bpm_workflowDueDate " +  bpm_workflowDueDate + " bpm_workflowPriority: " + bpm_workflowPriority + " - bpm_comment: " + bpm_comment);
  }

  function settaGruppi() {
    logHandler("settaGruppi");
    execution.setVariable('wfvarGruppoDG', 'GROUP_00010000000000000000000000');
    execution.setVariable('wfvarGruppoDGDirettore', 'GROUP_00010000000100000000000000');
    execution.setVariable('wfvarGruppoDG-SISINFO', 'GROUP_00041100000000000000000000');
    execution.setVariable('wfvarGruppoSISINFODirettore', 'GROUP_00041100000100000000000000');
    execution.setVariable('wfvarGruppoAREA-SERVIZI', 'GROUP_00041199000200000000000000');
    execution.setVariable('wfvarGruppoAREA-SERVIZI-Responsabili', 'GROUP_00041199000201000000000000');
    execution.setVariable('wfvarGruppoUF-Sistemi-Informativi-Gestionali', 'GROUP_00041199000202000000000000');
    execution.setVariable('wfvarGruppoUF-Centro-Servizi', 'GROUP_00041199000203000000000000');
    execution.setVariable('wfvarGruppoUF-Servizi-Infrastrutturali', 'GROUP_00041199000204000000000000');
    execution.setVariable('wfvarGruppoUF-Servizi-Infrastrutturali-Responsabili', 'GROUP_00041199000204010000000000');
    execution.setVariable('wfvarGruppoInfrastrutture-Locali', 'GROUP_00041199000204020000000000');
    execution.setVariable('wfvarGruppoInfrastrutture-Locali-Responsabli', 'GROUP_00041199000204020100000000');
    execution.setVariable('wfvarGruppoCablaggio-SAC', 'GROUP_00041199000204020200000000');
    execution.setVariable('wfvarGruppoCablaggio-SAC-Responsabili', 'GROUP_00041199000204020201000000');
    execution.setVariable('wfvarGruppoCablaggio-SAC-Operatori', 'GROUP_00041199000204020202000000');
    execution.setVariable('wfvarGruppoAccessi', 'GROUP_00041199000204020300000000');
    execution.setVariable('wfvarGruppoAccessi-Responsabili', 'GROUP_00041199000204020301000000');
    execution.setVariable('wfvarGruppoAccessi-Operatori', 'GROUP_00041199000204020302000000');
    execution.setVariable('wfvarGruppoRete', 'GROUP_00041199000204020400000000');
    execution.setVariable('wfvarGruppoRete-Responsabili', 'GROUP_00041199000204020401000000');
    execution.setVariable('wfvarGruppoRete-Operatori', 'GROUP_00041199000204020402000000');
    execution.setVariable('wfvarGruppoTelefonia-Fissa', 'GROUP_00041199000204020500000000');
    execution.setVariable('wfvarGruppoTelefonia-Fissa-Responsabili', 'GROUP_00041199000204020501000000');
    execution.setVariable('wfvarGruppoTelefonia-Fissa-Operatori', 'GROUP_00041199000204020502000000');
    execution.setVariable('wfvarGruppoTelefonia-Mobile', 'GROUP_00041199000204020600000000');
    execution.setVariable('wfvarGruppoTelefonia-Mobile-Responsabili', 'GROUP_00041199000204020601000000');
    execution.setVariable('wfvarGruppoTelefonia-Mobile-Operatori', 'GROUP_00041199000204020602000000');
    execution.setVariable('wfvarGruppoServizi-DNS-SAC', 'GROUP_00041199000204020700000000');
    execution.setVariable('wfvarGruppoServizi-DNS-SAC-Responsabili', 'GROUP_00041199000204020701000000');
    execution.setVariable('wfvarGruppoServizi-DNS-SAC-Operatori', 'GROUP_00041199000204020702000000');
    execution.setVariable('wfvarGruppoContabilita-Telefonia', 'GROUP_00041199000204020800000000');
    execution.setVariable('wfvarGruppoContabilita-Telefonia-Responsabili', 'GROUP_00041199000204020801000000');
    execution.setVariable('wfvarGruppoContabilita-Telefonia-Operatori', 'GROUP_00041199000204020802000000');
    // ASSEGNAZIONE DI DEFAULT
    execution.setVariable('wfvarGruppoResponsabili', execution.getVariable('wfvarGruppoInfrastrutture-Locali-Responsabli'));
    execution.setVariable('wfvarGruppoOperatori', execution.getVariable('wfvarGruppoInfrastrutture-Locali-Responsabli'));
    logHandler("GRUPPI GESTITI: " + execution.getVariable('wfvarGruppoDG') + ' - ' + execution.getVariable('wfvarGruppoSISINFODirettore') + ' - ' +  execution.getVariable('wfvarGruppoResponsabili') + ' - ' +  execution.getVariable('wfvarGruppoOperatori'));
  }

  function settaStartVariables() {
    var tipologiaRichestaVadidazioneDG;
    // APPLICATION SETTING
    execution.setVariable('wfvarUtenteRichiedente', initiator);
    tipologiaRichestaVadidazioneDG = 'Telefonia_all';
    if (execution.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta').equals(tipologiaRichestaVadidazioneDG)) {
      execution.setVariable('wfvarValidazioneDgFlag', true);
    } else {
      execution.setVariable('wfvarValidazioneDgFlag', false);
    }
  }

  function setTaskVarIntoProcess() {
    // SALVA TUTTE LE VARIABILI DEFINITE ALL'END DEL TASK NELLE VARIABILI DEL WORKFLOW
    logHandler("setProcessVarIntoTask");
    //DUE DATE
    if (task.dueDate !== undefined && task.dueDate !== null) {
      execution.setVariable('bpm_dueDate', task.dueDate);
    }
    //PRIORITY
    //if (task.priority  !== undefined && task.priority  !== null) {
    //  execution.setVariable('bpm_priority', task.priority);
    //}
    //COMMENT
    if (task.getVariable('bpm_comment')  !== undefined && task.getVariable('bpm_comment')  !== null) {
      execution.setVariable('bpm_comment', task.getVariable('bpm_comment'));
    }
    //REASSIGNABLE
    if (task.getVariable('bpm_reassignable') !== undefined && task.getVariable('bpm_reassignable') !== null) {
      execution.setVariable('bpm_reassignable', task.getVariable('bpm_reassignable'));
    }
  }

  function settaDueDate() {
    var remoteDate, IsoRemoteDate, ggDueDate,  workflowPriority, utilsDate;
    workflowPriority = execution.getVariable('bpm_workflowPriority');
    logHandler("workflowPriority: " + workflowPriority);
    ggDueDate = 3;
    if ((workflowPriority < 5)  && (workflowPriority > 1)) {
      ggDueDate = 5;
    }
    if (workflowPriority >= 5) {
      ggDueDate = 15;
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
    if (execution.getVariable('bpm_workflowPriority') === 'undefined') {
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

  function flussoApprovvigionamentiSartSettings() {
    logHandler("flussoApprovvigionamentiSartSettings");
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
    var tipologiaNotifica, wfvarDettagliFlussoMap, wfvarDettagliFlussoString, wfvarDettagliFlussoObj, data, IsoDate;
    // --------------
    setProcessVarIntoTask();
    logHandler("validazione");
    logHandler("get bpm_workflowDueDate: " + execution.getVariable('bpm_workflowDueDate'));
    logHandler("bpm_dueDate: " + task.getVariable('bpm_dueDate'));
    logHandler("bpm_priority: " + task.getVariable('bpm_priority'));
    logHandler("bpm_comment: " + task.getVariable('bpm_comment'));
    logHandler("bpm_assignee: " + task.getVariable('bpm_assignee'));
    logHandler("cnrApprovvigionamentiIT_richiestaPerAltroUtente: " + task.getVariable('cnrApprovvigionamentiIT_richiestaPerAltroUtente'));
    logHandler("cnrApprovvigionamentiIT_richiestaPerAltraStruttura: " + task.getVariable('cnrApprovvigionamentiIT_richiestaPerAltraStruttura'));
    logHandler("cnrApprovvigionamentiIT_tipologiaRichiesta: " + task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta'));
    logHandler("cnrApprovvigionamentiIT_oggettoRichiesta: " + task.getVariable('cnrApprovvigionamentiIT_oggettoRichiesta'));
    logHandler("cnrApprovvigionamentiIT_disponibilita: " + task.getVariable('cnrApprovvigionamentiIT_disponibilita'));
    execution.setVariable('wfvarUtenteValidatore', bpm_assignee.properties.userName);
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 10);
    if (execution.getVariable('wfvarValidazioneDgFlag')) {
      task.setVariable('bpm_percentComplete', 10);
    }
    // VARIABILE DETTAGLI FLUSSO
    data = new Date();
    IsoDate = utils.toISO8601(data);
    wfvarDettagliFlussoObj = jsonCNR.toObject('{"tasks":[]}');
    wfvarDettagliFlussoMap = [];
    wfvarDettagliFlussoMap.name = "RICHIESTA";
    wfvarDettagliFlussoMap.data = [];
    wfvarDettagliFlussoMap.data.Tipo = "Approvvigionamenti IT";
    wfvarDettagliFlussoMap.data.data = IsoDate.toString();
    wfvarDettagliFlussoMap.data["effettuata da"] = initiator.properties.userName;
    if (task.getVariable('cnrApprovvigionamentiIT_richiestaPerAltroUtente') !== undefined && task.getVariable('cnrApprovvigionamentiIT_richiestaPerAltroUtente') !== null && task.getVariable('cnrApprovvigionamentiIT_richiestaPerAltroUtente').length() !== 0) {
      if (search.findNode(execution.getVariable('cnrApprovvigionamentiIT_richiestaPerAltroUtente')).properties.lastName) {
        wfvarDettagliFlussoMap.data["per conto di"] = search.findNode(execution.getVariable('cnrApprovvigionamentiIT_richiestaPerAltroUtente')).properties.firstName + " " + search.findNode(execution.getVariable('cnrApprovvigionamentiIT_richiestaPerAltroUtente')).properties.lastName;
      } else {
        wfvarDettagliFlussoMap.data["su richiesta di"] = task.getVariable('cnrApprovvigionamentiIT_richiestaPerAltroUtente');
      }
    }
    if (task.getVariable('cnrApprovvigionamentiIT_richiestaPerAltraStruttura') !== undefined && task.getVariable('cnrApprovvigionamentiIT_richiestaPerAltraStruttura') !== null && task.getVariable('cnrApprovvigionamentiIT_richiestaPerAltraStruttura').length() !== 0) {
      wfvarDettagliFlussoMap.data["per la Struttura"] = task.getVariable('cnrApprovvigionamentiIT_richiestaPerAltraStruttura');
    }
    if (task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta') !== undefined && task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta') !== null && task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta').length() !== 0) {
      wfvarDettagliFlussoMap.data["tipologia richiesta"] = task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta');
    }
    if (task.getVariable('cnrApprovvigionamentiIT_disponibilita') !== undefined && task.getVariable('cnrApprovvigionamentiIT_disponibilita') !== null && task.getVariable('cnrApprovvigionamentiIT_disponibilita').length() !== 0) {
      wfvarDettagliFlussoMap.data["disponibilità"] = task.getVariable('cnrApprovvigionamentiIT_disponibilita');
    }
    wfvarDettagliFlussoObj.tasks.add(wfvarDettagliFlussoMap);
    wfvarDettagliFlussoString = jsonCNR.toJSONString(wfvarDettagliFlussoObj);
    execution.setVariable('wfcnr_dettagliFlussoJson',  wfvarDettagliFlussoString);
    logHandler("wfvarDettagliFlussoString: " + wfvarDettagliFlussoString);
    // GESTIONE ASSEGNAZIONE COMPITO
    if (task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta').indexOf("1") === 0) {
      execution.setVariable('wfvarGruppoResponsabili', execution.getVariable('wfvarGruppoCablaggio-SAC-Responsabili'));
      execution.setVariable('wfvarGruppoOperatori', execution.getVariable('wfvarGruppoCablaggio-SAC-Operatori'));
    } else {
      if (task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta').indexOf("2") === 0) {
        execution.setVariable('wfvarGruppoResponsabili', execution.getVariable('wfvarGruppoAccessi-Responsabili'));
        execution.setVariable('wfvarGruppoOperatori', execution.getVariable('wfvarGruppoAccessi-Operatori'));
      } else {
        if (task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta').indexOf("3") === 0) {
          execution.setVariable('wfvarGruppoResponsabili', execution.getVariable('wfvarGruppoRete-Responsabili'));
          execution.setVariable('wfvarGruppoOperatori', execution.getVariable('wfvarGruppoRete-Operatori'));
        } else {
          if (task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta').indexOf("4") === 0) {
            execution.setVariable('wfvarGruppoResponsabili', execution.getVariable('wfvarGruppoTelefonia-Fissa-Responsabili'));
            execution.setVariable('wfvarGruppoOperatori', execution.getVariable('wfvarGruppoTelefonia-Fissa-Operatori'));
          } else {
            if (task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta').indexOf("5") === 0) {
              execution.setVariable('wfvarGruppoResponsabili', execution.getVariable('wfvarGruppoTelefonia-Mobile-Responsabili'));
              execution.setVariable('wfvarGruppoOperatori', execution.getVariable('wfvarGruppoTelefonia-Mobile-Operatori'));
            } else {
              if (task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta').indexOf("6") === 0) {
                execution.setVariable('wfvarGruppoResponsabili', execution.getVariable('wfvarGruppoServizi-DNS-SAC-Responsabili'));
                execution.setVariable('wfvarGruppoOperatori', execution.getVariable('wfvarGruppoServizi-DNS-SAC-Operatori'));
              } else {
                if (task.getVariable('cnrApprovvigionamentiIT_tipologiaRichiesta').indexOf("7") === 0) {
                  execution.setVariable('wfvarGruppoResponsabili', execution.getVariable('wfvarGruppoContabilita-Telefonia-Responsabili'));
                  execution.setVariable('wfvarGruppoOperatori', execution.getVariable('wfvarGruppoContabilita-Telefonia-Operatori'));
                }
              }
            }
          }
        }
      }
    }
    logHandler("assegnazioni: wfvarGruppoResponsabili: " + execution.getVariable('wfvarGruppoResponsabili') + " wfvarGruppoOperatori: " + execution.getVariable('wfvarGruppoOperatori'));

    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(execution.getVariable('wfvarUtenteValidatore'))) {
      notificaMailSingolo(people.getPerson(execution.getVariable('wfvarUtenteValidatore')).properties.userName, tipologiaNotifica);
    }
  }

  function validazioneEnd() {
    var gruppo;
    setTaskVarIntoProcess();
    logHandler("validazioneEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("validazioneEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    // VARIABILE DETTAGLI FLUSSO
    gruppo = "";
    wfCommon.inserisciDettagliJsonSemplici(gruppo);
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
    logHandler("wfvarGruppoSISINFODirettore: " + execution.getVariable('wfvarGruppoSISINFODirettore'));
    if (people.getGroup(execution.getVariable('wfvarGruppoSISINFODirettore'))) {
      logHandler("wfvarGruppoSISINFODirettore: " + people.getGroup(execution.getVariable('wfvarGruppoSISINFODirettore')).properties.authorityName);
      notificaMailGruppo((people.getGroup(execution.getVariable('wfvarGruppoSISINFODirettore'))), tipologiaNotifica);
    }
  }

  function autorizzazioneEnd() {
    setTaskVarIntoProcess();
    logHandler("autorizzazioneEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("autorizzazioneEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    if (task.actorId) {
      execution.setVariable('wfvarUtenteAutorizzatore', task.actorId);
      logHandler("autorizzazioneEnd- wfvarUtenteAutorizzatore: " + execution.getVariable('wfvarUtenteAutorizzatore'));
    }
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    // VARIABILE DETTAGLI FLUSSO
    wfCommon.inserisciDettagliJsonSemplici(people.getGroup(execution.getVariable('wfvarGruppoSISINFODirettore')).properties.authorityDisplayName);
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
    if (people.getGroup(execution.getVariable('wfvarGruppoDGDirettore'))) {
      logHandler("wfvarGruppoDGDirettore: " + people.getGroup(execution.getVariable('wfvarGruppoDGDirettore')).properties.authorityName);
      notificaMailGruppo((people.getGroup(execution.getVariable('wfvarGruppoDGDirettore'))), tipologiaNotifica);
    }
    // VARIABILE DETTAGLI FLUSSO
    wfCommon.inserisciDettagliJsonSemplici(people.getGroup(execution.getVariable('wfvarGruppoDGDirettore')).properties.authorityDisplayName);
  }

  function validazioneDgEnd() {
    setTaskVarIntoProcess();
    logHandler("validazioneDgEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("validazioneDgEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    if (task.actorId) {
      execution.setVariable('wfvarUtenteAutorizzatore', task.actorId);
      logHandler("validazioneDgEnd- wfvarUtenteDirettoreGenerale: " + execution.getVariable('wfvarUtenteDirettoreGenerale'));
    }
  }

 // ---------------------------- GESTIONE RESPONSABILI  ----------------------------
  function gestioneResponsabili() {
    var tipologiaNotifica;
    // --------------
    tipologiaNotifica = 'compitoAssegnato';
    logHandler("gestioneResponsabili");
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 50);
    if (execution.getVariable('wfvarValidazioneDgFlag')) {
      task.setVariable('bpm_percentComplete', 60);
    }
    // INVIO NOTIFICA
    if (people.getGroup(execution.getVariable('wfvarGruppoResponsabili'))) {
      logHandler("wfvarGruppoResponsabili: " + people.getGroup(execution.getVariable('wfvarGruppoResponsabili')).properties.authorityName);
      notificaMailGruppo((people.getGroup(execution.getVariable('wfvarGruppoResponsabili'))), tipologiaNotifica);
    }
  }

  function gestioneResponsabiliEnd() {
    setTaskVarIntoProcess();
    logHandler("gestioneResponsabiliEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("gestioneResponsabiliEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    if (task.actorId) {
      execution.setVariable('wfvarUtenteAutorizzatore', task.actorId);
      logHandler("gestioneResponsabiliEnd- wfvarUtenteResponsabile: " + execution.getVariable('wfvarUtenteResponsabile'));
    }
    // VARIABILE DETTAGLI FLUSSO
    wfCommon.inserisciDettagliJsonSemplici(people.getGroup(execution.getVariable('wfvarGruppoResponsabili')).properties.authorityDisplayName);
  }

 // ---------------------------- GESTIONE OPERATIVI  ----------------------------
  function gestioneOperativi() {
    var tipologiaNotifica;
    // --------------
    tipologiaNotifica = 'compitoAssegnato';
    logHandler("gestioneOperativi");
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 70);
    if (execution.getVariable('wfvarValidazioneDgFlag')) {
      task.setVariable('bpm_percentComplete', 80);
    }
    // INVIO NOTIFICA
    if (people.getGroup(execution.getVariable('wfvarGruppoOperatori'))) {
      logHandler("wfvarGruppoOperatori: " + people.getGroup(execution.getVariable('wfvarGruppoOperatori')).properties.authorityName);
      notificaMailGruppo((people.getGroup(execution.getVariable('wfvarGruppoOperatori'))), tipologiaNotifica);
    }
  }

  function gestioneOperativiEnd() {
    setTaskVarIntoProcess();
    logHandler("gestioneOperativiEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("gestioneOperativiEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    if (task.actorId) {
      execution.setVariable('wfvarUtenteAutorizzatore', task.actorId);
      logHandler("gestioneOperativiEnd- wfvarUtenteOperativo: " + execution.getVariable('wfvarUtenteOperativo'));
    }
    // VARIABILE DETTAGLI FLUSSO
    wfCommon.inserisciDettagliJsonSemplici(people.getGroup(execution.getVariable('wfvarGruppoOperatori')).properties.authorityDisplayName);
  }

 // ---------------------------- GESTIONE RICHIEDENTE  ----------------------------
  function gestioneRichiedente() {
    var tipologiaNotifica;
    // --------------
    tipologiaNotifica = 'compitoAssegnato';
    logHandler("gestioneRichiedente");
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 50);
    if (execution.getVariable('wfvarValidazioneDgFlag')) {
      task.setVariable('bpm_percentComplete', 60);
    }
    // INVIO NOTIFICA
    if (people.getPerson(initiator.properties.userName)) {
      notificaMailSingolo(initiator.properties.userName, tipologiaNotifica);
    }
  }

  function gestioneRichiedenteEnd() {
    var gruppo = "";
    setTaskVarIntoProcess();
    logHandler("gestioneRichiedenteEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("gestioneRichiedenteEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    if (task.actorId) {
      execution.setVariable('wfvarUtenteAutorizzatore', task.actorId);
      logHandler("gestioneRichiedenteEnd- wfvarUtenteOperativo: " + execution.getVariable('wfvarUtenteOperativo'));
    }
    // VARIABILE DETTAGLI FLUSSO
    wfCommon.inserisciDettagliJsonSemplici(gruppo);
  }

 // ---------------------------- TERMINATO  ----------------------------
  function flussoApprovvigionamentiEndSettings() {
    var tipologiaNotifica, statoFinale;
    logHandler("flussoApprovvigionamentiEndSettings ");
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
    flussoApprovvigionamentiSartSettings : flussoApprovvigionamentiSartSettings,
    flussoApprovvigionamentiEndSettings : flussoApprovvigionamentiEndSettings,
    validazione : validazione,
    validazioneEnd : validazioneEnd,
    autorizzazione : autorizzazione,
    autorizzazioneEnd : autorizzazioneEnd,
    validazioneDg : validazioneDg,
    validazioneDgEnd : validazioneDgEnd,
    gestioneResponsabili : gestioneResponsabili,
    gestioneResponsabiliEnd : gestioneResponsabiliEnd,
    gestioneOperativi : gestioneOperativi,
    gestioneOperativiEnd : gestioneOperativiEnd,
    gestioneRichiedente : gestioneRichiedente,
    gestioneRichiedenteEnd : gestioneRichiedenteEnd
  };
}

  ());

