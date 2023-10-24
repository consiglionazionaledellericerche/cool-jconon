require(['jquery', 'header', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.ui', 'json!cache', 'i18n', 'cnr/cnr.ui.select', 'cnr/cnr.application', 'cnr/cnr.jconon', 'cnr/cnr.call'], function ($, header, CNR, URL, UI, cache, i18n, select, Application, jconon, Call) {
  "use strict";
  var callId = params['callId']||$('#callId').val(), metadata;
  URL.Data.node.node({
      data: {
        nodeRef : callId
      },
      type: 'GET',
      success: function (data) {
        metadata = data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        CNR.log(jqXHR, textStatus, errorThrown);
      }
  });
  $('#exportApplications').off('click').on('click', function () {
    metadata.id = metadata['cmis:objectId'];
    return Call.modalEstraiDomande(metadata);
  });
});