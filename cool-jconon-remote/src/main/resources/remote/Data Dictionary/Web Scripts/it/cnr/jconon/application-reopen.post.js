/*global cnrutils,search,status,args,_,logger,jsonUtils,model,requestbody */
function main() {
  "use strict";
  var json = jsonUtils.toObject(requestbody.content),
    applicationSource = search.findNode(json.applicationSourceId),
    userId = applicationSource.getProperties()["jconon_application:user"],
    groupRdP = json.groupRdP,
    j = 0,
    child;

  applicationSource.getProperties()["jconon_application:stato_domanda"] = "P";
  applicationSource.getProperties()["jconon_application:data_domanda"] = null;
  applicationSource.getProperties()["jconon_application:esclusione_rinuncia"] = null;
  applicationSource.save();
  applicationSource.removePermission("Contributor", groupRdP);
  applicationSource.removePermission("Consumer", userId);
  applicationSource.setPermission("Contributor", userId);
  for (j = 0; j < applicationSource.children.length; j++) {
    child = applicationSource.children[j];
    if (String(child.getTypeShort()) !==  "jconon_attachment:application" &&
        String(child.getOwner()) !== userId) {
      child.setOwner(userId);
    }
    if (String(child.getTypeShort()) ===  "jconon_esclusione:attachment") {
      child.remove();
    }

  }
  model.esito = true;
}
main();