/*global execution, companyhome, logger, utils, cnrutils, use, search, arubaSign, actions, bpm_workflowDescription, wfcnr_wfCounterId, bpm_package, bpm_groupAssignee, bpm_workflowDueDate, bpm_workflowPriority */
var wfUtils = (function () {
  "use strict";
  var serverPath = "http://localhost:8080/cool-doccnr";

  function inviaNotifica(destinatario, testo, isWorkflowPooled, groupAssignee) {
    var mail, templateArgs, templateModel;
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
      templateArgs.groupAssignee = groupAssignee;
      templateArgs.comment = execution.getVariable('commentoPrecedente');
      templateModel = [];
      templateModel.args = templateArgs;
      mail.parameters.template_model = templateModel;
      //END USING TEMPLATE
      mail.execute(bpm_package);
    }
  }



  return {
    inviaNotifica : inviaNotifica
  };
}
  ());