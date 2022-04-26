define(['jquery', 'header', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.jconon', 'json!common', 'cnr/cnr.ui', 'i18n', 'json!cache', 'cnr/cnr.call', 'cnr/cnr.search', 'cnr/cnr.ui.widgets', 'cnr/cnr.ui.wysiwyg-placeholder'], function($, header, BulkInfo, CNR, URL, jconon, common, UI, i18n, cache, Call, Search, Widgets, Wysiwyg) {
  "use strict";

  var bulkinfo,
    callMetadata,
    nameForm = 'default',
    convocazione = $('#convocazione'),  
    intestazione = $('#intestazione'),
    convocazioneDetail = $('<div id="convocazione-detail"></div>'),
    btnSend = $('<span class="control-group"><button id="send" name="send" class="btn btn-primary btn-large">' + i18n['button.crea.convocazioni'] +
      ' <i class="ui-button-icon-secondary ui-icon icon-file" ></i></button></span>').off('click').on('click', function () {
        generate(false);
      }),
    btnSendAsync = $('<span class="control-group pl-1"><button class="btn btn-info btn-large ">' + i18n['button.crea.convocazioni.async'] +
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
        }
    ];
    bulkinfo = new BulkInfo({
      target: convocazioneDetail,
      path: 'convocazioneBulkInfo',
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
          $('<div class="text-right">')
            .append('<hr>')
            .append(buttonGroup)
            .appendTo(convocazione);
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

  function loadPage() {
    URL.Data.node.node({
      data: {
        excludePath : true,
        nodeRef : params.callId
      },
      callbackErrorFn: jconon.callbackErrorFn,
      success: function (dataCall) {
        callMetadata = dataCall;
        if (callMetadata['jconon_call:numero_convocazione'] === undefined) {
          callMetadata['jconon_call:numero_convocazione'] = 0;
        }        
        callMetadata['numeroConvocazione'] = callMetadata['jconon_call:numero_convocazione'] + 1;
        callMetadata['firma'] = 'IL DIRIGENTE';

        intestazione.append(i18n.prop('label.istruzioni.convocazione', callMetadata['jconon_call:codice']));
        if (Call.isRdP(callMetadata['jconon_call:rdp']) || common.User.admin || common.User.groupsArray.indexOf('GROUP_CONCORSI') !== -1) {
          bulkinfoFunction();
          bulkinfo.render().complete(function () {
            var close = UI.progress(),
                query = "SELECT cmis:objectId, jconon_application:cognome, jconon_application:nome, jconon_application:user from jconon_application:folder " +
                        "where IN_TREE('" + params.callId + "') and jconon_application:stato_domanda = 'C' and jconon_application:esclusione_rinuncia is null " +
                        "order by jconon_application:cognome, jconon_application:nome";
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
          });
          convocazione.append(convocazioneDetail);
        } else {
          UI.error(i18n['message.access.denieded'], function () {
            window.location.href = document.referrer;
          });
        }
      }
    });
  }

  function generate(async) {
    if (bulkinfo.validate()) {
      var close = UI.progress(), d = new FormData(document.getElementById("convocazioneBulkInfo")),
        applicationIds = bulkinfo.getDataValueById('application'),
        token = $("meta[name='_csrf']").attr("content"),
        header = $("meta[name='_csrf_header']").attr("content");
      d.append('callId', params.callId);
      d.append('async', async);
      $.each(bulkinfo.getData(), function (index, el) {
        if (el.name !== 'application') {
            d.append(el.name, el.value);
        }
      });
      $.ajax({
          type: "POST",
          url: cache.baseUrl + "/rest/call/convocazioni",
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
                    UI.info(i18n.prop('message.convocazioni.async', common.User.email), function () {
                        $('#application').val(-1).trigger("change");
                    });
               } else {
                   UI.info("Sono state generate " + response.numConvocazioni + " convocazioni.", function () {
                        if (applicationIds == undefined) {
                          window.location = jconon.URL.call.convocazione.visualizza + '?callId=' + params.callId;
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
  loadPage();
});