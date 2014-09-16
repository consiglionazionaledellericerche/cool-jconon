<div class="row">
  <div class="span4">
  	<form id="filters" class="form-horizontal">
		<div class="control-group">
			<div class="controls">
				<button id="applyFilter" type="button" class="btn btn-primary"><i class="icon-filter icon-white"></i> Filtra</button>
				<button id="resetFilter" class="btn"><i class="icon-repeat"></i> Reset</button>
			</div>
		</div>
		<div class="control-group">
			<div class="controls">
				<button id="showDiscarded" type="submit" class="btn btn-inverse"><i class="icon-ban-circle icon-white"></i> Visualizza scartati</button>
			</div>
		</div>
  	</form>
  	<div id="collection-tree"></div>
  </div>
  <div class="span8" id="contabili">
        <div id="orderBy" class="btn-group">
          <a class="btn btn-mini btn-success dropdown-toggle" data-toggle="dropdown" href="#">
            Ordina per
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
        <p><span id="emptyResultset" class="label label-info">nessun elemento</span></p>
</div>