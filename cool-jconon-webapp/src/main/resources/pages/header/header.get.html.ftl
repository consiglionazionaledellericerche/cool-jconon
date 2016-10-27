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
      <a class="logo logo-${locale_suffix}" href="${url.context}"></a>
      <div class="nav-collapse collapse">
        <div id="userInfo" class="navbar-form pull-right">
          <a href="#" id="notifications" class="btn btn-danger btn-vmiddle pull-right"><i class="icon-warning-sign animated flash"></i> <span class="counter"></span> ${message('navbar.notice')}</a>
          <#if !context.user.guest>
            <ul class="nav highnav pull-right hidden-important">
              <li class="dropdown page" id="user-panel">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">${context.user.fullName} <b class="caret"></b></a>
                <ul class="dropdown-menu">
                  <li class="nav-header">Pannello utente</li>
                  <li><a href="${url.context}/create-account"><i class="icon-cog"></i> ${message('label.menu.user.settings')}</a></li>
                  <li><a href="${url.context}/change-password"><i class="icon-lock"></i> ${message('label.menu.change.password')}</a></li>
                  <li class="divider"></li>
                  <li><a href="${url.context}/rest/security/logout"><i class="icon-off"></i> ${message('label.logout')}</a></li>
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
            <form id="search" method="POST" action="${url.context}/search-call" class="form-search">
              <div class="input-append">
                <input type="text" name="query" placeholder="${message('label.freesearch.placeholder')}" class="search-query input-small">
                <button type="submit" class="btn btn-primary"><i class="icon-search"></i> ${message("button.freesearch.find.calls")}</button>
              </div>
            </form>
          </li>
        </ul>
      </div><!--/.nav-collapse -->
    </div>
  </div>
</div><!--/.navbar-fixed-top -->