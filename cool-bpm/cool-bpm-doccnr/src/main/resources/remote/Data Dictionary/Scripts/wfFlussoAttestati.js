/*global execution, companyhome, logger, utils, cnrutils, use, search, task, actions, bpm_workflowDescription, wfcnr_wfCounterId, bpm_package, bpm_comment, bpm_assignee, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority, initiator, people, wfCommon,wfvarNomeFlusso, arubaSign */
var wfFlussoAttestati = (function () {
  "use strict";
  //Variabili Globali
  //var nomeFlusso = "AUTORIZZAZIONI DSFTM";

  function setNomeFlusso() {
    execution.setVariable('wfvarNomeFlusso', 'FLUSSO ATTESTATI');
    execution.setVariable('wfvarTitoloFlusso', 'FLUSSO_ATTESTATI');
    logger.error("wfFlussoAttestati.js -- wfvarNomeFlusso: " + execution.getVariable('wfvarNomeFlusso'));
  }

  function setProcessVarIntoTask() {
    logger.error("wfFlussoAttestati.js -- setProcessVarIntoTask");
    if (bpm_workflowDueDate !== undefined && bpm_workflowDueDate !== null) {
      task.dueDate = bpm_workflowDueDate;
    }
    if (bpm_workflowPriority !== undefined && bpm_workflowPriority !== null) {
      task.priority = bpm_workflowPriority;
    }
    if (bpm_comment !== undefined && bpm_comment !== null) {
      task.setVariable('bpm_comment', bpm_comment);
    }
    logger.error("wfFlussoAttestati.js -- set bpm_workflowDueDate " +  bpm_workflowDueDate + " bpm_workflowPriority: " + bpm_workflowPriority + " bpm_comment: " + bpm_comment);
  }

  function settaGruppi() {
    logger.error("wfFlussoAttestati.js -- settaGruppi");
    execution.setVariable('wfvarGruppoATTESTATI', 'GROUP_ATTESTATI');
  }

  function settaStartProperties() {
    var workflowPriority;
    logger.error("wfFlussoAttestati.js -- settaStartProperties");
    workflowPriority = execution.getVariable('bpm_workflowPriority');
    if (bpm_workflowPriority === 'undefined') {
      execution.setVariable('bpm_workflowPriority', 3);
    }
    if ((execution.getVariable('bpm_dueDate') !== null) && (execution.getVariable('bpm_dueDate') !== undefined)) {
      execution.setVariable('bpm_dueDate', execution.getVariable('bpm_workflowDueDate'));
    }
    logger.error("wfFlussoDSFTM.js -- get bpm_dueDate: " + execution.getVariable('bpm_dueDate'));
  }


  function flussoAttestatiSartSettings() {
    logger.error("wfFlussoAttestati.js -- flussoAttestatiSartSettings");
    //SET GRUPPI
    settaGruppi();
    settaStartProperties();
    wfCommon.settaDocPrincipale(bpm_package.children[0]);
  }

  function notificaMail(gruppoDestinatariMail, tipologiaNotifica) {
    var members, testo, isWorkflowPooled, destinatario, i;
    logger.error("wfFlussoAttestati.js -- notificaMail");
    members = people.getMembers(gruppoDestinatariMail);
    testo = "Notifica di scadenza di un flusso documentale";
    isWorkflowPooled = true;
    logger.error("FLUSSO ATTESTATI - invia notifica ai membri del gruppo: " + gruppoDestinatariMail.properties.authorityName);
    for (i = 0; i < members.length; i++) {
      destinatario = members[i];
      logger.error("FLUSSO ATTESTATI - invia notifica a : " + destinatario.properties.userName + " del gruppo: " + gruppoDestinatariMail.properties.authorityName);
      //wfCommon.inviaNotifica(destinatario, testo, isWorkflowPooled, gruppoDestinatariMail, execution.getVariable('wfvarNomeFlusso'), tipologiaNotifica);
    }
  }

  function eliminaPermessi(nodoDocumento) {
    // elimina tutti i permessi preesistenti
    var permessi,  i;
    permessi = nodoDocumento.getPermissions();
    nodoDocumento.setInheritsPermissions(false);
    for (i = 0; i < permessi.length; i++) {
      nodoDocumento.removePermission(permessi[i].split(";")[2], permessi[i].split(";")[1]);
      logger.error(i + ") rimuovo permesso: " + permessi[i].split(";")[2] + " a " + permessi[i].split(";")[1]);
    }
    nodoDocumento.setOwner('spaclient');
    logger.error("wfFlussoAttestati.js -- setPermessiValidazione assegno l'ownership del documento: a " + nodoDocumento.getOwner());
  }

  function setPermessiValidazione(nodoDocumento) {
    logger.error("wfFlussoAttestati.js -- setPermessiValidazione con wfvarGruppoATTESTATI: " + execution.getVariable('wfvarGruppoATTESTATI'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoATTESTATI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatario').properties["cm:userName"]);
  }

  function setPermessiEndflussoAttestati(nodoDocumento) {
    logger.error("wfFlussoAttestati.js -- setPermessiEndflussoAttestati con wfvarGruppoATTESTATI: " + execution.getVariable('wfvarGruppoATTESTATI'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoATTESTATI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatario').properties["cm:userName"]);
  }

  function setMetadatiFirma(nodoDocumento, formatoFirma, utenteFirmatario, ufficioFirmatario, dataFirma, codiceDoc) {
    if (!nodoDocumento.hasAspect("wfcnr:signable")) {
      nodoDocumento.addAspect("wfcnr:signable");
      logger.error("Il Doc e' ora signable");
    }
    nodoDocumento.properties["wfcnr:formatoFirma"] = formatoFirma;
    nodoDocumento.properties["wfcnr:utenteFirmatario"] = utenteFirmatario;
    nodoDocumento.properties["wfcnr:ufficioFirmatario"] = ufficioFirmatario;
    nodoDocumento.properties["wfcnr:dataFirma"] = dataFirma;
    nodoDocumento.properties["wfcnr:codiceDoc"] = codiceDoc;
    nodoDocumento.save();
    logger.error("Al Doc: " + nodoDocumento.name + " sono stati aggiunti le seguenti proprieta': formatoFirma: " + formatoFirma + " utenteFirmatario: " + utenteFirmatario + " ufficioFirmatario: " + ufficioFirmatario + " dataFirma: " + dataFirma + " codiceDoc: " + codiceDoc);
  }

  function validazione() {
    var nodoDoc, tipologiaNotifica, destinatari;
    // --------------
    logger.error("wfFlussoAttestati.js -- get bpm_workflowDueDate: " + execution.getVariable('bpm_workflowDueDate'));
    logger.error("wfFlussoAttestati.js -- wfvarGruppoATTESTATI: " + execution.getVariable('wfvarGruppoATTESTATI'));
    logger.error("wfFlussoAttestati.js -- bpm_dueDate: " + task.getVariable('bpm_dueDate'));
    logger.error("wfFlussoAttestati.js -- bpm_priority: " + task.getVariable('bpm_priority'));
    logger.error("wfFlussoAttestati.js -- bpm_comment: " + task.getVariable('bpm_comment'));
    logger.error("wfFlussoAttestati.js -- bpm_assignee: " + task.getVariable('bpm_assignee'));
    execution.setVariable('wfvarUtenteFirmatario', bpm_assignee);
    setProcessVarIntoTask();
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      wfCommon.taskStepMajorVersion(nodoDoc);
      setPermessiValidazione(nodoDoc);
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    destinatari = execution.getVariable('wfvarGruppoATTESTATI');
    notificaMail(people.getGroup(destinatari), tipologiaNotifica);

    task.setVariable('bpm_percentComplete', 30);
  }

  function validazioneEnd() {
    logger.error("wfFlussoAttestati.js -- bpm_assignee: " + task.getVariable('bpm_assignee').properties.userName);
    logger.error("wfFlussoAttestati.js -- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
  }

  function Approva() {
    var nodoDoc, statoFinale, formatoFirma, dataFirma, username, ufficioFirmatario, codiceDoc;
    logger.error("wfFlussoAttestati.js -- Approva ");
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      //nodoDoc.setPermission("Coordinator", execution.getVariable('wfvarUtenteFirmatario').properties["cm:userName"]);
      statoFinale = "APPROVATO";
      formatoFirma = "leggera";
      dataFirma = new Date();
      username = execution.getVariable('wfvarUtenteFirmatario').properties.userName;
      ufficioFirmatario = 'GENERICO';
      codiceDoc = execution.getVariable('wfcnr_codiceDocumentoUfficio');
      setMetadatiFirma(nodoDoc, formatoFirma, username, ufficioFirmatario, dataFirma, codiceDoc);
      logger.error("wfFlussoAttestati.js -- approva: firma leggera ");
      wfCommon.taskEndMajorVersion(nodoDoc, statoFinale);
      setPermessiEndflussoAttestati(nodoDoc);
    }
  }

  function Respingi() {
    var nodoDoc, statoFinale;
    logger.error("wfFlussoAttestati.js -- Respingi ");
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      statoFinale = "RESPINTO";
      wfCommon.taskEndMajorVersion(nodoDoc, statoFinale);
      setPermessiEndflussoAttestati(nodoDoc);
    }
  }

  function flussoAttestatiEndSettings() {
    var tipologiaNotifica, destinatari;
    logger.error("wfFlussoAttestati.js -- flussoAttestatiEndSettings ");
    // INVIO NOTIFICA
    tipologiaNotifica = 'flussoCompletato';
    destinatari = execution.getVariable('wfvarGruppoATTESTATI');
    notificaMail(people.getGroup(destinatari), tipologiaNotifica);
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

