/*global execution, people, logger, utils, initiator */
var wfContatori = (function () {
	"use strict";
	// SET PATH CARTELLE CONTATORI
	//var pathCartellaPadre = 'Data Dictionary'
	var debuginfo, errorBlock, pathCartellaPadre, nomeCartellaContatori, nodoRicercato, idGruppoSelezionato, id_workflow, dataInCorso, annoInCorso, nodiCartellaPadre, gruppoScelto, nodoCartellaPadre, local_bpm_package, local_bpm_workflowDueDate, local_bpm_workflowDescription, local_bpm_assignee, local_bpm_groupAssignee;
	debuginfo = false; //variabile per abilitare le log
	errorBlock = true; //variabile per le assert
	pathCartellaPadre = "PATH:\"//sys:system/sys:workflow\"";
	nomeCartellaContatori = 'CONTATORI';

	nodoRicercato = null;
	id_workflow = "ID-GENERICO";
	dataInCorso = new Date();
	annoInCorso = dataInCorso.getFullYear();
	local_bpm_package = execution.getVariable('bpm_package');
	local_bpm_workflowDueDate = execution.getVariable('bpm_workflowDueDate');
	local_bpm_workflowDescription = execution.getVariable('bpm_workflowDescription');
	local_bpm_assignee = execution.getVariable('bpm_assignee');
	local_bpm_groupAssignee = execution.getVariable('bpm_groupAssignee');

	// GET VARIABILI WORKFLOW
	//var nodoCartellaPadre = companyhome.childByNamePath(pathCartellaPadre);
	nodiCartellaPadre = search.luceneSearch(pathCartellaPadre);
	nodoCartellaPadre = nodiCartellaPadre[0];
	idGruppoSelezionato = execution.getVariable('wfcnr_groupName');
	// logger.error("idGruppoSelezionato:" + idGruppoSelezionato);
	gruppoScelto = people.getGroup(idGruppoSelezionato);
	// ----------------- FUNZIONI -----------------
	function assert(condition, message) {
		if (errorBlock && !condition) {
			// logger.error(message || "failed condition: " + condition);
			throw new Error(message || "failed condition: " + condition);
		}
	}

	function leggiContatore(gruppoSelezionato, nodoContatore) {
		var riferimento = 'NESSUNO';
		//// logger.error("############## anno " + nodoContatore.properties.anno + " contatore " + nodoContatore.properties.contatore + " ##############");
		assert(nodoContatore !== null, "wfContatoriStorico.js: verifica nodo contatore");
		if (nodoContatore !== null) {
			riferimento = gruppoSelezionato.properties.authorityName + "-" + nodoContatore.properties.anno + "-" + nodoContatore.properties.contatore;
			//// logger.error("############## contatore: " + riferimento + " ##############");
		}
		return [riferimento, nodoContatore.properties.contatore];
	}

	function inserisciContatore(gruppoSelezionato, annoRiferimento, cartella_Contatori) {
		var destNode = null;
		assert(cartella_Contatori !== null, "wfContatori.js: verifica cartella contatori");
		if (cartella_Contatori !== null) {
			// logger.error("############## wfContatori.js - inizializza -- Inserisco elemento nella cartella Contatori: " + cartella_Contatori.name + " ##############");
			destNode = cartella_Contatori.createNode("CONTATORE_" + gruppoSelezionato.properties.authorityName + "-" + annoRiferimento, "cnrgrp:singleGruopCounter");
			destNode.properties.anno = annoRiferimento;
			destNode.properties.contatore = 1;
			destNode.save();
			gruppoSelezionato.createAssociation(destNode, "cnrgrp:inGruopCounter");
			gruppoSelezionato.addAspect("cnrgrp:countable");
		}
		return (destNode);
	}

	function incrementaContatore(nodoContatore) {
		// logger.error("############## VARIABILI CONTATORE:  -" + nodoContatore.properties.anno + "- nr. " + nodoContatore.properties.contatore + " ##############");
		//metto in check-out
		var nodoAppo = nodoContatore.checkout();
		nodoAppo.properties.contatore = nodoContatore.properties.contatore + 1;
		nodoContatore.properties.contatore = nodoAppo.properties.contatore;
		nodoAppo.save();
		//nodoContatore.save();
		nodoContatore = nodoAppo.checkin();
		// logger.error("############## CONTATORE INCREMENTATO :  -" + nodoContatore.properties.anno + "- nr. " + nodoContatore.properties.contatore + " ##############");
	}

	//-- trovaNodoContatore
	function trovaNodoContatore(gruppoRiferimento, annoRiferimento) {
		var x, i, nodoTrovato, propName, propValue, nomeContatore, assocsNodo;
		x = 0;
		i = 0;
		nodoTrovato = null;
		propName = null;
		propValue = null;
		nomeContatore = "CONTATORE_" + gruppoRiferimento.properties.authorityName + "-" + annoRiferimento;
		// logger.error("############## cerco contatore " + nomeContatore);
		for (propName in gruppoRiferimento.assocs) {
			if (gruppoRiferimento.assocs[propName] !== null) {
				propValue = gruppoRiferimento.assocs[propName];
				assocsNodo = gruppoRiferimento.assocs[propName];
				// logger.error("############## wfContatori.js - inizializza propName: " + utils.shortQName(propName) + " propValue: " + propValue + " ##############");
				for (i = 0; i < assocsNodo.length; i++) {
					if (assocsNodo[i].properties.name === nomeContatore) {
						// logger.error("############## wfContatori.js - inizializza -- CONTATORE TROVATO: " + i + " ############## " + assocsNodo[i].properties.name + " ##############");
						nodoTrovato = assocsNodo[i];
					}
				}
			}
		}
		return (nodoTrovato);
	}

	//VERIFICA L'ESISTENZA DI UNA CARTELLA, SE VUOTA LA CREA SETTANDO I PERMESSI
	function verificaCartella(nodoPadre, nomeRichiesto) {
		var nodoCartella = nodoPadre.childByNamePath(nomeRichiesto);
		if (nodoCartella === null) {
			//nodoCartella = nodoPadre.createFolder(nomeRichiesto);
			nodoCartella = nodoPadre.createNode(nomeRichiesto, "cm:folder", "sys:children");
			nodoCartella.setInheritsPermissions(false);
				// logger.error("############## wfContatori.js - inizializza -- creato cartella: " + nodoCartella.name + " nella cartella " + nodoPadre.name + " ##############");
		}
		return (nodoCartella);
	}

	// ----------------- MAIN -----------------
// ----------------- MAIN -----------------
	function inizializza() {
		var nodoContatori, nodoRicercato, id_workflow, id_workflow_short;
		//VERIFICO / CREO / IMPOSTO PERMESSI CARTELLE
		nodoContatori = verificaCartella(nodoCartellaPadre, nomeCartellaContatori);
		assert(gruppoScelto !== null, "wfContatoriStorico.js: verifica esistenza gruppo");
		//TEST PER NOTIFICA MAIL
		if ((gruppoScelto !== null)) {
			nodoRicercato = trovaNodoContatore(gruppoScelto, annoInCorso);
			// logger.error("############## nodoRicercato: " + nodoRicercato + " gruppoScelto " + gruppoScelto.properties.authorityName + "annoInCorso " + annoInCorso + " ##############");
			if (nodoRicercato !== null) {
				incrementaContatore(nodoRicercato);
			} else {
				nodoRicercato = inserisciContatore(gruppoScelto, annoInCorso, nodoContatori);
			}
			id_workflow = leggiContatore(gruppoScelto, nodoRicercato);
			id_workflow_short = id_workflow[0].substring(6);
			// logger.error("############## wfContatoriStorico.js - inizializza -- workflow id: " + id_workflow_short + " ##############");
			execution.setVariable('wfcnr_wfCounterId', id_workflow_short);
			execution.setVariable('wfcnr_wfCounterIndex', id_workflow[1]);
			execution.setVariable('wfcnr_wfCounterAnno', annoInCorso);
		} else {
			// SET VARIABILI WORKFLOW
			if (idGruppoSelezionato !== null) {
				execution.setVariable('wfcnr_wfCounterId', idGruppoSelezionato + ' INESISTENTE');
				// logger.error("############## gruppo: " + idGruppoSelezionato + " inesistente ##############");
			} else {
				execution.setVariable('wfcnr_wfCounterId', ' INESISTENTE');
				// logger.error("############## gruppo: non inserito  ##############");
			}
		}
	}
	return {
		inizializza : inizializza
	};
}
	());