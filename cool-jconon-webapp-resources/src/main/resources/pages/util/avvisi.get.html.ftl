<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span4">
        <h3>Filtri</h3>
        <div id="criteria">
          <div class="text-center control-group">
            <div class="btn-group">
              <button id="applyFilter" type="button" class="btn btn-primary btn-small"><i class="icon-filter icon-white"></i> Filtra</button>
              <button id="resetFilter" class="btn btn-small"><i class="icon-repeat"></i> Reset</button>
            </div>
          </div>
        </div>
      </div><!--/span-->
      <div class="span8">
        <h3>${message("page."+page.id)}</h3>
          <div id="orderBy" class="btn-group pull-right">
            <a class="btn btn-mini dropdown-toggle" data-toggle="dropdown" href="#">
              ${message('button.order.by')}
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu"></ul>
          </div>
        <table class="table table-striped" id="items">
          <thead>
            <tr><th></th></tr>
          </thead>
        </table>
        <div id="itemsPagination" class="pagination pagination-centered">
          <ul></ul>
        </div>
        <small id="total" class="muted pull-right"></small>
        <p>
          <div id="emptyResultset" class="alert">
            <strong>Non e' presente nessun avviso</strong>
          </div>
      </div><!--/span-->
    </div><!--/row-->
  </div>
</div> <!-- /container -->