/*global execution, queryPriority, queryPriorityLow, queryPriorityUp, cmis, logger, cnrutils */
//GET ARGUMENTS
var nodeRef = args.nodeRef;
var signalName = args.signalName;
// SET VARIABLES
var instanceId, executionId;
var segnaleInviato = false;
// SET VARI
var wf = {
    data: []
  };


// restituisce il workflowInstanceId di un nodo implicato in un workflow
function getInstanceId(fileNodeRef) {
  "use strict";
  var signalService, file, packageContains, workflowInstanceId, workflowDefinitionName, workflowDefinitionId, workflowService, i, j, activeWf, activeWfInstanceId;
  activeWfInstanceId = null;
  signalService = cnrutils.getBean("activitiRuntimeService");
  workflowService = cnrutils.getBean("WorkflowService");
  file = search.findNode(fileNodeRef);
  // logger.error(" nome file: " + file.name);
//ciclo tra i packageContains per individuare gli id dei workflow associati
  for (i = 0; i < file.parents.length; i++) {
    packageContains = file.parents[i];
    // logger.error(i + "i nome packageContains: " + packageContains.name);
    workflowInstanceId = packageContains.properties['bpm:workflowInstanceId'];
    workflowDefinitionName = packageContains.properties['bpm:workflowDefinitionName'];
    workflowDefinitionId = packageContains.properties['bpm:workflowDefinitionId'];
    // logger.error(" workflowInstanceId: " + workflowInstanceId);
    activeWf = workflowService.getActiveWorkflows();
//ciclo tra tutti i workflow attivi per individuare quello corrispondente al packageContains
    for (j = 0; j < activeWf.size(); j++) {
      if (activeWf.get(j).id.equals(workflowInstanceId)) {
        // logger.error(j + "j activeWf.id: " + activeWf.get(j).id);
        // logger.error(" OK workflowInstanceId: " + workflowInstanceId);
        // logger.error(" workflowDefinitionName: " + workflowDefinitionName);
        // logger.error(" workflowDefinitionId: " + workflowDefinitionId);
        activeWfInstanceId = workflowInstanceId;
      } // else {
        // logger.error(" NO active workflow instance found for workflowInstanceId: " + workflowInstanceId);
        // }
    }
  }
  return (activeWfInstanceId);
}

// stampa alcune property dei task convolti nel workflow di input
function getTaskInfos(workflowInstanceId) {
  "use strict";
  var signalService, ActiveActivityIds, taskId, i, workflowId;
  workflowId = workflowInstanceId.replace("activiti$", "");
  signalService = cnrutils.getBean("activitiRuntimeService");
  ActiveActivityIds = signalService.getIdentityLinksForProcessInstance(workflowId);
  taskId = ActiveActivityIds;
  //// logger.error(" ActiveActivityIds: " + ActiveActivityIds);
  for (i = 0; i < ActiveActivityIds.size(); i++) {
    logger.error(" taskId: " + ActiveActivityIds.get(i).id);
    logger.error(" userId: " + ActiveActivityIds.get(i).userId);
    logger.error(" processInstanceId: " + ActiveActivityIds.get(i).processInstanceId);
  }
}

// restituisce i pathId di un determinata istanza di workflow
function getPathId(workflowInstanceId) {
  "use strict";
  var workflowService, pathIds, pathId, i;
  workflowService = cnrutils.getBean("WorkflowService");
  pathIds = workflowService.getWorkflowPaths(workflowInstanceId);
  //// logger.error(" pathIds: " + pathIds);
  for (i = 0; i < pathIds.size(); i++) {
    // logger.error(" pathId: " + pathIds.get(i).id);
    pathId = pathIds.get(i).id;
    //// logger.error(" userId: " + pathIds.get(i).userId);
    //// logger.error(" processInstanceId: " + pathIds.get(i).processInstanceId);
  }
  return (pathId);
}

// manda un segnale (signalName) al workflow aventec un determinato pathId
function sendSignal(signalName, pathId) {
  "use strict";
  var signalService, pathIdShort;
  signalService = cnrutils.getBean("activitiRuntimeService");
  pathIdShort = pathId.replace("activiti$", "").toString();
  // logger.error(" mando il segnale: " + signalName + " al pathIdShort: " + pathIdShort);
  try {
    signalService.signalEventReceived(signalName, pathIdShort);
  } catch (err) {
    throw new Error("L'INVIO DEL SEGNALE: " + signalName + " NON E' ANDATO A BUON FINE");
  }
  logger.error(" Segnale inviato: " + signalName + " al workflow con executionId: " + pathIdShort);
  segnaleInviato = true;
}

// MAIN

instanceId = getInstanceId(nodeRef);
if (instanceId) {
  // logger.error(" instanceId: " + instanceId);
  // getTaskInfos(instanceId);
  executionId = getPathId(instanceId);
  if (executionId) {
    // logger.error(" executionId: " + executionId);
    sendSignal(signalName, executionId);
  }
} else {
  logger.error(" NO active workflow instance found for workflowInstanceId: " + instanceId);
}
// OUTPUT
wf.data.push({
	"segnaleInviato" : segnaleInviato
});
model.data = wf;