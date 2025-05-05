/*global params*/
define(['jquery', 'i18n', 'header', 'cnr/cnr.search',
  'cnr/cnr.bulkinfo', 'cnr/cnr.ui',
  'json!common', 'cnr/cnr.jconon', 'cnr/cnr.url', 'cnr/cnr.call', 'cnr/cnr.ace', 'json!cache'
  ], function ($, i18n, header, Search, BulkInfo, UI, common, jconon, URL, Call, Ace, cache) {
  "use strict";
  var callTypes = [], rootTypeId = 'F:jconon_call:folder',
    rootQueryTypeId = 'jconon_call:folder root',
    ul = $('.cnraffix'),
    aAllCall = $('<a href="#items"><i class="icon-chevron-right"></i>' + i18n.prop(rootTypeId, 'Tutti i Bandi') + '</a>'),
    liAllCall = $('<li class="active"></li>').append(aAllCall).appendTo(ul),
    elements = {
      table: $('#items'),
      pagination: $('#itemsPagination'),
      orderBy: $('#orderBy'),
      label: $('#emptyResultset'),
      total: $('#total'),
      //icone per l'export dei dati
      exportPanel:  $('<div id="export-div" class="float-right mb-1 mr-1">' +
                      '<a id="export-xls" title="Esporta dati in Excel" class="btn btn-success" style="display:none">' +
                      ' <i class="icon-table"></i></a>' +
                      '</div>').appendTo($('#header-table'))
    },
    search,
    bulkInfo;
  $.each(cache.jsonlistCallType, function (index, el) {
    callTypes.push({
      "key" : el.id,
      "label" : el.id,
      "defaultLabel" : el.title
    });
  });
  function manageFilterClick() {
    $('#applyFilter').on('click', function () {
      search.changeType(rootQueryTypeId);
      Call.filter(bulkInfo, search);
    });
    $('#filters-attivi_scaduti').closest('.widget').on('setData', function (event, key, value) {
      Call.filter(bulkInfo, search, null, null, null, value);
    });
    $('#resetFilter').on('click', function () {
      search.changeType(rootQueryTypeId);
      $('#F\\:jconon_call\\:folder input').val('');
      $('#F\\:jconon_call\\:folder select').select2('val','');
      $('#profilo').select2('val','');
      $('#filters-attivi_scaduti button').removeClass('active');
      $('#filters-attivi_scaduti button[data-value=tutti]').addClass('active');
      $('#F\\:jconon_call\\:folder .widget:not(:has(#filters-attivi_scaduti))').data('value', '');
      $('#filters-attivi_scaduti').parents('.widget').data('value', 'tutti');
    });
  }

  function estraixls(urlparams, type) {
    var close = UI.progress();
      jconon.Data.call.applications({
        type: 'GET',
        data:  {
            urlparams: urlparams,
            type: type,
            queryType: 'call'
        },
        success: function (data) {
          UI.info(i18n.prop('message.jconon_application_estrai_domande', common.User.email));
        },
        complete: close,
        error: URL.errorFn
    });
  }

  function displayCall(typeId, queryTypeId) {
    URL.Data.bulkInfo({
      placeholder: {
        path: typeId,
        kind: 'column',
        name: 'search'
      },
      data: {
        guest : true
      },
      success: function (data) {
        var columns = [],
          sortFields = {
            'nome': false,
            'data di creazione': false
          };
        $.map(data[data.columnSets[0]], function (el) {
          if (el.inSelect !== false) {
            columns.push(el.property);
          }
        });
        $.each(data[data.columnSets[0]], function (index, el) {
          if (el['class'] && el['class'].split(' ').indexOf('sort') >= 0) {
            sortFields[i18n.prop(el.label, el.label)] = el.property;
          }
        });
        search = new Search({
          elements: elements,
          maxItems: 10,
          fetchCmisObject: true,
          type: queryTypeId,
          calculateTotalNumItems: true,
          fields: sortFields,
          orderBy: [{
            field: "jconon_call:data_fine_invio_domande_index",
            asc: false
          }],
          dataSource: function (page, setting, getUrlParams) { 
            var deferred;             
            $('#export-xls').off('click').on('click', function () {
                var onlyCall = $('<button class="btn btn-primary span2 h-100" data-dismiss="modal" title="Scarica un file excel con le informazioni dei Bandi"><i class="icon-download-alt"></i> Bandi</button>').
                      off('click').on('click', function () {
                        estraixls(getUrlParams(page).q, 'call');
                    }),
                    onlyCommission = $('<button class="btn btn-primary span2 h-100" data-dismiss="modal" title="Scarica un file excel con le informazioni delle Commissioni"><i class="icon-download-alt"></i> Commi ssioni</button>').
                      off('click').on('click', function () {
                        estraixls(getUrlParams(page).q, 'commission');
                    }),
                    allApplication = $('<button class="btn btn-success span2 h-100" data-dismiss="modal" title="Scarica un file excel delle domande confermate"><i class="icon-download-alt"></i> Dati relativi alle domande</button>').
                      off('click').on('click', function () {
                        estraixls(getUrlParams(page).q, 'application');
                    }),
                    allPunteggi = $('<button class="btn btn-info span3 h-100" data-dismiss="modal" title="Scarica un file excel dei punteggi e della graduatoria"><i class="icon-download-alt"></i> Dati relativi ai punteggi e alle graduatoria</button>').
                      off('click').on('click', function () {
                        estraixls(getUrlParams(page).q, 'score');
                    }),
                    allApplicationIstruttoria = $('<button class="btn btn-warning span3 h-100" data-dismiss="modal" title="Scarica un file excel con tutti i dati delle domande"><i class="icon-download-alt"></i> Dati relativi alle domande per istruttoria</button>').
                      off('click').on('click', function () {
                        estraixls(getUrlParams(page).q, 'istruttoria');
                    }),
                  btnClose,
                  modalField = $('<div class="row-fluid h-90px modal-inner-fix">'),
                  m;
                modalField.append(onlyCall).append(onlyCommission).append(allApplication).append(allPunteggi).append(allApplicationIstruttoria);
                m = UI.modal('<i class="icon-table text-success"></i> Estrazione excel relative ai bandi filtrati', modalField);
                $('button', modalField).tooltip({
                  placement: 'bottom',
                  container: modalField
                });
            });
            search.changeType(rootQueryTypeId);
            if (bulkInfo.getDataValueById('profilo') && search.changeType().indexOf('jconon_call:aspect_inquadramento') == -1) {
              search.changeType(jconon.joinQuery(search.changeType(), ['P:jconon_call:aspect_inquadramento'], undefined, 'root'));
            }
            if (((bulkInfo.getDataValueById('filter_numero_gu') || bulkInfo.getDataValueById('filter_data_gu') ||
                setting.orderBy.filter(function (elem) {return elem.field == 'jconon_call:data_gu_index'}).length > 0) ||
                (bulkInfo.getDataValueById('filter_new_numero_gu') || bulkInfo.getDataValueById('filter_new_data_gu') ||
                setting.orderBy.filter(function (elem) {return elem.field == 'jconon_call:new_data_gu'}).length > 0)) &&
                search.changeType().indexOf('jconon_call:aspect_gu') == -1) {
              search.changeType(jconon.joinQuery(search.changeType(), ['P:jconon_call:aspect_gu'], undefined, 'root'));
            }
            if ((bulkInfo.getDataValueById('filter_data_inpa_from') || bulkInfo.getDataValueById('filter_data_inpa_to')) &&
                search.changeType().indexOf('jconon_call:aspect_inpa') == -1) {
              search.changeType(jconon.joinQuery(search.changeType(), ['P:jconon_call:aspect_inpa'], undefined, 'root'));
            }
            deferred = URL.Data.search.query({
                queue: setting.disableRequestReplay,
                data: getUrlParams(page)
            });
            deferred.done(function (data) {
              if (elements.total) {
                elements.total.text(data.totalNumItems + ' bandi trovati in totale');
              }
            });
            return deferred;
          },
          mapping: function (mapping, doc) {
            $.each(data[data.columnSets[0]], function (index, el) {
              mapping[el.name] = doc[el.property] !== undefined ? doc[el.property] : null;
            });
            mapping.aspect = doc.aspect !== undefined ? doc.aspect : null;
            return mapping;
          },
          display: {
            resultSet: function (resultSet, target) {
                if (common.User.admin || Call.isConcorsi()) {
                    $('#export-xls').fadeIn(0);
                } else {
                    $.each(resultSet, function (index, el) {
                        if(Call.isRdP(el['jconon_call:rdp'])) {
                            $('#export-xls').fadeIn(0);
                        }
                    });
                }
            	Call.displayRow(bulkInfo, search, typeId, rootTypeId, resultSet, target);
            }
          }
        });
        Call.filter(bulkInfo, search);
      }
    });
  }

  function changeActiveState(btn) {
    btn.parents('ul').find('.active').removeClass('active');
    btn.parent('li').addClass('active');
  }
  aAllCall.click(function (eventObject) {
    changeActiveState($(eventObject.target));
    displayCall(rootTypeId, rootQueryTypeId);
  });

  bulkInfo = new BulkInfo({
    target: $('#criteria'),
    formclass: 'form-horizontal jconon',
    path: rootTypeId,
    name: 'all-filters',
    callback : {
      beforeCreateElement: function (item) {
        if (item.name === 'filters-codice') {
          item.val = params.query;
        } else if (item.name === 'call-type') {
          item.jsonlist = callTypes;
        }
        if (params[item.name]) {
          item.val = params[item.name];
        }
      },
      afterCreateForm: function (form) {
        form.keypress(function (e) {
          if (e.which == 13) {
            $('#applyFilter').click();
            return false;    //<---- Add this line
          }
        });
        manageFilterClick();
        displayCall(rootTypeId, rootQueryTypeId);
      }
    }
  });
  bulkInfo.render();

  $.each(cache.jsonlistCallType, function (index, el) {
    var li = $('<li></li>'),
      a = $('<a href="#items"><i class="icon-chevron-right"></i>' + i18n.prop(el.id, el.title) + '</a>').click(function (eventObject) {
        changeActiveState($(eventObject.target));
        displayCall(el.id, el.queryName);
      });
    li.append(a).appendTo(ul);
  });
});