define(['jquery', 'json!common', 'i18n', 'ws/header.common', 'cnr/cnr.url', 'cnr/cnr.ui', 'moment', 'cnr/cnr', 'json!cache', 'noty', 'noty-layout', 'noty-theme'], function ($, common, i18n, headerCommon, URL, UI, moment, CNR, cache) {
  "use strict";

  function addMenu(target, href, array, replace, canAddFunction) {
    var ul = target.find("ul");
    $.each(array.sort(function (a, b) {
        return a.description > b.description;
      }), function (index, el) {
        var li = $('<li></li>'),
          a = $('<a>' + i18n.prop(el.id, el.title) + '</a>'),
          id = replace ? el.id.replace(new RegExp(':', 'g'), '_') : el.id;
          if (el.childs == undefined) {
            if (el.absolute) {
                a.attr('href', id);
            } else {
                a.attr('href', href + id);
            }
          } else {
            li.addClass('page dropdown-submenu');
            a.attr('href', '#');
            a.addClass('dropdown-toggle');
          }
          if (el.disabled) {
            li.addClass("disabled");
            a.attr('href', '#');
          }
        if (el.display) {
          if (canAddFunction !== undefined) {
            if (canAddFunction(el)) {
                li.append(a).appendTo(ul);
            }
          } else {
              li.append(a).appendTo(ul);
          }
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
            if (canAddFunction !== undefined) {
              if (canAddFunction(elChild)) {
                li.append(a).appendTo(ulChild);
              }
            } else {
                li.append(a).appendTo(ulChild);
            }
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
      if ($("#modelli").length) {
          addMenu($("#modelli"), 'modelli?folder=Modelli/', cache.jsonlistCallType, true);
          $("#modelli").removeClass('hide');
      }
      if (common.manageRoleURL) {
        $('#manage-role-url').toggle();
        $('#manage-role-url > a').attr('href', common.manageRoleURL);
      }
      if (common.enableTypeCalls && common.enableTypeCalls.length > 0) {
        addMenu(
            $("#manage-call"),
            'manage-call?call-type=',
            cache.jsonlistCallType,
            false,
            function (el) {
                var childs;
                if (el.childs) {
                     childs = $.grep(el.childs, function (el) {
                         if ($.grep(common.enableTypeCalls, function (elem) {return elem.key == el.id;}).length > 0) {
                             return el;
                         }
                     });
                 }
                 if (childs && childs.length > 0){
                     return true;
                 } else if ($.grep(common.enableTypeCalls, function (elem) {return elem.key == el.id;}).length > 0) {
                     return true;
                 }
                 return false;
            });
         $("#manage-call").removeClass('hide');
      } else {
         $("#manage-call").addClass('hide');
      }
      if (common.commissionCalls && common.commissionCalls.length > 0) {
        addMenu($("#commissions"), 'call-detail?callId=', common.commissionCalls, true);
        $("#commissions").removeClass('hide');
      } else {
        $("#commissions").addClass('hide');
      }
  }
  if (common.isSSOCNR) {
    var targetElement = document.querySelector('#applist'), iframe = document.createElement('iframe');
    var placement = 'right';
    if (window.innerWidth < 655) {
        placement = 'left';
    }
    targetElement.style.display = 'inline-block';
    iframe.setAttribute('src', 'https://apps.cnr.it/#/applist');
    iframe.setAttribute('data-cnr-sso-menu-type', 'apps');
    iframe.style.borderRadius = '4px';
    iframe.style.position = 'absolute';
    var bcr = targetElement.getBoundingClientRect();
    iframe.style.top = "" + (bcr.height + 'px');
    if (placement === 'right') {
        iframe.style.right = '0';
    } else {
        iframe.style.left = '0';
    }
    iframe.style['z-index'] = '100';
    iframe.style.width = 'calc(3 * 96px + 16px + 16px)';
    iframe.style.height = '438px';
    iframe.style.border = 'none';
    iframe.style.display = 'none';
    targetElement.style.position = 'relative';
    targetElement.onclick = function(e) {
        e.stopPropagation();
        document.querySelectorAll('[data-cnr-sso-menu-type]').forEach(function(item) {
            return item.style.display = 'none';
        });
        iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
        return false;
    };
    document.querySelector('body').addEventListener('click', function(ev) {
        return iframe.style.display = 'none';
    });
    targetElement.appendChild(iframe);
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