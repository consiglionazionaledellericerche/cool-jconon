=================
Selezioni online
=================

Selezioni online permette di gestire l'iter concorsuale di un bando pubblico in tutte le sue fasi, partendo dalla redazione del bando di
concorso alla sua pubblicazione, alla raccolta delle candidature e infine ai lavori della Commissione.

**Struttura**

Il sistema si basa su un repository documentale attraverso lo standard `CMIS <https://en.wikipedia.org/wiki/Content_Management_Interoperability_Services>`_,
ed è organizzato in cartelle e documenti corredate da metadati specifici e da permessi appositi.
Il Bando di concorso è una cartella della base documentale, la quale contiene documenti (Bando di Concorso, Provvedimento
di nomina della Commissione, Atti Concorsuali, ecc...) e cartelle che rappresentano le Candidature che a loro volta contegono documenti(Curriculum, Documento di Riconoscimento, Convocazioni,
Comunicazioni, Esclusioni ecc.).

**Gruppi**

Nel sistema sono presenti vari gruppi di utenti con diverse abilitazioni:

`ADMINISTRATOR`

* Può creare nuovi Bandi di qualsiasi tipologia
* Gestisce tutti i gruppi
* Visualizza e può modificare tutte le candidature
* Gestisce le utenze
* Gestisce i permessi assegnati ai Gruppi

`CONCORSI`

* Può creare nuovi Bandi di qualsiasi tipologia
* Visualizza e può modificare tutti i bandi di Concorso
* Visualizza tutte le candidature anche in stato Provvisorio

`GESTORI`

Esistono tanti gruppi Gestori quante sono le tipologie di Bando presenti.

* Può creare nuovi Bandi della tipologia di cui fa parte
* Gestisce il Gruppo dei Responsabili del Procedimento del Bando creato

`RESPONSABILI BANDO`

Esistono tanti gruppi quanti sono i Bando presenti.

* Visualizza tutte le candidature solo in stato Confermato
* Gestisce il gruppo della Commissione del Bando di cui è RdP
* Crea e inoltra ai candidati Esclusioni/Convocazioni/Comunicazioni


`COMMISSIONE`

Esistono tanti gruppi quanti sono i Bando presenti.

* Visualizza tutte le candidature solo in stato Confermato e dopo la scadenza del Bando
* Assegna i Punteggi relativi alle Candidature


**Registrazione**

É possibile effettuare una :doc:`registrazione<registrazione>` compilando un form dove è obbligatorio indicare un indirizzo EMail al quale verrà inoltrato il link
per l'attivazione dell'account, successivamente è possibile presentare una candidatura per i bandi attivi.

**Presentazione della Candidatura**

Per gli utenti registrati è possibile presentare la propria candidatura, semprechè in possesso dei requisiti presenti
nel bando, la domanda di partecipazione può essere modificata fino ai termini di scadenza del bando, e può essere riaperta
anche dopo la conferma, sempre nei termini previsti. Alla conferma della candidatura verrà rilasciata e inviata via EMail
al candidato ricevuta della presentazione in formato pdf.


**Creazione del Bando di Concorso**

La creazione del bando riservata agli utenti appartenenti ai gruppi, è composta da varie sezioni:

* **Sezione I - Dettagli del Bando** In questa sezione è possibile indicare le informazioni quali Codice, Titolo, Tipo di Selezione, Requisiti, Data Inizio, Scadenza e i dati relativi alla Gazzetta Ufficiale.

* **Sezione II - Impostazioni** In questa sezione è possibile indicare le Sezioni visibili nella domanda, che guideranno il candidato nella compilazione della stessa, le lingue da conoscere e alcune impostazioni relative alla stampa del modulo delle dichirazioni sostitutive e il modulo relativo al trattamento dei dati personali

* **Sezione III - Dettagli Candidato** In questa sezione è possibile indicare la lista delle dichiarazioni che il candidato si troverà a compilare durante la presentazione della candidatura, e la lista degli allegati che il candidato dovrà presentare.

* **Sezione IV - Punteggi** In questa sezione è possibile indicare le etichette e il Minimo e il Massimo delle prove che il candidato dovrà sostenere

* **Sezione Responsabili** In questa sezione è possibile indicare gli utenti che faranno parte del gruppo dei Responsabili del Bando

* **Sezione Commissione** In questa sezione è possibile indicare gli utenti che faranno parte del gruppo dei Commissione del Bando

* **Sezione HelpDesk** In questa sezione è possibile indicare gli utenti che faranno parte degli esperti HelpDesk e che dovranno prendere in carico le segnalazioni aperte dai candidati

* **Sezione Allegati** In questa sezione è possibile caricare gli allegati al Bando di concorso.

.. only:: not html

  .. include:: authors.rst

.. toctree::
   :numbered:
   :maxdepth: -1
   :caption: Indice dei Contenuti

   main
   helpdesk_faq_contacts
   cerca_bandi
   registrazione
   presenta_domanda
   domande
   prodotti_scelti
   commissione
   scheda_anonima_sintetica
   configurazione_bandi
   proroga_bandi
   gestione_comunicazioni