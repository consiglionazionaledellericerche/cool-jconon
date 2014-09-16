(function () {
  'use strict';

  angular.module('metaInfApp')
    .filter('keySetSize', function () {
      return function (m) {
        return m ? Object.keys(m).length : 0;
      };
    })
    .filter('displayList', function () {
      return function (items) {
        return items.join(', ');
      };
    })
    .filter('hiddenTask', function (cnrService) {
      return function (tasks) {

        return _.filter(tasks, function (task) {
          return !(!task.endTime && task.javaclass == cnrService.historic);
        });

      };
    })
    .filter('humandate', function () {
      return function (date) {
        return moment(new Date(date)).format('DD/MM/YYYY hh:mm');
      };
    });

}());