<div class="row">
  <div class="span5">
  	<form id="filters" class="form-horizontal">

		<div class="control-group">
			<label class="control-label" for="priority">Priorita'</label>
			<div class="controls">
				<div class="btn-group" id="priority" data-toggle="buttons-radio">
					<button type="button" data-priority="1" class="btn btn-mini">media</button>
					<button type="button" data-priority="3" class="btn btn-mini">importante</button>
					<button type="button" data-priority="5" class="btn btn-mini">critico</button>
				</div>
			</div>
		</div>
  		
		<div class="control-group">
			<label class="control-label" for="state">Mostra solo</label>
			<div class="controls">
		  		<div class="btn-group" id="state" data-toggle="buttons-radio">
				  <button type="button" data-state='active' class="btn btn-mini active">attivi</button>
				  <button type="button" data-state='completed' class="btn btn-mini">completati</button>
				</div>
			</div>
		</div>

		<div class="control-group">
			<label class="control-label" for="state">Tipologia</label>
			<div class="controls workflowDefinitionContainer"></div>
		</div>

		<div class="control-group control-group-correlated">
			<label class="control-label" for="dueDateFrom">scadenza dal</label>
			<div class="controls">
				<input type="text" id="dueDateFrom" class="input-small datepicker" />
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="dueDateTo">al</label>
			<div class="controls">
				<input type="text" id="dueDateTo" class="input-small datepicker" />
			</div>
		</div>

		<div class="control-group control-group-correlated">
			<label class="control-label" for="startDateFrom">iniziato dal</label>
			<div class="controls">
				<input type="text" id="startDateFrom" class="input-small datepicker" />
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="startDateTo">al</label>
			<div class="controls">
				<input type="text" id="startDateTo" class="input-small datepicker" />
			</div>
		</div>

		<div class="control-group">
			<div class="controls">
				<button id="applyFilter" class="btn btn-primary"><i class="icon-filter icon-white"></i> Filtra</button>
				<button id="resetFilter" class="btn"><i class="icon-repeat"></i> Reset</button>
			</div>
		</div>

  	</form>
  </div>
  <div class="span7 zebra" id="workflows"></div>
</div>