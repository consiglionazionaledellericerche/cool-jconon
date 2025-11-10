<#function mainPage page>
  <#if page.properties?? && page.properties['main-page']??>
    <#return page.properties['main-page']>
  <#else>
    <#return page.id>
  </#if>
</#function>
<div class="navbar navbar-fixed-top">
  <div class="navbar-inner">
    <div class="container-fluid">
      <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </a>
      <a class="logo logo-${locale_suffix}" href="${url.redirect}"></a>
      <div id="userInfo" class="navbar-form pull-right">
        <a href="#" id="notifications" class="btn btn-danger btn-vmiddle pull-right"><i class="icon-warning-sign animated flash"></i> <span class="counter"></span> ${message('navbar.notice')}</a>
        <#if !context.user.guest>
          <ul class="nav highnav pull-right hidden-important">
            <li class="dropdown page" id="user-panel">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">${context.user.fullName} <b class="caret"></b></a>
              <ul class="dropdown-menu">
                <li class="nav-header">${message('label.menu.user.panel')}</li>
                <li><a href="${url.context}/create-account"><i class="icon-cog"></i> ${message('label.menu.user.settings')}</a></li>
                <li><a href="${url.context}/change-password"><i class="icon-lock"></i> ${message('label.menu.change.password')}</a></li>
                <li class="divider"></li>
                <#if permission.isAuthorizedCMIS("commission-register", "GET", context.user) >
                  <li><a href="${url.context}/commission-register"><i class="icon-briefcase"></i> ${message('label.menu.albo.commissari')}</a></li>
                  <li class="divider"></li>
                </#if>
                <#if activeProfiles?? && activeProfiles?seq_contains("keycloak")>
                  <li><a href="${url.context}/sso/logout"><i class="icon-off"></i> ${message('label.logout')} (${context.user.userName})</a></li>
                <#else>
                  <li><a href="${url.context}/rest/security/logout"><i class="icon-off"></i> ${message('label.logout')} (${context.user.userName})</a></li>
                </#if>
              </ul>
            </li>
          </ul>
        <#else>
          <#if page.id == 'login'>
          <#else>
            <a href="${url.context}/login" class="btn btn-primary btn-vmiddle pull-right"><i class="icon-user"></i> ${message('label.login')}</a>
          </#if>
        </#if>
      </div>
      <button id="applist" class="pull-right" style="display:none; margin-top: 0.5rem; border: none; border-radius: 100%; padding: 0px; background: transparent; color: inherit; height: 40px; justify-content: center; align-items: center; position: relative;">
        <svg aria-hidden="true" data-prefix="fae" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" style="height: 16px;width: 16px;display: block;"><path fill="currentColor" d="M2 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm6 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-8c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2ZM8 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm6 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></svg>
      </button>
      <div class="nav-collapse collapse">
        <a class="btn btn-small btn-lang btn-vmiddle pull-right"></a>
        <ul class="nav highnav hidden-important">
          <#list pages as page>
            <#if !context.user.guest >
              <#assign currentUser = context.user>
            </#if>
            <#if permission.isAuthorizedCMIS(page.id, "GET", currentUser) >
              <#assign submenu = page['format-id']?string?split("/")>
              <li class="page<#if (context.page.id = page.id||mainPage(context.page) = page.id)> active</#if>" <#if (submenu?size > 1)>data-submenu="${submenu[1]}"</#if>>
                <a id="${page.id}" href="${url.context}/${page.id}">${message('page.'+page.id)}</a>
              </li>
            </#if>
          </#list>
          <li class="page hide" id="manage-role-url">
            <a target="_blank">${message('label.manage.role.url')}</a>
          </li>
          <#if !context.user.guest>
            <li class="hide dropdown page" id="commissions">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">Commissioni <b class="caret"></b></a>
              <ul class="dropdown-menu">
                <li class="nav-header"></li>
              </ul>
            </li>
            <li class="hide dropdown page" id="users">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">${message('label.menu.change.user')} <b class="caret"></b></a>
              <ul class="dropdown-menu">
                <li class="nav-header"></li>
              </ul>
            </li>
          </#if>
          <#if !context.user.guest && permission.isAuthorizedCMIS("modelli", "GET", currentUser) && (context.user.immutability?size > 0) >
            <li class="hide dropdown page<#if context.page.id = "modelli" > active</#if>" id="modelli">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">Modelli <b class="caret"></b></a>
              <ul class="dropdown-menu">
                <li class="nav-header"></li>
              </ul>
            </li>
          </#if>
          <#if !context.user.guest>
          <li class="hide dropdown page<#if context.page.id = "manage-call" > active</#if>" id="manage-call">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">${message("link.call.create.min")} <b class="caret"></b></a>
            <ul class="dropdown-menu">
              <li class="nav-header">${message("link.call.create")}</li>
            </ul>
          </li>
          </#if>
          <li class="divider-vertical"></li>
          <li class="liSearch">
            <form id="search" method="GET" action="${url.context}/search-call" class="form-search">
              <div class="input-append">
                <input type="text" name="filters-codice" placeholder="${message('label.freesearch.placeholder')}" class="search-query input-small">
                <button type="submit" class="btn btn-primary"><i class="icon-search"></i> ${message("button.freesearch.find.calls")}</button>
              </div>
            </form>
          </li>
        </ul>
      </div><!--/.nav-collapse -->
    </div>
  </div>
</div><!--/.navbar-fixed-top -->