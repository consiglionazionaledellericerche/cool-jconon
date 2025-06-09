define(['jquery', 'header', 'json!common', 'json!cache', 'cnr/cnr.bulkinfo', 'cnr/cnr.search', 'cnr/cnr.url', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.actionbutton', 'cnr/cnr.jconon', 'handlebars', 'cnr/cnr', 'moment', 'cnr/cnr.application', 'cnr/cnr.criteria', 'cnr/cnr.ace', 'cnr/cnr.call', 'cnr/cnr.node'], function ($, header, common, cache, BulkInfo, Search, URL, i18n, UI, ActionButton, jconon, Handlebars, CNR, moment, Application, Criteria, Ace, Call, Node) {
  "use strict";
  var orderLabel = {
      'Codice' : 'jconon_attachment_pta:codice',
      'Daescrizione' : 'jconon_attachment_pta:descrizione',
      'Data Inizio' : 'jconon_attachment_pta:inizio',
      'Data Fine' : 'jconon_attachment_pta:fine'
    },
    folderChange,
    folder = params['folder'] || common.pageId,
    isUploadEnable = false,
    bulkInfo,
    criteriaFilters = $('#criteria'),
    rootFolderId,
    search;  
  URL.Data.search.folderByPath({
    data: {
      path: cache.competition.path + '/documents/' + folder
    },
    success: function (data) {
      isUploadEnable = data.allowableActions.indexOf('CAN_CREATE_DOCUMENT') != -1;
      search = new Search({
        elements: {
          table: $("#items"),
          pagination: $("#itemsPagination"),
          orderBy: $("#orderBy"),
          label: $("#emptyResultset")
        },
        type: "jconon_attachment_pta:document doc",
        fields: orderLabel,
        calculateTotalNumItems: true,
        maxItems: 100,
        display : {
          row : function (el, refreshFn, i18nLabelsObj) {
            return ptaDisplayDocument(el, refreshFn, undefined, true, true);
          }
        }
      });
      rootFolderId = data.id;
      bulkInfo =  new BulkInfo({
        target: criteriaFilters,
        formclass: 'form-horizontal jconon',
        path: 'D:jconon_attachment_pta:document',
        name: 'filter',
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
            if (isUploadEnable) {
                $('#createDocument').fadeIn(0);
                $('#createDocument').off('click').on('click', function (event) {
                    Node.submission({
                      nodeRef: rootFolderId,
                      objectType: 'D:jconon_attachment_pta:document',
                      crudStatus: "INSERT",
                      requiresFile: false,
                      showFile: true,
                      bigmodal: false,
                      externalData: [
                        {
                          name: 'jconon_attachment:user',
                          value: common.User.id
                        }
                      ],
                      success: function (data) {
                        $('#applyFilter').click();
                      },
                      forbidArchives: false
                    });
                    return false;
                });
            }
            $('#applyFilter').on('click', filter);
            filter();
          }
        }
      });
      bulkInfo.render();
    }    
  });

  function ptaDisplayDocument(el, refreshFn, permission, showLastModificationDate, showTitleAndDescription, extendButton, customIcons, maxUploadSize, i18nLabelsObj) {
    var tdText,
      tdButton,
      isFolder = el.baseTypeId === 'cmis:folder',
      item = $('<a href="#">' + el.name + '</a>'),
      customButtons = $.extend({}, {
        history : false,
        copy: false,
        cut: false
      }, extendButton),
      typeLabel = i18nLabelsObj && i18nLabelsObj[el.objectTypeId] ? i18nLabelsObj[el.objectTypeId].newLabel : i18n[el.objectTypeId],
      annotationType = $('<span class="muted annotation">' + typeLabel  + '</span>'),
      annotation = $('<span class="muted annotation">ultima modifica: ' + CNR.Date.format(el.lastModificationDate, null, 'DD/MM/YYYY H:mm') + '</span>');
    if (permission !== undefined) {
      customButtons.permissions = permission;
    }
    item.attr('href', URL.urls.search.content + '?nodeRef=' + el.id + '&guest=true');
    item.after(annotationType);
    item.after($('<span class="muted annotation">' + '<b>Codice:</b> ' + el['jconon_attachment_pta:codice']  + '</span>'));
    item.after($('<span class="muted annotation">' + '<b>Descrizione:</b> ' + el['jconon_attachment_pta:descrizione'] + '</span>'));
    item.after($('<span class="muted annotation">Inizio: ' + CNR.Date.format(el['jconon_attachment_pta:inizio'], null, 'DD/MM/YYYY') + '</span>'));
    item.after($('<span class="muted annotation">Fine: ' + CNR.Date.format(el['jconon_attachment_pta:fine'], null, 'DD/MM/YYYY') + '</span>'));
    if (showLastModificationDate === false) {
      item.after('<span class="muted annotation">' + CNR.fileSize(el.contentStreamLength) + '</span>');
    } else {
      item.after(annotation.prepend(', ').prepend(CNR.fileSize(el.contentStreamLength)));
    }

    tdText = $('<td></td>')
      .addClass('span10')
      .append(CNR.mimeTypeIcon(el.contentType, el.name))
      .append(' ')
      .append(item);
    tdButton = $('<td></td>').addClass('span2').append(ActionButton.actionButton({
      name: el.name,
      nodeRef: el['alfcmis:nodeRef'],
      baseTypeId: el.baseTypeId,
      objectTypeId: el.objectTypeId,
      mimeType: el.contentType,
      allowableActions: el.allowableActions
    }, null, customButtons, customIcons, refreshFn, undefined, maxUploadSize));
    return $('<tr></tr>')
      .append(tdText)
      .append(tdButton);
  }
  function filter() {
    var criteria = jconon.getCriteria(bulkInfo),
      propValue = bulkInfo.getDataValueById('contenuto');
    if (propValue) {
      criteria.contains(propValue, 'doc');
    }
    criteria.inFolder(rootFolderId, 'doc').list(search);
  };
});