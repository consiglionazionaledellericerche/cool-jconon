<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span4">
        <h3>${message("page.generic.filters")}</h3>
        <div id="criteria">
          <div class="text-center">
            <div class="btn-group">
              <button id="createDocument" type="button" class="btn btn-primary btn-small hide"><i class="icon-upload icon-white"></i> ${message("page.pta.new")}</button>
              <button id="applyFilter" type="button" class="btn btn-success btn-small"><i class="icon-filter icon-white"></i> ${message("page.generic.applyfilter")}</button>
              <button id="resetFilter" class="btn btn-small"><i class="icon-repeat"></i> ${message("page.generic.reset")}</button>
            </div>
          </div>
        </div>
      </div><!--/span-->
      <div class="span8">
        <h3>${message("page."+page.id + ".detail")}</h3>
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
          <strong>${message("page.pta.nodocument")}</strong>
        </div>
      </div><!--/span-->
    </div><!--/row-->
  </div>
</div> <!-- /container -->