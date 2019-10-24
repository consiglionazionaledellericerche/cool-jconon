define(['jquery', 'cnr/cnr.url', 'cnr/cnr.jconon'], function ($, URL, jconon) {
  "use strict";

  var maxItems = 10;

  function widget(id, labelText, bulkitem) {

    var input = $('<input type="text" class="input-medium" autocomplete="off" data-provide="typeahead" />').addClass(bulkitem['class']).attr('id', id).attr('name', id),
      controls = $('<div class="controls"></div>').append(input).append(' '),
      label = $('<label class="control-label"></label>').attr('for', id).text(labelText || ''),
      item = $('<div class="control-group widget"></div>');

    item
      .data('id', id)
      .append(label)
      .append(controls);

    jconon.Data.user.grades().done(function (data) {

      var values = Object.values(data), lowerCaseMap = {};
      $.each(data, function (key, val) {
        lowerCaseMap[val.toLowerCase()] = val;
      });
      // input change and auto-completion
      input
        .on('keyup change', function () {
          var query = input.val().toLowerCase(),
            isValid = lowerCaseMap[query],
            value;

          value = $(values).filter(function (index, el) {
            return el.toLowerCase() === query;
          })[0];

          item.data('value', isValid ? value : null);
        })
        .typeahead({
          source: values,
          items: maxItems
        });
      if (bulkitem.val) {
        input.val(bulkitem.val).trigger('change');
      }
    });

    return item;
  }

  return {
    Widget: widget
  };
});