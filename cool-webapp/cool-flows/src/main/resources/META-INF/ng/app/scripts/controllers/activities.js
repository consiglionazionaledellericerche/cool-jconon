'use strict';

angular.module('flowsApp')
  .controller('ActivitiesCtrl', function ($rootScope, dataService, $scope) {

    $rootScope.page = 'activities';

    dataService.proxy.api.taskInstances({
        state: 'COMPLETED'
      })
      .success(function (tasks) {

        var filteredTasks = tasks.data;

        $scope.tasks = _.groupBy(filteredTasks, function (el) {
          return el.workflowInstance.title;
        });

      });

  });