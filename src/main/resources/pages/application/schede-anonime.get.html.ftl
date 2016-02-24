<div class="header container">
  <div class="jumbotron">
    <h2>Scheda Sintetica Anonima</h2>
  </div>
</div>
<br/>
<div class="container">
  <div id="versions" class="container-fluid">
    <div class="row-fluid">
      <div class="span12">
        <table class="table table-striped" id="items">
          <thead><tr>
            <th></th>
            <th>
              <div id="orderBy" class="btn-group">
                <a class="btn btn-mini dropdown-toggle" data-toggle="dropdown" href="#">
                  ${message('button.order.by')}
                  <span class="caret"></span>
                </a>
                <ul class="dropdown-menu"></ul>
              </div>
            </th></tr>
          </thead>
        </table>
        <div id="itemsPagination" class="pagination pagination-centered">
          <ul></ul>
        </div>
        <small id="total" class="muted pull-right"></small>
        <p>
          <div id="emptyResultset" class="alert">
            <strong>Non e' presente nessun documento</strong>
          </div>
      </div>
    </div>
  </div>
</div> <!-- /container -->  