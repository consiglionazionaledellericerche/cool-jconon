/*global params*/
define(['jquery', 'header', 'json!common', 'i18n', 'cnr/cnr.bulkinfo', 'cnr/cnr.ui', 'cnr/cnr.validator', 'cnr/cnr.url', 'json!cache'], function ($, header, common, i18n, BulkInfo, UI, Validator, URL, cache) {

  "use strict";
  var bulkinfo, title = $('<legend></legend>').html(i18n['label.page-header.h1']),
    submitButton = $('<button class="btn btn-large btn-primary controls" type="button">' +
      i18n['button.reimposta'] + '</button>').on('click', function () {
      if (bulkinfo.validate()) {
        if (!common.User.guest) {
          URL.Data.proxy.changePassword({
            type : 'POST',
            contentType: 'application/json',
            placeholder: {
              userid: common.User.id
            },
            data: JSON.stringify({
              'oldpw': bulkinfo.getDataValueById('oldpassword'),
              'newpw': bulkinfo.getDataValueById('password')
            }),
            success: function (data) {
              UI.success(i18n['message.reset.password.correct'], function () {
                window.location = cache.baseUrl + '/rest/security/logout';
              });
            }
          });
        } else {
          URL.Data.account.changePassword({
            type: 'POST',
            data: bulkinfo.getData(),
            success: function (data) {
              if (data.error) {
                UI.error(i18n[data.error]);
              } else {
                UI.success(i18n['message.reset.password.correct'], function () {
                  window.location = cache.baseUrl + '/login';
                });
              }
            }
          });
        }
      }
    });
  if (!common.User.guest) {
    bulkinfo = new BulkInfo({
      target: $('#change-pwd'),
      formclass: 'form-signin',
      path: "accountBulkInfo",
      name: "changePassword",
      callback: {
        afterCreateForm: function (form) {
          form.prepend(title);
          form.append(submitButton);
          URL.Data.proxy.people({
            contentType: 'application/json',
            placeholder: {
              user_id: common.User.id,
              groups: true
            },
            success: function (data) {
              if (data.immutability['{http://www.alfresco.org/model/content/1.0}firstName'] === true) {
                form.find('input,button').attr('readonly', true).attr('disabled', true);
                UI.alert(i18n['message.warning.cnr.user']);
              }
              if (data.application) {
                form.find('input,button').attr('readonly', true).attr('disabled', true);
                UI.alert(i18n.prop('message.error.user.application', data.application));
              }
            }
          });

        }
      }
    });
    bulkinfo.render();
  } else {
    bulkinfo = new BulkInfo({
      target: $('#change-pwd'),
      formclass: 'form-signin',
      path: "accountBulkInfo",
      name: "forgotPassword",
      callback: {
        afterCreateForm: function (form) {
          form.prepend(title);
          form.append(submitButton);
        }
      }
    });
    bulkinfo.render();
    bulkinfo.addFormItem('userid', params.userid);
    bulkinfo.addFormItem('pin', params.pin);
  }
});