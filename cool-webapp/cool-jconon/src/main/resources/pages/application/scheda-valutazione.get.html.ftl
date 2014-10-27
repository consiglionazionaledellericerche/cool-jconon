<div class="header container">
  <div class="jumbotron">
    <h2 id="title-scheda"></h2>
  </div>
</div>
<br/>
<div class="container">
  <div id="versions" class="container-fluid">
    <div class="row-fluid">
    <div class="span3">
      <div>
        <p>
          <input class="search search-query input-large" type="text" placeholder="Cerca" />
        </p>
        <p>  
          <div class="btn-group">
            <button class="btn" data-sort="versionLabel">Ordina per...</button>
            <button class="btn dropdown-toggle" data-toggle="dropdown">
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
              <li><a href="#" class="sort" data-sort="versionLabel">Versione</a></li>
              <li><a href="#" class="sort" data-sort="lastModificationDate">Data</a></li>
              <li><a href="#" class="sort" data-sort="lastModifiedBy">Utente</a></li>
              <li><a href="#" class="sort" data-sort="contentStreamLength">Dimensione</a></li>
              <li><a href="#" class="sort" data-sort="scheda_valutazione_commento">Commento</a></li>
            </ul>
          </div>
        </p>  
        <p>
          <button id="upload" type="button" class="btn btn-primary btn-lg">
              <i class="icon-upload"></i> Aggiorna...
          </button>
        </p>
        <p>
          <button id="delete" type="button" class="btn btn-success btn-lg">
              <i class="icon-trash"></i> Cancella
          </button>
        </p>
      </div>  
    </div>
    <div class="span9">
      <table class="table table-striped">
        <tbody class="list"></tbody>
      </table>
    </div>
    </div>
  </div>
</div> <!-- /container -->  