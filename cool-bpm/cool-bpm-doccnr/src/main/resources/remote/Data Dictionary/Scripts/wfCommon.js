/*global execution, companyhome, logger, utils, cnrutils, use, search, arubaSign, actions, bpm_workflowDescription, wfcnr_wfCounterId, bpm_package, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority, task */
var wfCommon = (function () {
  "use strict";
  var DEBUG, serverPath;
  serverPath = "http://as1dock.si.cnr.it/cool-flows";
  DEBUG = true;

  function logHandler(testo) {
    if (DEBUG) {
      logger.error(testo);
    }
  }

  function infoVersion(nodoDocumento) {
    var folder, nomeFolder, versioni, folders, i;
    folder = search.findNode(nodoDocumento);
    nomeFolder = folder.name;
    versioni = folder.isVersioned;
    logHandler("nomeFolder" + nomeFolder + " versioni " + versioni);
    folders = folder.versionHistory;
    for (i = 0; i < folders.length; i++) {
      logHandler("folder [" + i + "] " + folders[i].label + " type: " + folders[i].type + "(" + folders[i].node.nodeRef + ")");
    }
  }

  function verificaAggiungiVersionamento(nodoBando) {
    if (nodoBando.hasAspect('cm:versionable')) {
      logHandler("la cartella: " + nodoBando.name + " è già versionable");
    } else {
      nodoBando.addAspect("cm:versionable");
      logHandler("la cartella: " + nodoBando.name + " è ora versionable");
    }
  }

  function verificaRimuoviVersionamento(nodeRefBando) {
    var nodoBando;
    nodoBando = search.findNode(nodeRefBando);
    if (nodoBando.hasAspect('cm:versionable')) {
      logHandler("rimuovo il versionamento alla cartella: " + nodoBando.name);
      nodoBando.removeAspect("cm:versionable");
    } else {
      logHandler("la cartella: " + nodoBando.name + " non è versionable");
    }
  }

  function checkOut(nodeRefBando, nodeRefAppoFolder) {
    var nodoBando, nodoAppoFolder, nodoBandoCheckOut;
    nodoAppoFolder = search.findNode(nodeRefAppoFolder);
    nodoBando = search.findNode(nodeRefBando);
    verificaAggiungiVersionamento(nodoBando);
    nodoBandoCheckOut = nodoBando.checkout(nodoAppoFolder);
    logHandler("nodoBandoCheckOut: " + nodoBandoCheckOut.name + " nodeRef: " + nodoBandoCheckOut.nodeRef);
    return (nodoBandoCheckOut.nodeRef);
  }

  function checkIn(nodeRefBando) {
    var nodoBando, nodeWorkingCopy, checkInOk;
    checkInOk = false;
    nodoBando = search.findNode(nodeRefBando);
    if (nodoBando.assocs["cm:workingcopylink"][0]) {
      nodeWorkingCopy = nodoBando.assocs["cm:workingcopylink"][0];
      logHandler("CHECK OUT trovato : " + nodeWorkingCopy.name);
      nodeWorkingCopy.checkin();
      logHandler("BANDO AGGIORNATO");
      checkInOk = true;
    } else {
      logHandler("BANDO NON AGGIORNATO");
    }
    return (checkInOk);
  }

  function unCheckOut(nodeRefBando) {
    var nodoBando, nodeWorkingCopy, cancelCheckOutOk;
    cancelCheckOutOk = false;
    nodoBando = search.findNode(nodeRefBando);
    if (nodoBando.assocs["cm:workingcopylink"][0]) {
      nodeWorkingCopy = nodoBando.assocs["cm:workingcopylink"][0];
      logHandler("CHECK OUT trovato : " + nodeWorkingCopy.name);
      nodeWorkingCopy.cancelCheckout();
      logHandler("CANCEL CHECKOUT BANDO ");
      cancelCheckOutOk = true;
    } else {
      logHandler("CANCEL CHECKOUT BANDO NON EFFETTUATO");
    }
    return (cancelCheckOutOk);
  }

  function settaDocPrincipale(nodoDoc) {
    if (nodoDoc.hasAspect('wfcnr:parametriFlusso')) {
      logHandler("wfCommon.js - taskStepMajorVersion - Il documento: " + nodoDoc.name + " risulta gia' con aspect parametriFlusso");
    } else {
      nodoDoc.addAspect("wfcnr:parametriFlusso");
      logHandler("wfCommon.js - taskStepMajorVersion - Il documento: " + nodoDoc.name + " risulta ora con aspect parametriFlusso");
    }
    nodoDoc.properties["wfcnr:tipologiaDOC"] = "Principale";
    nodoDoc.save();
  }

  function copiaMetadatiFlusso(nodoDoc, nodoDocfirmato, tipologiaDOC) {
    logHandler("nodoDoc" + nodoDoc.name + " nodoDocfirmato " + nodoDocfirmato.name);
    if (nodoDocfirmato.hasAspect('wfcnr:parametriFlusso')) {
      logHandler("wfCommon.js - copiaMetadatiFlusso - Il documento: " + nodoDocfirmato.name + " risulta gia' con aspect parametriFlusso");
    } else {
      nodoDocfirmato.addAspect("wfcnr:parametriFlusso");
      logHandler("wfCommon.js - copiaMetadatiFlusso - Il documento: " + nodoDocfirmato.name + " risulta ora con aspect parametriFlusso");
    }
    nodoDocfirmato.properties["wfcnr:statoFlusso"] = nodoDoc.properties["wfcnr:statoFlusso"];
    logHandler("wfCommon.js - copiaMetadatiFlusso - statoFlusso: " + nodoDocfirmato.properties["wfcnr:statoFlusso"]);
    nodoDocfirmato.properties["wfcnr:wfInstanceId"] = nodoDoc.properties["wfcnr:wfInstanceId"];
    logHandler("wfCommon.js - copiaMetadatiFlusso - wfInstanceId: " + nodoDocfirmato.properties["wfcnr:wfInstanceId"]);
    nodoDocfirmato.properties["wfcnr:titoloUtenteFlusso"] = nodoDoc.properties["wfcnr:titoloUtenteFlusso"];
    logHandler("wfCommon.js - copiaMetadatiFlusso - titoloUtenteFlusso: " + nodoDocfirmato.properties["wfcnr:titoloUtenteFlusso"]);
    nodoDocfirmato.properties["wfcnr:taskId"] = nodoDoc.properties["wfcnr:taskId"];
    logHandler("wfCommon.js - copiaMetadatiFlusso - taskId: " + nodoDocfirmato.properties["wfcnr:taskId"]);
    nodoDocfirmato.properties["wfcnr:workflowDefinitionName"] = nodoDoc.properties["wfcnr:workflowDefinitionName"];
    logHandler("wfCommon.js - copiaMetadatiFlusso - workflowDefinitionName: " + nodoDocfirmato.properties["wfcnr:workflowDefinitionName"]);
    nodoDocfirmato.properties["wfcnr:workflowDefinitionId"] = nodoDoc.properties["wfcnr:workflowDefinitionId"];
    logHandler("wfCommon.js - copiaMetadatiFlusso - workflowDefinitionId: " + nodoDocfirmato.properties["wfcnr:workflowDefinitionId"]);
    nodoDocfirmato.properties["wfcnr:IdFlusso"] = nodoDoc.properties["wfcnr:IdFlusso"];
    logHandler("wfCommon.js - copiaMetadatiFlusso - IdFlusso: " + nodoDocfirmato.properties["wfcnr:IdFlusso"]);
    nodoDocfirmato.properties["wfcnr:tipologiaDOC"] = tipologiaDOC;
    logHandler("wfCommon.js - copiaMetadatiFlusso - tipologiaDOC: " + nodoDocfirmato.properties["wfcnr:tipologiaDOC"]);
    nodoDocfirmato.save();
  }


  function setMetadatiProtocollo(nodoDocumento, utenteProtocollatore, nrProtocollo, dataTrasmissioneInteroperabilita) {
    logHandler("wfFlussoDSFTM.js - setMetadatiProtocollo");
    if (!nodoDocumento.hasAspect("wfcnr:parametriProtocollo")) {
      nodoDocumento.addAspect("wfcnr:parametriProtocollo");
      logHandler("wfFlussoDSFTM.js - Il Doc e' ora parametriProtocollo");
    } else {
      logHandler("wfFlussoDSFTM.js - Il Doc era già parametriProtocollo");
    }
    nodoDocumento.properties["wfcnr:utenteProtocollatore"] = utenteProtocollatore.properties.userName;
    nodoDocumento.properties["wfcnr:nrProtocollo"] = nrProtocollo;
    nodoDocumento.properties["wfcnr:dataTrasmissioneInteroperabilita"] = dataTrasmissioneInteroperabilita;
    nodoDocumento.save();
    logHandler("Al Doc: " + nodoDocumento.name + " sono stati aggiunti le seguenti proprieta': utenteProtocollatore" + utenteProtocollatore.properties.userName + " nrProtocollo: " + nrProtocollo + " dataTrasmissioneInteroperabilita: " + dataTrasmissioneInteroperabilita);
  }

  function verificaUnicoDocAllegato(wf_package) {
    // controllo che ci sia un solo documento allegato
    if (wf_package !== null) {
      if ((wf_package.children[0] !== null) && (wf_package.children[0] !== undefined)) {
        logHandler("wfCommon.js - CONTROLLO FLUSSO - wf_package.children[0]: " + wf_package.children[0].name);
        var nodoDoc = wf_package.children[0];
        if (nodoDoc.typeShort.equals("cm:folder")) {
          logHandler("wfCommon.js - CONTROLLO FLUSSO - IL FLUSSO E' AVVIATO SU UNA CARTELLA");
          throw new Error("NON E' POSSIBILE AVVIARE IL FLUSSO SU UNA CARTELLA");
        }
        if ((wf_package.children.length > 1)) {
          logHandler("wfCommon.js - CONTROLLO FLUSSO - NON E' POSSIBILE AVVIARE IL FLUSSO SU PIU' FILE");
          throw new Error("NON E' POSSIBILE AVVIARE IL FLUSSO SU PIU' FILE");
        }
      } else {
        throw new Error("DEVE ESSERE ALLEGATO UN DOCUMENTO");
      }
    }
    return (true);
  }

  function verificaDocInSingoloFlusso(wf_package) {
    // controllo che ci sia un solo documento allegato
    if (wf_package !== null) {
      if ((wf_package.children[0] !== null) && (wf_package.children[0] !== undefined)) {
        logHandler("wfCommon.js - CONTROLLO FLUSSO - wf_package.children[0]: " + wf_package.children[0].name);
        var nodoDoc = wf_package.children[0];
        // **** NOTA BENE: IL VALORE DOVRA' ESSERE CAMBIATO AD 1 QUANDO IL FLUSSO CARICHERA' DA ESTERNO UN FILE
        if (nodoDoc.parents.length > 2) {
          logHandler("wfCommon.js - CONTROLLO FLUSSO - IL FLUSSO E' AVVIATO SU UN DOCUMENTO GIA' UTILIZZATO DA UN ALTRO FLUSSO - nodoDoc.parents.length = " + nodoDoc.parents.length);
          throw new Error("NON E' POSSIBILE AVVIARE IL FLUSSO SU DOCUMENTO GIA' UTILIZZATO DA UN ALTRO FLUSSO");
        }
      } else {
        throw new Error("DEVE ESSERE ALLEGATO UN DOCUMENTO");
      }
    }
    return (true);
  }

  function taskStepMajorVersion(nodoDoc) {
    var workingCopy;
    if (nodoDoc.hasAspect('wfcnr:parametriFlusso')) {
      logHandler("wfCommon.js - taskStepMajorVersion - Il documento: " + nodoDoc.name + " risulta gia' con aspect parametriFlusso");
    } else {
      nodoDoc.addAspect("wfcnr:parametriFlusso");
      logHandler("wfCommon.js - taskStepMajorVersion - Il documento: " + nodoDoc.name + " risulta ora con aspect parametriFlusso");
    }
    logHandler("wfCommon.js - taskStepMajorVersion - task name: " + task.name + "  - taskId: " + task.id);
    workingCopy = nodoDoc.checkout();
    workingCopy.properties["wfcnr:taskId"] = 'activiti$' + task.id;
    workingCopy.properties["wfcnr:statoFlusso"] = task.name;
    workingCopy.properties["wfcnr:wfInstanceId"] = execution.getVariable('wfvarWorkflowInstanceId');
    workingCopy.properties["wfcnr:titoloUtenteFlusso"] = bpm_workflowDescription;
    workingCopy.properties["wfcnr:IdFlusso"] = execution.getVariable('wfcnr_wfCounterId');
    if (bpm_package.properties["bpm:workflowDefinitionName"]) {
      workingCopy.properties["wfcnr:workflowDefinitionName"] = bpm_package.properties["bpm:workflowDefinitionName"];
      logHandler("wfCommon.js - taskStepMajorVersion - workflowDefinitionName: " + bpm_package.properties["bpm:workflowDefinitionName"]);
    }
    if (bpm_package.properties["bpm:workflowDefinitionId"]) {
      workingCopy.properties["wfcnr:workflowDefinitionId"] = bpm_package.properties["bpm:workflowDefinitionId"];
      logHandler("wfCommon.js - taskStepMajorVersion - workflowDefinitionId: " + bpm_package.properties["bpm:workflowDefinitionId"]);
    }
    workingCopy.save();
    nodoDoc = workingCopy.checkin("Transizione Flusso a STATO: " + task.name, true);
    logHandler("wfCommon.js - taskStepMajorVersion - Il documento: " + nodoDoc.name + " risulta versionato: " + nodoDoc.getVersionHistory()[0].label + " con statoFlusso: " + task.name + " per task id: " + task.id);
  }

  function taskEndMajorVersion(nodoDoc, statoFinale) {
    var workingCopy;
    if (nodoDoc.hasAspect('wfcnr:parametriFlusso')) {
      logHandler("wfCommon.js - taskEndMajorVersion - Il documento: " + nodoDoc.name + " risulta gia' con aspect parametriFlusso");
    } else {
      nodoDoc.addAspect("wfcnr:parametriFlusso");
      logHandler("wfCommon.js - taskEndMajorVersion - Il documento: " + nodoDoc.name + " risulta ora con aspect parametriFlusso");
    }
    workingCopy = nodoDoc.checkout();
    workingCopy.properties["wfcnr:statoFlusso"] = statoFinale;
    workingCopy.save();
    nodoDoc = workingCopy.checkin("Transizione Flusso a STATO: " + statoFinale, true);
    logHandler("wfCommon.js - taskEndMajorVersion - Il documento: " + nodoDoc.name + " risulta versionato: " + nodoDoc.getVersionHistory()[0].label + " con statoFlusso: " + statoFinale);
  }

  function eseguiFirmaP7M(utenteFirmatario, password, otp, nodoDoc, formatoFirma) {
    var mimetypeDoc, nameDoc, nameDocFirmato, docFirmato, mimetypeService, estenzione, firmaEseguita;
    mimetypeDoc = nodoDoc.properties.content.mimetype;
    nameDoc = nodoDoc.name;
    logHandler("wfCommon.js - utenteFirmatario: "  + utenteFirmatario + " otp: "  + otp + " nodoDoc: " + nodoDoc.name);
    mimetypeService = cnrutils.getBean('mimetypeService');
    estenzione = "." + mimetypeService.getExtension(nodoDoc.mimetype);
    logHandler("wfCommon.js - estenzione: "  + estenzione);
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
      throw new Error("wfCommon.js - IL PROCESSO DI FIRMA DIGITALE NON E' ANDATO A BUON FINE");
    }
    logHandler("wfCommon - doc firmato: "  +  docFirmato.name + " con mimetype: " +  docFirmato.mimetype);
    // rimuovo i permessi di Collaborator al utenteFirmatario
    // create file, make it versionable
    logHandler("wfCommon - Doc: " + nodoDoc.properties.title + " -- " + nodoDoc.properties.description);
    return (docFirmato);
  }

  function setMetadatiFirma(nodoDocumento, formatoFirma, utenteFirmatario, ufficioFirmatario, dataFirma, codiceDoc, commentoFirma) {
    if (!nodoDocumento.hasAspect("wfcnr:signable")) {
      nodoDocumento.addAspect("wfcnr:signable");
      logHandler("wfCommon - Il Doc e' ora signable");
    }
    nodoDocumento.properties["wfcnr:formatoFirma"] = formatoFirma;
    nodoDocumento.properties["wfcnr:utenteFirmatario"] = utenteFirmatario;
    nodoDocumento.properties["wfcnr:ufficioFirmatario"] = ufficioFirmatario;
    nodoDocumento.properties["wfcnr:dataFirma"] = dataFirma;
    nodoDocumento.properties["wfcnr:codiceDoc"] = codiceDoc;
    nodoDocumento.properties["wfcnr:commentoFirma"] = commentoFirma;
    nodoDocumento.save();
    logHandler("wfCommon - Al Doc: " + nodoDocumento.name + " sono stati aggiunti le seguenti proprieta': formatoFirma: " + formatoFirma + " utenteFirmatario: " + utenteFirmatario + " ufficioFirmatario: " + ufficioFirmatario + " dataFirma: " + dataFirma + " codiceDoc: " + codiceDoc + " commentoFirma: " + commentoFirma);
  }

  function inviaNotifica(destinatario, testo, isWorkflowPooled, groupAssignee, nomeFlusso, tipologiaNotifica) {
    var mail, templateArgs, templateModel, groupAssigneeName;
    if ((groupAssignee) && !(groupAssignee.equals("GENERICO"))) {
      if (groupAssignee.properties.authorityDisplayName) {
        groupAssigneeName = groupAssignee.properties.authorityDisplayName;
      } else {
        groupAssigneeName = groupAssignee.properties.authorityName;
      }
    } else {
      groupAssigneeName = "GENERICO";
    }
    if (destinatario.properties.email) {
      // logHandler("FLUSSO FIRMA IMMEDIATA - invia notifica- destinatario:" + destinatario.properties.email + " testo " + testo + " groupAssignee " + groupAssignee);
      mail = actions.create("mail");
      mail.parameters.to = destinatario.properties.email;
      mail.parameters.subject = "FLUSSO " + nomeFlusso + " (" + bpm_workflowDescription + ")";
      mail.parameters.from = "notifiche-flussi-documentali@cnr.it";
      mail.parameters.text = testo;
      //USING TEMPLATE
      mail.parameters.template = companyhome.childByNamePath("Data Dictionary/Email Templates/Workflow Notification/wf-cnr-email_it.html.ftl");
      templateArgs = [];
      templateArgs.workflowDefinitionName = nomeFlusso;
      templateArgs.workflowTitle = bpm_workflowDescription + " (id: " + wfcnr_wfCounterId + ")";
      templateArgs.workflowPooled = isWorkflowPooled;
      templateArgs.tipologiaNotifica = tipologiaNotifica;
      templateArgs.workflowDescription = bpm_workflowDescription;
      templateArgs.workflowId = wfcnr_wfCounterId;
      templateArgs.workflowLinks = false;
      templateArgs.workflowLink = true;
      templateArgs.workflowDueDate = bpm_workflowDueDate;
      templateArgs.workflowPriority = bpm_workflowPriority;
      templateArgs.serverPath = serverPath;
      templateArgs.groupAssignee = groupAssigneeName;
      templateArgs.comment = execution.getVariable('commentoPrecedente');
      templateModel = [];
      templateModel.args = templateArgs;
      mail.parameters.template_model = templateModel;
      //END USING TEMPLATE
      mail.execute(bpm_package);
    }
  }
  return {
    infoVersion : infoVersion,
    verificaAggiungiVersionamento : verificaAggiungiVersionamento,
    verificaRimuoviVersionamento : verificaRimuoviVersionamento,
    checkOut : checkOut,
    checkIn : checkIn,
    unCheckOut : unCheckOut,
    settaDocPrincipale : settaDocPrincipale,
    taskStepMajorVersion : taskStepMajorVersion,
    taskEndMajorVersion : taskEndMajorVersion,
    verificaUnicoDocAllegato : verificaUnicoDocAllegato,
    verificaDocInSingoloFlusso : verificaDocInSingoloFlusso,
    eseguiFirmaP7M : eseguiFirmaP7M,
    setMetadatiFirma : setMetadatiFirma,
    copiaMetadatiFlusso : copiaMetadatiFlusso,
    setMetadatiProtocollo : setMetadatiProtocollo,
    inviaNotifica : inviaNotifica
  };
}

  ());

