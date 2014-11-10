define(['jquery', 'cnr/cnr.url', 'cnr/cnr.ui.select', 'cnr/cnr'], function ($, URL, Select, CNR) {

  "use strict";

  function widget(id, labelText, item) {

    item.ghostName = "descrizioneSede";
    if (!item.maximumSelectionSize) {
      item.maximumSelectionSize = 2;
    }

    var obj = Select.CustomWidget(id, labelText, item),
      baseURLIstituto = "http://www.cnr.it/istituti/DatiGenerali.html?cds=",
      baseURLSAC = "http://www.cnr.it/sitocnr/IlCNR/Organizzazione/Amministrazionecentrale/Amministrazionecentrale.html";

    URL.Data.sedi().done(function (data) {
      var select = obj.setOptions(data.results);
      select.on('change', function (event) {
        var linkSede = $('#link_sede');
        linkSede.empty();
        $.map([].concat(select.data('select2').data()), function (el) {
          var exp = new RegExp("^.*UO: ([0-9]{3}).*$", 'gi').exec(el.text),
            codiceIstituto = exp[1],
            link = codiceIstituto === "000" ? baseURLSAC : (baseURLIstituto + codiceIstituto),
            textLink = codiceIstituto === "000" ? "Amministrazione Centrale" : link;
          if (el && el.text) {
            linkSede.append('<p><a class="animated flash" href="' + link + '" target=_istituto>' + textLink + '</a></p>');
          }
        });
      });
      select.trigger("change");
    });
    return obj.emptyWidget;
  }

  return {
    Widget: widget
  };
});
