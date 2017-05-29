define(['jquery', 'header', 'json!common', 'json!cache', 'cnr/cnr.bulkinfo', 'cnr/cnr.search', 'cnr/cnr.url', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.actionbutton', 'cnr/cnr.jconon', 'handlebars', 'cnr/cnr', 'moment', 'cnr/cnr.application', 'cnr/cnr.criteria', 'cnr/cnr.ace', 'cnr/cnr.call', 'cnr/cnr.node'], function ($, header, common, cache, BulkInfo, Search, URL, i18n, UI, ActionButton, jconon, Handlebars, CNR, moment, Application, Criteria, Ace, Call, Node) {
  "use strict";
  var orderLabel = {
      'Titolo' : 'avvisi:type',
      'Data di pubblicazione' : 'avvisi:data',
      'Data di scadenza' : 'avvisi:dataScadenza'
    },
    bulkInfo,
    criteriaFilters = $('#criteria'),
    search = new Search({
        elements: {
          table: $("#items"),
          pagination: $("#itemsPagination"),
          orderBy: $("#orderBy"),
          label: $("#emptyResultset")
        },
        type: "avvisi:document",
        fields: orderLabel,
        calculateTotalNumItems: true,
        maxItems: 5,
        display : {
          row : function (el, refreshFn, permission) {
            var tdText, item = $('<div style="white-space:normal" align="justify"></div>'),
                btnGroup = $('<div class="btn-group pull-right"></div>'),
                btnDelete = $('<button class="delete btn btn-small btn-danger"><i class="icon-trash icon-white"></i> Cancella</button>').data('nodeRef', el['alfcmis:nodeRef']),
                btnEdit = $('<a href="' + URL.urls.root + 'frontOfficeCreateModify?nodeRef=' + el['alfcmis:nodeRef'] + '" class="edit btn btn-small"><i class="icon-edit icon-white"></i> Modifica</a>'),
                titolo = $('<h5 class="text-info">').text(el['avvisi:type']);

              btnGroup.append(btnDelete).append(' ');
              btnGroup.append(' ').append(btnEdit);
              item.append(titolo);
              item.append('<strong>Titolo: </strong>').append(el['avvisi:title']).append('<br/>');
              item.append('<strong>Testo: </strong>' + el['avvisi:text']).append('<br/>')
                .append('<strong>Data di pubblicazione: </strong>' + CNR.Date.format(el['avvisi:data'], null, 'dddd DD MMMM YYYY')).append('<br/>');
              item.append('<strong>Data di scadenza: </strong>' + CNR.Date.format(el['avvisi:dataScadenza'], null, 'dddd DD MMMM YYYY')).append('<br/>');
              item.append(btnGroup);
              tdText = $('<td></td>')
                .addClass('span12')
                .append(item);
              return $('<tr></tr>')
                    .append(tdText);
          }
        }
    }),
    bulkInfo = new BulkInfo({
        target: criteriaFilters,
        formclass: 'form-horizontal jconon',
        path: 'D:avvisi:document',
        name: 'filters',
        callback : {
          afterCreateForm: function (form) {
            form.keypress(function (e) {
              if (e.which == 13) {
                filter();  
                return false;    //<---- Add this line
              }
            });
            $('#resetFilter').on('click', function () {
              criteriaFilters.find('input').val('');
              criteriaFilters.find('textarea').val('');
              criteriaFilters.find('.widget').data('value', '');

              var btns = criteriaFilters.find('.btn-group-vertical .btn');

              btns
                .removeClass('active');

              criteriaFilters
                .find('.btn-group-vertical')
                .find('.default')
                .addClass('active');
              filter();  
            });
            $('#applyFilter').on('click', filter);
            filter();
          }
        }
    });
  bulkInfo.render();
  function filter() {
    jconon.getCriteria(bulkInfo).list(search);
  };
  $("#items").on('click', '.delete', function (event) {
      var nodeRef = $(event.target).data('nodeRef'),
        reNodeRef = new RegExp("([a-z]+)\\:\/\/([a-z]+)\/(.*)", 'gi');
      URL.Data.frontOffice.nodeRef({
        processData: false,
        type: "DELETE",
        placeholder: {
          'store_type' : nodeRef.replace(reNodeRef, '$1'),
          'store_id' : nodeRef.replace(reNodeRef, '$2'),
          'id' : nodeRef.replace(reNodeRef, '$3')
        },
        success: function (data) {
            filter();
        },
        error: function () {
          UI.error('Errore nella rimozione dei Documenti');
        }
      });
      return false;
  });
  //css specifici per alcuni campi dei documenti visualizzati
  function getBadge(type) {
    var el, t = {
      Browser: {
        label: "Browser",
        css: 'badge-warning'
      },
      AjaxError: {
        label: "AjaxError",
        css: 'badge-important animated flash'
      },
      Visibile: {
        label: "Visibile",
        css: 'badge-inverse animated flash'
      },
      Nascosto: {
        label: "Nascosto",
        css: 'animated flash'
      },

      alert: {
        label: "alert",
        css: 'animated flash'
      },
      error: {
        label: "error",
        css: 'badge-important animated flash'
      },
      information: {
        label: "info",
        css: 'badge-info animated flash'
      },
      success: {
        label: "success",
        css: 'badge-success animated flash'
      },
      warning: {
        label: "warning",
        css: 'badge-warning animated flash'
      }
    };
    el = $('<span class="badge">' + (t[type] ? t[type].label : ' '  + type) + '</span>');
    if (t[type] && t[type].css) {
      el.addClass(t[type].css);
    }
    return el;
  }
});