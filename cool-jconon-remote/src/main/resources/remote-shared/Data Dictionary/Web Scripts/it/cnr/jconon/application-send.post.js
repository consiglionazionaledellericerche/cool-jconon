/*global cnrutils,search,status,args,_,logger,jsonUtils,model,requestbody */
function main() {
  "use strict";
  var json = jsonUtils.toObject(requestbody.content),
    applicationSource = search.findNode(json.applicationSourceId),
    userId = applicationSource.getProperties()["jconon_application:user"],
    i = 0,
    j = 0,
    child,
    groupCall,
    groupsCall =  [].concat(json.groupsCall),
    userAdmin = json.userAdmin,
    groupRdP = json.groupRdP,
    groupConsumer = json.groupConsumer;

  applicationSource.getProperties()["jconon_application:stato_domanda"] = "C";
  applicationSource.getProperties()["jconon_application:data_domanda"] = new Date();
  applicationSource.getProperties()["jconon_application:fl_dichiarazione_sanzioni_penali"] = false;
  applicationSource.getProperties()["jconon_application:fl_dichiarazione_dati_personali"] = false;
  applicationSource.getProperties()["jconon_application:esclusione_rinuncia"] = null;
  applicationSource.save();
  applicationSource.addAspect("jconon_application:aspect_punteggi");
  while (i < groupsCall.length) {
    groupCall = groupsCall[i];
    applicationSource.setPermission("Contributor", groupCall);
    i = i + 1;
  }
  applicationSource.setPermission("Contributor", groupRdP);
  applicationSource.removePermission("Contributor", userId);
  applicationSource.setPermission("Consumer", userId);
  if(groupConsumer) {
    applicationSource.setPermission("Consumer", groupConsumer);
  }
  for (j = 0; j < applicationSource.children.length; j++) {
    child = applicationSource.children[j];
    if (String(child.getTypeShort()) !==  "jconon_attachment:application" &&
        String(child.getOwner()) !== userAdmin) {
      child.setOwner(userAdmin);
    } else {
        if (String(child.getTypeShort()) == "jconon_pagamenti_diritti_segreteria:attachment") {
            var permissions = child.getPermissions(), k = 0;
            while (k < permissions.length) {
                if (permissions[k].indexOf("Coordinator") != -1) {
                    child.removePermission("Coordinator", userId);
                }
                k++;
            }
        }
    }
  }
  model.esito = true;
}
main();