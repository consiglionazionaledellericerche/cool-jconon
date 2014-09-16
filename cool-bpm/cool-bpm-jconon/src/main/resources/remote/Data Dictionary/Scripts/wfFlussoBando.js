/*global execution, companyhome, logger, utils, cnrutils, use, search, arubaSign, actions, bpm_workflowDescription, wfcnr_wfCounterId, bpm_package, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority */
var wfFlussoBando = (function () {
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

  function bandoSartSettings(nodeRefBando) {
    var nodoBando, data_inizio_invio_domande, data_fine_invio_domande, data_sollecito_invio_domande, data_variazione_commissione, data_termine_flusso_bando, codice, num_giorni_mail_sollecito, profilo, remoteDate, IsoFutureDate, IsoRemoteDate, nrGiorniDataRemota;
    logger.error(" wfFlussoBando.js -- bandoSartSettings: ");
    nodoBando = search.findNode(nodeRefBando);
    data_inizio_invio_domande = nodoBando.properties["jconon_call:data_inizio_invio_domande"];
    data_fine_invio_domande = nodoBando.properties["jconon_call:data_fine_invio_domande"];
    codice = nodoBando.properties["jconon_call:codice"];
    num_giorni_mail_sollecito = nodoBando.properties["jconon_call:num_giorni_mail_sollecito"];
    profilo = nodoBando.properties["jconon_call:profilo"];
    logger.error("la cartella: " + nodoBando.name);
    logger.error("il profilo: " + profilo);
    logger.error("la data_inizio_invio_domande: " + data_inizio_invio_domande);
    logger.error("la data_fine_invio_domande: " + data_fine_invio_domande);
    logger.error("il codice: " + codice);
    logger.error("il num_giorni_mail_sollecito: " + num_giorni_mail_sollecito);
    //SET GRUPPI
    execution.setVariable('wfvarGruppoRDP', 'GROUP_RDP');
    execution.setVariable('wfvarGruppoCOMMISSIONE', 'GROUP_COMMISSIONE');
    execution.setVariable('wfvarGruppoGESTORI', 'GROUP_GESTORI');
    //SET TIMERS
    nrGiorniDataRemota = 300;
    remoteDate = new Date();
    remoteDate.setDate(data_inizio_invio_domande.getDate() + nrGiorniDataRemota);
    IsoRemoteDate = utils.toISO8601(remoteDate);
    //SET T1 (data_inizio_invio_domande)
    if ((data_inizio_invio_domande !== null) && (data_inizio_invio_domande !== undefined)) {
      IsoFutureDate = utils.toISO8601(data_inizio_invio_domande);
    } else {
      IsoFutureDate = IsoRemoteDate;
    }
    execution.setVariable('wfvarPubblicaBandoTimer', IsoFutureDate.toString());
    logger.error("T1) wfvarPubblicaBandoTimer: " + IsoFutureDate);
    //SET T2 (data_sollecito_invio_domande)
    //data_sollecito_invio_domande = new Date();
    //data_sollecito_invio_domande.setDate(data_fine_invio_domande.getDate());
    data_sollecito_invio_domande = new Date(data_fine_invio_domande.getTime());
    if ((data_sollecito_invio_domande !== null) && (data_sollecito_invio_domande !== undefined)) {
      data_sollecito_invio_domande.setDate(data_sollecito_invio_domande.getDate() - num_giorni_mail_sollecito);
      IsoFutureDate = utils.toISO8601(data_sollecito_invio_domande);
    } else {
      IsoFutureDate = IsoRemoteDate;
    }
    execution.setVariable('wfvarSollecitoBandoTimer', IsoFutureDate.toString());
    logger.error("T2) wfvarSollecitoBandoTimer: " + IsoFutureDate);
    //SET T3 (data_fine_invio_domande)
    if ((data_fine_invio_domande !== null) && (data_fine_invio_domande !== undefined)) {
      IsoFutureDate = utils.toISO8601(data_fine_invio_domande);
    } else {
      IsoFutureDate = IsoRemoteDate;
    }
    execution.setVariable('wfvarChiusuraBandoTimer', IsoFutureDate.toString());
    logger.error("T3) wfvarChiusuraBandoTimer: " + IsoFutureDate);
    //SET T4 (data_variazione_commissione)
    if ((data_variazione_commissione !== null) && (data_variazione_commissione !== undefined)) {
      IsoFutureDate = utils.toISO8601(data_variazione_commissione);
    } else {
      IsoFutureDate = IsoRemoteDate;
    }
    execution.setVariable('wfvarVariazioneCommissioneTimer', IsoFutureDate.toString());
    logger.error("T4) wfvarVariazioneCommissioneTimer: " + IsoFutureDate);
    //SET T5 (data_termine_flusso_bando)
    if ((data_termine_flusso_bando !== null) && (data_termine_flusso_bando !== undefined)) {
      IsoFutureDate = utils.toISO8601(data_termine_flusso_bando);
    } else {
      IsoFutureDate = IsoRemoteDate;
    }
    execution.setVariable('wfvarTerminaFlussoBandoTimer', IsoFutureDate.toString());
    logger.error("T5) wfvarTerminaFlussoBandoTimer: " + IsoFutureDate);
  }

  return {
    infoVersion : infoVersion,
    bandoSartSettings : bandoSartSettings,
    verificaAggiungiVersionamento : verificaAggiungiVersionamento,
    verificaRimuoviVersionamento : verificaRimuoviVersionamento,
    checkOut : checkOut,
    checkIn : checkIn,
    unCheckOut : unCheckOut
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
