'use strict';

function date(d) {
  return d ? moment(d).format('DD/MM/YYYY hh:mm') : null;
}

angular.module('flowsApp')
  .filter('date', function () {
    return date;
  })
  .filter('dueDate', function () {
    return function (dueDate) {
      var s = null;
      if (dueDate) {
        var expired = new Date(dueDate).getTime() < new Date().getTime();
        if (expired) {
          s = '<span class="label label-danger">scaduto il ' + date(dueDate) + '</span>';
        } else {
          s = '<span>con scadenza: ' + date(dueDate) + '</span>';
        }
      }
      return s;
    };
  })
  .filter('priority', function () {
    return function (priority) {
      var m = {
        'priority-1': {
          label: 'bassa',
          cssClass: 'label-default'
        },
        'priority-3': {
          label: 'importante',
          cssClass: 'label-warning'
        },
        'priority-5': {
          label: 'critico',
          cssClass: 'label label-danger'
        }
      };

      var p = m['priority-' + priority];

      return '<span class="label ' + p.cssClass + '">' + p.label + '</b>';
    };
  });