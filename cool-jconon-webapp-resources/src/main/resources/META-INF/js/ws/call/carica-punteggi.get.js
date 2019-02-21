define(['jquery', 'header', 'json!common', 'json!cache', 'cnr/cnr.bulkinfo', 'cnr/cnr.search', 'cnr/cnr.url', 'i18n', 'cnr/cnr.ui',
        'cnr/cnr.actionbutton', 'cnr/cnr.jconon', 'handlebars', 'cnr/cnr', 'moment', 'cnr/cnr.application', 'cnr/cnr.criteria',
        'cnr/cnr.ace', 'cnr/cnr.call', 'cnr/cnr.node'], function ($, header, common, cache, BulkInfo, Search, URL, i18n, UI,
        ActionButton, jconon, Handlebars, CNR, moment, Application, Criteria, Ace, Call, Node) {
  "use strict";
  var orderLabel = {
      'Cognome' : 'jconon_application:cognome',
      'Nome' : 'jconon_application:nome',
      'nome': '',
      'data di creazione': ''
    },
    properties = {
        1 : 'jconon_application:punteggio_titoli',
        2 : 'jconon_application:punteggio_scritto',
        3 : 'jconon_application:punteggio_secondo_scritto',
        4 : 'jconon_application:punteggio_colloquio',
        5 : 'jconon_application:punteggio_prova_pratica'
    },
    folderChange,
    bulkInfo,
    callData,
    criteriaFilters = $('#criteria'),
    tableItems = $("#items"),
    theadItems = $("#items").find('thead'),
    tbodyItems = $("#items").find('tbody'),
    headerCall = $('#header-call'),
    rootFolderId,
    search,
    headerTh = [];

  function esitoCall(el, val2) {
    return el['jconon_application:esito_call'] === val2 ? true : false;
  }

  function displayApplication(el, refreshFn, permission) {
    var tr = $('<tr id="' + el['cmis:objectId']+ '">'),
        email = el['jconon_application:email_comunicazioni']||
                el['jconon_application:email']||
                el['jconon_application:email_pec_comunicazioni'];

    tr.append($('<td class="text-info">').off().on('click', function () {
        Application.punteggi(callData, el['cmis:objectId'], ' di ' + el['jconon_application:cognome'] + ' ' + el['jconon_application:nome'], function () {
            filter();
        });
    }));
    tr
        .append($('<td>').text(el['jconon_application:cognome']))
        .append($('<td>').text(el['jconon_application:nome']));

    if (headerTh.indexOf(1) !== -1) {
        tr.append($('<td>').append(
            $('<input data-id="' + properties[1] +'" type="NUMBER" class="input-mini text-right">').val(el[properties[1]])
        ));
    }
    if (headerTh.indexOf(2) !== -1) {
        tr.append($('<td>').append(
            $('<input data-id="' + properties[2] +'" type="NUMBER" class="input-mini text-right">').val(el[properties[2]])
        ));
    }
    if (headerTh.indexOf(3) !== -1) {
        tr.append($('<td>').append(
            $('<input data-id="' + properties[3] +'" type="NUMBER" class="input-mini text-right">').val(el[properties[3]])
        ));
    }
    if (headerTh.indexOf(4) !== -1) {
        tr.append($('<td>').append(
            $('<input data-id="' + properties[4] +'" type="NUMBER" class="input-mini text-right">').val(el[properties[4]])
        ));
    }
    if (headerTh.indexOf(5) !== -1) {
        tr.append($('<td>').append(
            $('<input data-id="' + properties[5] +'" type="NUMBER" class="input-mini text-right">').val(el[properties[5]])
        ));
    }
    tr.append($('<td>').append($('<h4 class="text-right text-success">').text(el['jconon_application:totale_punteggio'])));
    tr.append($('<td>').append(
        $('<input data-id="jconon_application:graduatoria" type="NUMBER" class="input-mini text-right">').val(el['jconon_application:graduatoria'])
    ));
    tr.append($('<td>').append(
        $('<select data-id="jconon_application:esito_call" class="input-mini text-right">')
            .append($('<option>'))
            .append($('<option>').attr('value', 'V').attr('selected', esitoCall(el, 'V')).text('V'))
            .append($('<option>').attr('value', 'I').attr('selected', esitoCall(el, 'I')).text('I'))
            .append($('<option>').attr('value', 'S').attr('selected', esitoCall(el, 'S')).text('S'))
    ));
    tr.append($('<td>').append(
        $('<textarea data-id="jconon_application:punteggio_note" rows="2" class="w-95">').val(el['jconon_application:punteggio_note'])
    ));
    tr.appendTo(tbodyItems);
  }

  URL.Data.node.node({
    data: {
      excludePath : true,
      nodeRef : params.callId
    },
    success: function (data) {
      callData = data;
      rootFolderId = data['cmis:objectId'];
      headerCall.text(data['cmis:name']);
      var trHead = $('<tr>');
      trHead
        .append($('<th>#</th>'))
        .append($('<th>Cognome</th>'))
        .append($('<th>Nome</th>'));
      createHeaderTable(trHead, data, 1);
      createHeaderTable(trHead, data, 2);
      createHeaderTable(trHead, data, 3);
      createHeaderTable(trHead, data, 4);
      createHeaderTable(trHead, data, 5);
      trHead.append($('<th class="text-success"><h4>Totale</h4></th>'));
      orderLabel['Totale Punteggio'] = 'app.jconon_application:totale_punteggio';
      trHead.append($('<th>Graduatoria</th>'));
      orderLabel['Graduatoria'] = 'app.jconon_application:graduatoria';
      gestioneBottoni(data['jconon_call:codice'], data['cmis:objectId']);
      trHead.append($('<th>Esito*</th>'));
      trHead.append($('<th class="w-100">Note</th>'));
      trHead.appendTo(theadItems);
      search = new Search({
        elements: {
          table: tableItems,
          pagination: $("#itemsPagination"),
          orderBy: $("#orderBy"),
          label: $("#emptyResultset"),
          total: $('#total')
        },
        type: "jconon_application:folder app join jconon_application:aspect_punteggi pun on app.cmis:objectId = pun.cmis:objectId",
        orderBy: {
            field: 'jconon_application:graduatoria',
            asc: true
        },
        fields: orderLabel,
        calculateTotalNumItems: true,
        maxItems: 1000,
        display : {
          row : function (el, refreshFn, permission) {
            return displayApplication(el, refreshFn, permission);
          }
        },
        dataSource: function (page, setting, getUrlParams) { 
          var deferred;             
          deferred = URL.Data.search.query({
              queue: setting.disableRequestReplay,
              data: getUrlParams(page)
          });
          return deferred;
        }
      });
      bulkInfo =  new BulkInfo({
        target: criteriaFilters,
        formclass: 'form-horizontal jconon inline-block',
        path: 'F:jconon_application:folder',
        name: 'filter-users',
        callback : {
          afterCreateForm: function (form) {
            form.keypress(function (e) {
              if (e.which == 13) {
                filter();  
                return false;    //<---- Add this line
              }
            });
            $('#resetFilter').on('click', function () {
              criteriaFilters.find('input').val('');
              criteriaFilters.find('textarea').val('');
              criteriaFilters.find('.widget').data('value', '');

              var btns = criteriaFilters.find('.btn-group-vertical .btn');

              btns
                .removeClass('active');

              criteriaFilters
                .find('.btn-group-vertical')
                .find('.default')
                .addClass('active');
              filter();  
            });
            $('#applyFilter').on('click', filter);
            filter();
          }
        }
      });
      bulkInfo.render();
    }    
  });

  function gestioneBottoni(codice, id) {
    $('#calcola').off().on('click', function () {
        UI.confirm(i18n.prop('message.jconon_call_genera_graduatoria', codice), function () {
          var close = UI.progress();
          jconon.Data.call.applications_graduatoria({
            placeholder: {
              "id" : id
            },
            success: function (data) {
              UI.success(i18n.prop('message.jconon_call_genera_graduatoria_success', codice), function () {
                filter();
              });
            },
            complete: close
          });
        });
    });
    $('#esporta').off().on('click', function () {
        var close = UI.progress();
          jconon.Data.call.applications_punteggi({
            type: 'GET',
            data:  {
              callId : id
            },
            success: function (data) {
              var url = URL.template(jconon.URL.call.downloadXLS, {
                objectId: data.objectId,
                fileName: data.fileName,
                exportData: true,
                mimeType: 'application/vnd.ms-excel;charset=UTF-8'
              });
              window.location = url;
            },
            complete: close,
            error: URL.errorFn
        });
    });
    $('#conferma').off().on('click', function () {
        var jsonArray = [];
        tbodyItems.find('tr').each(function(rowIndex, row) {
            var json = {};
            json['cmis:objectId'] = row.id;
            $(row).find('td input, textarea, select').each(function(inputIndex, input) {
                json[$(input).attr('data-id')] = $(input).val();
            });
            jsonArray.push(json);
        });
        var close = UI.progress();
        jconon.Data.application.punteggi({
            type: 'POST',
            data: {
                'callId': rootFolderId,
                'json' : JSON.stringify(jsonArray)
            },
            success: function (data) {
              UI.success('Sono stati correttamente aggiornati ' + data.righe + ' punteggi.', function () {
                filter();
              });
            },
            complete: close,
            error: URL.errorFn
        });
    });

    $('#importa').off().on('click', function () {
        var container = $('<div class="fileupload fileupload-new" data-provides="fileupload"></div>'),
          input = $('<div class="input-append"></div>'),
          btn = $('<span class="btn btn-file btn-primary"></span>'),
          inputFile = $('<input type="file" name="xls"/>');

        btn
          .append('<span class="fileupload-new"><i class="icon-upload"></i> Upload file punteggi</span>')
          .append('<span class="fileupload-exists">Cambia</span>')
          .append(inputFile);

        input
          .append('<div class="uneditable-input input-xlarge"><i class="icon-file fileupload-exists"></i><span class="fileupload-preview"></span></div>')
          .append(btn)
          .appendTo(container);

        // set widget 'value'
        function setValue(value) {
          container.data('value', value);
        }

        setValue(null);
        input.append('<a href="#" class="btn fileupload-exists" data-dismiss="fileupload">Rimuovi</a>');
        inputFile.on('change', function (e) {
          var path = $(e.target).val();
          setValue(path);
        });
      UI.modal('<i class="icon-table animated flash"></i> Importa punteggi', container, function () {
        var fd = new CNR.FormData();
        fd.data.append("objectId", id);
        $.each(inputFile[0].files || [], function (i, file) {
            fd.data.append('xls', file);
        });
        var close = UI.progress();
        $.ajax({
            type: "POST",
            url: cache.baseUrl + "/rest/call/applications-punteggi.xls",
            data:  fd.getData(),
            enctype: 'multipart/form-data',
            processData: false,  // tell jQuery not to process the data
            contentType: false,   // tell jQuery not to set contentType
            dataType: "json",
            success: function(response){
              UI.success('Sono stati importati ' + response.righe + ' punteggi.', function () {
                filter();
              });
            },
            complete: close,
            error: URL.errorFn
        });
      });
    });
  }

  function createHeaderTable(trHead, data, indice) {
    var punteggio = data['jconon_call:punteggio_' +indice],
        punteggio_min = data['jconon_call:punteggio_' + indice +'_min'],
        punteggio_max = data['jconon_call:punteggio_' + indice +'_limite'],
        punteggio_min_label = punteggio_min ? 'Min:'+ punteggio_min : '',
        punteggio_max_label = punteggio_max ? ' Max:'+ punteggio_max : '';
    if (punteggio && punteggio !== 'Vuoto') {
        orderLabel[punteggio] = 'pun.' + properties[indice];
        headerTh.push(indice);
        trHead.append($('<th><div>' + punteggio + '</div><small class="muted">' + punteggio_min_label + punteggio_max_label + '</small></th>'));
    }
  }

  function filter() {
    var criteria = jconon.getCriteria(bulkInfo);
    criteria.and(new Criteria().equals('app.jconon_application:stato_domanda', 'C').build());
    criteria.and(new Criteria().isNull('app.jconon_application:esclusione_rinuncia').build());
    criteria.inTree(rootFolderId, 'app');
    criteria.list(search);
  };
});