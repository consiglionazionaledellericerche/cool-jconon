define(['jquery', 'cnr/cnr.url', 'cnr/cnr.ui.select', 'cnr/cnr'], function ($, URL, Select, CNR) {

  "use strict";

  function widget(id, labelText, item) {

    item.ghostName = "descrizioneSede";
    if (!item.maximumSelectionSize) {
      item.maximumSelectionSize = 2;
    }
    var obj = Select.CustomWidget(id, labelText, item),
      baseURLIstituto = "https://www.cnr.it/it/istituto/",
      baseURLSAC = "https://www.cnr.it/it/amministrazione-centrale";

    URL.Data.sedi({
      data: {
        attive: item.attive || false
      },
      errorFn: function () {
        console.log('sedi not found')
      },
      success: function (data) {
        var select = obj.setOptions(data);
        select.on('change', function (event) {
          var linkSede = $('#link_sede');
          linkSede.empty();
          $.map([].concat(select.data('select2').data()), function (el) {
            if (el && el.text) {
              var exp = new RegExp("^.*UO: ([0-9A-Z]{3}).*$", 'gi').exec(el.text), codiceIstituto, link, textLink;
              if (exp) {
                codiceIstituto = exp[1];
                link = (codiceIstituto === "000" || codiceIstituto === "ASR") ? baseURLSAC : (baseURLIstituto + codiceIstituto);
                textLink = (codiceIstituto === "000" || codiceIstituto === "ASR") ? "Amministrazione Centrale" : link;
                if (el && el.text) {
                  linkSede.append('<p><a class="animated flash" href="' + link + '" target=_istituto>' + textLink + '</a></p>');
                }
              }
            }
          });
        });
        select.trigger("change");
      }
    });
    return obj.emptyWidget;
  }

  return {
    Widget: widget
  };
});
