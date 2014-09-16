<html>
<body>
<hr/>
<p>${message('mail.reminder.application.1')} ${folder.getPropertyValueById("jconon_application:nome")} ${folder.getPropertyValueById("jconon_application:cognome")},</p>
<p>${message('mail.reminder.application.2')}</p>
<p>${message('mail.reminder.application.3',call.getPropertyValueById("jconon_call:data_fine_invio_domande").time?datetime?string("dd MMMM yyyy 'ore' kk:mm:ss"))}</p>
<p>${message('mail.reminder.application.4')}</p> 
<p>${message('mail.reminder.application.5')}</p> 
<p>${message('mail.reminder.application.6')}</p> 
<hr/>
<p>${message('mail.append.helpdesk.4')}<br>${message('mail.append.helpdesk.5')}</p>
</body>
</html>