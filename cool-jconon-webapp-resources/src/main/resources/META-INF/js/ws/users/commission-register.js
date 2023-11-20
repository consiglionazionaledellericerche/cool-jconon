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
        q: 'select * from jconon_albo_commissione:person where IN_FOLDER(\'' + cache['commission-register'].id + '\')' +
            ' and cmis:name = \'' + common.User.userName + '\''
      }
    }).success(function(data) {
        settings.metadata = {};
        if (data.totalNumItems > 0) {
            settings.metadata = data.items[0];
        }
        settings.metadata.firstName = common.User.firstName;
        settings.metadata.lastName = common.User.lastName;
        bulkinfo = new BulkInfo(settings);
        bulkinfo.render();
    });
    function confermaDati() {
        if (bulkinfo.validate()) {
          var close = UI.progress(),
          d = $.grep(bulkinfo.getData(), function(e){
               return e.name != 'cmis:objectTypeId';
          });
          d.push({id: 'inheritedPermission',name: 'inheritedPermission',value: false});
          d.push({id: 'cmis:parentId',name: 'cmis:parentId',value: cache['commission-register'].id});
          d.push({id: 'cmis:name',name: 'cmis:name',value: common.User.userName});
          d.push({id: 'cmis:objectTypeId',name: 'cmis:objectTypeId',value: 'cmis:document'});
          d.push({id: 'aspect',name: 'aspect',value: 'P:jconon_albo_commissione:person'});
          Node.updateMetadata(d, function (data) {
              close();
              UI.success(i18n['message.operation.performed']);
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