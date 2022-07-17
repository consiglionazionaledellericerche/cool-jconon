<#if call??>
    <div class="container">
        <div class="container-fluid">
          <div class="row-fluid">
            <h1>${message(call['cmis:objectTypeId'])} - ${call['jconon_call:codice']}</h1>
            <hr>
            <#if isActive>
                <h3 class="alert alert-success">${message('label.call.active')}</h3>
            <#else>
                <h3 class="alert alert-danger">${message('label.call.expired')}</h3>
            </#if>
            <div class="well">
                <h4 class="text-info">${message('label.jconon_call_descrizione')}</h4>
                <span>${call['jconon_call:descrizione']}</span>
                <h4 class="text-info">${message('label.jconon_call_numero_posti')}</h4>
                <span>${call['jconon_call:numero_posti']}</span>
                <h4 class="text-info">${message('label.jconon_call_requisiti')}</h4>
                <span>${call['jconon_call:requisiti']}</span>
            </div>
            <div class="well">
                <#if call['jconon_call:profilo']??>
                    <h4 class="text-info">${message('label.jconon_call_profilo')}</h4>
                    <span>${call['jconon_call:profilo']}</span>
                </#if>
                <#if call['jconon_call:struttura_destinataria']??>
                    <h4 class="text-info">${message('label.jconon_call_struttura_destinataria')}</h4>
                    <span>${call['jconon_call:struttura_destinataria']}</span>
                </#if>
                <#if call['jconon_call:sede']??>
                    <h4 class="text-info">${message('label.jconon_call_sede')}</h4>
                    <span>${call['jconon_call:sede']}</span>
                </#if>
                <h4 class="text-info">${message('label.jconon_call_data_inizio_invio_domande')}</h4>
                <span>${call['jconon_call:data_inizio_invio_domande_index']?datetime.iso?string("dd/MM/yyyy HH:mm:ss")}</span>
                <h4 class="text-info">${message('label.jconon_call_data_fine_invio_domande')}</h4>
                <span>${call['jconon_call:data_fine_invio_domande_index']?datetime.iso?string("dd/MM/yyyy HH:mm:ss")}</span>
            </div>
            <div class="well">
                <h2>${message('actions.attachments')}</h2>
                <hr>
                <ul>
                    <#list attachments as attachment>
                        <li><a href="${contextURL}/rest/content?nodeRef=${attachment['cmis:objectId']}&guest=true">${attachment['cmis:name']}</a></li>
                    </#list>
                </ul>
            </div>
            <#if isActive && !isMacroCall>
                <a class="btn btn-primary btn-block" href="${contextURL}/manage-application?callId=${call['cmis:objectId']}"><h4><i class="icon-edit"></i> ${message('label.button.presenta.domanda')}</h4></a>
            </#if>
          </div>
        </div>
    </div>
<#else>
    <div class="container">
        <div class="alert alert-error">
            <strong>${message('label.alert')}</strong>
        </div>
    </div>
</#if>
