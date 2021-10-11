/*global params*/
define(['jquery', 'header', 'json!common', 'i18n', 'cnr/cnr.bulkinfo', 'cnr/cnr.ui', 'cnr/cnr.validator', 'cnr/cnr.url', 'json!cache'], function ($, header, common, i18n, BulkInfo, UI, Validator, URL, cache) {

  "use strict";
  var bulkinfo, title = $('<legend></legend>').html(i18n['label.page-header.h1']),
    submitButton = $('<button class="btn btn-large btn-primary controls w-100" type="button">' +
      i18n['button.reimposta'] + '</button>').on('click', function () {
      if (bulkinfo.validate()) {
          URL.Data.account.createAccount({
            type : 'PUT',
            data: {
              'email': bulkinfo.getDataValueById('email'),
              'userName': common.User.id
            },
            success: function (data) {
              UI.success(i18n['message.email.success'], function () {
                window.location = cache.baseUrl + '/';
              });
            }
          });
      }
    });
    bulkinfo = new BulkInfo({
      target: $('#change-user-email'),
      formclass: 'form-signin',
      path: "accountBulkInfo",
      name: "changeEmail",
      callback: {
        afterCreateForm: function (form) {
          form.prepend(title);
          form.append(submitButton);
        }
      }
    });
    bulkinfo.render();
});