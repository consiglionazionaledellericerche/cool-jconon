<div class="container">
  <div class="header container mb-1">
      <div class="jumbotron shadow">
        <h1 class="text-center">${message('label.h3.call')}</h1>
      </div>
  </div>
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span4 sticky-sidenav">
        <div>
          <div id="criteria">
            <div class="control-group form-horizontal">
              <label class="control-label">&nbsp;</label>
              <div class="controls">
                <div class="btn-group">
                  <button id="applyFilter" type="button" class="btn btn-primary btn-small"><i class="icon-filter icon-white"></i> Filtra</button>
                  <button id="resetFilter" class="btn btn-small"><i class="icon-repeat"></i> Reset</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div><!--/span-->
      <div class="span8">
        <div id="header-table">
            <div id="orderBy" class="btn-group float-right mb-1">
                <a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" href="#">
                  ${message('button.order.by')}
                  <span class="caret"></span>
                </a>
                <ul class="dropdown-menu"></ul>
            </div>
        </div>
        <table class="table table-striped" id="items"></table>
        <div id="itemsPagination" class="pagination pagination-centered">
          <ul></ul>
        </div>
        <small id="total" class="muted pull-right"></small>
        <p>
          <div id="emptyResultset" class="alert" style="display:none">${message('message.no.call')}</div>
        </p>
      </div><!--/span-->
    </div><!--/row-->
  </div>
</div> <!-- /container -->