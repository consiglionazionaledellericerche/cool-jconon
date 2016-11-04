define(['jquery', 'json!common', 'i18n', 'ws/header.common', 'cnr/cnr.url', 'cnr/cnr.ui', 'moment', 'cnr/cnr', 'noty', 'noty-layout', 'noty-theme'], function ($, common, i18n, headerCommon, URL, UI, moment, CNR) {
  "use strict";

  var langs = {
      it: {
        icon: 'flag-it',
        param: 'it',
        label: 'IT'
      },
      en: {
        icon: 'flag-gb',
        param: 'en',
        label: 'EN'
      }
    },
    lang,
    params = URL.querystring.from,
    daysFromLastNews;

  headerCommon.addMenu($("#manage-call"), common.enableTypeCalls, 'manage-call?call-type=');

  headerCommon.arrangeSubMenus($('.navbar'));

  headerCommon.resizeNavbar(100);

  if (i18n.locale === 'en') {
    lang = langs.it;
  } else {
    // english by default
    lang = langs.en;
  }

  if (common.profile === 'dev') {
    $('#wrap').append('<div class="development"></div>');
  }
  params.lang = lang.param;

  $('.btn-lang')
    .attr('href', '?' + URL.querystring.to(params))
    .append('<i class="flag ' + lang.icon + '"></i> ')
    .append(lang.label);


  URL.Data.frontOffice.document({
    placeholder: {
      'type_document': 'notice'
    },
    data: {
      guest: true,
      groups: common.groupsHash
    }
  }).done(function (data) {

    var noticeMap = CNR.Storage.get('notice', {}),
      notifications = $.map(data.docs, function (notice, index) {
        return {
          tipologia: notice.type,
          titolo: notice.title || notice.name,
          testo: notice.text,
          notification: notice.noticeStyle,
          data: new Date(notice.dataPubblicazione).getTime(),
          node_ref: notice.node_ref
        };
      }).sort(function (a, b) {
        var val;
        if (a.data > b.data) {
          val = -1;
        } else if (a.data < b.data) {
          val = 1;
        } else {
          val = 0;
        }
        return val;
      });

    $.each(notifications, function (index, el) {
      var key = 'id-' + el.node_ref;
      if (el.notification && !noticeMap[key]) {
        window.noty({
          text: "<h5>" + el.titolo + "</h5>" + el.testo,
          timeout: false,
          type: el.notification,
          layout: 'topRight',
          callback: {
            onClose: function () {
              noticeMap[key] = true;
              CNR.Storage.set('notice', noticeMap);
            }
          }
        });
      }
    });

    if (notifications.length > 0) {
      daysFromLastNews = (new Date() - notifications[0].data) / 1000 / 60 / 60 / 24;
    }

    $('#notifications').addClass(daysFromLastNews && daysFromLastNews < 5 ? 'ribbon-new' : '').on('click', function () {

      var table = $('<table class="table table-striped"></table>');
      $.each(notifications, function (index, el) {
        var row = $('<tr></tr>');
        $('<td></td>')
          .append('<span class="muted">Avviso ' + (notifications.length - index) + ' del ' + moment(el.data).format('DD/MM/YYYY') + '</span>')
          .append('<h4>' + el.tipologia + '</h4>')
          .append('<strong>' + el.titolo + '</strong><br/>')
          .append(el.testo)
          .appendTo(row);
        table.append(row);
      });

      UI.modal(i18n.prop('navbar.notice'), $("<div></div>").addClass('modal-inner-fix').append(table));
    }).find('.counter').text(notifications.length);

  });

});