<div class="container">
  <div class="container-fluid">
    <div class="row-fluid row-content">
      <div class="span7">
        <p>${message('label.selezione.concorsi')}</p>
        <p><strong>${message('label.selezione.altri')}</strong></p>
        <p>${message('label.candidatiCNR')} <a href="https://utenti.cnr.it">https://utenti.cnr.it</a></p>
      </div>
      <div class="span4">
        <form class="form-signin" action="${url.context}/rest/security/login" method="post">
          <legend>${message('sign.in')}</legend>
          <fieldset>
            <div class="control-group">
              <div class="controls">
                <input type="text" id="username" name="username" placeholder="${message('label.account.userName')}">
              </div>
            </div>
            <div class="control-group">
              <div class="controls">
                <input  type="password" id="password" name="password"  placeholder="${message('label.account.password')}">
              </div>
            </div>
            <button class="btn btn-primary" type="submit">${message('sign.in')}</button>
            <button id="passwordRecovery" class="btn" type="button">${message('password.recovery')}</button>
            <#if args.failure??>
              <label for="password" class="error label label-important">${message('message.incorrect')}</label>
            </#if>
            <input type="hidden" name="redirect" value="${url.context}/<#if args.redirect??>${args.redirect}<#else>home</#if>"/>
            <#if queryString??>
              <input type="hidden" name="queryString" value="${queryString}"/>
            </#if>  
            <input type="hidden" name="failure" value="${url.context}/${page.id}?failure=yes"/>
            <div>
              <small class="muted">${message('label.forgot.password.mail')}</small>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</div> <!-- /container -->