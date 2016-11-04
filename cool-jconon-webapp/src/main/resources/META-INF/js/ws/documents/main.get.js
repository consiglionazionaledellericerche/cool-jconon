define(['jquery', 'header', 'json!common', 'json!cache', 'cnr/cnr.bulkinfo', 'cnr/cnr.search', 'cnr/cnr.url', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.actionbutton', 'cnr/cnr.jconon', 'handlebars', 'cnr/cnr', 'moment', 'cnr/cnr.application', 'cnr/cnr.criteria', 'cnr/cnr.ace', 'cnr/cnr.call', 'cnr/cnr.node'], function ($, header, common, cache, BulkInfo, Search, URL, i18n, UI, ActionButton, jconon, Handlebars, CNR, moment, Application, Criteria, Ace, Call, Node) {
  "use strict";
  var orderLabel = {
      'Nome' : 'cmis:name',
      'Titolo' : 'cm:title',
      'Descriziomne' : 'cm:description'
    },
    folderChange,
    bulkInfo,
    criteriaFilters = $('#criteria'),
    rootFolderId,
    search;  
  URL.Data.search.folderByPath({
    data: {
      path: cache.competition.path + '/documents/' + common.pageId
    },
    success: function (data) {
      search = new Search({
        elements: {
          table: $("#items"),
          pagination: $("#itemsPagination"),
          orderBy: $("#orderBy"),
          label: $("#emptyResultset")
        },
        type: "cmis:document doc join cm:titled tit on doc.cmis:objectId = tit.cmis:objectId",
        fields: orderLabel,
        calculateTotalNumItems: true,
        maxItems: 100,
        display : {
          row : function (el, refreshFn, permission) {
            return jconon.defaultDisplayDocument(el, refreshFn, permission, true, true);
          }
        }
      });
      rootFolderId = data.id;
      bulkInfo =  new BulkInfo({
        target: criteriaFilters,
        formclass: 'form-horizontal jconon',
        path: 'cmis:document',
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
    }    
  });

  function filter() {
    var criteria = jconon.getCriteria(bulkInfo),
      propValue = bulkInfo.getDataValueById('contenuto');
    if (propValue) {
      criteria.contains(propValue, 'doc');
    }
    criteria.inFolder(rootFolderId, 'doc').list(search);
  };
});