<div class="container">
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
      <button class="btn btn-large btn-primary" type="submit">${message('sign.in')}</button>
      <#if args.failure = "yes">
        <label for="password" class="error label label-important">${message('message.incorrect')}</label>
      <#else>
        <#if context.properties["alfRedirectUrl"]??>
          <input type="hidden" name="success" value="${context.properties["alfRedirectUrl"]}"/>
        </#if>
      </#if>

      <input type="hidden" name="failure" value="${url.context}/${page.id}?failure=yes"/>
      <input type="hidden" name="redirect" value="${url.context}/home"/>

    </fieldset>
  </form>
</div> <!-- /container -->
