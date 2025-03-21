<div class="container">
    <div class="alert alert-info">
        <h3 id="header-call" class="text-center"></h3>
    </div>
</div>
<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
        <div id="toolbar-call" class="btn-block ">
            <button id="esporta" class="btn span3"><i class="icon-download animated flash icon-white"></i> Esporta Punteggi</button>
            <button id="esporta_async" class="btn span3"><i class="icon-table animated flash icon-white"></i> Esporta Punteggi Asincrono</button>
            <button id="importa" class="btn span3"><i class="icon-upload animated flash icon-white"></i> Importa Punteggi</button>
            <button id="calcola" class="btn span3"><i class="icon-list animated flash icon-white"></i> Calcola Graduatoria</button>
        </div>
        <div id="toolbar-call" class="btn-block ">
            <button id="sblocca" class="btn btn-danger span6"><i class="icon-time animated flash icon-white"></i> Sblocca Graduatoria</button>
            <button id="protocollo" class="btn btn-info span6"><i class="icon-pencil animated flash icon-white"></i> Valorizza protocollo</button>
        </div>
        <div id="criteria">
            <div class="btn-group">
              <button id="applyFilter" class="btn btn-primary"><i class="icon-filter icon-white"></i> Filtra</button>
              <button id="resetFilter" class="btn"><i class="icon-repeat"></i> Reset</button>
            </div>
            <div id="orderBy" class="btn-group">
                <a class="btn btn-info dropdown-toggle" data-toggle="dropdown" href="#"><i class="icon-signal icon-white"></i> ${message('button.order.by')} <span class="caret"></span></a>
                <ul class="dropdown-menu"></ul>
            </div>
            <button id="conferma" class="btn btn-primary"><i class="icon-save animated flash icon-white"></i> Conferma punteggi</button>
        </div>
    </div><!--/span-->
    <div class="table-punteggi-overflow border">
      <table class="table table-striped table-condensed table-bordered table-hover" id="items-punteggi">
        <thead></thead>
        <tbody></tbody>
      </table>
      <div id="emptyResultset" class="alert">
        <strong>Non e' presente nessuna domanda attiva</strong>
      </div>
    </div>
    <div id="itemsPagination" class="pagination pagination-centered">
      <ul></ul>
    </div>
    <div>
        <span class="alert alert-info d-block mt-1"><strong>*Esito V</strong>->Vincitore <strong>I</strong>->Idoneo <strong>S</strong>->Scorrimento <strong>R</strong>->Rinuncia</span>
    </div>
  </div>
</div> <!-- /container -->