define(['jquery', 'cnr/cnr'], function ($, URL) {
  "use strict";
  function strPad(i,l,s) {
    var o = i.toString();
    if (!s) { s = '0'; }
    while (o.length < l) {
      o = s + o;
    }
    return o;
  };
  function widget(id, labelText, bulkitem) {

    var input = $('<input type="text" class="input-medium" data-provide="typeahead" maxlength="7"/>').addClass(bulkitem['class']).attr('id', id).attr('name', id),
      controls = $('<div class="controls"></div>').append(input),
      label = $('<label class="control-label"></label>').attr('for', id).text(labelText || ''),
      item = $('<div class="control-group widget"></div>');

    item
      .data('id', id)
      .append(label)
      .append(controls);
    if (bulkitem.val) {
      input.val(bulkitem.val);
      item.data('value', input.val());      
    }    
    input.keypress(function (e) {
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
       return false;
      }
    });    
    input.on('change', function () {
      if (input.val()) {
        input.val(strPad(input.val(), 7));
        item.data('value', input.val());
      } else {
        item.data('value', null);
      }
    });
    return item;
  }

  return {
    Widget: widget
  };
});