'use strict';

angular.module('flowsApp')
  .controller('ActivitiesCtrl', function ($rootScope, $http, $scope) {

    $rootScope.page = 'activities';

    $http({
      method: 'GET',
      url: '/cool-flows/rest/proxy' + '?url=service/api/task-instances',
      params: {
        state: 'COMPLETED'
      }
    }).success(function (tasks) {
      $scope.tasks = tasks.data;
    });



  });