define(['jquery', 'json!common', 'i18n', 'ws/header.common', 'cnr/cnr.url', 'cnr/cnr.ui', 'moment', 'cnr/cnr', 'json!cache', 'noty', 'noty-layout', 'noty-theme'], function ($, common, i18n, headerCommon, URL, UI, moment, CNR, cache) {
  "use strict";

  function addMenu(target, href, array, replace) {
    var ul = target.find("ul");
    $.each(array.sort(function (a, b) {
        return a.description > b.description;
      }), function (index, el) {
        var li = $('<li></li>'),
          a = $('<a>' + i18n.prop(el.id, el.title) + '</a>'),
          id = replace ? el.id.replace(new RegExp(':', 'g'), '_') : el.id;
          if (el.childs == undefined) {
            a.attr('href', href + id);
          } else {
            li.addClass('page dropdown-submenu');
            a.attr('href', '#');
            a.addClass('dropdown-toggle');
          }
        if (el.display) {
          li.append(a).appendTo(ul);
        }
        if (el.childs) {
          var ulChild = $('<ul></ul>').addClass('dropdown-menu').appendTo(li);
          $.each(el.childs.sort(function (a, b) {
            return a.description > b.description;
          }), function (index, elChild) {
            var li = $('<li></li>'),
              a = $('<a>' + i18n.prop(elChild.id, elChild.title) + '</a>'),
              id = replace ? elChild.id.replace(new RegExp(':', 'g'), '_') : elChild.id;
            a.attr('href', href + id);
            li.append(a).appendTo(ulChild);
          });
        }
    });
  }
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

  if (!common.User.isGuest) {
      addMenu($("#modelli"), 'modelli?folder=Modelli/', cache.jsonlistCallType, true);
      $("#modelli").removeClass('hide');
      if (common.enableTypeCalls && common.enableTypeCalls.length > 0) {
        addMenu(
            $("#manage-call"),
            'manage-call?call-type=',
            $.grep(cache.jsonlistCallType, function (el) {
                 if (el.childs) {
                     el.childs = $.grep(el.childs, function (el) {
                         if ($.grep(common.enableTypeCalls, function (elem) {return elem.key == el.id;}).length > 0) {
                             return el;
                         }
                     });
                 }
                 if (el.childs && el.childs.length > 0){
                     return el;
                 } else if ($.grep(common.enableTypeCalls, function (elem) {return elem.key == el.id;}).length > 0) {
                     return el;
                 }
            }), false);
         $("#manage-call").removeClass('hide');
      } else {
         $("#manage-call").addClass('hide');
      }
  }
  headerCommon.arrangeSubMenus($('.navbar'));

  headerCommon.resizeNavbar(100);

  if (i18n.locale === 'en') {
    lang = langs.it;
  } else {
    // english by default
    lang = langs.en;
  }

  if (common.profile.indexOf('dev') !== -1) {
    $('#wrap').append('<div class="development"></div>');
  }
  params.lang = lang.param;

  $('.btn-lang')
    .attr('href', '?' + URL.querystring.to(params))
    .append('<i class="flag ' + lang.icon + '"></i> ')
    .append(lang.label);

  if ($('#notifications').length) {
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
            node_ref: notice.nodeRef
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
        if (el.notification && !noticeMap[key] && el.notification !== 'information') {
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
  }
});