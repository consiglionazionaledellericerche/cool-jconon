================================
Amministrazione e configurazione
================================

Gestione utenti
===============

Nella pagina *Amministrazione* → **Utenti** gli amministratori possono cercare un'utenza per nome, cognome, nome
utente, matricola, codice fiscale o email e, dal risultato, abilitarla o disabilitarla, vederne i gruppi o eliminarla.

La modifica dell'utenza presenta gli stessi campi del profilo personale: nome, cognome, email, nazionalità
(Italiana/Straniera) e, per gli italiani, il codice fiscale oppure, per gli stranieri, sesso, data di nascita e stato
estero.

Le utenze CNR e quelle provenienti da SPID o da altri sistemi di autenticazione hanno i dati anagrafici gestiti
altrove: sia nel profilo personale sia nell'amministrazione i loro dati sono in sola lettura, con l'indicazione di
utilizzare `https://utenti.cnr.it <https://utenti.cnr.it>`_ per le utenze CNR. Lo stesso vale per le utenze provenienti
da altre applicazioni.

Avvisi e FAQ
============

Nella pagina **Avvisi e FAQ** del menu *Amministratore* (ex *Front Office*) gli amministratori gestiscono:

* **Avvisi**: titolo, testo formattato, tipologia di bando (facoltativa), stile (Informazione, Successo, Attenzione,
  Avviso, Errore), data di pubblicazione e di scadenza ed eventualmente l'utente o il gruppo a cui mostrarli. Gli
  avvisi pubblicati e non scaduti sono raggiungibili da tutti con il pulsante **Avvisi** della barra superiore, che ne
  riporta il numero e apre un pannello laterale con titolo, tipologia di bando, data e testo, nel colore dello stile
  scelto;
* **FAQ**: domanda, risposta, tipologia di bando, data di pubblicazione e visibilità; le FAQ visibili compaiono nella
  pagina F.A.Q.

L'elenco si filtra per tipologia di bando, periodo di pubblicazione e, per le FAQ, testo della domanda; ogni elemento
riporta lo stato (in corso, da pubblicare, scaduto oppure visibile/non visibile) e può essere modificato o eliminato.

Comuni e stati esteri
=====================

I comuni italiani e gli stati esteri proposti nei moduli (luogo di nascita, residenza, recapiti, ente di appartenenza,
cittadinanza, stato estero) provengono dai dati ufficiali:

* **comuni**: archivio storico di ANPR, che comprende anche i comuni soppressi con il loro periodo di validità;
* **stati esteri**: elenco ISTAT delle unità territoriali estere.

Per il luogo di nascita sono proposti anche i comuni soppressi, evidenziati con l'anno di soppressione e, se la data di
nascita è già compilata, limitati a quelli esistenti in quella data; per residenza, recapiti, ente di appartenenza e
liste elettorali sono proposti solo i comuni in vigore.

I dati vengono riscaricati automaticamente ogni settimana e conservati nel repository, così da restare disponibili anche
se le fonti non rispondono. Lo stato dell'ultimo aggiornamento è consultabile all'indirizzo
``/openapi/v1/territori/info``; un amministratore può forzare l'aggiornamento con ``POST /openapi/v1/territori/refresh``.

Parametri di configurazione
===========================

Le funzionalità descritte in questo manuale utilizzano, oltre alla configurazione esistente, i seguenti parametri
dell'applicazione (tutti facoltativi):

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Parametro
     - Descrizione
   * - ``frontend.urls``
     - Indirizzi della nuova interfaccia, separati da virgola. Nelle email di attivazione dell'utenza e di recupero password i link puntano all'interfaccia da cui è partita la richiesta, se è tra questi. Se non configurato vale l'interfaccia sullo stesso dominio del backend (o in locale), altrimenti il backend come in precedenza.
   * - ``push.enabled``
     - Attiva le notifiche push (predefinito ``true``).
   * - ``push.vapid.public-key``, ``push.vapid.private-key``
     - Chiavi VAPID per le notifiche push. Se non configurate vengono generate al primo utilizzo e salvate nel repository (cartella ``push-notifications``, accessibile ai soli amministratori).
   * - ``push.vapid.subject``
     - Contatto dell'applicazione per i servizi push (indirizzo ``mailto:`` o ``https://``).
   * - ``territori.comuni.url``
     - Fonte dell'archivio dei comuni (predefinito: archivio storico ANPR).
   * - ``territori.stati.url``
     - Fonte dell'elenco degli stati esteri (predefinito: elenco ISTAT, anche in formato ZIP).
   * - ``territori.cron``
     - Pianificazione dell'aggiornamento di comuni e stati (predefinito: lunedì alle 4:30).
   * - ``territori.aggiornamento.giorni``
     - Giorni dopo i quali i dati vengono riscaricati anche senza la pianificazione (predefinito 7).

Il promemoria push delle domande in bozza viene inviato insieme alle email di sollecito, quindi con la stessa
pianificazione (``timer.cron.notification``) e solo se i solleciti sono attivi (``attiva.mail.solleciti``).
Le notifiche richiedono che l'interfaccia sia pubblicata in HTTPS.
