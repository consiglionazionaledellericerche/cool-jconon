script:{
	var json = jsonUtils.toObject(requestbody.content),
	    nodes = [],
	    node,
	    property = 'jconon_convocazione:stato',
	    firma = json.firma,
	    userName = json.userName,
	    password = json.password,
	    otp = json.otp;	    
		if (json.nodes) {
		  for (i = 0; i < json.nodes.size(); i++) {
		    nodes.push(json.nodes.get(i));
		    node = search.findNode(json.nodes.get(i));
		    node.properties[property] = 'FIRMATO';
		    node.save();
		    node.setInheritsPermissions(true);
		  }
		}	 
		arubaSign.pdfsignatureV2Multiple(userName, password, otp, nodes, 
      		"https://gestdoc.cnr.it/alfresco/d/a/workspace/SpacesStore/d676d0ff-101f-4b01-8743-e54769bcb004/firma-digitale-ArubaSign-icona.png", 
      		300, 50, "ROMA", 1, "Convocazione del candidato", 550, 90, firma);
}