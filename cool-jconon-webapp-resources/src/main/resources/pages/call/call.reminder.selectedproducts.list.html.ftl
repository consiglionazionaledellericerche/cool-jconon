<html>
<body>
<hr/>
<p>${message('mail.reminder.selectedproducts.1')} ${folder.getPropertyValueById("jconon_application:nome")} ${folder.getPropertyValueById("jconon_application:cognome")},</p>
<p>${message('mail.reminder.selectedproducts.list.2')}</p>
<p>${message('mail.reminder.selectedproducts.list.3', call.getPropertyValueById("jconon_call:selected_products_end_date").time?datetime?string("'del giorno' EEEE dd MMMM yyyy 'entro le ore' kk:mm "))}</p>
<p>${message('mail.reminder.selectedproducts.4')}</p>
<p>${message('mail.reminder.selectedproducts.5')}</p>
<p>${message('mail.reminder.selectedproducts.6')}</p>
<hr/>
<p>${message('mail.append.helpdesk.4')}<br>${message('mail.append.helpdesk.5')}</p>
</body>
</html>