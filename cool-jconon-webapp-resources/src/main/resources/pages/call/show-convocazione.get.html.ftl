<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span3">
        <h3>Filtri</h3>
        <div id="criteria">
          <div class="text-center control-group">
            <div class="btn-group">
              <button id="applyFilter" type="button" class="btn btn-primary btn-small"><i class="icon-filter icon-white"></i> Filtra</button>
              <button id="resetFilter" class="btn btn-small"><i class="icon-repeat"></i> Reset</button>
            </div>
          </div>
          <div class="control-group">
            <button class="btn btn-block btn-info" type="button" id="firma"><i class="icon-pencil icon-white"></i> Firma convocazioni</button>
          </div>
          <div class="control-group">
            <button class="btn btn-block btn-primary" type="button" id="invia"><i class="icon-inbox icon-white"></i> Invia convocazioni</button>
          </div>          
        </div>
      </div><!--/span-->
      <div class="span9">
        <h3>${message("page."+page.id + ".detail")}</h3>
        <table class="table table-striped" id="items">
          <thead><tr>
            <th></th>
            <th class="span3">
              <div id="orderBy" class="btn-group">
                <a class="btn btn-mini dropdown-toggle" data-toggle="dropdown" href="#">
                  ${message('button.order.by')}
                  <span class="caret"></span>
                </a>
                <ul class="dropdown-menu"></ul>
              </div>
              <button type="button" class="btn btn-mini btn-info" id="export-xls" title="Esporta"><i class="icon-table"></i></button>
            </th></tr>
          </thead>
        </table>
        <div id="itemsPagination" class="pagination pagination-centered">
          <ul></ul>
        </div>
        <small id="total" class="muted pull-right"></small>
        <p>
          <div id="emptyResultset" class="alert">
            <strong>Non e' presente nessuna convocazione</strong>
          </div>
      </div><!--/span-->
    </div><!--/row-->
  </div>
</div> <!-- /container -->