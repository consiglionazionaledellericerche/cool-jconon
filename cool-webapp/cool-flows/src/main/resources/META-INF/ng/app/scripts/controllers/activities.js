'use strict';

angular.module('flowsApp')
  .controller('ActivitiesCtrl', function ($rootScope, dataService, $scope) {

    $rootScope.page = 'activities';

    dataService.proxy.api.taskInstances({
        state: 'COMPLETED'
      })
      .success(function (tasks) {
        $scope.tasks = tasks.data;
      });

  });