script:{
	var json = jsonUtils.toObject(requestbody.content),
	    nodes = [],
	    node,
	    property = json.property,
	    userName = json.userName,
	    password = json.password,
	    description = json.description,
	    otp = json.otp;
		if (json.nodes) {
		  for (i = 0; i < json.nodes.length; i++) {
		  	nodes.push(json.nodes[i]);
		    node = search.findNode(json.nodes[i]);
		    node.properties[property] = 'FIRMATO';
		    node.save();
		    node.setInheritsPermissions(true);
		    if (String(property) === "jconon_esclusione:stato") {
		    	node.parent.properties['jconon_application:esclusione_rinuncia'] = 'N';
		    	node.parent.save();
		    }
		  }
		}
		arubaSign.pdfsignatureV2Multiple(userName, password, otp, nodes, 
      		"https://gestdoc.cnr.it/alfresco/d/a/workspace/SpacesStore/d676d0ff-101f-4b01-8743-e54769bcb004/firma-digitale-ArubaSign-icona.png", 
      		300, 50, "ROMA", 1, description, 550, 90, null);
}