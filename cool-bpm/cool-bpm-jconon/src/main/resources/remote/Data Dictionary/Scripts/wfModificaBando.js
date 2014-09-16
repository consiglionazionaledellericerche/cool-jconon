/*global execution, companyhome, logger, utils, cnrutils, use, search, arubaSign, actions, bpm_workflowDescription, wfcnr_wfCounterId, bpm_package, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority */
var wfModificaBando = (function () {
  "use strict";

  function infoVersion(nodoDocumento) {
    var folder, nomeFolder, versioni, folders, i;
    folder = search.findNode(nodoDocumento);
    nomeFolder = folder.name;
    versioni = folder.isVersioned;
    logger.error("nomeFolder" + nomeFolder + " versioni " + versioni);
    folders = folder.versionHistory;
    for (i = 0; i < folders.length; i++) {
      logger.error("folder [" + i + "] " + folders[i].label + " type: " + folders[i].type + "(" + folders[i].node.nodeRef + ")");
    }
  }

  function verificaAggiungiVersionamento(nodoBando) {
    if (nodoBando.hasAspect('cm:versionable')) {
      logger.error("la cartella: " + nodoBando.name + " è già versionable");
    } else {
      nodoBando.addAspect("cm:versionable");
      logger.error("la cartella: " + nodoBando.name + " è ora versionable");
    }
  }

  function verificaRimuoviVersionamento(nodeRefBando) {
    var nodoBando;
    nodoBando = search.findNode(nodeRefBando);
    if (nodoBando.hasAspect('cm:versionable')) {
      logger.error("rimuovo il versionamento alla cartella: " + nodoBando.name);
      nodoBando.removeAspect("cm:versionable");
    } else {
      logger.error("la cartella: " + nodoBando.name + " non è versionable");
    }
  }

  function checkOut(nodeRefBando, nodeRefAppoFolder) {
    var nodoBando, nodoAppoFolder, nodoBandoCheckOut;
    nodoAppoFolder = search.findNode(nodeRefAppoFolder);
    nodoBando = search.findNode(nodeRefBando);
    verificaAggiungiVersionamento(nodoBando);
    nodoBandoCheckOut = nodoBando.checkout(nodoAppoFolder);
    logger.error("nodoBandoCheckOut: " + nodoBandoCheckOut.name + " nodeRef: " + nodoBandoCheckOut.nodeRef);
    return (nodoBandoCheckOut.nodeRef);
  }

  function checkIn(nodeRefBando) {
    var nodoBando, nodeWorkingCopy, checkInOk;
    checkInOk = false;
    nodoBando = search.findNode(nodeRefBando);
    if (nodoBando.assocs["cm:workingcopylink"][0]) {
      nodeWorkingCopy = nodoBando.assocs["cm:workingcopylink"][0];
      logger.error("CHECK OUT trovato : " + nodeWorkingCopy.name);
      nodeWorkingCopy.checkin();
      logger.error("BANDO AGGIORNATO");
      checkInOk = true;
    } else {
      logger.error("BANDO NON AGGIORNATO");
    }
    return (checkInOk);
  }

  function unCheckOut(nodeRefBando) {
    var nodoBando, nodeWorkingCopy, cancelCheckOutOk;
    cancelCheckOutOk = false;
    nodoBando = search.findNode(nodeRefBando);
    if (nodoBando.assocs["cm:workingcopylink"][0]) {
      nodeWorkingCopy = nodoBando.assocs["cm:workingcopylink"][0];
      logger.error("CHECK OUT trovato : " + nodeWorkingCopy.name);
      nodeWorkingCopy.cancelCheckout();
      logger.error("CANCEL CHECKOUT BANDO ");
      cancelCheckOutOk = true;
    } else {
      logger.error("CANCEL CHECKOUT BANDO NON EFFETTUATO");
    }
    return (cancelCheckOutOk);
  }

  return {
    infoVersion : infoVersion,
    verificaAggiungiVersionamento : verificaAggiungiVersionamento,
    verificaRimuoviVersionamento : verificaRimuoviVersionamento,
    checkOut : checkOut,
    checkIn : checkIn,
    unCheckOut : unCheckOut
  };
}

  ());

// MAIN
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
//nodoBandoCheckOut = wfModificaBando.checkOut(nodeRefBando, nodeRefAppoFolder);
// ********** 2) CHECK IN COPIA BANDO **********
//wfModificaBando.checkIn(nodeRefBando);
// ********** 3) CANCEL CHECKOUT COPIA BANDO **********
//wfModificaBando.unCheckOut(nodeRefBando);
// _____________________________________
// FUNZIONI EXTRA
// _____________________________________
// VISUALIZZA VERSIONI BANDO
// wfModificaBando.infoVersion(nodeRefBando);
// TOGLI VERSIONAMENTO FOLDER
// wfModificaBando.verificaRimuoviVersionamento(nodeRefBando);
