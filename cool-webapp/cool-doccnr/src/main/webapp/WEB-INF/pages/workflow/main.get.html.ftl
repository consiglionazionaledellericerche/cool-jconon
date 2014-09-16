<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span8">
        <h3 id="processTitle"></h3>
        <h4 id="processDescription"></h4>
        <div id="workflowInput"></div> 
      </div>
      <div class="span4">
        <!--<div id="jbpm"></div>-->
      </div>
    </div>
    <div class="row-fluid">
      <div class="span4">
        <div id="collection-tree"></div>
      </div>
      <div class="span8">
        <ul class="breadcrumb explorerItem"></ul>
        <div id="orderBy" class="btn-group">
          <a class="btn btn-mini dropdown-toggle" data-toggle="dropdown" href="#">Order by</a>
          <ul class="dropdown-menu"></ul>
        </div>
        <table class="table table-striped" id="items">
          <thead>
            <tr>
              <th>-</th>
              <th>Documento</th>
            </tr>
          </thead>
        </table>
        <div id="itemsPagination" class="pagination pagination-centered">
        	<ul>
        	</ul>
        </div>
        <span id="emptyResultset" class="label label-info">nessun elemento</span>
      </div><!--/span-->
    </div><!--/row-->
    <div class="row-fluid">
    	<div class="span8">
        <table class="table table-striped" id="selected"></table>
    	</div>
      <div class="span4">
        <button class="btn btn-primary btn-large" id="startWorkflow" href="#">Start workflow</button>
      </div><!--/span-->
    </div><!--/row-->
  </div>
</div><!-- /container -->
