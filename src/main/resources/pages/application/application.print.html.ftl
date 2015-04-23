<html>
<body>
<hr/>
<p>${message('mail.confirm.application.1')} ${folder.getPropertyValue("jconon_application:nome")} ${folder.getPropertyValue("jconon_application:cognome")},</p>
<p>${message('mail.print.application.2',call.getPropertyValue("jconon_call:descrizione"),call.getPropertyValue("jconon_call:sede"))}<br>${message('mail.confirm.application.3', contextURL)}</p> 
<p>${message('mail.confirm.application.5')}</p> 
<p>${message('mail.append.helpdesk.1')} <a href="${contextURL}/helpdesk">${message('mail.append.helpdesk.2')}</a> ${message('mail.append.helpdesk.3')}</p>
<hr/>
<p>${message('mail.append.helpdesk.4')}<br>${message('mail.append.helpdesk.5')}</p>
</body>
</html>