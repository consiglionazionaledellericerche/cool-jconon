<html>
<body>
<hr/>
<p>${message('mail.reopening.application.1')} ${folder.getPropertyValueById("jconon_application:nome")} ${folder.getPropertyValueById("jconon_application:cognome")},</p>
<p>${message('mail.reopening.application.2', call.getPropertyValue("jconon_call:codice"))}</p>
<p>${message('mail.reopening.application.3', call.getPropertyValue("jconon_call:data_fine_invio_domande").time?datetime?string("dd MMMM yyyy 'ore' kk:mm:ss"))}</p>
<p>${message('mail.reopening.application.4')}</p>
<hr/>
</body>
</html>
