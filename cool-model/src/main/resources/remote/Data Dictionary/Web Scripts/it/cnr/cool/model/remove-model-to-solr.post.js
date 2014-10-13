/*global cnrutils,requestbody,model,jsonUtils,logger */
/*jslint evil:true*/
var nameSpacePrefix, jsonInput = jsonUtils.toObject(requestbody.content);

model.status = "ok";

try {
	nameSpacePrefix = cnrutils.executeStatic('org.alfresco.service.namespace.QName.createQName', "{http://www.cnr.it/model/" + jsonInput.nameSpacePrefix + "}model");
	cnrutils.getBean("dictionaryDAO").removeModel(nameSpacePrefix);
	logger.log("Rimozione dal Dictionary Dao del modello " + jsonInput.nameSpacePrefix);
} catch (err) {
	model.status = "ko";
	model.error = err.toString();
}