// MAIN
//var nodeRefBando = "workspace://SpacesStore/f4b79ce0-2231-4ffa-99eb-8cc4d57c9b42";
//wfFlussoBando.bandoSartSettings(nodeRefBando);

//DATI CHE DEVONO ESSERE PASSATI IN INPUT
//var nodeRefBando, nodeRefAppoFolder, nodo, copia, nodoBandoCheckOut;
//nodeRefAppoFolder = "workspace://SpacesStore/334a6951-96c5-4c83-ac77-622aa8b91bd5";
//nodeRefBando  = 'workspace://SpacesStore/98729219-5a87-46a7-8e27-b186182fb2a7';
// _____________________________________
// FUNZIONI RICHIAMABILI DAL WORKFLOW
// _____________________________________
// sequenza 1-2 per approvazione modifiche
// sequenza 1-3 per annulla modifiche
// ********** 1) VERIFICA VERSIONAMENTO E CHECK OUT BANDO IN CARTELLA APPO **********
//nodoBandoCheckOut = wfFlussoBando.checkOut(nodeRefBando, nodeRefAppoFolder);
// ********** 2) CHECK IN COPIA BANDO **********
//wfFlussoBando.checkIn(nodeRefBando);
// ********** 3) CANCEL CHECKOUT COPIA BANDO **********
//wfFlussoBando.unCheckOut(nodeRefBando);
// _____________________________________
// FUNZIONI EXTRA
// _____________________________________
// VISUALIZZA VERSIONI BANDO
// wfFlussoBando.infoVersion(nodeRefBando);
// TOGLI VERSIONAMENTO FOLDER
// wfFlussoBando.verificaRimuoviVersionamento(nodeRefBando);
