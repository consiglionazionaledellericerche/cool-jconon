=======================================
Configurazione dei Bandi (guida rapida)
=======================================

La pagina di configurazione del bando si compone di 8 sezioni.

Sezione I - Dettagli Bando
--------------------------
In questa sezione si inseriscono i dati obbligatori del Bando, il programma assiste la compilazione ove necessario. 

Per personalizzare la lista dei profili/livelli si deve modificare `il file xml dedicato`_ via webdav.

NB: Prima di procedere alla pubblicazione è necessario inserire il numero e la data della Gazzetta ufficiale in cui avverrà la pubblicazione del Bando.

Sezione II - Impostazioni
-------------------------
In questa sezione si decide:
   * se rendere opzionali alcuni campi della domanda
   * quali sezioni della domanda siano visualizzati, tipicamente: **Dati Anagrafici, Dati Residenza, Reperibilità, Dichiarazioni, Allegati vari**
   * se rendere obbligatoria la stampa e l'inserimento del *Modulo Dichiarazioni Sostitutive* (l'allegato va richiesto nella sezione 3)
   * se rendere obbligatoria la stampa e l'inserimento del *Trattamento Dati Personali* (l'allegato va richiesto nella sezione 3)

.. figure:: images/2-impostazioni.png
   :width: 600

Una volta effettuato il primo salvataggio, compaiono i pulsanti blu, "*Anteprima Domanda*", che permette di testare l'inserimento dei dati e degli allegati e "*Configura etichette*", che sarà trattato nella prossima sezione.

.. figure:: images/2-anteprima.png
   :width: 300 

Sezione III - Dettagli Candidato
--------------------------------
 
Questa sezione permette di scegliere le dichiarazioni che il candidato deve compilare e gli allegati che deve inserire.
Entrambi i campi sono a compilazione assistita e consentono una rapida selezione degli elementi.
E' possibile visualizzare l'anteprima immediata delle dichiarazioni cliccando il tasto a destra del campo.
C'è una nutrita varietà di possibili dichiarazioni, oltre 70, si consiglia di prendere pratica provando ad impostarle e visualizzarle per verificare la rispondenza rispetto al requisito del bando.

.. figure:: images/3-dettagli-candidato.png 
   :width: 600
   
Una volta effettuato il primo salvataggio è possibile personalizzare le etichette ed i contenuti di tutte le dichiarazioni inserite nel bando.
Dato l'alto numero di dichiarazioni disponibili si possono riutilizzare rinominandole e cambiando anche completamente il testo.

Nel caso in cui emerga l'esigenza di creare ex novo una dichiarazione, oppure quando si voglia riassumere in un'unico campo più dichiarazioni, esistono 4 tipologie di Dichiarazioni generiche, completamente personalizzabili:
  * Dichiarazione 1 e 2, contengono un campo Sì/No in cui si può scegliere una delle due opzioni
  * Dichiarazione 3 e 4, contengono un campo Sì/No in cui è obbligatorio selezionare Sì
  
Per effettuare l'operazione si clicca l'icona nella sezione 2. "*Configura etichette*". 

.. figure:: images/2-etichette.png
   :width: 600
   
Una volta selezionata la dichiarazione da personalizzare, a destra si clicca **Modifica etichetta** per scegliere il nome con cui visualizzarla nella configurazione del Bando, mentre si clicca **Dettagli** per configurare i testi che la compongono, ad esempio:

.. figure:: images/2-etichette-dettaglio.png
   :width: 600
     
Ecco la visualizzazione di *Dichiarazione 4* modificata in una domanda:

.. figure:: images/3-dichiarazione4.png
   :width: 800
   
**NB** le dichiarazioni "*godimento dei diritti civili e politici nello Stato di appartenenza o di provenienza*" e "*iscrizione nelle liste elettorali*" sono mutualmente esclusive, dipendono dalla cittadinanza del candidato.

Sezione IV - Punteggi
---------------------
La sezione permette di scegliere quante prove vengono effettuate e quali sono i punteggi minimi e massimi. Una volta stabilite le prove, queste saranno visibili nella pagina **Punteggi** presente nel menu del Bando.

Sezione Responsabili
--------------------
Dopo il primo salvataggio del Bando, sarà possibile selezionare uno o più responsabili del Bando, i quali avranno accesso completo al bando e potranno nominare la Commissione d'esame.

Sezione Commissione
-------------------
Una volta conclusa la pubblicazione del Bando, è possibile indicare la Commissione d'esame. Per includere una persona è sufficiente che questa abbia fatto un login alla piattaforma, anche tramite SPID. Il programma visualizza una marchera d'inserimento del Commissario, con la possibilità di scegliere il suo ruolo. Completata l'operazione, viene inviata una mail di invito.

.. figure:: images/6-commissione.png
   :width: 600
   
Sezione HelpDesk
----------------
Successivamente alla pubblicazione del bando, se è attivo il software di gestione di ticketing **OIL**, sarà possibile indicare uno o più utenti di Jconon per la gestione delle segnalazioni, sia per l'ambito tecnico sia per quello normativo. Gli utenti selezionati, se non sono già presenti in OIL vengono iscritti automaticamente, in questo caso la password di default per accedere la prima volta al portale OIL è *cambiala*.

.. important::
    Non è necessario il salvataggio del bando dopo avere indicato gli esperti.


Sezione Allegati
----------------

La sezione degli allegati comprende l'inserimento un gran numero di possibili documenti, ognuno dei quali corredato di specifici dati di contesto, in alcuni casi obbligatori, come numero e data di protocollazione. 

NB: Ai fini della pubblicazione è obbligatorio l'inserimento del Bando di Concorso in italiano.

La sezione è gestibile in ogni fase del ciclo di vita del Bando. Ad esempio è possibile inserire la tipologia "Atti Concorsuali" dove caricare eventuali documenti oggetto di una richiesta di accesso atti ex art. 241/90. Una volta inserito il documento, è possibile impostare l'accesso privato ed assegnare i permessi al soggetto che ha presentato l'istanza (oppure al legale che lo rappresenta). Anche in questo caso è sufficiente che il soggetto abbia effettuato un login con SPID almeno una volta.

.. figure:: images/9-atti-concorsuali.png
   :width: 800
   
Menù Gestore
------------

Nel Menù principale è presente una voce "Gestore" dove sono presenti gli ultimi 10 bandi creati in ordine cronologico inverso, le voci di dettaglio contengono oltre al codice del bando anche la tipologia della stesso e la data di attivazione, insieme all'informazione se il suddetto bando è stato pubblicato o meno.

La voce di menù una volta attivata riporta alla gestione del bando in modo da poterlo pubblicare o gestire più velocemente.

.. figure:: images/10-menu-gestore.png
   :width: 800

.. _il file xml dedicato: https://github.com/consiglionazionaledellericerche/cool-jconon-template/blob/master/src/main/resources/remote-single-model/Data%20Dictionary/Models/jconon_call_constraint_elenco_profilo_livello.xml
