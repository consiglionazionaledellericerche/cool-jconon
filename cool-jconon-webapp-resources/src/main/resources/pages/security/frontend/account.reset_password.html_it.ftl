<html>
<body>
<p>Gentile <b>${account.fullName}</b>,
abbiamo ricevuto una richiesta di cambio password per il suo Nome Utente: <b>${account.userName}</b></p>

<p>Se ha effettuato questa richiesta, apra il collegamento seguente e scelga la nuova password:</p>

<p><a href="${url}/reset-password?userid=${account.userName?url('UTF-8')}&pin=${account.pin}">${url}/reset-password?userid=${account.userName?url('UTF-8')}&pin=${account.pin}</a></p>

<p>Il collegamento resta valido finché la password non viene cambiata.</p>

<p>Se non ha richiesto il cambio password, un altro utente avrà probabilmente inoltrato questa richiesta per errore:
ignori questa email e non verrà fatto nessun cambio al suo account.</p>
<hr/>
<p>Questo messaggio e' stato generato da un sistema automatico. Si prega di non rispondere.</p>
</body>
</html>
