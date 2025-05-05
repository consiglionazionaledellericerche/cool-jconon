<#if call??>
    <input id="callId" type="hidden" value="${call['cmis:objectId']}">
    <div class="container">
        <div class="container-fluid">
          <div class="row-fluid">
            <div class="header jumbotron shadow">
                <h1>${message(call['cmis:objectTypeId'])}</h1>
                <h2>${call['jconon_call:codice']}</h2>
            </div>
            <hr>
            <#if isActive>
                <h3 class="alert alert-success">${message('label.call.active')}</h3>
            <#else>
                <#if isFuture>
                    <h3 class="alert alert-warning shadow">${message('label.call.future')}</h3>
                <#else>
                    <h3 class="alert alert-danger shadow">${message('label.call.expired')}</h3>
                </#if>
            </#if>
            <div class="well shadow">
                <h4 class="text-info">${message('label.jconon_call_descrizione')}</h4>
                <span><#if locale_suffix != 'it' && call['jconon_call:descrizione_en']??>${call['jconon_call:descrizione_en']}<#else>${call['jconon_call:descrizione']}</#if></span>
                <#if call['jconon_call_aspect_ad_smr:descrizione_ad_smr']??>
                    <h4 class="text-info">${message('label.th.jconon_bando_descrizione_ad_smr')}</h4>
                    <span>${call['jconon_call_aspect_ad_smr:descrizione_ad_smr']}</span>
                </#if>
                <#if call['jconon_call:numero_posti']??>
                    <h4 class="text-info">${message('label.jconon_call_numero_posti')}</h4>
                    <span>${call['jconon_call:numero_posti']}</span>
                </#if>
                <#if call['jconon_call:requisiti']??>
                    <h4 class="text-info">${message('label.jconon_call_requisiti')}</h4>
                    <span><#if locale_suffix != 'it' && call['jconon_call:requisiti_en']??>${call['jconon_call:requisiti_en']}<#else>${call['jconon_call:requisiti']}</#if></span>
                </#if>
            </div>
            <div class="well shadow">
                <#if call['jconon_call:profilo']??>
                    <h4 class="text-info">${message('label.jconon_call_profilo')}</h4>
                    <span>${call['jconon_call:profilo']}</span>
                </#if>
                <#if call['jconon_call:struttura_destinataria']??>
                    <h4 class="text-info">${message('label.jconon_call_struttura_destinataria')}</h4>
                    <span><#if locale_suffix != 'it' && call['jconon_call:struttura_destinataria_en']??>${call['jconon_call:struttura_destinataria_en']}<#else>${call['jconon_call:struttura_destinataria']}</#if></span>
                </#if>
                <#if call['jconon_call:sede']??>
                    <h4 class="text-info">${message('label.jconon_call_sede')}</h4>
                    <span><#if locale_suffix != 'it' && call['jconon_call:sede_en']??>${call['jconon_call:sede_en']}<#else>${call['jconon_call:sede']}</#if></span>
                </#if>
                <#if call['jconon_call:data_inizio_invio_domande_index']??>
                    <h4 class="text-info">${message('label.jconon_call_data_inizio_invio_domande')}</h4>
                    <span>${call['jconon_call:data_inizio_invio_domande_index']?datetime.iso?string("dd/MM/yyyy HH:mm:ss")}</span>
                </#if>
                <#if call['jconon_call:data_fine_invio_domande_index']??>
                    <h4 class="text-info">${message('label.jconon_call_data_fine_invio_domande')}</h4>
                    <span>${call['jconon_call:data_fine_invio_domande_index']?datetime.iso?string("dd/MM/yyyy HH:mm:ss")}</span>
                </#if>
            </div>
            <div class="well shadow">
                <h2>${message('actions.attachments')}</h2>
                <hr>
                <ul>
                    <#list attachments as attachment>
                        <li>${attachment.typeLabel} <a href="${contextURL}/rest/content?nodeRef=${attachment['cmis:objectId']}&guest=true">${attachment['cmis:name']}</a></li>
                    </#list>
                </ul>
            </div>
            <#if isMacroCall>
                <div class="well">
                    <h2>${message('actions.detail')}</h2>
                    <hr>
                    <ol>
                        <#list childs as child>
                            <#assign codice = child.getPropertyValue("jconon_call:codice")>
                            <li>
                                <p>
                                    <span>${message('label.jconon_call_codice')}:</span>
                                    <a href="${contextURL}/call-detail?callCode=${codice}">${codice}</a>
                                </p>
                                <#if child.getPropertyValue("jconon_call:sede")??>
                                    <p>
                                        <span>${message('label.jconon_call_sede')}:</span>
                                        <b><#if locale_suffix != 'it' && child.getPropertyValue('jconon_call:sede_en')??>${child.getPropertyValue('jconon_call:sede_en')}<#else>${child.getPropertyValue('jconon_call:sede')}</#if></b>
                                    </p>
                                </#if>
                                <#if child.getPropertyValue("jconon_call_aspect_ad_smr:descrizione_ad_smr")??>
                                    <p>
                                        <span>${message('label.th.jconon_bando_descrizione_ad_smr')}:</span>
                                        <b>${child.getPropertyValue("jconon_call_aspect_ad_smr:descrizione_ad_smr")}</b>
                                    </p>
                                </#if>
                            </li>
                        </#list>
                    </ol>
                </div>
            </#if>
            <#if isActive && !isMacroCall>
                <a class="btn btn-primary btn-block" href="${contextURL}/manage-application?callId=${call['cmis:objectId']}"><h4><i class="icon-edit"></i> ${message('label.button.presenta.domanda')}</h4></a>
            </#if>
            <#if !isActive && canWiewApplications>
                <div class="form-row mt-1">
                    <a class="btn btn-primary span6" href="${contextURL}/applications?cmis:objectId=${call['cmis:objectId']}"><h4><i class="icon-folder-open-alt"></i> ${message('label.button.applications')}</h4></a>
                    <a class="btn btn-info span6" href="#" id="exportApplications"><h4><i class="icon-download"></i> ${message('label.button.exportApplications')}</h4></a>
                </div>
            </#if>
          </div>
        </div>
    </div>
<#else>
    <div class="container">
        <div class="alert alert-error shadow">
            <strong><h1>${message('label.alert.call.notfound')}</h1></strong>
        </div>
    </div>
</#if>
