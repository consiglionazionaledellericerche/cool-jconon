/*global cnrutils,search,status,args,_,logger,jsonUtils,model,requestbody, utils */
function main() {
  "use strict";
  var json = jsonUtils.toObject(requestbody.content),
    applicationSource = search.findNode(json.applicationSourceId),
    callTarget = search.findNode(json.callTargetId),
    contributorToUser = json.contributorToUser !== false,
    nodeService = cnrutils.getBean("nodeService"),
    applicationTarget,
    applicationProperties = applicationSource.getProperties(),
    userId = applicationProperties["jconon_application:user"],
    i = 0,
    z = 0,
    jsonMap,
    children,
    child,
    application = callTarget.childByNamePath(applicationSource.getName()),
    childType,
    mappingFile,
    childMappingType,
    childMappingTypeShort,
    childMappingQname,
    bandoTarget,
    sezioniCurriculum,
    sezioniProdotti,
    sezioniAllegati,
    sezioniDomanda;

  model.email = applicationProperties["jconon_application:email_comunicazioni"];
  model.nominativo = applicationProperties["jconon_application:cognome"] + ' ' + applicationProperties["jconon_application:nome"];
  model.bando = callTarget.name;

  // TROVA FILE DI MAPPING BULKINFO
  bandoTarget = callTarget;
  while (!bandoTarget.getName().equals("Selezioni on-line") && !(bandoTarget.childByNamePath("bulkInfoMapping.js"))) {
    bandoTarget = bandoTarget.parent;
  }
  mappingFile = bandoTarget.childByNamePath("bulkInfoMapping.js");
  jsonMap = jsonUtils.toObject(mappingFile.content);

  // VERIFICA ELEMENTI DEL BANDO
  sezioniCurriculum = callTarget.getProperties()["jconon_call:elenco_sezioni_curriculum"];
  sezioniProdotti = callTarget.getProperties()["jconon_call:elenco_prodotti"];
  sezioniAllegati = callTarget.getProperties()["jconon_call:elenco_association"];
  sezioniDomanda = callTarget.getProperties()["jconon_call:elenco_sezioni_domanda"];

  if (application !== null) {
    if (String(application.getProperties()["jconon_application:stato_domanda"]) === 'I') {
      application.remove();
    } else {
      logger.error("application-paste - Domanda gia presente!");
      status.setCode(status.STATUS_BAD_REQUEST, "message.application.for.copy.alredy.exists");
      model.esito = false;
      return;
    }
  }
  logger.error("application-paste - Start - copia domanda: " + applicationSource.getName() + " (" + applicationSource.id + ") da: " + applicationSource.parent.getName() + " a: " + callTarget.name);

  //COPIA NODO
  applicationTarget = applicationSource.copy(callTarget, true);
  applicationTarget.getProperties()["jconon_application:stato_domanda"] = "P";
  applicationTarget.getProperties()["jconon_application:data_domanda"] = null;
  applicationTarget.save();
  cnrutils.getBean("permissionService").deletePermissions(applicationTarget.getNodeRef());
  applicationTarget.setInheritsPermissions(false);
  applicationTarget.setPermission("Contributor", "GROUP_CONCORSI");
  if (contributorToUser) {
    applicationTarget.setPermission("Contributor", userId);
  }
  logger.error("application-paste - Fine copia totale domanda");

  // TROVA ELEMENTI DI MAPPING BULKINFO
  children = applicationTarget.getChildren();
  while (i < children.length) {
    child = children[i];
    childType = String(child.getTypeShort());
    // VERIFICA OWNERSHIP  
    if (String(child.getOwner()) !== userId) {
      child.setOwner(userId);
    }
    // TYPE DA CANCELLARE 1) SECONDO MAPPING  2) SE NON SONO PREVISTI PRODOTTI  3) SE NON SONO PREVISTI PRODOTTI SCELTI 4)
    if ((String(jsonMap.bulkInfoMapping.deletingTypes[childType]) === "delete") || ((sezioniDomanda.indexOf("affix_tabElencoProdotti") === -1) && (child.hasAspect("cvpeople:noSelectedProduct"))) || ((sezioniDomanda.indexOf("affix_tabProdottiScelti") === -1) && (child.hasAspect("cvpeople:selectedProduct"))) || ((sezioniDomanda.indexOf("affix_tabCurriculum") === -1) && (childType.indexOf("cvelement:") !== -1))) {


      logger.error(" RIMOSSO: " + child.name + " (TYPE: " + childType + ")");
      child.remove();
      z = z + 1;
    } else {
      // VERIFICA ELEMENTI NON PRESENTI E DA NON COPIARE NEL BANDO  
      //logger.error(" sezioniCurriculum: " + sezioniCurriculum.indexOf("D:" + childType) + " sezioniProdotti: " + sezioniProdotti.indexOf("D:" + childType) + " sezioniAllegati: " + sezioniAllegati.indexOf("D:" + childType) + " type: " + childType);
      if ((((sezioniCurriculum === null) || (sezioniCurriculum.indexOf("D:" + childType)) === -1)) && ((sezioniProdotti === null) || (sezioniProdotti.indexOf("D:" + childType) === -1)) && ((sezioniAllegati === null) || (sezioniAllegati.indexOf("D:" + childType) === -1)) && (!childType.equals("cm:content"))) {
        // VERIFICA ELEMENTI PRESENTI NEL MAPPING  
        childMappingTypeShort = String(jsonMap.bulkInfoMapping.cmisQueryName[childType]);
        if (childMappingTypeShort !== "undefined") {
        //CHANGE TYPE
          childMappingType = utils.longQName(childMappingTypeShort);
          childMappingQname = cnrutils.executeStatic('org.alfresco.service.namespace.QName.createQName', childMappingType);
          nodeService.setType(child.nodeRef, childMappingQname);
        } else {
          logger.error(" RIMOSSO: " + child.name + " (TYPE: " + childType + ")");
          child.remove();
          z = z + 1;
        }
      }
    }
    i = i + 1;
  }
  z = i - z;
  logger.error("application-paste - End - Elementi da copiare: " + i + " -- elementi copiati: " + z + " con permessi per utenza: " + userId);
  model.applicationTargetId = applicationTarget.getNodeRef().toString();
  model.esito = true;
}
main();