/*global cnrutils,search,status,args,_,logger,jsonUtils,model,requestbody */
function main() {
  "use strict";
  var applicationPrintId = search.findNode(args.applicationPrintId),
    name = args.name,
    workingCopy;

  workingCopy = applicationPrintId.checkout();
  workingCopy.name = name;
  model.newNode = workingCopy.checkin("Domanda Confermata", true);
}
main();