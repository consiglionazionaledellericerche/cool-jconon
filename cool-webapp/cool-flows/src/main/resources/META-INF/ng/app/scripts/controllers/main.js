'use strict';

angular.module('flowsApp')
  .controller('MainCtrl', function ($scope, dataService, $rootScope, modalService, $sessionStorage) {

    $rootScope.page = 'main';

    $scope.advanced = false;


    function calcPriorities(tasks) {

      var priorities = {
          low: 0,
          mid: 0,
          high: 0
        };

      _.each(tasks, function (task) {
        // priority
        if (task.properties.bpm_priority === 5) {
          ++priorities.high;
        } else if (task.properties.bpm_priority === 3) {
          ++priorities.mid;
        }

      });

      return {
        high: 100 * priorities.high / tasks.length,
        mid: 100 * priorities.mid / tasks.length,
        low: 100 * (tasks.length - priorities.mid - priorities.high) / tasks.length
      };

    }


    // SUMMARY - tasks status report
    function getSummary (tasks) {

      var expiring = 0,
        expired = 0,
        now = new Date().getTime(),
        oneWeek = 7 * 24 * 60 * 60 * 1000;

      _.each(tasks, function (task) {

        var dueDate = new Date(task.properties.bpm_dueDate).getTime();

        // expired

        if (dueDate < now) {
          ++expired;
        }

        // about to expire
        if (dueDate > now && (dueDate - now) < oneWeek) {
          ++expiring;
        }

      });

      return {
        chart: calcPriorities(tasks),
        total: tasks.length,
        expired: expired,
        expiring: expiring
      };

    }



    var username = $sessionStorage.user.id;

    dataService.proxy.api.taskInstances({authority: username}).success(function (data) {

      var tasks = data.data;

      $scope.tasks = tasks;

      $scope.summary = getSummary(tasks);

    });


    $scope.getLabel = function (values, value) {
      return _.filter(values, function (item) {
        return item.key === value;
      })[0].label;
    };








  });