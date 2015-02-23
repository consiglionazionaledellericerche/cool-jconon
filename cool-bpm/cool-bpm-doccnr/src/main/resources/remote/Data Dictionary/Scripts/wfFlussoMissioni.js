/*global execution, companyhome, logger, utils, cnrutils, use, search, task, actions, bpm_workflowDescription, wfcnr_wfCounterId, bpm_package, bpm_comment, bpm_assignee, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority, initiator, people, wfCommon,wfvarNomeFlusso, arubaSign */
var wfFlussoMissioni = (function () {
  "use strict";
  //Variabili Globali
  //var nomeFlusso = "AUTORIZZAZIONI DSFTM";
  var DEBUG = true;

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
    nodoDoc.save();
    logHandler("insertParametriMissioniStart - parametri inseriti");
  }

  function updateParametriMissioni(nodoDoc) {
    logHandler("insertParametriMissioni");
    //SET PROPERTIES
    nodoDoc.properties["cnrmissioni:autoPropriaFlag"] = task.getVariable('cnrmissioni_autoPropriaFlag');
    nodoDoc.properties["cnrmissioni:noleggioFlag"] = task.getVariable('cnrmissioni_noleggioFlag');
    nodoDoc.properties["cnrmissioni:taxiFlag"] = task.getVariable('cnrmissioni_taxiFlag');
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
    for (i = 0; i < bpm_package.children; i++) {
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
    if (people.getGroup(execution.getVariable('wfvarGruppoMissioni'))) {
      nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
      logHandler("setPermessiVisto con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Consumer", initiator.properties.userName);
    logHandler("setPermessiVisto Consumer a tutti e  initiator: " + initiator.properties.userName);
  }

  function setPermessiFirmaUo(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (people.getGroup(execution.getVariable('wfvarGruppoMissioni'))) {
      nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
      logHandler("setPermessiFirmaUo con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Consumer", initiator.properties.userName);
    logHandler("setPermessiFirmaUo Consumer a tutti e  initiator: " + initiator.properties.userName);
  }

  function setPermessiFirmaSpesa(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (people.getGroup(execution.getVariable('wfvarGruppoMissioni'))) {
      nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
      logHandler("setPermessiFirmaSpesa con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Consumer", initiator.properties.userName);
    logHandler("setPermessiFirmaSpesa Consumer a tutti e  initiator: " + initiator.properties.userName);
  }

  function setPermessiModificaUo(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (people.getGroup(execution.getVariable('wfvarGruppoMissioni'))) {
      nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
      logHandler("setPermessiModificaUo con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Coordinator", initiator.properties.userName);
    logHandler("setPermessiModificaUo Consumer a tutti e Coordinator a initiator: " + initiator.properties.userName);
  }

  function setPermessiModificaSpesa(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (people.getGroup(execution.getVariable('wfvarGruppoMissioni'))) {
      nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
      logHandler("setPermessiModificaSpesa con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Coordinator", initiator.properties.userName);
    logHandler("setPermessiModificaSpesa Consumer a tutti e Coordinator a initiator: " + initiator.properties.userName);
  }

  function setPermessiApprovato(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (people.getGroup(execution.getVariable('wfvarGruppoMissioni'))) {
      nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
      logHandler("setPermessiApprovato con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Consumer", initiator.properties.userName);
    logHandler("setPermessiApprovato Consumer a tutti e  initiator: " + initiator.properties.userName);
  }

  function setPermessiRespinto(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (people.getGroup(execution.getVariable('wfvarGruppoMissioni'))) {
      nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
      logHandler("setPermessiRespinto con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Consumer", initiator.properties.userName);
    logHandler("setPermessiRespinto Consumer a tutti e  initiator: " + initiator.properties.userName);
  }


  function setPermessiEndflussoMissioni(nodoDocumento) {
    eliminaPermessi(nodoDocumento);
    if (people.getGroup(execution.getVariable('wfvarGruppoMissioni'))) {
      nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoMissioni'));
      logHandler("setPermessiRespinto con wfvarGruppoMissioni: " + execution.getVariable('wfvarGruppoMissioni'));
    }
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteResponsabileModulo'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtentePrimoFirmatario'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteFirmatarioSpesa'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarUtenteRichiedente'));
    nodoDocumento.setPermission("Consumer", initiator.properties.userName);
    logHandler("setPermessiRespinto Consumer a tutti e  initiator: " + initiator.properties.userName);
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
          throw new Error("IL DOCUMENTO: " + nodoDoc.name + " DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO");
        }
        logHandler("doc: " + nodoDoc.name);
        setPermessiVisto(nodoDoc);
      }
      if (!esisteDocPrincipale) {
        throw new Error("ALMENO UN DOCUMENTO DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO COME 'Principale'");
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(execution.getVariable('wfvarUtenteResponsabileModulo'))) {
      notificaMailSingolo(people.getPerson(execution.getVariable('wfvarUtenteResponsabileModulo')).properties.userName, tipologiaNotifica);
    }
  }

  function vistoEnd() {
    var nodoDoc, utenteVisto, ufficioVisto, dataVisto, commentoVisto, i;
    logHandler("vistoEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("vistoEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    // INSERIMENTO PARAMETRI VISTO
    utenteVisto = execution.getVariable('wfvarUtenteResponsabileModulo');
    ufficioVisto = 'GENERICO';
    dataVisto = new Date();
    commentoVisto = execution.getVariable('wfvarCommento');
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
          throw new Error("IL DOCUMENTO: " + nodoDoc.name + " DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO");
        }
        logHandler("doc: " + nodoDoc.name);
        setPermessiFirmaUo(nodoDoc);
      }
      if (!esisteDocPrincipale) {
        throw new Error("ALMENO UN DOCUMENTO DEVE AVERE IL CAMPO 'tipologiaDOC' VALORIZZATO COME 'Principale'");
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    logHandler("wfvarUtentePrimoFirmatario: " + execution.getVariable('wfvarUtentePrimoFirmatario'));
    if (people.getPerson(execution.getVariable('wfvarUtentePrimoFirmatario'))) {
      logHandler("wfvarUtentePrimoFirmatario: " + people.getPerson(execution.getVariable('wfvarUtentePrimoFirmatario')).properties.userName);
      notificaMailSingolo(people.getPerson(execution.getVariable('wfvarUtentePrimoFirmatario')).properties.userName, tipologiaNotifica);
    }
  }

  function firmaUoEnd() {
    var username, password, otp, codiceDoc,  ufficioFirmatario, commentoFirma, nodoDoc, i, formatoFirma, dataFirma, tipologiaFirma, urlFileFirmato;
    logHandler("firmaUoEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("firmaUoEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    if (task.getVariable('wfcnr_reviewOutcome').equals('Firma')) {
    // ESECUZIONE FIRMA
      username = task.getVariable('wfcnr_userFirma');
      password = task.getVariable('wfcnr_userPwFirma');
      otp = task.getVariable('wfcnr_pinFirma');
      codiceDoc = task.getVariable('wfcnr_codiceDocumentoUfficio');
      ufficioFirmatario = 'GENERICO';
      commentoFirma = task.getVariable('bpm_comment');
      tipologiaFirma = 'Firma';
      logHandler("firmaUoEnd: username" +  username + " codiceDoc: " + codiceDoc);
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        for (i = 0; i < bpm_package.children.length; i++) {
          nodoDoc = bpm_package.children[i];
          if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
            wfCommon.eseguiFirma(username, password, otp, nodoDoc, ufficioFirmatario, codiceDoc, commentoFirma, tipologiaFirma);
          }
        }
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
      commentoFirma = execution.getVariable('wfvarCommento');
      ufficioFirmatario = 'GENERICO';
      codiceDoc = execution.getVariable('wfcnr_codiceDocumentoUfficio');
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        for (i = 0; i < bpm_package.children.length; i++) {
          nodoDoc = bpm_package.children[i];
          if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
            urlFileFirmato = nodoDoc.url;
            wfCommon.setMetadatiFirma(nodoDoc, formatoFirma, username, ufficioFirmatario, dataFirma, codiceDoc, commentoFirma, urlFileFirmato);
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
    var username, password, otp, codiceDoc,  ufficioFirmatario, commentoFirma, nodoDoc, i, formatoFirma, dataFirma, tipologiaFirma;
    logHandler("firmaSpesaEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("firmaSpesaEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    if (task.getVariable('wfcnr_reviewOutcome').equals('Firma')) {
    // ESECUZIONE FIRMA
      username = task.getVariable('wfcnr_userFirma');
      password = task.getVariable('wfcnr_userPwFirma');
      otp = task.getVariable('wfcnr_pinFirma');
      codiceDoc = task.getVariable('wfcnr_codiceDocumentoUfficio');
      ufficioFirmatario = 'GENERICO';
      commentoFirma = task.getVariable('bpm_comment');
      tipologiaFirma = 'Controfirma';
      logHandler("firmaSpesaEnd: username" +  username + " codiceDoc: " + codiceDoc);
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        for (i = 0; i < bpm_package.children.length; i++) {
          nodoDoc = bpm_package.children[i];
          if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
            wfCommon.eseguiFirma(username, password, otp, nodoDoc, ufficioFirmatario, codiceDoc, commentoFirma, tipologiaFirma);
          }
        }
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
      if (execution.getVariable('wfvarUtenteFirmatarioSpesa')) {
        username = execution.getVariable('wfvarUtenteFirmatarioSpesa');
      }
      commentoFirma = execution.getVariable('wfvarCommento');
      ufficioFirmatario = 'GENERICO';
      codiceDoc = execution.getVariable('wfcnr_codiceDocumentoUfficio');
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        for (i = 0; i < bpm_package.children.length; i++) {
          nodoDoc = bpm_package.children[i];
          if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
            wfCommon.setMetadatiControFirma(nodoDoc, formatoFirma, username, ufficioFirmatario, dataFirma, codiceDoc, commentoFirma);
          }
        }
      }
    }
  }

  // ---------------------------- FUNZIONI MISSIONI MODIFICA UO ----------------------------

 // ---------------------------- MODIFICA UO  ----------------------------
  function modificaUo() {
    var nodoDoc, tipologiaNotifica, i;
    // --------------
    logHandler("modificaUo");
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
        setPermessiModificaUo(nodoDoc);
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(initiator.properties.userName)) {
      notificaMailSingolo(initiator.properties.userName, tipologiaNotifica);
    }
  }

  function modificaUoEnd() {
    var nodoDoc, i;
    logHandler("modificaUoEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("modificaUoEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    // ESECUZIONE MODIFICA
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      for (i = 0; i < bpm_package.children.length; i++) {
        nodoDoc = bpm_package.children[i];
        if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
          updateParametriMissioni(nodoDoc);
        }
      }
    }
  }

 // ---------------------------- MODIFICA SPESA  ----------------------------
  function modificaSpesa() {
    var nodoDoc, tipologiaNotifica, i;
    // --------------
    logHandler("modificaSpesa");
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
        setPermessiModificaSpesa(nodoDoc);
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(initiator.properties.userName)) {
      notificaMailSingolo(initiator.properties.userName, tipologiaNotifica);
    }
  }

  function modificaSpesaEnd() {
    var nodoDoc, i;
    logHandler("modificaSpesaEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("modificaSpesaEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
    // ESECUZIONE MODIFICA
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      for (i = 0; i < bpm_package.children.length; i++) {
        nodoDoc = bpm_package.children[i];
        if (nodoDoc.properties["wfcnr:tipologiaDOC"].equals('Principale')) {
          updateParametriMissioni(nodoDoc);
        }
      }
    }
  }

 // ---------------------------- APPROVATO  ----------------------------
  function approvato() {
    var nodoDoc, tipologiaNotifica, i;
    // --------------
    logHandler("approvato");
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
        setPermessiApprovato(nodoDoc);
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(initiator.properties.userName)) {
      notificaMailSingolo(initiator.properties.userName, tipologiaNotifica);
    }
  }

  function approvatoEnd() {
    logHandler("approvatoEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("approvatoEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
  }

 // ---------------------------- RESPINTO  ----------------------------
  function respinto() {
    var nodoDoc, tipologiaNotifica, i;
    // --------------
    logHandler("respinto");
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
        setPermessiRespinto(nodoDoc);
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    if (people.getPerson(initiator.properties.userName)) {
      notificaMailSingolo(initiator.properties.userName, tipologiaNotifica);
    }
  }

  function respintoEnd() {
    logHandler("respintoEnd- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    logHandler("respintoEnd- bpm_comment: " + task.getVariable('bpm_comment'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfvarCommento', task.getVariable('bpm_comment'));
  }

 // ---------------------------- TERMINATO  ----------------------------
  function flussoMissioniEndSettings() {
    var nodoDoc, tipologiaNotifica, statoFinale, i;
    logHandler("flussoMissioniEndSettings ");
    statoFinale = "TERMINATO";
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
    visto : visto,
    vistoEnd : vistoEnd,
    firmaUo : firmaUo,
    firmaUoEnd : firmaUoEnd,
    firmaSpesa : firmaSpesa,
    firmaSpesaEnd : firmaSpesaEnd,
    modificaUo : modificaUo,
    modificaUoEnd : modificaUoEnd,
    modificaSpesa : modificaSpesa,
    modificaSpesaEnd : modificaSpesaEnd,
    approvato : approvato,
    approvatoEnd : approvatoEnd,
    respinto : respinto,
    respintoEnd : respintoEnd
  };
}

  ());

