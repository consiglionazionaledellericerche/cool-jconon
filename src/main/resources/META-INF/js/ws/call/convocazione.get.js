define(['jquery', 'header', 'cnr/cnr.bulkinfo', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.jconon', 'json!common', 'cnr/cnr.ui', 'i18n', 'json!cache', 'cnr/cnr.call', 'cnr/cnr.search', 'cnr/cnr.ui.widgets', 'cnr/cnr.ui.wysiwyg'], function($, header, BulkInfo, CNR, URL, jconon, common, UI, i18n, cache, Call, Search, Widgets, Wysiwyg) {
  "use strict";

  var bulkinfo,
    callMetadata,
    nameForm = 'default',
    convocazione = $('#convocazione'),  
    intestazione = $('#intestazione'),
    convocazioneDetail = $('<div id="convocazione-detail"></div>'),
    btnSend = $('<div class="text-center"> <button id="send" name="send" class="btn btn-primary btn-large">' + i18n['button.send'] + 
      ' <i class="ui-button-icon-secondary ui-icon icon-file" ></i></button> </div>').off('click').on('click', function () {
        if (bulkinfo.validate()) {
          var close = UI.progress(), d = bulkinfo.getData();
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
                window.location = jconon.URL.call.convocazione.visualizza + '?callId=' + params.callId;
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
      }
    });
  }

  loadPage();
});