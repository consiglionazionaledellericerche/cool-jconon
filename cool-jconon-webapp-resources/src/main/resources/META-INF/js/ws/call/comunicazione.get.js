define(['jquery', 'header', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.jconon', 'json!common', 'cnr/cnr.ui', 'i18n', 'json!cache', 'cnr/cnr.call', 'cnr/cnr.search', 'cnr/cnr.ui.widgets', 'cnr/cnr.ui.wysiwyg-placeholder', 'cnr/cnr.criteria'], function($, header, BulkInfo, CNR, URL, jconon, common, UI, i18n, cache, Call, Search, Widgets, Wysiwyg, Criteria) {
  "use strict";

  var bulkinfo,
    callMetadata,
    nameForm = 'default',
    comunicazione = $('#comunicazione'),  
    intestazione = $('#intestazione'),
    comunicazioneDetail = $('<div id="comunicazione-detail"></div>'),
    btnSend = $('<span class="control-group"><button id="send" name="send" class="btn btn-primary btn-large">' + i18n['button.crea.comunicazioni'] +
      ' <i class="ui-button-icon-secondary ui-icon icon-file" ></i></button></span>').off('click').on('click', function () {
        generate(false);
      }),
    btnSendAsync = $('<span class="control-group pl-1"><button class="btn btn-info btn-large ">' + i18n['button.crea.comunicazioni.async'] +
      ' <i class="ui-button-icon-secondary ui-icon icon-play-circle" ></i></button></span>').off('click').on('click', function () {
        generate(true);
    }),
    buttonGroup = $('<div class="btn-group">').append(btnSend).append(btnSendAsync);

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
    bulkinfo = new BulkInfo({
      target: comunicazioneDetail,
      path: 'comunicazioneBulkInfo',
      metadata: callMetadata,
      name: nameForm,
       callback: {
        beforeCreateElement: function (item) {
         if (item.name === 'elenco_field_domanda') {
           item.jsonlist = cache.jsonlistApplicationFieldsNotRequired;
         }
        },
        afterCreateForm: function() {
            $('<div class="text-right">')
              .append('<hr>')
              .append(buttonGroup)
              .appendTo(comunicazione);
        }
      }
    });
  }

  function extractApplication(data, total) {
    var option = '',
      ids = data.items;
    ids.every(function(el, index) {
      option = option + '<option data-title="' + el['jconon_application:user'] + '" value="' + el['cmis:objectId'] + '">' + el['jconon_application:cognome'] + ' ' +  el['jconon_application:nome'] + '</option>';
      return true;
    });
    //...e carico le nuove option
    $('#application').append(option);
    $('#applicationTotal').val('Domande totali: ' + total);
    $('#applicationSelected').text($('#applicationTotal').val());
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
    var close = UI.progress(),
        query = "SELECT app.cmis:objectId, app.jconon_application:cognome, app.jconon_application:nome, app.jconon_application:user " +
                " from jconon_application:folder app " +
                " where " + baseCriteria.toString() +
                " order by app.jconon_application:cognome, app.jconon_application:nome";
        $('#application option').remove();
        $('#filterApplication').remove();
        $('#filterApplicationArea').remove();
        $('#applicationSelected').remove();
        $('#application').parent().after($('<input type="hidden" id="applicationTotal">'));
        $('#application').parent().after($('<div class="label label-info controls" id="applicationSelected">'));
        $('#application').after(Call.filterApplicationByUsername($('#application'), $('#applicationSelected'), $('#applicationTotal')));
        $('#application').change();
        $('#applicationSelected').text('');
        $('#application').on("change", function(e) {
          $('#applicationSelected').text($('#applicationTotal').val() + ' Selezionate: ' + (e.val ? e.val.length : 0));
        });
        jconon.progressBar('0%');
        results(query, 0, close);
  }

  function generate(async) {
    if (bulkinfo.validate()) {
      var close = UI.progress(), d = new FormData(document.getElementById("comunicazioneBulkInfo")),
        applicationIds = bulkinfo.getDataValueById('application'),
        token = $("meta[name='_csrf']").attr("content"),
        header = $("meta[name='_csrf_header']").attr("content");
      d.append('async', async);
      d.append('callId', params.callId);
      $.each(bulkinfo.getData(), function (index, el) {
        if (el.name !== 'application') {
            d.append(el.name, el.value);
        }
      });
      $.ajax({
          type: "POST",
          url: cache.baseUrl + "/rest/call/comunicazioni",
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
               if (async) {
                    UI.info(i18n.prop('message.comunicazioni.async', common.User.email), function () {
                        $('#application').val(-1).trigger("change");
                    });
               } else {
                   UI.info("Sono state generate " + response.numComunicazioni + " comunicazioni.", function () {
                        if (applicationIds == undefined) {
                          window.location = jconon.URL.call.comunicazione.visualizza + '?callId=' + params.callId;
                        } else {
                          $('#application').val(-1).trigger("change");
                        }
                   });
               }
          },
          complete: close,
          error: URL.errorFn
      });
    }
  }

  function results(query, skipCount, closeFn) {
      URL.Data.search.query({
        queue: true,
        data: {
          maxItems:1000,
          skipCount: skipCount,
          includeAllowableActions: false,
          q: query
        }
      }).success(function(data) {
        extractApplication(data, data.totalNumItems);
        skipCount = skipCount + 1000;
        if (skipCount < data.totalNumItems) {
          jconon.progressBar(Math.trunc(skipCount * 100 / data.totalNumItems) + '%');
          results(query, skipCount, closeFn)
        } else {
          closeFn();
        }
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
        callMetadata['firma'] = 'IL DIRIGENTE';

        intestazione.append(i18n.prop('label.istruzioni.comunicazione', callMetadata['jconon_call:codice']));
        if (Call.isRdP(callMetadata['jconon_call:rdp']) || common.User.admin || common.User.groupsArray.indexOf('GROUP_CONCORSI') !== -1) {
          bulkinfoFunction();
          bulkinfo.render().complete(function () {
            $('#filters-provvisorie_inviate').closest('.widget').on('setData', function (event, key, applicationStatus) {
                populateDomande(applicationStatus);
            });
            $('#filters-totalepunteggiofiltra').off('click').on('click', function () {
                populateDomande($('#filters-provvisorie_inviate').children('.active').data('value'));
            });
            populateDomande('attive');
          });
          comunicazione.append(comunicazioneDetail);
        } else {
          UI.error(i18n['message.access.denieded'], function () {
            window.location.href = document.referrer;
          });
        }
      }
    });
  }
  loadPage();
});