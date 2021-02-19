define(['jquery', 'header', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.jconon', 'json!common', 'cnr/cnr.ui', 'i18n', 'json!cache', 'cnr/cnr.call', 'cnr/cnr.search', 'cnr/cnr.ui.widgets', 'cnr/cnr.ui.wysiwyg-placeholder', 'cnr/cnr.criteria'], function($, header, BulkInfo, CNR, URL, jconon, common, UI, i18n, cache, Call, Search, Widgets, Wysiwyg, Criteria) {
  "use strict";

  var bulkinfo,
    callMetadata,
    nameForm = 'default',
    aggiungiAllegato = $('#aggiungi-allegato'),
    intestazione = $('#intestazione'),
    aggiungiAllegatoDetail = $('<div id="aggiungi-allegato-detail"></div>'),
    btnSend = $('<div class="text-center"> <button id="send" name="send" class="btn btn-primary btn-large">' + i18n['button.aggiungi.allegati'] + 
      ' <i class="ui-button-icon-secondary ui-icon icon-file" ></i></button> </div>').off('click').on('click', function () {
        if (bulkinfo.validate()) {
          var close = UI.progress(), d = new FormData(document.getElementById("aggiungiAllegatoBulkInfo")),
            applicationIds = bulkinfo.getDataValueById('application'),
            token = $("meta[name='_csrf']").attr("content"),
            header = $("meta[name='_csrf_header']").attr("content");

          d.append('callId', params.callId);
          $.each(bulkinfo.getData(), function (index, el) {
            if (el.name !== 'application') {
                d.append(el.name, el.value);
            }
          });
          $.ajax({
              type: "POST",
              url: cache.baseUrl + "/rest/call/aggiungi-allegato",
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
                  UI.info("Sono stati aggiunti " + response.numAllegati + " allegati.", function () {
                     $('#application').val(-1).trigger("change");
                  });
              },
              complete: close,
              error: URL.errorFn
          });
        }
      });

  function bulkinfoFunction() {
    bulkinfo = new BulkInfo({
      target: aggiungiAllegatoDetail,
      path: 'aggiungiAllegatoBulkInfo',
      metadata: callMetadata,
      name: nameForm,
       callback: {
        beforeCreateElement: function (item) {
         if (item.name === 'elenco_field_domanda') {
           item.jsonlist = cache.jsonlistApplicationFieldsNotRequired;
         }
        },
        afterCreateForm: function() {
          aggiungiAllegato.append(btnSend);
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
    $('#application').change();
    $('#applicationSelected').text('');
    //...e carico le nuove option
    $('#application').append(option);
    $('#application').parent().after($('<input type="hidden" id="applicationTotal">'));
    $('#application').parent().after($('<div class="label label-info controls" id="applicationSelected">'));
    $('#applicationTotal').val('Domande totali: ' + ids.length);
    $('#applicationSelected').text($('#applicationTotal').val());
    $('#application').on("change", function(e) {
        $('#applicationSelected').text($('#applicationTotal').val() + ' Selezionate: ' + (e.val ? e.val.length : 0));
    });
  }

  function populateDomande(applicationStatus) {
    var baseCriteria = new Criteria().not(new Criteria().equals('app.jconon_application:stato_domanda', 'I').build()),
        totalePunteggioda = bulkinfo.getDataValueById("filters-totalepunteggioda"), totalePunteggioa = bulkinfo.getDataValueById("filters-totalepunteggioa");
    if (cache['query.index.enable']) {
      baseCriteria.inTree(params.callId, 'app');
    } else {
      baseCriteria.inFolder(params.callId, 'app');
    }
    if (applicationStatus && applicationStatus !== 'tutte' && applicationStatus !== 'attive' && applicationStatus !== 'escluse') {
      baseCriteria.and(new Criteria().equals('app.jconon_application:stato_domanda', applicationStatus).build());
    }
    if (applicationStatus && applicationStatus === 'attive') {
      baseCriteria.and(new Criteria().equals('app.jconon_application:stato_domanda', 'C').build());
      baseCriteria.and(new Criteria().isNull('app.jconon_application:esclusione_rinuncia').build());
    }
    if (applicationStatus && applicationStatus === 'escluse') {
      baseCriteria.and(new Criteria().equals('app.jconon_application:stato_domanda', 'C').build());
      baseCriteria.and(new Criteria().isNotNull('app.jconon_application:esclusione_rinuncia').build());
    }
    if (totalePunteggioda || totalePunteggioa) {
        if (totalePunteggioda) {
          baseCriteria.and(new Criteria().gte('app.jconon_application:totale_punteggio', totalePunteggioda).build());
        }
        if (totalePunteggioa) {
          baseCriteria.and(new Criteria().lte('app.jconon_application:totale_punteggio', totalePunteggioa).build());
        }
    }
    var close = UI.progress();
    URL.Data.search.query({
      queue: true,
      data: {
        maxItems:100000,
        q: "SELECT app.cmis:objectId, app.jconon_application:cognome, app.jconon_application:nome, app.jconon_application:user " +
            " from jconon_application:folder app " +
            " where " + baseCriteria.toString() +
            " order by app.jconon_application:cognome, app.jconon_application:nome"
      }
    }).success(function(data) {
      close();
      extractApplication(data);
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

        intestazione.append(i18n.prop('label.istruzioni.aggiungi-allegato', callMetadata['jconon_call:codice']));
        if (Call.isRdP(callMetadata['jconon_call:rdp']) || common.User.admin || common.User.groupsArray.indexOf('GROUP_CONCORSI') !== -1) {
          bulkinfoFunction();
          bulkinfo.render().complete(function () {
            $('#filters-provvisorie_inviate').closest('.widget').on('setData', function (event, key, applicationStatus) {
                populateDomande(applicationStatus);
            });
            $('#filters-totalepunteggiofiltra').off('click').on('click', function () {
                populateDomande($('#filters-provvisorie_inviate').children('.active').data('value'));
            });
          });
          aggiungiAllegato.append(aggiungiAllegatoDetail);
        } else {
          UI.error(i18n['message.access.denieded'], function () {
            window.location.href = document.referrer;
          });
        }
        populateDomande('attive');
      }
    });
  }
  loadPage();
});