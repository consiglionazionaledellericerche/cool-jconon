/*global execution, people, logger, utils, initiator, bpm_context, bpm_package, cnrutils,task, companyhome */
var wfContatori = (function () {
  "use strict";
  // SET PATH CARTELLE CONTATORI
  var DEBUG, debuginfo, errorBlock, pathCartellaPadre, nomeCartellaContatori, nodoRicercato, id_workflow, dataInCorso, annoInCorso, nodoCartellaPadre, local_bpm_package, local_bpm_workflowDueDate, local_bpm_workflowDescription, local_bpm_assignee, local_bpm_groupAssignee, nomeCartellaFlussi, pathCartellaPadreSys, nodiCartellaPadreSys, nodoCartellaPadreSys;
  debuginfo = false; //variabile per abilitare le log
  errorBlock = true; //variabile per le assert
  pathCartellaPadreSys = "PATH:\"//sys:system/sys:workflow\"";
  pathCartellaPadre = 'Data Dictionary';
  nomeCartellaContatori = 'CONTATORI';
  nomeCartellaFlussi = 'FLUSSI_DOCUMENTALI';

  nodoRicercato = null;
  id_workflow = "ID-GENERICO";
  dataInCorso = new Date();
  annoInCorso = dataInCorso.getFullYear();
  local_bpm_package = execution.getVariable('bpm_package');
  local_bpm_workflowDueDate = execution.getVariable('bpm_workflowDueDate');
  local_bpm_workflowDescription = execution.getVariable('bpm_workflowDescription');
  local_bpm_assignee = execution.getVariable('bpm_assignee');
  local_bpm_groupAssignee = execution.getVariable('bpm_groupAssignee');

  // GET VARIABILI WORKFLOW
  nodiCartellaPadreSys = search.luceneSearch(pathCartellaPadreSys);
  nodoCartellaPadreSys = nodiCartellaPadreSys[0];
  //nodoCartellaPadre = companyhome.childByNamePath(pathCartellaPadre);
  //nodoCartellaPadre = companyhome;
  // LA CARTELLA FLUSSI_DOCUMENTALI HA LO STESSO PADRE DI CONTATORI
  nodoCartellaPadre = nodoCartellaPadreSys;
  DEBUG = true;

  function logHandler(testo) {
    if (DEBUG) {
      logger.error("wfContatori.js -- " + testo);
    }
  }

  // ----------------- FUNZIONI -----------------
  function assert(condition, message) {
    if (errorBlock && !condition) {
      // logHandler(message || "failed condition: " + condition);
      throw new Error(message || "failed condition: " + condition);
    }
  }

  function leggiContatore(titoloFlusso, nodoContatore) {
    var riferimento = 'NESSUNO';
    //// logHandler("############## anno " + nodoContatore.properties["cnrcount:anno"] + " contatore " + nodoContatore.properties["cnrcount:contatore"]);
    assert(nodoContatore !== null, "wfContatori.js: verifica nodo contatore");
    if (nodoContatore !== null) {
      riferimento = titoloFlusso + "-" + nodoContatore.properties["cnrcount:anno"] + "-" + nodoContatore.properties["cnrcount:contatore"];
      //// logHandler("############## contatore: " + riferimento);
    }
    return [riferimento, nodoContatore.properties["cnrcount:contatore"]];
  }

  function inserisciContatore(titoloFlusso, annoRiferimento, cartella_Contatori) {
    var destNode = null;
    assert(cartella_Contatori !== null, "wfContatori.js: verifica cartella contatori");
    if (cartella_Contatori !== null) {
      // logHandler("inizializza -- Inserisco elemento nella cartella Contatori: " + cartella_Contatori.name);
      destNode = cartella_Contatori.createNode("CONTATORE_" + titoloFlusso + "-" + annoRiferimento, "cnrcount:singleGruopCounter");
      destNode.properties["cnrcount:anno"] = annoRiferimento;
      destNode.properties["cnrcount:contatore"] = 1;
      destNode.save();
    }
    return (destNode);
  }

  function incrementaContatore(nodoContatore) {
    // logHandler("############## VARIABILI CONTATORE:  -" + nodoContatore.properties["cnrcount:anno"] + "- nr. " + nodoContatore.properties["cnrcount:contatore"]);
    //metto in check-out
    var nodoAppo = nodoContatore.checkout();
    nodoAppo.properties["cnrcount:contatore"] = nodoContatore.properties["cnrcount:contatore"] + 1;
    nodoContatore.properties["cnrcount:contatore"] = nodoAppo.properties["cnrcount:contatore"];
    nodoAppo.save();
    //nodoContatore.save();
    nodoContatore = nodoAppo.checkin();
    // logHandler("############## CONTATORE INCREMENTATO :  -" + nodoContatore.properties["cnrcount:anno"] + "- nr. " + nodoContatore.properties["cnrcount:contatore"]);
  }

  //-- trovaNodoContatore
  function trovaNodoContatore(nodoCartellaContatori, titoloFlusso, annoRiferimento) {
    var i, nodoTrovato, propValue, nomeContatore;
    i = 0;
    nodoTrovato = null;
    propValue = null;
    nomeContatore = "CONTATORE_" + titoloFlusso + "-" + annoRiferimento;
    // logHandler("############## cerco contatore " + nomeContatore);
    for (i = 0; i < nodoCartellaContatori.children.length; i++) {
      if (nodoCartellaContatori.children[i].properties.name === nomeContatore) {
        propValue = nodoCartellaContatori.children[i].properties["cnrcount:contatore"];
        logHandler("############## il valore del contatore: " + nodoCartellaContatori.children[i].properties.name + ": " +  propValue);
        nodoTrovato = nodoCartellaContatori.children[i];
      }
    }
    return (nodoTrovato);
  }

  //VERIFICA L'ESISTENZA DI UNA CARTELLA, SE VUOTA LA CREA SETTANDO I PERMESSI
  function verificaCartella(nodoPadre, nomeRichiesto) {
    var nodoCartella;
    if (nodoPadre.hasChildren) {
      nodoCartella = nodoPadre.childByNamePath(nomeRichiesto);
      if (nodoCartella === null) {
        //nodoCartella = nodoPadre.createFolder(nomeRichiesto);
        nodoCartella = nodoPadre.createNode(nomeRichiesto, "cm:folder", "sys:children");
        //nodoCartella = nodoPadre.createNode(nomeRichiesto, "cm:folder");
        nodoCartella.setInheritsPermissions(false);
          // logHandler("inizializza -- creato cartella: " + nodoCartella.name + " nella cartella " + nodoPadre.name);
      }
    } else {
      nodoCartella = nodoPadre.createNode(nomeRichiesto, "cm:folder", "sys:children");
      nodoCartella.setInheritsPermissions(false);
    }
    return (nodoCartella);
  }

  //VERIFICA L'ESISTENZA DI UNA CARTELLA, SE VUOTA LA CREA SETTANDO I PERMESSI
  function verificaCartellaFlusso(nodoPadre, nomeRichiesto) {
    var nodoCartella = nodoPadre.childByNamePath(nomeRichiesto);
    if (nodoCartella === null) {
      //nodoCartella = nodoPadre.createFolder(nomeRichiesto);
      nodoCartella = nodoPadre.createFolder(nomeRichiesto);
      nodoCartella.setInheritsPermissions(false);
      logHandler("verificaCartellaFlusso -- creato cartella: " + nodoCartella.name + " nella cartella " + nodoPadre.name);
    }
    return (nodoCartella);
  }

  //AGGIUNGI IL VERSIONAMENTO IL FILE
  function gestisciVersionamento(nodoDoc) {
    if (!nodoDoc.hasAspect("cm:versionable")) {
      nodoDoc.addAspect("cm:versionable");
      logHandler("gestisciVersionamento -Il Doc è ora versionabile");
    }
    nodoDoc.properties["cm:autoVersionOnUpdateProps"] = false;
    nodoDoc.properties["cm:autoVersion"] = true;
    nodoDoc.save();
  }

  // CREA LA CARTELLA 'FLUSSI_DOCUMENTALI' E TRASFERISCE TUTTI I DOC DALLA CARTELLA TEMP DI UPLOAD NEL PACKAGE E NELLA CARTELLA 'FLUSSI_DOCUMENTALI'
  function spostaUploadedDocInCatellaFlussi() {
    var nodoCartellaFlussi, nodoCartellaFlusso, i, j, nodoCartellaTemp, nodoDocumento;
    nodoCartellaFlussi = verificaCartella(nodoCartellaPadre, nomeCartellaFlussi);
    nodoCartellaFlusso = verificaCartellaFlusso(nodoCartellaFlussi, execution.getVariable('wfcnr_wfCounterId'));
    // set del bpm_context
    logHandler("spostaUploadedDocInCatellaFlussi");
    //execution.setVariable('bpm_context', nodoCartellaFlusso);
    // SPOSTO IL CONTENUTO DELLA CARTELLA TEMP IN CARTELLA FLUSSO SPECIFICO
    for (i = 0; i < bpm_package.children.length; i++) {
      nodoCartellaTemp = bpm_package.children[i];
      if (nodoCartellaTemp.typeShort.equals("cm:folder")) {
        logHandler("CONTROLLO FLUSSO - IL FLUSSO E' AVVIATO SU " + i + " CARTELLA TEMPORANEA: " + nodoCartellaTemp.name);
        for (j = 0; j < nodoCartellaTemp.children.length; j++) {
          nodoDocumento = nodoCartellaTemp.children[j];
          //Indico ogni documento come versionabile minor alla modifica del contenuto e non dei metadati
          gestisciVersionamento(nodoDocumento);
          nodoDocumento.move(nodoCartellaFlusso);
          logHandler("spostaUploadedDocInCatellaFlussi -- sposto il doc: " + nodoDocumento.name + " nella cartella " + nodoCartellaFlusso.name);
          bpm_package.addNode(nodoDocumento);
          logHandler("spostaUploadedDocInCatellaFlussi -- aggiungo il doc: " + nodoDocumento.nodeRef + " nella cartella " + bpm_package.typeShort);
        }
        logHandler("spostaUploadedDocInCatellaFlussi -- rimuovo cartella temp: " + nodoCartellaTemp.name);
        nodoCartellaTemp.remove();
      }
    }
  }

  // CREA LA CARTELLA 'FLUSSI_DOCUMENTALI' E VI TRASFERISCE TUTTI I DOC DEL PACKAGE CON RIMOZIONE DEL FILE TEMPORANEO
  function spostaDocInCatellaFlussi() {
    var nodoCartellaFlussi, nodoCartellaFlusso, i, j, nodoDocumento, nodoTemporaneo;
    nodoCartellaFlussi = verificaCartella(nodoCartellaPadre, nomeCartellaFlussi);
    nodoCartellaFlusso = verificaCartellaFlusso(nodoCartellaFlussi, execution.getVariable('wfcnr_wfCounterId'));
    // set del bpm_context
    logHandler("spostaDocInCatellaFlussi");
    // SPOSTO I doc del package IN CARTELLA FLUSSO SPECIFICO
    for (j = 0; j < bpm_package.children.length; j++) {
      nodoDocumento = bpm_package.children[j];
      if (nodoDocumento.typeShort.equals("cm:folder")) {
        logHandler("CONTROLLO FLUSSO - IL FLUSSO E' AVVIATO SU UNA CARTELLA : " + nodoDocumento.name);
        throw new Error("NON E' POSSIBILE AVVIARE IL FLUSSO SU UNA CARTELLA");
      } else {
      //Indico ogni documento come versionabile minor alla modifica del contenuto e non dei metadati
        gestisciVersionamento(nodoDocumento);
        nodoDocumento.move(nodoCartellaFlusso);
        logHandler("spostaDocInCatellaFlussi -- sposto il doc: " + nodoDocumento.name + " nella cartella " + nodoCartellaFlusso.name);
        //RIMOZIONE DOCUMENTO DI APPOGGIO TEMPORANEO
        if (nodoDocumento.parentAssocs["cm:contains"].length > 0) {
          for (i = 0; i < nodoDocumento.parentAssocs["cm:contains"].length - 1; i++) {
            nodoTemporaneo = nodoDocumento.parentAssocs["cm:contains"][i];
            logger.info("wfContatori.js - RIMUOVO DOCUMENTO DI APPOGGIO TEMPORANEO: " + nodoTemporaneo.name + "- nodeRef: " + nodoTemporaneo.nodeRef);
            nodoTemporaneo.parent.removeNode(nodoTemporaneo);
          }
        }
      }
    }
  }
  // CREA LA CARTELLA 'FLUSSI_DOCUMENTALI' E VI TRASFERISCE TUTTI I DOC DEL PACKAGE SENZA RIMOZIONE DEL FILE TEMPORANEO
  function copiaDocInCatellaFlussi() {
    var nodoCartellaFlussi, nodoCartellaFlusso, j, nodoDocumento, nodoCartellaOrigine;
    nodoCartellaFlussi = verificaCartella(nodoCartellaPadre, nomeCartellaFlussi);
    nodoCartellaFlusso = verificaCartellaFlusso(nodoCartellaFlussi, execution.getVariable('wfcnr_wfCounterId'));
    // set del bpm_context
    logHandler("spostaDocInCatellaFlussi");
    // SPOSTO I doc del package IN CARTELLA FLUSSO SPECIFICO
    for (j = 0; j < bpm_package.children.length; j++) {
      nodoDocumento = bpm_package.children[j];
      if (nodoDocumento.typeShort.equals("cm:folder")) {
        logHandler("CONTROLLO FLUSSO - IL FLUSSO E' AVVIATO SU UNA CARTELLA : " + nodoDocumento.name);
        throw new Error("NON E' POSSIBILE AVVIARE IL FLUSSO SU UNA CARTELLA");
      } else {
      //Indico ogni documento come versionabile minor alla modifica del contenuto e non dei metadati
        gestisciVersionamento(nodoDocumento);
        nodoCartellaOrigine = nodoDocumento.parent;
        nodoDocumento.move(nodoCartellaFlusso);
        nodoCartellaOrigine.addNode(nodoDocumento);
        logHandler("spostaDocInCatellaFlussi -- sposto il doc: " + nodoDocumento.name + " nella cartella " + nodoCartellaFlusso.name);
      }
    }
  }

 // CREA LA CARTELLA 'FLUSSI_DOCUMENTALI' E VI TRASFERISCE TUTTI I DOC DEL PACKAGE SENZA RIMOZIONE DEL FILE TEMPORANEO LASCIANDO COME PRIMARY LA CARTELLA ORIGINARIA
  function copiaDocInCatellaFlussiAsSecondary() {
    var nodoCartellaFlussi, nodoCartellaFlusso, j, nodoDocumento, nodoCartellaOrigine;
    nodoCartellaFlussi = verificaCartella(nodoCartellaPadre, nomeCartellaFlussi);
    nodoCartellaFlusso = verificaCartellaFlusso(nodoCartellaFlussi, execution.getVariable('wfcnr_wfCounterId'));
    // set del bpm_context
    logHandler("spostaDocInCatellaFlussi");
    // SPOSTO I doc del package IN CARTELLA FLUSSO SPECIFICO
    for (j = 0; j < bpm_package.children.length; j++) {
      nodoDocumento = bpm_package.children[j];
      if (nodoDocumento.typeShort.equals("cm:folder")) {
        logHandler("CONTROLLO FLUSSO - IL FLUSSO E' AVVIATO SU UNA CARTELLA : " + nodoDocumento.name);
        throw new Error("NON E' POSSIBILE AVVIARE IL FLUSSO SU UNA CARTELLA");
      } else {
      //Indico ogni documento come versionabile minor alla modifica del contenuto e non dei metadati
        gestisciVersionamento(nodoDocumento);
        nodoCartellaFlusso.addNode(nodoDocumento);
        logHandler("spostaDocInCatellaFlussi -- sposto il doc: " + nodoDocumento.name + " nella cartella " + nodoCartellaFlusso.name);
      }
    }
  }
  // ----------------- MAIN -----------------
// ----------------- MAIN -----------------
  function inizializza() {
    var nodoContatori, nodoRicercato, id_workflow, id_workflow_short, titoloFlusso;
    execution.setVariable('wfvarWorkflowInstanceId', 'activiti$' + execution.id);
    logHandler("setto variabile  wfvarWorkflowInstanceId con execution.id " + execution.id + "##############");
    titoloFlusso =  execution.getVariable('wfvarTitoloFlusso');
    logHandler(" titoloFlusso " + titoloFlusso);
    nodoContatori = verificaCartella(nodoCartellaPadreSys, nomeCartellaContatori);
    //assert(titoloFlusso) !== null, "wfContatori.js: verifica esistenza titolo Flusso");
    //TEST PER NOTIFICA MAIL
    if (titoloFlusso !== null) {
      nodoRicercato = trovaNodoContatore(nodoContatori, titoloFlusso, annoInCorso);
      logHandler(" nodoRicercato: " + nodoRicercato + " titoloFlusso " + titoloFlusso + " annoInCorso " + annoInCorso);
      if (nodoRicercato !== null) {
        incrementaContatore(nodoRicercato);
      } else {
        nodoRicercato = inserisciContatore(titoloFlusso, annoInCorso, nodoContatori);
      }
      id_workflow = leggiContatore(titoloFlusso, nodoRicercato);
      id_workflow_short = id_workflow[0];
      logHandler("inizializza -- workflow id: " + id_workflow_short);
      execution.setVariable('wfcnr_wfCounterId', id_workflow_short);
      execution.setVariable('wfcnr_wfCounterIndex', id_workflow[1]);
      execution.setVariable('wfcnr_wfCounterAnno', annoInCorso);
    } else {
      // SET VARIABILI WORKFLOW
      execution.setVariable('wfcnr_wfCounterId', ' INESISTENTE');
      logHandler("inizializza - wfcnr_wfCounterId: " +  " INESISTENTE ##############");
      throw new Error("NON E' POSSIBILE AVVIARE UN FLUSSO CON NOME NON DEFINITO");
    }
  }
  return {
    inizializza : inizializza,
    spostaDocInCatellaFlussi : spostaDocInCatellaFlussi,
    copiaDocInCatellaFlussiAsSecondary : copiaDocInCatellaFlussiAsSecondary,
    copiaDocInCatellaFlussi : copiaDocInCatellaFlussi,
    spostaUploadedDocInCatellaFlussi : spostaUploadedDocInCatellaFlussi
  };
}
  ());