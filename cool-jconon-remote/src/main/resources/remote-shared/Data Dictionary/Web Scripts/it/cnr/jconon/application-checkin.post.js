/*global cnrutils,search,status,args,_,logger,jsonUtils,model,requestbody */
function main() {
  "use strict";
  var applicationPrintId = search.findNode(args.applicationPrintId),
    name = args.name,
    workingCopy,
    newNode;

  workingCopy = applicationPrintId.checkout();
  newNode = workingCopy.checkin("Domanda Confermata", true);
  newNode.name = name;
  newNode.save();
  model.newNode = newNode;
}
main();