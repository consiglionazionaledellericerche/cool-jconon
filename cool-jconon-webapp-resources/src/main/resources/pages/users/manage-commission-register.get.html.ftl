<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span3 sticky-sidenav">
          <div id="criteria">
            <div class="text-center">
              <div class="btn-group">
                <button id="applyFilter" type="button" class="btn btn-primary btn-small"><i class="icon-filter icon-white"></i> ${message("page.generic.applyfilter")}</button>
                <button id="resetFilter" class="btn btn-small"><i class="icon-repeat"></i> ${message("page.generic.reset")}</button>
              </div>
            </div>
          </div>
      </div><!--/span-->
      <div class="list-main-call span9">
        <div id="header-table">
          <div class="alert alert-info">
            <h1 class="text-center">${message("page.manage-commission-register")}</h1>
          </div>
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
          <div id="emptyResultset" class="alert">
          <strong>${message("page.my-manage-commission-register.nousers")}</strong>
          </div>
      </div><!--/span-->
    </div><!--/row-->
  </div>
</div> <!-- /container -->
