<div class="container">
    <div class="alert alert-info">
        <h1 id="header-call" class="text-center">Sessioni d'esame relative alle convocazioni inviate</h1>
    </div>
</div>
<div class="container">
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span6">
        <select id="exams" class="w-100"></select>
      </div>
      <div class="span2">
        <button id="esporta" class="btn btn-block"><i class="icon-table animated flash icon-white"></i> Esporta </button>
      </div>
      <div class="span4">
        <button id="esportaMoodle" class="btn btn-success btn-block"><i class="icon-table animated flash icon-white"></i> Esporta per Moodle</button>
      </div>
    </div>
    <div class="table-punteggi-overflow border mt-1">
      <table class="table table-striped table-condensed table-bordered table-hover" id="tabella">
        <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Codice Fiscale</th>
              <th>Data di Nascita</th>
              <th>Tipo Documento</th>
              <th>Numero</th>
              <th>Scadenza</th>
              <th>Rilasciato da</th>
              <th>Identificativo</th>
            </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div id="emptyResultset" class="alert">
        <strong>Non e' presente nessuna sessione di esame</strong>
      </div>
    </div>
  </div>
</div> <!-- /container -->