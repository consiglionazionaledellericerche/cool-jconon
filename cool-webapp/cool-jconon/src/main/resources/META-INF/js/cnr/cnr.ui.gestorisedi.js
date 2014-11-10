/*global params*/
define(['jquery', 'cnr/cnr.url', 'cnr/cnr.ui.select', 'cnr/cnr', 'json!common'], function ($, URL, Select, CNR, common) {

  "use strict";

  function render(data, obj) {
    var select = obj.setOptions(data);
    select.on('change', function (event, init) {
      $.map([].concat(select.data('select2').data()), function (el) {
        var riga = $.map(data, function (element) {
          if (el !== null && element.key === el.id) {
            return element;
          }
        }),
          struttura_destinataria = select.parents('form').find('#struttura_destinataria'),
          sede = select.parents('form').find('#sede');
        if (riga.length > 0) {
          struttura_destinataria.val(riga[0].citta);
          sede.val(riga[0].descrizione);
        } else {
          if (!init) {
            struttura_destinataria.val('');
            sede.val('');
          }
        }
      });
    });
    select.trigger("change", true);
  }
  function widget(id, labelText, item) {
    var obj = Select.CustomWidget(id, labelText, item),
      callType = params['call-type'],
      sediAbilitate = common['managers-call'][callType];
    if (sediAbilitate && sediAbilitate.length > 0) {
      render(sediAbilitate, obj);
    } else {
      URL.Data.sedi().done(function (data) {
        render(data.results, obj);
      });
    }
    return obj.emptyWidget;
  }

  return {
    Widget: widget
  };
});
