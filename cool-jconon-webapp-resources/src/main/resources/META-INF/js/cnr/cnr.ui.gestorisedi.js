/*global params*/
define(['jquery', 'cnr/cnr.url', 'cnr/cnr.ui.select', 'cnr/cnr', 'json!common', 'json!cache'], function ($, URL, Select, CNR, common, cache) {

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
          struttura_destinataria.prop('disabled', true);
          sede.prop('disabled', true);
          struttura_destinataria.val(riga[0].citta);
          sede.val(riga[0].descrizione);
        } else {
          if(common.User.admin || isGestore()) {
            struttura_destinataria.prop('disabled', false);
            sede.prop('disabled', false);
          }
          if (!init) {
            struttura_destinataria.val('');
            sede.val('');
          }
        }
      });
    });
    select.trigger("change", true);
  }

  function isGestore() {
    var gestore = false;
    cache['groups.supervisor.sedi'].forEach(function(group) {
        if (common.User.groupsArray.indexOf(group) !== -1) {
            gestore = true;
        }
    });
    return gestore;
  }

  function widget(id, labelText, item) {
    var obj = Select.CustomWidget(id, labelText, item),
      callType = params['call-type'],
      sediAbilitate = common['managers-call'][callType];
    if (sediAbilitate && sediAbilitate.length > 0) {
      render(sediAbilitate, obj);
    } else {
        URL.Data.sedi({
          data: {
            attive: item.attive || false
          },
          errorFn: function () {
            $('#struttura_destinataria').prop('disabled', false);
            $('#sede').prop('disabled', false);
            obj.emptyWidget.hide();
            console.log('sedi not found');
          },
          success: function (data) {
            if (data.length == 0) {
              $('#struttura_destinataria').prop('disabled', false);
              $('#sede').prop('disabled', false);
              obj.emptyWidget.hide();
            }
            render(data, obj);
          }
        });
    }
    return obj.emptyWidget;
  }

  return {
    Widget: widget
  };
});
