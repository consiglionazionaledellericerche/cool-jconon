require(['jquery', 'cnr/cnr.url', 'json!cache', 'header'], function ($, URL, cache) {
  "use strict";
    var cnraffix = $('ul.cnraffix'), question = $('#field'), target;
    function changeActiveState(btn) {
      btn.parents('ul').find('.active').removeClass('active');
      btn.parent('li').addClass('active');
    }
    $.each($.merge([{'key':'Tutti i Bandi', 'title' : 'Tutti i Bandi'}], cache.jsonlistCallType), function (id, el) {
        URL.Data.frontOffice.document({
          placeholder: {
            'type_document': 'faq'
          },
          data: {
            typeBando: el.key
          }
        }).done(function (data) {
          if (data.docs.length > 0) {
            cnraffix.append($('<li class="' + (id == 0 ? 'active' : '') + '">').append(
                $('<a href="#'+ id +'">' + el.title + '</a>').click(function (eventObject) {
                    changeActiveState($(eventObject.target));
                })
            ));
            var section = $('<section id="' + id +'" class="spacer">');
            target = $('<div>');
            target.append($('<h1>').append(el.title).append($('<hr>')));
            $.each(data.docs, function (index, el) {
                var html = '<div class="well"><h4>' + el.question + '</h4>' + el.answer + "</div>";
                target.append(html);
            });
            section.append(target);
            section.append($('<p><a href="#"><i class="icon-arrow-up"></i> torna all\'inizio</a></p>'));
            question.append(section);
          }
        });
    });
});