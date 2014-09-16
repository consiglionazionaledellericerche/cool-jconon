/*global execution, people, logger, utils, initiator, bpm_package */
if (bpm_package !== null) {
	var bando = bpm_package.children[0];
	var codiceBando =  bando.properties["jconon_call:codice"];
	var commissioneBando = "COMMISSIONE_BANDO_" + codiceBando;
	logger.error("seleziono gruppo commissione: " + commissioneBando);
	bando.properties["jconon_call:commissione"] = commissioneBando;
	bando.save();

	var parentGroupName = "COMMISSIONI_CONCORSO";
	var parentGroup = people.getGroup("GROUP_" + parentGroupName);
	if (parentGroup) {
		var newGroup = people.getGroup("GROUP_" + commissioneBando);
		if (!newGroup) {
			newGroup = people.createGroup(parentGroup, commissioneBando);
			logger.error("creato Gruppo Commissione " + newGroup + " per il bando: " + codiceBando);
		}
	}
}
