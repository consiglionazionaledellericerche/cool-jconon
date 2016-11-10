define(['jquery', 'header', 'cnr/cnr.ace', 'cnr/cnr.explorer', 'cnr/cnr.actionbutton', 'cnr/cnr.url', 'cnr/cnr.ui', 'cnr/cnr.bulkinfo', 'json!cache', 'i18n', 'cnr/cnr.node'], function ($, header, Ace, Explorer, ActionButton, URL, UI, BulkInfo, cache, i18n, Node) {
  "use strict";

  function groupGestoriModal(metadata) {
    var content = $("<div></div>").addClass('modal-inner-fix'),
      bulkinfo,
      isRoot = Explorer.getRootFolder() === Explorer.getSelectedFolder(),
      afterRender = function () {
        UI.bigmodal('Gruppo gestori', content, function () {
          if (bulkinfo.validate()) {
            var data = bulkinfo.getDataJSON(),
              groupData = {
                'parent_node_ref': Explorer.getSelectedFolder(),
                'group_name': data['cm:authorityName'],
                'display_name': data['cm:authorityDisplayName'],
                'zones': ['AUTH.EXT.gestori', 'APP.DEFAULT']
              };
            delete data.aspect;
            delete data['cmis:objectTypeId'];
            delete data['cm:authorityName'];
            if (!metadata) {
              delete data['cm:authorityDisplayName'];
            }
            groupData.extraProperty = data;
            URL.Data.proxy.group({
              type: 'POST',
              data: JSON.stringify(groupData),
              contentType: 'application/json'
            }).done(function () {
              UI.success((metadata ? 'Modificato ' : 'Creato ') + 'il gruppo ' + groupData.display_name);
              Explorer.refresh();
            }).fail(function () {
              UI.error("impossibile creare il gruppo " + groupData.display_name);
            });
          } else {
            UI.alert(i18n['message.improve.required.fields']);
            return false;
          }
        });
      };
    bulkinfo = new BulkInfo({
      target: content,
      path: (isRoot ? "cm:authorityContainer" : "P:jconon_group_gestori:aspect"),
      name: (isRoot ? "create" : "default"),
      metadata: metadata,
      callback: {
        beforeCreateElement: function (item) {
          if (item.name === 'call_type') {
            var jsonlistCallType = [];
            $.each(cache.jsonlistCallType, function (index, el) {
              jsonlistCallType.push({
                "key" : el.id,
                "label" : i18n[el.id],
                "defaultLabel" : el.title
              });
            });
            item.jsonlist = jsonlistCallType;
          } else if (item.name === 'sede') {
            item.maximumSelectionSize = -1;
          } else if (item.name === 'authorityName' && metadata) {
            item.inputType = 'ROTEXT';
          }
        },
        afterCreateForm: afterRender
      }
    });
    bulkinfo.render();
  }
  Explorer.init({
    dom: {
      explorerItems: $('.explorerItem'), // items to show only in file explorer mode
      tree: $('#collection-tree'),
      breadcrumb: $('.breadcrumb'),
      search: {
        table: $('#items'),
        pagination: $('#itemsPagination'),
        label: $('#emptyResultset')
      },
      buttons: {
        createAssociation: $('#createAssociation')
      }
    },
    tree: {
      rootFn: URL.Data.proxy.rootGroup,
      paramName: 'fullName',
      childrenFn: URL.Data.proxy.childrenGroup,
      childrenFnPlaceholder: {
        zones: "AUTH.EXT.gestori"
      },
      customClass: 'groups'
    },
    search: {
      display: {
        row: function (el) {
          var item = {
            baseTypeId: el.attr.type,
            allowableActions: el.attr.allowableActions,
            nodeRef: el.attr.id,
            name: el.data,
            group: el.group,
            authorityId: el.attr.authorityId
          },
            isUser = el.attr.type === 'USER',
            btn = ActionButton.actionButton(item, null, {
              edit: function () {
                URL.Data.proxy.metadata({
                  data: {
                    "nodeRef" : el.attr.id.split(';')[0],
                    "shortQNames" : true
                  },
                  success: function (metadata) {
                    groupGestoriModal(metadata.properties);
                  }
                });
              },
              select: function () {
                if (el.attr.type === 'GROUP') {
                  Node.displayMetadata('P:jconon_group_gestori:aspect', el.attr.id.split(';')[0], false,
                    function (div) {
                      var tr = $('<tr></tr>'), tdAuthority = $('<td name="tdAuthority"></td>');
                      URL.Data.proxy.members({
                        placeholder: {
                          group_name: el.attr.authorityId
                        },
                        success: function (data) {
                          $.each(data.people, function (index, authority) {
                            $('<a href="#tdAuthority">' + authority + '</a><span> </span>').off('click').on('click', function () {
                              Ace.showMetadata(authority);
                            }).appendTo(tdAuthority);
                          });
                        }
                      });
                      tr.append('<td><strong>Members</strong></td>');
                      tr.append(tdAuthority);
                      div.find('table > tbody').append(tr);
                    });
                } else {
                  Node.displayMetadata('cm:person', el.attr.id.split(';')[0]);
                }
              },
              deleteCache: function () {
                URL.Data.common({
                  type: "DELETE",
                  placeholder: {
                    authortiyName: el.attr.authorityId
                  },
                  success: function (data) {
                    UI.success("Cache cancellata.");
                  }
                });
              }
            }, {deleteCache: 'icon-trash'}, Explorer.refresh),
            td = $('<td></td>'),
            row = $('<tr></tr>'),
            a = $('<a href="#">' + el.attr.displayName + '</a>').click(function () {
              Explorer.folderChange(item);
            });

          td.append('<i class="' + (isUser ? 'icon-user' : 'icon-group icon-blue') + '"></i> ')
            .append(isUser ? el.attr.displayName : a)
            .append('<span class="muted annotation">' + el.attr.shortName + '</span>');

          row
            .append(td)
            .append($('<td></td>').append(btn));

          return row;
        }
      },
      dataSource: function (page, settings) {
        var groupName = settings.lastCriteria.conditions ? settings.lastCriteria.conditions[0].what : null, xhr,
          data = {
            fullName: groupName
          };
        if (groupName === Explorer.getRootFolder()) {
          data = $.extend({zones: "AUTH.EXT.gestori"}, data);
        }
        xhr = URL.Data.proxy.childrenGroup({
          data: data
        });

        return xhr.pipe(function (data) {
          var enhancedData = $.map(data, function (el) {
            el.group = groupName;
            return el;
          });
          return enhancedData;
        });
      }
    }
  });
  $('#create-group-gestori').on('click', function (event) {
    groupGestoriModal();
  });
});