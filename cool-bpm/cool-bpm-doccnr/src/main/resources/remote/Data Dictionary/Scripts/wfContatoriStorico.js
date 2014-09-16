/*global execution, people, logger, utils, initiator */
var wfContatoriStorico = (function () {
	"use strict";
	// SET PATH CARTELLE CONTATORI E WFSTORICO
	//var pathCartellaPadre = 'Data Dictionary'
	var debuginfo, errorBlock, pathCartellaPadre, nomeCartellaContatori, nomeCartellaStorico, nodoRicercato, idGruppoSelezionato, id_workflow, dataInCorso, annoInCorso, nodiCartellaPadre, gruppoScelto, nodoCartellaPadre, local_bpm_package, local_bpm_workflowDueDate, local_bpm_workflowDescription, local_bpm_assignee, local_bpm_groupAssignee;
	debuginfo = false; //variabile per abilitare le log
	errorBlock = true; //variabile per le assert
	pathCartellaPadre = "PATH:\"//sys:system/sys:workflow\"";
	nomeCartellaContatori = 'CONTATORI';
	nomeCartellaStorico = 'WFSTORICO';

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
	//logger.error( "idGruppoSelezionato:" + idGruppoSelezionato);
	gruppoScelto = people.getGroup(idGruppoSelezionato);
	//SET VARIABILE GLOBALE PER LO STORICO
	execution.setVariable('exPathCartellaPadre', pathCartellaPadre);
	execution.setVariable('exNomeCartellaStorico', nomeCartellaStorico);
	// ----------------- FUNZIONI -----------------
	function assert(condition, message) {
		if (errorBlock && !condition) {
			logger.error(message || "failed condition: " + condition);
			throw new Error(message || "failed condition: " + condition);
		}
	}
	//VERIFICA L'ESISTENZA DI UNA CARTELLA, SE VUOTA LA CREA SETTANDO I PERMESSI
	function verificaCartella(nodoPadre, nomeRichiesto) {
		var nodoCartella = nodoPadre.childByNamePath(nomeRichiesto);
		if (nodoCartella === null) {
			//nodoCartella = nodoPadre.createFolder(nomeRichiesto);
			nodoCartella = nodoPadre.createNode(nomeRichiesto, "cm:folder", "sys:children");
			nodoCartella.setInheritsPermissions(false);
			if (debuginfo) {
				logger.error("############## wfContatoriStorico.js - inizializza -- creato cartella: " + nodoCartella.name + " nella cartella " + nodoPadre.name + " ##############");
			}
		} else {
			if (debuginfo) {
				logger.error("############## wfContatoriStorico.js - inizializza -- cartella " + nodoCartella.name + " presente ##############");
			}
		}
		return (nodoCartella);
	}

	//STAMPA LE PROPERTIES ASSOCIATE DI UN NODO
	function stampaTutteProperties(documentoSelezionato) {
		var propName, i, propValue;
		i = 0;
		for (propName in documentoSelezionato.properties) {
			if (documentoSelezionato.properties[propName] !== null) {
				propValue = documentoSelezionato.properties[propName];
				if (debuginfo) {
					logger.error(" -- prop." + i + " " + utils.shortQName(propName) + ":     " + propValue);
				}
				i = i + 1;
			}
		}
	}

	//STAMPA I PERMESSI ASSOCIATI AD UN NODO CARTELLA
	function stampaPermessi(nodoVerifica) {
		var i, permissions;
		i = 0;
		permissions = nodoVerifica.permissions;
		for (i = 0; i < permissions.length; i++) {
			if (debuginfo) {
				logger.error("############## wfContatoriStorico.js - inizializza -- permesso " + i + ": " + permissions[i] + " ##############");
			}
		}
	}

	function inserisciContatore(gruppoSelezionato, annoRiferimento, cartella_Contatori) {
		var destNode = null;
		assert(cartella_Contatori !== null, "wfContatoriStorico.js: verifica cartella contatori");
		if (cartella_Contatori !== null) {
			if (debuginfo) {
				logger.error("############## wfContatoriStorico.js - inizializza -- Inserisco elemento nella cartella Contatori: " + cartella_Contatori.name + " ##############");
			}
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
		//logger.error("############## VARIABILI CONTATORE:  -" + nodoContatore.properties.anno + "- nr. " + nodoContatore.properties.contatore + " ##############");
		//metto in check-out
		var nodoAppo = nodoContatore.checkout();
		nodoAppo.properties.contatore = nodoContatore.properties.contatore + 1;
		nodoContatore.properties.contatore = nodoAppo.properties.contatore;
		nodoAppo.save();
		//nodoContatore.save();
		nodoContatore = nodoAppo.checkin();
		//logger.error("############## CONTATORE INCREMENTATO :  -" + nodoContatore.properties.anno + "- nr. " + nodoContatore.properties.contatore + " ##############");
	}

	function leggiContatore(gruppoSelezionato, nodoContatore) {
		var riferimento = 'NESSUNO';
		//logger.error("############## anno " + nodoContatore.properties.anno + " contatore " + nodoContatore.properties.contatore + " ##############");
		assert(nodoContatore !== null, "wfContatoriStorico.js: verifica nodo contatore");
		if (nodoContatore !== null) {
			riferimento = gruppoSelezionato.properties.authorityName + "-" + nodoContatore.properties.anno + "-" + nodoContatore.properties.contatore;
			//logger.error("############## contatore: " + riferimento + " ##############");
		}
		return [riferimento, nodoContatore.properties.contatore];
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
		//logger.error("############## cerco contatore " + nomeContatore);
		for (propName in gruppoRiferimento.assocs) {
			if (gruppoRiferimento.assocs[propName] !== null) {
				propValue = gruppoRiferimento.assocs[propName];
				assocsNodo = gruppoRiferimento.assocs[propName];
				//logger.error("############## wfContatoriStorico.js - inizializza propName: " + utils.shortQName(propName) + " propValue: " + propValue + " ##############");
				for (i = 0; i < assocsNodo.length; i++) {
					if (assocsNodo[i].properties.name === nomeContatore) {
						//logger.error("############## wfContatoriStorico.js - inizializza -- CONTATORE TROVATO: " + i + " ##############" + assocsNodo[i].properties.name + " ##############");
						nodoTrovato = assocsNodo[i];
					}
				}
			}
		}
		return (nodoTrovato);
	}

	function esisteContatore(gruppoSelezionato, annoRiferimento) {
		var contatoreEsistente, contatore, riferimento;
		contatoreEsistente = false;
		contatore = trovaNodoContatore(gruppoSelezionato, annoRiferimento);
		if (contatore !== null) {
			contatoreEsistente = true;
			riferimento = gruppoSelezionato.properties.authorityName + "-" + contatore.properties.anno + "-" + contatore.properties.contatore;
			//logger.error("############## contatore: " + riferimento + " ##############");
		}
		return (contatoreEsistente);
	}

	// INSERISCI STORICO WORKFLOW
	function inserisciStorico(nodoRicercato) {
		var id_workflow, id_workflow_short, pathCartellaPadre, nomeCartellaStorico, nodiCartellaPadre, nodoCartellaPadre, nodoCartellaStorico, elementoStorico, idWfInstance, nrWfInstance, nomeGruppo, nomeDisplayGruppo, nomeRichiedente, priorita, idCounter, nameWfDefinition, idWfDefinition;
		id_workflow = leggiContatore(gruppoScelto, nodoRicercato);
		id_workflow_short = id_workflow[0].substring(6);
		if (debuginfo) {
			logger.error("############## wfContatoriStorico.js - inizializza -- workflow id: " + id_workflow_short + " ##############");
		}
		execution.setVariable('wfcnr_wfCounterId', id_workflow_short);
		execution.setVariable('wfcnr_wfCounterIndex', id_workflow[1]);
		execution.setVariable('wfcnr_wfCounterAnno', annoInCorso);

		// CREA FILE STORICO E SET VARIABILI STORICO WORKFLOW
		pathCartellaPadre = execution.getVariable('exPathCartellaPadre');
		nomeCartellaStorico = execution.getVariable('exNomeCartellaStorico');
		nodiCartellaPadre = search.luceneSearch(pathCartellaPadre);
		nodoCartellaPadre = nodiCartellaPadre[0];
		//logger.error("############## wfContatoriStorico.js - inizializza -- nomeCartellaStorico: " + nomeCartellaStorico + " ##############");
		nodoCartellaStorico = nodoCartellaPadre.childByNamePath(nomeCartellaStorico);
		//var nodoCartellaStorico = companyhome.childByNamePath(pathFolderStorico);
		//var elementoStorico = nodoCartellaStorico.createNode("storico-"+local_bpm_package.name, "cnrwfinfo:wfInstanceInfo");
		elementoStorico = nodoCartellaStorico.createNode("storico-" + local_bpm_package.name, "cnrwfinfo:wfInstanceInfo");

		//SETTO I PERMESSI DI LETTURA AGLI APPARTENENTI AL GRUPPO
		elementoStorico.setPermission("Consumer", gruppoScelto.properties.authorityName);
		//stampaPermessi(elementoStorico);


		idWfInstance = execution.getVariable('workflowinstanceid');
		nrWfInstance = execution.getProcessInstance().getId();
		nomeGruppo = gruppoScelto.properties.authorityName;
		nomeDisplayGruppo = gruppoScelto.properties.authorityDisplayName;
		nomeRichiedente = initiator.properties.userName;
		//var nomeAssegnatario = local_bpm_assignee.properties["cm:userName"];
		idCounter = execution.getVariable('wfcnr_wfCounterId');
		nameWfDefinition = execution.getProcessDefinition().getName();
		idWfDefinition = execution.getProcessDefinition().getId();
		//logger.error("############## wfContatoriStorico.js - inizializza -- getName: " + execution.getProcessDefinition().getName() + " ##############");
		//logger.error("############## wfContatoriStorico.js - inizializza -- getId : " + execution.getProcessDefinition().getId() + " ##############");
		//logger.error("############## wfContatoriStorico.js - inizializza -- local_bpm_package: " + local_bpm_package + " ##############");
		priorita = execution.getVariable('bpm_workflowPriority');

		//INSERISCI DATI
		elementoStorico.properties["cnrwfinfo:wfDefinitionName"] = nameWfDefinition;
		elementoStorico.properties["cnrwfinfo:wfInstanceId"] = idWfInstance;
		elementoStorico.properties["cnrwfinfo:wfInstanceNr"] = nrWfInstance;
		elementoStorico.properties["cnrwfinfo:wfCounterId"] = idCounter;
		elementoStorico.properties["cnrwfinfo:wfGroupId"] = nomeGruppo;
		elementoStorico.properties["cnrwfinfo:wfGroupName"] = nomeDisplayGruppo;
		elementoStorico.properties["cnrwfinfo:wfRichiedente"] = nomeRichiedente;
		elementoStorico.properties["cnrwfinfo:wfDescrizione"] = '';
		elementoStorico.properties["cnrwfinfo:wfPriorita"] = priorita;
		elementoStorico.properties["cnrwfinfo:wfStato"] = 'Not Started';
		elementoStorico.properties["cnrwfinfo:wfDataAvvio"] = dataInCorso;
		elementoStorico.properties["cnrwfinfo:wfAnno"] = annoInCorso;
		elementoStorico.properties["cnrwfinfo:wfAttivo"] = true;
		elementoStorico.properties["cnrwfinfo:wfPackageName"] = local_bpm_package.name;
		elementoStorico.properties["cnrwfinfo:wfDefinitionId"] = idWfDefinition;
		elementoStorico.properties["cnrwfinfo:wfDueDate"] = local_bpm_workflowDueDate;
		elementoStorico.save();

	}
// ----------------- MAIN -----------------
	function inizializza() {
		var nodoContatori, nodoStorico, nodoRicercato;

		//VERIFICO / CREO / IMPOSTO PERMESSI CARTELLE
		nodoContatori = verificaCartella(nodoCartellaPadre, nomeCartellaContatori);
		nodoStorico = verificaCartella(nodoCartellaPadre, nomeCartellaStorico);
		assert(gruppoScelto !== null, "wfContatoriStorico.js: verifica esistenza gruppo");
		//TEST PER NOTIFICA MAIL
		if ((gruppoScelto !== null)) {
			nodoRicercato = trovaNodoContatore(gruppoScelto, annoInCorso);
			//logger.error("############## nodoRicercato: " + nodoRicercato + " gruppoScelto " + gruppoScelto.properties['authorityName'] + "annoInCorso " + annoInCorso + " ##############");
			if (nodoRicercato !== null) {
				incrementaContatore(nodoRicercato);
			} else {
				nodoRicercato = inserisciContatore(gruppoScelto, annoInCorso, nodoContatori);
			}
			inserisciStorico(nodoRicercato);
		} else {
			// SET VARIABILI WORKFLOW
			if (idGruppoSelezionato !== null) {
				execution.setVariable('wfcnr_wfCounterId', idGruppoSelezionato + ' INESISTENTE');
				//logger.error("############## gruppo: " + idGruppoSelezionato + " inesistente ##############");
			} else {
				execution.setVariable('wfcnr_wfCounterId', ' INESISTENTE');
				//logger.error("############## gruppo: non inserito  ##############");
			}
		}
	}
	function aggiorna() {
		//AGGIORNA STORICO WORKFLOW
		// SET PATH CARTELLA CONTATORI
		var pathCartellaPadre, nomeCartellaStorico, nodiCartellaPadre, nodoCartellaPadre, nodoCartellaStorico, elementoStorico, nameWfDescription, nameWfComment, idWfInstance, idCounter, priorita, stato, nomeAssegnatario, singoloAssegnatario, gruppoAssegnatario, presente, utenteAssegnatario;
		pathCartellaPadre = execution.getVariable('exPathCartellaPadre');
		nomeCartellaStorico = execution.getVariable('exNomeCartellaStorico');
		nodiCartellaPadre = search.luceneSearch(pathCartellaPadre);
		nodoCartellaPadre = nodiCartellaPadre[0];
		nodoCartellaStorico = nodoCartellaPadre.childByNamePath(nomeCartellaStorico);
		elementoStorico = nodoCartellaStorico.childByNamePath('/storico-' + local_bpm_package.name);
		//logger.error("############## wfContatoriStorico.js - aggiorna -- nomeCartellaStorico "+nomeCartellaStorico + " ##############");
		//logger.error("############## wfContatoriStorico.js - aggiorna -- local_bpm_package.name "+local_bpm_package.name + " ##############");
		//logger.error("############## wfContatoriStorico.js - aggiorna -- nodoCartellaPadre.name "+nodoCartellaPadre.name + " ##############");
		//logger.error("############## wfContatoriStorico.js - aggiorna -- elementoStorico "+elementoStorico.name + " ##############");
		nameWfDescription = local_bpm_workflowDescription;
		nameWfComment = execution.getVariable('bpm_comment');
		idWfInstance = execution.getVariable('workflowinstanceid');
		idCounter = execution.getVariable('wfcnr_wfCounterId');
		priorita = execution.getVariable('bpm_workflowPriority');
		stato = execution.getVariable('bpm_status');
		nomeAssegnatario = null;

		// MAIN
		singoloAssegnatario = execution.getVariable('bpm_assignee');
		gruppoAssegnatario = execution.getVariable('bpm_groupAssignee');
		if (singoloAssegnatario !== null) {
			nomeAssegnatario = local_bpm_assignee.properties["cm:userName"];
		} else {
			if (gruppoAssegnatario !== null) {
				nomeAssegnatario = search.findNode(local_bpm_groupAssignee).properties.authorityDisplayName;
			}
		}
		if (debuginfo) {
			logger.error("############## wfContatoriStorico.js - aggiorna -- nomeAssegnatario " + nomeAssegnatario + " ##############");
		}
		//INSERISCI DATI
		//elementoStorico.properties["cnrwfinfo:wfDefinitionName"] = nameWfDefinition;
		elementoStorico.properties["cnrwfinfo:wfInstanceId"] = idWfInstance;
		//elementoStorico.properties["cnrwfinfo:wfInstanceNr"] = nrWfInstance;
		elementoStorico.properties["cnrwfinfo:wfCounterId"] = idCounter;
		elementoStorico.properties["cnrwfinfo:wfDescrizione"] = nameWfDescription;
		elementoStorico.properties["cnrwfinfo:wfCommento"] = nameWfComment;
		elementoStorico.properties["cnrwfinfo:wfPriorita"] = priorita;
		elementoStorico.properties["cnrwfinfo:wfStato"] = stato;

		//aggiungi assegnatario se differente
		if (nomeAssegnatario !== null) {
			presente = false;
			for (utenteAssegnatario in elementoStorico.properties["cnrwfinfo:wfAssegnatario"]) {
				if (elementoStorico.properties["cnrwfinfo:wfAssegnatario"][utenteAssegnatario] !== null) {
					if (utenteAssegnatario === nomeAssegnatario) {
						presente = true;
					}
				}
			}
			if (presente === false) {
				if (elementoStorico.properties["cnrwfinfo:wfAssegnatario"] === null) {
					elementoStorico.properties["cnrwfinfo:wfAssegnatario"] = nomeAssegnatario;
					//SETTO I PERMESSI DI LETTURA ALL'UTENTE COINVOLTO
					elementoStorico.setPermission("Consumer", nomeAssegnatario);
				} else {
					elementoStorico.properties["cnrwfinfo:wfAssegnatario"].push(nomeAssegnatario);
				}
			}
		}
		//fine aggiungi assegnatario
		elementoStorico.save();
		//stampaTutteProperties(elementoStorico);
	}
	function finalizza() {
		//AGGIORNA STATO  WORKFLOW   STORICO
		var pathCartellaPadre, nomeCartellaStorico, nodiCartellaPadre, nodoCartellaPadre, nodoCartellaStorico, elementoStorico;
		if (debuginfo) {
			logger.error("############## wfContatoriStorico.js - finalizza -- wf terminato - aggiorno: storico-" + local_bpm_package.name + " ##############");
		}
		pathCartellaPadre = execution.getVariable('exPathCartellaPadre');
		nomeCartellaStorico = execution.getVariable('exNomeCartellaStorico');
		nodiCartellaPadre = search.luceneSearch(pathCartellaPadre);
		nodoCartellaPadre = nodiCartellaPadre[0];
		nodoCartellaStorico = nodoCartellaPadre.childByNamePath(nomeCartellaStorico);
		elementoStorico = nodoCartellaStorico.childByNamePath('/storico-' + local_bpm_package.name);
		elementoStorico.properties["cnrwfinfo:wfAttivo"] = false;
		elementoStorico.save();
	}

	return {
		inizializza : inizializza,
		aggiorna : aggiorna,
		finalizza : finalizza
	};
}
	());