<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span12">

        <h4>Ricerca: <u>${RequestParameters["query"]}</u></h4>
        <h5>Documenti</h5>
        <div id="orderBy" class="btn-group">
          <a class="btn btn-mini dropdown-toggle" data-toggle="dropdown" href="#">
            Order by
            <span class="caret"></span>
          </a>
          <ul class="dropdown-menu"></ul>
        </div>

        <table class="table table-striped" id="items">
          <thead><tr><th>File</th><th>Action</th></tr></thead>
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
