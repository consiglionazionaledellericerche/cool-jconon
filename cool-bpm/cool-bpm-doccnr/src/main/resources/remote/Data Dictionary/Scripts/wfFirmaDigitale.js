/*global execution, companyhome, logger, utils, cnrutils, use, search, arubaSign, actions, bpm_workflowDescription, wfcnr_wfCounterId, bpm_package, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority */
var wfFirmaDigitale = (function () {
  "use strict";
  var serverPath = "http://demo-doccnr.cedrc.cnr.it:8280/doccnr";

  function inizializza(nodoDocumento) {
    // create file, make it versionable
    //// logger.error(" Doc: " + nodoDocumento.properties.title + " -- " + nodoDocumento.properties.description);
    if (!nodoDocumento.hasAspect("cm:versionable")) {
      nodoDocumento.addAspect("cm:versionable");
      //// logger.error("Il Doc è ora versionabile");
    }
    if (!nodoDocumento.hasAspect("cnrfirma:statoDocumento")) {
      nodoDocumento.addAspect("cnrfirma:codiceDocumento");
      //// logger.error("Il Doc è ora con CODICE");
    }
    if (!nodoDocumento.hasAspect("cnrfirma:codiceDoc")) {
      nodoDocumento.addAspect("cnrfirma:statoDocumento");
      //// logger.error("Il Doc è ora con STATO");
    }
    nodoDocumento.properties["cm:autoVersionOnUpdateProps"] = false;
    nodoDocumento.properties["cm:autoVersion"] = true;
    nodoDocumento.properties.statoDoc = "IN_APPROVAZIONE";
    nodoDocumento.properties.codiceDoc = "non assegnato";
    nodoDocumento.save();
    // logger.error("Il Doc: "  + nodoDocumento.properties.title + " in stato: " + nodoDocumento.properties.statoDoc + " ed ha codice: " + nodoDocumento.properties.codiceDoc);
  }


  function getTaskAssignee(taskId) {
  // trova l'assegnatario del task corrente
    var service, identities, taskOwner, i;
    // logger.error("wfFirmaDigitale.getTaskAssignee taskid: " + taskId);
    service = cnrutils.getBean("activitiTaskService");
    identities = service.getIdentityLinksForTask(taskId);
    for (i = 0; i < identities.size(); i++) {
      // logger.error("getUserId " + i + " " + identities.get(i).getUserId());
      // logger.error("getType "  + i + " " + identities.get(i).getType());
      if (identities.get(i).getType().equals("assignee")) {
        taskOwner = identities.get(i).getUserId();
      }
    }
    return (taskOwner);
  }

  function copiaPermessi(nodoDoc, nodoDest) {
    // copio i permessi da nodoDoc a  nodoDest
    var permessi,  i;
    // rimuovo tutti i permessi a nodoDest
    nodoDest.setInheritsPermissions(false);
    permessi = nodoDest.getPermissions();
    for (i = 0; i < permessi.length; i++) {
      nodoDest.removePermission(permessi[i].split(";")[2], permessi[i].split(";")[1]);
      // logger.error(i + ") rimuovo permesso: " + permessi[i].split(";")[2] + " a " + permessi[i].split(";")[1]);
    }
    // copio i permessi da nodoDoc
    permessi = nodoDoc.getPermissions();
    for (i = 0; i < permessi.length; i++) {
      nodoDest.setPermission(permessi[i].split(";")[2], permessi[i].split(";")[1]);
      // logger.error(i + ") assegno permesso " + permessi[i].split(";")[2] + " a " + permessi[i].split(";")[1]);
    }
    nodoDest.setOwner('spaclient');
  }

  function verificaDocumentoFirmato(nodoDoc) {
    // confronta il file firmato con la versione precedente (ossia l'originale)
    //var pathDoc = "FIRMA DIGITALE/TEST/DOCUMENTO di test 1";
    // var nodoDoc = companyhome.childByNamePath(pathDoc);
    var firmato, listaVersioni, nodoDocPrecedente;
    firmato = false;
    // logger.error("Il Doc: "  + nodoDoc.properties.name);
    // logger.error("Il Doc: "  + nodoDoc.properties.autoVersion);
    listaVersioni =  nodoDoc.versionHistory;
    if (listaVersioni[1]) {
      nodoDocPrecedente = search.findNode("workspace://version2Store/" + listaVersioni[1].node.id);
      if (nodoDocPrecedente) {
        // logger.error("doc firmato: " + nodoDoc.name + " (" + nodoDoc.nodeRef + ") versione: "  + listaVersioni[0].label);
        // logger.error("doc originale: " + nodoDocPrecedente.name + " (" + nodoDocPrecedente.nodeRef + ") versione: "  + listaVersioni[1].label);
        firmato = true;
      }
    }
    if (!firmato) {
      throw new Error("FLUSSO FIRMA - IL DOCUMENTO FIRMATO NON RISULTA CONFORME ALL' ORIGINALE");
    }
    return (firmato);
  }

  function firmaFile(username, password, otp, nodoDoc, folderDestination, gruppoApprovatore, codiceDoc) {
    // chiama la funzione firma che restituisce la stringa di contenuto del file firmato
    var mimetypeDoc, nameDoc, nameDocFirmato, docFirmato, nodeDestination, service, estenzione, data, firmaEseguita;
    //// logger.error("username: "  + username + " password: " + password + "otp: "  + otp + " nodoDoc: " + nodoDoc.name + " folderDestination: " + folderDestination);
    // funzione per aruba webscript che ritorna il file in stringa
    mimetypeDoc = nodoDoc.properties.content.mimetype;
    nameDoc = nodoDoc.name;
    service = cnrutils.getBean('mimetypeService');
    estenzione = "." + service.getExtension(nodoDoc.mimetype);
    if (nodoDoc.name.indexOf(estenzione) === -1) {
      nameDoc = nameDoc + estenzione;
    }
    nameDocFirmato = nameDoc + ".p7m";
    //crea il doc firmato
    docFirmato = nodoDoc.parent.createFile(nameDocFirmato);
    //docFirmato.mimetype = "application/p7m";
    docFirmato.save();
    try {
      firmaEseguita = arubaSign.pkcs7SignV2(username, password, otp, nodoDoc.nodeRef, docFirmato.nodeRef);
    } catch (err) {
      throw new Error("FLUSSO FIRMA - IL PROCESSO DI FIRMA DIGITALE NON E' ANDATO A BUON FINE");
    }
    logger.error("doc firmato: "  +  docFirmato.name + " con mimetype: " +  docFirmato.mimetype + " e codice: " + codiceDoc);
    // rimuovo i permessi di Collaborator al gruppoApprovatore
    nodoDoc.removePermission("Collaborator", gruppoApprovatore);
    nodoDoc.setPermission("Consumer", gruppoApprovatore);
    // copio i permessi di su 
    copiaPermessi(nodoDoc, docFirmato);
    // aggiungi aspect per l'associazione delle firma
    // logger.error("cambio i permessi Collaborator a Consumer per: " + gruppoApprovatore + " e copio i permessi da: " + nodoDoc.name + " a: " + docFirmato.name);
    data = new Date();
    nodoDoc.addAspect("cnrfirma:signable");
    nodoDoc.properties.firmato = true;
    nodoDoc.properties.ufficioFirmatario = gruppoApprovatore;
    //nodoDoc.properties.dataFirma =  utils.toISO8601(data);
    nodoDoc.properties.dataFirma = data;
    nodoDoc.properties.codiceDoc = codiceDoc;
    nodoDoc.save();
    nodoDoc.createAssociation(docFirmato, "cnrfirma:signatureAssoc");
    // logger.error("Il doc originale viene associato al doc: "  +  nodoDoc.assocs["cnrfirma:signatureAssoc"][0].name);
    // copia entrambi i file nella cartella di destinazione
    if (folderDestination) {
      nodeDestination = search.findNode(folderDestination);
      // logger.error("La folder di destinazione: "  +  nodeDestination.name + " e " + nodoDoc.parent.name);
      if (!nodeDestination.nodeRef.equals(nodoDoc.parent.nodeRef)) {
        nodeDestination.addNode(nodoDoc);
        nodeDestination.addNode(docFirmato);
      }
    }
    return (true);
  }

  function approvaFile(nodoDoc, folderDestination, gruppoApprovatore, codiceDoc) {
    // chiama la funzione firma che restituisce la stringa di contenuto del file firmato
    var nodeDestination;
    // logger.error(" nodoDoc: " + nodoDoc.name + " folderDestination: " + folderDestination);
    // rimuovo i permessi di Collaborator al gruppoApprovatore
    nodoDoc.removePermission("Collaborator", gruppoApprovatore);
    nodoDoc.setPermission("Consumer", gruppoApprovatore);
    nodoDoc.properties.codiceDoc = codiceDoc;
    nodoDoc.save();
    // aggiungi aspect per l'associazione delle firma
    // logger.error("cambio i permessi Collaborator a Consumer per: " + gruppoApprovatore);
    // copia il file nella cartella di destinazione
    if (folderDestination) {
      nodeDestination = search.findNode(folderDestination);
      // logger.error("La folder di destinazione: "  +  nodeDestination.name + " e " + nodoDoc.parent.name);
      if (!nodeDestination.nodeRef.equals(nodoDoc.parent.nodeRef)) {
        nodeDestination.addNode(nodoDoc);
      }
    }
    return (true);
  }

  function settaPermessi(nodoDoc, gruppoApprovatore) {
    // assegna permessi di consumer a tutti quelli che avevano permessi sul nodo e di Collaborator al gruppo assegnatario
    var permessi,  i;
    permessi = nodoDoc.getPermissions();
    nodoDoc.setInheritsPermissions(false);
    for (i = 0; i < permessi.length; i++) {
      nodoDoc.removePermission(permessi[i].split(";")[2], permessi[i].split(";")[1]);
      // logger.error(i + ") rimuovo permesso: " + permessi[i].split(";")[2] + " a " + permessi[i].split(";")[1]);
      nodoDoc.setPermission("Consumer", permessi[i].split(";")[1]);
      // logger.error(i + ") assegno permesso Consumer: a " + permessi[i].split(";")[1]);
    }
    nodoDoc.setPermission("Collaborator", gruppoApprovatore);
    nodoDoc.setOwner('spaclient');
    // logger.error(" assegno permesso Collaborator: a " + gruppoApprovatore + " e ownership a: " + nodoDoc.getOwner());
  }

  function ripristinaPermessi(nodoDoc, gruppoApprovatore, permessi, utenteInitiator) {
    // assegna permessi di consumer a tutti quelli che avevano permessi sul nodo e di Collaborator al gruppo assegnatario
    var elemPermessi, i;
    elemPermessi = permessi.split(",");
    nodoDoc.setInheritsPermissions(true);
    for (i = 0; i < elemPermessi.length; i++) {
      nodoDoc.setPermission(elemPermessi[i].split(";")[2], elemPermessi[i].split(";")[1]);
      // logger.error(i + ") ripristino permesso: " + elemPermessi[i].split(";")[2] + " a " + elemPermessi[i].split(";")[1]);
    }
    nodoDoc.removePermission("Collaborator", gruppoApprovatore);
    nodoDoc.setOwner(utenteInitiator);
    // logger.error(" rimuovo i permessi Collaborator: a " + gruppoApprovatore + " e riassegnol' ownership a: " + nodoDoc.getOwner());
  }

  function controlloStart(wf_package) {
    // controllo che ci sia un doc allegato e che non sia stato avviato alro flusso FIRMA sul doc
    if (wf_package !== null) {
      if ((wf_package.children[0] !== null) && (wf_package.children[0] !== undefined)) {
        // logger.error("FLUSSO FIRMA - wf_package.children[0]: " + wf_package.children[0]);
        var nodoDoc = wf_package.children[0];
        if (nodoDoc.typeShort.equals("cm:folder")) {
          throw new Error("FLUSSO FIRMA - IL FLUSSO NON PUO' ESSERE AVVIATO SU UNA CARTELLA");
        }
        if ((nodoDoc.properties.statoDoc !== null)) {
          if ((nodoDoc.properties.statoDoc.equals("IN_APPROVAZIONE")) || (nodoDoc.properties.statoDoc.equals("IN_VALUTAZIONE")) || (nodoDoc.properties.statoDoc.equals("APPROVATO")) || (nodoDoc.properties.statoDoc.equals("FIRMATO")) || (nodoDoc.properties.statoDoc.equals("RESPINTO"))) {
            // logger.error("FLUSSO FIRMA - DOCUMENTO RISULTA IN PRESENTE IN ALTRO FLUSSO in stato: " + nodoDoc.properties.statoDoc);
            throw new Error("FLUSSO FIRMA - DOCUMENTO RISULTA IN PRESENTE IN ALTRO FLUSSO");
          }
        }
      } else {
        throw new Error("FLUSSO FIRMA - DEVE ESSERE ALLEGATO UN DOCUMENTO");
      }
    }
    return (true);
  }

  function inviaNotifica(destinatario, testo, isWorkflowPooled, groupAssignee) {
    var mail, templateArgs, templateModel, groupAssigneeName;
    if (groupAssignee) {
      if (groupAssignee.properties.authorityDisplayName) {
        groupAssigneeName = groupAssignee.properties.authorityDisplayName;
      } else {
        groupAssigneeName = groupAssignee.properties.authorityName;
      }
    }
    if (destinatario.properties.email) {
      // logger.error("FLUSSO FIRMA - invia notifica- destinatario:" + destinatario.properties.email + " testo " + testo + " groupAssignee " + groupAssignee);
      mail = actions.create("mail");
      mail.parameters.to = destinatario.properties.email;
      mail.parameters.subject = "FLUSSO FIRMA DIGITALE (" + bpm_workflowDescription + ")";
      mail.parameters.from = "notifiche-flussi-documentali@cnr.it";
      mail.parameters.text = testo;
      //USING TEMPLATE
      mail.parameters.template = companyhome.childByNamePath("Data Dictionary/Email Templates/Workflow Notification/wf-cnr-email_it.html.ftl");
      templateArgs = [];
      templateArgs.workflowDefinitionName = "FIRMA DIGITALE";
      templateArgs.workflowTitle = bpm_workflowDescription + " (id: " + wfcnr_wfCounterId + ")";
      templateArgs.workflowPooled = isWorkflowPooled;
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


  function finalizza(nodoDoc) {
    //cambia stato se diverso da APPROVATO o FIRMATO
    if ((nodoDoc) && (nodoDoc !== 'undefined')) {
      if (!((nodoDoc.properties.statoDoc.equals("APPROVATO")) || (nodoDoc.properties.statoDoc.equals("FIRMATO")))) {
        nodoDoc.properties.statoDoc = "";
        nodoDoc.save();
        // logger.error("FLUSSO FIRMA - END cambio stato in: " + nodoDoc.properties.statoDoc);
      }
    }
  }

  function aggiornaParametri(task) {
    //aggiorna le properties del task con quelle del workflow
    if (bpm_workflowDueDate !== 'undefined') { task.setVariable('bpm_dueDate', bpm_workflowDueDate); }
    if (bpm_workflowPriority !== 'undefined') { task.priority = bpm_workflowPriority; }
    if (bpm_workflowDescription !== 'undefined') { task.setVariable('bpm_workflowDescription', bpm_workflowDescription); }
    // logger.error("FLUSSO FIRMA - wfcnr_wfCounterId: " + wfcnr_wfCounterId + " execustion: " + execution.getVariable('wfcnr_wfCounterId') + " task: " + task.getVariable('wfcnr_wfCounterId'));
    execution.setVariable('bpm_comment', execution.getVariable('commentoPrecedente'));
    if (wfcnr_wfCounterId !== 'undefined') { task.setVariable('wfcnr_wfCounterId', wfcnr_wfCounterId); }
  }

  return {
    inizializza : inizializza,
    finalizza : finalizza,
    firmaFile : firmaFile,
    approvaFile : approvaFile,
    getTaskAssignee : getTaskAssignee,
    settaPermessi : settaPermessi,
    copiaPermessi : copiaPermessi,
    controlloStart : controlloStart,
    ripristinaPermessi : ripristinaPermessi,
    inviaNotifica : inviaNotifica,
    verificaDocumentoFirmato : verificaDocumentoFirmato,
    aggiornaParametri : aggiornaParametri
  };
}
  ());