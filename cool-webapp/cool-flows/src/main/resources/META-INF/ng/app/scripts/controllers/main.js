'use strict';

angular.module('flowsApp')
  .controller('MainCtrl', function ($scope, $http) {

    $http({
      url: '/cool-flows/rest/common',
      method: 'GET'
    }).success(function (data) {

      var username = data.User.id;

      $scope.common = data.User;
      $scope.workflowDefinitions = data.workflowDefinitions;

      $http({
        method: 'GET',
        url: '/cool-flows/rest/proxy?url=service/api/task-instances',
        data: {
          authority: username
        }
      }).success(function (data) {
        $scope.tasks = data.data;

        var tasks = [];
        var pooledTasks = [];

        _.each(data.data, function (el) {
          if (el.isPooled) {
            pooledTasks.push(el);
          } else {
            tasks.push(el);
          }
        });

        $scope.tasks = tasks;
        $scope.pooledTasks = pooledTasks;

      });

      $http({
        url: '/cool-flows/rest/proxy?url=service/api/workflow-instances',
        method: 'GET',
        data: {
          initiator: username,
          state: 'active'
        }
      }).success(function (data) {
        $scope.startedWorkflows = data.data;
      });

    });


  });
