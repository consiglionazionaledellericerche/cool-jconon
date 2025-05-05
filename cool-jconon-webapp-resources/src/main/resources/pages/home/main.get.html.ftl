<div class="header container">
  <div class="jumbotron shadow">
    <h1>${message('label.home.title.h2')}</h1>
    <h3 class="font-monospace">${message('label.home.title.h3')}</h3>
  </div>
</div>


<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span3 sticky-sidenav">
        <div class="cnr-sidenav">
          <ul class="nav nav-list cnraffix" ></ul>
        </div>
        <br/>
        <div>
          <div id="criteria" class="simple">
            <div class="control-group form-horizontal">
            </div>
          </div>
        </div>
      </div><!--/span-->
      <div class="list-main-call span9">
        <table class="table" id="items">
          <thead><tr>
            <th>
              <h3>${message('label.h3.call')}</h3>
            </th>
            <th>
              <div id="orderBy" class="btn-group float-right mb-1">
                  <a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" href="#">
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
        <div id="emptyResultset" class="alert" style="display:none">${message('message.no.call')}</div>
      </div><!--/span-->
    </div><!--/row-->
  </div>
</div> <!-- /container -->
