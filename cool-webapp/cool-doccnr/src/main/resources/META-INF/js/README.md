I sorgenti javascript sono organizzati in tre cartelle:

cnr
	Componenti riusabili da incapsulare nel namespace "CNR" (e.g. "CNR.Search").
	Non dovrebbero essere dipendenti dalla UI.
	Dovrebbero essere configurabili.
ws
	Codice javascript (client side) da inserire nella "view" dei webscript.
	Il path di un file .js corrisponde al path del webscript (e.g. "ws/home/main.get.js" contiene il codice javascript di "home/main.get.html.ftl").
	
thirdparty
	Componenti javascript realizzati da terze parti.
	Inserire la versione dell'artefatto nei commenti all'inizio del file.
	Rimuovere la versione dell'artefatto dal nome del file.
	Se il componente deve essere modificato conservare il file originale e creare un nuovo file con suffisso "-cnr.js" (e.g. "jquery.jstree.js" -> "jquery.jstree-cnr.js"). Rinominare il file originale aggiungendo un suffisso -original (e.g. "jquery.jstree.js" -> "jquery.jstree-original.js")
	Preferire sempre la versione non compressa/minimizzata/uglified di uno script.
	

=== linee guida ===

le url dei webscript devono essere inserite in CNR.URL, evitare URL hardcoded 