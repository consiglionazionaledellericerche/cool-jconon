/*global execution, companyhome, logger, utils, cnrutils, use, search, task, actions, bpm_workflowDescription, wfcnr_wfCounterId, bpm_package, bpm_comment, bpm_assignee, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority, initiator, people, wfCommon,wfvarNomeFlusso, arubaSign */
var wfFlussoAttestati = (function () {
  "use strict";
  //Variabili Globali
  //var nomeFlusso = "AUTORIZZAZIONI DSFTM";
  var DEBUG = true;

  function logHandler(testo) {
    if (DEBUG) {
      logger.error(testo);
    }
  }

  function setNomeFlusso() {
    execution.setVariable('wfvarNomeFlusso', 'FLUSSO ATTESTATI');
    execution.setVariable('wfvarTitoloFlusso', 'FLUSSO_ATTESTATI');
    logHandler("wfFlussoAttestati.js -- wfvarNomeFlusso: " + execution.getVariable('wfvarNomeFlusso'));
  }

  function setProcessVarIntoTask() {
    logHandler("wfFlussoAttestati.js -- setProcessVarIntoTask");
    if (bpm_workflowDueDate !== undefined && bpm_workflowDueDate !== null) {
      task.dueDate = bpm_workflowDueDate;
    }
    if (bpm_workflowPriority !== undefined && bpm_workflowPriority !== null) {
      task.priority = bpm_workflowPriority;
    }
    if (bpm_comment !== undefined && bpm_comment !== null) {
      task.setVariable('bpm_comment', bpm_comment);
    }
    logHandler("wfFlussoAttestati.js -- set bpm_workflowDueDate " +  bpm_workflowDueDate + " bpm_workflowPriority: " + bpm_workflowPriority + " bpm_comment: " + bpm_comment);
  }

  function settaGruppi() {
    logHandler("wfFlussoAttestati.js -- settaGruppi");
    execution.setVariable('wfvarGruppoATTESTATI', 'GROUP_ATTESTATI');
  }

  function settaDocAspects(nodoDoc) {
    if (nodoDoc.hasAspect('wfcnr:parametriFlusso')) {
      logHandler("wfCommon.js - taskStepMajorVersion - Il documento: " + nodoDoc.name + " risulta gia' con aspect parametriFlusso");
    } else {
      nodoDoc.addAspect("wfcnr:parametriFlusso");
      logHandler("wfCommon.js - taskStepMajorVersion - Il documento: " + nodoDoc.name + " risulta ora con aspect parametriFlusso");
    }
    if (nodoDoc.hasAspect('wfcnr:signable')) {
      logHandler("wfCommon.js - taskStepMajorVersion - Il documento: " + nodoDoc.name + " risulta gia' con aspect signable");
    } else {
      nodoDoc.addAspect("wfcnr:signable");
      logHandler("wfCommon.js - taskStepMajorVersion - Il documento: " + nodoDoc.name + " risulta ora con aspect signable");
    }
  }

  function settaStartProperties() {
    var workflowPriority, utenteRichiedente;
    logHandler("wfFlussoAttestati.js -- settaStartProperties");
    workflowPriority = execution.getVariable('bpm_workflowPriority');
    if (bpm_workflowPriority === 'undefined') {
      execution.setVariable('bpm_workflowPriority', 3);
    }
    if ((execution.getVariable('bpm_dueDate') !== null) && (execution.getVariable('bpm_dueDate') !== undefined)) {
      execution.setVariable('bpm_dueDate', execution.getVariable('bpm_workflowDueDate'));
    }
    logHandler("wfFlussoDSFTM.js -- get bpm_dueDate: " + execution.getVariable('bpm_dueDate'));
    if ((execution.getVariable('cnrattestati_userNameRichiedente') !== null) && (execution.getVariable('cnrattestati_userNameRichiedente') !== undefined)) {
      utenteRichiedente = people.getPerson(execution.getVariable('cnrattestati_userNameRichiedente'));
      logHandler("wfFlussoDSFTM.js -- utenteRichiedente: " + utenteRichiedente.properties.userName);
      execution.setVariable('wfvarUtenteRichiedente', utenteRichiedente.properties.userName);
    }
  }


  function flussoAttestatiSartSettings() {
    logHandler("wfFlussoAttestati.js -- flussoAttestatiSartSettings");
    //SET GRUPPI
    settaGruppi();
    settaStartProperties();
    settaDocAspects(bpm_package.children[0]);
    wfCommon.settaDocPrincipale(bpm_package.children[0]);
  }

  function notificaMailGruppo(gruppoDestinatariMail, tipologiaNotifica) {
    var members, testo, isWorkflowPooled, destinatario, i;
    logHandler("wfFlussoAttestati.js -- notificaMail");
    members = people.getMembers(gruppoDestinatariMail);
    testo = "Notifica di scadenza di un flusso documentale";
    isWorkflowPooled = true;
    logHandler("FLUSSO ATTESTATI - invia notifica ai membri del gruppo: " + gruppoDestinatariMail.properties.authorityName);
    for (i = 0; i < members.length; i++) {
      destinatario = members[i];
      logHandler("FLUSSO ATTESTATI - invia notifica a : " + destinatario.properties.userName + " del gruppo: " + gruppoDestinatariMail.properties.authorityName);
      wfCommon.inviaNotifica(destinatario, testo, isWorkflowPooled, gruppoDestinatariMail, execution.getVariable('wfvarNomeFlusso'), tipologiaNotifica);
    }
  }

  function notificaMailSingolo(destinatario, tipologiaNotifica) {
    var testo, isWorkflowPooled, gruppoDestinatariMail;
    logHandler("wfFlussoAttestati.js -- notificaMail");
    isWorkflowPooled = false;
    gruppoDestinatariMail = "GENERICO";
    testo = "Notifica di scadenza di un flusso documentale";
    logHandler("FLUSSO ATTESTATI - invia notifica a : " + destinatario.properties.userName);
    wfCommon.inviaNotifica(destinatario, testo, isWorkflowPooled, gruppoDestinatariMail, execution.getVariable('wfvarNomeFlusso'), tipologiaNotifica);
  }

  function eliminaPermessi(nodoDocumento) {
    // elimina tutti i permessi preesistenti
    var permessi,  i;
    permessi = nodoDocumento.getPermissions();
    nodoDocumento.setInheritsPermissions(false);
    for (i = 0; i < permessi.length; i++) {
      nodoDocumento.removePermission(permessi[i].split(";")[2], permessi[i].split(";")[1]);
      logHandler(i + ") rimuovo permesso: " + permessi[i].split(";")[2] + " a " + permessi[i].split(";")[1]);
    }
    nodoDocumento.setOwner('spaclient');
    logHandler("wfFlussoAttestati.js -- setPermessi assegno l'ownership del documento: a " + nodoDocumento.getOwner());
  }

  function setPermessiValidazione(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (people.getGroup(execution.getVariable('wfvarGruppoATTESTATI'))) {
      nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoATTESTATI'));
      logHandler("wfFlussoAttestati.js -- setPermessiValidazione con wfvarGruppoATTESTATI: " + execution.getVariable('wfvarGruppoATTESTATI'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatario').properties.userName);
    logHandler("wfFlussoAttestati.js -- setPermessiValidazione con wfvarUtenteFirmatario: " + execution.getVariable('wfvarUtenteFirmatario').properties.userName);
  }

  function setPermessiEndflussoAttestati(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (people.getGroup(execution.getVariable('wfvarGruppoATTESTATI'))) {
      nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoATTESTATI'));
      logHandler("wfFlussoAttestati.js -- setPermessiEndflussoAttestati con wfvarGruppoATTESTATI: " + execution.getVariable('wfvarGruppoATTESTATI'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatario').properties.userName);
    logHandler("wfFlussoAttestati.js -- setPermessiEndflussoAttestati con wfvarUtenteFirmatario: " + execution.getVariable('wfvarUtenteFirmatario').properties.userName);
  }



  function validazione() {
    var nodoDoc, tipologiaNotifica;
    // --------------
    logHandler("wfFlussoAttestati.js -- get bpm_workflowDueDate: " + execution.getVariable('bpm_workflowDueDate'));
    logHandler("wfFlussoAttestati.js -- wfvarGruppoATTESTATI: " + execution.getVariable('wfvarGruppoATTESTATI'));
    logHandler("wfFlussoAttestati.js -- bpm_dueDate: " + task.getVariable('bpm_dueDate'));
    logHandler("wfFlussoAttestati.js -- bpm_priority: " + task.getVariable('bpm_priority'));
    logHandler("wfFlussoAttestati.js -- bpm_comment: " + task.getVariable('bpm_comment'));
    logHandler("wfFlussoAttestati.js -- bpm_assignee: " + task.getVariable('bpm_assignee'));
    execution.setVariable('wfvarUtenteFirmatario', bpm_assignee);
    setProcessVarIntoTask();
    task.setVariable('bpm_percentComplete', 30);
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      wfCommon.taskStepMajorVersion(nodoDoc);
      setPermessiValidazione(nodoDoc);
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(execution.getVariable('wfvarUtenteFirmatario').properties.userName)) {
      notificaMailSingolo(people.getPerson(execution.getVariable('wfvarUtenteFirmatario').properties.userName), tipologiaNotifica);
    }
  }

  function validazioneEnd() {
    logHandler("wfFlussoAttestati.js -- bpm_assignee: " + task.getVariable('bpm_assignee').properties.userName);
    logHandler("wfFlussoAttestati.js -- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("wfFlussoAttestati.js -- wfcnr_reviewOutcome: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
  }

  function Approva() {
    var nodoDoc, statoFinale, formatoFirma, dataFirma, username, ufficioFirmatario, codiceDoc, commentoFirma;
    logHandler("wfFlussoAttestati.js -- Approva ");
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      //nodoDoc.setPermission("Coordinator", execution.getVariable('wfvarUtenteFirmatario').properties["cm:userName"]);
      statoFinale = "APPROVATO";
      formatoFirma = "leggera";
      dataFirma = new Date();
      username = execution.getVariable('wfvarUtenteFirmatario').properties.userName;
      commentoFirma = execution.getVariable('wfvarCommento');
      ufficioFirmatario = 'GENERICO';
      codiceDoc = execution.getVariable('wfcnr_codiceDocumentoUfficio');
      wfCommon.setMetadatiFirma(nodoDoc, formatoFirma, username, ufficioFirmatario, dataFirma, codiceDoc, commentoFirma);
      logHandler("wfFlussoAttestati.js -- approva: firma leggera ");
      wfCommon.taskEndMajorVersion(nodoDoc, statoFinale);
      setPermessiEndflussoAttestati(nodoDoc);
    }
  }

  function Respingi() {
    var nodoDoc, statoFinale, formatoFirma, dataFirma, username, ufficioFirmatario, codiceDoc, commentoFirma;
    logHandler("wfFlussoAttestati.js -- Respingi ");
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      statoFinale = "RESPINTO";
      formatoFirma = "non eseguita";
      dataFirma = new Date();
      username = execution.getVariable('wfvarUtenteFirmatario').properties.userName;
      commentoFirma = execution.getVariable('wfvarCommento');
      ufficioFirmatario = 'GENERICO';
      codiceDoc = execution.getVariable('wfcnr_codiceDocumentoUfficio');
      wfCommon.setMetadatiFirma(nodoDoc, formatoFirma, username, ufficioFirmatario, dataFirma, codiceDoc, commentoFirma);
      wfCommon.taskEndMajorVersion(nodoDoc, statoFinale);
      setPermessiEndflussoAttestati(nodoDoc);
    }
  }

  function flussoAttestatiEndSettings() {
    var tipologiaNotifica, destinatari;
    logHandler("wfFlussoAttestati.js -- flussoAttestatiEndSettings ");
    // INVIO NOTIFICA
    tipologiaNotifica = 'flussoCompletato';
    destinatari = execution.getVariable('wfvarGruppoATTESTATI');
    if (people.getGroup(destinatari)) {
      notificaMailGruppo(people.getGroup(destinatari), tipologiaNotifica);
    }
    if (people.getPerson(execution.getVariable('wfvarUtenteRichiedente'))) {
      notificaMailSingolo(people.getPerson(execution.getVariable('wfvarUtenteRichiedente')), tipologiaNotifica);
    }
    // --------------
  }
  return {
    setNomeFlusso : setNomeFlusso,
    flussoAttestatiSartSettings : flussoAttestatiSartSettings,
    validazione : validazione,
    validazioneEnd : validazioneEnd,
    Approva : Approva,
    Respingi : Respingi,
    flussoAttestatiEndSettings : flussoAttestatiEndSettings
  };
}

  ());

