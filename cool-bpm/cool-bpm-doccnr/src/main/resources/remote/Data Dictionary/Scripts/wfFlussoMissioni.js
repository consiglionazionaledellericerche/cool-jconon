/*global execution, companyhome, logger, utils, cnrutils, use, search, task, actions, bpm_workflowDescription, wfcnr_wfCounterId, bpm_package, bpm_comment, bpm_assignee, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority, initiator, people, wfCommon,wfvarNomeFlusso, arubaSign, Packages */
var wfFlussoMissioni = (function () {
  "use strict";
  //Variabili Globali
  //var nomeFlusso = "AUTORIZZAZIONI DSFTM";
  var DEBUG, jsonCNR;
  DEBUG = true;
  jsonCNR = new Packages.org.springframework.extensions.webscripts.json.JSONUtils();

  function logHandler(testo) {
    if (DEBUG) {
      logger.error("wfFlussoMissioni.js -- " + testo);
    }
  }

  function setNomeFlusso() {
    execution.setVariable('wfvarNomeFlusso', 'FLUSSO MISSIONI');
    execution.setVariable('wfvarTitoloFlusso', 'FLUSSO_MISSIONI');
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


  function insertParametriMissioniStart(nodoDoc) {
    logHandler("insertParametriMissioniStart");
    //SET PROPERTIES
    nodoDoc.properties["cnrmissioni:descrizioneOrdine"] = execution.getVariable('cnrmissioni_descrizioneOrdine');
    nodoDoc.properties["cnrmissioni:note"] = execution.getVariable('cnrmissioni_note');
    nodoDoc.properties["cnrmissioni:validazioneSpesaFlag"] = execution.getVariable('cnrmissioni_validazioneSpesaFlag');
    nodoDoc.properties["cnrmissioni:missioneConAnticipoFlag"] = execution.getVariable('cnrmissioni_missioneConAnticipoFlag');
    nodoDoc.properties["cnrmissioni:validazioneModuloFlag"] = execution.getVariable('cnrmissioni_validazioneModuloFlag');
    nodoDoc.properties["cnrmissioni:userNameRichiedente"] = execution.getVariable('cnrmissioni_userNameRichiedente');
    nodoDoc.properties["cnrmissioni:userNameResponsabileModulo"] = execution.getVariable('cnrmissioni_userNameResponsabileModulo');
    nodoDoc.properties["cnrmissioni:userNamePrimoFirmatario"] = execution.getVariable('cnrmissioni_userNamePrimoFirmatario');
    nodoDoc.properties["cnrmissioni:userNameFirmatarioSpesa"] = execution.getVariable('cnrmissioni_userNameFirmatarioSpesa');
    nodoDoc.properties["cnrmissioni:uoOrdine"] = execution.getVariable('cnrmissioni_uoOrdine');
    nodoDoc.properties["cnrmissioni:descrizioneUoOrdine"] = execution.getVariable('cnrmissioni_descrizioneUoOrdine');
    nodoDoc.properties["cnrmissioni:uoSpesa"] = execution.getVariable('cnrmissioni_uoSpesa');
    nodoDoc.properties["cnrmissioni:descrizioneUoSpesa"] = execution.getVariable('cnrmissioni_descrizioneUoSpesa');
    nodoDoc.properties["cnrmissioni:autoPropriaFlag"] = execution.getVariable('cnrmissioni_autoPropriaFlag');
    nodoDoc.properties["cnrmissioni:noleggioFlag"] = execution.getVariable('cnrmissioni_noleggioFlag');
    nodoDoc.properties["cnrmissioni:taxiFlag"] = execution.getVariable('cnrmissioni_taxiFlag');
    nodoDoc.properties["cnrmissioni:capitolo"] = execution.getVariable('cnrmissioni_capitolo');
    nodoDoc.properties["cnrmissioni:descrizioneCapitolo"] = execution.getVariable('cnrmissioni_descrizioneCapitolo');
    nodoDoc.properties["cnrmissioni:modulo"] = execution.getVariable('cnrmissioni_modulo');
    nodoDoc.properties["cnrmissioni:descrizioneModulo"] = execution.getVariable('cnrmissioni_descrizioneModulo');
    nodoDoc.properties["cnrmissioni:gae"] = execution.getVariable('cnrmissioni_gae');
    nodoDoc.properties["cnrmissioni:descrizioneGae"] = execution.getVariable('cnrmissioni_descrizioneGae');
    nodoDoc.properties["cnrmissioni:impegnoAnnoResiduo"] = execution.getVariable('cnrmissioni_impegnoAnnoResiduo');
    nodoDoc.properties["cnrmissioni:impegnoAnnoCompetenza"] = execution.getVariable('cnrmissioni_impegnoAnnoCompetenza');
    nodoDoc.properties["cnrmissioni:impegnoNumero"] = execution.getVariable('cnrmissioni_impegnoNumero');
    nodoDoc.properties["cnrmissioni:descrizioneImpegno"] = execution.getVariable('cnrmissioni_descrizioneImpegno');
    nodoDoc.properties["cnrmissioni:importoMissione"] = execution.getVariable('cnrmissioni_importoMissione');
    nodoDoc.properties["cnrmissioni:disponibilita"] = execution.getVariable('cnrmissioni_disponibilita');
    nodoDoc.properties["cnrmissioni:commento"] = execution.getVariable('bpm_comment');
    nodoDoc.save();
    logHandler("insertParametriMissioniStart - parametri inseriti");
  }

  function updateParametriMissioni(nodoDoc) {
    logHandler("insertParametriMissioni");
    //SET PROPERTIES
    nodoDoc.properties["cnrmissioni:autoPropriaFlag"] = task.getVariable('cnrmissioni_autoPropriaFlag');
    nodoDoc.properties["cnrmissioni:noleggioFlag"] = task.getVariable('cnrmissioni_noleggioFlag');
    nodoDoc.properties["cnrmissioni:taxiFlag"] = task.getVariable('cnrmissioni_taxiFlag');
    nodoDoc.properties["cnrmissioni:commento"] = task.getVariable('bpm_comment');
    nodoDoc.save();
  }

  function settaGruppi() {
    logHandler("settaGruppi");
    execution.setVariable('wfvarGruppoResponsabiliMISSIONI', 'RESPONSABILI_MISSIONI');
    logHandler("wfvarGruppoResponsabiliMISSIONI: " + execution.getVariable('wfvarGruppoResponsabiliMISSIONI'));
  }

  function settaDocAspects(nodoDoc) {
    if (nodoDoc.hasAspect('wfcnr:parametriFlusso')) {
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta gia' con aspect parametriFlusso");
    } else {
      nodoDoc.addAspect("wfcnr:parametriFlusso");
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta ora con aspect parametriFlusso");
    }
    if (nodoDoc.hasAspect('wfcnr:signable')) {
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta gia' con aspect signable");
    } else {
      nodoDoc.addAspect("wfcnr:signable");
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta ora con aspect signable");
    }
    if (nodoDoc.hasAspect('cnrmissioni:parametriFlussoMissioni')) {
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta gia' con aspect parametriFlussoMissioni");
    } else {
      nodoDoc.addAspect("cnrmissioni:parametriFlussoMissioni");
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta ora con aspect parametriFlussoMissioni");
    }
  }

  function settaStartVariables() {
    var utenteRichiedente, utenteResponsabileModulo, utentePrimoFirmatario, utenteFirmatarioSpesa;
    // APPLICATION SETTING
    execution.setVariable('wfvarGruppoMissioni', 'GROUP_RESPONSABILI_MISSIONI');
    try {
      people.getGroup(execution.getVariable('wfvarGruppoMissioni'));
    } catch (err) {
      throw new Error("IL GRUPPO RESPONSABILI_MISSIONI NON E' STATO ANCORA CREATO");
    }
    // FLAG SETTING per le scelte (gateway)
    if (execution.getVariable('cnrmissioni_validazioneModuloFlag')) {
      execution.setVariable('wfvarValidazioneModulo', execution.getVariable('cnrmissioni_validazioneModuloFlag'));
    } else {
      execution.setVariable('wfvarValidazioneModulo', false);
    }
    if (execution.getVariable('cnrmissioni_validazioneSpesaFlag')) {
      execution.setVariable('wfvarValidazioneSpesa', execution.getVariable('cnrmissioni_validazioneSpesaFlag'));
    } else {
      execution.setVariable('wfvarValidazioneSpesa', false);
    }
    if (execution.getVariable('cnrmissioni_missioneConAnticipoFlag')) {
      execution.setVariable('wfvarMissioneConAnticipo', execution.getVariable('cnrmissioni_missioneConAnticipoFlag'));
    } else {
      execution.setVariable('wfvarMissioneConAnticipo', false);
    }

    // ACTOR USERS SETTING
    if ((execution.getVariable('cnrmissioni_userNameRichiedente')) && (execution.getVariable('cnrmissioni_userNameRichiedente').length() !== 0)) {
      utenteRichiedente = people.getPerson(execution.getVariable('cnrmissioni_userNameRichiedente'));
      if (utenteRichiedente) {
        execution.setVariable('wfvarUtenteRichiedente', utenteRichiedente.properties.userName);
        logHandler("utenteRichiedente: " + execution.getVariable('wfvarUtenteRichiedente'));
      }
    }
    if ((execution.getVariable('cnrmissioni_userNameResponsabileModulo')) && (execution.getVariable('cnrmissioni_userNameResponsabileModulo').length() !== 0)) {
      utenteResponsabileModulo = people.getPerson(execution.getVariable('cnrmissioni_userNameResponsabileModulo'));
      if (utenteResponsabileModulo) {
        execution.setVariable('wfvarUtenteResponsabileModulo', utenteResponsabileModulo.properties.userName);
        logHandler("utenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
      }
    }
    if ((execution.getVariable('cnrmissioni_userNamePrimoFirmatario')) && (execution.getVariable('cnrmissioni_userNamePrimoFirmatario').length() !== 0)) {
      utentePrimoFirmatario = people.getPerson(execution.getVariable('cnrmissioni_userNamePrimoFirmatario'));
      if (utentePrimoFirmatario) {
        execution.setVariable('wfvarUtentePrimoFirmatario', utentePrimoFirmatario.properties.userName);
        logHandler("utentePrimoFirmatario: " + execution.getVariable('wfvarUtentePrimoFirmatario'));
      }
    }
    if ((execution.getVariable('cnrmissioni_userNameFirmatarioSpesa')) && (execution.getVariable('cnrmissioni_userNameFirmatarioSpesa').length() !== 0)) {
      utenteFirmatarioSpesa = people.getPerson(execution.getVariable('cnrmissioni_userNameFirmatarioSpesa'));
      if (utenteFirmatarioSpesa) {
        execution.setVariable('wfvarUtenteFirmatarioSpesa', utenteFirmatarioSpesa.properties.userName);
        logHandler("utenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
      }
    }

    logHandler("settaStartVariables: wfvarValidazioneModulo: " + execution.getVariable('wfvarValidazioneModulo') + " wfvarValidazioneSpesa: " + execution.getVariable('wfvarValidazioneSpesa') + " wfvarMissioneConAnticipo: " + execution.getVariable('wfvarMissioneConAnticipo'));
  }

  function settaStartProperties() {
    var workflowPriority;
    logHandler("settaStartProperties");
    // bpm_assignee
    execution.setVariable('bpm_assignee', initiator.properties.userName);
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
    //CONTROLLO SE initiator è SPACLIENT ADMIN E MISSIONI1
  }

  function flussoMissioniSartSettings() {
    var i;
    logHandler("flussoMissioniSartSettings");
    //SET GRUPPI
    settaGruppi();
    settaStartVariables();
    settaStartProperties();
    for (i = 0; i < bpm_package.children.length; i++) {
      settaDocAspects(bpm_package.children[i]);
      insertParametriMissioniStart(bpm_package.children[i]);
    }
    //wfCommon.settaDocPrincipale(bpm_package.children[0]);
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

// FUNZIONI PERMESSI
  function eliminaPermessi(nodoDocumento) {
    // elimina tutti i permessi preesistenti
    var permessi,  i;
    permessi = nodoDocumento.getPermissions();
    logHandler("eliminaPermessi permessi: " + permessi);
    nodoDocumento.setInheritsPermissions(false);
    for (i = 0; i < permessi.length; i++) {
      nodoDocumento.removePermission(permessi[i].split(";")[2], permessi[i].split(";")[1]);
      logHandler(i + ") rimuovo permesso: " + permessi[i].split(";")[2] + " a " + permessi[i].split(";")[1]);
    }
    nodoDocumento.setOwner('spaclient');
    logHandler("setPermessi assegno l'ownership del documento: a " + nodoDocumento.getOwner());
  }

  function setPermessiVisto(nodoDocumento) {
    logHandler("wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    eliminaPermessi(nodoDocumento);
    logHandler("wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    logHandler("wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
    logHandler("wfvarUtentePrimoFirmatario: " + execution.getVariable('wfvarUtentePrimoFirmatario'));
    logHandler("wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    logHandler("wfvarUtenteRichiedente: " + execution.getVariable('wfvarUtenteRichiedente'));
    if (execution.getVariable('wfvarGruppoMissioni')) {
      if ((people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== null) && (people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
        logHandler("setPermessiVisto con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
      }
    } else {
      logHandler("wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    if (execution.getVariable('wfvarUtenteResponsabileModulo')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
        logHandler("setPermessiVisto con wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
      }
    } else {
      logHandler("wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
    }
    if (execution.getVariable('wfvarUtenteFirmatarioSpesa')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
        logHandler("setPermessiVisto con wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
      }
    } else {
      logHandler("wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Consumer", initiator.properties.userName);
    logHandler("setPermessiVisto Consumer a tutti e  initiator: " + initiator.properties.userName);
  }

  function setPermessiFirmaUo(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (execution.getVariable('wfvarGruppoMissioni')) {
      if ((people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== null) && (people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
        logHandler("setPermessiFirmaUo con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
      }
    } else {
      logHandler("wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    if (execution.getVariable('wfvarUtenteResponsabileModulo')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
        logHandler("setPermessiFirmaUo con wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
      }
    } else {
      logHandler("wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
    }
    if (execution.getVariable('wfvarUtenteFirmatarioSpesa')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
        logHandler("setPermessiFirmaUo con wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
      }
    } else {
      logHandler("wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Consumer", initiator.properties.userName);
    logHandler("setPermessiFirmaUo Consumer a tutti e  initiator: " + initiator.properties.userName);
  }

  function setPermessiFirmaSpesa(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (execution.getVariable('wfvarGruppoMissioni')) {
      if ((people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== null) && (people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
        logHandler("setPermessiFirmaSpesa con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
      }
    } else {
      logHandler("wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    if (execution.getVariable('wfvarUtenteResponsabileModulo')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
        logHandler("setPermessiFirmaSpesa con wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
      }
    } else {
      logHandler("wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
    }
    if (execution.getVariable('wfvarUtenteFirmatarioSpesa')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
        logHandler("setPermessiFirmaSpesa con wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
      }
    } else {
      logHandler("wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Consumer", initiator.properties.userName);
    logHandler("setPermessiFirmaSpesa Consumer a tutti e  initiator: " + initiator.properties.userName);
  }

  function setPermessirespintoUo(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (execution.getVariable('wfvarGruppoMissioni')) {
      if ((people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== null) && (people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
        logHandler("setPermessirespintoUo con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
      }
    } else {
      logHandler("wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    if (execution.getVariable('wfvarUtenteResponsabileModulo')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
        logHandler("setPermessirespintoUo con wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
      }
    } else {
      logHandler("wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
    }
    if (execution.getVariable('wfvarUtenteFirmatarioSpesa')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
        logHandler("setPermessirespintoUo con wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
      }
    } else {
      logHandler("wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Coordinator", initiator.properties.userName);
    logHandler("setPermessirespintoUo Consumer a tutti e Coordinator a initiator: " + initiator.properties.userName);
  }

  function setPermessiRespintoSpesa(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (execution.getVariable('wfvarGruppoMissioni')) {
      if ((people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== null) && (people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
        logHandler("setPermessiRespintoSpesa con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
      }
    } else {
      logHandler("wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    if (execution.getVariable('wfvarUtenteResponsabileModulo')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
        logHandler("setPermessiRespintoSpesa con wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
      }
    } else {
      logHandler("wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
    }
    if (execution.getVariable('wfvarUtenteFirmatarioSpesa')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
        logHandler("setPermessiRespintoSpesa con wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
      }
    } else {
      logHandler("wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Coordinator", initiator.properties.userName);
    logHandler("setPermessiRespintoSpesa Consumer a tutti e Coordinator a initiator: " + initiator.properties.userName);
  }

  function setPermessiEndflussoMissioni(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (execution.getVariable('wfvarGruppoMissioni')) {
      if ((people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== null) && (people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
        logHandler("setPermessiEndflussoMissioni con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
      }
    } else {
      logHandler("wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    if (execution.getVariable('wfvarUtenteResponsabileModulo')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
        logHandler("setPermessiEndflussoMissioni con wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
      }
    } else {
      logHandler("wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
    }
    if (execution.getVariable('wfvarUtenteFirmatarioSpesa')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
        logHandler("setPermessiEndflussoMissioni con wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
      }
    } else {
      logHandler("wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Consumer", initiator.properties.userName);
    logHandler("setPermessiRespinto Consumer a tutti e  initiator: " + initiator.properties.userName);
  }


  function setPermessiDocFirmati(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (execution.getVariable('wfvarGruppoMissioni')) {
      if ((people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== null) && (people.getGroup(execution.getVariable('wfvarGruppoMissioni')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
        logHandler("setPermessiEndflussoMissioni con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
      }
    } else {
      logHandler("wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    if (execution.getVariable('wfvarUtenteResponsabileModulo')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteResponsabileModulo')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
        logHandler("setPermessiEndflussoMissioni con wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
      }
    } else {
      logHandler("wfvarUtenteResponsabileModulo: " + execution.getVariable('wfvarUtenteResponsabileModulo'));
    }
    if (execution.getVariable('wfvarUtenteFirmatarioSpesa')) {
      if ((people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== null) && (people.getGroup(execution.getVariable('wfvarUtenteFirmatarioSpesa')) !== undefined)) {
        nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
        logHandler("setPermessiEndflussoMissioni con wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
      }
    } else {
      logHandler("wfvarUtenteFirmatarioSpesa: " + execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Consumer", initiator.properties.userName);
    logHandler("setPermessiRespinto Consumer a tutti e  initiator: " + initiator.properties.userName);
  }

// DETTAGLI

  function setDettagliIniziali() {
    var wfvarDettagliFlussoMap, wfvarDettagliFlussoString, wfvarDettagliFlussoObj, data, IsoDate, utenteRichiedente, uoOrdineString, uoSpesaString, captioloString, gaeString, moduloString, impegnoString;
    // VARIABILE DETTAGLI FLUSSO
    data = new Date();
    IsoDate = utils.toISO8601(data);
    wfvarDettagliFlussoObj = jsonCNR.toObject('{"tasks":[]}');
    wfvarDettagliFlussoMap = [];
    wfvarDettagliFlussoMap.name = "RICHIESTA";
    wfvarDettagliFlussoMap.data = [];
    wfvarDettagliFlussoMap.data.Tipo = "Missioni";
    wfvarDettagliFlussoMap.data.data = IsoDate.toString();
    if ((execution.getVariable('cnrmissioni_userNameRichiedente')) && (execution.getVariable('cnrmissioni_userNameRichiedente').length() !== 0)) {
      utenteRichiedente = people.getPerson(execution.getVariable('cnrmissioni_userNameRichiedente'));
      wfvarDettagliFlussoMap.data["effettuata da"] = utenteRichiedente.properties.firstName + " " + utenteRichiedente.properties.lastName;
    }
    if ((execution.getVariable('cnrmissioni_descrizioneOrdine')) && (execution.getVariable('cnrmissioni_descrizioneOrdine').length() !== 0)) {
      wfvarDettagliFlussoMap.data.Descrizione = execution.getVariable('cnrmissioni_descrizioneOrdine');
    }
    if ((execution.getVariable('cnrmissioni_note')) && (execution.getVariable('cnrmissioni_note').length() !== 0)) {
      wfvarDettagliFlussoMap.data.Note = execution.getVariable('cnrmissioni_note');
    }
    if (execution.getVariable('cnrmissioni_missioneConAnticipoFlag').toString().equals('true')) {
      wfvarDettagliFlussoMap.data["richiesta con"] = "anticipo";
    }
    if (execution.getVariable('cnrmissioni_autoPropriaFlag').toString().equals('true')) {
      wfvarDettagliFlussoMap.data["mezzo di trasporto"] = "auto propria";
    }
    if (execution.getVariable('cnrmissioni_noleggioFlag').toString().equals('true')) {
      wfvarDettagliFlussoMap.data["mezzo di trasporto"] = "auto a noleggio";
    }
    if (execution.getVariable('cnrmissioni_taxiFlag').toString().equals('true')) {
      wfvarDettagliFlussoMap.data["mezzo di trasporto"] = "taxi";
    }
    if ((execution.getVariable('cnrmissioni_uoOrdine')) && (execution.getVariable('cnrmissioni_uoOrdine').length() !== 0)) {
      uoOrdineString = execution.getVariable('cnrmissioni_uoOrdine');
      if ((execution.getVariable('cnrmissioni_descrizioneUoOrdine')) && (execution.getVariable('cnrmissioni_descrizioneUoOrdine').length() !== 0)) {
        uoOrdineString = uoOrdineString + "("  + execution.getVariable('cnrmissioni_descrizioneUoOrdine') + ")";
      }
      wfvarDettagliFlussoMap.data["Ordine UO"] = uoOrdineString;
    }
    if ((execution.getVariable('cnrmissioni_uoSpesa')) && (execution.getVariable('cnrmissioni_uoSpesa').length() !== 0)) {
      uoSpesaString = execution.getVariable('cnrmissioni_uoSpesa');
      if ((execution.getVariable('cnrmissioni_descrizioneUoSpesa')) && (execution.getVariable('cnrmissioni_descrizioneUoSpesa').length() !== 0)) {
        uoSpesaString = uoSpesaString + "("  + execution.getVariable('cnrmissioni_descrizioneUoSpesa') + ")";
      }
      wfvarDettagliFlussoMap.data["Ordine UO"] = uoSpesaString;
    }
    if ((execution.getVariable('cnrmissioni_capitolo')) && (execution.getVariable('cnrmissioni_capitolo').length() !== 0)) {
      captioloString = execution.getVariable('cnrmissioni_capitolo');
      if ((execution.getVariable('cnrmissioni_descrizioneCapitolo')) && (execution.getVariable('cnrmissioni_descrizioneCapitolo').length() !== 0)) {
        captioloString = captioloString + "("  + execution.getVariable('cnrmissioni_descrizioneCapitolo') + ")";
      }
      wfvarDettagliFlussoMap.data.Capitolo = captioloString;
    }
    if ((execution.getVariable('cnrmissioni_modulo')) && (execution.getVariable('cnrmissioni_modulo').length() !== 0)) {
      moduloString = execution.getVariable('cnrmissioni_modulo');
      if ((execution.getVariable('cnrmissioni_descrizioneModulo')) && (execution.getVariable('cnrmissioni_descrizioneModulo').length() !== 0)) {
        moduloString = moduloString + "("  + execution.getVariable('cnrmissioni_descrizioneModulo') + ")";
      }
      wfvarDettagliFlussoMap.data.Modulo = moduloString;
    }
    if ((execution.getVariable('cnrmissioni_gae')) && (execution.getVariable('cnrmissioni_gae').length() !== 0)) {
      gaeString = execution.getVariable('cnrmissioni_gae');
      if ((execution.getVariable('cnrmissioni_descrizioneGae')) && (execution.getVariable('cnrmissioni_descrizioneGae').length() !== 0)) {
        gaeString = gaeString + "("  + execution.getVariable('cnrmissioni_descrizioneGae') + ")";
      }
      wfvarDettagliFlussoMap.data.GAE = gaeString;
    }
    if ((execution.getVariable('cnrmissioni_impegnoNumero')) && (execution.getVariable('cnrmissioni_impegnoNumero').length() !== 0)) {
      impegnoString = execution.getVariable('cnrmissioni_impegnoNumero');
      if ((execution.getVariable('cnrmissioni_descrizioneImpegno')) && (execution.getVariable('cnrmissioni_descrizioneImpegno').length() !== 0)) {
        impegnoString = impegnoString + "("  + execution.getVariable('cnrmissioni_descrizioneImpegno') + ")";
      }
      wfvarDettagliFlussoMap.data.Impegno = impegnoString;
    }
    if ((execution.getVariable('cnrmissioni_impegnoAnnoResiduo'))) {
      wfvarDettagliFlussoMap.data["Impegno Anno Residuo"] = (execution.getVariable('cnrmissioni_impegnoAnnoResiduo'));
    }
    if ((execution.getVariable('cnrmissioni_impegnoAnnoCompetenza'))) {
      wfvarDettagliFlussoMap.data["Impegno Anno Competenza"] = (execution.getVariable('cnrmissioni_impegnoAnnoCompetenza'));
    }
    if ((execution.getVariable('cnrmissioni_importoMissione'))) {
      wfvarDettagliFlussoMap.data["Importo Missione"] = (execution.getVariable('cnrmissioni_importoMissione'));
    }
    if ((execution.getVariable('cnrmissioni_disponibilita'))) {
      wfvarDettagliFlussoMap.data["disponibilità"] = (execution.getVariable('cnrmissioni_disponibilita'));
    }
    wfvarDettagliFlussoObj.tasks.add(wfvarDettagliFlussoMap);
    wfvarDettagliFlussoString = jsonCNR.toJSONString(wfvarDettagliFlussoObj);
    execution.setVariable('wfcnr_dettagliFlussoJson',  wfvarDettagliFlussoString);
    logHandler("wfvarDettagliFlussoString: " + wfvarDettagliFlussoString);
  }

  function vistoDettagli() {
    // VARIABILE DETTAGLI FLUSSO
    wfCommon.inserisciDettagliJsonSemplici("Responsabile Modulo");
  }
  function firmaUoDettagli() {
    // VARIABILE DETTAGLI FLUSSO
    if (execution.getVariable('cnrmissioni_validazioneSpesaFlag')) {
      wfCommon.inserisciDettagliJsonSemplici("Direttore UO");
    }
  }
  function firmaSpesaDettagli() {
    // VARIABILE DETTAGLI FLUSSO
    wfCommon.inserisciDettagliJsonSemplici("Direttore Centro di Spesa");
  }
  function respintoUoDettagli() {
    // VARIABILE DETTAGLI FLUSSO
    if ((task.getVariable('wfcnr_reviewOutcome') !== null) && (task.getVariable('wfcnr_reviewOutcome').equals("Riproponi"))) {
      wfCommon.inserisciDettagliJsonSemplici("Applicazione Missioni");
    }
  }
  function respintoSpesaDettagli() {
    // VARIABILE DETTAGLI FLUSSO
    if ((task.getVariable('wfcnr_reviewOutcome') !== null) && (task.getVariable('wfcnr_reviewOutcome').equals("Riproponi"))) {
      wfCommon.inserisciDettagliJsonSemplici("Applicazione Missioni");
    }
  }

// SETTO STATO FINALE
  function settaStatoFinale(statoFinale) {
    var nodoDoc, i;
     // GESTIONE DOC
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      for (i = 0; i < bpm_package.children.length; i++) {
        nodoDoc = bpm_package.children[i];
        if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
          wfCommon.taskEndMajorVersion(nodoDoc, statoFinale);
        }
        setPermessiEndflussoMissioni(nodoDoc);
      }
    }
  }

// FUNZIONI STATO

// ---------------------------- VISTO ----------------------------

  function visto() {
    var nodoDoc, tipologiaNotifica, i, esisteDocPrincipale;
    esisteDocPrincipale = false;
    // --------------
    logHandler("visto");
    logHandler("get bpm_workflowDueDate: " + execution.getVariable('bpm_workflowDueDate'));
    logHandler("wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    logHandler("bpm_dueDate: " + task.getVariable('bpm_dueDate'));
    logHandler("bpm_priority: " + task.getVariable('bpm_priority'));
    logHandler("bpm_comment: " + task.getVariable('bpm_comment'));
    logHandler("bpm_assignee: " + task.getVariable('bpm_assignee'));
    execution.setVariable('wfvarUtenteFirmatario', bpm_assignee);
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    if (execution.getVariable('wfvarValidazioneSpesa')) {
      task.setVariable('bpm_percentComplete', 25);
    } else {
      task.setVariable('bpm_percentComplete', 35);
    }
    // GESTIONE DOC
    logHandler("bpm_package.children.length: " + bpm_package.children.length);
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      for (i = 0; i < bpm_package.children.length; i++) {
        nodoDoc = bpm_package.children[i];
        logHandler("doc: " + nodoDoc.name + " - tipologiaDOC: " + nodoDoc.properties["wfcnr:tipologiaDOC"]);
        if (nodoDoc.properties["wfcnr:tipologiaDOC"]) {
          if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
            logHandler("Principale? " + nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale'));
            esisteDocPrincipale = true;
            wfCommon.taskStepMajorVersion(nodoDoc);
          }
        } else {
          logHandler("IL DOCUMENTO: " + nodoDoc.name + " DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO");
          //throw new Error("IL DOCUMENTO: " + nodoDoc.name + " DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO");
        }
        logHandler("doc: " + nodoDoc.name);
        setPermessiVisto(nodoDoc);
      }
      if (!esisteDocPrincipale) {
        logHandler("ALMENO UN DOCUMENTO DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO COME 'Principale'");
        //throw new Error("ALMENO UN DOCUMENTO DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO COME 'Principale'");
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(execution.getVariable('wfvarUtenteResponsabileModulo'))) {
      notificaMailSingolo(people.getPerson(execution.getVariable('wfvarUtenteResponsabileModulo')).properties.userName, tipologiaNotifica);
    }
    // DETTAGLI
    if (execution.getVariable('wfcnr_dettagliFlussoJson') === undefined || execution.getVariable('wfcnr_dettagliFlussoJson') === null || execution.getVariable('wfcnr_dettagliFlussoJson').length() === 0) {
      setDettagliIniziali();
    }
  }

  function vistoEnd() {
    var nodoDoc, utenteVisto, ufficioVisto, dataVisto, commentoVisto, i;
    logHandler("vistoEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("vistoEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    wfCommon.setTaskVarIntoProcess();
    // INSERIMENTO PARAMETRI VISTO
    utenteVisto = execution.getVariable('wfvarUtenteResponsabileModulo');
    ufficioVisto = 'GENERICO';
    dataVisto = new Date();
    commentoVisto = execution.getVariable('bpm_comment');
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      for (i = 0; i < bpm_package.children.length; i++) {
        nodoDoc = bpm_package.children[i];
        if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
          wfCommon.setMetadatiVisto(nodoDoc, utenteVisto, ufficioVisto, dataVisto, commentoVisto);
        }
      }
    }
  }

  // ---------------------------- FIRMA UO ----------------------------
  function firmaUo() {
    var nodoDoc, tipologiaNotifica, i, esisteDocPrincipale;
    esisteDocPrincipale = false;
    // --------------
    logHandler("firmaUo");
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 60);
    if ((execution.getVariable('wfvarValidazioneModulo')) && (execution.getVariable('wfvarValidazioneSpesa'))) {
      task.setVariable('bpm_percentComplete', 50);
    } else if ((execution.getVariable('wfvarValidazioneModulo')) && (!execution.getVariable('wfvarValidazioneSpesa'))) {
      task.setVariable('bpm_percentComplete', 70);
    } else if ((!execution.getVariable('wfvarValidazioneModulo')) && (execution.getVariable('wfvarValidazioneSpesa'))) {
      task.setVariable('bpm_percentComplete', 35);
    }
    // GESTIONE DOC
    logHandler("bpm_package.children.length: " + bpm_package.children.length);
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      for (i = 0; i < bpm_package.children.length; i++) {
        nodoDoc = bpm_package.children[i];
        logHandler("doc: " + nodoDoc.name + " - tipologiaDOC: " + nodoDoc.properties["wfcnr:tipologiaDOC"]);
        if (nodoDoc.properties["wfcnr:tipologiaDOC"]) {
          if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
            logHandler("Principale? " + nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale'));
            esisteDocPrincipale = true;
            wfCommon.taskStepMajorVersion(nodoDoc);
          }
        } else {
          logHandler("IL DOCUMENTO: " + nodoDoc.name + " DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO");
          //throw new Error("IL DOCUMENTO: " + nodoDoc.name + " DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO");
        }
        logHandler("doc: " + nodoDoc.name);
        setPermessiFirmaUo(nodoDoc);
      }
      if (!esisteDocPrincipale) {
        logHandler("ALMENO UN DOCUMENTO DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO COME 'Principale'");
        //throw new Error("ALMENO UN DOCUMENTO DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO COME 'Principale'");
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    logHandler("wfvarUtentePrimoFirmatario: " + execution.getVariable('wfvarUtentePrimoFirmatario'));
    if (people.getPerson(execution.getVariable('wfvarUtentePrimoFirmatario'))) {
      logHandler("wfvarUtentePrimoFirmatario: " + people.getPerson(execution.getVariable('wfvarUtentePrimoFirmatario')).properties.userName);
      notificaMailSingolo(people.getPerson(execution.getVariable('wfvarUtentePrimoFirmatario')).properties.userName, tipologiaNotifica);
    }
    // DETTAGLI
    if (execution.getVariable('wfcnr_dettagliFlussoJson') === undefined || execution.getVariable('wfcnr_dettagliFlussoJson') === null || execution.getVariable('wfcnr_dettagliFlussoJson').length() === 0) {
      setDettagliIniziali();
    }
  }

  function firmaUoEnd() {
    var username, password, otp, codiceDoc,  ufficioFirmatario, commentoFirma, nodoDoc, i, formatoFirma, dataFirma, tipologiaFirma, elencoFile, j, k, docFirmato;
    elencoFile = [];
    j = 0;
    logHandler("firmaUoEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("firmaUoEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    commentoFirma = task.getVariable('bpm_comment');
    wfCommon.setTaskVarIntoProcess();
    if (task.getVariable('wfcnr_reviewOutcome').equals('Firma')) {
    // ESECUZIONE FIRMA
      username = task.getVariable('wfcnr_userFirma');
      password = task.getVariable('wfcnr_userPwFirma');
      otp = task.getVariable('wfcnr_pinFirma');
      codiceDoc = task.getVariable('wfcnr_codiceDocumentoUfficio');
      ufficioFirmatario = 'GENERICO';
      tipologiaFirma = 'Firma';
      logHandler("firmaUoEnd: username" +  username + " codiceDoc: " + codiceDoc);
      //SELEZIONA ELENCO FILE DA FIRMARE E LI CONSERVA NELL'ARRAY ELENCO
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        for (i = 0; i < bpm_package.children.length; i++) {
          nodoDoc = bpm_package.children[i];
          if (nodoDoc.properties["wfcnr:tipologiaDOC"]) {
            if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
              elencoFile[j] = nodoDoc;
              j++;
            }
          }
        }
        //ESEGUO IL CICLO DI FIRME DALL'ARRAY ELENCO
        for (k = 0; k < elencoFile.length; k++) {
          docFirmato = wfCommon.eseguiFirma(username, password, otp, elencoFile[k], ufficioFirmatario, codiceDoc, commentoFirma, tipologiaFirma);
          if (docFirmato) {
            setPermessiDocFirmati(docFirmato);
          }
        }
      }
      //SET STATO FINALE
      if (!(execution.getVariable('wfvarValidazioneSpesa'))) {
        settaStatoFinale("FIRMATO");
      }
    } else if (task.getVariable('wfcnr_reviewOutcome').equals('Modifica')) {
    // ESECUZIONE MODIFICA
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        for (i = 0; i < bpm_package.children.length; i++) {
          nodoDoc = bpm_package.children[i];
          if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
            updateParametriMissioni(nodoDoc);
          }
        }
      }
    } else {
    // ESECUZIONE RESPINGI
      formatoFirma = "non eseguita";
      dataFirma = new Date();
      if (execution.getVariable('wfvarUtentePrimoFirmatario')) {
        username = execution.getVariable('wfvarUtentePrimoFirmatario');
      }
      ufficioFirmatario = 'GENERICO';
      codiceDoc = execution.getVariable('wfcnr_codiceDocumentoUfficio');
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        for (i = 0; i < bpm_package.children.length; i++) {
          nodoDoc = bpm_package.children[i];
          if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
            updateParametriMissioni(nodoDoc);
            wfCommon.setMetadatiFirmaRespinto(nodoDoc, formatoFirma, username, ufficioFirmatario, dataFirma, codiceDoc, commentoFirma, nodoDoc.nodeRef);
          }
        }
      }
    }
  }


  // ---------------------------- FIRMA SPESA ----------------------------
  function firmaSpesa() {
    var nodoDoc, tipologiaNotifica, i;
    // --------------
    logHandler("firmaSpesa");
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 70);
    if (execution.getVariable('wfvarValidazioneModulo')) {
      task.setVariable('bpm_percentComplete', 75);
    }
    // GESTIONE DOC
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      for (i = 0; i < bpm_package.children.length; i++) {
        nodoDoc = bpm_package.children[i];
        if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
          wfCommon.taskStepMajorVersion(nodoDoc);
        }
        setPermessiFirmaSpesa(nodoDoc);
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(execution.getVariable('wfvarUtenteFirmatarioSpesa'))) {
      notificaMailSingolo(people.getPerson(execution.getVariable('wfvarUtenteFirmatarioSpesa')).properties.userName, tipologiaNotifica);
    }
  }

  function firmaSpesaEnd() {
    var username, password, otp, codiceDoc,  ufficioFirmatario, commentoFirma, nodoDoc, i, formatoFirma, dataFirma, tipologiaFirma, elencoFile, j, k, docFirmato;
    elencoFile = [];
    j = 0;
    logHandler("firmaSpesaEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("firmaSpesaEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    commentoFirma = task.getVariable('bpm_comment');
    wfCommon.setTaskVarIntoProcess();
    if (task.getVariable('wfcnr_reviewOutcome').equals('Firma')) {
    // ESECUZIONE FIRMA
      username = task.getVariable('wfcnr_userFirma');
      password = task.getVariable('wfcnr_userPwFirma');
      otp = task.getVariable('wfcnr_pinFirma');
      codiceDoc = task.getVariable('wfcnr_codiceDocumentoUfficio');
      ufficioFirmatario = 'GENERICO';
      tipologiaFirma = 'Controfirma';
      logHandler("firmaSpesaEnd: username" +  username + " codiceDoc: " + codiceDoc);
      //SELEZIONA ELENCO FILE DA FIRMARE E LI CONSERVA NELL'ARRAY ELENCO
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        for (i = 0; i < bpm_package.children.length; i++) {
          nodoDoc = bpm_package.children[i];
          if (nodoDoc.properties["wfcnr:tipologiaDOC"]) {
            if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Firmato')) {
              elencoFile[j] = nodoDoc;
              j++;
            }
          }
        }
        //ESEGUO IL CICLO DI FIRME DALL'ARRAY ELENCO
        for (k = 0; k < elencoFile.length; k++) {
          docFirmato = wfCommon.eseguiFirma(username, password, otp, elencoFile[k], ufficioFirmatario, codiceDoc, commentoFirma, tipologiaFirma);
          if (docFirmato) {
            setPermessiDocFirmati(docFirmato);
          }
        }
      }
      //SET STATO FINALE
      settaStatoFinale("FIRMATO");
    } else if (task.getVariable('wfcnr_reviewOutcome').equals('Modifica')) {
    // ESECUZIONE MODIFICA
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        for (i = 0; i < bpm_package.children.length; i++) {
          nodoDoc = bpm_package.children[i];
          if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
            updateParametriMissioni(nodoDoc);
          }
        }
      }
    } else {
    // ESECUZIONE RESPINGI
      formatoFirma = "non eseguita";
      dataFirma = new Date();
      if (execution.getVariable('wfvarUtenteFirmatarioSpesa')) {
        username = execution.getVariable('wfvarUtenteFirmatarioSpesa');
      }
      ufficioFirmatario = 'GENERICO';
      codiceDoc = execution.getVariable('wfcnr_codiceDocumentoUfficio');
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        for (i = 0; i < bpm_package.children.length; i++) {
          nodoDoc = bpm_package.children[i];
          if ((nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) || (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Firmato'))) {
            updateParametriMissioni(nodoDoc);
            wfCommon.setMetadatiControFirmaRespinto(nodoDoc, formatoFirma, username, ufficioFirmatario, dataFirma, commentoFirma);
          }
        }
      }
    }
  }

  // ---------------------------- FUNZIONI MISSIONI RESPINTO UO ----------------------------

 // ---------------------------- RESPINTO UO  ----------------------------
  function respintoUo() {
    var nodoDoc, tipologiaNotifica, i;
    // --------------
    logHandler("respintoUo");
    setProcessVarIntoTask();
    // PERCENTUALE DI COMPLETAMENTO
    task.setVariable('bpm_percentComplete', 50);
    if ((execution.getVariable('wfvarValidazioneModulo')) && (execution.getVariable('wfvarValidazioneSpesa'))) {
      task.setVariable('bpm_percentComplete', 40);
    } else if ((execution.getVariable('wfvarValidazioneModulo')) && (!execution.getVariable('wfvarValidazioneSpesa'))) {
      task.setVariable('bpm_percentComplete', 60);
    } else if ((!execution.getVariable('wfvarValidazioneModulo')) && (execution.getVariable('wfvarValidazioneSpesa'))) {
      task.setVariable('bpm_percentComplete', 70);
    }
    // GESTIONE DOC
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      for (i = 0; i < bpm_package.children.length; i++) {
        nodoDoc = bpm_package.children[i];
        if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
          wfCommon.taskStepMajorVersion(nodoDoc);
        }
        setPermessirespintoUo(nodoDoc);
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(initiator.properties.userName)) {
      notificaMailSingolo(initiator.properties.userName, tipologiaNotifica);
    }
  }

  function respintoUoEnd() {
    var nodoDoc, i;
    logHandler("respintoUoEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("respintoUoEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    wfCommon.setTaskVarIntoProcess();
    // ESECUZIONE RESPINTO
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      for (i = 0; i < bpm_package.children.length; i++) {
        nodoDoc = bpm_package.children[i];
        if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
          updateParametriMissioni(nodoDoc);
        }
      }
    }
   //SET STATO FINALE
    if ((task.getVariable('wfcnr_reviewOutcome') !== null) && !(task.getVariable('wfcnr_reviewOutcome').equals("Riproponi"))) {
      settaStatoFinale("ANNULLATO");
    }
  }

 // ---------------------------- RESPINTO SPESA  ----------------------------
  function respintoSpesa() {
    var nodoDoc, tipologiaNotifica, i;
    // --------------
    logHandler("respintoSpesa");
    setProcessVarIntoTask();
    task.setVariable('bpm_percentComplete', 50);
    if (execution.getVariable('wfvarValidazioneModulo')) {
      task.setVariable('bpm_percentComplete', 60);
    }
    // GESTIONE DOC
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      for (i = 0; i < bpm_package.children.length; i++) {
        nodoDoc = bpm_package.children[i];
        if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
          wfCommon.taskStepMajorVersion(nodoDoc);
        }
        setPermessiRespintoSpesa(nodoDoc);
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(initiator.properties.userName)) {
      notificaMailSingolo(initiator.properties.userName, tipologiaNotifica);
    }
  }

  function respintoSpesaEnd() {
    var nodoDoc, i;
    logHandler("respintoSpesaEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("respintoSpesaEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    wfCommon.setTaskVarIntoProcess();
    // ESECUZIONE RESPINTO
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      for (i = 0; i < bpm_package.children.length; i++) {
        nodoDoc = bpm_package.children[i];
        if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
          updateParametriMissioni(nodoDoc);
        }
      }
    }
    //SET STATO FINALE
    if ((task.getVariable('wfcnr_reviewOutcome') !== null) && !(task.getVariable('wfcnr_reviewOutcome').equals("Riproponi"))) {
      settaStatoFinale("ANNULLATO");
    }
  }


 // ---------------------------- TERMINATO  ----------------------------
  function flussoMissioniEndSettings() {
    var tipologiaNotifica;
    logHandler("flussoMissioniEndSettings ");
    // INVIO NOTIFICA
    tipologiaNotifica = 'flussoCompletato';
    if (people.getPerson(initiator.properties.userName)) {
      notificaMailSingolo(initiator.properties.userName, tipologiaNotifica);
    }
  }

  return {
    setNomeFlusso : setNomeFlusso,
    controlliFlusso : controlliFlusso,
    flussoMissioniSartSettings : flussoMissioniSartSettings,
    flussoMissioniEndSettings : flussoMissioniEndSettings,
    vistoDettagli : vistoDettagli,
    firmaUoDettagli : firmaUoDettagli,
    firmaSpesaDettagli : firmaSpesaDettagli,
    respintoUoDettagli : respintoUoDettagli,
    respintoSpesaDettagli : respintoSpesaDettagli,
    visto : visto,
    vistoEnd : vistoEnd,
    firmaUo : firmaUo,
    firmaUoEnd : firmaUoEnd,
    firmaSpesa : firmaSpesa,
    firmaSpesaEnd : firmaSpesaEnd,
    respintoUo : respintoUo,
    respintoUoEnd : respintoUoEnd,
    respintoSpesa : respintoSpesa,
    respintoSpesaEnd : respintoSpesaEnd,
    settaStatoFinale : settaStatoFinale
	};
}

  ());

