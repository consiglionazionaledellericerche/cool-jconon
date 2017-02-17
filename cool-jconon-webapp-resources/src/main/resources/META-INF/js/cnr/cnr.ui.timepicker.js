define(['jquery', 'i18n', 'moment', 'datetimepicker-i18n'], function ($, i18n, moment, datetimepicker) {
  "use strict";

  function widget(id, labelText, item) {

    var controls = $('<div class="controls input-append date"></div>'),
      parent = $('<div class="control-group widget"></div>').append('<label class="control-label">' + labelText + '</label>').append(controls),
      input = $('<input data-format="hh:mm" type="text"></input>').attr('id', id).appendTo(controls),
      span = $('<span class="add-on"><i data-time-icon="icon-time" class="icon-time" data-date-icon="icon-calendar"></i></span>').appendTo(controls);

    if (item['class']) {
      input.addClass(item['class']);
    }
    if (item.parentGroupClass) {
      parent.addClass(item.parentGroupClass);
    }

    controls
      .datetimepicker({
        language: i18n.locale,
        pickDate: false
      })
      .on('changeDate', function (eventType, initialization) {
        if (!initialization) {
          if (eventType.date) {
            parent.data('value', moment(eventType.localDate).format("HH:mm"));
          } else {
            parent.data('value', null);
          }
        }
      })
      .trigger('changeDate', true);

    if (item.val) {
      input.val(item.val);
      input.change();
    }

    return parent;
  }

  return {
    Widget: widget
  };

});