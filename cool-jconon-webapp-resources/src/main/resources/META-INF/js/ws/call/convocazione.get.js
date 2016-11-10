define(['jquery', 'header', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.jconon', 'json!common', 'cnr/cnr.ui', 'i18n', 'json!cache', 'cnr/cnr.call', 'cnr/cnr.search', 'cnr/cnr.ui.widgets', 'cnr/cnr.ui.wysiwyg'], function($, header, BulkInfo, CNR, URL, jconon, common, UI, i18n, cache, Call, Search, Widgets, Wysiwyg) {
  "use strict";

  var bulkinfo,
    callMetadata,
    nameForm = 'default',
    convocazione = $('#convocazione'),  
    intestazione = $('#intestazione'),
    convocazioneDetail = $('<div id="convocazione-detail"></div>'),
    btnSend = $('<div class="text-center"> <button id="send" name="send" class="btn btn-primary btn-large">' + i18n['button.crea.convocazioni'] + 
      ' <i class="ui-button-icon-secondary ui-icon icon-file" ></i></button> </div>').off('click').on('click', function () {
        if (bulkinfo.validate()) {
          var close = UI.progress(), d = bulkinfo.getData(), 
            applicationIds = bulkinfo.getDataValueById('application');
          d.push({
              id: 'callId',
              name: 'callId',
              value: params.callId
          });        
          jconon.Data.call.convocazioni({
            type: 'POST',
            data:  d,
            success: function (data) {
              UI.info("Sono state generate " + data.numConvocazioni + " convocazioni.", function () {
                if (applicationIds == undefined) {
                  window.location = jconon.URL.call.convocazione.visualizza + '?callId=' + params.callId;
                } else {
                  $('#application').val(-1).trigger("change");
                }
              });
            },
            complete: close,
            error: URL.errorFn
          });
        }
      });

  Widgets['ui.wysiwyg'] = Wysiwyg;
  function bulkinfoFunction() {
    bulkinfo = new BulkInfo({
      target: convocazioneDetail,
      path: 'convocazioneBulkInfo',
      metadata: callMetadata,
      name: nameForm,
       callback: {
        afterCreateForm: function() {
          convocazione.append(btnSend);
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
    //...e carico le nuove option
    $('#application').append(option);
    $('#application').parent().after($('<div class="label label-info controls" id="applicationSelected">'));
    $('#application').on("change", function(e) {
        $('#applicationSelected').text('Domande selezionate ' + (e.val ? e.val.length : 0));
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
        if (callMetadata['jconon_call:numero_convocazione'] === undefined) {
          callMetadata['jconon_call:numero_convocazione'] = 0;
        }        
        callMetadata['numeroConvocazione'] = callMetadata['jconon_call:numero_convocazione'] + 1;
        callMetadata['firma'] = 'IL DIRIGENTE';

        intestazione.append(i18n.prop('label.istruzioni.convocazione', callMetadata['jconon_call:codice']));
        if (Call.isRdP(callMetadata['jconon_call:rdp']) || common.User.isAdmin || common.User.groups.indexOf('GROUP_CONCORSI') !== -1) {
          bulkinfoFunction();
          bulkinfo.render();
          convocazione.append(convocazioneDetail);
        } else {
          UI.error(i18n['message.access.denieded'], function () {
            window.location.href = document.referrer;
          });
        }
        URL.Data.search.query({
          queue: true,
          data: {
            maxItems:1000,
            q: "SELECT cmis:objectId, jconon_application:cognome, jconon_application:nome, jconon_application:user from jconon_application:folder " +
                "where IN_FOLDER('" + params.callId + "') and jconon_application:stato_domanda = 'C' and jconon_application:esclusione_rinuncia is null " +
                "order by jconon_application:cognome, jconon_application:nome"
          }
        }).success(function(data) {
          extractApplication(data);
        });
      }
    });
  }
  loadPage();
});