'use strict';

angular.module('flowsApp')
  .controller('WorkflowCtrl', function ($scope, $http, $location, $routeParams, $rootScope) {

    $rootScope.home = false;

    $http({
      method: 'GET',
      url: '/cool-flows/rest/proxy?url=service/api/workflow-instances/' + $routeParams.id + '&includeTasks=true'
    }).success(function (data) {
      $scope.workflow = data.data;
    });


  });
