
(function () {
  'use strict';

  function midnight(date) {
    var m = moment(date);
    return moment([m.year(), m.month(), m.date()]).unix() * 1000;
  }

  /**
   * @ngdoc function
   * @name metaInfApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the metaInfApp
   */
  angular.module('metaInfApp')
    .controller('MainCtrl', function ($scope, $http, cnrService) {
      var all;
      $scope.filters = {};

      $http.get('/cool-doccnr/rest/proxy?url=service/workflow/dashboard')
        .success(function (data) {
          all = data;
          applyFilters();
        });

      function applyFilters() {

        var m = {};
        _.each(all, function (workflow, key) {

          var included = true;

          _.each($scope.filters, function (value, key) {
            if (key === 'group') {
              included = included && workflow.groups.indexOf(value) >= 0;
            } else if (key === 'user') {
              included = included && workflow.users.indexOf(value) >= 0;
            } else if (key === 'definition') {
              included = included && workflow.workflow.definition.title === value;
            }
          });

          if (included) {
            m[key] = workflow;
          }
        });

        // charts
        var dueDates = _.map(m, function (x) {
          return midnight(x.workflow.dueDate);
        });
        var created  =_.map(m, function (x) {
          return midnight(x.startTask['{http://www.alfresco.org/model/content/1.0}created']);
        });

        $scope.dueDate = dueDates;
        $scope.created = created;

        var wfCompleted = _.groupBy(m, function (wf, key) {
          return isCompleted(key, wf.tasks);
        });

        var durate = _.map(wfCompleted[true], function (el) {
          var tasks = el.tasks;
          var a = tasks[tasks.length -1].endTime;
          var b = tasks[0].startTime;
          var diff = new Date(a).getTime() - new Date(b).getTime();
          var duration = diff / 1000 / 60 / 60;
          console.log("ore trascorse: ", duration);
          return duration;
        });

        $scope.throughput = {
          mean: ss.mean(durate),
          std: ss.standard_deviation(durate)
        };

        $scope.completed = {
          true: wfCompleted[true].length,
          false: wfCompleted[false].length
        };

        $scope.workflows = m;
      }


      $scope.filter = function (field, value) {
        $scope.filters[field] = value;
        applyFilters();

      };

      $scope.clear = function (key) {
        delete $scope.filters[key];
        applyFilters();
      };

      function isCompleted(key, tasks) {
        //TODO: memoize key
        var l = _.filter(tasks, function (task) {
          return task.javaclass != cnrService.historic;
        });
        return l.length === 0;
      }

      $scope.isCompleted = isCompleted;

    });

}());