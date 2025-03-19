define(['jquery', 'header', 'json!common', 'json!cache', 'cnr/cnr.bulkinfo', 'cnr/cnr.search', 'cnr/cnr.url', 'i18n', 'cnr/cnr.ui',
        'cnr/cnr.actionbutton', 'cnr/cnr.jconon', 'handlebars', 'cnr/cnr', 'moment', 'cnr/cnr.application', 'cnr/cnr.criteria',
        'cnr/cnr.ace', 'cnr/cnr.call', 'cnr/cnr.node'], function ($, header, common, cache, BulkInfo, Search, URL, i18n, UI,
        ActionButton, jconon, Handlebars, CNR, moment, Application, Criteria, Ace, Call, Node) {
  "use strict";
  var orderLabel = {
      'Cognome' : 'app.jconon_application:cognome',
      'Nome' : 'app.jconon_application:nome',
      'nome': '',
      'data di creazione': '',
      'Totale Punteggio': 'app.jconon_application:totale_punteggio',
      'Graduatoria' : 'app.jconon_application:graduatoria'
    },
    properties = {
        1 : 'jconon_application:punteggio_titoli',
        2 : 'jconon_application:punteggio_scritto',
        3 : 'jconon_application:punteggio_secondo_scritto',
        4 : 'jconon_application:punteggio_colloquio',
        5 : 'jconon_application:punteggio_prova_pratica',
        6 : 'jconon_application:punteggio_6',
        7 : 'jconon_application:punteggio_7'
    },
    folderChange,
    bulkInfo,
    callData,
    criteriaFilters = $('#criteria'),
    tableItems = $("#items-punteggi"),
    theadItems = $("#items-punteggi").find('thead'),
    tbodyItems = $("#items-punteggi").find('tbody'),
    headerCall = $('#header-call'),
    rootFolderId,
    search,
    isGraduatoriaPresent,
    headerTh = [];

  function esitoCall(el, val2) {
    return el['jconon_application:esito_call'] === val2 ? true : false;
  }

  function addTh(index, tr, inputType, el) {
      if (headerTh.indexOf(index) !== -1) {
          tr.append($('<td>').append(
              $('<input ' + inputType + ' data-id="' + properties[index] +'" type="TEXT" class="input-xmini float-right text-right">').val(el[properties[index]])
          ));
      }
  }
  function displayApplication(el, refreshFn, permission) {
    var tr = $('<tr id="' + el['cmis:objectId']+ '">'),
        email = el['jconon_application:email_comunicazioni']||
                el['jconon_application:email']||
                el['jconon_application:email_pec_comunicazioni'],
        inputType = isGraduatoriaPresent ? 'readonly' : '',
        esitoReadOnly = isGraduatoriaPresent && el['jconon_application:esito_call'] ? 'readonly' : '';
    if (isGraduatoriaPresent) {
        tr.append($('<td>'));
    } else {
        tr.append($('<td class="text-info">').off().on('click', function () {
            Application.punteggi(callData, el['cmis:objectId'], ' di ' + el['jconon_application:cognome'] + ' ' + el['jconon_application:nome'], function () {
                filter();
            });
        }));
    }
    tr
        .append($('<td>').text(el['jconon_application:cognome'].toUpperCase()))
        .append($('<td>').text(el['jconon_application:nome'].toUpperCase()));
    for (var i = 1; i <= 7; i++) {
        addTh(i, tr, inputType, el);
    }
    tr.append($('<td>').append($('<h4 class="text-right text-success">').text(el['jconon_application:totale_punteggio']||'')));
    tr.append($('<td>').append(
        $('<input ' + inputType + ' data-id="jconon_application:graduatoria" type="NUMBER" class="input-xxmini float-right text-right">').val(el['jconon_application:graduatoria'])
    ));
    tr.append($('<td>').append(
        $('<select ' + esitoReadOnly + ' data-id="jconon_application:esito_call" class="input-xmini text-right">')
            .append($('<option>'))
            .append($('<option>').attr('value', 'V').attr('selected', esitoCall(el, 'V')).text('V'))
            .append($('<option>').attr('value', 'I').attr('selected', esitoCall(el, 'I')).text('I'))
            .append($('<option>').attr('value', 'S').attr('selected', esitoCall(el, 'S')).text('S'))
            .append($('<option>').attr('value', 'R').attr('selected', esitoCall(el, 'R')).text('R'))
    ));
    tr.append($('<td>').append(
        $('<textarea ' + inputType + ' data-id="jconon_application:punteggio_note" rows="1" class="w-95">').val(el['jconon_application:punteggio_note'])
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
      isGraduatoriaPresent = data['jconon_call:graduatoria'];
      if (isGraduatoriaPresent) {
        $('#importa').attr('disabled', 'true');
        $('#calcola').attr('disabled', 'true');
      }
      headerCall.text(data['jconon_call:codice'] + (data['jconon_call:sede'] !== null ? ' - ' + data['jconon_call:sede'] : ''));
      var trHead = $('<tr>');
      trHead
        .append($('<th>#</th>'))
        .append($('<th>Cognome</th>'))
        .append($('<th>Nome</th>'));
      for (var i = 1; i <= 7; i++) {
        createHeaderTable(trHead, data, i);
      }
      trHead.append($('<th class="text-success max-width-small"><h4 class="text-right">Totale</h4></th>'));
      trHead.append($('<th class="max-width-small"><div class="text-right">Grad.</div></th>'));
      gestioneBottoni(data['jconon_call:codice'], data['cmis:objectId']);
      trHead.append($('<th>Esito*</th>'));
      trHead.append($('<th class="w-25">Note</th>'));
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
        orderBy: [{
            field: 'app.jconon_application:graduatoria',
            asc: true
        },{
            field: 'app.jconon_application:cognome',
            asc: true
        },{
            field: 'app.jconon_application:nome',
            asc: true
        }],
        fields: orderLabel,
        fetchCmisObject: false,
        calculateTotalNumItems: false,
        maxItems: 1000,
        display : {
          row : function (el, refreshFn, permission) {
            return displayApplication(el, refreshFn, permission);
          },
          after: function (documents) {
            if (documents.hasMoreItems) {
                UI.alert(i18n.prop('message.jconon_application_punteggi_domande', documents.items.length, documents.totalNumItems));
            }
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
    if ((common.User.admin || Call.isConcorsi()) && callData['jconon_call:graduatoria'] == true) {
        $('#sblocca').off().on('click', function () {
            UI.confirm(i18n.prop('message.jconon_call_sblocca_graduatoria', codice), function () {
              var close = UI.progress();
              jconon.Data.call.main({
                type: 'POST',
                data: {
                    'cmis:objectId' : id,
                    'cmis:objectTypeId' : callData['cmis:objectTypeId'],
                    'jconon_call:codice' : callData['jconon_call:codice'],
                    'jconon_call:graduatoria' : false
                },
                success: function (data) {
                    isGraduatoriaPresent = false;
                    $('#importa').attr('disabled', null).removeClass('disabled');
                    $('#calcola').attr('disabled', null).removeClass('disabled');
                    $('#sblocca').prop('disabled', true);
                    filter();
                    UI.success(i18n['message.operation.performed']);
                },
                complete: close,
                error: URL.errorFn
              });
            });
        });
    } else {
        $('#sblocca').prop('disabled', true);
    }
    if (common.User.admin || Call.isConcorsi()) {
        $('#protocollo').off().on('click', function () {
            UI.confirm(i18n.prop('message.jconon_call_valorizza_protocollo', codice), function () {
              var close = UI.progress();
              jconon.Data.call.aggiornaprotocollodomande({
                type: 'POST',
                data: {
                    'id' : id
                },
                success: function (data) {
                    UI.success(i18n.prop('message.jconon_call_valorizzato_protocollo', data['jconon_protocollo:numero'], data['jconon_protocollo:data']));
                },
                complete: close,
                error: URL.errorFn
              });
            });
        });
    } else {
        $('#protocollo').prop('disabled', true);
    }


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
        var fd = new CNR.FormData(),
            token = $("meta[name='_csrf']").attr("content"),
            header = $("meta[name='_csrf_header']").attr("content");
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
            beforeSend: function (jqXHR) {
              if (token && header) {
                jqXHR.setRequestHeader(header, token);
              }
            },
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
        trHead.append($('<th class="max-width-small" title="' + punteggio + '"><div class="text-truncate">' + punteggio + '</div><small class="muted">' + punteggio_min_label + punteggio_max_label + '</small></th>'));
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