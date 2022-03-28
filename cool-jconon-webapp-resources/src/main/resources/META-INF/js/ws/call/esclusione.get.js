define(['jquery', 'header', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.jconon', 'json!common', 'cnr/cnr.ui', 'i18n', 'json!cache', 'cnr/cnr.call', 'cnr/cnr.search', 'cnr/cnr.ui.widgets', 'cnr/cnr.ui.wysiwyg-placeholder'], function($, header, BulkInfo, CNR, URL, jconon, common, UI, i18n, cache, Call, Search, Widgets, Wysiwyg) {
  "use strict";

  var bulkinfo,
    callMetadata,
    query,
    nameForm = 'default',
    esclusione = $('#esclusione'),  
    intestazione = $('#intestazione'),
    esclusioneDetail = $('<div id="esclusione-detail"></div>'),
    btnSend = $('<div class="control-group"><button id="send" name="send" class="btn btn-primary btn-large esclusioniType_GENERA esclusioniType_GENERA_SENZA_ARTICOLO">' + i18n['button.crea.esclusioni'] +
      ' <i class="ui-button-icon-secondary ui-icon icon-file" ></i></button></div>').off('click').on('click', function () {
        if (bulkinfo.validate()) {
          var close = UI.progress(), d = new FormData(document.getElementById("esclusioneBulkInfo")),
            applicationIds = bulkinfo.getDataValueById('application'),
            token = $("meta[name='_csrf']").attr("content"),
            header = $("meta[name='_csrf_header']").attr("content");
          d.append('callId', params.callId);
          d.append('query', query);
          $.each(bulkinfo.getData(), function (index, el) {
            if (el.name !== 'application') {
                d.append(el.name, el.value);
            }
          });
          $.ajax({
              type: "POST",
              url: cache.baseUrl + "/rest/call/esclusioni",
              data:  d,
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
                  UI.info("Sono state generate " + response.numEsclusioni + " esclusioni.", function () {
                       if (applicationIds == undefined) {
                         window.location = jconon.URL.call.esclusione.visualizza + '?callId=' + params.callId;
                       } else {
                         $('#application').val(-1).trigger("change");
                       }
                  });
              },
              complete: close,
              error: URL.errorFn
          });
        }
      }),
    btnUpload = $('<div class="control-group"><button id="upload" name="upload" class="btn btn-success btn-large esclusioniType_UPLOAD">' + i18n['button.upload.esclusione'] +
      ' <i class="ui-button-icon-secondary ui-icon icon-upload" ></i></button></div>').off('click').on('click', function () {
        if (bulkinfo.validate()) {
          var close = UI.progress(), d = new FormData(document.getElementById("esclusioneBulkInfo")),
            applicationIds = bulkinfo.getDataValueById('application'),
            token = $("meta[name='_csrf']").attr("content"),
            header = $("meta[name='_csrf_header']").attr("content");
          d.append('callId', params.callId);
          d.append('query', query);
          $.each(bulkinfo.getData(), function (index, el) {
            if (el.name !== 'application') {
                d.append(el.name, el.value);
            }
          });
          $.ajax({
            type: "POST",
            url: cache.baseUrl + "/rest/call/esclusioni-firmate",
            data:  d,
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
                UI.info("Sono state generate " + response.numEsclusioni + " esclusioni.", function () {
                     if (applicationIds == undefined) {
                       window.location = jconon.URL.call.esclusione.visualizza + '?callId=' + params.callId;
                     } else {
                       $('#application').val(-1).trigger("change");
                     }
                });
            },
            complete: close,
            error: URL.errorFn
          });
        }
      }),
      buttonGroup = $('<div class="btn-group">').append(btnSend).append(btnUpload);

  function onChangeFilter(data) {
    loadApplication(data);
  }

  function manangeClickFilter() {
    $('#applicationFilter > button.btn').on("click", function () {
      filter(undefined, $(this).attr('data-value'));
    });
  }

  function manangeSelezioneFilter() {
    $('#tipoSelezione > button.btn').on("click", function () {
      filter($(this).attr('data-value'));
    });
  }

  function filter(pTipoSelezione, pApplicationFilter) {
    var valore = pTipoSelezione || $('#tipoSelezione > button.btn.active').attr('data-value'),
          data = pApplicationFilter || $('#applicationFilter > button.btn.active').attr('data-value'),
          totalePunteggi = $('#filterTotalePunteggi').val(), filtro = '';
    if (valore == 'jconon_call:punteggio_1') {
      filtro = ' and punt.jconon_application:fl_punteggio_titoli = true ';
    } else if (valore == 'jconon_call:punteggio_2') {
      filtro = ' and punt.jconon_application:fl_punteggio_scritto = true ';
    } else if (valore == 'jconon_call:punteggio_3') {
      filtro = ' and punt.jconon_application:fl_punteggio_secondo_scritto = true ';
    } else if (valore == 'jconon_call:punteggio_4') {
      filtro = ' and punt.jconon_application:fl_punteggio_colloquio = true ';
    } else if (valore == 'jconon_call:punteggio_5') {
      filtro = ' and punt.jconon_application:fl_punteggio_prova_pratica = true ';
    } else if (valore == 'jconon_call:punteggio_6') {
      filtro = ' and punt.jconon_application:fl_punteggio_6 = true ';
    }
    if (totalePunteggi) {
      filtro += ' and app.jconon_application:totale_punteggio < ' + totalePunteggi;
    }
    loadApplication(data, filtro);
  }

  function manangeTotalePunteggiFilter() {
    $('#filterTotalePunteggi').off().on("change", function () {
      filter();
    });
  }

  Widgets['ui.wysiwyg-placeholder'] = Wysiwyg;
  CKEDITOR.on('dialogDefinition', function(event) {
      if ('placeholder' == event.data.name) {
        var input = event.data.definition.getContents('info').get('name'),
          array = cache.jsonlistCallFields.concat(cache.jsonlistApplicationFieldsNotRequired);
        array.sort(function(a, b){
          var textA = (a.group + a.defaultLabel).toUpperCase();
          var textB = (b.group + b.defaultLabel).toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        input.type = 'select';
        input.items = [];
        $.each(array, function (index, el) {
            input.items.push([el.group + ': ' + el.defaultLabel, el.key]);
        });
      }
  });
  function bulkinfoFunction() {
    var callTipoSelezione = [
        {
            key: 'jconon_call:punteggio_1',
            defaultLabel: callMetadata['jconon_call:punteggio_1']
        },
        {
            key: 'jconon_call:punteggio_2',
            defaultLabel: callMetadata['jconon_call:punteggio_2']
        },
        {
            key: 'jconon_call:punteggio_3',
            defaultLabel: callMetadata['jconon_call:punteggio_3']
        },
        {
            key: 'jconon_call:punteggio_4',
            defaultLabel: callMetadata['jconon_call:punteggio_4']
        },
        {
            key: 'jconon_call:punteggio_5',
            defaultLabel: callMetadata['jconon_call:punteggio_5']
        },
        {
            key: 'jconon_call:punteggio_6',
            defaultLabel: callMetadata['jconon_call:punteggio_6']
        },
        {
            key: 'NESSUN_FILTRO',
            defaultLabel: 'Nessun filtro'
        }
    ];
    bulkinfo = new BulkInfo({
      target: esclusioneDetail,
      path: 'esclusioneBulkInfo',
      metadata: callMetadata,
      name: nameForm,
       callback: {
        beforeCreateElement: function (item) {
         if (item.name === 'tipoSelezione') {
           item.jsonlist = callTipoSelezione.filter(function(el) {
             return el['defaultLabel'] != undefined;
           });
         }
        },
        afterCreateForm: function() {
          $('<div class="text-center">')
            .append(buttonGroup)
            .appendTo(esclusione);
          manangeClickFilter();
          manangeSelezioneFilter();
          manangeTotalePunteggiFilter();
          $('#esclusioniType button[data-value="GENERA"]').click();
        }
      }
    });
  }

  function extractApplication(data) {
    var option = '<option></option>',
      ids = data.items;
    ids.every(function(el, index) {
      option = option + '<option data-title="' + el['jconon_application:user'] + '" value="' + el['cmis:objectId'] + '">' + el['jconon_application:cognome'] + ' ' +  el['jconon_application:nome'] + '</option>';
      return true;
    });
    //in caso di selezione del tipo di bando, rimuovo le vecchie option
    $('#application option').remove();
    $('#filterApplication').remove();
    $('#filterApplicationArea').remove();
    $('#application').change();
    $('#applicationSelected').text('');
    //...e carico le nuove option
    $('#application').append(option);
    $('#application').parent().after($('<input type="hidden" id="applicationTotal">'));
    $('#application').parent().after($('<div class="label label-info controls" id="applicationSelected">'));
    $('#application').after(Call.filterApplicationByUsername($('#application'), $('#applicationSelected')));
    $('#applicationTotal').val('Domande totali: ' + ids.length);
    $('#applicationSelected').text($('#applicationTotal').val());
    $('#application').on("change", function(e) {
        $('#applicationSelected').text($('#applicationTotal').val() + ' Selezionate: ' + (e.val ? e.val.length : 0));
    });
  }

  function loadApplication(filter, anotherFilter) {
      var close = UI.progress();
      query = "SELECT app.cmis:objectId, app.jconon_application:cognome, app.jconon_application:nome, app.jconon_application:user " +
              " from jconon_application:folder app " +
              (filter == 'FILTER' || anotherFilter ? " join jconon_application:aspect_punteggi punt on app.cmis:objectId = punt.cmis:objectId " : "" )+
              " where IN_TREE(app,'" + params.callId + "') and app.jconon_application:stato_domanda = 'C' " +
              " and app.jconon_application:esclusione_rinuncia is null " +
              (filter == 'FILTER' ?
              (" and (punt.jconon_application:fl_punteggio_titoli = true or punt.jconon_application:fl_punteggio_scritto = true or " +
              " punt.jconon_application:fl_punteggio_secondo_scritto = true or punt.jconon_application:fl_punteggio_colloquio = true or " +
              " punt.jconon_application:fl_punteggio_prova_pratica = true)") : "");
      if (anotherFilter) {
        query += anotherFilter;
      }
      query = query + " order by app.jconon_application:cognome, app.jconon_application:nome";
      URL.Data.search.query({
        queue: true,
        data: {
          maxItems:100000,
          q: query
        }
      }).success(function(data) {
        extractApplication(data);
        close();
      });
  }

  function loadPage() {
    URL.Data.node.node({
      data: {
        excludePath : true,
        nodeRef : params.callId
      },
      callbackErrorFn: jconon.callbackErrorFn,
      success: function (dataCall) {
        callMetadata = dataCall;
        callMetadata['firma'] = 'IL RESPONSABILE DEL PROCEDIMENTO';

        intestazione.append(i18n.prop('label.istruzioni.esclusione', callMetadata['jconon_call:codice']));
        if (Call.isRdP(callMetadata['jconon_call:rdp']) || common.User.admin || common.User.groupsArray.indexOf('GROUP_CONCORSI') !== -1) {
          bulkinfoFunction();
          bulkinfo.render();
          esclusione.append(esclusioneDetail);
        } else {
          UI.error(i18n['message.access.denieded'], function () {
            window.location.href = document.referrer;
          });
        }
        loadApplication('FILTER');
      }
    });
  }
  loadPage();
});