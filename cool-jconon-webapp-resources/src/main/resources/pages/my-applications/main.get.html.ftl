<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span3">
        <div class="cnr-sidenav">
          <ul class="nav nav-list cnraffix" ></ul>
        </div>
        <br/>
        <div>
          <div id="criteria">
            <div class="text-center">
              <div class="btn-group">
                <button id="applyFilter" type="button" class="btn btn-primary btn-small"><i class="icon-filter icon-white"></i> Filtra</button>
                <button id="resetFilter" class="btn btn-small"><i class="icon-repeat"></i> Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div><!--/span-->
      <div class="list-main-call span9">
        <table class="table table-striped" id="items">
          <caption><h2 class="jumbotron header well">Le mie domande</h2></caption>
          <thead><tr>
            <th>              
            </th>
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
            <strong>Non e' stata presentata nessuna domanda</strong>
          </div>
      </div><!--/span-->
    </div><!--/row-->
  </div>
</div> <!-- /container -->
