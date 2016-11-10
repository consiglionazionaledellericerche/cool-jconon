require(['jquery', 'cnr/cnr.url', 'header'], function ($, URL) {
  "use strict";

  var categories = {
    dipendenti: 'Selezioni per dipendenti CNR',
    tutti: 'Tutti i Bandi'
  };

  $.each(categories, function (id, name) {

    var target = $('#' + id);

    URL.Data.frontOffice.document({
      placeholder: {
        'type_document': 'faq'
      },
      data: {
        typeBando: name
      }
    }).done(function (data) {
      $.each(data.docs, function (index, el) {
        var html = '<h4>' + el.question + '</h4>' + el.answer;
        target.append(html);
      });
    });
  });

});