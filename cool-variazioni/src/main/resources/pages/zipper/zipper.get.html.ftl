<div class="row">
    <div class="span4">
        <form id="filters" class="form-horizontal">
            <div class="controls">
                <button id="applyFilter" type="button" class="btn btn-primary"><i class="icon-filter icon-white"></i>
                    Filtra
                </button>
                <button id="resetFilter" type="button" class="btn"><i class="icon-repeat"></i> Reset</button>
            </div>
            <br>

        </form>

        <br/>
        <br/>
        <br/>
        <br/>

        <form id="export" class="form-horizontal">
            <div class="control-group control-group-correlated">
                <label class="control-label" for="zipName">Nome file zip</label>

                <div class="controls">
                    <input type="text" id="zipName" class="input-medium"/>
                </div>
            </div>

            <div class="controls">
                <button id="compress" type="button" class="btn btn-success"><i class="icon-save icon-white"></i>
                    Compress
                </button>
            </div>

        </form>
    </div>
    <div class="span8">
        <div id="orderBy" class="btn-group">
            <a class="btn btn-mini btn-success dropdown-toggle" data-toggle="dropdown" href="#">
                Ordina per
                <span class="caret"></span>
            </a>
            <ul class="dropdown-menu"></ul>
        </div>
        <table class="table table-striped" id="items">
            <thead>
            <tr>
                <th>File</th>
                <th>Action</th>
            </tr>
            </thead>
        </table>
        <div id="itemsPagination" class="pagination pagination-centered">
            <ul></ul>
        </div>
        <br/><br/>

        <p><span id="emptyResultset" class="label label-info">nessun elemento</span></p>
    </div>
</div>