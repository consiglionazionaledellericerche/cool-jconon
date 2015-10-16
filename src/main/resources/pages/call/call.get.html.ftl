<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span3">
      	<div class="cnr-sidenav affix" data-spy="affix">
          <div id="toolbar-call">
        		<div class="btn-group">
    	    		<button id="save" class="btn" type="button" title="${message('button.save')}"><i class="icon-save"></i></button>
    	    		<button id="delete" class="btn" type="button" title="${message('button.delete')}"><i class="icon-trash"></i></button>
    	    		<button id="close" class="btn" type="button" title="${message('button.close')}"><i class="icon-off"></i></button>
    	    		<button id="publish" class="btn" type="button" title="${message('button.publish')}"><i class="icon-eye-open"></i></button>
    	    		<button id="showEnMetadata" class="btn" type="button" data-toggle="button" title="${message('button.show.en')}"><i class="icon-flag"></i></button>
              <button id="copy" class="btn disabled" type="button" data-toggle="button" title="Copia bando"><i class="icon-copy"></i></button>
              <button id="createChild" class="btn disabled" type="button" title="${message('button.create.child')}"><i class="icon-pencil"></i></button>
        		</div>
          </div>
          <div id="gestore"></div>
          <ul id="affix" class="nav nav-list"></ul>
        </div>
      </div><!--/span-->
      <div class="span9" id="field">
      </div>
    </div><!--/row-->
  </div>
</div> <!-- /container -->