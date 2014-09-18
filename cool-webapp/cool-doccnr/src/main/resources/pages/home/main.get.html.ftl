<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span4">
        <div id="collection-tree"></div>
      </div><!--/span-->
      <div class="span8">
        <h5>Documenti</h5>
        <ul class="breadcrumb breadcrumb-white explorerItem"></ul>
        <button id="createFolder" class="btn btn-mini explorerItem"><i class="icon-folder-open"></i> ${message('button.new.folder')}</button>
        <button id="uploadDocument" class="btn btn-mini explorerItem"><i class="icon-circle-arrow-up"></i> ${message('button.upload.document')}</button>
        <div id="orderBy" class="btn-group">
          <a class="btn btn-mini dropdown-toggle" data-toggle="dropdown" href="#">
            ${message('button.order.by')}
            <span class="caret"></span>
          </a>
          <ul class="dropdown-menu"></ul>
        </div>

        <button id="paste" class="btn btn-mini explorerItem"><i class="icon-paste"></i> ${message('actions.paste')}</button>
       
        <table class="table table-striped" id="items">
          <thead><tr><th>${message('label.document')}</th><th>${message('label.actions')}</th></tr></thead>
        </table>
        <div id="itemsPagination" class="pagination pagination-centered">
          <ul></ul>
        </div>
        <br/><br/>
        <p><span id="emptyResultset" class="label label-info">nessun elemento</span>
      </div><!--/span-->
    </div><!--/row-->
  </div>
</div> <!-- /container -->
