/*global execution, companyhome, logger, utils, cnrutils, use, search, task, actions, bpm_workflowDescription, wfcnr_wfCounterId, bpm_package, bpm_comment, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority, initiator, people, wfCommon,wfvarNomeFlusso, arubaSign */
var wfFlussoDSFTM = (function () {
  "use strict";
  //Variabili Globali
  //var nomeFlusso = "AUTORIZZAZIONI DSFTM";

  function setNomeFlusso() {
    execution.setVariable('wfvarNomeFlusso', 'FLUSSO DOCUMENTALE DSFTM');
    execution.setVariable('wfvarTitoloFlusso', 'FLUSSO_DOCUMENTALE_DSFTM');
    logger.error("wfFlussoDSFTM.js -- wfvarNomeFlusso: " + execution.getVariable('wfvarNomeFlusso'));
  }

  function setProcessVarIntoTask() {
    logger.error("wfFlussoDSFTM.js -- setProcessVarIntoTask");
    if (bpm_workflowDueDate !== undefined && bpm_workflowDueDate !== null) {
      task.dueDate = bpm_workflowDueDate;
    }
    if (bpm_workflowPriority !== undefined && bpm_workflowPriority !== null) {
      task.priority = bpm_workflowPriority;
    }
    if (bpm_comment !== undefined && bpm_comment !== null) {
      task.setVariable('bpm_comment', bpm_comment);
    }
    logger.error("wfFlussoDSFTM.js -- set bpm_workflowDueDate " +  bpm_workflowDueDate + " bpm_workflowPriority: " + bpm_workflowPriority + " bpm_comment: " + bpm_comment);
  }

  function settaGruppi() {
    logger.error("wfFlussoDSFTM.js -- settaGruppi");
    execution.setVariable('wfvarGruppoREDATTORI', 'GROUP_REDATTORI_DSFTM');
    execution.setVariable('wfvarGruppoREDATTORI-IPR', 'GROUP_REDATTORI_IPR_DSFTM');
    execution.setVariable('wfvarGruppoVALIDATORI', 'GROUP_VALIDATORI_DSFTM');
    execution.setVariable('wfvarGruppoDIRETTORE', 'GROUP_DIRETTORE_DSFTM');
    execution.setVariable('wfvarGruppoPROTOCOLLO', 'GROUP_PROTOCOLLO_DSFTM');
    execution.setVariable('wfvarGruppoRESPONSABILI', 'GROUP_RESPONSABILI_FLUSSO_DSFTM');
  }

  function verificaGruppoStart() {
    logger.error("wfFlussoDSFTM.js -- verificaGruppoStart - wfcnr_groupName: " + execution.getVariable('wfcnr_groupName'));
    if ((execution.getVariable('wfcnr_groupName').equals('GROUP_REDATTORI_IPR_DSFTM')) || (execution.getVariable('wfcnr_groupName').equals('GROUP_REDATTORI_DSFTM'))) {
      if (execution.getVariable('wfcnr_groupName').equals('GROUP_REDATTORI_IPR_DSFTM')) {
        execution.setVariable('wfvarGruppoREDATTORISelezionato', 'GROUP_REDATTORI_IPR_DSFTM');
      } else {
        execution.setVariable('wfvarGruppoREDATTORISelezionato', 'GROUP_REDATTORI_DSFTM');
      }
      logger.error("wfFlussoDSFTM.js -- wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    } else {
      throw new Error("wfFlussoDSFTM.js - CONTROLLO FLUSSO - GRUPPO NON ABILITATO AD AVVIARE IL FLUSSO");
    }
  }

  function settaDueDate() {
    var remoteDate, IsoRemoteDate, ggDueDate,  workflowPriority, utilsDate;
    workflowPriority = execution.getVariable('bpm_workflowPriority');
    logger.error("wfFlussoDSFTM.js -- workflowPriority: " + workflowPriority);
    ggDueDate = 3;
    if (workflowPriority >= 5) {
      ggDueDate = 3;
    }
    if ((workflowPriority < 5)  && (workflowPriority > 1)) {
      ggDueDate = 5;
    }

    remoteDate = new Date();
    logger.error("wfFlussoDSFTM.js -- i gg da aggiungere alla data sono: " + ggDueDate);
    remoteDate.setDate(remoteDate.getDate() + ggDueDate - 1);
    //SET TIMER per termine Due Date riconosciuta da Alfresco
    //alfrescoSetDate = IsoRemoteDate.substring(0, 23) + "Z";
    IsoRemoteDate = utils.toISO8601(remoteDate);
    utilsDate = utils.fromISO8601(IsoRemoteDate);
    logger.error("wfFlussoDSFTM.js -- IsoRemoteDate " + IsoRemoteDate.toString());
    logger.error("wfFlussoDSFTM.js -- utilsDate " + utilsDate.toString());
    logger.error("wfFlussoDSFTM.js -- set bpm_workflowDueDate from: " + bpm_workflowDueDate + "to: " + utilsDate);
    execution.setVariable('bpm_workflowDueDate', utilsDate);
    if ((execution.getVariable('bpm_dueDate') !== null) && (execution.getVariable('bpm_dueDate') !== undefined)) {
      execution.setVariable('bpm_dueDate', execution.getVariable('bpm_workflowDueDate'));
    }
    logger.error("wfFlussoDSFTM.js -- get bpm_dueDate: " + execution.getVariable('bpm_dueDate'));
    execution.setVariable('wfvarDueDateTimer', IsoRemoteDate.toString());
    logger.error("wfFlussoDSFTM.js -- set wfvarDueDateTimer to: " + IsoRemoteDate.toString());
  }

  function settaStartProperties() {
    var workflowPriority;
    logger.error("wfFlussoDSFTM.js -- settaStartProperties");
    workflowPriority = execution.getVariable('bpm_workflowPriority');
    if (bpm_workflowPriority === 'undefined') {
      execution.setVariable('bpm_workflowPriority', 3);
    }
  }

  function settaDocPrincipale(nodoDoc) {
    nodoDoc.properties["wfcnr:tipologiaDOC"] = "Principale";
    nodoDoc.save();
  }

  function flussoDSFTMSartSettings() {
    logger.error("wfFlussoDSFTM.js -- flussoDSFTMSartSettings");
    settaDocPrincipale(bpm_package.children[0]);
    //SET GRUPPI
    settaGruppi();
    //SET DUE DATE FROM PRIORITY
    settaDueDate();
    settaStartProperties();
  }

  function notificaMail(gruppoDestinatariMail, tipologiaNotifica) {
    var members, testo, isWorkflowPooled, destinatario, i;
    logger.error("wfFlussoDSFTM.js -- notificaMail");
    members = people.getMembers(gruppoDestinatariMail);
    testo = "Notifica di scadenza di un flusso documentale";
    isWorkflowPooled = true;
    logger.error("FLUSSO DOCUMENTALE DSFTM - MODIFICA  invia notifica ai membri del gruppo: " + gruppoDestinatariMail.properties.authorityName);
    for (i = 0; i < members.length; i++) {
      destinatario = members[i];
      logger.error("FLUSSO DOCUMENTALE DSFTM - MODIFICA  invia notifica a : " + destinatario.properties.userName + " del gruppo: " + gruppoDestinatariMail.properties.authorityName);
      // INIO NOTIFICA ******* DA INSERIRE **********
      //wfCommon.inviaNotifica(destinatario, testo, isWorkflowPooled, gruppoDestinatariMail, execution.getVariable('wfvarNomeFlusso'), tipologiaNotifica);
    }
  }

  function notificaScadenza() {
    var tipologiaNotifica;
    logger.error("wfFlussoDSFTM.js -- notificaScadenza");
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
      logger.error(i + ") rimuovo permesso: " + permessi[i].split(";")[2] + " a " + permessi[i].split(";")[1]);
    }
    nodoDocumento.setOwner('spaclient');
    logger.error("wfFlussoDSFTM.js -- setPermessiValidazione assegno l'ownership del documento: a " + nodoDocumento.getOwner());
  }

  function setPermessiValidazione(nodoDocumento) {
    logger.error("wfFlussoDSFTM.js -- setPermessiValidazione con wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoDIRETTORE'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoRESPONSABILI'));
    nodoDocumento.setPermission("Collaborator", execution.getVariable('wfvarGruppoVALIDATORI'));
  }

  function setPermessiModifica(nodoDocumento) {
    logger.error("wfFlussoDSFTM.js -- setPermessiModifica con wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Editor", execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoDIRETTORE'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoRESPONSABILI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoVALIDATORI'));
  }

  function setPermessiFirma(nodoDocumento) {
    logger.error("wfFlussoDSFTM.js -- setPermessiFirma con wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    nodoDocumento.setPermission("Collaborator", execution.getVariable('wfvarGruppoDIRETTORE'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoRESPONSABILI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoVALIDATORI'));
  }

  function setPermessiProtocollo(nodoDocumento) {
    logger.error("wfFlussoDSFTM.js -- setPermessiProtocollo con wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoDIRETTORE'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoRESPONSABILI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoVALIDATORI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoPROTOCOLLO'));
  }


  function setPermessiEndflussoDSFTM(nodoDocumento) {
    logger.error("wfFlussoDSFTM.js -- setPermessiEndflussoDSFTM con wfvarGruppoREDATTORISelezionato: " + execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    eliminaPermessi(nodoDocumento);
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoREDATTORISelezionato'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoDIRETTORE'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoRESPONSABILI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoVALIDATORI'));
    nodoDocumento.setPermission("Consumer", execution.getVariable('wfvarGruppoPROTOCOLLO'));
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
    //nodoDocumento.properties["wfcnr:codiceDoc"] = codiceDoc;
    nodoDocumento.save();
    logger.error("Al Doc: " + nodoDocumento.name + " sono stati aggiunti le seguenti proprieta': formatoFirma: " + formatoFirma + " utenteFirmatario: " + utenteFirmatario + " ufficioFirmatario: " + ufficioFirmatario + " dataFirma: " + dataFirma + " codiceDoc: " + codiceDoc);
  }

  function setMetadatiProtocollo(nodoDocumento, utenteProtocollatore, nrProtocollo, dataTrasmissioneInteroperabilita) {
    logger.error("wfFlussoDSFTM.js - setMetadatiProtocollo");
    if (!nodoDocumento.hasAspect("wfcnr:parametriProtocollo")) {
      nodoDocumento.addAspect("wfcnr:parametriProtocollo");
      logger.error("wfFlussoDSFTM.js - Il Doc e' ora parametriProtocollo");
    } else {
      logger.error("wfFlussoDSFTM.js - Il Doc era già parametriProtocollo");
    }
    nodoDocumento.properties["wfcnr:utenteProtocollatore"] = utenteProtocollatore.properties.userName;
    nodoDocumento.properties["wfcnr:nrProtocollo"] = nrProtocollo;
    nodoDocumento.properties["wfcnr:dataTrasmissioneInteroperabilita"] = dataTrasmissioneInteroperabilita;
    nodoDocumento.save();
    logger.error("Al Doc: " + nodoDocumento.name + " sono stati aggiunti le seguenti proprieta': utenteProtocollatore" + utenteProtocollatore.properties.userName + " nrProtocollo: " + nrProtocollo + " dataTrasmissioneInteroperabilita: " + dataTrasmissioneInteroperabilita);
  }

  function copiaDocsInDestinationFolder(nodoDocOriginale, nodoDocFirmato, folderDestination) {
    var nodeDestination;
    // copia entrambi i file nella cartella di destinazione
    if (folderDestination) {
      nodeDestination = search.findNode(folderDestination);
      logger.error("La folder di destinazione: "  +  nodeDestination.name + " e " + nodoDocOriginale.parent.name);
      if (!nodeDestination.nodeRef.equals(nodoDocOriginale.parent.nodeRef)) {
        nodeDestination.addNode(nodoDocOriginale);
        nodeDestination.addNode(nodoDocFirmato);
      }
    }
  }

  function eseguiFirmaP7M(utenteFirmatario, password, otp, nodoDoc, formatoFirma) {
    var mimetypeDoc, nameDoc, nameDocFirmato, docFirmato, mimetypeService, estenzione, firmaEseguita;
    mimetypeDoc = nodoDoc.properties.content.mimetype;
    nameDoc = nodoDoc.name;
    logger.error("wfFlussoDSFTM.js - utenteFirmatario: "  + utenteFirmatario + " otp: "  + otp + " nodoDoc: " + nodoDoc.name);
    mimetypeService = cnrutils.getBean('mimetypeService');
    estenzione = "." + mimetypeService.getExtension(nodoDoc.mimetype);
    logger.error("wfFlussoDSFTM.js - estenzione: "  + estenzione);
    if (nodoDoc.name.indexOf(estenzione) === -1) {
      nameDoc = nameDoc + estenzione;
    }
    nameDocFirmato = nameDoc + formatoFirma;
    //crea il doc firmato nella stessa cartella del doc originale
    docFirmato = nodoDoc.parent.createFile(nameDocFirmato);
    //docFirmato.mimetype = "application/p7m";
    docFirmato.save();
    try {
      firmaEseguita = arubaSign.pkcs7SignV2(utenteFirmatario, password, otp, nodoDoc.nodeRef, docFirmato.nodeRef);
    } catch (err) {
      throw new Error("FLUSSO DOCUMENTALE DSFTM - wfFlussoDSFTM.js - IL PROCESSO DI FIRMA DIGITALE NON E' ANDATO A BUON FINE");
    }
    logger.error("doc firmato: "  +  docFirmato.name + " con mimetype: " +  docFirmato.mimetype);
    // rimuovo i permessi di Collaborator al utenteFirmatario
    // create file, make it versionable
    logger.error(" Doc: " + nodoDoc.properties.title + " -- " + nodoDoc.properties.description);
    return (docFirmato);
  }



  function validazione() {
    var nodoDoc, tipologiaNotifica;
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
    logger.error("wfFlussoDSFTM.js -- get bpm_workflowDueDate: " + execution.getVariable('bpm_workflowDueDate'));
    logger.error("wfFlussoDSFTM.js -- get wfvarDueDateTimer: " + execution.getVariable('wfvarDueDateTimer'));
    logger.error("wfFlussoDSFTM.js -- wfvarGruppoVALIDATORI: " + execution.getVariable('wfvarGruppoVALIDATORI'));
    logger.error("wfFlussoDSFTM.js -- bpm_dueDate: " + task.getVariable('bpm_dueDate'));
    logger.error("wfFlussoDSFTM.js -- bpm_priority: " + task.getVariable('bpm_priority'));
    logger.error("wfFlussoDSFTM.js -- bpm_comment: " + task.getVariable('bpm_comment'));
    task.setVariable('bpm_assignee', initiator);
    task.setVariable('bpm_percentComplete', 30);
  }

  function validazioneAssignment() {
    logger.error("wfFlussoDSFTM.js -- task.getVariable('cm_owner'): " + task.getVariable('bpm_assignee').properties.userName);
  }

  function validazioneEnd() {
    logger.error("wfFlussoDSFTM.js -- bpm_assignee: " + task.getVariable('bpm_assignee').properties.userName);
    logger.error("wfFlussoDSFTM.js -- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
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
    logger.error("wfFlussoDSFTM.js -- get bpm_groupAssignee: " + execution.getVariable('bpm_groupAssignee'));
    task.setVariable('bpm_percentComplete', 15);
  }
  function modificaEnd() {
    logger.error("wfFlussoDSFTM.js -- get bpm_groupAssignee: " + execution.getVariable('bpm_groupAssignee'));
    logger.error("wfFlussoDSFTM.js -- wfcnr_reviewOutcome: " + task.getVariable('wfcnr_reviewOutcome'));
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
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
    logger.error("wfFlussoDSFTM.js -- get bpm_groupAssignee: " + execution.getVariable('bpm_groupAssignee'));
    task.setVariable('bpm_percentComplete', 50);
  }
  function firmaEnd() {
    var username, password, otp, folderDestination, codiceDoc, formatoFirma, dataFirma, ufficioFirmatario, nodoDoc, nodoDocfirmato;
    execution.setVariable('wfcnr_reviewOutcome', task.getVariable('wfcnr_reviewOutcome'));
    logger.error("wfFlussoDSFTM.js -- scelta effettuata: " + task.getVariable('wfcnr_reviewOutcome'));
    if (task.getVariable('wfcnr_reviewOutcome').equals('Firma')) {
      username = task.getVariable('wfcnr_userFirma');
      password = task.getVariable('wfcnr_userPwFirma');
      otp = task.getVariable('wfcnr_pinFirma');
      folderDestination = task.getVariable('wfcnr_nodeRefFolderToLink');
      codiceDoc = task.getVariable('wfcnr_codiceDocumentoUfficio');
      logger.error("wfFlussoDSFTM.js -- firmaEnd: username" +  username + " otp: " + otp + " folderDestination: " + folderDestination + " codiceDoc: " + codiceDoc);
      if ((execution.getVariable('wfvarGruppoDIRETTORE') !== null) && (execution.getVariable('wfvarGruppoDIRETTORE') !== undefined)) {
        ufficioFirmatario = people.getGroup(execution.getVariable('wfvarGruppoDIRETTORE')).properties.authorityDisplayName;
        logger.error("wfFlussoDSFTM.js -- firmaEnd: ufficioFirmatario: " +  ufficioFirmatario);
      }
      formatoFirma = ".p7m";
      dataFirma = new Date();
      if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
        nodoDoc = bpm_package.children[0];
        nodoDocfirmato = eseguiFirmaP7M(username, password, otp, nodoDoc, formatoFirma);
        if ((nodoDocfirmato !== null) && (nodoDocfirmato !== undefined)) {
          setMetadatiFirma(nodoDoc, formatoFirma, username, ufficioFirmatario, dataFirma, codiceDoc);
          setPermessiEndflussoDSFTM(nodoDocfirmato);
          nodoDoc.createAssociation(nodoDocfirmato, "wfcnr:signatureAssoc");
          logger.error("Il doc originale viene associato al doc: " +  nodoDoc.assocs["wfcnr:signatureAssoc"][0].name + " e copiato nella cartella: " + folderDestination);
          copiaDocsInDestinationFolder(nodoDoc, nodoDocfirmato, folderDestination);
          nodoDoc.save();
        }
      }
    } else {
      logger.error("wfFlussoDSFTM.js -- firmaEnd: no firma ");
    }
  }

  function protocollo() {
    var nodoDoc, tipologiaNotifica;
    setProcessVarIntoTask();
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      wfCommon.taskStepMajorVersion(nodoDoc);
      setPermessiProtocollo(nodoDoc);
    }
    // INVIO NOTIFICA
    tipologiaNotifica = 'compitoAssegnato';
    wfFlussoDSFTM.notificaMail(people.getGroup(execution.getVariable('wfvarGruppoPROTOCOLLO')), tipologiaNotifica);
    // --------------
    logger.error("wfFlussoDSFTM.js -- get bpm_groupAssignee: " + task.getVariable('bpm_groupAssignee'));
    task.setVariable('bpm_percentComplete', 80);
  }
  function protocolloEnd() {
    var nodoDoc, utenteProtocollatore, nrProtocollo, dataTrasmissioneInteroperabilita;
    logger.error("wfFlussoDSFTM.js -- wfcnr_nrProtocollo: " + task.getVariable('wfcnr_nrProtocollo'));
    logger.error("wfFlussoDSFTM.js -- wfcnr_dataTrasmissioneInteroperabilita: " + task.getVariable('wfcnr_dataTrasmissioneInteroperabilita'));
    nrProtocollo = task.getVariable('wfcnr_nrProtocollo');
    dataTrasmissioneInteroperabilita = task.getVariable('wfcnr_dataTrasmissioneInteroperabilita');
    if ((task.getVariable('bpm_assignee') !== null) && (task.getVariable('bpm_assignee') !== undefined)) {
      utenteProtocollatore = task.getVariable('bpm_assignee');
      logger.error("wfFlussoDSFTM.js -- utenteProtocollatore: " + utenteProtocollatore);
    }
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      setMetadatiProtocollo(nodoDoc, utenteProtocollatore, nrProtocollo, dataTrasmissioneInteroperabilita);
    }
  }

  function flussoDSFTMEndSettings() {
    var nodoDoc, tipologiaNotifica, statoFinale;
    logger.error("wfFlussoDSFTM.js -- flussoDSFTMEndSettings ");
    //task.setVariable('bpm_percentComplete', 100);
    if ((bpm_package.children[0] !== null) && (bpm_package.children[0] !== undefined)) {
      nodoDoc = bpm_package.children[0];
      if (execution.getVariable('wfcnr_reviewOutcome').equals('Annulla')) {
        statoFinale = "ANNULLATO";
      } else {
        statoFinale = "TERMINATO";
      }
      wfCommon.taskEndMajorVersion(nodoDoc, statoFinale);
      setPermessiEndflussoDSFTM(nodoDoc);
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

