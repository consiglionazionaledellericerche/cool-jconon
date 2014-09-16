/*global execution, queryPriority, queryPriorityLow, queryPriorityUp, cmis, logger, cnrutils */
//GET ARGUMENTS
var folderNodeRef = args.folderNodeRef;
var version = args.version;
// SET VARIABLES

// SET VARI
var wf = {
    data: []
  };

function getFolderVersions(nodeRefFolder, folderVersion) {
  "use strict";
  var i, versione, nodo;
  //logger.error("nodeRefFolder " + nodeRefFolder + " folderVersion " + folderVersion);
  nodo = search.findNode(nodeRefFolder);
  if (nodo.isVersioned) {
    logger.error("isVersioned " + nodo.isVersioned);
    logger.error("versionHistory " + nodo.versionHistory.length);
    for (i = 0; i < nodo.versionHistory.length; i++) {
      versione = nodo.versionHistory[i];
      //logger.error("label " + versione.label);
      // OUTPUT
      if (folderVersion) {
        if ((folderVersion.equals('all')) || (folderVersion.equals(versione.label))) {
          wf.data.push({
            label: versione.label,
            node: versione.node,
            nodeRef: versione.node.nodeRef,
            name: versione.node.name,
            lastVersionNodeRef: versione.nodeRef,
            creator: versione.creator,
            type : versione.type,
            dbid: versione.node.properties["{http://www.alfresco.org/model/system/1.0}node-dbid"],
            uuid: versione.node.properties["{http://www.alfresco.org/model/system/1.0}node-uuid"],
            description: versione.node.properties["{http://www.alfresco.org/model/content/1.0}description"],
            modifier: versione.node.properties["{http://www.alfresco.org/model/content/1.0}modifier"],
            versionLabel: versione.node.properties["{http://www.alfresco.org/model/content/1.0}versionLabel"],
            autoVersion: versione.node.properties["{http://www.alfresco.org/model/content/1.0}autoVersion"],
            title: versione.node.properties["{http://www.alfresco.org/model/content/1.0}title"],
            modified: versione.node.properties["{http://www.alfresco.org/model/content/1.0}modified"],
            created: versione.node.properties["{http://www.alfresco.org/model/content/1.0}created"],
            initialVersion: versione.node.properties["{http://www.alfresco.org/model/content/1.0}initialVersion"],
            autoVersionOnUpdateProps: versione.node.properties["{http://www.alfresco.org/model/content/1.0}autoVersionOnUpdateProps"]
          });
        }
      }
    }
  }
}

// MAIN
getFolderVersions(folderNodeRef, version);
model.data = wf;