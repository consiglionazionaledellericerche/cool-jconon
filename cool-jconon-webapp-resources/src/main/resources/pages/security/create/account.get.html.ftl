<div class="content">
  <div class="span6">
    <#if !context.user.guest>
      <h2>${message('label.edit.profile')}</h2>
    <#else>
        <h2>${message('label.nuova.registrazione')}</h2>
      </#if>
      <div>
      ${message('label.registrazione.nuova.registrazione.requisiti')}
      ${message('label.registrazione.utentecnr')} 
    </div>
      <div>
        <div>
        <div>
          <h4>${message('label.problemi')}</h4>
          <p>${message('label.contatto.tel')}</p>
          <p>${message('label.contatto.e-mail')}</p>
          <p>${message('label.contatto.e-mail.pec')}</p>
            </div>
        </div>
    </div>
  </div>
  <div class="span5">
      <div id="account" class="form-signin">
      <#if !context.user.guest>
          <legend>${message('label.edit.profile')}</legend>
      <#else>
          <legend>${message('label.registrazione')}</legend>
      </#if>
    </div>
  </div>
</div>