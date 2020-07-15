define(['jquery', 'cnr/cnr.url', 'cnr/cnr.ui.select', 'cnr/cnr'], function ($, URL, Select, CNR) {

  "use strict";
  var parent;
  function markMatch(that, text, term, markup, escapeMarkup) {
        var match=text.toUpperCase().indexOf(term.toUpperCase()),
            tl=term.length;

        if (match<0) {
            markup.push(that.escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(that.escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(that.escapeMarkup(text.substring(match + tl, text.length)));
  }

  function setDataInternal(details) {
      var value = details.val,
        parsedValue = value ? String(value).match(/[a-zA-Z0-9-_]+/, '') : value,
        id = details.target.id;
      if (value) {
        parent.data('value', value);
      }
      if (parsedValue) {
        parent.parent().find('#precedente_incarico_oiv_cod_amm_ipa').val(details.added.cod_amm);
        parent.parent().find('#esperienza_professionale_cod_amm_ipa').val(details.added.cod_amm);

        parent.parent().find('#precedente_incarico_oiv_indirizzo').val(details.added.indirizzo);
        parent.parent().find('#precedente_incarico_oiv_comune').val(details.added.comune).trigger('change');
        parent.parent().find('#precedente_incarico_oiv_cap').val(details.added.cap);
        parent.parent().find('#esperienza_professionale_citta').val(details.added.comune);
        $('[class*="' + id + '"]').parents('.control-group').hide();
        $('[class*="' + id + '"]:not(".' + id + '_' + parsedValue.join(',') + '")').val('').trigger('change');
        $('.' + id + '_' + parsedValue.join(',')).parents('.control-group').show();
      } else {
        parent.parent().find('#precedente_incarico_oiv_cod_amm_ipa').val('');
        parent.parent().find('#esperienza_professionale_cod_amm_ipa').val('');
      }
  }

  function widget(id, labelText, item) {
    var obj = Select.CustomWidget(id, labelText, item, {
        minimumInputLength: 1,
        ajax: {
            url: "rest/ipa/amministrazioni",
            dataType: 'json',
            quietMillis: 250,
            data: function (term, page) {
                return {
                    q: term,
                    page: page
                };
            },
            results: function (data, page) {
                var more = (page * 10) < data.total_count;
                return {
                    results: data.items,
                    more: more
                };
            },
            cache: true
        },
        formatResult: function(result, container, query, escapeMarkup) {
            var markup=[];
            markMatch(this, result.des_amm, query.term, markup, escapeMarkup);
            var des_amm = markup.join("");

            var testo =
            '<div class="row-fluid">' +
                 '<div><h4>' + result.cod_amm + ' - ' + des_amm + '</h4></div>' +
                 '<div<h5>' + result.tipologia_amm + '</h5></div>' +
                 '<div class="annotation">' + result.nome_resp + ' ' + result.cognome_resp +'</div>';
                if (result.sito_istituzionale) {
                    testo += '<div><a href="http://'+ result.sito_istituzionale +'" target="_blank">' + result.sito_istituzionale + '</a></div>';
                }
                if (result.mail1) {
                    testo += '<div><a href="mailto:' + result.mail1 + '">' + result.mail1 + '</a></div>';
                }
            testo += '</div>';
            return testo;
        },
        formatSelection: function (data, container) {
            return data ? data.des_amm : undefined;
        },
        id: function(e) {
            return e.des_amm;
        },
        initSelection: function(element, callback) {
            var id = $(element).val();
            if (id !== "") {
                $.ajax("rest/ipa/amministrazione?q=" + id, {
                    dataType: "json"
                }).done(function(data) {
                    callback(data);
                    parent.data('value', id);
                });
            }
        }
    });
    var select = obj.setOptions([]);
    select.on('change', setDataInternal);
    parent = obj.emptyWidget;
    select.trigger("change");
    select.select2('val', item.val);
    return parent;
  }

  return {
    Widget: widget
  };
});
