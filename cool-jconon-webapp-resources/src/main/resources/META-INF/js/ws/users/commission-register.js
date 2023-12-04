require(['jquery', 'header', 'cnr/cnr', 'cnr/cnr.url', 'cnr/cnr.ui', 'json!cache', 'i18n',
        'cnr/cnr.ui.select', 'cnr/cnr.application', 'cnr/cnr.jconon', 'cnr/cnr.call', 'json!common', 'cnr/cnr.bulkinfo',
        'cnr/cnr.ace', 'cnr/cnr.node'],
    function ($, header, CNR, URL, UI, cache, i18n, select, Application, jconon, Call, common, BulkInfo, Ace, Node) {
  "use strict";

    var btnSend = $('<span class="control-group"><button id="send" name="send" class="btn btn-primary btn-large">' + i18n['message.confirm'] +
          ' <i class="ui-button-icon-secondary ui-icon icon-save" ></i></button></span>').off('click').on('click', function () {
            confermaDati();
      }),
      buttonGroup = $('<div class="btn-group">').append(btnSend),
      objectId,
      fileName,
      bulkinfo,
      settings = {
        target: $('#field'),
        formclass: 'form-horizontal jconon',
        name: 'default,universita,altriepr,cnr',
        path: "P:jconon_albo_commissione:person",
        callback: {
          afterCreateForm: function (form) {
            if (typeof afterCreateFormFn === 'function') {
              afterCreateFormFn(form);
            }
            $('#fl_autorizzazione, #tipo_amministrazione').parents('.widget').bind('changeData', function (event, key, value) {
              if (key === 'value') {
                manageSection();
              }
            });
            manageSection();
             $('<div class="text-right">')
                .append('<hr>')
                .append(buttonGroup)
                .appendTo($('#field'));
          },
          afterCreateSection: function (section) {
                var div = section.find(':first-child');
                div.addClass('well').append('<h2>' + i18n['label.section.commission.title.' + section.attr('id')] + '</h2><hr></hr>');
          }
        }
      };
    URL.Data.search.query({
      queue: true,
      data: {
        maxItems:1,
        includeAllowableActions: false,
        fetchCmisObject: true,
        q: 'select * from jconon_albo_commissione:person where IN_FOLDER(\'' + cache['commission-register'].id + '\')' +
            ' and cmis:name = \'' + common.User.userName + '\''
      }
    }).success(function(data) {
        settings.metadata = {};
        if (data.totalNumItems > 0) {
            settings.metadata = data.items[0];
            objectId = data.items[0]['cmis:objectId'];
            fileName = data.items[0]['cm:title'];
        }
        settings.metadata.firstName = common.User.firstName;
        settings.metadata.lastName = common.User.lastName;
        bulkinfo = new BulkInfo(settings);
        bulkinfo.render().complete(function () {
            if (objectId) {
                addOpenFile(objectId, fileName);
            }
        });
    });
    function addOpenFile(id, name) {
        $('#name-file_allegato').val(name);
        $('#open-file').remove();
        $('#name-file_allegato').parent().append(
            $('<a class="btn btn-success" id="open-file" href="' + URL.urls.search.content + '?nodeRef=' + id + '&fileName='+ name +'"' +
                '><i class="ui-button-icon-secondary ui-icon icon-download-alt">' +
                '</i> Scarica</a>')
        );
    }
    function confermaDati() {
        if (bulkinfo.validate()) {
          var close = UI.progress(),
          d = $.grep(bulkinfo.getData(), function(e){
               return e.name != 'cmis:objectTypeId' && e.name != 'cmis:objectId';
          }), file = $('#file_allegato')[0].files[0];
          if (!objectId && !file) {
            UI.alert('Il Curriculum è obbligatorio!');
            close();
            return;
          }
          if (objectId) {
            d.push({id: 'cmis:objectId',name: 'cmis:objectId',value: objectId});
          }
          d.push({id: 'inheritedPermission',name: 'inheritedPermission',value: false});
          d.push({id: 'cmis:parentId',name: 'cmis:parentId',value: cache['commission-register'].id});
          d.push({id: 'cmis:name',name: 'cmis:name',value: common.User.userName});
          d.push({id: 'cmis:objectTypeId',name: 'cmis:objectTypeId',value: 'cmis:document'});
          d.push({id: 'aspect',name: 'aspect',value: 'P:jconon_albo_commissione:person'});
          d.push({id: 'aspect',name: 'aspect',value: 'P:cm:titled'});
          if (file) {
            d.push({id: 'cm:title',name: 'cm:title',value: file.name});
          }
          Node.updateMetadata(d, function (data) {
              if (file) {
                  var fd = new CNR.FormData(),
                        token = $("meta[name='_csrf']").attr("content"),
                        header = $("meta[name='_csrf_header']").attr("content");
                    fd.data.append("cmis:objectId", data['cmis:objectId']);
                    fd.data.append("cmis:objectTypeId", data['cmis:objectTypeId']);
                    fd.data.append("crudStatus", "UPDATE");
                    fd.data.append("file-0", file);
                  URL.Data.node.node({
                    data: fd.getData(),
                    contentType: fd.contentType,
                    processData: false,
                    type: "POST",
                    placeholder : {
                      maxUploadSize : true,
                      'cmis:objectId': data['cmis:objectId']
                    },
                    success: function (data) {
                        objectId = Object.keys(data.attachments)[0];
                        addOpenFile(objectId, file.name);
                    }
                  });
              }
              close();
              UI.success(i18n['message.performed.commission.register']);
              URL.Data.proxy.permissions({
                type: 'POST',
                contentType: 'application/json',
                placeholder: {
                  node: data['alfcmis:nodeRef'].replace('://', '/').split(';')[0]
                },
                data: JSON.stringify({
                  permissions: [{
                    role: 'Coordinator',
                    authority: 'GROUP_ALBO_COMMISSIONI'
                  }]
                })
              });
          });
        }
    }

    function manageSection() {
        var autorizzazione = $("#fl_autorizzazione").parents('.widget').data('value'),
            tipo_amministrazione = $("#tipo_amministrazione").attr('value');
        $('#universita,#altriepr,#cnr').hide();
        if (autorizzazione) {
            if (tipo_amministrazione == 'Università') {
                $('#universita').show();
            } else if (tipo_amministrazione == 'Altri EPR') {
                $('#altriepr').show();
            } else if (tipo_amministrazione == 'CNR') {
                $('#cnr').show();
            }
        }
    }
});