define(['jquery', 'header', 'json!common', 'i18n', 'cnr/cnr.ui', 'cnr/cnr.url', 'cnr/cnr.user'], function ($, header, common, i18n, UI, URL, User) {
  "use strict";

  var content = $("<div></div>").appendTo("#account"),
    bulkinfo;

  function manageNazionalita(id) {
    if (id === 'italy' || id === undefined) {
      $("#foreign").fadeOut(0);
      $("#italy").fadeIn(0);
    } else {
      $("#foreign").fadeIn(0);
      $("#italy").fadeOut(0);
    }
  }

  function manageClickNazionalita() {
    $("#nazionalita > button.btn").on("click", function () {
      var id = $(this).attr('data-id'), value = $(this).attr('data-value');
      if (value) {
        manageNazionalita(id);
      }
    });
  }

  function managePostCallback(data) {
    if (data.error) {
      UI.error(i18n[data.error]);
    } else {
      if (common.User.isGuest) {
        content.find('input,button').attr('readonly', true).attr('disabled', true);
        UI.success(i18n['message.email.send']);
      } else {
        UI.success(i18n['message.account.saved']);
      }
    }
  }

  function afterCommon(form, bulkinfo) {
    manageClickNazionalita();
    manageNazionalita($("#nazionalita > button.btn.active").attr('data-id'));

    $('<button class="btn btn-large btn-primary controls" type="submit"></button>')
      .text(common.User.isGuest ? i18n['button.create'] : i18n['button.edit'])
      .appendTo(form);

    var queryType = common.User.isGuest ? 'POST' : 'PUT';

    form.submit(function (ev) {
      ev.preventDefault();
      User.salvaAccount(bulkinfo, queryType, managePostCallback);
    });
    $('#email,#confirmEmail,#password,#confirmPassword').bind("cut copy paste",function(e) {
      e.preventDefault();
    });
  }

  function afterCreateFormGuest(form) {
    afterCommon(form, bulkinfo);
  }

  if (common.User.isGuest) {
    bulkinfo = User.renderBulkInfo(false, afterCreateFormGuest, content);
  } else {
    URL.Data.proxy.people({
      contentType: 'application/json',
      placeholder: {
        user_id: common.User.id,
        groups: true
      },
      success: function (userData) {
        function afterCreateForm(form) {
          afterCommon(form, bulkinfo);          
          if (userData.immutability['{http://www.alfresco.org/model/content/1.0}firstName'] === true) {
            content.find('input,button').attr('readonly', true).attr('disabled', true);
            if (userData.email === 'nomail') {
              $('#email').val(userData.emailesterno || userData.emailcertificatoperpuk);
            }
            UI.alert(i18n['message.error.cnr.user']);
          }
        }
        bulkinfo = User.renderBulkInfo(userData, afterCreateForm, content);
      }
    });
  }
});