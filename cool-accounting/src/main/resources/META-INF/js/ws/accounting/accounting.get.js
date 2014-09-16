define(['jquery', 'header', 'i18n', 'cnr/cnr', 'cnr/cnr.search', 'cnr/cnr.tree', 'cnr/cnr.actionbutton', 'cnr/cnr.validator', 'cnr/cnr.url', 'cnr/cnr.criteria', 'cnr/cnr.bulkinfo'], function ($, header, i18n, CNR, Search, Tree, ActionButton, Validator, URL, Criteria, BulkInfo) {
  "use strict";
  /* utility functions */
  // inizializzazione del pannello di ricerca

  var orderLabel = {
      'Esercizio' : 'sigla_contabili_aspect:esercizio',
      'Num. Mandato' : 'sigla_contabili_aspect:num_mandato',
      'Data Esecuzione' : 'sigla_contabili_aspect:data_esecuzione'
    },
    folderChange,
    bulkInfo,
    search = new Search({
      elements: {
        table: $("#items"),
        pagination: $("#itemsPagination"),
        orderBy: $("#orderBy"),
        label: $("#emptyResultset")
      },
      type: "cmis:document doc join sigla_contabili_aspect:document contabili on doc.cmis:objectId = contabili.cmis:objectId",
      fields: orderLabel,
      calculateTotalNumItems: true,
      mapping: function (mapping, doc) {
        mapping.esercizio = doc["sigla_contabili_aspect:esercizio"];
        mapping.cds = doc["sigla_contabili_aspect:cds"];
        mapping.num_mandato = doc["sigla_contabili_aspect:num_mandato"];
        mapping.data_esecuzione = doc["sigla_contabili_aspect:data_esecuzione"];
        return mapping;
      },
      display: {
        row : function (el) {
          var tdText,
            tdButton,
            item = $('<a href="#">' + el.name + '</a>'),
            isFolder = el.baseTypeId === "cmis:folder",
            annotation = $('<span class="muted annotation">modificato ' + CNR.Date.format(el.lastModificationDate) + ' da ' +  el.lastModifiedBy + '</span>'),
            annotationContabile = $('<span class="muted annotation">' +
              i18n['esercizio.label'] + ': ' + el.esercizio + ' ' +
              i18n['cds.label'] + ': ' +  el.cds + ' ' +
              i18n['num_mandato.label'] + ': ' +  el.num_mandato + ' ' +
              i18n['data_esecuzione.label'] + ': ' +  CNR.Date.format(el.data_esecuzione, null, 'DD/MM/YYYY') + ' ' +
              i18n['data_invio.label'] + ': ' +  CNR.Date.format(el['cmis:creationDate'], null, 'DD/MM/YYYY') +

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
          $('#orderBy').after("<div class='totalnumItems pull-right badge badge-important animated flash'> Trovate n." + documents.totalNumItems + " contabili.</div>");
        }
      }
    }),
    explorerItems = $('.explorerItem'); //TODO: non serve !!!

  function manageFilterClick() {
    var criteria = new Criteria();
    search.changeType("cmis:document doc join sigla_contabili_aspect:document " +
      "contabili on doc.cmis:objectId = contabili.cmis:objectId");
    $.each(bulkInfo.getFieldProperties(), function (index, el) {
      var propValue = bulkInfo.getDataValueById(el.name),
        re = /^criteria\-/;
      if (el.property) {
        if (el['class'] && propValue) {
          $(el['class'].split(' ')).each(function (index, myClass) {
            if (re.test(myClass)) {
              var fn = myClass.replace(re, '');
              criteria[fn](el.property, propValue, el.widget === 'ui.datepicker' ? 'date' : null);
            }
          });
        } else {
          if (propValue) {
            criteria.equals(el.property, propValue);
          }
        }
      }
    });
    criteria.list(search);
  }
  $('#applyFilter').click(function () {
    manageFilterClick();
  });
  $('#resetFilter').click(function () {
    $.each($('#filters input'), function (key, el) {
      $(el).val("");
    });
    $('#filters .widget').data('value', '');
    manageFilterClick();
    return false;
  });
  $('#showDiscarded').click(function () {
    search.changeType("cmis:document doc join sigla_contabili_aspect:discarded_document " +
      "contabili on doc.cmis:objectId = contabili.cmis:objectId");
    search.changeOrder({field: "cmis:lastModificationDate", asc: false});
    return false;
  });

  folderChange = function (itemFolder, isRoot) {
    var nodeRef = itemFolder.nodeRef, allowableactions = itemFolder.allowableActions;
    isRoot = isRoot || false;
    // show explorer items
    explorerItems.removeClass('hide');
    search.displayDocs(nodeRef);
    if (!isRoot) {
      Tree.openNode(nodeRef);
    }
  };

  URL.Data.search.query({
    data: {
      q: "select cmis:objectId, cmis:name from sigla_contabili_aspect:folder order by cmis:name",
      maxItems : 1000
    },
    success: function (data) {
      var nodeRefs = $.map(data.items, function (el) {
          var obj = {
            attr : {
              id : el['cmis:objectId'],
              rel : 'folder',
              type : 'cmis:folder'
            },
            data : el['cmis:name'],
            state : 'closed'
          };
          return obj;
        });
      Tree.init({
        dataSource : function (node, callback) {
          if (node.attr) {
            URL.Data.search.children({
              data: {
                parentFolderId : node.attr("id").replace("node_", "")
              },
              success: callback
            });
          } else {
            callback(nodeRefs);
          }
        },
        elements: {
          target: $("#collection-tree")
        },
        selectNode: function (data) {
          var nodeRef = data.id, tail;

          // given the tree as a json object and a folder name, retrieves the nodeRef and the children of the folder
          function getElement(obj, key) {
            var item = $(obj).filter(function (index, item) {
              return item.data === key;
            })[0];
            return {
              nodeRef: item.attr.id,
              children: item.children
            };
          }

          // remove the last element of the tree path (i.e. array of strings)
          data.current_path.splice(data.current_path.length - 1, 1);

          folderChange({name: data.name, nodeRef: nodeRef, allowableActions: data.allowableactions});
        }
      });
    }
  });
  bulkInfo = new BulkInfo({
    target: $('#filters'),
    formclass: 'form-horizontal jconon',
    path: 'AccountingBulkInfo',
    name: 'all-filters',
    callback : {
      afterCreateForm: function (form) {
        manageFilterClick();
      }
    }
  });
  bulkInfo.render();

});