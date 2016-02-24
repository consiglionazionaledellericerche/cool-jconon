define(['jquery', 'header', 'json!common', 'json!cache', 'cnr/cnr.bulkinfo', 'cnr/cnr.search', 'cnr/cnr.url', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.actionbutton', 'cnr/cnr.jconon', 'handlebars', 'cnr/cnr', 'moment', 'cnr/cnr.application', 'cnr/cnr.criteria', 'cnr/cnr.ace', 'cnr/cnr.call', 'cnr/cnr.node'], function ($, header, common, cache, BulkInfo, Search, URL, i18n, UI, ActionButton, jconon, Handlebars, CNR, moment, Application, Criteria, Ace, Call, Node) {
  "use strict";
  var rootFolderId = params['cmis:objectId'],
    criteria = new Criteria(),
    search = new Search({
      elements: {
        table: $("#items"),
        pagination: $("#itemsPagination"),
        orderBy: $("#orderBy"),
        label: $("#emptyResultset")
      },
      type: "jconon_scheda_anonima:generated_document doc join jconon_scheda_anonima:valutazione tit on doc.cmis:objectId = tit.cmis:objectId",
      calculateTotalNumItems: true,
      maxItems: 100,
      display : {
        row : function (el, refreshFn, permission) {
          var tdText,
            tdButton,
            isFolder = el.baseTypeId === 'cmis:folder',
            item = $('<a href="#">' + el.name + '</a>'),
            customButtons = {
              history : false,
              copy: false,
              cut: false,
              update: false,
              edit: false
            },
            esito = el['jconon_scheda_anonima:valutazione_esito'],
            annotationValutazione = $('<label class="label h2"></label>')
              .addClass(esito === '' ? 'label-warning' : (esito == true ? 'label-success' : 'label-important'))
              .addClass('animated flash')
              .append(esito === '' ? 'Scheda non ancora valutata': (esito == true ? 'Scheda Approvata' : 'Scheda Respinta')),
            annotation = $('<span class="muted annotation">ultima modifica: ' + CNR.Date.format(el.lastModificationDate, null, 'DD/MM/YYYY H:mm') + '</span>');
          if (permission !== undefined) {
            customButtons.permissions = permission;
          }
          item.attr('href', URL.urls.search.content + '?nodeRef=' + el.id + '&guest=true');
          item.after(annotation.prepend(', ').prepend(CNR.fileSize(el.contentStreamLength)));
          item.after($('<span class="muted annotation"></span>').append(annotationValutazione));

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
          }, null, customButtons, null, refreshFn));
          return $('<tr></tr>')
            .append(tdText)
            .append(tdButton);
        }
      }
    });
    criteria.inTree(rootFolderId, 'doc').list(search);
});