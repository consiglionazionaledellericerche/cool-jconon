/*global params*/
define(['jquery', 'list', 'header', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.bulkinfo', 'cnr/cnr.jconon', 'cnr/cnr.url',
  'cnr/cnr.application', 'cnr/cnr.attachments', 'cnr/cnr.search', 'cnr/cnr.criteria', 'cnr/cnr', 'cnr/cnr.ace', 'cnr/cnr.node', 'cnr/cnr.actionbutton', 'json!common'], function ($, List, header, i18n, UI, BulkInfo, jconon, URL, Application, Attachments, Search, Criteria, CNR, Ace, Node, ActionButton, common) {
  "use strict";
  var nodeRef = params.nodeRef,
    applicationId = params.applicationId,
    alfcmisNoderef,
    tbody = $('#versions .list'),
    dateFormat = "DD/MM/YYYY HH:mm",
    criteria = new Criteria(),
    listoptions = {
      valueNames: ['versionLabel', 'lastModificationDate', 'lastModifiedBy', 'contentStreamLength', 'scheda_valutazione_commento']
    },
    versionList,
    versioni = new Search({
      dataSource: function () {
        return URL.Data.search.version({
          queue: true,
          data: {
            nodeRef: URL.querystring.from.nodeRef
          }
        });
      },
      display : {
        row : function (el, refreshFn, permission) {
          var tr = $('<tr>'),
            tdActionButton = $('<td>'),
            defaultChoice = 'download',
            customButtons = {
              history: false,
              permissions: false,
              update: false,
              copy: false,
              cut: false,
              remove: function () {
                UI.confirm('Sei sicuro di voler eliminare la versione ' + el['cmis:versionLabel'] + '?', function () {
                  URL.Data.proxy.version({
                    type: 'DELETE',
                    placeholder: {
                      nodeRef: alfcmisNoderef,
                      versionLabel: el['cmis:versionLabel']
                    }
                  }).done(function (data) {
                    if (data.success) {
                      UI.success('Eliminata la versione ' + el['cmis:versionLabel']);
                      $('.table tbody').children().remove();
                      criteria.list(versioni);
                    } else {
                      UI.error('Impossibile eliminare la versione ' + el['cmis:versionLabel']);
                    }
                  }).error(function () {
                    UI.error('Impossibile eliminare la versione ' + el['cmis:versionLabel']);
                  });
                });
              },
              download: function () {
                window.location = URL.urls.search.content + '?nodeRef=' + el['cmis:objectId'];
                return false;
              }
            };
          tr.appendTo(tbody).append($('<td>').append('<b>Versione </b>')
            .append($('<a class="label label-info versionLabel">').on('click', function (event) {
              window.location = URL.urls.search.content + '?nodeRef=' + el['cmis:objectId'];
              return false;
            })
               .append(el['cmis:versionLabel']))
            .append($('<span class="lastModifiedBy">').append(' aggiornata da ').append($('<a href="#">')
               .append(el['jconon_attachment:user'] || el['cmis:lastModifiedBy'])))
            .append($('<span class="lastModificationDate">')
               .append(', il ' + CNR.Date.format(el['cmis:lastModificationDate'], '-', dateFormat)))
            .append($('<span class="contentStreamLength">')
               .append(' di dimensione ' + CNR.fileSize(el.contentStreamLength)))
            .append($('<p class="scheda_valutazione_commento">')
               .append('<b>Commento: </b>' + el['jconon_attachment:scheda_valutazione_commento']))
            );
          new ActionButton.actionButton({
            name: el.name,
            nodeRef: el.id,
            baseTypeId: el.baseTypeId,
            objectTypeId: el.objectTypeId,
            mimeType: el.contentType,
            allowableActions: el.allowableActions,
            defaultChoice: defaultChoice
          }, {
            edit: 'CAN_CREATE_DOCUMENT',
            remove: 'CAN_GET_PROPERTIES'
          }, customButtons, {download: 'icon-download'}).appendTo(tdActionButton);
          tr.append(tdActionButton);
        },
        after : function (documents) {
          alfcmisNoderef = documents.items[0]['alfcmis:nodeRef'];
          tbody.find('.lastModifiedBy').off('click').on('click', function (event) {
            Ace.showMetadata(event.target.text);
            return false;
          });
          versionList = new List('versions', listoptions);
        }
      }
    });
  criteria.list(versioni);
  $("#upload").on('click', function (event) {
    Node.submission({
      nodeRef: nodeRef,
      objectType: 'D:jconon_attachment:scheda_valutazione',
      crudStatus: "UPDATE",
      requiresFile: true,
      showFile: true,
      externalData: [
        {
          name: 'jconon_attachment:user',
          value: common.User.id
        }
      ],
      success: function (data) {
        $('.table tbody').children().remove();
        criteria.list(versioni);
      },
      forbidArchives: true
    });
    return false;
  });
  $("#delete").on('click', function (event) {
    UI.confirm('Sei sicuro di voler eliminare la scheda di valutazione?', function () {
      Node.remove(nodeRef, function () {
        window.history.back(1);
      });
    });
    return false;
  });
  URL.Data.search.query({
    data: {
      q: "select jconon_application:cognome, jconon_application:nome, cmis:objectId " +
        "from jconon_application:folder where cmis:objectId = '" + applicationId + "'",
      relationship: 'parent'
    },
    success: function (data) {
      var application = data.items[0], call = application.relationships.parent[0];
      $('#title-scheda').html(i18n.prop('title.scheda.valutazione',
        application['jconon_application:cognome'],
        application['jconon_application:nome'],
        call['jconon_call:codice']));
    }
  });
});