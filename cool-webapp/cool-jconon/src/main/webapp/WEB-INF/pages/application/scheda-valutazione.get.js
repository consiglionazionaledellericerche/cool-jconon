var schedavalutazione = cmisSession.getObject(args.nodeRef).getObjectOfLatestVersion(false),
  application = cmisSession.getObject(args.applicationId),
  call = cmisSession.getObject(application.parentId);
model.schedavalutazioneid = schedavalutazione.id;
model.title = "Scheda di valutazione di <b>" +
	application.getPropertyValue('jconon_application:cognome') + " " +
	application.getPropertyValue('jconon_application:nome') + "</b> relativa al bando " +
	"<b>" + call.getPropertyValue('jconon_call:codice') + "</b>";