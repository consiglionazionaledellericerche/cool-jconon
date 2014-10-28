'use strict';

function date(d) {
  return d ? moment(d).format('DD/MM/YYYY HH:mm') : null;
}

angular.module('flowsApp')
  .filter('date', function () {
    return date;
  })
  .filter('i18n', function (i18nService) {
    return function (label) {
      return i18nService.i18n(label);
    };
  })
  .filter('indent', function () {
    return function (s) {
      return _.map(_.range(s), function () {
        return '-';
      }).join('');
    };
  })
  .filter('dueDate', function () {
    return function (dueDate) {
      var s = null;
      if (dueDate) {
        var expired = new Date(dueDate).getTime() < new Date().getTime();
        var stringDate = moment(dueDate).format('DD/MM/YYYY');
        if (expired) {
          s = '<span class="label label-danger">scaduto il ' + stringDate + '</span>';
        } else {
          s = '<span>con scadenza: ' + stringDate + '</span>';
        }
      }
      return s;
    };
  })
  .filter('priority', function () {
    return function (priority) {
      var m = {
        'priority-3': {
          label: 'importante',
          cssClass: 'label label-primary'
        },
        'priority-5': {
          label: 'critico',
          cssClass: 'label label-danger'
        }
      };

      var p = m['priority-' + priority];

      return p ? '<span class="label ' + p.cssClass + '">' + p.label + '</b>' : '';
    };
  });