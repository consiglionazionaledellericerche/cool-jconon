===========
Configurazione dei Bandi (guida rapida)
===========

La pagina di configurazione del bando si compone di 8 sezioni.

Sezione I - Dettagli Bando
----
In questa sezione si inseriscono i dati obbligatori del Bando, il programma assiste la compilazione ove necessario. 

Per personalizzare la lista dei profili/livelli si deve modificare `il file xml dedicato`_ via webdav.

NB: Prima di procedere alla pubblicazione è necessario conoscere il numero e la data di pubblicazione del Bando in Gazzetta ufficiale.

Sezione II - Impostazioni
----
.. figure:: images/2-impostazioni.png
In questa sezione si decide:
   * se rendere opzionali alcuni campi della domanda
   * quali sezioni della domanda siano visualizzati, tipicamente: **Dati Anagrafici, Dati Residenza, Reperibilità, Dichiarazioni, Allegati vari**
   * se rendere obbligatoria la stampa e l'inserimento del *Modulo Dichiarazioni Sostitutive* (l'allegato va richiesto nella sezione 3)
   * se rendere obbligatoria la stampa e l'inserimento del *Trattamento Dati Personali* (l'allegato va richiesto nella sezione 3)


Sezione III - Dettagli Candidato
----
.. figure:: images/3-dettagli-candidato.png 
   :scale: 50%
  
   
Questa sezione permette di scegliere le dichiarazioni che il candidato deve compilare e gli allegati che deve inserire.
Entrambi i campi sono a compilazione assistita da parte del gestore del bando e consentono una rapida selezione dei campi.
E' possibile visualizzare l'anteprima delle dichiarazioni cliccando il tasto a destra del campo.

Una volta effettuato il primo salvataggio è possibile personalizzare sia le etichette, sia i contenuti di tutte le dichiarazioni inserite nel bando.
Si clicca l'icona nella sezione 2 "Configura etichette". 

.. figure:: images/2-etichette.png

Esistono inoltre 4 tipologie di Dichiarazioni generiche, completamente personalizzabili
  * Dichiarazione 1 e 2, contengono un campo Sì/No in cui si può scegliere una delle due opzioni
  * Dichiarazione 3 e 4, contengono un campo Sì/No in cui è obbligatorio selezionare Sì
  
Ecco un esempio di *Dichiarazione 4* modificata:

.. figure:: images/3-dichiarazione4.png

Sezione IV - Punteggi
----
La sezione permette di scegliere quante prove vengono effettuate e quali sono i punteggi minimi e massimi. Una volta stabilite le prove, queste saranno visibili nella pagina **Punteggi** presente nel menu del Bando.

Sezione Responsabili
----
Dopo il primo salvataggio del Bando, sarà possibile selezionare il responsabile del procedimento, il quale avrà accesso completo al bando



Sezione Commissione
----
Una volta conclusa la pubblicazione del Bando, è possibile indicare la Commissione d'esame. Per includere una persona è sufficiente che questa abbia fatto un login alla piattaforma, anche tramite SPID. Il programma provvede a generare

Sezione HelpDesk
----
Successivamente alla pubblicazione del bando, se è attivo il software di gestione di ticketing **OIL**, sarà possibile indicare uno o più utenti di Jconon per la gestione delle segnalazioni, sia per l'ambito tecnico sia per quello normativo. La password di accesso di default è *cambiala*.

Sezione Allegati
----

.. _il file xml dedicato: https://github.com/consiglionazionaledellericerche/cool-jconon-template/blob/master/src/main/resources/remote-single-model/Data%20Dictionary/Models/jconon_call_constraint_elenco_profilo_livello.xml
