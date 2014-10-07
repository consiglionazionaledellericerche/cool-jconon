define(['jquery', 'header', 'i18n', 'cnr/cnr', 'cnr/cnr.advancedsearch', 'cnr/cnr.actionbutton', 'cnr/cnr.validator', 'cnr/cnr.url', 'cnr/cnr.criteria', 'cnr/cnr.bulkinfo', 'cnr/cnr.ui'], function ($, header, i18n, CNR, AdvancedSearch, ActionButton, Validator, URL, Criteria, BulkInfo, UI) {
  "use strict";
  /* utility functions */
  // inizializzazione del pannello di ricerca
  var orderLabel = {
      'Esercizio' : 'varpianogest:esercizio',
      'Num. variazione' : 'varpianogest:numeroVariazione'
    },
    bulkInfo,
    queryName = 'varpianogest:document',
    strorgBulkInfo,
    joinQueryName = 'strorg:cds',
    options = {
      defaultSearchSettings : {
        elements: {
          table: $("#items"),
          pagination: $("#itemsPagination"),
          orderBy: $("#orderBy"),
          label: $("#emptyResultset")
        },
        fields: orderLabel,
        calculateTotalNumItems: true,
        mapping: function (mapping, doc) {
          mapping.esercizio = doc["varpianogest:esercizio"];
          mapping.cds = doc["strorgcds:codice"];
          mapping.numeroVariazione = doc["varpianogest:numeroVariazione"];
          return mapping;
        },
        display: {
          row : function (el) {
            var tdText,
              tdButton,
              item = $('<a href="#">' + el.name + '</a>'),
              annotation = $('<span class="muted annotation">modificato ' + CNR.Date.format(el.lastModificationDate) + ' da ' +  el.lastModifiedBy + '</span>'),
              annotationContabile = $('<span class="muted annotation">' +
                i18n['esercizio.variazioni.label'] + ': ' + el.esercizio + ' ' +
                i18n['cds.label'] + ': ' +  el.cds + ' ' +
                i18n['num_variazione.label'] + ': ' +  el.numeroVariazione + ' ' +
                i18n['data_creazione.label'] + ': ' +  CNR.Date.format(el['cmis:creationDate'], null, 'DD/MM/YYYY') +
                '</span>');
            item.attr('href', URL.urls.search.content + '?nodeRef=' + el.id);
            item.after(annotation.prepend(', ').prepend(CNR.fileSize(el.contentStreamLength)));
            if (el.esercizio !== undefined) {
              item.after(annotationContabile);
            }

            tdText = $('<td></td>')
              .append(CNR.mimeTypeIcon(el.contentType, el.name))
              .append(' ')
              .append(item);
            tdButton = $('<td></td>').append(ActionButton.actionButton({
              name: el.name,
              nodeRef: el.id,
              baseTypeId: el.baseTypeId,
              objectTypeId: el.objectTypeId,
              mimeType: el.contentType,
              allowableActions: el.allowableActions
            }));
            return $('<tr></tr>')
              .append(tdText)
              .append(tdButton);
          },
          after: function (documents) {
            $("#items").parent().find('.totalnumItems').remove();
            $('#orderBy').after("<div class='totalnumItems pull-right badge badge-important animated flash'> Trovate n." + documents.totalNumItems + " variazioni.</div>");
          }
        }
      }
    };


  function manageFilterClick() {
    var search = new AdvancedSearch(options);
    search.setBulkinfo(bulkInfo);
    search.buildRawJoin(joinQueryName, strorgBulkInfo);

    try {
      search.executeQuery(queryName);
    } catch (exception) {
      UI.alert(exception);
    }

  }

  function splitVariazioni() {
    var s = $('#variazioni').val();
    $('#variazioni').val($.grep(s.split(/[^0-9]+/g), function (s) {
      return s && s.length;
    }).join(','));
  }

  $('#applyFilter').click(function () {
    splitVariazioni();
    manageFilterClick();
  });

  $('#resetFilter').click(function () {
    $.each($('#filters input,textarea'), function (key, el) {
      $(el).val("");
    });
    $('#filters .widget').data('value', '');
    manageFilterClick();
    return false;
  });

  $('#compress').click(function () {
    var formData = {},
      input = [].concat(bulkInfo.getData()).concat(strorgBulkInfo.getData()),
      re = /([àèéìòù\\\|\"\£\/\?\*\ç\°\§\:\.])+/;

    formData.zipName = $('#zipName').val();

    if (re.test(formData.zipName)) {
      UI.info("Non Utilizzare lettere accentate oppure caratteri come \\ | \" . : £ / ? * ç ° § ");
    } else if (bulkInfo.getDataValueById('cds') === "" && bulkInfo.getDataValueById('variazioni') === "") {
      UI.info("Valorizzare il CdS o il numero di Variazioni!");
    } else {
      splitVariazioni();
      $.each(input, function (index, item) {
        formData[item.name] = item.value;
      });
      URL.Data.zipper({
        type: 'POST',
        data: formData,
        success: function () {
          UI.info('Richiesta partita in background. Una mail ti comunicherà la fine dell\'elaborazione.');
        }
      });
    }
  });

  bulkInfo = new BulkInfo({
    target: $('#filters'),
    formclass: 'form-horizontal jconon',
    path: 'VariazioniBulkInfo',
    kind: 'find',
    name: 'search',
    callback : {
      afterCreateForm: function (form) {
        manageFilterClick();
      }
    }
  });

  strorgBulkInfo = new BulkInfo({
    target: $('#filters'),
    formclass: 'form-horizontal jconon',
    path: 'StrorgBulkInfo',
    kind: 'find',
    name: 'search'
  });

  strorgBulkInfo.render().done(function () {
    bulkInfo.render();
  });

});