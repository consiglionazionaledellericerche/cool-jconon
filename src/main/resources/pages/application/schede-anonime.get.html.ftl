<div class="header container">
  <div class="jumbotron">
    <h2>Scheda Sintetica Anonima</h2>
  </div>
</div>
<div class="container">
  <div id="main" class="container-fluid">
    <div class="row-fluid">
      <div class="span12">
        <table class="table table-striped" id="items">
          <thead><tr>
            <th id="filters"></th>
            <th>
              <div id="orderBy" class="btn-group">
                <a class="btn btn-mini dropdown-toggle" data-toggle="dropdown" href="#">
                  ${message('button.order.by')}
                  <span class="caret"></span>
                </a>
                <ul class="dropdown-menu"></ul>
              </div>
              <button type="button" class="btn btn-mini btn-info" id="export" title="Esporta in formato zip"><i class="icon-download-alt"></i></button>
            </th></tr>
          </thead>
        </table>
        <div id="itemsPagination" class="pagination pagination-centered">
          <ul></ul>
        </div>
        <small id="total" class="muted pull-right"></small>
        <p>
          <div id="emptyResultset" class="alert">
            <strong>Non e' presente nessuna scheda anonima!</strong>
          </div>
      </div>
    </div>
  </div>
</div> <!-- /container -->  