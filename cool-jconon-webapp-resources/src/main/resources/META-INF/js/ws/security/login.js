/*global params*/
define(['jquery', 'i18n', 'header', 'cnr/cnr.ui', 'cnr/cnr.validator', 'cnr/cnr.bulkinfo', 'cnr/cnr.url', 'cookie'],
  function ($, i18n, header, UI, Validator, BulkInfo, URL) {
  "use strict";
  Validator.validate($('.form-signin'), {
    rules: {
      username: {
        required: true,
        minlength: 2
      },
      password: {
        required: true
      }
    }
  });
  if (params.failureMessage) {
    UI.alert(i18n[params.failureMessage]);
  }
  if (params.failure) {
    UI.error(i18n['message.incorrect']);
  }

  function peopleSearch(filter, callback) {
    URL.Data.security.recoverPassword({
      type: 'POST',
      data: {
        email: filter
      },
      success: function (data) {
        return callback(data);
      }
    });
  }

  function forgotPassword(userName) {
      //Mando la mail di verifica
      URL.Data.security.forgotPassword({
        type: 'POST',
        data: {
          userName: userName,
          guest: true
        },
        success: function (data) {
          UI.success(i18n['message.email.send']);
        },
        error: function (xhr) {
          var json = JSON.parse(xhr.responseText);
          UI.alert(i18n[json.error]);
        }
      });
  }
  $('#ssoLogin').click(function () {
    var queryString = $( "input[name*='queryString']" ).val(),
        redirect = $( "input[name*='redirect']" ).val() + (queryString !== undefined ? '?' + queryString : '');
    $.cookie('KC_REDIRECT', redirect);
  });

  $('#passwordRecovery').click(function () {
    var content = $('<div><div>'),
      bulkinfo = new BulkInfo({
        target: content,
        formclass: 'form-inline',
        path: 'accountBulkInfo',
        name: 'forgotPass'
      });
    bulkinfo.render();
    content.prepend("Inserire l'indirizzo e-mail con il quale ci si e' registrati per ricevere il link per modificare la password.");
    UI.modal(i18n['button.change.password'], content, function () {
      var emailtext = content.find('#emailForgotPass');
      if (!bulkinfo.validate()) {
        return false;
      }
      peopleSearch(emailtext.val(), function(people) {
        if (people.userName === "") {
            UI.error(i18n['message.error.email.not.found']);
        } else {
            forgotPassword(people.userName);
        }
      });
    });
  });
/**
** SPID BUTTON INTEGRATION https://github.com/italia/spid-sp-access-button/blob/master/src/production/js/spid-sp-access-button.min.js
**/
  function i(i, n) {
      var d = i ? $(this) : n,
          o = $(d.attr("spid-idp-button")),
          r = d.hasClass("spid-idp-button-open")
      if (i) {
          if ($(i.target).hasClass("spid-idp-button-ignore")) return
          i.preventDefault(), i.stopPropagation()
      } else if (d !== n.target && $(n.target).hasClass("spid-idp-button-ignore")) return
      s(), r || d.hasClass("spid-idp-button-disabled") || (d.addClass("spid-idp-button-open"), o.data("spid-idp-button-trigger", d).show(), e(), o.trigger("show", {
          spidIDPButton: o,
          trigger: d
      }))
  }

  function s(i) {
      var s = i ? $(i.target).parents().addBack() : null
      if (s && s.is(".spid-idp-button")) {
          if (!s.is(".spid-idp-button-menu")) return
          if (!s.is("A")) return
      }
      $(document).find(".spid-idp-button:visible").each(function() {
          var i = $(this)
          i.hide().removeData("spid-idp-button-trigger").trigger("hide", {
              spidIDPButton: i
          })
      }), $(document).find(".spid-idp-button-open").removeClass("spid-idp-button-open")
  }

  function e() {
      var i = $(".spid-idp-button:visible").eq(0),
          s = i.data("spid-idp-button-trigger"),
          e = s ? parseInt(s.attr("data-horizontal-offset") || 0, 10) : null,
          n = s ? parseInt(s.attr("data-vertical-offset") || 0, 10) : null
      0 !== i.length && s && (i.hasClass("spid-idp-button-relative") ? i.css({
          left: i.hasClass("spid-idp-button-anchor-right") ? s.position().left - (i.outerWidth(!0) - s.outerWidth(!0)) - parseInt(s.css("margin-right"), 10) + e : s.position().left + parseInt(s.css("margin-left"), 10) + e,
          top: s.position().top + s.outerHeight(!0) - parseInt(s.css("margin-top"), 10) + n
      }) : i.css({
          left: i.hasClass("spid-idp-button-anchor-right") ? s.offset().left - (i.outerWidth() - s.outerWidth()) + e : s.offset().left + e,
          top: s.offset().top + s.outerHeight() + n
      }))
  }
  $.extend($.fn, {
      spidIDPButton: function(e, n) {
          switch (e) {
              case "show":
                  return i(null, t(this)), t(this)
              case "hide":
                  return s(), t(this)
              case "attach":
                  return t(this).attr("spid-idp-button", n)
              case "detach":
                  return s(), t(this).removeAttr("spid-idp-button")
              case "disable":
                  return t(this).addClass("spid-idp-button-disabled")
              case "enable":
                  return s(), t(this).removeClass("spid-idp-button-disabled")
          }
      }
  }), $(document).on("click.spid-idp-button", "[spid-idp-button]", i), $(document).on("click.spid-idp-button", s), $(window).on("resize", e)
});