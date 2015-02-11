<div class="header container">
  <div class="jumbotron">
    <h5>
      <div id="call-codice" class="text-right">
        <button class="btn btn-mini"><i class="icon-download-alt"></i> ${message('actions.attachments')}</button>
      </div>
    </h5>
    <h4><div id="application-title"></div></h4>
    <h4><div id="call-desc"></div></h4>
    <h5><div id="appl-rich"></div></h5>
    <h5><div id="call-desc-rid"></div></h5>
    <h5>${message('application.text.dichiarazione.responsabilita')}</h5>
  </div>
</div>

<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span3">
        <div class="cnr-sidenav">
          <div id="toolbar-call" style="display:none">
            <div class="btn-group">
              <button id="save" class="btn" type="button" title="${message('button.save')}"><i class="icon-save"></i></button>
              <button id="delete" class="btn" type="button" title="${message('button.delete')}"><i class="icon-trash"></i></button>
              <button id="send" class="btn" type="button" title="${message('button.send')}"><i class=" icon-share"></i></button>
              <button id="print" class="btn" type="button" title="${message('button.print')}"><i class=" icon-print"></i></button>
              <button id="close" class="btn" type="button" title="${message('button.exit')}"><i class="icon-off"></i></button>
            </div>
          </div>
          <ul class="nav nav-list cnraffix"></ul>
        </div>
      </div><!--/span-->
      <div id="field" class="span9<#if validateAllegatiLinkedEmpty??> error-allegati-empty</#if>" <#if validateAllegatiLinkedEmpty??>data-message="${validateAllegatiLinkedEmpty}"</#if>>
      </div>        
    </div><!--/row-->
  </div>
</div> <!-- /container -->