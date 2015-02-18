/*global execution, companyhome, logger, utils, cnrutils, use, search, task, actions, bpm_workflowDescription, bpm_reassignable, wfcnr_wfCounterId, bpm_package, bpm_comment, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority, initiator, people, wfCommon,wfvarNomeFlusso, arubaSign, Packages */
var wfFlussoDSFTM = (function () {
  "use strict";
  //Variabili Globali
  //var nomeFlusso = "AUTORIZZAZIONI DSFTM";
  var DEBUG, jsonCNR;
  DEBUG = true;
  jsonCNR = new Packages.org.springframework.extensions.webscripts.json.JSONUtils();

  function logHandler(testo) {
    if (DEBUG) {
      logger.error("wfFlussoDSFTM.js -- " + testo);
    }
  }

  function setNomeFlusso() {
    execution.setVariable('wfvarNomeFlusso', 'FLUSSO DOCUMENTALE DSFTM');
    execution.setVariable('wfvarTitoloFlusso', 'FLUSSO_DOCUMENTALE_DSFTM');
    logHandler("wfvarNomeFlusso: " + execution.getVariable('wfvarNomeFlusso'));
  }

  function setProcessVarIntoTask() {
    // COPIA TUTTE LE VARIABILI DEL WORKFLOW NELLE VARIABILI DEL TASK AL SUO START
    logHandler("setProcessVarIntoTask");
    logHandler("VISUALIZZAZIONE VARIABILI START TASK ----------------------------");
    //DUE DATE
    if (execution.getVariable('bpm_dueDate') !== undefined && execution.getVariable('bpm_dueDate') !== null) {
      task.dueDate = execution.getVariable('bpm_dueDate');
      logHandler("set task.dueDate " +  task.dueDate + " as execution.getVariable('bpm_dueDate'): " + execution.getVariable('bpm_dueDate'));
    } else {
      task.dueDate = bpm_workflowDueDate;
      logHandler("set task.dueDate " +  task.dueDate + " as bpm_workflowDueDate: " + bpm_workflowDueDate);
    }
    //PRIORITY
    // La priorità rimane sempre quella del workflow
    task.priority = bpm_workflowPriority;
    logHandler("set task.priority " +  task.priority + " as bpm_workflowPriority: " + bpm_workflowPriority);
    //COMMENT
    if (execution.getVariable('bpm_comment') !== undefined && execution.getVariable('bpm_comment') !== null) {
      task.setVariable('bpm_comment', execution.getVariable('bpm_comment'));
      logHandler("set task bpm_comment: " +  execution.getVariable('bpm_comment'));
    }
    //REASSIGNABLE
    if (execution.getVariable('bpm_reassignable') !== undefined && execution.getVariable('bpm_reassignable') !== null) {
      task.setVariable('bpm_reassignable', execution.getVariable('bpm_reassignable'));
    } else {
      task.dueDate = bpm_reassignable;
    }
    logHandler("set task bpm_reassignable: " +  execution.getVariable('bpm_reassignable'));
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

  function settaGruppi() {
    logHandler("settaGruppi");
    //execution.setVariable('wfvarGruppoREDATTORI', 'GROUP_REDATTORI_DSFTM');
    execution.setVariable('wfvarGruppoREDATTORI', 'GROUP_50700099000300000000000000');
    //execution.setVariable('wfvarGruppoREDATTORI-IPR', 'GROUP_REDATTORI_IPR_DSFTM');
    execution.setVariable('wfvarGruppoREDATTORI-IPR', 'GROUP_50700099000400000000000000');
    //execution.setVariable('wfvarGruppoVALIDATORI', 'GROUP_VALIDATORI_DSFTM');
    execution.setVariable('wfvarGruppoVALIDATORI', 'GROUP_50700099000500000000000000');
    //execution.setVariable('wfvarGruppoDIRETTORE', 'GROUP_DIRETTORE_DSFTM');
    execution.setVariable('wfvarGruppoDIRETTORE', 'GROUP_50700000000300000000000000');
    //execution.setVariable('wfvarGruppoPROTOCOLLO', 'GROUP_PROTOCOLLO_DSFTM');
    execution.setVariable('wfvarGruppoPROTOCOLLO', 'GROUP_50700099000600000000000000');
    //execution.setVariable('wfvarGruppoRESPONSABILI', 'GROUP_RESPONSABILI_FLUSSO_DSFTM');
    execution.setVariable('wfvarGruppoRESPONSABILI', 'GROUP_50700099000700000000000000');
  }

  function verificaGruppoStart() {
    logHandler("verificaGruppoStart - wfcnr_groupName: " + execution.getVariable('wfcnr_groupName'));
    if ((execution.getVariable('wfcnr_groupName').equals(execution.getVariable('wfvarGruppoREDATTORI-IPR'))) || (execution.getVariable('wfcnr_groupName').equals(execution.getVariable('wfvarGruppoREDATTORI')))) {
      if (execution.getVariable('wfcnr_groupName').equals(execution.getVariable('wfvarGruppoREDATTORI-IPR'))) {
        execution.setVariable('wfvarGruppoREDATTORISelezionato', execution.getVariable('wfvarGruppoREDATTORI-IPR'));
      } else {
        execution.setVariable('wfvarGruppoREDATTORISelezionato', execution.getVariable('wfvarGruppoREDATTORI'));
      }
      logHandler("wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    } else {
      throw new Error("GRUPPO NON ABILITATO AD AVVIARE IL FLUSSO");
    }
  }

  function settaDueDate() {
    var remoteDate, IsoRemoteDate, ggDueDate,  workflowPriority, utilsDate;
    workflowPriority = execution.getVariable('bpm_workflowPriority');
    logHandler("workflowPriority: " + workflowPriority);
    ggDueDate = 9;
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
    workflowPriority = execution.getVariable('bpm_workflowPriority');
    //DEFINISCE I TASK NON RIASSEGNABILI
    execution.setVariable('bpm_reassignable', false);
    if (bpm_workflowPriority === 'undefined') {
      execution.setVariable('bpm_workflowPriority', 3);
    }
  }

  function settaDocAspects(nodoDoc) {
    if (nodoDoc.hasAspect('wfcnr:parametriFlusso')) {
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta gia' con aspect parametriFlusso");
    } else {
      nodoDoc.addAspect("wfcnr:parametriFlusso");
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta ora con aspect parametriFlusso");
    }
    if (nodoDoc.hasAspect('wfcnr:parametriProtocollo')) {
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta gia' con aspect parametriProtocollo");
    } else {
      nodoDoc.addAspect("wfcnr:parametriProtocollo");
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta ora con aspect parametriProtocollo");
    }
    if (nodoDoc.hasAspect('wfcnr:signable')) {
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta gia' con aspect signable");
    } else {
      nodoDoc.addAspect("wfcnr:signable");
      logHandler("settaDocAspects - Il documento: " + nodoDoc.name + " risulta ora con aspect signable");
    }
  }

  function flussoDSFTMSartSettings() {
    logHandler("flussoDSFTMSartSettings");
    settaDocAspects(bpm_package.children[0]);
    wfCommon.settaDocPrincipale(bpm_package.children[0]);
    //SET GRUPPI
    settaGruppi();
    //SET DUE DATE FROM PRIORITY
    settaDueDate();
    settaStartProperties();
  }

  function notificaMail(gruppoDestinatariMail, tipologiaNotifica) {
    var members, testo, isWorkflowPooled, destinatario, i;
    logHandler("notificaMail");
    members = people.getMembers(gruppoDestinatariMail);
    testo = "Notifica di scadenza di un flusso documentale";
    isWorkflowPooled = true;
    logHandler("FLUSSO DOCUMENTALE DSFTM - invia notifica ai membri del gruppo: " + gruppoDestinatariMail.properties.authorityName);
    for (i = 0; i < members.length; i++) {
      destinatario = members[i];
      logHandler("FLUSSO DOCUMENTALE DSFTM - invia notifica a : " + destinatario.properties.userName + " del gruppo: " + gruppoDestinatariMail.properties.authorityName);
      // wfCommon.inviaNotifica(destinatario, testo, isWorkflowPooled, gruppoDestinatariMail, execution.getVariable('wfvarNomeFlusso'), tipologiaNotifica);
    }
  }

  function notificaScadenza() {
    var tipologiaNotifica;
    logHandler("notificaScadenza");
    tipologiaNotifica = 'scadenzaFlusso';
    wfFlussoDSFTM.notificaMail(people.getGroup(execution.getVariable('wfvarGruppoRESPONSABILI')), tipologiaNotifica);
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
    logHandler("setPermessiValidazione assegno l'ownership del documento: a " + nodoDocumento.getOwner());
  }

  function setPermessiValidazione(nodoDocumento) {
    logHandler("setPermessiValidazione con wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoDIRETTORE'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoRESPONSABILI'));
    nodoDocumento.setPermission("Collaborator", execution.getVariable('wfvarGruppoVALIDATORI'));
  }

  function setPermessiModifica(nodoDocumento) {
    logHandler("setPermessiModifica con wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Editor", execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoDIRETTORE'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoRESPONSABILI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoVALIDATORI'));
  }

  function setPermessiFirma(nodoDocumento) {
    logHandler("setPermessiFirma con wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    nodoDocumento.setPermission("Collaborator", execution.getVariable('wfvarGruppoDIRETTORE'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoRESPONSABILI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoVALIDATORI'));
  }

  function setPermessiProtocollo(nodoDocumento) {
    logHandler("setPermessiProtocollo con wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoDIRETTORE'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoRESPONSABILI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoVALIDATORI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoPROTOCOLLO'));
  }


  function setPermessiEndflussoDSFTM(nodoDocumento) {
    logHandler("setPermessiEndflussoDSFTM con wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoDIRETTORE'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoRESPONSABILI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoVALIDATORI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoPROTOCOLLO'));
  }

  function copiaDocsInDestinationFolder(nodoDocOriginale, nodoDocFirmato, folderDestination) {
    var nodeDestination;
    // copia entrambi i file nella cartella di destinazione
    if (folderDestination) {
      nodeDestination = search.findNode(folderDestination);
      logHandler("La folder di destinazione: "  +  nodeDestination.name + " e " + nodoDocOriginale.parent.name);
      if (!nodeDestination.nodeRef.equals(nodoDocOriginale.parent.nodeRef)) {
        nodeDestination.addNode(nodoDocOriginale);
        nodeDestination.addNode(nodoDocFirmato);
      }
    }
  }




  function validazione() {
    var nodoDoc, tipologiaNotifica, wfvarDettagliFlussoMap, wfvarDettagliFlussoString, wfvarDettagliFlussoObj, data, IsoDate;
    setProcessVarIntoTask();
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      wfCommon.taskStepMajorVersion(nodoDoc);
      setPermessiValidazione(nodoDoc);
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    wfFlussoDSFTM.notificaMail(people.getGroup(execution.getVariable('wfvarGruppoVALIDATORI')), tipologiaNotifica);
    // --------------
    logHandler("get bpm_workflowDueDate: " + execution.getVariable('bpm_workflowDueDate'));
    logHandler("get wfvarDueDateTimer: " + execution.getVariable('wfvarDueDateTimer'));
    logHandler("wfvarGruppoVALIDATORI: " + execution.getVariable('wfvarGruppoVALIDATORI'));
    logHandler("bpm_dueDate: " + task.getVariable('bpm_dueDate'));
    logHandler("bpm_priority: " + task.getVariable('bpm_priority'));
    logHandler("bpm_comment: " + task.getVariable('bpm_comment'));
    task.setVariable('bpm_assignee', initiator);
    task.setVariable('bpm_percentComplete', 30);
    // VARIABILE DETTAGLI FLUSSO
    if (!execution.getVariable('wfcnr_dettagliFlussoJson')) {
      data = new Date();
      IsoDate = utils.toISO8601(data);
      wfvarDettagliFlussoObj = jsonCNR.toObject('{"tasks":[]}');
      wfvarDettagliFlussoMap = [];
      wfvarDettagliFlussoMap.name = "RICHIESTA";
      wfvarDettagliFlussoMap.data = [];
      wfvarDettagliFlussoMap.data.Tipo = "Approvvigionamenti IT";
      wfvarDettagliFlussoMap.data.data = IsoDate.toString();
      wfvarDettagliFlussoMap.data["effettuata da"] = initiator.properties.userName;
      if (task.getVariable('wfcnr_groupName') !== undefined && task.getVariable('wfcnr_groupName') !== null && task.getVariable('wfcnr_groupName').length() !== 0) {
        wfvarDettagliFlussoMap.data["del Gruppo"] = people.getGroup(execution.getVariable('wfvarGruppoREDATTORISelezionato')).properties.authorityDisplayName;
      }
      wfvarDettagliFlussoObj.tasks.add(wfvarDettagliFlussoMap);
      wfvarDettagliFlussoString = jsonCNR.toJSONString(wfvarDettagliFlussoObj);
      execution.setVariable('wfcnr_dettagliFlussoJson',  wfvarDettagliFlussoString);
      logHandler("wfvarDettagliFlussoString: " + wfvarDettagliFlussoString);
    } else {
      wfCommon.inserisciDettagliJsonSemplici(people.getGroup(execution.getVariable('wfvarGruppoREDATTORISelezionato')).properties.authorityDisplayName);
    }
  }

  function validazioneAssignment() {
    logHandler("task.getVariable('cm_owner'): " + task.getVariable('bpm_assignee').properties.userName);
  }

  function validazioneEnd() {
    logHandler("bpm_assignee: " + task.getVariable('bpm_assignee').properties.userName);
    logHandler("wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    setTaskVarIntoProcess();
    // VARIABILE DETTAGLI FLUSSO
    wfCommon.inserisciDettagliJsonSemplici(people.getGroup(execution.getVariable('wfvarGruppoVALIDATORI')).properties.authorityDisplayName);
  }

  function modifica() {
    var nodoDoc, tipologiaNotifica;
    setProcessVarIntoTask();
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      wfCommon.taskStepMajorVersion(nodoDoc);
      setPermessiModifica(nodoDoc);
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    wfFlussoDSFTM.notificaMail(people.getGroup(execution.getVariable('wfvarGruppoREDATTORISelezionato')), tipologiaNotifica);
    // --------------
    logHandler("get bpm_groupAssignee: " + execution.getVariable('bpm_groupAssignee'));
    task.setVariable('bpm_percentComplete', 15);
  }
  function modificaEnd() {
    logHandler("get bpm_groupAssignee: " + execution.getVariable('bpm_groupAssignee'));
    logHandler("wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    setTaskVarIntoProcess();
    // VARIABILE DETTAGLI FLUSSO
    wfCommon.inserisciDettagliJsonSemplici(people.getGroup(execution.getVariable('wfvarGruppoREDATTORISelezionato')).properties.authorityDisplayName);
  }

  function firma() {
    var nodoDoc, tipologiaNotifica;
    setProcessVarIntoTask();
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      wfCommon.taskStepMajorVersion(nodoDoc);
      setPermessiFirma(nodoDoc);
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    wfFlussoDSFTM.notificaMail(people.getGroup(execution.getVariable('wfvarGruppoDIRETTORE')), tipologiaNotifica);
    // --------------
    logHandler("get bpm_groupAssignee: " + execution.getVariable('bpm_groupAssignee'));
    task.setVariable('bpm_percentComplete', 50);
  }

  function firmaEnd() {
    var username, password, otp, codiceDoc,  ufficioFirmatario, commentoFirma, nodoDoc, nodoDocFirmato, tipologiaFirma;
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    logHandler("scelta effettuata: " + task.getVariable('wfcnr_reviewOutcome'));
    if (task.getVariable('wfcnr_reviewOutcome').equals('Firma')) {
      username = task.getVariable('wfcnr_userFirma');
      password = task.getVariable('wfcnr_userPwFirma');
      otp = task.getVariable('wfcnr_pinFirma');
      codiceDoc = task.getVariable('wfcnr_codiceDocumentoUfficio');
      logHandler("firmaEnd: username" +  username + " codiceDoc: " + codiceDoc);
      if ((execution.getVariable('wfvarGruppoDIRETTORE') !== null) && (execution.getVariable('wfvarGruppoDIRETTORE') !== undefined)) {
        ufficioFirmatario = people.getGroup(execution.getVariable('wfvarGruppoDIRETTORE')).properties.authorityDisplayName;
        logHandler("firmaEnd: ufficioFirmatario: " +  ufficioFirmatario);
      }
      commentoFirma = task.getVariable('bpm_comment');
      tipologiaFirma = 'Firma';
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        nodoDoc = bpm_package.children[0];
        //formatoFirma = ".p7m";
        //nodoDocFirmato = wfCommon.eseguiFirmaP7M(username, password, otp, nodoDoc, formatoFirma);
        nodoDocFirmato = wfCommon.eseguiFirma(username, password, otp, nodoDoc, ufficioFirmatario, codiceDoc, commentoFirma, tipologiaFirma);
      }
    } else {
      logHandler("firmaEnd: no firma ");
    }
    setTaskVarIntoProcess();
    // VARIABILE DETTAGLI FLUSSO
    wfCommon.inserisciDettagliJsonSemplici(people.getGroup(execution.getVariable('wfvarGruppoDIRETTORE')).properties.authorityDisplayName);
  }

  function protocollo() {
    var nodoDoc, tipologiaNotifica, nodoDocFirmato, tipologiaDOC;
    setProcessVarIntoTask();
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      wfCommon.taskStepMajorVersion(nodoDoc);
      if (nodoDoc.assocs["wfcnr:signatureAssoc"]) {
        //COPIO I METADATI DEL FLUSSO DAL DOC ORIGINALE AL DOC FIRMATO con tipologia "Firmato"
        tipologiaDOC = 'Firmato';
        nodoDocFirmato = nodoDoc.assocs["wfcnr:signatureAssoc"][0];
        wfCommon.copiaMetadatiFlusso(nodoDoc, nodoDocFirmato, tipologiaDOC);
        setPermessiProtocollo(nodoDocFirmato);
      }
      setPermessiProtocollo(nodoDoc);
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    wfFlussoDSFTM.notificaMail(people.getGroup(execution.getVariable('wfvarGruppoPROTOCOLLO')), tipologiaNotifica);
    // --------------
    logHandler("get bpm_groupAssignee: " + task.getVariable('bpm_groupAssignee'));
    task.setVariable('bpm_percentComplete', 80);
  }
  function protocolloEnd() {
    var nodoDoc, nodoDocFirmato, utenteProtocollatore, nrProtocollo, dataTrasmissioneInteroperabilita, tipologiaDOC;
    logHandler("wfcnr_nrProtocollo: " + task.getVariable('wfcnr_nrProtocollo'));
    logHandler("wfcnr_dataTrasmissioneInteroperabilita: " + task.getVariable('wfcnr_dataTrasmissioneInteroperabilita'));
    nrProtocollo = task.getVariable('wfcnr_nrProtocollo');
    dataTrasmissioneInteroperabilita = task.getVariable('wfcnr_dataTrasmissioneInteroperabilita');
    if ((task.getVariable('bpm_assignee') !== null) && (task.getVariable('bpm_assignee') !== undefined)) {
      utenteProtocollatore = task.getVariable('bpm_assignee');
      logHandler("utenteProtocollatore: " + utenteProtocollatore);
    }
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      //SETTO I METADATI DEL PROTOCOLLO SUL DOC ORIGINALE
      wfCommon.setMetadatiProtocollo(nodoDoc, utenteProtocollatore, nrProtocollo, dataTrasmissioneInteroperabilita);
      if (nodoDoc.assocs["wfcnr:signatureAssoc"]) {
        nodoDocFirmato = nodoDoc.assocs["wfcnr:signatureAssoc"][0];
        //SETTO I METADATI DEL PROTOCOLLO SUL DOC FIRMATO
        wfCommon.setMetadatiProtocollo(nodoDocFirmato, utenteProtocollatore, nrProtocollo, dataTrasmissioneInteroperabilita);
        //COPIO I METADATI DEL FLUSSO DAL DOC ORIGINALE AL DOC FIRMATO
        tipologiaDOC = 'Firmato';
        wfCommon.copiaMetadatiFlusso(nodoDoc, nodoDocFirmato, tipologiaDOC);
      }
    }
    setTaskVarIntoProcess();
    // VARIABILE DETTAGLI FLUSSO
    wfCommon.inserisciDettagliJsonSemplici(people.getGroup(execution.getVariable('wfvarGruppoPROTOCOLLO')).properties.authorityDisplayName);
  }

  function flussoDSFTMEndSettings() {
    var nodoDoc, tipologiaNotifica, statoFinale, nodoDocFirmato, tipologiaDOC;
    logHandler("flussoDSFTMEndSettings ");
    //task.setVariable('bpm_percentComplete', 100);
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      if (execution.getVariable('wfcnr_reviewOutcome').equals('Annulla')) {
        statoFinale = "ANNULLATO";
        wfCommon.taskEndMajorVersion(nodoDoc, statoFinale);
        setPermessiEndflussoDSFTM(nodoDoc);
      } else {
        statoFinale = "TERMINATO";
        wfCommon.taskEndMajorVersion(nodoDoc, statoFinale);
        //COPIO I METADATI DEL FLUSSO DAL DOC ORIGINALE AL DOC FIRMATO con tipologia Principale
        tipologiaDOC = 'Firmato';
        if (nodoDoc.assocs["wfcnr:signatureAssoc"]) {
          nodoDocFirmato = nodoDoc.assocs["wfcnr:signatureAssoc"][0];
          wfCommon.copiaMetadatiFlusso(nodoDoc, nodoDocFirmato, tipologiaDOC);
          setPermessiEndflussoDSFTM(nodoDoc);
          setPermessiEndflussoDSFTM(nodoDocFirmato);
        }
      }
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'flussoCompletato';
    wfFlussoDSFTM.notificaMail(people.getGroup(execution.getVariable('wfvarGruppoREDATTORISelezionato')), tipologiaNotifica);
    wfFlussoDSFTM.notificaMail(people.getGroup(execution.getVariable('wfvarGruppoRESPONSABILI')), tipologiaNotifica);
    // --------------
  }
  return {
    setNomeFlusso : setNomeFlusso,
    verificaGruppoStart : verificaGruppoStart,
    flussoDSFTMSartSettings : flussoDSFTMSartSettings,
    validazione : validazione,
    validazioneAssignment : validazioneAssignment,
    validazioneEnd : validazioneEnd,
    modifica : modifica,
    modificaEnd : modificaEnd,
    firma : firma,
    firmaEnd : firmaEnd,
    protocollo : protocollo,
    notificaScadenza : notificaScadenza,
    protocolloEnd : protocolloEnd,
    notificaMail : notificaMail,
    setPermessiValidazione : setPermessiValidazione,
    setPermessiModifica : setPermessiModifica,
    flussoDSFTMEndSettings : flussoDSFTMEndSettings
  };
}

  ());

