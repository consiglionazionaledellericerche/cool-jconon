define(['jquery', 'header', 'json!common', 'cnr/cnr.bulkinfo', 'cnr/cnr.search', 'cnr/cnr.url', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.actionbutton',
        'cnr/cnr.jconon', 'handlebars', 'cnr/cnr', 'moment', 'cnr/cnr.application', 'cnr/cnr.criteria', 'cnr/cnr.ace', 'cnr/cnr.call',
        'cnr/cnr.node', 'json!cache',  'cnr/cnr.attachments'],
function ($, header, common, BulkInfo, Search, URL, i18n, UI, ActionButton,
            jconon, Handlebars, CNR, moment, Application, Criteria, Ace, Call,
            Node, cache, Attachments) {

  "use strict";

  var search,
    rootTypeId = 'P:jconon_albo_commissione:person',
    typeId = 'P:jconon_albo_commissione:person',
    myType = 'jconon_albo_commissione:person',
    elements = {
      table: $('#items'),
      pagination: $('#itemsPagination'),
      orderBy: $('#orderBy'),
      label: $('#emptyResultset'),
      total: $('#total'),
      //icone per l'export dei dati
      exportPanel:  $('<div id="export-div" class="float-right mb-1 mr-1">' +
                        '<a id="export-xls" title="Esporta dati in Excel" class="btn btn-success" style="display:none">' +
                        ' <i class="icon-table"></i></a>' + '</div>').appendTo($('#header-table'))
    },
    bulkInfo,
    criteria = $('#criteria');

  Handlebars.registerHelper('switch', function(value, options) {
      this.switch_value = value;
      return options.fn(this);
  });

  Handlebars.registerHelper('case', function(value, options) {
      if (value == this.switch_value) {
        return options.fn(this);
      }
  });
  // filter ajax resultSet according to the Criteria form
  function filterFn(data) {
    data.items = filtered;
    data.totalNumItems = filtered.length;
    data.hasMoreItems = filtered.length > data.maxItemsPerPage;

    return data;
  }

  function filter() {
    search.execute();
  }

  function estraixls(urlparams) {
    var close = UI.progress();
      jconon.Data.commission.register({
        type: 'GET',
        data:  {
            urlparams: urlparams
        },
        success: function (data) {
            var url = URL.template(jconon.URL.call.downloadXLS, {
              objectId: data.objectId,
              fileName: data.fileName,
              exportData: true,
              mimeType: 'application/vnd.ms-excel;charset=UTF-8'
            });
            window.location = url;
        },
        complete: close,
        error: URL.errorFn
    });
  }

  search = new Search({
    elements: elements,
    orderBy: [{
        field: 'cmis:name',
        asc: false
    }],
    fetchCmisObject: true,
    type: 'jconon_albo_commissione:person',
    maxItems: 20,
    dataSource: function (page, settings, getUrlParams) {
      var deferred,
        baseCriteria = new Criteria().and(new Criteria().equals('jconon_albo_commissione:fl_autorizzazione', true).build()),
        criteria = jconon.getCriteria(bulkInfo),
        user = bulkInfo.getDataValueById('user');
      if (user) {
        criteria.and(new Criteria().equals('cmis:name', user).build());
      }
      if (cache['query.index.enable']) {
        criteria.inTree(cache['commission-register'].id);
      } else {
        criteria.inFolder(cache['commission-register'].id);
      }
      settings.lastCriteria = criteria.and(baseCriteria.build()).build();

      $('#export-xls').off('click').on('click', function () {
        estraixls(getUrlParams(page).q);
      });

      deferred = URL.Data.search.query({
        cache: false,
        queue: true,
        data: $.extend({}, getUrlParams(page), {
          fetchCmisObject: true
        })
      });

      deferred.done(function (data) {
        if (elements.total) {
          elements.total.text(data.totalNumItems + ' elementi trovati in totale');
        }
      });

      return deferred;
    },
    display: {
      resultSet: function (resultSet, target) {
        var xhr = new BulkInfo({
          target: $('<tbody>').appendTo(target),
          handlebarsId: 'commission-register-results',
          path: typeId,
          metadata: resultSet
        }).handlebars();

        xhr.done(function () {

          target
            .off('click', '.user')
            .on('click', '.user', function (event) {
              var authority = $(event.target).attr('data-user');
              Ace.showMetadata(authority, common.User.admin || Call.isConcorsi());
            });

          var rows = target.find('tbody tr');
          $.each(resultSet, function (index, el) {
            var target = $(rows.get(index)).find('td:last'),
              dropdowns = {},
              displayActionButton = true,
              defaultChoice = 'scarica_curriculum',
              titles = {},
              customButtons = {
                select: false,
                permissions: false,
                remove: false,
                copy: false,
                cut: false,
                history: false,
                edit: false,
                update: false
              };

            //  Scarica Curriculum
            customButtons.scarica_curriculum = function () {
              window.location = URL.urls.search.content + '?nodeRef=' + el.id + '&fileName=' + el['cm:title'];
            };
            //  Iscrizione all'albo
            if (el['jconon_albo_commissione:data_iscrizione']) {
                customButtons.rimuovi_data_iscrizione = function () {
                    var d= [
                        {id: 'cmis:objectId',name: 'cmis:objectId',value: el.id},
                        {id: 'cmis:objectTypeId',name: 'cmis:objectTypeId',value: 'cmis:document'},
                        {id: 'aspect',name: 'aspect',value: 'P:jconon_albo_commissione:person'},
                        {id: 'jconon_albo_commissione:data_iscrizione',name: 'jconon_albo_commissione:data_iscrizione',value: null}
                    ];
                    Node.updateMetadata(d, function (data) {
                        filter();
                    });
                };
            } else {
                customButtons.valorizza_data_iscrizione = function () {
                    var d= [
                        {id: 'cmis:objectId',name: 'cmis:objectId',value: el.id},
                        {id: 'cmis:objectTypeId',name: 'cmis:objectTypeId',value: 'cmis:document'},
                        {id: 'aspect',name: 'aspect',value: 'P:jconon_albo_commissione:person'},
                        {id: 'jconon_albo_commissione:data_iscrizione',name: 'jconon_albo_commissione:data_iscrizione',value: common.now}
                    ];
                    Node.updateMetadata(d, function (data) {
                        filter();
                    });
                };
            }
            if (displayActionButton) {
              new ActionButton.actionButton({
                name: el.name,
                nodeRef: el.id,
                baseTypeId: el.baseTypeId,
                objectTypeId: el.objectTypeId,
                mimeType: el.contentType,
                allowableActions: el.allowableActions,
                defaultChoice: defaultChoice
              }, {}, customButtons, {scarica_curriculum: 'icon-download-alt', rimuovi_data_iscrizione: 'icon-calendar', valorizza_data_iscrizione: 'icon-calendar'}, undefined, undefined, undefined, 'pull-right', titles).appendTo(target);
            }
          });
        });
      }
    }
  });

  bulkInfo =  new BulkInfo({
    target: criteria,
    formclass: 'form-horizontal jconon',
    path: 'P:jconon_albo_commissione:person',
    name: 'filters',
    callback : {
      afterCreateForm: function () {
        criteria.find('input:not("#user")').on('change', filter);

        $('#applyFilter').on('click', filter);

        criteria
          .find('.btn-group-vertical')
          .closest('.widget')
          .on('changeData', filter);

        $('#resetFilter').off('click').on('click', function () {
          criteria.find('input').val('');
          criteria.find('.widget.authority:visible').data('value', null);
          criteria.find('.widget:not(.authority):visible').data('value', null);

          var btns = criteria.find('.btn-group-vertical .btn');

          btns
            .removeClass('active');

          criteria
            .find('.btn-group-vertical')
            .find('.default')
            .addClass('active');

        });

        filter();
        $('#export-xls').show();
      }
    }
  });
  bulkInfo.render();
});